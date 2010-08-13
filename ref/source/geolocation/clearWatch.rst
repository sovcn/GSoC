.. highlight:: javascript

============================
geolocation.clearWatch()
============================

The geolocation.clearWatch() function is used to cancel the watch loop started by :doc:`watchPosition`.

clearWatch() Example
************************************

This is a basic example of the functionality of the clearWatch() method used in conjunction with watchPosition()::

   require('dojo.sensor.geolocation');
   
   // Keep track of watchId on global scope
   var watchId;
   
   dojo.addOnLoad(function(){
   // keep track of watchId so that the watch can be canceled later if need be.
   	watchId = dojo.sensor.geolocation.watchPosition({
   		success: function(position){
   			console.log(position.coords.latitude + " " + position.coords.longitude);
   		},
   		error: function(error){
   			console.error(error.message);
   		}
	   	},
	   	options);
   
	});
   
   });
   
   // When this function is called, the success callback function will cease to be called.
   function clearWatch(){
   	dojo.sensor.geolocation.clearWatch(watchId);
   }


Parameters
*************************

watchId (Mixed)
--------------------------
watchId is a unique identifier that was saved after calling :doc:`watchPosition`.  Depending on the platform it could be either an Object(Palm WebOS) or an Integer(Native and others).
Usage of this function is the same for both platforms and should not change anything.

