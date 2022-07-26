import styles from "./Craps.module.css";
import * as THREE from "three";
import gsap from "gsap";
import { useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import table_texture from "../assets/wood_panel.png";

import Cube from "./Cube";

function Craps({ dice }) {
  console.log("app");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  let camera = null;
  let renderer = null;
  let totalAmount = 0;
  const totalCubes = dice;
  const cubes = [];
  let initialized = false;

  // lights
  let pointLight = null;
  let ambientLight = null;

  // helpers
  let lightHelper = null;
  let gridHelper = null;

  useEffect(() => {
    init();
  }, []);

  const updateTotal = (e)=>{
    totalAmount = e.target.value
  }
  const init = () => {
    if (initialized) return;
    initialized = true;
    console.log("init");
    initCamera();
    initRenderer();
    initLight();
    //initHelpers();
    initCubes();
    initFloor();
    initOrbitControls();
    animate();
    zoomIN();
  };

  const zoomIN = () => {
    const tl = gsap.timeline();
    tl.to(camera.position, {
      x: 200,
      y: 500,
      z: 0,
      duration: 3,
      ease: "linear",
      delay: 1,
      onUpdate: function () {
        camera.lookAt(0, 0, 0);
      },
    });
    tl.to(camera.position, {
      x: 0,
      y: 200,
      z: 200,
      duration: 4.5,
      ease: "sine.out",
      onUpdate: function () {
        camera.lookAt(0, 0, 0);
      },
    });
  };

  const getANumber = () => {
    console.log('getANumber');
    return Math.ceil(Math.random() * 6);
  };

  const throwCubes = () => {
    console.log("cubesAvailable? ", cubesAvailable());
    if (!cubesAvailable()) return;

    const num = cubes.length;
    const vals = [];
    for (let i = 0; i < num; i++) {
      vals.push(getANumber());
    }
    console.log("total amound: ", totalAmount, 'dice: ', num);
    if (totalAmount != null && num == 2) {
      let firstNum, secondNum;
      if (totalAmount == 0) {
        firstNum = Math.round(Math.random() * 6);
        secondNum = Math.round(Math.random() * 6);
      }
      if (totalAmount > 0 && totalAmount <= 6) {
        firstNum = 1 + Math.floor(Math.random() * (totalAmount - 1));
        secondNum = totalAmount - firstNum;
      }
      if (totalAmount > 6) {
        const min = totalAmount - 6;
        firstNum = min + Math.floor(Math.random() * (6 - min));
        secondNum = totalAmount - firstNum;
      }

      console.log("first num: ", firstNum, " second num: ", secondNum);
      vals[0] = firstNum;
      vals[1] = secondNum;
    } else if(num == 1){
      let firstnum;
      console.log('totalAmount: ', totalAmount)
      totalAmount == 0 ? firstnum = getANumber() : firstnum = totalAmount;
      vals[0] = firstnum;
    }
    cubes.forEach((cube, index) => {
      cube.reset();
      cube.throw(vals[index]);
    });
  };

  const cubesAvailable = () => {
    const bool = cubes.some((cube) => cube.isAvailable() == false);
    return !bool;
  };
  const initCamera = () => {
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    // camera.position.set(0, 200, 200);
    camera.position.set(0, 800, -200);
  };

  const initRenderer = () => {
    renderer = new THREE.WebGL1Renderer({
      canvas: document.querySelector("#canvas"),
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(600, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  };

  const initLight = () => {
    pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 250, 0);
    pointLight.castShadow = true;
    //Set up shadow properties for the light
    // pointLight.shadow.mapSize.width = 512; // default
    // pointLight.shadow.mapSize.height = 512; // default
    // pointLight.shadow.camera.near = 0.5; // default
    // pointLight.shadow.camera.far = 500; // default

    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(100, 250, 100);
    spotLight.castShadow = true;

    ambientLight = new THREE.AmbientLight(0x434343);

    scene.add(pointLight, spotLight, ambientLight);
  };

  const initHelpers = () => {
    lightHelper = new THREE.PointLightHelper(pointLight);
    //gridHelper = new THREE.GridHelper(200, 20);
    scene.add(lightHelper /*, gridHelper*/);
  };

  const initOrbitControls = () => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
  };

  const initCubes = () => {
    const distance = (totalCubes - 1) * 55;
    const increment = totalCubes == 1 ? 0 : distance / (totalCubes - 1);
    const startX = -distance / 2;
    for (let i = 0; i < totalCubes; i++) {
      const x = startX + i * increment;
      const y = 175 - Math.random() * 100;
      const z = 270 - Math.random() * 50;
      const cube = new Cube(x, y, z, scene);
      cube.init();
      cubes.push(cube);
    }
    console.log("init cube");
  };

  const initFloor = () => {
    const loader = new THREE.TextureLoader();

    const geometry = new THREE.PlaneGeometry(800, 800);

    const material = new THREE.MeshStandardMaterial({
      map: loader.load(table_texture),
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    floor.rotation.z = 0;

    scene.add(floor);
  };

  const animate = () => {
    cubes.forEach((cube) => {
      cube.update();
    });
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };
  return (
    <div className="Craps">
      <div className={styles.holder}>
        {totalCubes == 2 && <div>desired amount: {totalAmount == 0 ? "random" : totalAmount}</div>}
        <canvas id="canvas"></canvas>
        <div>
          <button onClick={throwCubes}>throw</button>
          {totalCubes <= 2 && (
                <div className={styles.questionHolder}>
                  <span>desired roll amount</span>
                  <select
                    className={styles.settingsSelect}
                    name="total"
                    onChange={updateTotal}
                    defaultValue="0"
                  >
                    <option value="0">random</option>
                    {totalCubes == 1 && <option value="1">1</option>}
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    {totalCubes == 2 && (
                      <>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    </>)}
                  </select>
                </div>
              )}
        </div>
      </div>
    </div>
  );
}

export default Craps;
