var page = require('webpage').create();
var fs = require('fs')
var content = fs.read('name2.txt')
var names = content.split("\n")
names.pop()
var len = names.length
console.log(len)

var content_record = fs.read('name_record.txt')
var names_record = content_record.split("\n")
names_record.pop()

var line_count = names_record.length;

var fn = function() {
	var name = names.pop();
	if (name == null) {
		phantom.exit();
	}
	console.log("name: " + name);
	console.log(names.length + " names left")
	
	// check if the name has already been scraped for
	if (names_record.indexOf(name) !== -1) {
		console.log("already scraped!")
		fn();
	}
	
	//var tag = 1;
	//var fail_time = 0; 
	//while (tag == 1 || fail_time <= 5) {
	var url = 'http://www.bing.com/images/search?q=' + name + '&FORM=AWIR';
	page.open(
		url,
		function (status) {
			console.log(status)
			if (status == 'success') {
				var old_length = 0;
                        	var new_length = 0;
                        	var repeat_count = 0;
	
				// the setInterval() method will continue calling the function until clearInterval() is called, or the window the closed; it calls a function or evaluates an expression at specified intervals
				var refID = window.setInterval(
					function () {
						page.evaluate(
							function () {
								window.document.body.scrollTop = document.body.scrollHeight;
							}
						);
						pattern = /oi:&quot;([^&])+/g;
					        lst = page.content.match(pattern);
						
						// avoid empty matching cases
						if (lst != null) {
							//tag = 0;
					
                                        		new_length = lst.length;
                                        		if (old_length === new_length) {
                                                		repeat_count++;
                                        		}
                                        		else {
                                                		repeat_count = 0;
                                        		}
                                        		old_length = new_length;
							// show the progress
                                        		console.log(lst.length);
					

							if (lst.length > 400 || repeat_count > 5) {
								clearInterval(refID);
						
								var file = fs.open("images/" + name + ".txt", "w")
								for (i in lst) {
									file.writeLine(lst[i].substr(9));
								}
								file.close()

								names_record.push(name)
								// rewrite the name_record file every 20 names for fault tolerance
								if (line_count % 20 == 0) {
									var filerecord = fs.open("name_record.txt", "w")
									arrayLength = names_record.length;
									for (var i = 0; i < arrayLength; i++) {
										filerecord.writeLine(names_record[i]);
									}
									filerecord.close();
								}
							
								if (names.length > 0) {
									console.log(++line_count + " names");
									fn();
								}
								else {
									phantom.exit();
								}
							}
						} 
						//else {
							//fail_time += 1;
							//console.log("fail times: " + fail_time)
						//}
					},
					1000 // enough time to make sure all the links are parsed
				); // set intervals
			} else {
				console.log("fail to load the page!")
				fn();
			}	
		}
	); // page open
	//}
};
fn();
