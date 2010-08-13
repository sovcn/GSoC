============================
accelerometer.clearWatch()
============================

.. highlight:: javascript


The accelerometer.clearWatch() function is used to cancel the watch loop started by :doc:`watchAcceleration`.

clearWatch() Example
************************************

This is a basic example of the functionality of the clearWatch() method used in conjunction with watchAcceleration()::

   require('dojo.sensor.accelerometer');
   
   var watchId; // Keep watchId in global scope
   
   dojo.addOnLoad(function(){
   
   	watchId = dojo.sensor.accelerometer.watchAcceleration({
   		success: function(a){
   			console.log("acceleration information has been retrieved: "
   			+ "(x:" + a.x + " y:" + a.y + " z:" + a.z + ").");
   			
   			// Orientation property only available when getOrientation: true has been passed in the options parameter
   			if( a.orientation == dojo.sensor.accelerometer.LANDSCAPE ){
   				console.log("Current orientation is landscape").
   			}else{
   				console.log("Current orientation is portrait").
   			}
   		},
   		error: function(error){
   			console.error(error.message);
   		}
   	},{});
   
   });
   
   // When this function is called, the success callback function will cease to be called.
   function clearWatch(){
   	dojo.sensor.accelerometer.clearWatch(watchId);
   }


Parameters
*************************

watchId (Integer)
--------------------------
watchId is a unique identifier that was saved after calling :doc:`watchAcceleration`.
