'use strict';

//Constants
var PIPE_RADIUS = 0.10;
var PIPE_NUM_SIDES = 10;
var PIPE_ANIM_SPEED = 3000;

var JOINT_RADIUS = 0.25;
var JOINT_NUM_SIDES = 10;

//Global variables
var container, scene, camera, renderer, controls;
var floor;

//Global materials
var pipeGeo = new THREE.CylinderGeometry(PIPE_RADIUS, PIPE_RADIUS, 1, PIPE_NUM_SIDES, 1, false);
var pipeMat = new THREE.MeshLambertMaterial({color:0xff0000});//MeshNormalMaterial();

var jointGeo = new THREE.SphereGeometry(JOINT_RADIUS, JOINT_NUM_SIDES, JOINT_NUM_SIDES);
var jointMat = new THREE.MeshLambertMaterial({color:0x00ff00});

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
		color: 0x0000ff,		
		side:THREE.DoubleSide
	});
	floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotateX(Math.PI/2);
	scene.add(floor);	
		
	//Cylinder
	var cylGeo = new THREE.CylinderGeometry(1, 1, 1, PIPE_NUM_SIDES, 1, false);

	var cylMat = new THREE.MeshNormalMaterial();
	cyl = new THREE.Mesh(cylGeo, cylMat);
	scene.add(cyl);
	
	addPipe(new THREE.Vector3(1, 1, 0), 2);
	
	render();

}

function addPipe(pos, length) {
	var pipe = new THREE.Mesh(pipeGeo, pipeMat);	
	pipe.position.set(pos.x, pos.y, pos.z);
	scene.add(pipe);
	
	var tween = new TWEEN.Tween( { scale:1} )
		.to( { scale: length }, PIPE_ANIM_SPEED )
		.easing( TWEEN.Easing.Quadratic.Out )
		.onUpdate(function () {			
			pipe.scale.y = this.scale;
			pipe.position.y = (this.scale/2) + pos.y;			
		})		
		.onComplete(function() {
			var joint = new THREE.Mesh(jointGeo, jointMat);
			joint.position.set(pos.x, pos.y + length, pos.z);
			scene.add(joint);
		})
		.start();	
		
} 

function render(time) {	
	requestAnimationFrame( render );
	controls.update(); 		
	TWEEN.update( time );	
	renderer.render( scene, camera );
	
}