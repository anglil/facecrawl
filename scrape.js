var page = require('webpage').create();
var fs = require('fs')
var content = fs.read('name.txt')
var names = content.split("\n")

//console.log(names)
//console.log(content.pop(names.pop())
names.pop()
var len = names.length
console.log(len)

var line_count = 0;

var fn = function() {
	var name = names.pop();
	console.log(name);
	var url = 'http://www.bing.com/images/search?q=' + name + '&FORM=AWIR';
	//console.log(url);
	
	page.open(
		url,
		// a method that appears in the page open function
		function (status) {
			console.log(status)
			var old_length = 0;
			var new_length = 0;
			var repeat_count = 0;
			var refID = window.setInterval( // set interval
				function () {
					page.evaluate( // the evaluation is sandboxed
						function() {
							window.document.body.scrollTop = document.body.scrollHeight; // scroll down the page
						}
					);
					pattern = /oi:&quot;([^&])+/g;
					
					// prevent over estimating the number of images
					lst = page.content.match(pattern);
					new_length = lst.length;
					if (old_length == new_length) {
						repeat_count++;
					}
					else {
						repeat_count = 0;
					}
					old_length = new_length;
					console.log(lst.length);

					// enough number of links have been found
					if (lst.length > 400 || repeat_count > 5) {
						clearInterval(refID); // clear interval
						
						// write the links into a file
						var file = fs.open("images/" + name + ".txt", "w")
						for (i in lst) {
							file.writeLine(lst[i].substr(9)); // substring starting from the 9th char	
						}
						file.close()
						
						// get side bar names
						pattern2 = /"it">([^<])+/g;
						lst2 = page.content.match(pattern2);
						var file2 = fs.open("name2.txt", "a")
						for (j in lst2) {
							lst2[j] = lst2[j].substr(5);
							tmp=lst2[j].split(" ")
							lst2[j] = ""
							for (k in tmp) {
								lst2[j] = lst2[j] + "+" + tmp[k]
							}
							lst2[j] = lst2[j].substr(1)
							file2.writeLine(lst2[j]);
						}
						file2.close()	
						console.log("side bar:")
						console.log(lst2)
			
						// recurse on every name
						if (names.length > 0) {
							console.log(line_count++ + " names");
							fn(); // recursive call
						}
						else {
							phantom.exit();
						}
					}
				},
				500 // interval in miliseconds
			);
			
		}	
	);
	//console.log("hello")		
};
fn();

//phantom.exit()
