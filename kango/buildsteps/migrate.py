# -*- coding: UTF-8

import os
from kango.buildsteps import BuildStepBase

class BuildStep(BuildStepBase):

	def _migrate_from_094(self, info, path):
		for script in info.background_scripts:
			spath = os.path.join(path, script)
			with open(spath, 'r') as f:
				i = 1
				for line in f:
					if 'kango.ui.addEventListener' in line:
						print 'Error in file %s. Line: %d. You shouldn\'t use kango.ui.addEventListener anymore. See http://kangoextensions.com/blog/version-0-9-5-released/ for more information. ' % (script, i)
					i += 1

	def pre_build(self, output_path, project_path, info, args):
		self._migrate_from_094(info, output_path)
