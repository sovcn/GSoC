.. highlight:: javascript

============================
Sensor
============================

dojo.sensor is an API designed to simplify the process of building web applications that utilize the sensory 
information made available on many mobile and desktop platforms.

.. toctree::
   :maxdepth: 2

   sensor/getPlatform.rst
   sensor/errorHandling.rst

   
   
Constants
************************************
These constants are all attributes of the dojo.sensor

.. _heading-constant-label:

Platforms
------------------------------------

These constants are properties of the dojo.sensor.platforms object and are used to specify which platform is currently being used in conjunction with
:doc:`sensor/getPlatform`.

.. _PhoneGap: http://www.phonegap.com/
.. _JIL: http://www.jil.org/
.. _Bondi: http://bondi.omtp.org/default.aspx
.. _WebOS: http://en.wikipedia.org/wiki/WebOS

#. **NATIVE** - All native browser platforms (WebKit, Firefox, Safari, Chrome, etc.)
#. **PHONE_GAP** - Any App that is using the `PhoneGap`_ platform to access hardware capabilities
#. **JIL**	- Applications conforming to the `JIL`_ API
#. **BONDI** - Applications conforming to the `Bondi`_ API
#. **WEBOS** - Applications running on Palm's `WebOS`_ platform.

Error Constants
-------------------------------------

These constants are meant to help developers implement error-specific actions in their code.  A quick example: ::

   require('dojo.sensor.geolocation');
   
   dojo.addOnLoad(function(){
   	var options = {
   	};
   	
   	dojo.sensor.geolocation.getPosition({
   		success: function(position){
   			console.log(position.coords.latitude + " " + position.coords.longitude);
   		},
   		error: function(error){
   			console.error(error.message);
   			switch(error.code){
   				// You can use any of the error constants to suit your needs
   				case error.PERMISSION_DENIED:
   					console.error('The application does not have permission to access the device\'s location.');
   					break;
   				case error.POSITION_UNAVAILABLE:
   					console.error('The device is unable to determine the current location');
   					break;
   				case error.DEVICE_ERROR:
   					console.error('An unknown device error has occured');
   					break;
   			}
   		}
   	},
   	options);
   
   });

All of these constants are properties of the :doc:`sensor/errorHandling` object type which is passed as a parameter of any error callback.

#. PERMISSION_DENIED - Occurs when the application does not have the permission to access the requested information.
#. POSITION_UNAVAILABLE - Occurs when the device is unable to access the current geographic location for any reason.
#. **UNSUPPORTED_FEATURE** - Occurs when a developer tries to impelement a feature that is not supported by the platform.
#. **IMPROPER_IMPLEMENTATION** - Occurs when a developer has not properly set up their application.
#. **APPLICATION_ERROR** - Generic error that deals with software.
#. **DEVICE_ERROR** - Generic error that deals with hardware.

.. note::
	Values in bold are generally used only for debugging purposes.


Error Handling
************************************
All three modules within the sensor API utilize a single error handling system which can be viewed :doc:`here<sensor/errorHandling>`.
