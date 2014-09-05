'use strict';

//Constants
var PIPE_RADIUS = 0.10;
var PIPE_NUM_SIDES = 10;
var PIPE_ANIM_SPEED_PER_SECTION = 500;
var PIPES_MAX = 1000;

var JOINT_RADIUS = 0.15;
var JOINT_NUM_SIDES = 10;

var ROOM_SIZE = 20;
var HALF_ROOM = ROOM_SIZE/2;

var POSSIBLE_DIRS = 6;
var DIR_UP = 0, DIR_RIGHT = 1, DIR_FORWARD = 2, DIR_DOWN = 3, DIR_LEFT = 4, DIR_BACKWARD = 5; //Poor man's enum

//Global variables
var container, scene, camera, renderer, controls;
var origin;
var floor;
var numPipes = 0;

//Global materials
var pipeGeo = new THREE.CylinderGeometry(PIPE_RADIUS, PIPE_RADIUS, 1, PIPE_NUM_SIDES, 1, false);
var pipeMat = new THREE.MeshLambertMaterial({color:0xff0000});

var jointGeo = new THREE.SphereGeometry(JOINT_RADIUS, JOINT_NUM_SIDES, JOINT_NUM_SIDES);
var jointMat = new THREE.MeshLambertMaterial({color:0x00ff00});

init();
function init() {
		
	scene = new THREE.Scene;
		
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;		
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;	

	//Camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);	
	scene.add(camera);	
	//camera.position.set(HALF_ROOM,HALF_ROOM,HALF_ROOM+ROOM_SIZE);
	camera.position.set(HALF_ROOM,HALF_ROOM,HALF_ROOM);
	//camera.position.set(HALF_ROOM,HALF_ROOM,HALF_ROOM);
	//camera.lookAt(new THREE.Vector3(HALF_ROOM,HALF_ROOM,HALF_ROOM));
	
	//Renderer
	renderer = new THREE.WebGLRenderer( {antialias:true} );		
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);		
	container = document.createElement( 'container' );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );	
	controls.center = new THREE.Vector3(HALF_ROOM, HALF_ROOM, HALF_ROOM);
	renderer.shadowMapEnabled = true;
	
	//Scene	
	
	//Lighting
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,10,0);
	scene.add(light);
	
	var hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
	hemi.position.set(0, 10, 0);
	scene.add(hemi);		
		
	//Origin
	var originGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, PIPE_NUM_SIDES, 1, false);
	var originMat = new THREE.MeshNormalMaterial();	
	origin = new THREE.Mesh(originGeo, originMat);
	scene.add(origin);
	
	//Room / viewing volume
	var roomGeo = new THREE.BoxGeometry(ROOM_SIZE, ROOM_SIZE, ROOM_SIZE);
	var roomMat = new THREE.MeshBasicMaterial({color: 0x444444, wireframe:true});
	var room = new THREE.Mesh(roomGeo, roomMat);
	room.position.set(HALF_ROOM, HALF_ROOM, HALF_ROOM);
	scene.add(room);
	
	//Place pipes
	var randPos = new THREE.Vector3(
			Math.floor(Math.random() * ROOM_SIZE),
			Math.floor(Math.random() * ROOM_SIZE),
			Math.floor(Math.random() * ROOM_SIZE)
	);
	var randDir = Math.floor(Math.random() * POSSIBLE_DIRS); 
	addNext(randPos);

	
	render();

}

function addNext(startingPos, lastDir) {
	if (numPipes++ < PIPES_MAX) {
		var outOfBox = true;
		while(outOfBox){
			
			var randDir;
			do{
				randDir = Math.floor(Math.random() * 6); //6 possible directions			
			}while(
				(randDir == lastDir)
				|| (randDir == DIR_UP && lastDir == DIR_DOWN)
				|| (randDir == DIR_DOWN && lastDir == DIR_UP)
				|| (randDir == DIR_LEFT && lastDir == DIR_RIGHT)
				|| (randDir == DIR_RIGHT && lastDir == DIR_LEFT)
				|| (randDir == DIR_FORWARD && lastDir == DIR_BACKWARD)
				|| (randDir == DIR_BACKWARD && lastDir == DIR_FORWARD)
			);

			var randLength = Math.max(Math.min(ROOM_SIZE - 1, Math.floor(Math.random() * ROOM_SIZE)), .35);
			switch(randDir){
				case DIR_UP:
					if(startingPos.y + randLength < ROOM_SIZE){
						outOfBox = false;
					}
					break;
				case DIR_DOWN:
					if(startingPos.y - randLength > 0){
						outOfBox = false;
					}
					break;
				case DIR_RIGHT:
					if(startingPos.x + randLength < ROOM_SIZE){
						outOfBox = false;
					}
					break;
				case DIR_LEFT:
					if(startingPos.x - randLength > 0){
						outOfBox = false;
					}
					break;
				case DIR_FORWARD:
					if(startingPos.z + randLength < ROOM_SIZE){
						outOfBox = false;
					}
					break;
				case DIR_BACKWARD:
					if(startingPos.z - randLength > 0){
						outOfBox = false;
					}
					break;
			}
		}
		addPipe(startingPos, randLength, randDir, addNext);
	}
}

function addPipe(pos, length, dir, completeFn) {
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
	
	var added = false;
	
	var tween = new TWEEN.Tween({scale:.01} )
		.to( { scale: length }, PIPE_ANIM_SPEED_PER_SECTION * length )
		.easing( TWEEN.Easing.Quadratic.InOut )
		.onUpdate(function () {			
			if(!added){
				scene.add(pipe);
				added = true;
			}
			pipe.scale.y = this.scale;
			if (dir == DIR_UP || dir == DIR_DOWN) pipe.position.y = dirScalar * (this.scale/2) + pos.y;			
			else if (dir == DIR_LEFT || dir == DIR_RIGHT) pipe.position.x = dirScalar * (this.scale/2) + pos.x;			
			else if (dir == DIR_FORWARD || dir == DIR_BACKWARD) pipe.position.z = dirScalar * (this.scale/2) + pos.z;

			var endPos;
			if (dir == DIR_UP || dir == DIR_DOWN) endPos = new THREE.Vector3(pos.x, pos.y + (dirScalar * this.scale), pos.z);
			else if (dir == DIR_LEFT || dir == DIR_RIGHT) endPos = new THREE.Vector3(pos.x + (dirScalar * this.scale), pos.y, pos.z);
			else if (dir == DIR_FORWARD || dir == DIR_BACKWARD) endPos = new THREE.Vector3(pos.x, pos.y, pos.z + (dirScalar * this.scale));	
			camera.lookAt(endPos);
		})		
		.onComplete(function() {
			var joint = new THREE.Mesh(jointGeo, jointMat);
			var endPos;
			if (dir == DIR_UP || dir == DIR_DOWN) endPos = new THREE.Vector3(pos.x, pos.y + (dirScalar * length), pos.z);
			else if (dir == DIR_LEFT || dir == DIR_RIGHT) endPos = new THREE.Vector3(pos.x + (dirScalar * length), pos.y, pos.z);
			else if (dir == DIR_FORWARD || dir == DIR_BACKWARD) endPos = new THREE.Vector3(pos.x, pos.y, pos.z + (dirScalar * length));	
			
			joint.position.copy(endPos);
			scene.add(joint);
			completeFn(endPos, dir);
		})
		.start();	
		
} 


function render(time) {	
	requestAnimationFrame( render );
	controls.update(); 		
	TWEEN.update(time);	
	renderer.render( scene, camera );
	
}
