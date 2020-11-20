import { FBXLoader } from "../../lib/jsm/loaders/FBXLoader.js";
import { AnimationMixer } from "../../build/three.module.js";

export const create = ({ id, name, position, isOwn }) => {
  console.log(`Create user for ${id}`);
  let body = null;
  let object = null;
  let activeAction = null;
  let animations = null;

  const objLoader = new FBXLoader();
  let mixer;

  if (!isOwn) {
    objLoader.load("./asset/3d/character/ybot.fbx", (o) => {
      object = o;
      object.traverse((child) => {
        if (child.isMesh && child.material) {
          console.log(child.material);
        }
      });
      object.scale.set(0.01, 0.01, 0.01);
      object.position.set(position.x, position.y - 1, position.z);
      scene.add(object);
      mixer = new AnimationMixer(object);

      objLoader.load("./asset/3d/animation/Walking.fbx", (animation) => {
        const walkAnimationAction = mixer.clipAction(animation.animations[0]);
        animations[ANIMATION.WALK] = walkAnimationAction;

        objLoader.load("./asset/3d/animation/Idle.fbx", (animation) => {
          const idleAnimationAction = mixer.clipAction(animation.animations[0]);
          animations[ANIMATION.IDLE] = idleAnimationAction;
          activeAction = idleAnimationAction;
          activeAction.reset();
          activeAction.play();
          scene.add(object);
        });
      });
    });
  } else {
    const mass = 5;
    const radius = 1.3;
    const shape = new CANNON.Sphere(radius);
    body = new CANNON.Body({ mass: mass });
    body.addShape(shape);
    body.position.set(position.x, position.y, position.z);
    body.linearDamping = 0.9;
  }

  return {
    id,
    name,
    position,
    phisobjectycs: isOwn ? null : object,
    phisycs: isOwn ? body : null,
    mixer,
    hasAnimation: !isOwn,
    mixer: "",
    activeAnimation: "",
    animations,
  };
};
