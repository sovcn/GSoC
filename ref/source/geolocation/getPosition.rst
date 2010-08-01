.. highlight:: javascript

============================
geolocation.getPosition()
============================

Parameters
*************************

Callback (object)
--------------------------
The callback parameter provides an interface of several functions for the developer to interact with the geolocation module. The two properties supported by
the geolocation callback object are as follows:

* **success** (Function)
	This is called whenever the API has successfully retrieved and parsed a :ref:`position-object-label`. It receives the resulting :ref:`position-object-label` as a parameter.
	
* **error** (Function)
	This function is called whenever an error is encountered and receives a sensor.error(TODO - LINK) object as a parameter.

.. _position-object-label:

Position Object
=============================

The position object conforms to the `W3C position interface`_.

.. _W3C position interface: http://dev.w3.org/geo/api/spec-source.html#position_interface

Properties:
	
	* **coords**
		- **lattitude**
			Geographic coordinate in decimal degrees.
		- **longitude**
			Geographic coordinate in decimal degrees.
		- **altitude**
			The altitude attribute denotes the height of the position, specified in meters. If the API cannot provide altitude information,
			the value of this attribute must be null.
		- **accuracy**
			Denotes the accuracy of the geographic coordinates of the :ref:`position-object-label` in meters.
		- **altitudeAccuracy**
			Denotes the accuracy of the altitude property in meters.  If the API cannot provide altitude information,
			the value of this attribute must be null.
		- **heading**
			The direction of travel of the device specified in degrees (0 <= heading < 360).  If the device is stationary, heading will have a
			NaN value.
		- **speed**
			Denotes the current ground speed of the device in meters per second.
	* **timestamp**
		Represents the time when the :ref:`position-object-label` was acquired represented as a `DOMTimeStamp`_.
	* **heading**
		If the getHeading value has been passed by the :ref:`Options Object <heading-label>` this property will contain an integer value representing
		the current direction that the device is traveling.
		
.. _DomTimeStamp: http://www.w3.org/TR/DOM-Level-3-Core/core.html#Core-DOMTimeStamp

.. note::
	If any of these properties cannot be provided, they will be null

getPosition() Example
=============================

This is a basic example of the functionality of the getPosition() method::

   require('dojo.sensor.geolocation');
   
   dojo.addOnLoad(function(){
   	var options = {
   		timeout: 6000, // wait 6 seconds before returning with an error
   		enableHighAccuracy: true, // may drain the battery of mobile devices faster
   		getHeading: true,
   		onHeadingChange: function(heading){
   			alert('the heading has changed to: ' + heading);
   		}
   	}
   	
   	dojo.sensor.geolocation.getPosition({
   		success: function(position){
   			console.log(position.coords.latitude + " " + position.coords.longitude);
   		},
   		error: function(error){
   			console.error(error.message);
   		}
   	},
   	options);
   
   });


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

.. _heading-label:

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
	
* **frequency** (long)
	Indicates the time in milliseconds that watchPosition() should wait between position requests. *geolocation.watchPosition() only* **(default: 1000)**

Options Example
============================

Example::

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
	
