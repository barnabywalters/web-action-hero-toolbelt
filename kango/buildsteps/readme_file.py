# -*- coding: UTF-8

import os
from kango.buildsteps import BuildStepBase

class BuildStep(BuildStepBase):

	def pre_build(self, output_path, project_path, info, args):
		with open(os.path.join(output_path, 'readme.txt'), 'w') as f:
			f.write('Built using Kango - Cross-browser extension framework. http://kangoextensions.com/')