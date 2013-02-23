# -*- coding: UTF-8

import os
from kango.buildsteps import BuildStepBase

class BuildStep(BuildStepBase):

	header = '/*\nBuilt using Kango - Cross-browser extension framework\nhttp://kangoextensions.com/\n*/\n'

	def _is_framework_file(self, path):
		include_dirs = ('includes', 'kango', 'kango-ui')
		exclude_files = ('kango_api.js')
		if os.path.isfile(path):
			dir_name = os.path.basename(os.path.dirname(path))
			base_name  = os.path.basename(path)
			return True if dir_name in include_dirs and base_name not in exclude_files else False
		return False
		
	def _process_dir(self, dir):
		for root, dirs, files in os.walk(dir):
			for name in files:
				path = os.path.join(root, name)
				extension = os.path.splitext(path)[1]
				if extension == '.js' and self._is_framework_file(path):
					self._add_text_to_beginning(path, self.header)

	def init_subparser(self, parser_build):
		parser_build.add_argument('--no_add_header', action='store_true', help='Not add header to all sources.')

	def pre_build(self, output_path, project_path, info, args):
		if not args.no_add_header:
			self._process_dir(output_path)