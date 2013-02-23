# -*- coding: UTF-8

import codecs
import kango
import imp
import sys
from kango.commands import Command
from kango.utils import *

class ProjectBuilder(object):
	_extension_info_name = 'extension_info.json'
	_output_dir_name = 'output'
	_builders = []

	def __init__(self):
		import kango.builders.chrome
		import kango.builders.firefox
		import kango.builders.opera
		import kango.builders.safari
		self._builders = [kango.builders.chrome.ExtensionBuilder,
					 kango.builders.firefox.ExtensionBuilder,
					 kango.builders.opera.ExtensionBuilder,
					 kango.builders.safari.ExtensionBuilder
		]
		try:
			import kango.builders.internet_explorer
			self._builders.append(kango.builders.internet_explorer.ExtensionBuilder)
		except ImportError:
			print 'Contact extensions@kangoextensions.com to enable IE support.'

	def _merge_files(self, first, second, dst):
		encoding = 'utf-8-sig'
		f = codecs.open(first, 'r', encoding)
		content = f.read()
		f.close()

		f = codecs.open(second, 'r', encoding)
		content += '\r\n\r\n// Merged from ' + second.decode(sys.getfilesystemencoding()) + '\r\n\r\n' + f.read()
		f.close()

		f = codecs.open(dst, 'w', encoding)
		f.write(content)
		f.close()

	def _merge_jss(self, file, out):
		part_sign = '.part'
		extension = os.path.splitext(file)[1]
		filename = os.path.splitext(file)[0]
		if extension == '.js':
			if file.find(part_sign) != -1:
				name = os.path.basename(file.replace(part_sign, ''))
				dst_path = os.path.join(out, name)
				if os.path.isfile(dst_path):
					self._merge_files(dst_path, file, dst_path)
					return True
			else:
				dst_path = os.path.join(out, os.path.basename(filename + part_sign + extension))
				src_path = os.path.join(out, os.path.basename(file))
				if os.path.isfile(dst_path):
					self._merge_files(file, dst_path, src_path)
					os.remove(dst_path)
					return True
		return False

	def _merge_dirs(self, src, out):
		ignore = shutil.ignore_patterns('.svn', '*.exp', '*.ilk', '*.lib', '.idea')
		names = os.listdir(src)
		ignored_names = ignore(src, names)

		try:
			os.makedirs(out)
		except:
			pass

		for name in names:
			if name in ignored_names:
				continue

			srcname = os.path.join(src, name)
			dstname = os.path.join(out, name)

			if os.path.isdir(srcname):
				self._merge_dirs(srcname, dstname)
			elif not self._merge_jss(srcname, out):
				try:
					shutil.copy(srcname, dstname)
				except:
					pass

	def _copy_extension_files(self, src, out, extension_key):
		try:
			os.makedirs(out)
		except:
			pass

		# copy common files
		copy_dir_contents(os.path.join(src, 'common'), out,
						  ignore=shutil.ignore_patterns('.svn', '*.exp', '*.ilk', '*.lib', '.idea'))

		# copy browser specific files
		dirs = os.listdir(src)
		dirs.sort(lambda x, y : cmp(y.count(' '), x.count(' ')))
		for dir in dirs:
			if dir.find(extension_key) != -1:
				self._merge_dirs(os.path.join(src, dir), out)

	def _get_locales(self, extension_out_path):
		locales = []
		locales_path = os.path.join(extension_out_path, 'locales')
		if os.path.isdir(locales_path):
			files = os.listdir(locales_path)
			for filename in files:
				path = os.path.join(locales_path, filename)
				if os.path.isfile(path):
					name, extension = os.path.splitext(filename)
					if extension == '.json':
						locales.append(name)
		return locales

	def _build_extension(self, builder_class, project_dir, out_path, args, build_steps):
		key = builder_class.key
		info = kango.ExtensionInfo()
		kango_path = sys.path[0]
		builder = builder_class(info, kango_path)

		project_src_path = os.path.join(project_dir, 'src')
		framework_src_path = os.path.join(kango_path, 'src', 'js')

		builder.migrate((os.path.join(project_src_path, key)))

		# merge extension_info
		info.load(os.path.join(project_src_path, 'common', self._extension_info_name))
		info.load(os.path.join(project_src_path, key, self._extension_info_name))

		kango.log('Building ' + builder.key + ' extension')

		extension_out_path = os.path.join(out_path, builder.key)

		# merge framework and project sources
		self._copy_extension_files(framework_src_path, extension_out_path, builder.key)
		self._copy_extension_files(project_src_path, extension_out_path, builder.key)

		builder.setup_update(out_path)

		extension_out_path = builder.build(extension_out_path)

		# add locales
		locales = self._get_locales(extension_out_path)
		if len(locales) > 0:
			info.locales = locales

		info.kango_version = '%s %s' % (kango.VERSION, kango.BUILD)

		info.save(os.path.join(extension_out_path, self._extension_info_name))

		# execute build steps
		for step in build_steps:
			step.pre_build(extension_out_path, project_dir, info, args)

		builder.pack(out_path, extension_out_path, os.path.join(project_src_path, key))

	def build(self, project_dir, args, build_steps):
		if project_dir == sys.path[0]:
			print 'You must set project directory'
			sys.exit(1)

		out_path = os.path.join(project_dir, self._output_dir_name)
		project_src_path = os.path.join(project_dir, 'src')

		try:
			shutil.rmtree(out_path)
		except:
			pass

		for builderClass in self._builders:
			if os.path.isdir(os.path.join(project_src_path, builderClass.key)):
				self._build_extension(builderClass, project_dir, out_path, args, build_steps)

class BuildCommand(Command):

	_build_steps = []

	def __init__(self):
		# load default build steps
		self._load_build_steps(os.path.join(sys.path[0], 'kango', 'buildsteps'))

	def _load_class(self, path, expected_name):
		mod_name,file_ext = os.path.splitext(os.path.split(path)[-1])
		module = None

		if mod_name != '__init__' and file_ext.lower() == '.py':
			module = imp.load_source(mod_name, path)
		# TODO: load .pyc
		#elif file_ext.lower() == '.pyc':
		#	module = imp.load_compiled(mod_name, path)

		if module is not None and hasattr(module, expected_name):
			return getattr(module, expected_name)

		return None

	def _load_build_steps(self, steps_path):
		if os.path.isdir(steps_path):
			files = os.listdir(steps_path)
			for filename in files:
				path = os.path.join(steps_path, filename)
				if os.path.isfile(path):
					step_class = self._load_class(path, 'BuildStep')
					if step_class is not None:
						self._build_steps.append(step_class())

	def init_subparser(self, subparsers):
		parser_build = subparsers.add_parser('build', help='Build project.')
		parser_build.add_argument('project_directory', default=os.getcwd())

		for step in self._build_steps:
			try:
				step.init_subparser(parser_build)
			except AttributeError:
				pass

		return parser_build

	def execute(self, args):
		project_dir = args.project_directory
		if os.path.isdir(project_dir):
			# load build steps from project directory
			self._load_build_steps(os.path.join(project_dir, 'buildsteps'))
			builder = ProjectBuilder()
			builder.build(project_dir, args, self._build_steps)
		else:
			kango.log('Can\'t find directory ' + project_dir)
