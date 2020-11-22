import { FBXLoader } from "../../lib/jsm/loaders/FBXLoader.js";
import { AnimationMixer } from "../../build/three.module.js";
import { ANIMATION } from "../enum/animation.js";

export const create = ({ id, name, position, isOwn, scene, onComplete }) => {
  console.log(`Create user for ${id}`);
  let body = null;
  let object = null;
  let activeAction = null;
  let animations = [];

  const objLoader = new FBXLoader();
  let mixer;
  if (!isOwn) {
    objLoader.load("../../game/game-assets/3d/character/ybot.fbx", (o) => {
      object = o;
      object.scale.set(0.01, 0.01, 0.01);
      object.position.set(position.x, position.y - 1, position.z);
      scene.add(object);
      mixer = new AnimationMixer(object);
      objLoader.load(
        "../../game/game-assets/3d/animation/Walking.fbx",
        (animation) => {
          const walkAnimationAction = mixer.clipAction(animation.animations[0]);
          animations[ANIMATION.WALK] = walkAnimationAction;
          objLoader.load(
            "../../game/game-assets/3d/animation/Idle.fbx",
            (animation) => {
              const idleAnimationAction = mixer.clipAction(
                animation.animations[0]
              );
              animations[ANIMATION.IDLE] = idleAnimationAction;
              activeAction = idleAnimationAction;
              activeAction.reset();
              activeAction.play();
              scene.add(o);
              if (onComplete)
                onComplete({
                  id,
                  name,
                  position,
                  object: object,
                  physics: null,
                  mixer,
                  hasAnimation: true,
                  activeAnimation: "",
                  animations,
                  targetRotation: 0,
                });
            }
          );
        }
      );
    });
  } else {
    const mass = 5;
    const radius = 1.3;
    const shape = new CANNON.Sphere(radius);
    body = new CANNON.Body({ mass: mass });
    body.addShape(shape);
    body.position.set(position.x, position.y, position.z);
    body.linearDamping = 0.9;
    if (onComplete)
      onComplete({
        id,
        name,
        position,
        object: isOwn ? null : object,
        physics: isOwn ? body : null,
        mixer,
        hasAnimation: !isOwn,
        mixer: "",
        activeAnimation: "",
        animations,
        targetRotation: 0,
      });
  }
};
