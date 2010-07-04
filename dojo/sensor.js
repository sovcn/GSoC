dojo.sensor = {
		platforms: {
			NATIVE: 1,
			PHONE_GAP: 2,
			JIL: 3
		},
		error: {
			PERMISSION_DENIED: 1,
			POSITION_UNAVAILABLE: 2,
			TIMEOUT: 3,
			UNSUPPORTED_FEATURE: 4,
			IMPROPER_IMPLEMENTATION: 5,
			APPLICATION_ERROR: 6,
			DEVICE_ERROR: 7,
			code: 0, // Individual Error Code
			message: "" // Error message for debugging
		},
		getPlatform: function(){
			if( this._platform )
				return this._platform;
		},
		isLoaded: function(){
			if( this._loaded )
				return this._loaded;
			else
				return false;
		}
	};

	dojo.sensor._platform = dojo.sensor.platforms.NATIVE; // Defaults to native

	dojo.addOnLoad(function(){
		dojo.sensor._loaded = true;
		
		if( typeof(PhoneGap) == "object" ){
			dojo.sensor._platform = dojo.sensor.platforms.PHONE_GAP;
		}else if( typeof(Widget) == "object" ){
			dojo.sensor._platform = dojo.sensor.platforms.JIL;
		}else{
			// No change, defaults to native.
		}

	});
		// summary:
		//		Run a check to find out which platform is being loaded

