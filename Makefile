SASSFILES = $(shell find Inspens/www/ -maxdepth 5 -type f -name '*.scss')
SOURCES = $(SASSFILES:.scss=.css)
MAIN = $(shell find Inspens/www/index.html -type f)
MAINTARGET = $(MAIN:.html=.jump.html)

%.jump.html: %.html
	cp $< $@

%.css: %.scss
	#hai
	sass  $< > $@

all: $(SOURCES)
	python Inspens/www/views/compile.py Inspens/www/views/

debug:
	adb logcat | grep -e Web -e sqlg -e PluginManager -e IInputConnectionWrapper 

html: $(MAINTARGET)
	#  $(MAINTARGET) is ready
