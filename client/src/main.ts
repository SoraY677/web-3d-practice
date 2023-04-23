import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let clickTargetId: string | null = null
document.body.addEventListener('mousemove', (event) => {
  const element = event.currentTarget as HTMLBodyElement;
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  const w = element.offsetWidth;
  const h = element.offsetHeight;
  mouse.x = (x/w)*2-1;
  mouse.y = -(y/h)*2+1;
})
document.body.addEventListener('click', () => {
  if(!clickTargetId) return;

  alert(clickTargetId)
})


const loader = new GLTFLoader()
loader.load( './model/coffee_demo.gltf', function ( gltf ) {
  const material = new THREE.MeshStandardMaterial();
  gltf.scene.traverse( function( n) {
     const node = n as THREE.Mesh
    if ( node.isMesh ) {
      node.material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
    }
  } );
  material.color.set( 0xff0000 ); // 赤色

  scene.add( gltf.scene )
}, function() {
}, function ( error ) {
	console.error( error );
} );


const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

camera.position.z = 5;


function animate() {
  requestAnimationFrame( animate );

  if(! scene.children?.[0]?.children) return

  raycaster.setFromCamera(mouse,camera);
  const intersects = raycaster.intersectObjects(scene.children[0].children, false);

  if(intersects.length > 0){
      const obj = intersects[0].object;
      clickTargetId = obj.name
  } else {
    clickTargetId = null
  }

	renderer.render( scene, camera );
}

animate();