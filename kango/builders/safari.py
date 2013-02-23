# -*- coding: UTF-8

import plistlib
import codecs
import kango
from kango.builders import ExtensionBuilderBase
from kango.utils import *

class ExtensionBuilder(ExtensionBuilderBase):
	key = 'safari'
	package_extension = '.safariextz'

	_config_filename = 'Info.plist'
	_background_host_filename = 'background.html'
	_info = None
	_transform_table = {
		'CFBundleIdentifier': 'id',
		'CFBundleDisplayName': 'name',
		'Description': 'description',
		'CFBundleShortVersionString': 'version',
		'Author': 'creator',
		'CFBundleVersion': 'version',
		'Update Manifest URL': 'update_url',
		'Website': 'homepage_url'
	}

	def __init__(self, info, kango_path):
		self._info = info
		self._kango_path = kango_path

	def _patch_plist(self, path):
		plist = plistlib.readPlist(path)
		for key in self._transform_table:
			if key in plist and hasattr(self._info, self._transform_table[key]):
				plist[key] = getattr(self._info, self._transform_table[key])

		if self._info.browser_button is not None:
			item = plist['Chrome']['Toolbar Items'][0]
			item['Label'] = self._info.name
			item['Tool Tip'] = self._info.name
			item['Image'] = self._info.browser_button['icon']
		else:
			del plist['Chrome']['Toolbar Items']

		if not self._info.content_scripts:
			del plist['Content']

		plistlib.writePlist(plist, path)


	def _copy_icon(self, out_path):
		src = os.path.join(out_path, 'icons', 'icon100.png')
		dst = os.path.join(out_path, 'icon.png')
		try:
			shutil.copy(src, dst)
		except:
			kango.log('Can\'t find icon100.png')

	def _merge_api_script(self, out_path):
		self.merge_files(os.path.join(out_path, 'kango-ui', 'kango_api.js'),
							 (	os.path.join(out_path, 'includes', 'content_kango.js'),
								os.path.join(out_path, 'kango', 'invoke_async_module.js'),
								os.path.join(out_path, 'kango', 'message_target_module.js'),
								os.path.join(out_path, 'kango-ui', 'kango_api.js'),
							 )
						)

	def build(self, out_path):
		self._patch_plist(os.path.join(out_path, self._config_filename))
		self._copy_icon(out_path)
		self.patch_background_host(os.path.join(out_path, self._background_host_filename), self._info.modules)

		self._merge_api_script(out_path)

		subfolder_name = self.get_package_name(self._info) + '.safariextension'
		out = os.path.join(out_path, subfolder_name)
		move_dir_contents(out_path, out, shutil.ignore_patterns(subfolder_name))
		return out

	def pack(self, dst, src, src_path):
		pass

	def setup_update(self, out_path):
		if self._info.update_url != '' or self._info.update_path_url != '':
			update_xml_filename = 'update_safari.plist'
			xml_path = os.path.join(self._kango_path, 'src', 'xml', update_xml_filename)

			plist = plistlib.readPlist(xml_path)
			update = plist['Extension Updates'][0]

			update['CFBundleIdentifier'] = self._info.id
			if self._info.developer_id != '':
				update['Developer Identifier'] = self._info.developer_id
			

			update['CFBundleVersion'] = self._info.version
			update['CFBundleShortVersionString'] = self._info.version
			update['URL'] = self._info.update_path_url + self.get_full_package_name(self._info)

			plistlib.writePlist(plist, os.path.join(out_path, update_xml_filename))

			self._info.update_url = self._info.update_url if self._info.update_url != '' else self._info.update_path_url + update_xml_filename

	def migrate(self, src_path):
		pass