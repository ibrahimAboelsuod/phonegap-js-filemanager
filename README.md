# phonegap-js-filemanager
(WIP)This project is a simple file manager for a phonegap application I am building.
It's originally ment for cordova based apps.
But it should work just fine with any web based app sence it's based on the W3C File API.
........................................................
Simple docs:
	- To scan for a files of predefind type:
		1- Create an object of the file manager class
		
			Code:
				var fm=new fileManager();
			
		2- Call scanDisk -Inside of deviceready if you are using cordova-
		
			fileManager.scanDisk(RootDirectory: String, typeList: array of strings, domain);
			Notce that:
				-typeList is not case sensitive
				-domain is an optional fix and might not be required depending on your code
			Code:
				fm.scanDisk(cordova.file.externalRootDirectory, ["png","jpg","jpeg","gif"], "file:///storage/sdcard0");
		
		3- Read scaned files, this meathode is not exactly pretty but it will do for now (will be changed soon)
			
			var timerId=setInterval(function(){
				if(fm.scanDiskFiles != null){
					var files=fm.scanDiskFiles;
					clearInterval(timerId);
				}
			}, 500);
