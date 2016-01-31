SASSFILES = $(shell find Inspens/www/ -maxdepth 5 -type f -name '*.scss')
SOURCES = $(SASSFILES:.scss=.css)

MAIN = $(shell find Inspens/www/index.html -type f)
MAINTARGET = $(MAIN:.html=.jump.html)

VIEWS = $(shell find Inspens/www/views/ -type f -name '*.html')
VIEWTARGETS = $(VIEWS:.html=.js)

%.jump.html: %.html
	cp $< $@

%.css: %.scss
	#compile scss'
	sass  $< > $@

all: $(SOURCES) $(VIEWTARGETS) $(MAINTARGET)
	#done compiling: scss, index, views

debug:
	adb logcat | grep -e Web -e sqlg -e PluginManager -e IInputConnectionWrapper 

html: $(MAINTARGET)
	# compile index.html's

%.js: %.html
	python Inspens/www/views/compile.py Inspens/www/views/
	#compile views

view: $(VIEWTARGETS)
	#$(VIEWS)
