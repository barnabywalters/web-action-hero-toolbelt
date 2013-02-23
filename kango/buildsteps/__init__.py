# -*- coding: UTF-8

import re
import codecs
from abc import ABCMeta, abstractmethod

class BuildStepBase(object):
	__metaclass__ = ABCMeta

	def _get_userscript_header(self, path):
		with open(path, 'r') as f:
			content = f.read()
			header = re.search('// ==UserScript==(.*)// ==/UserScript==', content, flags=re.IGNORECASE | re.DOTALL)
			if header is not None:
				return header.group(0)
			return None

	def _add_text_to_beginning(self, path, text):
		encoding = 'utf-8-sig'
		with codecs.open(path, 'r', encoding) as f:
			content = f.read()
			f.close()
			with codecs.open(path, 'w', encoding) as f2:
				f2.write(text + content)

	@abstractmethod
	def pre_build(self, output_path, project_path, info, args):
		pass
