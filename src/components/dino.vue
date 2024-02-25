<template>
    <div>
        <div class="dinoComposant"></div>
        <!-- <div>
            X :
            <input type="range" v-model="test.x" @change="updateValues" min="-300" max="300">
            {{ test.x * 0.01 }} <span @click="test.x = 0">R</span>
        </div> -->
        <!-- <div>
            Y :
            <input type="range" v-model="test.y" @change="updateValues" min="-310" max="310">
            {{ test.y * 0.01 }}<span @click="test.y = 0">R</span>
        </div> -->
        <!-- <div>
            Z :
            <input type="range" v-model="test.z" @change="updateValues" min="-300" max="300">
            {{ test.z * 0.01 }}<span @click="test.z = 0">R</span>
        </div> -->
    </div>
</template>

<script lang="ts">
import * as THREE from 'three';
import type { DirectionalLight } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

// let controls: OrbitControls | null = null
let animation: THREE.AnimationAction | null = null
let mixer: THREE.AnimationMixer | null = null
let dinoObj: THREE.Group | null = null
let animate = false
const originPosition = { x: -60, y: window.innerHeight * 0.8 }
const canvasW = 350
const canvasH = 250
const dinoRotationSettings = { x: 0, y: -1.70, z: 0 }
// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.PerspectiveCamera(75, canvasW / canvasH, 0.1, 1000);
camera.position.set(50, 220, 500);
// Create a renderer with a transparent background
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(canvasW, canvasH);
// Create a basic ambient light
const ambientLight = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambientLight);

function initThreeCanvas() {
    // delete old canvas DEV
    const canvas = document.querySelector('canvas')
    if (canvas) canvas.remove()
    document.querySelector(".dinoComposant")!.appendChild(renderer.domElement);
    // controls = new OrbitControls(camera, renderer.domElement);
}

function loadDinosaure() {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.setURLModifier(function (url) {
        if (url === './baby-dino/source//Users/ben/Documents/blender/textures/dino_skin_diffuse.png') {
            url = './baby-dino/source/dino_skin_diffuse.png'
        }
        else if (url === './baby-dino/source//Users/ben/Documents/blender/textures/dino_skin_normal.png') {
            url = './baby-dino/source/dino_skin_normal.png'
            // url = './baby-dino/source/dino_skin_diffuse.png'
        }
        return url;
    });

    // Create an FBX loader
    const fbxLoader = new FBXLoader(loadingManager);
    // Load the FBX file and associated textures
    // fbxLoader.load('./robot-wont-keep-you-waiting/source/robot7.fbx', (object) => {
    fbxLoader.load('./baby-dino/source/dino.fbx', (object) => {
        dinoObj = object
        console.log("dinoObj : ", dinoObj);
        const p = dinoObj.children.findIndex((i) => i.name === "Sun")
        if (p !== -1) {
            (<DirectionalLight>dinoObj.children[p]).intensity = 0.15;
        }
        // camera.lookAt(dinoObj.position);
        scene.add(dinoObj);

        mixer = new THREE.AnimationMixer(dinoObj);
        animation = mixer.clipAction(dinoObj.animations[0])
        mixer.addEventListener('finished', function (e) {
            if (animate) animateDino(true)
        });

    });
}

function animateDino(val: boolean) {
    animate = val
    if (animate && animation) {
        animation.reset()
        animation.setLoop(THREE.LoopOnce, 1);
        animation.enabled = true
        animation.clampWhenFinished = true
        animation.play();
    }
}

function rotateDino(angle: number) {
    // if (dinoObj) dinoObj.scale.set(1, 1, 1)
    let rescale = false

    if (angle >= 337.5 || angle < 22.5) {
        console.log("E")
        dinoRotationSettings.y = -1.7
    } else if (angle >= 22.5 && angle < 67.5) {
        console.log("SE")
        dinoRotationSettings.y = -1.88
    } else if (angle >= 67.5 && angle < 112.5) {
        console.log("S")
        dinoRotationSettings.y = -2.32
    } else if (angle >= 112.5 && angle < 157.5) {
        console.log("SW")
        dinoRotationSettings.y = 2.34
        rescale = true
    } else if (angle >= 157.5 && angle < 202.5) {
        console.log("W")
        dinoRotationSettings.y = 1.8
    } else if (angle >= 202.5 && angle < 247.5) {
        console.log("NW")
        dinoRotationSettings.y = 1.19
    } else if (angle >= 247.5 && angle < 292.5) {
        console.log("N")
        dinoRotationSettings.y = 0
    } else if (angle >= 292.5 && angle < 337.5) {
        console.log("NE")
        dinoRotationSettings.y = -1.1
    }
    if (dinoObj) {
        if (rescale) {
            dinoObj.scale.set(0.8, 0.8, 0.8)
        } else {
            dinoObj.scale.set(1, 1, 1)
        }
    }
}

