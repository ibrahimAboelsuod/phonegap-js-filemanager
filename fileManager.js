function fileManager() {//<<class
	var that = this;
	this.scanDiskFiles = null;
	this.scanDiskTimer = 0;
	/*the function is called when any callback fails*/
	function onError(error) {
		alert("Failed to list directory contents: " + error.code);
		clearInterval(that.scanDiskTimer);
	}
	/*a function that returns all files and directories in a given directory*/
	this.exploreDir = function (dir, callBack) {
		var files = [], dirs = [];
		if (dir.substr(dir.length - 3, dir.length) == "../") {
			//file:///storage/sdcard0/music/../
			dir = dir.substring(0, dir.length - (4 + dir.split('/')[dir.split('/').length - 3].length));
		}
		/*returns fileSystem object to access a directory dir*/
        window.resolveLocalFileSystemURL(dir, function (fileSystem) {
			/*reader object to read/view files*/
			var directoryReader = fileSystem.createReader();
			directoryReader.readEntries(function (entries) {
				var i;
				/*loop through directory contents*/
				for (i = 0; i < entries.length; i += 1) {
					//if file
					if (entries[i].isFile == true && entries[i].name.split('.').length >= 2) {
						files.push(entries[i]);
					}//if directory
					else if (entries[i].isDirectory == true && entries[i].name[0] != '.')
						dirs.push( entries[i] );//push new dirs
				}
				//return callBack(files, dirs, dir);
				return callBack(files, dirs);
			}, onError);//end of directory reader
		}, onError);//end of file system	
	};
    
	/*a function to scan a parent directory and all its childreen for a list of pre determend file types*/
    this.scanDisk = function (dir, typeList, domain, callBack) {
		that.scanDiskTimer=0;
		that.scanDiskFiles=null;
		that.scanDiskRec(dir, typeList, domain);
		/*retrive scaned files*/
		var timerId=setInterval(function() {
			that.scanDiskTimer = timerId;
			if(that.scanDiskFiles != null){
				clearInterval(timerId);
				return callBack(that.scanDiskFiles);
			}
		}, 1000);
    };//end of scan disk
	
	
	/*scan disk recersive function*/
	this.scanDiskRec = function (dir, typeList, domain, files, scanedDirs, newDirs) {
		
		/*Fisrt call instructions*/
		if (files == undefined){
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
        window.resolveLocalFileSystemURL(dir, function (fileSystem) {
			/*reader object to read/view files*/
			var directoryReader = fileSystem.createReader();
			directoryReader.readEntries(function (entries) {
				var i;
				/*loop through directory contents*/
				for (i = 0; i < entries.length; i += 1) {
				!function outer(i){
					//if file
					if (entries[i].isFile == true &&
						entries[i].name.split('.').length >= 2 &&
						jQuery.inArray('#', entries[i].name) == -1 &&
						jQuery.inArray(entries[i].name.split('.')[entries[i].name.split('.').length - 1].toUpperCase(), typeList) != -1){
							entries[i].thumbPath="img/squares.gif";
							that.extract(entries[i], 0, function(blobURL, length){
								entries[i].thumbPath = blobURL;
								console.log(blobURL);
								entries[i].length = length;
							});
							files.push(entries[i]);
						
							//files[files.length - 1].fullPath = dir + files[files.length - 1].name;//prefix file path to work with file protocol
					}//if directory
					else if (entries[i].isDirectory == true &&
							 entries[i].name[0] != '.' &&
							 jQuery.inArray(domain + entries[i].fullPath, scanedDirs) == -1 &&
							 jQuery.inArray(domain + entries[i].fullPath, newDirs) == -1)
						newDirs.push(domain + entries[i].fullPath);//push new dirs
					
				}(i)
				}				
				
				scanedDirs.push(dir);//push just visted dir
				/*recurison*/
				if (newDirs.length==0){//end recurison
					that.scanDiskFiles = files;
				}
				else {
					that.scanDiskRec(newDirs.shift(), typeList, domain, files, scanedDirs, newDirs);
				}
				
			}, onError);//end of directory reader
		}, onError);//end of file system
    };//end of scan disk rec
	/*end of scan disk rec*/
	
	//file path to entry
	this.getFileEntry = function (path, callBack){//callback I
		var name=path.split('/')[path.split('/').length-1];
		//gets the dir path from the full file path
		path = path.substring(0,path.length-name.length);
		//returns fileSystem object to access a directory dir
        window.resolveLocalFileSystemURL(path, function (fileSystem) {
			//reader object to read/view files
			var directoryReader = fileSystem.createReader();
			directoryReader.readEntries(function (entries) {
				
				//loop through directory contents
				for (var i = 0; i < entries.length; i += 1) {
					!function (i){
					//if file
					if (entries[i].isFile == true && entries[i].name== name) {
						entries[i].thumbPath="img/squares.gif";
						that.extract(entries[i], 0, function(blobURL, length){
							entries[i].thumbPath = blobURL;
							entries[i].length = length;

							return callBack(entries[i]);
						});
					}
					else if( i == entries.length -1)
						return callBack(null);
								
					}(i)
				}//for end
			}, onError);//end of directory reader
		}, onError);//end of file system
	};
	//
	//returns a blob url of an element in a compressed file uses - zip.js and unrar.js
	this.extract = function(fileEntry, index, callBack){
		if(fileEntry.name.split('.')[fileEntry.name.split('.').length-1].toUpperCase() == "CBZ"){
			unZip(fileEntry, index, function(blobURL, length){
				return callBack(blobURL, length);
			});
		}
		else if(fileEntry.name.split('.')[fileEntry.name.split('.').length-1].toUpperCase() == "CBR"){
			unRar(fileEntry, index, function(blobURL, length){
				return callBack(blobURL, length);
			});
		}
	}/*end of extract*/
	
	//returns unrared entries
	function unRar (fileEntry, extractTarget, callBack){
		fileEntry.file(function(blob) {
			var unrar = new VUrar(blob,function(){
				
				unrar.extractFile(extractTarget,function(blobURL){
					callBack(blobURL, unrar.entries.length);
					return(unrar = null);
				});
				
			});
		});
	}	
	
	//returns unzipped entries
	function unZip (fileEntry, extractTarget, callBack){//zip file entry, offset, callback
		fileEntry.file(function(file){
			zip.workerScriptsPath = "lib/zip/";
			// use a BlobReader to read the zip from a Blob object
			zip.createReader(new zip.BlobReader(file), function(reader) {

				// get all entries from the zip
				reader.getEntries(function(entries) {
					var dirCount = 0; //index orefix
					//count dirs
					for(var i=0; i<entries.length; i += 1){
						!function outer(i){
							if(entries[i].directory == true)
								dirCount += 1;
						}(i)
					}//entries loop end

					// get entry content
					entries[extractTarget + dirCount].getData(new zip.BlobWriter(), function(blob) {
						var blobURL = window.URL.createObjectURL(blob);
						return callBack(blobURL, entries.length - dirCount);
					});



				});//get entries end
			},error);//create reader end

		}, error);//.file end

		}

	function error(error) {
		alert("Error while extraction: " + error.code);
		console.error(error);
		clearInterval(that.scanDiskTimer);
	}
	
}//end of file manager class

