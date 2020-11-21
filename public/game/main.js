import { FBXLoader } from "./lib/jsm/loaders/FBXLoader.js";
import { createWorld } from "./src/physics/physics.js";
import {
  addUser,
  updateUsers,
  syncOwnUser,
  syncUsers,
  removeUser,
} from "./src/user/user-manager.js";

import assetConfig from "./asset-config.js";
import { teamLevels } from "./level-config.js";
import { MobileFPSController } from "./src/mobile-fps-controller.js";

const USE_DEBUG_RENDERER = true;
let debugRenderer = null;

const clock = new THREE.Clock();
const controller = { movement: { x: 0, y: 0 }, rotation: { x: 0, y: 0 } };

let phisycsWorld;
let scene;
let camera;
let renderer;
let controls;
let textureAssets = {};

let _serverCall = (args) => {};

const initThreeJS = () => {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 0, 300);

  var alight = new THREE.AmbientLight(0xffffff);
  scene.add(alight);

  var light = new THREE.PointLight();
  light.position.set(2.5, 7.5, 15);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("canvas"),
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(scene.fog.color, 1);

  if (USE_DEBUG_RENDERER)
    debugRenderer = new THREE.CannonDebugRenderer(scene, phisycsWorld);
};

const loadTextures = (textureConfig, onLoaded) => {
  const currentConfig = textureConfig[0];
  console.log(
    `Load texture asset ${currentConfig.id} from: ${currentConfig.url}`
  );
  new THREE.TextureLoader().load(currentConfig.url, (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(currentConfig.scaleX, currentConfig.scaleY);
    texture.rotation = currentConfig.rotation;
    textureAssets = {
      ...textureAssets,
      [currentConfig.id]: new THREE.MeshBasicMaterial({
        map: texture,
      }),
    };
    if (textureConfig.length > 1) {
      textureConfig.shift();
      loadTextures(textureConfig, onLoaded);
    } else onLoaded();
  });
};

const createSkyBox = () => {
  const textureEquirec = textureAssets.SkyBox.map;
  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureEquirec.encoding = THREE.sRGBEncoding;
  const skyBoxGeometry = new THREE.IcosahedronBufferGeometry(100, 15);
  const skyBoxMaterial = new THREE.MeshLambertMaterial({
    envMap: textureEquirec,
  });
  const skyBoxMesh = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
  scene.add(skyBoxMesh);
  scene.background = textureEquirec;
};

const loadLevel = (onLoaded) => {
  var loader = new FBXLoader();

  loader.load(teamLevels.find((level) => level.id === 0).url, (object) => {
    object.traverse(function (child) {
      if (child && child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name.includes("Bricks")) {
          child.material = textureAssets.Bricks;
        } else if (child.name.includes("Wood")) {
          child.material = textureAssets.Wood;
        } else if (child.name.includes("Rock")) {
          child.material = textureAssets.Rock;
        }

        if (child.name.includes("Spawn")) {
          child.visible = false;
        } else {
          if (child.name.includes("Collider")) {
            child.geometry.computeBoundingBox();
            var bb = child.geometry.boundingBox;
            var object3DWidth = bb.max.x - bb.min.x;
            var object3DHeight = bb.max.y - bb.min.y;
            var object3DDepth = bb.max.z - bb.min.z;
            const halfExtents = new CANNON.Vec3(
              object3DWidth / 2,
              object3DHeight / 2,
              object3DDepth / 2
            );
            const box = new CANNON.Box(halfExtents);
            const body = new CANNON.Body({ mass: 0 });
            body.addShape(box);
            body.position.copy(
              new CANNON.Vec3(
                child.position.x / 100,
                child.position.y / 100,
                child.position.z / 100
              )
            );
            body.quaternion.copy(child.quaternion);
            phisycsWorld.add(body);
          }
        }
      }
    });

    object.scale.set(0.01, 0.01, 0.01);
    scene.add(object);

    onLoaded();
  });
};

function init() {
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = () => {
  let delta = clock.getDelta();
  if (delta > 0.1) delta = 0.1;

  phisycsWorld.step(delta);
  updateUsers(delta);
  syncOwnUser({ serverCall: _serverCall, controls });

  controls.setMovement(controller.movement);
  controls.setRotation(controller.rotation);
  controls.update(delta * 1000);
  renderer.render(scene, camera);

  if (USE_DEBUG_RENDERER) debugRenderer.update();

  requestAnimationFrame(animate);
};

window.createWorld = ({ serverCall, onReady, userName, id = "ownId" }) => {
  _serverCall = serverCall;
  loadTextures(assetConfig.textures, () => {
    phisycsWorld = createWorld();
    initThreeJS();
    createSkyBox();
    loadLevel(() => {
      phisycsWorld.add(
        addUser({
          scene,
          id: id,
          name: userName,
          isOwn: true,
          position: { x: 10, y: 10, z: 10 },
          onComplete: (user) => {
            controls = new MobileFPSController(camera, user.phisycs, {
              velocityFactor: 0.08,
              sideVelocityFactor: 0.08,
            });
            scene.add(controls.getObject());
            init();
            animate();
            console.log(`Snowball Fight is ready!`);
            onReady();
            controls.enabled = true;

            var element = document.body;
            element.onclick = () => {
              element.requestPointerLock =
                element.requestPointerLock ||
                element.mozRequestPointerLock ||
                element.webkitRequestPointerLock;
              element.requestPointerLock();
            };
          },
        }).phisycs
      );
    });
  });
};

window.addUsers = (users) => {
  users.forEach(({ id, name, position }) =>
    addUser({
      scene,
      id: id,
      name: name,
      isOwn: false,
      position: position,
    })
  );
};
window.removeUser = (id) => removeUser({ scene, id });
window.updatePosition = syncUsers;
window.touchController = {
  movement: { reportPercentages: (v) => (controller.movement = { ...v }) },
  rotation: { reportPercentages: (v) => (controller.rotation = { ...v }) },
};
