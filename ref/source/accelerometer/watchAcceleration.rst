.. highlight:: javascript

==================================
accelerometer.watchAcceleration()
==================================


watchAcceleration() Example
************************************

This is a basic example of the functionality of the watchAcceleration() method::

   require('dojo.sensor.accelerometer');
   
   dojo.addOnLoad(function(){
   
   	dojo.sensor.accelerometer.watchAcceleration({
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
   		},
   		shake: function(){
   			alert('SHAKE!');
   		},
   		orientationChange: function(orientation){
   			if( orientation == dojo.sensor.accelerometer.PORTRAIT ){
   				alert('The orientation has switched to portrait');
   			}else{
   				alert('The orientation has switched to landscape');
   			}
   		}
   	},{
   		frequency: 1000, // update very second
   		getOrientation: true // Includes orientation as a property of the acceleration object
   	});
   
   });


Parameters
*************************

Callback (object)
--------------------------
The callback parameter provides an interface of several functions for the developer to interact with the geolocation module. The two properties supported by
the geolocation callback object are as follows:

* **success** (Function)
	This is called whenever the API has successfully retrieved and parsed a :ref:`acceleration-object-label`. It receives the resulting :ref:`acceleration-object-label` as a parameter.
	
* **error** (Function)
	This function is called whenever an error is encountered and receives a sensor.error(TODO - LINK) object as a parameter.
	
* **shake** (Function)
	This function will be called whenever the API has determined that the device has been moved rapidly in opposite directions (ie shaken).
	
* **orientationChange** (Function)
	This will be called whenever the :doc:`Orientaiton <../accelerometer>` (Portrait/Landscape) of the device changes. **Receives an orientation constant as its parameter**


.. _acceleration-object-label:

Acceleration Object
=============================

The position object conforms to the `W3C accelerometer event interface`_.

.. _W3C accelerometer event interface: http://dev.w3.org/geo/api/spec-source-orientation.html#accelerometer_event

.. _W3C acceleration information: http://dev.w3.org/geo/api/spec-source-orientation.html

.. note::
	For more information regarding the meaning of these properties, please consult the `W3C acceleration information`_.

Properties:
	
	* **x** (double)
		Represents the acceleration on the device in the x direction.
	* **y** (double)
		Represents the acceleration on the device in the y direction.
	* **z** (double)
		Represents the acceleration on the device in the z direction. 

.. note::
	If any of these properties cannot be provided, they will be null



Options (object)
-----------------------------

The options parameter allows the developer to specify several parameters to customize the watchAcceleration() method.
	

Properties:
	* **frequency** (long)
		Determines how often the acceleration information is updated in milliseconds.
	* **getOrientation** (boolean)
		Determines whether or not the API will attempt to determine the device's current :doc:`Orientaiton <../accelerometer>`.
