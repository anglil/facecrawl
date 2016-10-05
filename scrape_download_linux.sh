#!/bin/sh

#file="name2.txt"
#if [ -f "$file" ]
#then
#	echo "seeds ready."
#else
#	phantomjs scrape.js
#fi


#file="name_record.txt"
#if [ -f "$file" ]
#then
#	echo "$file exists!"
#else
#	touch $file
#fi
#phantomjs scrape2.js


#file="name.txt" #"/Users/anglil/Downloads/crawler/name.txt"
#count=0
#while IFS= read -r line
#do
#	extension='.txt'
#	filename="$line$extension" #"$line$extension" #"/Users/anglil/Downloads/crawler/$line$extension"
#	insideCount=0
#	## check if the directory already exists
#	cd images
#	if [ ! -d "$line" ]; 
#	then
#		mkdir $line
#	fi
#	## enter the directory
#	cd $line
#	while IFS= read -r link
#	do 
#		#echo $link
#		#curl -O $link
#	
#		extensionIMG=${link##*.}
#		#extensionIMR=${extensionIMG%%*[^a-zA-Z]*}
#		extensionIMR='jpg'
#		echo "--extension:"
#		echo "$extensionIMG->$extensionIMR"
#		#echo $imgExtension2
#		
#		imgName="${link##*/}"
#		echo "--original name:"
#		echo $imgName
#		
#		imgNameNew="$insideCount.$extensionIMR"
#		echo "--new name:"
#		echo $imgNameNew
#		
#		curl -o $imgNameNew $link		
#		#echo '\n'		
#
#		count=$(( count+1 ))
#		insideCount=$(( insideCount+1 ))
#	done <"$filename"
#	cd ../..
#done <"$file"

rm name_record.txt
touch name_record.txt
count=0
dir="images"
for i in "$dir"/*.txt; do
        name=${i##*/}
        name=${name%%.txt*}
        echo "$name" >> 'name_record.txt'
        count=$(( count+1 ))
echo $count
done

file="name_record.txt" #"/Users/anglil/Downloads/crawler/name.txt"
count=0
while IFS= read -r line
do
	## check if the directory already exists
	mkdir -p "/home/anglil/crawler0/images/$line"

	extension='.txt'
	filename="/home/anglil/crawler0/images/$line$extension" #"$line$extension" #"/Users/anglil/Downloads/crawler/$line$extension"
	insideCount=0

	cd "/home/anglil/crawler0/images/$line"
	while IFS= read -r link
	do 
		#echo $link
		#curl -O $link
	
		extensionIMG=${link##*.}
		#extensionIMR=${extensionIMG%%*[^a-zA-Z]*}
		extensionIMR='jpg'
		echo "--extension:"
		echo "$extensionIMG->$extensionIMR"
		#echo $imgExtension2
		
		imgName=${link##*/}
		echo "--original name:"
		echo $imgName
		
		imgNameNew="$insideCount.$extensionIMR"
		echo "--new name:"
		echo $imgNameNew

		if [ -f "/home/anglil/crawler0/images/$line/$imgNameNew" ]
		then
			echo "it's there"
			count=$(( count+1 ))
			insideCount=$(( insideCount+1 ))
		else
			#curl -o "$imgNameNew" "$link"
			wget --tries=3 $link
			if [ $? -eq 0 ]
			then
				mv "$imgName" "$imgNameNew"
				echo "donwloaded"
				count=$(( count+1 ))
				insideCount=$(( insideCount+1 ))
			fi
		fi		
		echo '\n'		

	done <"$filename"
	#cd ..
done <"$file"
