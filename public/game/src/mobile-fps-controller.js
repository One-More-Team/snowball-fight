/**
 * Forked from PointerLockControl.js
 * Optimized for Mobile FPS controller by Krisztian Somoracz
 * Thanks for the original authors!
 *
 * @original author mrdoob / http://mrdoob.com/
 * @original author schteppe / https://github.com/schteppe
 */
export const MobileFPSController = function (
  camera,
  cannonBody,
  { velocityFactor = 0.2, sideVelocityFactor = 0.2, jumpVelocity = 20 }
) {
  var eyeYPos = 2; // eyes are 2 meters above the ground
  var scope = this;

  var pitchObject = new THREE.Object3D();
  pitchObject.add(camera);

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 2;
  yawObject.add(pitchObject);

  var quat = new THREE.Quaternion();

  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let movementModifier = { x: 0, y: 0 };

  this.setMovement = (movement) => {
    moveForward = movement.y > 0;
    moveBackward = movement.y < 0;
    moveLeft = movement.x > 0;
    moveRight = movement.x < 0;
    movementModifier = movement;
  };

  this.setRotation = (rotation) => {
    yawObject.rotation.y -= -rotation.x * 0.05;
    pitchObject.rotation.x -= -rotation.y * 0.05;

    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    );
  };

  this.jump = () => {
    if (canJump === true) {
      velocity.y = jumpVelocity;
    }
    canJump = false;
  };

  var canJump = false;

  var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
  var upAxis = new CANNON.Vec3(0, 1, 0);
  cannonBody.addEventListener("collide", function (e) {
    var contact = e.contact;

    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check.
    if (contact.bi.id == cannonBody.id)
      // bi is the player body, flip the contact normal
      contact.ni.negate(contactNormal);
    else contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

    // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
    if (contactNormal.dot(upAxis) > 0.5)
      // Use a "good" threshold value between 0 and 1 here!
      canJump = true;
  });

  var velocity = cannonBody.velocity;

  var PI_2 = Math.PI / 2;

  var onMouseMove = function (event) {
    if (scope.enabled === false) return;

    var movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    );
  };

  var onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        jump();
        break;
    }
  };

  var onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // a
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  };

  document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);

  this.enabled = false;

  this.getObject = function () {
    return yawObject;
  };

  // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
  var inputVelocity = new THREE.Vector3();
  var euler = new THREE.Euler();
  this.getDirection = () => ({ x: euler.x, y: euler.y, z: euler.z });
  this.update = function (delta) {
    if (scope.enabled === false) return;

    delta *= 0.1;

    inputVelocity.set(0, 0, 0);

    if (moveForward) {
      inputVelocity.z = -velocityFactor * delta * (1 + movementModifier.y);
    }
    if (moveBackward) {
      inputVelocity.z = velocityFactor * delta * (1 - movementModifier.y);
    }

    if (moveLeft) {
      inputVelocity.x = -sideVelocityFactor * delta * (1 + movementModifier.x);
    }
    if (moveRight) {
      inputVelocity.x = sideVelocityFactor * delta * (1 - movementModifier.x);
    }

    // Convert velocity to world coordinates
    euler.x = pitchObject.rotation.x;
    euler.y = yawObject.rotation.y;
    euler.order = "XYZ";
    quat.setFromEuler(euler);
    inputVelocity.applyQuaternion(quat);

    if (movementModifier.x === 0 && movementModifier.y === 0) {
      velocity.x = 0;
      velocity.z = 0;
    } else {
      velocity.x += inputVelocity.x;
      velocity.z += inputVelocity.z;
    }

    yawObject.position.copy(cannonBody.position);
  };
};
