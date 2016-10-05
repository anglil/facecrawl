#!/bin/sh
count=0
dir="images"
for i in "$dir"/*; do
	name=${i##*/}
	name=${name%%.txt*}
	echo "$name" >> 'name_record.txt'
	count=$(( count+1 ))
echo $count
done
