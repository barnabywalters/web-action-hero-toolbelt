# -*- coding: UTF-8

import os
import shutil
import zipfile

class ZipDirectoryArchiver(object):
	def _archive(self, zip, arcname, src):
		files = os.listdir(src)
		for filename in files:
			path = os.path.join(src, filename)
			name = os.path.join(arcname, filename)
			if os.path.isdir(path):
				self._archive(zip, name, path)
			else:
				zip.write(path, name)

	def archive(self, src, dst):
		zip = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
		self._archive(zip, '', src)
		zip.close()

def copy_dir_contents(src, dst, ignore=None):
	names = os.listdir(src)
	if ignore is not None:
		ignored_names = ignore(src, names)
	else:
		ignored_names = set()

	try:
		os.makedirs(dst)
	except:
		pass

	for name in names:
		if name in ignored_names:
			continue
		srcname = os.path.join(src, name)
		dstname = os.path.join(dst, name)

		if os.path.isdir(srcname):
			copy_dir_contents(srcname, dstname, ignore)
		else:
			try:
				shutil.copy(srcname, dstname)
			except:
				pass


def move_dir_contents(src, dst, ignore=None):
	names = os.listdir(src)
	if ignore is not None:
		ignored_names = ignore(src, names)
	else:
		ignored_names = set()

	try:
		os.makedirs(dst)
	except:
		pass

	for name in names:
		if name in ignored_names:
			continue
		srcname = os.path.join(src, name)
		dstname = os.path.join(dst, name)

		if os.path.isdir(srcname):
			move_dir_contents(srcname, dstname, ignore)
			try:
				os.removedirs(srcname)
			except:
				pass
		else:
			try:
				shutil.move(srcname, dstname)
			except:
				pass