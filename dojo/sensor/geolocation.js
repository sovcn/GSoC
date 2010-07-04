dojo.require("dojo.sensor");
dojo.provide("dojo.sensor.geolocation");

dojo.require("dojo.gears");
/*=====
dojo.sensor.geolocation = { 
  // summary:
  //    provides an interface for accessing the geographical location of a user.
};
=====*/

(function(){
	
	var jilWatch = false;  // Bolean value to determine whether a JIL watchPosition has been initiated
	var geolocationWatchId = []; // Keep track of the various watch ids
	
	var handleError = function(/*Object*/ error, /*Boolean*/ browser_supported){
        // TODO - Proper error handling should be implemented.  console.log?
        //alert('An Error Occured: code' + error.code);
		// This function is called in conjunction with an error callback function.  May be overridden and used for additional error handling.
		
	}
	
	// Direction Constants
	dojo.sensor.geolocation = {
			NORTH: 1,
			NORTH_EAST: 2,
			EAST: 3,
			SOUTH_EAST: 4,
			SOUTH: 5,
			SOUTH_WEST: 6,
			WEST: 7,
			NORT_WEST: 8,
			last_heading: null
	};
	
	dojo.sensor.geolocation.clearWatch = function(/*Integer*/ watchId){
		// summary:
		//		Wrapper function for the W3C implementation.
		//	description:
		//		Stops the watchPosition function from looking for changes in the user's location.
		//	watchId: Integer
		//		A unique identifier for each watchPosition loop.
		
		// Clear W3C watches
		if(watchId){
			navigator.geolocation.clearWatch(watchId);
		}
		
		// Clear all JIL watches
		jilWatch = false;
	}
	
	dojo.sensor.geolocation.watchPosition = function(/*Function*/callback, /*Object*/ options){
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
				watchPosition: true
			};
		}
		
		if( dojo.sensor.getPlatform() == dojo.sensor.platforms.JIL ){
			jilWatch = true;
		}
		
		// Keep track of the watch_id value for later use.
		var watch_id = dojo.sensor.geolocation.getPosition(callback, options);
		
		geolocationWatchId.push(watch_id);
		
		options.watchPosition = false;
		return watch_id;
	}
	
	dojo.sensor.geolocation.getPosition = function(/*Object*/ callback, /*PositionOptions*/options, /*Position*/ default_position){
	    // summary:
		//		watchPosition utilizes several methods which will monitor a user's geolocation and will fire a callback
		//		any time their position changes. Utilizes the W3C navigator.geolocation interface.
		// callback: Function
		//		The function that will be called when a location is succesfully found and loaded
		//		Callback should take at most two parameters.
		//			position: A position object as outlined by the W3C spec
		//			location_support: A boolean value which indicates whether a position has been found by geolocation(false) or by 
		//				other means(true) such as specifying a default location.
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
		//		default_position: Position Object
		//			Conforms to the W3C position interface spec. Allows the programmer to specify a default position to be used
		//			when the user's browser does not support geolocation.  If this is not passed and the browser is not supported,
		//			an error will be generated instead.
			
		
	        var location_support;
			
			if( typeof(callback.success) != 'function' ){
				var error = dojo.sensor.error;
				error.code = error.IMPROPER_IMPLEMENTATION;
				error.message = "Error: callback parameter must be a function - geolocation.getPosition()";
				console.error(error.message); // Notify debugger
				callback.success = function() {}; // Ensure that API does not try to perform a call on something that isn't a function
			}
		
			if( typeof(callback.error) != 'function' ){
				callback.error = function() {};
			}
			
	        if(navigator.geolocation || dojo.sensor.getPlatform() == dojo.sensor.platforms.JIL){
				
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
						maximumAge: options.maximumAge, // Long
						getHeading: options.getHeading, // Boolean
						onHeadingChange: options.onHeadingChange, // Callback function for when the heading changes "significantly"
						frequency: options.frequency
					}
				}else{
					// If no options have been specified, initalize the position options to be passed to
					// the geolocation functions to null to ensure proper parameter initilization.
					var position_options = {};
				}
				
				// Default success function
				var success = function(position){
					if(position_options.getHeading){
				    	position.coords.simpleHeading = Math.round(position.coords.heading/45 + 1);
				    	if( position.coords.simpleHeading >= 9 ){
				    		position.coords.simpleHeading = 1;
				    	}
				    	
				    	if( typeof(position_options.onHeadingChange) == "function" && dojo.sensor.geolocation.last_heading != null 
			    				&& position.coords.simpleHeading != dojo.sensor.geolocation.last_heading){
				    		position_options.onHeadingChange(position.coords.simpleHeading);
				    	}
				    }
					
					callback.success(position, false); // Callback Function
					
					dojo.sensor.geolocation.last_heading = position.coords.simpleHeading; // Keep track of the last heading for callback function
					
					return;
				};
				
				// Define default error function
				var err = function(error){
					handleError(error, location_support);
					
					return callback.error(error, location_support); // Error Callback Function
				};
				
				// Determine whether watch or get should be used
				if (options && options.watchPosition) {
					// watchPosition was called.  Implement geolocation.watchPosition
					if( dojo.sensor.getPlatform() == dojo.sensor.platforms.JIL ){
						
						Widget.Device.DeviceStateInfo.onPositionRetrieved = function(loc, method){
							
							if( !loc.latitude && !loc.longitude ){
								var error = dojo.sensor.error;
								error.code = error.POSITION_UNAVAILABLE;
								error.message = "Error: Unable to find location."
								return err(error, true);
							}
							
							var pos = packageJilLocation(loc);
							

							success(pos);

							if( position_options.frequency == undefined ){
								position_options.frequency = 1000;
							}
							// Timeout
							position_options.watchPosition = true;
							
							if( jilWatch == true ){
								setTimeout('Widget.Device.DeviceStateInfo.requestPositionInfo("gps")', position_options.frequency);
							}
							else{
								// No timeout.  Last update
							}
					
						};
						Widget.Device.DeviceStateInfo.requestPositionInfo("gps");
						
					}else{
						// W3C Implementation
						var watch_id = navigator.geolocation.watchPosition(success, err, position_options);
					}
					return watch_id;
				}else {
					// watchPosition was not called.  Implement geolocation.getCurrentPosition
					if( dojo.sensor.getPlatform() == dojo.sensor.platforms.JIL ){
						
							Widget.Device.DeviceStateInfo.onPositionRetrieved = function(loc, method){
								
								/* JIL error handling */
								if( !loc.latitude && !loc.longitude ){
									var error = dojo.sensor.error;
									error.code = error.POSITION_UNAVAILABLE;
									error.message = "Error: Unable to find location.";
									return err(error, true);
								}
								
								// Convert JIL locationInfo into W3C position object.
								var pos = packageJilLocation(loc);
								
								// success callback function
								success(pos);
							};
							
							Widget.Device.DeviceStateInfo.requestPositionInfo("gps");
						
					}else{
						navigator.geolocation.getCurrentPosition(success, err, position_options);
					}
				}
				
	        }else if( dojo.gears.available ){ // google.gears ){
	            // Try Google Gears - Fails in Safari... find workaround
	            location_support = true;
				alert('using Gears - TODO implement gears support');
	            // TODO - Implement Gears support
	        }else{
	            
	            // Browser is incapable of geolocation...
	            location_support = false;
				
				if( options.watchPosition ){
					error = dojo.sensor.error;
					error.code = error.UNSUPPORTED_FEATURE;
					error.message = "Error: watchPosition requires a compatible browser. Default location not supported.";
					
					handleError(error, location_support);
					return callback.error(error, location_support);
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
					
					callback.success(pos, true); // Pass true as the second parameter to indicate that the a default location has been loaded.
				}
				else{
					// If no default coordinates were found return with an error
					
					var error = dojo.sensor.error;
					error.code = error.POSITION_UNAVAILABLE;
					error.message = "Error: browser does not support geolocation and no default position was specified."
					
					// Handle Error
					handleError(error, location_support);
					return callback.error(error, location_support);
				}
	        }
	    }
	
	function packageJilLocation(/*JIL locationInfo*/ loc){
		// summary: packages a JIL locationInfo object into a W3C position object
		
		var pos = {
				coords: {
					latitude: loc.latitude,
					longitude: loc.longitude,
					altitude: loc.altitude,
					accuracy: loc.accuracy,
					altitudeAccuracy: loc.altitudeAccuracy,
					heading: null, // North
					speed: null // Not moving
				},
				timestamp: loc.timestamp
			};
		return pos;
		
	}
	    
})();
