dojo.require('dojo.sensor');
dojo.provide("dojo.sensor.accelerometer");

/*=====
dojo.sensor.accelerometer = { 
  // summary:
  //    provides an interface for accessing the accelerometer of a given device.
};
=====*/

// Acceleration constants
dojo.sensor.accelerometer = {
	LANDSCAPE: 1,
	PORTRAIT: 2
}

dojo.sensor.accelerometer.orientation = dojo.sensor.accelerometer.PORTRAIT; // default to portrait
dojo.sensor.accelerometer.orientationCount = 0; // Keeps track of the number of times in a row an orientation is registered
												// used to 'debounce' the orientation change detector.

// Prevents the onShake method from activating after the first acceleration
dojo.sensor.accelerometer.firstAcceleration = true;

// Keeps track of the previous acceleration
dojo.sensor.accelerometer.lastAcceleration = {x:0, y:0, z:0};

// Define error constants

if( dojo.sensor.isLoaded() && dojo.sensor.getPlatform() == dojo.sensor.platforms.NATIVE ){
	// Device must be running a platfrom like Phonegap for acceleration to work
	console.error("Accelerometer is currently not supported on any native platforms.");
}else{
	// DO nothing, platform should be supported.
	// TODO: Keep this updated as more platforms are added.
}


dojo.sensor.accelerometer.clearWatch = function(){
	// summary:
	//		Takes the stored timer identifier and discontinues the setInterval method called by PhoneGap
	if( dojo.sensor.accelerometer.timer ){
		// Make sure that the accelerometer watch has been activated.
		clearInterval(dojo.sensor.accelerometer.timer);
	}else{
		console.error("Error: Cannot clear the accelerometer watch when it is not running.");
	}
}

dojo.sensor.accelerometer.watchAccelerometer = function(/*Function*/callback, /*Function*/error_callback, /*Object*/options){
	if ( dojo.sensor.getPlatform() == dojo.sensor.platforms.NATIVE) {
		error = dojo.sensor.error;
		error.code = error.UNSUPPORTED_FEATURE;
		error.message = "Error: Accelerometer is currently not supported on any native platforms.";

		return error_callback(error);
	}else{
		// summary:
		//		
		// options: Object
		//		frequency, detect_orientation, on_orient_change (callback), 
		
		if( options != undefined && typeof(options) == "object" ){
			// Set up options object
			var accel_options = {
				getOrientation: false,
			}
			
			accel_options.frequency = (options.frequency != undefined)? options.frequency : 1000; // Defaults to 1/10 of a second
			accel_options.getOrientation = (options.getOrientation != undefined)? options.getOrientation : false; // defaults to false
			
			// Ensure that on_orient_change is a function
			accel_options.onOrientChange = (typeof(options.onOrientChange) == "function")? options.onOrientChange : function(){};
			if( accel_options.onOrientChange ){
				accel_options.getOrientation = true;
			}
			
			accel_options.onShake = (typeof(options.onShake) == "function")? options.onShake : function(){};
			
		}else{
			accel_options = {};
		}

  			dojo.sensor.accelerometer.timer = navigator.accelerometer.watchAcceleration(function(a){
  			
  			var blockShake = false;
  			
  			if( accel_options.getOrientation == true ){
  				var last_orientation = dojo.sensor.accelerometer.orientation;
  				var orientation = dojo.sensor.accelerometer.determineOrientation(a);
  				a.orientation = dojo.sensor.accelerometer.orientation;
  				
  				if( accel_options.onOrientChange && orientation != last_orientation ){
  					accel_options.onOrientChange(orientation);
  					blockShake = true;
  				}
  			}
  			
  			if( accel_options.onShake != undefined && dojo.sensor.accelerometer.firstAcceleration != true && blockShake != true ){
  				var shake = dojo.sensor.accelerometer.determineShake(a);
  				if( shake == true ){
  					accel_options.onShake();
  				}
  			}
  			
  			dojo.sensor.accelerometer.firstAcceleration = false;
  			
  			callback(a);
  			
  			dojo.sensor.accelerometer.lastAcceleration = a; // keep track of the previous acceleration for various purposes.
  			
  			return;
  		},function(error){
  			return error_callback(error);
  		},accel_options);
		
	}
}

dojo.sensor.accelerometer.determineOrientation = function(/*Acceleration Object*/ a){
	// summary:
	//		Based on the values passed to it by its parameter, it determines which orientation (Portrait or Landscape)
	//		the device is currently in.  Returns an Integer value in the form of a constant (1=Landscape, 2=Portrait).
	//	a: Acceleration Object
	//		This object contains at least three data members and often times four.  The first three are required and are the
	//		three directional acceleration parameters (x, y, and z).  The fourth variable which is optional is the orientation
	//		constant associated with the three acceleration parameters (1=Landscape, 2=Portrait).
	
	// TODO - Optimize the detection methods

	if( dojo.sensor.accelerometer.orientation == dojo.sensor.accelerometer.PORTRAIT ){
		// portrait
		if( ( a.x > 7.5 && a.y < 6 ) || ( a.y < 1.5 && a.x > 3.5 ) ){
			// Orientation is likely portrait
			dojo.sensor.accelerometer.orientationCount++;
			
			// Make sure that the device has been in place for _ watch periods to make sure it was intended by the user.
			if( dojo.sensor.accelerometer.orientationCount == 2 ){
				dojo.sensor.accelerometer.orientation = dojo.sensor.accelerometer.LANDSCAPE;
				dojo.sensor.accelerometer.orientationCount = 0;
			}
		}
		 // no change
	}else{
		// Orientation is likely landscape
		
		if( ( a.y > 7.2 && a.x < 6 ) || (a.x < 1.5 && a.y > 3.5) ){
			
			dojo.sensor.accelerometer.orientationCount++;
			
			// Make sure that the device has been in place for _ watch periods to make sure it was intended by the user.
			if( dojo.sensor.accelerometer.orientationCount == 2 ){
				dojo.sensor.accelerometer.orientation = dojo.sensor.accelerometer.PORTRAIT;
				dojo.sensor.accelerometer.orientationCount = 0;
			}
		}
		
	}
	
	return dojo.sensor.accelerometer.orientation;
}

dojo.sensor.accelerometer.determineShake = function(a){
	
	var detectOrientChange = Math.abs(a.y - dojo.sensor.accelerometer.lastAcceleration.y) > 5;
	
	// Try to determine whether or not the user has been shaking the device. TODO fine tune this
	if( ( a.x > 10 || Math.abs(a.x - dojo.sensor.accelerometer.lastAcceleration.x) > 6 ) && dojo.sensor.accelerometer.initShake != true && detectOrientChange != true ){
		
		if( Math.abs(a.x - dojo.sensor.accelerometer.lastAcceleration.x) > 7  ){
			//alert('yep');
		}
		dojo.sensor.accelerometer.initShake = true;
		
		setTimeout(function(){
			dojo.sensor.accelerometer.initShake = false;
			//alert('set to false');
		},1500); // Prevent further shake operations for a second and a half - TODO test for proper duration	
		
		return true;
	}
	
	return false;
	
}