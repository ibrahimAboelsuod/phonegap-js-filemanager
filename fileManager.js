function fileManager() {//<<class
	/*the function is called when any callback fails*/
	function onError(error) {
    	alert("Failed to list directory contents: " + error.code);
	}
	var that = this;
	this.scanDiskFiles = null;
	this.exploreFile = function () {
		alert("exploring files");
	};
    
	/*a function to scan a parent directory and all its childreen for a list of pre determend file types*/
    this.scanDisk = function (dir, typeList, domain, files, scanedDirs, newDirs) {
		//console.log("in: " + dir);
		
		/*Fisrt call instructions*/
		if(files == undefined){
			var ti;
			for (ti = 0; ti < typeList.length; ti += 1) {typeList[ti] = typeList[ti].toUpperCase();}
		}
		//remove when build and replcae with default
		files = typeof files !== 'undefined' ?  files : [];
		scanedDirs = typeof scanedDirs !== 'undefined' ?  scanedDirs : [];
		newDirs = typeof newDirs !== 'undefined' ?  newDirs : [];
		domain = typeof domain !== 'undefined' ?  domain : '';
		/*********************************************************/
		
		/*returns fileSystem object to access a directory dir*/
        window.resolveLocalFileSystemURI(dir, function (fileSystem) {
			/*reader object to read/view files*/
			var directoryReader = fileSystem.createReader();
			directoryReader.readEntries(function (entries) {
				var i;
				/*loop through directory contents*/
				for (i = 0; i < entries.length; i += 1) {
					//if file
					if (entries[i].isFile == true &&
						entries[i].name.split('.').length >= 2 &&
						jQuery.inArray(entries[i].name.split('.')[1].toUpperCase(), typeList) != -1){
						
							files.push(entries[i]);
							files[files.length-1].fullPath = dir + files[files.length-1].name;//prefix file path to work with file protocol
					}//if directory
					else if (entries[i].isDirectory == true && 
							 entries[i].name[0] != '.' && 
							 jQuery.inArray(domain + entries[i].fullPath, scanedDirs) == -1 &&
							 jQuery.inArray(domain + entries[i].fullPath, newDirs) == -1)
						newDirs.push(domain + entries[i].fullPath);//push new dirs
				}				
				
				scanedDirs.push(dir);//push just visted dir
				/*recurison*/
				if (newDirs.length==0){//end recurison
					that.scanDiskFiles = files;
				}
				else {
					that.scanDisk(newDirs.shift(), typeList, domain, files, scanedDirs, newDirs);
				}

			}, onError);//end of directory reader
		}, onError);//end of file system
    };//end of scan disk
}//end of file manager class

//WIP*******************************
function handleFile(file) { domain,
	/*zip.workerScriptsPath = "lib/zip/";
	alert(file.name);
	zip.createReader(new zip.BlobReader(file), function(reader) {
		console.log("did create reader");
	    reader.getEntries(function(entries) {
	    	console.log("got entries");
	    	
	    	//Start a modal for our status

	        entries.forEach(function(entry) {
				alert(entry.filename);
	        });
	    });
	}, function(err) {
	    console.dir(err);
	});*/
	alert(file.name);
	var archive = RarArchive(file, function (err) {
		if (err) {
			// An error occurred (not a rar, read error, etc)
			console.dir(err);
			return;
		}
		// Use archive
		alert(archive.entries[0].name);
	});

}