'use strict';

//Constants
var PIPE_RADIUS = 0.10;
var PIPE_NUM_SIDES = 10;
var PIPE_ANIM_SPEED = 3000;

var JOINT_RADIUS = 0.25;
var JOINT_NUM_SIDES = 10;

var DIR_UP = 0, DIR_DOWN = 1, DIR_LEFT = 2, DIR_RIGHT = 3, DIR_FORWARD = 4, DIR_BACKWARD = 5; //Poor man's enum

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
	var cylGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, PIPE_NUM_SIDES, 1, false);
	var cylMat = new THREE.MeshNormalMaterial();	
	cyl = new THREE.Mesh(cylGeo, cylMat);
	scene.add(cyl);
	
	addPipe(new THREE.Vector3(0, 0, 0), 2, DIR_BACKWARD);
	
	render();

}

function addPipe(pos, length, dir) {
	var dirScalar = (dir == DIR_DOWN || dir == DIR_LEFT || dir == DIR_BACKWARD)? -1 : 1;
	
	var pipe = new THREE.Mesh(pipeGeo, pipeMat);
	if (dir == DIR_UP || dir == DIR_DOWN) pipe.position.set(pos.x, pos.y + (dirScalar * 0.5), pos.z);
	else if (dir == DIR_LEFT || dir == DIR_RIGHT) {
		pipe.rotateZ(Math.PI/2);
		pipe.position.set(pos.x + (dirScalar * 0.5), pos.y, pos.z);
	}
	else if (dir == DIR_FORWARD || dir == DIR_BACKWARD) {
		pipe.rotateX(Math.PI/2);
		pipe.position.set(pos.x, pos.y, pos.z + (dirScalar * 0.5));
	}
	
	scene.add(pipe);
	
	var tween = new TWEEN.Tween( { scale:1} )
		.to( { scale: length }, PIPE_ANIM_SPEED )
		.easing( TWEEN.Easing.Quadratic.Out )
		.onUpdate(function () {			
			pipe.scale.y = this.scale;
			if (dir == DIR_UP || dir == DIR_DOWN) pipe.position.y = dirScalar * (this.scale/2) + (dirScalar * pos.y);			
			else if (dir == DIR_LEFT || dir == DIR_RIGHT) pipe.position.x = dirScalar * (this.scale/2) + (dirScalar * pos.x);			
			else if (dir == DIR_FORWARD || dir == DIR_BACKWARD) pipe.position.z = dirScalar * (this.scale/2) + (dirScalar * pos.z);
			
		})		
		.onComplete(function() {
			var joint = new THREE.Mesh(jointGeo, jointMat);
			if (dir == DIR_UP || dir == DIR_DOWN) joint.position.set(pos.x, pos.y + (dirScalar * length), pos.z);
			else if (dir == DIR_LEFT || dir == DIR_RIGHT) joint.position.set(pos.x + (dirScalar * length), pos.y, pos.z);
			else if (dir == DIR_FORWARD || dir == DIR_BACKWARD) joint.position.set(pos.x, pos.y, pos.z + (dirScalar * length));			
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