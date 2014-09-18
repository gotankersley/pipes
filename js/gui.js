 var GUI = {
	//Camera
	'Follow pipe': true,
	'View outside': function() { setView(VIEW_OUTSIDE); }, 
	'View center': function() { setView(VIEW_CENTER); }, 
	'View floor': function() { setView(VIEW_FLOOR); },
	
	//Geometry
	'Pipe radius': 0.10,	
	'Pipe anim speed': 250,
	'Pipes max': 1000,	
	'Joint radius': 0.15,	
	'Room size': 20,	
	
	'Reset':function() { resetPipes(); }
};

window.onload = function() {
	var gui = new dat.GUI();
	
	//Camera
	var folderCamera = gui.addFolder('Camera');
	folderCamera.add(GUI, 'Follow pipe');
	folderCamera.add(GUI, 'View outside');
	folderCamera.add(GUI, 'View center');
	folderCamera.add(GUI, 'View floor');
	
	//Geometry
	var folderGeometry = gui.addFolder('Geometry');
	folderGeometry.add(GUI, 'Pipe radius').onChange(function(e) { PIPE_RADIUS = e; pipeGeo = new THREE.CylinderGeometry(PIPE_RADIUS, PIPE_RADIUS, 1, PIPE_NUM_SIDES, 1, false);} );
	folderGeometry.add(GUI, 'Pipe anim speed');
	folderGeometry.add(GUI, 'Pipes max');
	folderGeometry.add(GUI, 'Joint radius');
	folderGeometry.add(GUI, 'Room size');
	
	gui.add(GUI, 'Reset');
}