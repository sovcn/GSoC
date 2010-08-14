=====================================
media.captureImage()
=====================================

The imageCapture interface is designed to allow web developers to access camera devices on a **some** of the supported platforms.

.. warning::
	The mediaCapture interface is still highly experiemental and has not been fully tested across all platforms.
	
How this call is implemented varies accross platforms, but in most cases it will bring up a camera application of some sort and allow the user to capture
and image to be used by the applicaiton.	

captureImage() Example
************************************

This is a basic example of the functionality of the captureImage() method::

   <img src="" id="captureImage" alt="Not captured yet" />
   
   <script type="text/javascript">
   	   dojo.addOnLoad(function(){
		   dojo.sensor.media.captureImage({
				success: function(data){
					dojo.byId("captureImage").src = "data:image/jpeg;base64," + data;
				},
				error:   function(error){
					alert('Unable to retrieve image data.');
				}
			},
			{quality:50});
		});
	</script>
	
Parameters
*************************

Callback (object)
--------------------------
The callback parameter provides an interface of several functions for the developer to interact with the mediaCapture module. The two properties supported by
the captureImage callback object are as follows:

* **success** (Function)
	This is called whenever the API has successfully retrieved and parsed the requested image data. It receives the resulting data as a **base64 encoded image** as a parameter.
	
* **error** (Function)
	This function is called whenever an error is encountered and receives a sensor.error(TODO - LINK) object as a parameter.

Options (object)
-----------------------------

The options parameter allows the developer to specify several parameters to customize the captureImage() method.
	
.. note::
	Not all option properties are standardized between all supported platforms.  They should act similarly but are not guaranteed.

The following options must be passed as properties of the options object parameter:
	
* **quality** (integer)
	The quality option allows the user to specify the JPEG encoding quality to be used by the capture interface and must be a value **between 1 and 100** inclusive.
	**(default: 50)**

* **quality** (maxNumberOfMediaFiles)
	This option allows the developer to specify how many media files the application can expect to receive. Not all platforms support values greater than 1.
	**(default: 1)**