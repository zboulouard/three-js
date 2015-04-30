var container = document.getElementById('container'); // récupérer la div qui va afficher le graphe et la mettre dans une variable utilisable plus tard dans le script

var renderer = new THREE.CanvasRenderer();  // déclarer le "renderer" qui va donner le rendu du graphe en 3D
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement); // mettre le "renderer" en tant qu'élément DOM dans la div "container"

var scene = new THREE.Scene(); // scène à visualiser (le graphe en 3D)
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000); // caméra qui va voir la scène (angle de vue en degrés, ratio de visualisation, plus-proche en pixels, plus-loin en pixels)
scene.add(camera);

var distance = 500; // distance entre les particules en pixels

var geometry = new THREE.Geometry(); // objet qu'on va utuliser pour ajouter les liens

// pour créer 50 particules
for(var i=0; i<50; i++) {
	
	var particle = new THREE.Particle(new THREE.ParticleCanvasMaterial({
		color : Math.random() * 0x808080 + 0x808080,
		opacity : 1,
		program : function(context) {
			context.beginPath();
			context.arc(0,0,1,0,Math.PI*2,true);
			context.closePath();
			context.fill();
		}
	}));
	// particle.position.x = 0; // centre
	particle.position.x = Math.random() * distance * 2 - distance;
	// particle.position.y = 0; // centre
	particle.position.y = Math.random() * distance * 2 - distance;
	// particle.position.z = 0; // centre
	particle.position.z = Math.random() * distance * 2 - distance;
	// particle.scale.x = particle.scale.y = 10; // largeur
	particle.scale.x = particle.scale.y = Math.random() * 10 + 5;
	
	geometry.vertices.push(new THREE.Vertex(particle.position)); // affectation de l'objet geometry aux noeuds
	
	scene.add(particle);

}

var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
	color : 0x000000,
	opacity : 0.05
}));

scene.add(line);

camera.position.z = 100;
// camera.lookAt(particle); // pour regarder une seule particule
camera.lookAt(scene.position); // pour regarder toute la scène

renderer.render(scene, camera);

document.addEventListener('mousemove', onMouseMove, false);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    
}

function onMouseMove(event) {
	var mouseX = event.clientX - window.innerWidth/2;
	var mouseY = event.clientY - window.innerHeight/2;
	// camera.position.x = event.clientX; // défilement sur toute la scène
	camera.position.x += (mouseX - camera.position.x)*0.05; // défilement plus contrôlé
	camera.position.y += (mouseY - camera.position.y)*0.05;
	camera.position.z = distance;
	camera.lookAt(scene.position);
	renderer.render(scene, camera);
}