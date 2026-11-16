import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { cameraPosition } from 'three/tsl';



const scene = new THREE.Scene();
export const cameraPivot = new THREE.Group();
cameraPivot.rotation.order = "YXZ";
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(cameraPivot);
cameraPivot.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//------------ELEMENTS-------------//
export const workspace = new THREE.Group();
scene.add(workspace);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
workspace.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0, metalness: 0 });
const cube = new THREE.Mesh(geometry, material);
workspace.add(cube);

const loader = new FBXLoader();

loader.load('public/cube.fbx', (rubikCube) => {
    rubikCube.scale.set(0.003, 0.003, 0.003 );
    workspace.add(rubikCube);
}, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, (error) => {
    console.log('An error occured while importing the cube', error);
});


const planeGeometry = new THREE.PlaneGeometry();
const planeMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    uColor: { value: new THREE.Color(0x888888) },
    uBackgroundColor: { value: new THREE.Color(0x222222) },
    uBackgroundOpacity: { value: 0.8 },
    uScale: { value: 100.0 },     // 100 cells across a 100x100 plane = 1x1 unit squares
    uThickness: { value: 0.03 }   // Line thickness (0.0 to 1.0)
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform vec3 uBackgroundColor;
    uniform float uBackgroundOpacity;
    uniform float uScale;
    uniform float uThickness;
    varying vec2 vUv;

    void main() {
      // Scale UVs and get fractional part to create repeating cells
      vec2 grid = fract(vUv * uScale);
      
      // Both edge arguments must be vec2
      vec2 line = smoothstep(vec2(uThickness) - fwidth(vUv * uScale), vec2(uThickness), grid);
      float mask = 1.0 - min(line.x, line.y);

      // Mix background and line colors
      vec3 finalColor = mix(uBackgroundColor, uColor, mask);
      float finalAlpha = mix(uBackgroundOpacity, 1.0, mask);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.scale.x = 100;
plane.scale.y = 100;
plane.rotation.x = -Math.PI/2;
plane.position.y = -1;

workspace.add(plane);

function rotateCube(){
    requestAnimationFrame(rotateCube);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

rotateCube();