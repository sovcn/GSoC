============================
geolocation.getPosition()
============================

Parameters
*************************

Callback (object)
--------------------------

in progress

Options (object)
-----------------------------

The options parameter allows the developer to specify several parameters to customize the getPosition() method.
	
.. note::
	All option properties are standardized between both geolocation.watchPostition and geolocation.getPosition
	
	
Native Properties
============================

The following properties conform to the W3C spec (http://dev.w3.org/geo/api/spec-source.html).

.. warning::
	At present time, this API only guarantees the functionality of the native runtime parameters as seen below.

* **enableHighAccuracy** (boolean)
	Provides a hint that the application would like to receive the best possible results. Passing true will result in a position object with a greater degree of accuracy.
	**(default: false)**
	
* **timeout** (long)
	Determines the amount of time in milliseconds that the API will spend attempting to determine a location before returning with an error. A value of 0 will never
	return an error. **(default: 0)**
		
* **maximumAge** (long)
	Determines the amount of time that a cached location is still valid.  A value of 0 will force the API to always make a new location request while a value of
	Infinity will always use a cached location. **(default: 0)**
	
	
These properties do not conform to the W3C spec, but are available within the sensor API

* **getHeading** (boolean)
	A true value will cause the API to return an additional parameter in the position object of the type Integer which corresponds to 8 different headings:
		#. dojo.sensor.geolocation.NORTH
		#. dojo.sensor.geolocation.NORTH_EAST
		#. dojo.sensor.geolocation.EAST
		#. dojo.sensor.geolocation.SOUTH_EAST
		#. dojo.sensor.geolocation.SOUTH
		#. dojo.sensor.geolocation.SOUTH_WEST
		#. dojo.sensor.geolocation.WEST
		#. dojo.sensor.geolocation.NORTH_WEST

* **onHeadingChange** (Function)
	This is a callback function which will be called any time that the heading changes.
	
Experimental Properties
============================

.. warning::
	These parameters are not guaranteed, however they should work similarly across most of the supported platforms.
	
	
Options Example
============================

.. highlight:: javascript

.. highlight:: javascript

This is a normal text paragraph. The next paragraph is a code sample::

   var options = {
		enableHighAccuracy: true, // Boolean
		timeout: 5000, // Long
		maximumAge: 10000, // Long
	};

 	dojo.sensor.geolocation.getPosition({
   		success: function(position){
   			console.log(position.coords.latitude + " " + position.coords.longitude);
   		},
   		error: function(error){
   			console.error(error.message);
   		}
   	},
   	options);
	