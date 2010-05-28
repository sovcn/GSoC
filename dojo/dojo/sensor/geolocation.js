dojo.provide("dojo.sensor.geolocation");

/*=====
dojo.sensor.geolocation = { 
  // summary:
  //    provides an interface for accessing the geographical location of a user
};
=====*/

dojo.sensor.geolocation.getPosition = function(/*Function*/callback, /*Function*/error_callback){
        // summary:
        //    uses one of several different methods for determining the current geographical location
        //    of the use browsing the website.
        //  callback: Function
        
        var location_support;

        if(navigator.geolocation){

            // Browser is capable of geolocation
            location_support = true;

            navigator.geolocation.getCurrentPosition(

                function(position) {
                    return callback(position, false); // Callback Function

                }, function(error){
                    dojo.sensor.geolocation.handle_error(error, location_support);
                    
                    return error_callback(error, location_support); // Error Callback Function
                });
        }else if( false ){ // google.gears ){
            // Try Google Gears - Fails in Safari... find workaround
            location_support = true;
            // TODO - Implement Gears support
        }else{
            
            // Browser is incapable of geolocation...
            location_support = false;

            // Set default coordinates for graceful degredation
            var current_lat = 41.1544;
            var current_lon = -80.1229;

            
            var pos = {
                coords: {
                    latitude: current_lat,
                    longitude: current_lon,
                    altitude: 5000,
                    accuracy: 5000,
                    altitude_accuracy: 5000,
                    heading: 0, // North
                    speed: 0 // Not moving
                },
                timestamp: new Date().getTime()
            };
             
            callback(pos, true);
            // Notify user
            //this.handle_error(null, location_support);
        }
    }
    
dojo.sensor.geolocation.handleError = function(/*Object*/ error_code, /*Boolean*/ browser_supported){
        // TODO - Proper error handling should be implemented.  console.log?
        alert('An Error Occured');
    }