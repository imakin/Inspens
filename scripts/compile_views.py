import os
import sys
# Makin Dec 2015
roomdir = '.'
try:
	roomdir = sys.argv[1]
except IndexError:
	roomdir = '.'

for f in os.listdir(roomdir):
	if (f[-5:]==".html"):
		roomname = f[:-5]
		f = os.path.join(roomdir, f)
		with open(f, 'r') as templatefile:
			template = templatefile.read()
			if (template[-1]=="\n"):
				template = template[:-1]
			template = template.replace('"','\\"')
			template = template.replace("'","\\'")
			template = template.replace('\n','"+\n"')
			template = "room_"+roomname+" = \"\"+\n\"" + template + "\";"
			with open(f[:-5]+'.js', 'w') as compiled:
				compiled.write(template)
				print(f+" created")
