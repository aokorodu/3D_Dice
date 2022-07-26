import * as THREE from "three";
import gsap from "gsap";
import image_1 from "../assets/1.png";
import image_2 from "../assets/2.png";
import image_3 from "../assets/3.png";
import image_4 from "../assets/4.png";
import image_5 from "../assets/5.png";
import image_6 from "../assets/6.png";

class Cube {
  constructor(x, y, z, scene) {
    const ninety = Math.PI / 2;
    const oneEight = Math.PI;
    const threeFourth = (3 * Math.PI) / 2;
    const tau = Math.PI * 2;

    this.size = {
      width: 20,
      height: 20,
      depth: 20,
    };
    this.position = {
      x: x,
      y: y,
      z: z,
      startX: x,
      startY: y,
      startZ: z,
    };
    this.velocity = {
      x: 1 - Math.random() * 2,
      y: 6,
      z: -3 - Math.random() * 2,
    };

    this.acceleration = {
      x: 0,
      y: -0.35,
      z: 0,
    };

    this.friction = {
      x: 0.9,
      y: 0.99,
      z: 0.99,
    };

    this.targetRotations = [
      {
        x: 0,
        y: Math.random() * ninety,
        z: ninety,
      },
      {
        x: 0,
        y: Math.random() * ninety,
        z: threeFourth,
      },
      {
        x: 0,
        y: Math.random() * ninety,
        z: 0,
      },
      {
        x: 0,
        y: Math.random() * ninety,
        z: oneEight,
      },
      {
        x: ninety,
        y: oneEight,
        z: Math.random() * ninety,
      },
      {
        x: ninety,
        y: 0,
        z: Math.random() * ninety,
      },
    ];

    this.elasticity = .7;

    this.scene = scene;
    this.cube = null;
    this.thrown = false;
    this.landed = false;
  }

  getRotations(num) {
    return num > 6 || num < 1
      ? this.targetRotations[0]
      : this.targetRotations[num - 1];
  }

  reset() {
    this.thrown = false;
    this.landed = false;
    this.position.x = this.position.startX;
    this.position.y = this.position.startY + (Math.random()*10 - 5);
    this.position.z = this.position.startZ;
    this.velocity = {
      x: 1 - Math.random() * 2,
      y: 3 + Math.random() * 3,
      z: -3 - Math.random() * 2,
    };
    gsap.set(this.cube.rotation, { x: 0, y: 0, z: 0 });
  }

  init() {
    console.log("init cube");
    const loader = new THREE.TextureLoader();
    const cubeGeometry = new THREE.BoxGeometry(
      this.size.width,
      this.size.height,
      this.size.depth
    );

    const cubeTextures = [
      new THREE.MeshStandardMaterial({ map: loader.load(image_1) }),
      new THREE.MeshStandardMaterial({ map: loader.load(image_2) }),
      new THREE.MeshStandardMaterial({ map: loader.load(image_3) }),
      new THREE.MeshStandardMaterial({ map: loader.load(image_4) }),
      new THREE.MeshStandardMaterial({ map: loader.load(image_5) }),
      new THREE.MeshStandardMaterial({ map: loader.load(image_6) }),
    ];

    this.cube = new THREE.Mesh(cubeGeometry, cubeTextures);
    this.cube.castShadow = true; //default is false
    this.cube.receiveShadow = false; //default
    this.cube.visible = false;

    this.updatePosition();
    this.draw();

    this.scene.add(this.cube);
  }

  throw(num) {
    if (this.thrown) return;
    this.thrown = true;
    this.cube.visible = true;
    const rotations = this.getRotations(num);

    const spin = -(6 * Math.PI);

    gsap.to(this.cube.rotation, {
      x: rotations.x + spin,
      y: rotations.y,
      z: rotations.z,
      duration: 1.75 + Math.random() * .15,
      ease: "power1.out",
    });
  }

  update() {
    if (!this.thrown) return;
    if (this.landed) return;
    this.updatePosition();
    this.draw();
    if (this.isStopped()) this.landed = true;
  }

  updatePosition() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.velocity.z += this.acceleration.z;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;

    if (this.position.y < this.size.height / 2) {
      this.position.y = this.size.height / 2;
      this.velocity.y = this.velocity.y * -1 * this.elasticity;
      this.velocity.z *= 0.88;
    }

    this.velocity.x *= this.friction.x;
    this.velocity.y *= this.friction.y;
    this.velocity.z *= this.friction.z;
  }

  draw() {
    this.cube.position.set(this.position.x, this.position.y, this.position.z);
  }

  isStopped() {
    if (Math.abs(this.velocity.z) < 0.01) {
      console.log("stopped");
      return true;
    }

    return false;
  }

  hasLanded() {
    return this.landed;
  }

  isAvailable() {
    if (!this.thrown) return true;
    if (this.thrown && this.landed) return true;
    if (this.thrown && !this.landed) return false;

    return true;
  }
}

export default Cube;
