import { FBXLoader } from "./lib/jsm/loaders/FBXLoader.js";
import { createPhysicsWorld } from "./src/physics/physics.js";
import {
  addUser,
  updateUsers,
  syncOwnUser,
  removeUser,
  getOwnUser,
  syncUser,
} from "./src/user/user-manager.js";
import {
  shoot,
  updateBullets,
  syncBulletPosition,
} from "./src/user/bullet-manager.js";

import assetConfig from "./asset-config.js";
import { dmLevels, teamLevels } from "./level-config.js";
import { MobileFPSController } from "./src/mobile-fps-controller.js";

const USE_DEBUG_RENDERER = false;
let debugRenderer = null;

export const STATE = {
  WAITING_FOR_START: "WAITING_FOR_START",
  IN_PROGRESS: "IN_PROGRESS",
};

const clock = new THREE.Clock();
const controller = { movement: { x: 0, y: 0 }, rotation: { x: 0, y: 0 } };

let physicsWorld;
let scene;
let camera;
let renderer;
let controls;
let bulletManager = null;
let textureAssets = {};
let spawnPoints = [];

const sharedData = {
  state: STATE.WAITING_FOR_START,
};

let _ownId = "";
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
    debugRenderer = new THREE.CannonDebugRenderer(scene, physicsWorld);
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
  spawnPoints = [];

  loader.load(dmLevels.find((level) => level.id === 0).url, (object) => {
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
          spawnPoints.push({
            x: child.position.x,
            y: child.position.y,
            z: child.position.z,
          });
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
            physicsWorld.add(body);
          }
        }
      }
    });

    object.scale.set(0.01, 0.01, 0.01);
    scene.add(object);

    onLoaded();
  });
};

const createPlayers = (players, onComplete) => {
  players.forEach((player) => {
    if (player.id === _ownId) {
      // set pos { ...spawnPoints[player.spawnIndex] },
    } else {
      addUser({
        scene,
        id: player.id,
        name: player.name,
        isOwn: player.id === _ownId,
        position: { ...spawnPoints[player.spawnIndex] },
        kill: player.kill,
        die: player.die,
        sharedData,
      });
    }
  });
  onComplete();
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

  physicsWorld.step(delta);
  updateBullets({ scene, physicsWorld });
  updateUsers(delta);
  syncOwnUser({ serverCall: _serverCall, controls });

  controls.setMovement(controller.movement);
  controls.setRotation(controller.rotation);
  controls.update(delta * 1000);

  performance.mark("threejs-render-start-mark");
  renderer.render(scene, camera);
  performance.mark("threejs-render-end-mark");

  performance.measure(
    "threejs-render-measure",
    "threejs-render-start-mark",
    "threejs-render-end-mark"
  );

  if (USE_DEBUG_RENDERER) debugRenderer.update();

  requestAnimationFrame(animate);
};

window.createWorld = ({
  serverCall,
  onReady,
  userName,
  players,
  userId = "ownId",
}) => {
  _ownId = userId;
  _serverCall = serverCall;
  sharedData.state = STATE.WAITING_FOR_START;

  loadTextures(assetConfig.textures, () => {
    physicsWorld = createPhysicsWorld();
    initThreeJS();
    createSkyBox();
    loadLevel(() => {
      addUser({
        scene,
        id: userId,
        name: userName,
        isOwn: true,
        position: { x: 10, y: 10, z: 10 },
        onComplete: (user) => {
          controls = new MobileFPSController(camera, user.physics, {
            velocityFactor: 0.08,
            sideVelocityFactor: 0.08,
          });
          scene.add(controls.getObject());
          init();
          animate();
          console.log(`Snowball Fight is ready!`);
          onReady();
          createPlayers(players, () => {
            controls.enabled = true;
          });
          physicsWorld.add(user.physics);
        },
        sharedData,
      });
    });
  });
};

window.addUsers = (users) => {
  users.forEach(({ id, name, position }) => {
    addUser({
      scene,
      id,
      name,
      isOwn: false,
      position,
      sharedData,
    });
  });
};
window.removeUser = (id) => removeUser({ scene, id });
window.touchController = {
  movement: { reportPercentages: (v) => (controller.movement = { ...v }) },
  rotation: { reportPercentages: (v) => (controller.rotation = { ...v }) },
};
window.actions = {
  jump: () => controls.jump(),
  shoot: () => shoot({ user: getOwnUser(), camera, physicsWorld, scene }),
};

// data gets an extra id param automatically by the server
window.serverMessage = ({ header, data }) => {
  switch (header) {
    case "start":
      sharedData.state = STATE.IN_PROGRESS;
      break;

    case "updatePosition":
      if (data.type === "user") syncUser(data);
      if (data.type === "bullet") syncBulletPosition(data);
      break;

    default:
  }
};

document.addEventListener('touchmove',function(e) {e.preventDefault()}, {passive:false});
