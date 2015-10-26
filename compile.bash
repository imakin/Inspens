#!/bin/bash
while [ 1 == 1 ]
do
	a=`make -C $1 all`
	if [[ $a == *"sass"* ]]
	then
			notify-send "compiled" "styles updated"
	fi
	sleep 1
done
