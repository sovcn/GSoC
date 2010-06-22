dojo.require('dojo.sensor');
dojo.provide("dojo.sensor.accelerometer");



if( dojo.sensor.isLoaded() && dojo.sensor.getPlatform() == dojo.sensor.platforms.NATIVE ){
	// Device must be running a platfrom like Phonegap for acceleration to work
	console.error("Accelerometer is currently not supported on any native platforms.");
}else{
	// DO nothing, platform should be supported.
	// TODO: Keep this updated as more platforms are added.
}

/*=====
dojo.sensor.accelerometer = { 
  // summary:
  //    provides an interface for accessing the accelerometer of a given device.
};
=====*/


(function(){
	
	// Orientation Constants
	dojo.sensor.accelerometer.LANDSCAPE = 1;
	dojo.sensor.accelerometer.PORTRAIT = 2;
	
	var _orientation = dojo.sensor.accelerometer.PORTRAIT; // default to portrait
	var _orientationCount = 0;// Keeps track of the number of times in a row an orientation is registered
							// used to 'debounce' the orientation change detector.
	
	// Prevents the onShake method from activating after the first acceleration
	var _firstAcceleration = true;

	// Keeps track of the previous acceleration
	var _lastAcceleration = {x:0, y:0, z:0};
	
	var _timer = undefined; // Keeps track of the interval timer for the watch so that it can be cleared later if need be.
	
	var _initShake = false; // Keeps track of whether or not a shake has been initiated. Used to prevent multiple shakes (debounces shake)

	
	var determineOrientation = function(/*Acceleration Object*/ a){
		// summary:
		//		Based on the values passed to it by its parameter, it determines which orientation (Portrait or Landscape)
		//		the device is currently in.  Returns an Integer value in the form of a constant (1=Landscape, 2=Portrait).
		//	a: Acceleration Object
		//		This object contains at least three data members and often times four.  The first three are required and are the
		//		three directional acceleration parameters (x, y, and z).  The fourth variable which is optional is the orientation
		//		constant associated with the three acceleration parameters (1=Landscape, 2=Portrait).
		
		// TODO - Optimize the detection methods

		if( _orientation == dojo.sensor.accelerometer.PORTRAIT ){
			// portrait
			if( ( a.x > 7.5 && a.y < 6 ) || ( a.y < 1.5 && a.x > 3.5 ) ){
				// Orientation is likely portrait
				_orientationCount++;
				
				// Make sure that the device has been in place for _ watch periods to make sure it was intended by the user.
				if( _orientationCount == 2 ){
					_orientation = dojo.sensor.accelerometer.LANDSCAPE;
					_orientationCount = 0;
				}
			}
			 // no change
		}else{
			// Orientation is likely landscape
			
			if( ( a.y > 7.2 && a.x < 6 ) || (a.x < 1.5 && a.y > 3.5) ){
				
				_orientationCount++;
				
				// Make sure that the device has been in place for _ watch periods to make sure it was intended by the user.
				if( _orientationCount == 2 ){
					_orientation = dojo.sensor.accelerometer.PORTRAIT;
					_orientationCount = 0;
				}
			}
			
		}
		
		return _orientation;
	}
	
	var determineShake = function(a){
		
		// Should be true if an orientation change is occuring. Prevents it from being detected as a shake
		// Shake is a rapid change in x, but not y
		var detectOrientChange = Math.abs(a.y - _lastAcceleration.y) > 5;
		
		// Try to determine whether or not the user has been shaking the device. TODO fine tune this
		if( ( a.x > 10 || Math.abs(a.x - _lastAcceleration.x) > 6 ) && _initShake != true && detectOrientChange != true ){
			
			
			_initShake = true;
			
			setTimeout(function(){
				_initShake = false;
				//alert('set to false');
			},1500); // Prevent further shake operations for a second and a half - TODO test for proper duration	
			
			return true;
		}
		
		return false;
		
	}
	
	dojo.sensor.accelerometer.watchAccelerometer = function(/*Object*/ callback, /*Object*/ options){
		if ( dojo.sensor.getPlatform() == dojo.sensor.platforms.NATIVE) {
			error = dojo.sensor.error;
			error.code = error.UNSUPPORTED_FEATURE;
			error.message = "Error: Accelerometer is currently not supported on any native platforms.";
			

			return callback.error(error);
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
				
				if( callback.orientationChange != undefined && typeof(callback.orientationChange) == "function" ){
					accel_options.getOrientation = true;
				}
				
				//callback.watchShake = (typeof(callback.watchShake) == "function")? callback.watchShake : function(){};
				
			}else{
				accel_options = {};
			}

	  		_timer = navigator.accelerometer.watchAcceleration(function(a){
	  			
	  			var blockShake = false;  // Temp value .. goes out of scope
	  			
	  			if( accel_options.getOrientation == true ){
		  			var prevOrientation = _orientation;
		  			 determineOrientation(a); // Sets _orientation to calculated
		  			
		  			a.orientation = _orientation; // Update the acceleration object with the calculated orientation
		  			
		  			if( typeof(callback.orientationChange) == "function"  && _orientation != prevOrientation){
	  					callback.orientationChange(_orientation);
	  					blockShake = true; // Prevent a shake from occuring until the next loop
	  				}
	  			}
	  			
	  			if( typeof(callback.shake) == "function" && _firstAcceleration != true && blockShake != true ){
	  				var shake = determineShake(a);
	  				if( shake == true ){
	  					callback.shake();
	  				}
	  			}
	  			
	  			_firstAcceleration = false;
	  			
	  			if( device.platform == "iPod touch" || device.platform == "iPhone" ){
	  				// Translate the values to match with Android
	  				a.x *= -10;
	  				a.y *= -10;
	  				a.z *= -10;
	  			}
	  			
	  			callback.success(a);
	  			
	  			_lastAcceleration = a;
	  			
	  			return;
	  				
	  			
	  		},function(error){
	  			return callback.error(error);
	  		},accel_options);
			
		}
	}
	
}
)();