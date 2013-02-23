# -*- coding: UTF-8

import json
import uuid
import kango
import sys
from kango.utils import *
from kango.commands import Command

def get_prefix_from_name(name):
	return filter(lambda x: x.isalpha(), name)

class ProjectCreator(object):
	_extension_info_name = 'extension_info.json'
	templates_directory = 'templates'

	def _create_dir(self, name):
		if not os.path.exists(name):
			os.makedirs(name)

	def _create_extension_info(self, path, obj):
		self._create_dir(path)
		extensionInfoPath = os.path.join(path, self._extension_info_name)
		with open(extensionInfoPath, 'w') as f:
			f.write(json.dumps(obj, skipkeys=True, indent=2))

	def generate_uuid(self):
		return '{' + str(uuid.uuid4()).upper() + '}'

	def get_iid_from_id(self, iid, id):
		result = ''
		mask = '{11001100-1100-1100-0000-001100110011}'
		for i in range(len(mask)):
			result += id[i] if mask[i] == '1' else iid[i]
		return result

	def create(self, project_directory):
		if project_directory == sys.path[0]:
			print 'You must set project directory'
			sys.exit(1)

		print 'Input project name: ',
		project_name = sys.stdin.readline()[:-1]

		template_path = os.path.join(self.templates_directory, 'browser_button')

		self._create_dir(project_directory)

		src_dir = os.path.join(project_directory, 'src')

		self._create_dir(os.path.join(src_dir, 'common'))
		self._create_dir(os.path.join(project_directory, 'certificates'))

		copy_dir_contents(template_path, src_dir)
		copy_dir_contents(os.path.join(sys.path[0], 'src', 'js', 'common', 'icons'), os.path.join(src_dir, 'common', 'icons'))

		info = kango.ExtensionInfo()
		info_path = os.path.join(src_dir, 'common', self._extension_info_name)
		info.load(info_path)
		info.name = project_name
		info.save(info_path)

		self._create_extension_info(os.path.join(src_dir, 'firefox'), {'id': self.generate_uuid()})
		self._create_extension_info(os.path.join(src_dir, 'chrome'), {'id': self.generate_uuid()})

		bho_clsid = self.generate_uuid()
		toolbar_clsid = self.generate_uuid()
		engine_clsid = self.generate_uuid()

		self._create_extension_info(os.path.join(src_dir, 'ie'), {
			'id': bho_clsid,
			'com_objects': {
				'bho': {
					'clsid': bho_clsid,
					'iid': self.get_iid_from_id('{06E7211D-0650-43CF-8498-4C81E83AEAAA}', bho_clsid),
					'libid': self.generate_uuid()
				},
				'toolbar': {
					'clsid': toolbar_clsid,
					'iid': self.get_iid_from_id('{A0207057-3461-4F7F-B689-D016B7A03964}', toolbar_clsid)
				},
				'engine': {
					'clsid': engine_clsid,
					'iid': self.get_iid_from_id('{06ADA96E-5E8C-4550-BEBF-141EFD188227}', engine_clsid),
					'libid': self.generate_uuid()
				}
			}
		})

		self._create_extension_info(os.path.join(src_dir, 'safari'), {
			'id': 'com.kangoextensions.' + get_prefix_from_name(project_name).lower(),
			'developer_id': 'YOUR_SAFARI_DEVELOPER_ID'
		})

		self._create_extension_info(os.path.join(src_dir, 'opera'), {
			'id': 'http://kangoextensions.com/extensions/' + get_prefix_from_name(project_name).lower() + '/'
		})

		print 'Done'

class CreateProjectCommand(Command):
	def init_subparser(self, subparsers):
		parser_build = subparsers.add_parser('create', help='Create project.')
		parser_build.add_argument('project_directory', default=os.getcwd(), nargs='?')
		return parser_build

	def execute(self, args):
		creator = ProjectCreator()
		creator.templates_directory = os.path.join(sys.path[0], creator.templates_directory)
		creator.create(args.project_directory)