// Render the scene
const render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if (dinoObj) dinoObj.rotation.set(dinoRotationSettings.x, dinoRotationSettings.y, dinoRotationSettings.z);
    if (mixer) mixer.update(clock.getDelta());
};

loadDinosaure()
const clock = new THREE.Clock();
render();


function startMouseEvent() {
    let speed = 5; // pixels per frame
    let divX = 0 // left dino container position
    let divY = 0 // top dino container position
    let destinationX = originPosition.x;
    let destinationY = originPosition.y;
    let cursorX = originPosition.x;
    let cursorY = originPosition.y;
    let lastMoveTime = Date.now();
    let isHome = true
    const minimalTimeToStartAnimation = 2000
    const unlockTime = 1500
    let locked = false

    let intervalId = setInterval(moveDiv, 1000 / 60); // 60fps

    document.addEventListener("mousemove", (event) => {
        lastMoveTime = Date.now();
        cursorX = event.clientX;
        cursorY = event.clientY;
        destinationX = originPosition.x
        destinationY = originPosition.y
        speed = 12
    });

    const dinosaureEl = document.querySelector<HTMLElement>(".dinoComposant");

    function moveDiv() {
        if (locked || !dinosaureEl) return

        const mouseStopIsLongEnough = Date.now() - lastMoveTime >= minimalTimeToStartAnimation
        if (!animate && isHome && mouseStopIsLongEnough) {
            // start a new animation to a destination
            destinationX = cursorX;
            destinationY = cursorY;
            animateDino(true)
            lastMoveTime = Date.now();
            speed = 7
        }

        if (speed > 5) speed -= 0.01

        divX = dinosaureEl!.offsetLeft;
        divY = dinosaureEl!.offsetTop;
        let dx = destinationX - divX;
        let dy = destinationY - divY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = 10
        const isCloseToOrigin = () => Math.abs(divX - originPosition.x) < minDistance && Math.abs(divY - originPosition.y) < minDistance


        let time = distance / speed;
        if (time === 0) return; // check if time is not equal to 0

        if (distance > 10) {
            let moveX = dx / time;
            let moveY = dy / time;
            divX += moveX;
            divY += moveY;
            isHome = false
            const direction = getDirection(divX, divY, destinationX, destinationY);
            rotateDino(direction)
            dinosaureEl.style.left = divX + "px";
            dinosaureEl.style.top = divY + "px";
        }
        else if (isCloseToOrigin()) {
            //  Behavior when back to origin point
            isHome = true
            locked = true
            rotateDino(0)
            animateDino(false)
            setTimeout(() => { locked = false; }, unlockTime);
        }
        else {
            // Set a new random destination point
            const { x, y } = getRandomPosition()
            speed = 7
            destinationX = x
            destinationY = y
            isHome = true
            locked = true
            animateDino(false)
            setTimeout(() => { locked = false; animateDino(true) }, unlockTime);
        }
    }
}

function getRandomPosition() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    return { x, y };
}
function getDirection(currentX: number, currentY: number, destX: number, destY: number): number {
    let angle = Math.atan2(destY - currentY, destX - currentX);
    angle = angle * (180 / Math.PI);
    angle = (angle + 360) % 360;
    return angle
}

// Vue ===========================================
export default {
    name: "dino",
    data() {
        return {
            test: { x: 0, y: 0, z: 0 }
        }
    },
    mounted() {
        initThreeCanvas()
        startMouseEvent()
    },
    methods: {
        updateValues(val: any) {
            dinoRotationSettings.x = Number(this.test.x) * 0.01
            dinoRotationSettings.y = Number(this.test.y) * 0.01
            dinoRotationSettings.z = Number(this.test.z) * 0.01
        }
    }
}

</script>


<style scoped>
.dinoComposant {
    position: fixed;
    top: 80%;
    /* left: 0px; */
    transform: translate(-50%, -50%);
    z-index: 100;
}
</style>
