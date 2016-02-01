import os
import sys
# Makin Jan 2016
basedir = '..'
try:
	basedir = sys.argv[1]
except IndexError:
	basedir = '..'


viewdir = basedir+'/Inspens/www/views'
html_views = ""
for f in os.listdir(viewdir):
	if (f[-3:]==".js"):
		html_views += "\t\t<script type='text/javascript' src='views/"+f+"'></script>\n"


controllerdir = basedir+'/Inspens/www/controller'
html_controller = ""
for f in os.listdir(controllerdir):
	if (f[-3:]==".js"):
		html_controller += "\t\t<script type='text/javascript' src='controller/"+f+"'></script>\n"


print(html_views)
print(html_controller)

compiled = ""
with open(basedir+'/Inspens/www/index.html', 'r') as original:
	page = original.read()
	if (page.find("<!-- START_VIEWS_AND_CONTROLLER -->")<0):
		page1 = page[:page.find("</head>")]+"<!-- START_VIEWS_AND_CONTROLLER -->"
		page2 = "<!-- END_VIEWS_AND_CONTROLLER -->"+page[page.find("</head>"):]
	else:
		page1 = page[:page.find("<!-- START_VIEWS_AND_CONTROLLER -->")+35]+"\n"
		page2 = "\t\t"+page[page.find("<!-- END_VIEWS_AND_CONTROLLER -->"):]
	compiled = page1+html_views+html_controller+page2

with open(basedir+'/Inspens/www/index.html', 'w') as original:
	original.write(compiled)
