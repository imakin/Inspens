SASSFILES = $(shell find Inspens/www/ -maxdepth 5 -type f -name '*.scss')
SOURCES = $(SASSFILES:.scss=.css)

MAIN = $(shell find Inspens/www/index.html -type f)
MAINTARGET = $(MAIN:.html=.jump.html)

VIEWS = $(shell find Inspens/www/views/ -type f -name '*.html')
VIEWTARGETS = $(VIEWS:.html=.js)

all: $(SOURCES) $(VIEWTARGETS) $(MAINTARGET)
	#done compiling: scss, index, views

%.js: %.html
	python scripts/compile_views.py Inspens/www/views/
	python scripts/compile_index.py ./
	#compile views

view: $(VIEWTARGETS)
	#$(VIEWS)

%.jump.html: $(view) %.html
	cp $< $@

html: $(MAINTARGET)
	# compile index.html's

%.css: %.scss
	#compile scss'
	sass  $< > $@


debug:
	adb logcat | grep -e Web -e sqlg -e PluginManager -e IInputConnectionWrapper 

