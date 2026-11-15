import * as THREE from 'three';



const workspace = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//------------ELEMENTS-------------//
const ambientLight = new THREE.AmbientLight(0xfffffff, 1);
workspace.add(ambientLight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0, metalness: 0 });
const cube = new THREE.Mesh(geometry, material);
workspace.add(cube);

const planeGeometry = new THREE.PlaneGeometry();
const planeMat = new THREE.MeshStandardMaterial({color: 0xFFFF, roughness: 0, metalness: 0});
const plane = new THREE.Mesh(planeGeometry, planeMat);

plane.scale.x = 100;
plane.scale.y = 100;
plane.rotation.x = -1.5;
plane.position.y = -1;

workspace.add(plane);

function rotateCube(){
    requestAnimationFrame(rotateCube);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(workspace, camera);
}

rotateCube();