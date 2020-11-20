import { ANIMATION } from "../enum/animation.js";
import { create } from "./user.js";

const users = [];

let ownUser = null;
let syncData = null;

export const addUser = ({ scene, id, name, position, isOwn, onComplete }) => {
  if (users.find((user) => user.id == id)) {
    console.log(`Multiple user creation request for ${id}`);
    return null;
  } else {
    const user = create({ id, name, position, isOwn });
    users.push(user);
    if (isOwn) ownUser = user;
    else scene.add(user.object);
    if (onComplete) onComplete(user);
    return user;
  }
};

export const updateUsers = (delta) => {
  users.forEach((user) => {
    if (user.mixer) user.mixer.update(delta);
  });
};

export const syncUsers = ({ id, position }) => {
  const user = users.find((user) => user.id === id);
  if (user) {
    const positionDiff = Math.sqrt(
      Math.pow(user.object.position.x - position.x, 2),
      Math.pow(user.object.position.z - position.z, 2)
    );

    if (positionDiff > 0.01)
      setAnimationAction({ user, animation: ANIMATION.WALK });

    if (user.animationTimeout) clearTimeout(user.animationTimeout);
    if (user.positionTween) user.positionTween.kill();
    user.positionTween = gsap.to(user.object.position, {
      x: position.x,
      y: position.y - 1,
      z: position.z,
      duration: 0.2,
      ease: "linear",
      onComplete: () => {
        user.animationTimeout = setTimeout(() => {
          setAnimationAction({ user, animation: ANIMATION.IDLE });
        }, 200);
      },
    });

    const { rotation } = position;
    gsap.to(user, {
      targetRotation: rotation,
      onUpdate: () => {
        var euler = new THREE.Euler(
          0, //rotation.x,
          rotation.y + Math.PI,
          0, //rotation.z,
          "XYZ"
        );
        user.object.quaternion.setFromEuler(euler);
      },
    });
  }
};

const setAnimationAction = ({ user, animation }) => {
  if (animation !== user.activeAnimation) {
    user.activeAnimation = animation;
    user.lastAction = user.activeAction;
    user.activeAction = user.animations[animation];
    if (user.lastAction) user.lastAction.fadeOut(0.2);
    user.activeAction.reset();
    user.activeAction.fadeIn(0.2);
    user.activeAction.play();
  }
};

export const syncOwnUser = ({ serverCall, controls }) => {
  const now = Date.now();
  if (ownUser && (syncData === null || now - syncData.lastSyncTime > 1000)) {
    const currentPosition = {
      x: ownUser.phisycs.position.x.toFixed(1),
      y: ownUser.phisycs.position.y.toFixed(1),
      z: ownUser.phisycs.position.z.toFixed(1),
    };
    const direction = controls.getDirection();
    const currentRotation = {
      x: direction.x.toFixed(2),
      y: direction.y.toFixed(2),
      z: direction.z.toFixed(2),
    };
    if (
      syncData === null ||
      syncData.position.x !== currentPosition.x ||
      syncData.position.y !== currentPosition.y ||
      syncData.position.z !== currentPosition.z ||
      syncData.rotation.x !== currentRotation.x ||
      syncData.rotation.y !== currentRotation.y ||
      syncData.rotation.z !== currentRotation.z
    ) {
      syncData = {
        lastSyncTime: now,
        position: { ...currentPosition },
        rotation: { ...currentRotation },
      };

      serverCall(
        JSON.stringify({
          header: "syncUser",
          data: {
            ...syncData,
          },
        })
      );
    }
  }
};

export const removeUser = ({ scene, id }) => {
  console.log(`Remove user with id ${id}`);
  var user = users.find(({ id }) => id === id);
  if (user) {
    scene.remove(user.mesh);
    scene.remove(user.object);
  } else console.log(`Remove error, user not found`);

  users = users.filter(({ id }) => id !== id);
};
