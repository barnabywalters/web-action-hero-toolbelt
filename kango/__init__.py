# -*- coding: UTF-8

import json
import sys

VERSION = '1.0.1'
BUILD = 'final'

def log(text):
	print >> sys.stderr, text

class ExtensionInfo(object):
	# Common
	id = ''
	name = ''
	description = ''
	version = ''
	creator = ''
	homepage_url = ''
	content_scripts = []
	background_scripts = []
	settings = None
	browser_button = None
	toolbar = None
	update_url = ''
	update_path_url = ''
	debug = False
	modules = []
	locales = []
	default_locale = ''
	options_page = None
	context_menu_item = None

	# Safari
	developer_id = ''

	# IE deprecated
	bho_iid = ''
	toolbar_iid = ''
	bho_clsid = ''
	toolbar_clsid = ''
	libid = ''

	# IE
	updater = {}
	com_objects = {}

	# Opera
	mail = ''

	# Firefox
	components = None

	# Internal
	kango_version = None

	def merge(self, seq):
		result = []
		for s in seq:
			if s not in result:
				result.append(s)
		return result

	def load(self, filename):
		with open(filename, 'r') as f:
			info = json.loads(f.read(), encoding='utf-8')
			for elem in info:
				if hasattr(self, elem):
					if elem == 'background_scripts':
						self.background_scripts = self.merge(self.background_scripts + info[elem])
					elif elem == 'content_scripts':
						self.content_scripts = self.merge(self.content_scripts + info[elem])
					else:
						self.__dict__[elem] = info[elem]

	def save(self, filename):
		with open(filename, 'w') as f:
			f.write(json.dumps(self.__dict__, skipkeys=True, indent=2))
