# -*- coding: UTF-8

import codecs
import xml.dom.minidom
from kango.builders import ExtensionBuilderBase
from kango.utils import *

class ExtensionBuilder(ExtensionBuilderBase):
	key = 'opera'
	package_extension = '.oex'

	_config_filename = 'config.xml'
	_background_host_filename = 'background.html'
	_info = None
	_transform_table = {
		'id': {'tag': 'widget', 'param': 'id'},
		'name': {'tag': 'name'},
		'description': {'tag': 'description'},
		'version': {'tag': 'widget', 'param': 'version'},
		'creator': {'tag': 'author'},
		'homepage_url': {'tag': 'author', 'param': 'href'},
		'update_url': {'tag': 'update-description', 'param': 'href'}
	}

	def __init__(self, info, kango_path):
		self._info = info
		self._kango_path = kango_path

	def _patch_config(self, path):
		doc = xml.dom.minidom.parse(path)
		for key in self._transform_table:
			xmlElem = doc.getElementsByTagName(self._transform_table[key]['tag'])[0]
			if xmlElem is not None and hasattr(self._info, key):
				if 'param' in self._transform_table[key]:
					xmlElem.setAttribute(self._transform_table[key]['param'], getattr(self._info, key))
				else:
					xmlElem.childNodes[0].data = getattr(self._info, key)
		with codecs.open(path, 'w', 'utf-8') as f:
			f.write(doc.toxml())

	def _merge_includes(self, out_path):
		self.merge_files(os.path.join(out_path, 'includes', 'content.js'),
							 (	os.path.join(out_path, 'includes', 'content_kango.js'),
								  os.path.join(out_path, 'kango', 'invoke_async_module.js'),
								  os.path.join(out_path, 'kango', 'message_target_module.js'),
								  os.path.join(out_path, 'kango', 'userscript_client.js'),
								  os.path.join(out_path, 'includes', 'content_init.js')
							 )
						 )
		os.remove(os.path.join(out_path, 'includes/content_kango.js'))
		os.remove(os.path.join(out_path, 'includes/content_init.js'))

	def build(self, out_path):
		self._patch_config(os.path.join(out_path, self._config_filename))
		self.patch_background_host(os.path.join(out_path, self._background_host_filename), self._info.modules)
		self._merge_includes(out_path)
		return out_path

	def pack(self, dst, src, src_path):
		name = self.get_full_package_name(self._info)
		zip = ZipDirectoryArchiver()
		outpath = os.path.join(dst, name)
		zip.archive(src, outpath)

	def setup_update(self, out_path):
		if self._info.update_url != '' or self._info.update_path_url != '':
			update_xml_filename = 'update_opera.xml'
			xml_path = os.path.join(self._kango_path, 'src', 'xml', update_xml_filename)

			doc = xml.dom.minidom.parse(xml_path)
			info = doc.getElementsByTagName('update-info')[0]
			info.setAttribute('src', self._info.update_path_url + self.get_full_package_name(self._info))
			info.setAttribute('version', self._info.version)

			with codecs.open(os.path.join(out_path, update_xml_filename), 'w', 'utf-8') as f:
				doc.writexml(f, encoding='utf-8')

			self._info.update_url = self._info.update_url if self._info.update_url != '' else self._info.update_path_url + update_xml_filename

	def migrate(self, src_path):
		pass