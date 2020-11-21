const ballShape = new CANNON.Sphere(0.15);
const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 16, 16);
const shootVelo = 15;
const characterRadius = 1;
const directionVector = new THREE.Vector3();
const material = new THREE.MeshLambertMaterial({ color: 0xdddddd });

let balls = [];

let ballIndex = 0;

function getShootDir({ targetVec, physics, camera }) {
  var vector = targetVec;
  targetVec.set(0, 0, 1);
  vector.unproject(camera);
  var ray = new THREE.Ray(
    physics.position,
    vector.sub(physics.position).normalize()
  );
  targetVec.x = ray.direction.x;
  targetVec.y = ray.direction.y + 0.15;
  targetVec.z = ray.direction.z;
}

export const shoot = ({ user, camera, physicsWorld, scene }) => {
  var x = user.physics.position.x;
  var y = user.physics.position.y;
  var z = user.physics.position.z;
  var ballBody = new CANNON.Body({ mass: 1 });
  ballBody.addShape(ballShape);
  var ballMesh = new THREE.Mesh(ballGeometry, material);
  physicsWorld.add(ballBody);
  scene.add(ballMesh);
  ballMesh.castShadow = true;
  ballMesh.receiveShadow = false;
  balls.push({
    id: user.name + "/" + ballIndex,
    bornTime: Date.now(),
    body: ballBody,
    mesh: ballMesh,
  });

  getShootDir({ targetVec: directionVector, physics: user.physics, camera });
  ballBody.velocity.set(
    directionVector.x * shootVelo,
    directionVector.y * shootVelo,
    directionVector.z * shootVelo
  );
  x += directionVector.x * (characterRadius + ballShape.radius);
  y += directionVector.y * (characterRadius + ballShape.radius);
  z += directionVector.z * (characterRadius + ballShape.radius);
  ballBody.position.set(x, y, z);
  ballMesh.position.set(x, y, z);
};

export const updateBullets = ({ scene, physicsWorld }) => {
  balls.forEach((ball, index) => {
    ball.mesh.position.copy(ball.body.position);
    ball.mesh.quaternion.copy(ball.body.quaternion);
  });

  const now = Date.now();
  balls = balls.filter((ball) => {
    const old = now - ball.bornTime > 2000;
    if (old) {
      scene.remove(ball.mesh);
      physicsWorld.remove(ball.body);
    }

    return !old;
  });
};