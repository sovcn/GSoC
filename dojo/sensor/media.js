
dojo.provide("dojo.sensor.media");

/*=====
dojo.sensor.accelerometer = { 
  // summary:
  //    provides an interface for accessing the accelerometer of a given device.
};
=====*/


// Define error constants

if( dojo.sensor.isLoaded() && dojo.sensor.getPlatform() == dojo.sensor.platforms.NATIVE ){
	// Device must be running a platfrom like Phonegap for acceleration to work
	console.error("Camera is currently not supported on any native platforms.");
}else{
	// DO nothing, platform should be supported.
	// TODO: Keep this updated as more platforms are added.
	(function(){
		
		dojo.sensor.media = {
				
		};
		
		dojo.sensor.media.captureImage = function(callback, options){
			
			if( !options || typeof(options) != "object" ){
				options = {};
			}
			
			if( options.quality == undefined ){
				options.quality = 50;
			}
			
			if( options.maxNumberOfMediaFiles == undefined ){
				options.maxNumberOfMediaFiles = 1;
			}
			
			if( dojo.sensor.getPlatform() == dojo.sensor.platforms.PHONE_GAP ){
				navigator.camera.getPicture(function(data){
					
					if( options.saveToDisk != undefined ){
						dojo.xhrGet({
							url: options.saveToDisk,
							handleAs: "text",
							load: function(data){
								if( data == "success" ){
									callback.success(data);
								}else{
									// Error 
									var error = dojo.sensor.error;
									error.code = error.APPLICATION_ERROR;
									error.message = "File request failed on the server-side."
									
									// Handle Error
									return callback.error(error, location_support);
								}
					   		},
					   		error: function(error){
					   			var error = dojo.sensor.error;
								error.code = error.APPLICATION_ERROR;
								error.message = "File request failed on the client-side."
								
								// Handle Error
								return callback.error(error, location_support);
					   		}
					   });
					}
					
					callback.success(data);
				}, function(error){
					callback.error(error);
				}, { quality: options.quality });
			}else{
				// Attempt a native method
				navigator.device.captureImage(function(data){
					callback.success(data);
				},function(error){	
					callback.error(error);
				},
				options);
			}
		}
		
		dojo.sensor.media.captureVideo = function(callback, options){
			
		}
		
		dojo.sensor.media.captureAudio = function(callback, options){
			
		}
		
		dojo.sensor.media.getViewFinder = function(callback, options){
			
		}
		
	})();
} // end else

