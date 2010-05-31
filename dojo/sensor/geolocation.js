dojo.provide("dojo.sensor.geolocation");

/*=====
dojo.sensor.geolocation = { 
  // summary:
  //    provides an interface for accessing the geographical location of a user.
};
=====*/

// Define error constants
dojo.sensor.geolocation.error = {
	PERMISSION_DENIED: 1,
	POSITION_UNAVAILABLE: 2,
	TIMEOUT: 3,
	UNSUPPORTED_FEATURE: 4,
	code: 0, // Individual Error Code
	message: "" // Error message for debugging
}

dojo.sensor.geolocation.clearWatch = function(/*Integer*/ watchId){
	// summary:
	//		Wrapper function for the W3C implementation.
	//	description:
	//		Stops the watchPosition function from looking for changes in the user's location.
	//	watchId: Integer
	//		A unique identifier for each watchPosition loop.
	navigator.geolocation.clearWatch(watchId);
}

dojo.sensor.geolocation.watchPosition = function(/*Function*/callback, /*Function*/ error_callback, /*Object*/ options){
	// summary:
	//		watchPosition utilizes several methods which will monitor a user's geolocation and will fire a callback
	//		any time their position changes. Utilizes the W3C navigator.geolocation interface.  Returns an identifier
	//		that can be used to stop the method from monitoring the user's location.
	// callback: Function
	//		The function that will be called when a location is succesfully found and loaded
	// error_callback: Function
	//		The function that will be called when an error occurs.  Errors can come from two sources: geolocation methods and improper usage
	//	options: Object
	//		This is a javascript object holding various information for use with this function. Any values can be passed
	//		with the options object however three common key values are as follows: enableHighAccuracy, timeout, maximumAge.
	//
	//		enableHighAccuracy: boolean
	//			Tells the position methods to attempt to retrieve the most accurate position information possible.  This is commonly
	//			disabled when one wants to preserve battery life on mobile devices as a false value on this key will allow
	//			the geolocation method to make use of more energy efficient methods as opposed to GPS.
	//		timeout: Integer
	//			Specifies the maximum ammount of time that the geolocation methods can spend attempting to find
	//			the correct geolocation information before the error_callback function is called.
	//		maximumAge: Integer
	//			Location information is often cached by the browser.  Maximum age allows the programmer to specify how old
	//			cache information is used before it must be replaced by new information.
	
	if (options) {
		options.watchPosition = true;

	}else{
		options = {
			watchPositiong: true
		}
	}
	
	// Keep track of the watch_id value for later use.
	var watch_id = dojo.sensor.geolocation.getPosition(callback, error_callback, options);
	console.log(watch_id);
	options.watchPosition = false;
	return watch_id;
}

dojo.sensor.geolocation.getPosition = function(/*Function*/ callback, /*Function*/ error_callback, /*PositionOptions*/options, /*Position*/ default_position){
    // summary:
	//		watchPosition utilizes several methods which will monitor a user's geolocation and will fire a callback
	//		any time their position changes. Utilizes the W3C navigator.geolocation interface.
	// callback: Function
	//		The function that will be called when a location is succesfully found and loaded
	// error_callback: Function
	//		The function that will be called when an error occurs.  Errors can come from two sources: geolocation methods and improper usage
	//	options: Object
	//		This is a javascript object holding various information for use with this function. Any values can be passed
	//		with the options object however three common key values are as follows: enableHighAccuracy, timeout, maximumAge.
	//
	//		enableHighAccuracy: boolean
	//			Tells the position methods to attempt to retrieve the most accurate position information possible.  This is commonly
	//			disabled when one wants to preserve battery life on mobile devices as a false value on this key will allow
	//			the geolocation method to make use of more energy efficient methods as opposed to GPS.
	//		timeout: Integer
	//			Specifies the maximum ammount of time that the geolocation methods can spend attempting to find
	//			the correct geolocation information before the error_callback function is called.
	//		maximumAge: Integer
	//			Location information is often cached by the browser.  Maximum age allows the programmer to specify how old
	//			cache information is used before it must be replaced by new information.
        
        var location_support;

        if(navigator.geolocation){
			
            // Browser is capable of geolocation
            location_support = true;
			
			// Allows developers to optionally specify several of the options allowed for in
			// the W3C spec.
			// Abritrary key values can also be passed with options.  Unused option values will be
			// ignored.
			if (options) {
				var position_options = {
					enableHighAccuracy: options.enableHighAccuracy, // Boolean
					timeout: options.timeout, // Long
					maximumAge: options.maximumAge // Long
				}
			}else{
				// If no options have been specified, initalize the position options to be passed to
				// the geolocation functions to null to ensure proper parameter initilization.
				var position_options = null;
			}
			
			if (options.watchPosition) {
				// watchPosition was called.  Implement geolocation.watchPosition
				console.log("navigator.geolocation.watchPosition()");
				var watch_id = navigator.geolocation.watchPosition(function(position){
					console.log("callback");
					callback(position, false); // Callback Function
					return;
				},function(error){
					dojo.sensor.geolocation.handleError(error, location_support);
					return error_callback(error, location_support); // Error Callback Function
				}, position_options);
				console.log(watch_id);
				return watch_id;
			}else {
				// watchPosition was not called.  Implement geolocation.getCurrentPosition
				console.log("navigator.geolocation.getCurrentPosition()");
				navigator.geolocation.getCurrentPosition(function(position){
					return callback(position, false); // Callback Function
				}, function(error){
					dojo.sensor.geolocation.handleError(error, location_support);
					
					return error_callback(error, location_support); // Error Callback Function
				}, position_options);
			}
			
        }else if( false ){ // google.gears ){
            // Try Google Gears - Fails in Safari... find workaround
            location_support = true;
            // TODO - Implement Gears support
        }else{
            
            // Browser is incapable of geolocation...
            location_support = false;
			
			if( options.watchPosition ){
				error = dojo.sensor.geolocation.error;
				error.code = error.UNSUPPORTED_FEATURE;
				error.message = "Error: watchPosition requires a compatible browser. Default location not supported.";
				
				dojo.sensor.geolocation.handleError(error, location_support);
				return error_callback(error, location_support);
			}
			
			if ( default_position ) {
				
				// Set default coordinates for graceful degredation
				
				/* If a default position was passed, load it into a valid position
				 * object and return it to the callback function.
				 */
				var coords = default_position.coords;
				
				var pos = {
					coords: {
						latitude: coords.latitude,
						longitude: coords.longitude,
						altitude: coords.altitude,
						accuracy: coords.accuracy,
						altitude_accuracy: coords.altitude_accuracy,
						heading: coords.heading, // North
						speed: coords.speed // Not moving
					},
					timestamp: default_position.timestamp
				};
				
				callback(pos, true);
			}
			else{
				// If no default coordinates were found return with an error
				var error = dojo.sensor.geolocation.error;
				error.code = error.POSITION_UNAVAILABLE;
				error.message = "Error: browser does not support geolocation and no default position was specified."
				
				// Handle Error
				dojo.sensor.geolocation.handleError(error, location_support);
				return error_callback(error, location_support);
			}
        }
    }
    
dojo.sensor.geolocation.handleError = function(/*Object*/ error, /*Boolean*/ browser_supported){
        // TODO - Proper error handling should be implemented.  console.log?
        //alert('An Error Occured: code' + error.code);
		// This function is called in conjunction with an error callback function.  May be overridden and used for additional error handling.
		
    }