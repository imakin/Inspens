# @Izzulmakin 2015
# must be used by calling "source activate" (from bash), from root project dir
# you cannot run it directly

SOURCE_DIR="Inspens"
# this is plugins used in cordova project
declare -a PLUGINS=('cordova-plugin-device' 'cordova-plugin-console' 'com.admob.plugin' 'org.apache.cordova.dialogs' 'cordova-sqlite-storage');
declare -a PLATFORMS=('android');

if ! [ -f "activate.bash" ] ; then
	echo "source activate must be run on project directory, it is the folder containing activate script & package.json"
	echo "cd to project directory then 'source activate'"
else
	echo "(c) Izzulmakin 2015"
	if [ -n "$_INSPENSE_VENV" ] ; then
		echo "reactivate"
		deactivate
	fi
	
	_INSPENSE_VENV="$PWD"
	export _INSPENSE_VENV

	if [ -d "$PWD/node_modules/.bin" ]
	then
		_OLD_PATH="$PATH"
		PATH="$PATH:$PWD/node_modules/.bin"
		export PATH

		echo "Env set. Deactivate this env by call 'deactivate'"
		echo "Installed modules: "
		ls node_modules/.bin/
	fi

	# install required cordova (package.json)
	if hash cordova 2>/dev/null
	then 
		echo "cordova found"
	else
		#read -p "This script can assist you to install cordova on this project folder, is it oke?" yn
		#case $yn in
		#	[Yy]* ) echo "installing cordova for you"; npm install; break;;
		#	[Nn]* ) echo "manually install cordova and set env before continue"; break;;
		#	* ) echo "Please answer yes or no.";;
		#esac
		# not using Y/N question but ask user to ctrl-c if not okay (for automation)
		echo "This script will assist you to install cordova on this project folder (for automation sake). If it is not oke manually close this script"
		npm install
		# -- re export node modules bin PATH
		if [ -d "$PWD/node_modules/.bin" ]
		then
			_OLD_PATH="$PATH"
			PATH="$PATH:$PWD/node_modules/.bin"
			export PATH

			echo "Env set. Deactivate this env by call 'deactivate'"
			echo "Installed modules: "
			ls node_modules/.bin/
		fi
		# --- recheck existence of cordova
		hash cordova
	fi

	_OLD_PS1="$PS1"
	PS1="(Inspens) $PS1"
	export PS1

	# cd to cordova source dir
	cd "$SOURCE_DIR"

	# check & install cordova plugins/platform 
	for platform in "${PLATFORMS[@]}"
	do
		if [ ! -d "platforms" ]; then
			mkdir platforms
		fi
		if [ ! -d "platforms/$platform" ]; then
			`which cordova` platforms add "$platform"
		else
			echo "the folder platform $platform exists, assumed to be already installed (remove first to reinstall) [ok]"
		fi
	done

	for plugin in "${PLUGINS[@]}"
	do
		if [ ! -d "plugins" ]; then
			mkdir plugins
		fi
		if [ ! -d "plugins/$plugin" ]; then
			`which cordova` plugin add "$plugin"
		else
			echo "the folder plugin $plugin exists, assumed to be already installed (remove first to reinstall) [ok]"
		fi
	done

	deactivate () {
		if [ -n "$_INSPENSE_VENV" ] ; then
			unset _INSPENSE_VENV
		fi
		if [ -n "$_OLD_PATH" ] ; then
			PATH="$_OLD_PATH"
			export PATH
			unset _OLD_PATH
		fi
		if [ -n "$_OLD_PS1" ] ; then
			PS1="$_OLD_PS1"
			export PS1
			unset _OLD_PS1
		fi
		unset -f deactivate
	}

	autocompile () {
		echo "auto compile .sass active"
		nohup bash "$_INSPENSE_VENV/makeloop.bash" "$_INSPENSE_VENV"> /tmp/inspenscompile &
	}
	stopcompile () {
		kill $(ps aux | grep makeloop.bash | grep -v "grep" | cut -d " " -f4)
	}


	# This should detect bash and zsh, which have a hash command that must
	# be called to get it to forget past commands.  Without forgetting
	# past commands the $PATH changes we made may not be respected
	if [ -n "$BASH" -o -n "$ZSH_VERSION" ] ; then
		hash -r 2>/dev/null
	fi
fi
