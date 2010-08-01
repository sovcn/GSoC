.. Dojo.Sensor Reference Guide documentation master file, created by
   sphinx-quickstart on Sat Jul 31 18:15:17 2010.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Reference Guide
=======================================================

.. note::
	This is a note
	
.. warning::
	This is a warning
	
	
.. highlight:: javascript

This is a normal text paragraph. The next paragraph is a code sample::

   require('dojo.sensor.geolocation');
   
   dojo.addOnLoad(function(){
   	dojo.sensor.geolocation.getPosition({
   		success: function(position){
   			console.log(position.coords.latitude + " " + position.coords.longitude);
   		},
   		error: function(error){
   			console.error(error.message);
   		}
   	},
   	{getHeading: true});
   
   });

This is a normal text paragraph again.

Contents:

.. toctree::
   :maxdepth: 2
   
   sensor.rst
   geolocation.rst
   accelerometer.rst
   mediaCapture.rst

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

