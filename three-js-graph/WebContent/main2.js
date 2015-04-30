// Pour faire fonctionner .append() et .selectAll() de D3 sur les objets THREE
THREE.Object3D.prototype.appendChild = function(c) { this.add(c); return c; }
THREE.Object3D.prototype.querySelectorAll = function() { return []; } 

// Pour faire fonctionner .attr() de D3 sur les objets THREE
THREE.Object3D.prototype.setAttribute = function(name, value) {
	var chain = name.split('.');
	var object = this;
	for(var i=0; i<chain.length-1; i++) {
		object = object[chain[i]];
	}
	object[chain[chain.length-1]] = value;
}

// taille de la visualisation
var width = window.innerWidth;
var height = window.innerHeight;

// mise en place du renderer
var renderer = new THREE.CanvasRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// mise en place de la scène
var scene = new THREE.Scene();

// mise en place de la lumière
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 1);
scene.add(light);

// mise en place de la camera
var camera = new THREE.PerspectiveCamera(75, width/height, 1, 1000);
camera.position.z = 400;
scene.add(camera);

// mise en place de la géométrie (qui permet d'avoir toutes les informations nécessaires pour créer un objet 3D), son mesh (instance de géométrie qui définit la structure de l'objet 3D) 
// et son matériel (apparence) lambert pour non-brillant
var nodeGeometry = new THREE.SphereGeometry(5, 32, 32);
var nodeMaterial = new THREE.MeshBasicMaterial({
	color : 0x4682B4,
	shading : THREE.FlatShading,
	vertexColors : THREE.VertexColors
});

var linkGeometry = new THREE.Geometry();
linkGeometry.vertices.push(
		new THREE.Vector3( -10, 0, 0 ),
		new THREE.Vector3( 0, 10, 0 ),
		new THREE.Vector3( 10, 0, 0 )
	);
var linkMaterial = new THREE.LineBasicMaterial({
	color : 0x0000ff
});

// création des objets 3D, puis affectation à la scène
var noeud = new THREE.Object3D();
scene.add(noeud);
var lien = new THREE.Object3D();
scene.add(lien);

// mise place environnement d3js
var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// données à lire avec D3JS
//var data = [4, 8, 15, 16, 23, 42];
function init() {
	// lecture des données avec D3JS
	d3.json("miserables1.json", function(error, graph) {
		force
	      .nodes(graph.nodes)
	      .links(graph.links)
	      .start();

	  var link = svg.selectAll(".link")
	      .data(graph.links)
	    .enter().append( function(){ return new THREE.Mesh(linkGeometry, linkMaterial); } )
	      .attr("class", "link")
	      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

	  var node = svg.selectAll(".node")
	      .data(graph.nodes)
	    .enter().append( function(){ return new THREE.Mesh(nodeGeometry, nodeMaterial); } )
	      .attr("class", "node")
	      .attr("r", 5)
	      .style("fill", function(d) { return color(d.group); })
	      .call(force.drag);

	  node.append("title")
	      .text(function(d) { return d.name; });

	  force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("cx", function(d) { return d.x; })
	        .attr("cy", function(d) { return d.y; });
	  });
	});
	// adaptation aux changements de taille de l'écran
	window.addEventListener( 'resize', onWindowResize, false );
}
init();
// affectation de l'animation (rotation selon "x" et "y" puis rendu de la scène)
//animate();
//
//function animate() {
//    
//    requestAnimationFrame( animate );
//    
//    chart3d.rotation.x = 0.6;
//    chart3d.rotation.y += 0.01;
//    
//    renderer.render( scene, camera );
//    
//}

function onWindowResize() {
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    
}