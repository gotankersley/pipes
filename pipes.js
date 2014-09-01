'use strict';

//Global variables
var container, scene, camera, renderer, controls;
var floor;

init();
function init() {
		
	scene = new THREE.Scene;
		
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;		
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;	

	//Camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);	
	scene.add(camera);	
	camera.position.set(0,0,10);
	camera.lookAt(scene.position);	
	
	//Renderer
	renderer = new THREE.WebGLRenderer( {antialias:true} );		
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);		
	container = document.createElement( 'container' );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );	
	renderer.shadowMapEnabled = true;
	
	//Scene	
	
	//Lighting
	var hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
	hemi.position.set(0, 10, 0);
	scene.add(hemi);	
	
	//Floor		
	var floorGeometry = new THREE.BoxGeometry(100, 1, 100);
	var floorMaterial = new THREE.MeshLambertMaterial({
		color: 0xff0000,
	});
	floor = new THREE.Mesh(floorGeometry, floorMaterial);			
	scene.add(floor);	
		
	render();

}


function render() {	
	requestAnimationFrame( render );
	controls.update(); 				
	renderer.render( scene, camera );
	
}