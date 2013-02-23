# -*- coding: UTF-8

import os
import shutil
import sys
import json
import codecs
import subprocess
import xml
import kango
from kango.builders import ExtensionBuilderBase

class ExtensionBuilder(ExtensionBuilderBase):
	key = 'chrome'
	package_extension = '.crx'

	_manifest_filename = 'manifest.json'
	_background_host_filename = 'background.html'
	_info = None
	_kango_path = None

	def __init__(self, info, kango_path):
		self._info = info
		self._kango_path = kango_path

	def _unix_find_app(self, prog_filename):
		bdirs = ['$HOME/Environment/local/bin/',
				 '$HOME/bin/',
				 '/share/apps/bin/',
				 '/usr/local/bin/',
				 '/usr/bin/']
		for dir in bdirs:
			path = os.path.expandvars(os.path.join(dir, prog_filename))
			if os.path.exists(path):
				return path
		return None

	def get_chrome_path(self):
		if sys.platform.startswith('win'):
			root_pathes = ['${LOCALAPPDATA}',
							'${APPDATA}',
							'${ProgramFiles(x86)}',
							'${ProgramFiles}']

			app_pathes = [os.path.join('Google', 'Chrome', 'Application', 'chrome.exe'),
						  os.path.join('Chromium', 'Application', 'chrome.exe')]

			for root_path in root_pathes:
				for app_path in app_pathes:
					path = os.path.expandvars(os.path.join(root_path, app_path))
					if os.path.exists(path):
						return path

		elif sys.platform.startswith('linux'):
			appnames = ['chromium-browser', 'google-chrome', 'chromium']
			for apppath in appnames:
				path = self._unix_find_app(apppath)
				if path is not None:
					return path

		elif sys.platform.startswith('darwin'):
			if os.path.exists('/Applications/Google Chrome.app'):
				return '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome'
			elif os.path.exists('/Applications/Chromium.app'):
				return '/Applications/Chromium.app/Contents/MacOS/Chromium'
		return None

	def _patch_manifest(self, manifest_path):
		with open(manifest_path, 'r+') as f:
			manifest = json.loads(f.read())

			if self._info.update_url == '':
				del manifest['update_url']

			if self._info.homepage_url == '':
				del manifest['homepage_url']

			for elem in manifest:
				if elem != 'content_scripts' and hasattr(self._info, elem):
					manifest[elem] = getattr(self._info, elem)

			if self._info.browser_button is None:
				del manifest['browser_action']
			else:
				manifest['browser_action']['default_icon'] = self._info.browser_button['icon']
				manifest['browser_action']['default_title'] = self._info.browser_button['tooltipText']
				if 'popup' not in self._info.browser_button:
					del manifest['browser_action']['default_popup']

			if not self._info.content_scripts:
				del manifest['content_scripts']

			if self._info.options_page is None:
				del manifest['options_page']

			f.truncate(0)
			f.seek(0)
			f.write(json.dumps(manifest, indent=2))

	def _merge_includes(self, manifest_path, out_path):
		with open(manifest_path, 'r+') as f:
			manifest = json.loads(f.read())
			if 'content_scripts' in manifest:
				self.merge_files(os.path.join(out_path, 'includes', 'content.js'),
								 map(lambda path: os.path.join(out_path, path), manifest['content_scripts'][0]['js']))

				os.remove(os.path.join(out_path, 'includes/content_kango.js'))
				os.remove(os.path.join(out_path, 'includes/content_init.js'))

				manifest['content_scripts'][0]['js'] = ['includes/content.js']

				f.truncate(0)
				f.seek(0)
				f.write(json.dumps(manifest, indent=2))

	def build(self, out_path):
		manifest_path = os.path.join(out_path, self._manifest_filename)
		self._patch_manifest(manifest_path)
		self.patch_background_host(os.path.join(out_path, self._background_host_filename), self._info.modules)
		self._merge_includes(manifest_path, out_path)
		return out_path

	def pack(self, dst, src, src_path):
		chrome_path = self.get_chrome_path()
		if chrome_path is not None:
			extension_path = os.path.abspath(src)
			certificate_path = os.path.abspath(os.path.join(extension_path, '../', '../', 'certificates'))
			if not os.path.exists(certificate_path):
				os.makedirs(certificate_path)
			certificate_path = os.path.join(certificate_path, 'chrome.pem')
			extension_dst = os.path.abspath(os.path.join(extension_path, '../', 'chrome.crx'))

			cmd = chrome_path + ' --pack-extension="' + extension_path + '"'
			if os.path.isfile(certificate_path):
				cmd += ' --pack-extension-key="' + certificate_path + '"'
			cmd += ' --no-message-box'
			os.system(cmd.encode(sys.getfilesystemencoding()))

			if not os.path.isfile(extension_dst):
				cmd = '\"\"' + chrome_path + '"' + ' --pack-extension="' + extension_path + '"'
				if os.path.isfile(certificate_path):
					cmd += ' --pack-extension-key="' + certificate_path + '"'
				cmd += ' --no-message-box "'
				os.system(cmd.encode(sys.getfilesystemencoding()))
			
			if not os.path.isfile(extension_dst):
				cmd = '"' + chrome_path + '"' + ' --pack-extension="' + extension_path + '"'
				if os.path.isfile(certificate_path):
					cmd += ' --pack-extension-key="' + certificate_path + '"'
				cmd += ' --no-message-box'
				subprocess.call(cmd.encode(sys.getfilesystemencoding()))
			
			try:
				shutil.move(os.path.abspath(os.path.join(extension_path, '../', 'chrome.pem')), certificate_path)
			except:
				pass
			shutil.move(extension_dst, os.path.join(dst, self.get_full_package_name(self._info)))
		else:
			kango.log('Chrome/Chromium is not installed, can\'t pack chrome extension.')

	def setup_update(self, out_path):
		if self._info.update_url != '' or self._info.update_path_url != '':
			update_xml_filename = 'update_chrome.xml'
			xml_path = os.path.join(self._kango_path, 'src', 'xml', update_xml_filename)

			doc = xml.dom.minidom.parse(xml_path)
			app = doc.getElementsByTagName('app')[0]
			app.setAttribute('appid', self._info.id)
			updatecheck = app.getElementsByTagName('updatecheck')[0]
			updatecheck.setAttribute('codebase', self._info.update_path_url + self.get_full_package_name(self._info))
			updatecheck.setAttribute('version', self._info.version)

			with codecs.open(os.path.join(out_path, update_xml_filename), 'w', 'utf-8') as f:
				doc.writexml(f, encoding='utf-8')

			self._info.update_url = self._info.update_url if self._info.update_url != '' else self._info.update_path_url + update_xml_filename

	def migrate(self, src_path):
		pass