function fileManager() {//<<class
	this.exploreFile = function () {
		alert("exploring files");
	};
    
	//a function to scan a parent dir and all its childreen for a list of pre determend file types
    this.scanDisk = function (dir, typeList, callBack, files, scanedDirs, newDirs) {
		//remove when build and replcae with default
		files = typeof files !== 'undefined' ?  files : [];
		scanedDirs = typeof scanedDirs !== 'undefined' ?  scanedDirs : [];
		newDirs = typeof newDirs !== 'undefined' ?  newDirs : [];
        window.resolveLocalFileSystemURI(dir, function (fileSystem) {
			var directoryReader = fileSystem.createReader();
			directoryReader.readEntries(function (entries) {
				
				for (var ti=0; ti<typeList.length; ti++){//loop through types
					type=typeList[ti].toUpperCase();
					//entries.length
					for (var i=0; i<3; i++) {
						if(entries[i].isFile==true && entries[i].name.split('.')[1].toUpperCase()==type)
							files.push(entries[i]);
						else if(entries[i].isDirectory==true && jQuery.inArray(entries[i].fullPath, scanedDirs) == -1)
							newDirs.push(entries[i].fullPath);//push new dirs
					}
				}
				scanedDirs.push(dir);//push just visted dirs
				alert(dir);
				if(newDirs.length==0)
					return callBack(files);
				else{
					var newF=[];
					alert();
					this.scanDisk(newDirs.shift(), typeList, function(f){alert(f);newF=f;}, files, scanedDirs, newDirs);
				}

                },onError);
            }, onError);
    }//end of scan disk
}//end of file manager class
function onError(error) {
	alert("E");
    alert("Failed to list directory contents: " + error.code);
}
function handleFile(file) {
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
	var archive = RarArchive(file, function(err) {
		if(err) {
			// An error occurred (not a rar, read error, etc)
			console.dir(err);
			return;
		}
		// Use archive
		alert(archive.entries[0].name);
	});

}