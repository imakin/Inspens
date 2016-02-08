SASSFILES = $(shell find Inspens/www/ -maxdepth 5 -type f -name '*.scss')
SCSSES = $(SASSFILES:.scss=.css)

MAIN = $(shell find Inspens/www/index.html -type f)
MAINTARGET = $(MAIN:.html=.jump.html)

VIEWS = $(shell find Inspens/www/views/ -type f -name '*.html')
VIEWTARGETS = $(VIEWS:.html=.js)

all: $(SCSSES) $(VIEWTARGETS) $(MAINTARGET)
	#done compiling: scss, index, views

#-- TODO: compile_index here is triggered only if views changed, should be separated and make the views as dependency
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

