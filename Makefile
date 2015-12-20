SASSFILES = $(shell find Inspens/www/ -maxdepth 5 -type f -name '*.scss')
SOURCES = $(SASSFILES:.scss=.css)

%.css: %.scss
	#hai
	sass  $< > $@

all: $(SOURCES)
	python Inspens/www/views/compile.py Inspens/www/views/

debug:
	abd logcat | grep Web
