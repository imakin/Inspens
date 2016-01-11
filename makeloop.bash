#!/bin/bash
t ()
{
	return 0
}
while t
do
	make all
	sleep 2
done
