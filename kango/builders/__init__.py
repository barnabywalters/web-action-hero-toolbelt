# -*- coding: UTF-8

import os
import codecs
from abc import ABCMeta, abstractmethod

class ExtensionBuilderBase(object):
	__metaclass__ = ABCMeta

	key = ''
	package_extension = ''

	@abstractmethod
	def build(self, out_path):
		pass

	@abstractmethod
	def pack(self, dst, src, src_path):
		pass

	@abstractmethod
	def setup_update(self, out_path):
		pass

	@abstractmethod
	def migrate(self, src_path):
		pass

	def get_prefix_from_name(self, name):
		# convert non ASCII characters to characters from 'a' to 'z'
		return ''.join(map(lambda c: c if ord('A') <= ord(c) <= ord('Z') else chr(((ord(c) - ord('a')) % (ord('z') - ord('a') + 1)) + ord('a')), name))

	def get_package_name(self, info):
		return (filter(lambda x: x.isalpha(), info.name) + '_' + info.version).lower()

	def get_full_package_name(self, info):
			return self.get_package_name(info) + self.package_extension

	def is_content_script(self, info, path):
		for name in info.content_scripts:
			if os.path.normpath(path).endswith(os.path.normpath(name)):
				return True
		return False

	def is_background_script(self, info, path):
		for name in info.background_scripts:
			if os.path.normpath(path).endswith(os.path.normpath(name)):
				return True
		return False

	def is_module_script(self, info, path):
		for name in info.modules:
			if os.path.normpath(path).endswith(os.path.normpath(name)):
				return True
		return False

	def is_framework_file(self, path):
		include_dirs = ('includes', 'kango', 'kango-ui')
		exclude_files = ('kango_api.js', 'content_notifications.js', 'content_proxy.js')
		if os.path.isfile(path):
			dir_name = os.path.basename(os.path.dirname(path))
			base_name  = os.path.basename(path)
			return True if dir_name in include_dirs and base_name not in exclude_files else False
		return False

	def insert_modules(self, text, scripts):
		placeholder_sign = '<!-- MODULES_PLACEHOLDER -->'
		str = '<!-- Modules -->\n'
		for script in scripts:
			str += '<script src="' + script + '" type="text/javascript"></script>\n'
		return text.replace(placeholder_sign, str)

	def patch_background_host(self, path, modules):
		with codecs.open(path, 'r+', 'utf-8-sig') as f:
			content = f.read()
			content = self.insert_modules(content, modules)
			f.truncate(0)
			f.seek(0)
			f.write(content)

	def merge_files(self, out_path, scripts):
		encoding = 'utf-8-sig'
		content = ''
		for script in scripts:
			content += codecs.open(script, 'r', encoding).read()
		codecs.open(out_path, 'w', encoding).write(content)