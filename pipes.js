'use strict';

//Global variables
var container, scene, camera, renderer, controls;
var floor;

init();
var cyl;
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
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,10,0);
	scene.add(light);
	
	var hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
	hemi.position.set(0, 10, 0);
	scene.add(hemi);	
	
	//Floor		
	var floorGeometry = new THREE.PlaneGeometry(100, 100);
	var floorMaterial = new THREE.MeshLambertMaterial({
		color: 0xff0000,
		side:THREE.DoubleSide
	});
	floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotateX(Math.PI/2);
	scene.add(floor);	
		
	//Cylinder
	var cylGeo = new THREE.CylinderGeometry(1, 1, 1, 10, 1, false);
	//var cylMat = new THREE.MeshNormalMaterial({wireframe:true});
	var cylMat = new THREE.MeshNormalMaterial();
	cyl = new THREE.Mesh(cylGeo, cylMat);
	scene.add(cyl);
		
	render();

}


function render() {	
	requestAnimationFrame( render );
	controls.update(); 				
	renderer.render( scene, camera );
	
}