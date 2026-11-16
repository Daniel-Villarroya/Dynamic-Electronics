import {cameraPivot, camera, workspace} from "./editor.js";

//=================================//
//========CAMERA POSITION=========//
//===============================//
let movingCam = false;

let startX = 0;
let startY = 0;
let camMovement = [0, 0];
let camStartPos = [0, 0, 0];

let rotatingCam = false;

document.addEventListener('mousedown', (event) => {
    if(event.shiftKey && event.button === 1 && !movingCam){
        startX = event.clientX;
        startY = event.clientY;
        camStartPos = [cameraPivot.position.x, cameraPivot.position.y, cameraPivot.position.z];
        event.preventDefault();
        movingCam = true;
    }

    if(event.button === 2 && !rotatingCam){
        event.preventDefault();
        rotatingCam = true;
        document.body.requestPointerLock();
    }
});

window.addEventListener('mouseup', (event) => {
    if(event.button === 1) StopCamPositionSet();
    if(event.button === 2) StopCamRotationSet();
    event.preventDefault();
});

window.addEventListener('keyup', (event) => {
    if(event.button === 'Shift') StopCamPositionSet();
});

window.addEventListener('mousemove', (event) => {
    if(movingCam){
        const currentX = event.clientX; 
        const currentY = event.clientY;
    
        camMovement[0] = (currentX - startX)/150;
        camMovement[1] = (currentY - startY)/150;
    
        cameraPivot.position.x = camStartPos[0] - camMovement[0];
        cameraPivot.position.y =  camStartPos[1] + camMovement[1];
    }else if(rotatingCam){
        cameraPivot.rotation.x -= event.movementY / 200;
        cameraPivot.rotation.y -= event.movementX / 200;
    }
});

function StopCamPositionSet(){
    if(movingCam){
        movingCam = false;
        camMovement = [0, 0];
        camStartPos = [cameraPivot.position.x, cameraPivot.position.y, cameraPivot.position.z];
        console.log("Stopped camera: " + camera.position.x + " " + camera.position.y);
    }
}

function StopCamRotationSet() {
    if(rotatingCam){
        rotatingCam = false;
        if(document.pointerLockElement){
            document.exitPointerLock();
        }
    }
}