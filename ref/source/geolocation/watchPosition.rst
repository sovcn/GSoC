.. highlight:: javascript

============================
geolocation.watchPosition()
============================

The geolocation.watchPosition() function is designed to allow developers to repeatedly request new location information.
After each new request, the success callback function is called with an updated :ref:`position-object-label`.

watchPosition utilizes the same basic structure as :doc:`getPosition`. 
For information regarding its customization and callback functions please see :doc:`getPosition`.

.. note::
	geolocation.watchPosition() returns a unique identifier which can be passed to :doc:`clearWatch` in order to cancel the watch.

watchPosition() Example
************************************

This is a basic example of the functionality of the watchPosition() method::

   require('dojo.sensor.geolocation');
   
   // Utilizes the same basic structure as getPosition()
   
   dojo.addOnLoad(function(){
   	var options = {
   		timeout: 6000, // wait 6 seconds before returning with an error
   		enableHighAccuracy: true, // may drain the battery of mobile devices faster
   		getHeading: true,
   		onHeadingChange: function(heading){
   			alert('the heading has changed to: ' + heading);
   		}
   	}
   	
   	// The only real difference between this and getPosition() is that this will call
   	// the success callback function repeatedly.
   	var watch_id = dojo.sensor.geolocation.watchPosition({ // keep track of watch_id so that the watch can be canceled later if need be.
   		success: function(position){
   			console.log(position.coords.latitude + " " + position.coords.longitude);
   		},
   		error: function(error){
   			console.error(error.message);
   		}
   	},
   	options);
   
   });