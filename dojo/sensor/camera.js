dojo.require('dojo.sensor');
dojo.provide("dojo.sensor.camera");

/*=====
dojo.sensor.accelerometer = { 
  // summary:
  //    provides an interface for accessing the accelerometer of a given device.
};
=====*/


// Define error constants

if( dojo.sensor.isLoaded() && dojo.sensor.getPlatform() == dojo.sensor.platforms.NATIVE ){
	// Device must be running a platfrom like Phonegap for acceleration to work
	console.error("Camera is currently not supported on any native platforms.");
}else{
	// DO nothing, platform should be supported.
	// TODO: Keep this updated as more platforms are added.
}