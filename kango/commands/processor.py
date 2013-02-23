# -*- coding: UTF-8

import argparse
import kango
from kango.commands.create import CreateProjectCommand
from kango.commands.build import BuildCommand

__title__ = 'Kango browser extension builder'

class CommandLineProcessor(object):
	_commands = [CreateProjectCommand, BuildCommand]

	def process(self):
		parser = argparse.ArgumentParser(description=__title__ + ' ' + kango.VERSION)
		subparsers = parser.add_subparsers()

		for command_class in self._commands:
			command = command_class()
			subparser = command.init_subparser(subparsers)
			subparser.set_defaults(execute=command.execute)

		args = parser.parse_args()
		args.execute(args)
