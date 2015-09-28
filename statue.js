var camera, scene, renderer, controls;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


window.onload = function() {
	init();
	debugaxis(300);
	animate();
};


function init() {
	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('viewer').appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set(0, 0, 700);
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.userPan = false;
	controls.userPanSpeed = 0.0;
	controls.minPolarAngle =0;
	controls.maxPolarAngle = Math.PI * 0.495;

	// scene

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0xaaaaaa );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );

	// texture

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	var texture = new THREE.Texture();

	var loader = new THREE.ImageLoader( manager );
	loader.load( 'statue.jpg', function ( image ) {

		texture.image = image;
		texture.needsUpdate = true;

	} );

	// model

	var loader = new THREE.OBJLoader( manager );
	loader.load( '4444.obj', function ( object ) {

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material.map = texture;

			}

		} );
		
		object.position.y = -140;
		object.rotation.x = Math.PI*1.5;
		
		scene.add( object );

	} );

	window.addEventListener( 'resize', onWindowResize, false );

}

var debugaxis = function(axisLength){
    function v(x,y,z){ 
            return new THREE.Vertex(new THREE.Vector3(x,y,z)); 
    }
    
    function createAxis(p1, p2, color){
            var line, lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
            lineGeometry.vertices.push(p1, p2);
            line = new THREE.Line(lineGeometry, lineMat);
            scene.add(line);
    }
    
    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000); //x
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00); //y
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF); //z
};

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {
	camera.lookAt( scene.position );
	
	renderer.render( scene, camera );
}