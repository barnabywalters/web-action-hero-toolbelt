# -*- coding: UTF-8

import codecs
import re
import xml.dom.minidom
from kango.builders import ExtensionBuilderBase
from kango.utils import *

class ExtensionBuilder(ExtensionBuilderBase):
	key = 'firefox'
	package_extension = '.xpi'

	_info = None
	_kango_path = None
	_transform_table = {
		'em:id': 'id',
		'em:name': 'name',
		'em:description': 'description',
		'em:version': 'version',
		'em:creator': 'creator',
		'em:homepageURL': 'homepage_url',
		'em:updateURL': 'update_url'
	}

	def __init__(self, info, kango_path):
		self._info = info
		self._kango_path = kango_path

	def _patch_install_manifest(self, manifest_path):
		doc = xml.dom.minidom.parse(manifest_path)
		rdf = doc.getElementsByTagName('RDF')[0]
		description = rdf.getElementsByTagName('Description')[0]

		for key in self._transform_table:
			elem = description.getElementsByTagName(key)[0]
			info_val = getattr(self._info, self._transform_table[key], '')
			if info_val != '':
				elem.childNodes[0].data = info_val
			else:
				description.removeChild(elem)

		if self._info.options_page is None:
			description.removeChild(description.getElementsByTagName('em:optionsURL')[0])
			description.removeChild(description.getElementsByTagName('em:optionsType')[0])

		with codecs.open(manifest_path, 'w', 'utf-8') as f:
			f.write(doc.toxml())

	def _patch_chrome_manifest(self, path):
		if self._info.components is not None:
			component = self._info.components[0]
			with open(path, 'a') as f:
				f.write('\ncomponent ' + component['class_id'] + ' ' + component['filename'])
				f.write('\ncontract ' + component['contract_id'] + ' ' + component['class_id'])
				f.write('\ncategory profile-after-change ' + component['name'] + ' ' + component['contract_id'])

	def _patch_config(self, path):

		with codecs.open(path, 'r+', 'utf-8-sig') as f:
			content = f.read()

			prefix = self.get_prefix_from_name(self._info.name)

			if self._info.browser_button is None:
				content = re.sub('<!-- UI_BROWSER_BUTTON_START -->(.*)<!-- UI_BROWSER_BUTTON_END -->', '', content,
								 flags=re.IGNORECASE | re.DOTALL)
			else:
				content = content.replace('icons/button.png', self._info.browser_button['icon'])

			if self._info.toolbar is None:
				content = re.sub('<!-- UI_TOOLBAR_START -->(.*)<!-- UI_TOOLBAR_END -->', '', content,
								 flags=re.IGNORECASE | re.DOTALL)
			else:
				content = content.replace('toolbarname="Kango"', 'toolbarname="' + self._info.name + '"')

			content = content.replace('chrome://kango', 'chrome://' + prefix + '_kango')

			content = re.sub('id="kango', 'id="' + prefix + '_kango', content, flags=re.IGNORECASE)

			content = self.insert_modules(content, self._info.modules)

			f.truncate(0)
			f.seek(0)
			f.write(content)

	def _is_component(self, path):
		if self._info.components is not None and os.path.normpath(path).endswith(os.path.normpath(self._info.components[0]['filename'])):
			return True
		return False

	def _patch_file(self, path):
		encoding = 'utf-8-sig'
		extension = os.path.splitext(path)[1]
		if extension == '.manifest' or self._is_component(path):
			encoding = 'utf-8'
		with codecs.open(path, 'r+', encoding) as f:
			content = f.read()
			name = self.get_prefix_from_name(self._info.name)

			content = re.sub("(?<!'|\"|\.)kango(?!-|Extensions)", name + '_kango', content, flags=re.IGNORECASE)
			content = re.sub("(?<='|\")kango-ui", name + '_kango-ui', content)
			content = re.sub("kango-background-script-host", name + '_kango-background-script-host', content)

			old_name = filter(lambda x: x.isalpha(), self._info.name)
			content = re.sub('kango-old', old_name + '_kango', content)

			f.truncate(0)
			f.seek(0)
			f.write(content)

	def _patch_sources(self, out_path):
		for root, dirs, files in os.walk(out_path):
			for name in files:
				path = os.path.join(root, name)
				extension = os.path.splitext(name)[1]
				if extension == '.js' and (self.is_framework_file(path) or self.is_module_script(self._info, path) or self._is_component(path)):
					self._patch_file(path)

	def _encode_components(self, src):
		components_path = os.path.join(src, 'components')
		if os.path.isdir(components_path):
			files = os.listdir(components_path)
			for filename in files:
				extension = os.path.splitext(filename)[1]
				if extension == '.js':
					path = os.path.join(components_path, filename)
					f = codecs.open(path, 'r', 'utf-8-sig')
					content = f.read()
					f.close()

					f = codecs.open(path, 'w', 'ascii')
					f.write(content)
					f.close()

	def build(self, out_path):
		install_manifest_path = os.path.join(out_path, 'install.rdf')
		self._patch_install_manifest(install_manifest_path)
		self._patch_file(install_manifest_path)

		chrome_manifest_path = os.path.join(out_path, 'chrome.manifest')
		self._patch_chrome_manifest(chrome_manifest_path)
		self._patch_file(chrome_manifest_path)

		config_path = os.path.join(out_path, 'content.xul')
		self._patch_config(config_path)

		# patch framework files: kango, kango-ui, includes, but kango-popup.js
		# patch modules
		# patch components
		self._patch_sources(out_path)

		out = os.path.join(out_path, 'chrome', 'content')
		if not os.path.exists(out):
			os.makedirs(out)

		move_dir_contents(out_path, out, shutil.ignore_patterns('chrome', 'chrome.manifest', 'install.rdf', 'components'))

		return out

	def pack(self, dst, src, src_path):
		name = self.get_full_package_name(self._info)
		zip = ZipDirectoryArchiver()
		outpath = os.path.join(dst, name)
		src = os.path.join(src, os.pardir, os.pardir)
		self._encode_components(src)
		zip.archive(src, outpath)

	def setup_update(self, out_path):
		if self._info.update_url != '' or self._info.update_path_url != '':
			update_xml_filename = 'update_firefox.xml'
			xml_path = os.path.join(self._kango_path, 'src', 'xml', update_xml_filename)

			with codecs.open(xml_path, 'r', 'utf-8') as f:
				content = f.read()

			content = content.replace('%version%', self._info.version)
			content = content.replace('%url%', self._info.update_path_url + self.get_full_package_name(self._info))
			content = content.replace('%id%', self._info.id)

			with codecs.open(os.path.join(out_path, update_xml_filename), 'w', 'utf-8') as f:
				f.write(content)

			self._info.update_url = self._info.update_url if self._info.update_url != '' else self._info.update_path_url + update_xml_filename

	def migrate(self, src_path):
		pass