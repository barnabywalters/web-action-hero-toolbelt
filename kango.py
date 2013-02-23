#!/usr/bin/env python
# -*- coding: UTF-8

# Kango - Cross-browser extension framework
# Extension builder
# http://kangoextensions.com/

import sys

def main():
	from kango.commands.processor import CommandLineProcessor
	CommandLineProcessor().process()

if __name__ == '__main__':
	version_tuple = tuple(sys.version_info[:2])
	if version_tuple < (2, 7) or version_tuple >= (3, 0):
		sys.stderr.write('Error: Python %d.%d is not supported. Please use version 2.7 or greater.\n' % version_tuple)
		sys.exit(1)
	
	main()