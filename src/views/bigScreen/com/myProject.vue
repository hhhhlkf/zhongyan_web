<template>
    <div>
        <Transition>
            <div class="loading" v-if="loading">
                <div class="content">
                    <div class="box">
                        <div class="process" :style="{ width: `${process}%` }"></div>
                    </div>
                    <p>{{ `${process}%` }} Loading......</p>
                </div>
            </div>
        </Transition>
        <div id="canvas" ref="canvas"></div>
    </div>
</template>
  
<script setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import gsap from "gsap";
import fragmentShader from '@/assets/img/bigScreen/myProject/shaders/fragment'
import vertexShader from '@/assets/img/bigScreen/myProject/shaders/vertex'
function getAssetsFile(str) {
    return new URL(`../../../assets/img/bigScreen/myProject/${str}`, import.meta.url).href
}

const earthParam = {
    radius: 64,
    surfaceRadius: 10,
    cloudRadius: 10.05,
    atmos: {
        radius: 12.5,
        atmOpacity: { value: 0.7 },
        atmPowFactor: { value: 4.1 },
        atmMultiplier: { value: 9.5 },
    },
    labelOffset: 0.5
}
const canvas = ref(null); // 画布
let scene; // 场景
let camera; // 相机
let renderer; // 渲染器
let controls; // 控制器
let stars; // 星空
const starCount = 10000; // 星星数量
const earthGroup = new THREE.Group(); // 地球和大气层组合
const meshGroup = new THREE.Group(); // 场景内除星空、灯光外所有内容的组合
const manager = new THREE.LoadingManager(); // 加载器管理器
const textureLoader = new THREE.TextureLoader(manager); // 纹理加载器
const objLoader = new OBJLoader(manager) // OBJ模型加载器
const mTLLoader = new MTLLoader(manager) // MTL资源加载器
const process = ref(0); // 加载进度
const loading = ref(true); // 加载中
let composer; // 效果合成器
let earth;

let emit = defineEmits(['dbclick'])


// 卫星轨道
const orbits = GlobalSetting.orbits;

const velocity = 0.001 // 速度

manager.onProgress = function (item, loaded, total) {
    let value = loaded / total * 100
    process.value = Math.ceil(value)
    if (value === 100) {
        setTimeout(() => {
            loading.value = false
            // 定位到球体
            gsap.to(meshGroup.position, {
                z: -15,
                ease: "Power2.inOut",
                duration: 1,
            })
            render();
        }, 1000)
    }
};

onMounted(() => {
    initScene();
    initCamera(canvas.value.clientWidth, canvas.value.clientHeight);
    initRenderer(canvas.value.clientWidth, canvas.value.clientHeight);
    initControls();
    initLight();
    createEarth();
    createStar();
    createStarOrbit(); //创建卫星轨道

    meshGroup.position.set(0, 0, -100)
    scene.add(meshGroup)
});

const initScene = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020924);
    scene.fog = new THREE.Fog(0x020924, 200, 1000);
}

const initCamera = (width, height) => {
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.set(0, 0, 30);
    scene.add(camera);
};

const initRenderer = (width, height) => {
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿
    });
    renderer.setSize(width, height);
    canvas.value.appendChild(renderer.domElement);
    renderer.render(scene, camera);
    renderer.domElement.addEventListener('dblclick', onDoubleClick);
};

function onDoubleClick(event) {
    event.preventDefault();
    // 将点击位置归一化到 [-1, 1] 的范围内
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 使用射线检测是否点击到地球，并获取点击位置的坐标
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(earth);
    if (intersects.length > 0) {
        const point = intersects[0].point;
        console.log(point)
        emit('dbclick')
    }
}

const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement);
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true;
    //是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    controls.autoRotate = false;
    //是否开启右键拖拽
    controls.enablePan = true;
    //摄像机缩放的速度
    controls.zoomSpeed = 1.8;
};

// 设置亮度
const initLight = () => {
    const ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(222, 237, 255)'), 2);
    scene.add(ambientLight);
};

const createStar = () => {
    let geometry = new THREE.BufferGeometry();
    // 顶点集合
    let vertices = new Float32Array(starCount * 3);
    // 随机颜色集合
    let colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // -500 ～ 500之间随机数
        let x = (Math.random() - 0.5) * 1000 + earthParam.radius;
        let y = (Math.random() - 0.5) * 1000 + earthParam.radius;
        let z = (Math.random() - 0.5) * 1000 + earthParam.radius;

        vertices[i * 3 + 0] = x;
        vertices[i * 3 + 1] = y;
        vertices[i * 3 + 2] = z;

        // 随机颜色
        let color = new THREE.Color();
        // setHSL(‘色调', '亮度', ‘饱和‘) 三个参数皆在[0, 1]之间
        color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55);
        colors[i * 3 + 0] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    let starTexture = textureLoader.load(getAssetsFile("img/star.png"));
    let starMaterial = new THREE.PointsMaterial({
        map: starTexture,
        size: 1, // 点大小
        transparent: true, // 材质透明
        opacity: 1, // 透明度
        vertexColors: true, // 顶点着色
        depthTest: true, // 是否在渲染此材质时启用深度测试
        depthWrite: false, // 渲染此材质是否对深度缓冲区有任何影响
        blending: THREE.AdditiveBlending, // 材质混合
        sizeAttenuation: true, // 点的大小是否因相机深度而衰减
    });
    stars = new THREE.Points(geometry, starMaterial);

    scene.add(stars);
};

const createEarth = () => {
    // 地球
    // 创建球形几何体
    const earthGeo = new THREE.SphereGeometry(earthParam.surfaceRadius, earthParam.radius, earthParam.radius, 2.5);
    // 贴图加载
    const earthTexture = textureLoader.load(getAssetsFile("img/earth.png"));
    const earthBumpTexture = textureLoader.load(getAssetsFile("img/earth_bump.png"));
    const earthSpecTexture = textureLoader.load(getAssetsFile("img/earth_ocean.png"));
    // 高光材质
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture, // 贴图
        bumpMap: earthBumpTexture, // 凹凸贴图纹理
        bumpScale: 0.15, // 凹凸贴图会对材质产生多大影响 0～1
        specularMap: earthSpecTexture, // 镜面反射贴图
        specular: new THREE.Color("#909090"), // 材质的高光颜色
        shininess: 50, // 高亮的程度，越高越亮
        transparent: true, // 材质透明
        side: THREE.DoubleSide // 定义将要渲染哪一面，THREE.DoubleSide是两面
    });
    earth = new THREE.Mesh(earthGeo, earthMaterial)
    earthGroup.add(earth)

    // 云层
    const cloudGeo = new THREE.SphereGeometry(earthParam.cloudRadius, earthParam.radius, earthParam.radius)
    const cloudTexture = textureLoader.load(getAssetsFile("img/earth_cloud.png"));
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    })
    const cloud = new THREE.Mesh(cloudGeo, cloudMaterial)
    earthGroup.add(cloud)

    // 大气层
    let atmosGeo = new THREE.SphereGeometry(earthParam.atmos.radius, earthParam.radius, earthParam.radius)
    let atmosMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            atmOpacity: earthParam.atmos.atmOpacity,
            atmPowFactor: earthParam.atmos.atmPowFactor,
            atmMultiplier: earthParam.atmos.atmMultiplier
        },
        // 注意，默认情况下，Three.js 使用 NormalBlending，如果输出颜色的不透明度变低，显示的颜色可能会变白
        blending: THREE.AdditiveBlending, // 比设置transparent：true效果更好，因为它避免了地球周围奇怪的黑暗边缘
        side: THREE.BackSide, // 使其不会覆盖在地球顶部；这在顶点着色器中指向相反方向的法线
        depthTest: false, // 关闭深度测试
    })
    const atmos = new THREE.Mesh(atmosGeo, atmosMat)
    earthGroup.add(atmos)

    // 设置地球组转向
    earthGroup.rotation.set(0.5, 0, -0.4);

    meshGroup.add(earthGroup)
    scene.add(meshGroup)
};

const createStarOrbit = () => {
    // 效果合成器，是Three.js中的一个后期处理效果库。EffectComposer允许您将多个RenderPass组合在一起，以创建复杂的后期处理效果
    composer = new EffectComposer(renderer)

    // 通用的渲染器通道，用于将场景渲染到纹理或屏幕上
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    orbits.forEach((v, i) => {
        // 卫星
        v.satellites.forEach((vv, ii) => {
            createSatellite(v, vv, ii);
        })

        createMoveTrack(i);
    })
}

const createMoveTrack = (index) => {
    let orbit = orbits[index]

    const { x, y, z } = orbit.attri.rotation
    // 创建环形几何体
    const torusGeo = new THREE.TorusGeometry(orbit.attri.ringRadius, 0.2, 2, 200)
    let _orbit = new THREE.Mesh(torusGeo, null);
    _orbit.updateMatrix();
    _orbit.rotation.set(x, y, z);
    orbit.obj = _orbit

    // number 轨迹环总长度  radius 轨迹环半径   centerPoint 圆心   pointsArr 向量组合
    const length = 300,
        centerPoint = { x: 0, y: 0, z: 0 },
        pointsArr = [];

    // 通过三角函数计算圆上点坐标
    // 根据三角函数正弦、余弦求得，假设圆心**P(0, 0, 0)**，半径**r(9)**，一共**length300**个点，循环长度的到坐标位置**i**
    // x = r * Math.sin(Math.PI * 2 * i / length) + p.x
    // y = r * Math.cos(Math.PI * 2 * i / length) + p.y
    for (let i = 0; i <= length; i++) {
        pointsArr.push(
            new THREE.Vector3(
                orbit.attri.ringRadius * Math.sin(Math.PI * 2 * i / length) + centerPoint.x,
                orbit.attri.ringRadius * Math.cos(Math.PI * 2 * i / length) + centerPoint.y,
                centerPoint.z
            )
        )
    }
    // 3阶段贝塞尔曲线
    orbit.curve = new THREE.CatmullRomCurve3(pointsArr, true, 'catmullrom', 0.5);
    // 分成50个点
    const points = orbit.curve.getPoints(50);
    // 建立轨迹线并设置完全透明隐藏起来
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: 1, color: orbit.attri.color })
    const line = new THREE.Line(lineGeo, lineMaterial)
    // 设置跟星轨一样的转向，这样到卫星看起来就会在轨迹环边运动
    line.rotation.set(x, y, z);

    // 物体旋转移动后顶点不更新
    // 创建一个四维矩阵
    // 然后将torus.rotation创建一个旋转矩阵并赋值给matrix
    // 最后将旋转矩阵应用于curve的顶点
    // 通过applyMatrix4(matrix)方法，curve.points[i]对象的坐标会根据旋转矩阵matrix进行变换，从而实现旋转效果
    const matrix = new THREE.Matrix4();
    matrix.makeRotationFromEuler(orbit.obj.rotation);
    for (let i = 0; i < orbit.curve.points.length; i++) {
        orbit.curve.points[i].applyMatrix4(matrix);
    }

    meshGroup.add(line)
}



const createSatellite = (orbit, satellite, index) => {
    mTLLoader.load(getAssetsFile('mtl/Satellite.mtl'), (material) => {
        // 预加载材质所需的所有纹理、贴图
        material.preload()

        objLoader.setMaterials(material).load(getAssetsFile('obj/Satellite.obj'), (obj) => {
            // 将轨迹路线的第一个坐标设置成卫星的初始位置
            obj.position.copy(orbit.curve.points[index * 2])
            satellite.obj = obj
            satellite.progress = 0.1 * index
            meshGroup.add(satellite.obj)

            // 创建一个Canvas元素，并设置文本内容和样式
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const labelWidth = 30;
            const labelHeight = 20;
            canvas.width = labelWidth;
            canvas.height = labelHeight;

            // 清除Canvas内容，使背景透明
            context.clearRect(0, 0, labelWidth, labelHeight);

            context.font = 'bold 12px';
            context.fillStyle = `rgba(255, 255, 255, 0.8)`;
            context.fillText(satellite.name, 0, 12);

            // 缩小比例
            const scaleRatio = 0.05; // 缩小到原始尺寸的一半

            // 将Canvas转化为纹理
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            texture.center.set(scaleRatio, scaleRatio); // 设置纹理中心点为标签中心

            // 创建一个Sprite材质，并将Canvas纹理作为其贴图
            const labelMaterial = new THREE.SpriteMaterial({ map: texture });

            // 创建一个Sprite对象来显示标签
            const labelSprite = new THREE.Sprite(labelMaterial);
            labelSprite.scale.set(labelWidth * scaleRatio, labelHeight * scaleRatio, 1); // 设置标签大小
            // 设置标签的位置偏移，使其紧贴在卫星旁边

            const { x, y, z } = orbit.curve.points[index * 2]
            labelSprite.position.set(x + earthParam.labelOffset, y + earthParam.labelOffset, z)
            satellite.labelSprite = labelSprite
            // 将标签与卫星关联
            meshGroup.add(labelSprite); // satellite 是你的卫星对象
        })
    })
}

const render = () => {
    controls.update();
    renderer.render(scene, camera);

    if (composer) {
        composer.render();
    }

    if (stars) {
        stars.rotation.y += 0.0009;
        stars.rotation.z -= 0.0003;
    }

    // 卫星公转
    orbits.forEach((v, i) => {
        v.satellites.forEach((vv, ii) => {
            if (vv.progress + velocity * 2 <= 1) {
                vv.progress += velocity
                const satelliteMovePosition = v.curve.getPointAt(vv.progress + velocity)
                vv.obj.position.copy(satelliteMovePosition)
                const { x, y, z } = satelliteMovePosition
                vv.labelSprite.position.set(x + earthParam.labelOffset, y + earthParam.labelOffset, z)
            } else {
                vv.progress = 0
            }
        })
    })

    requestAnimationFrame(render);
};


window.addEventListener("resize", () => {
    // 更新摄像机
    camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight;
    // 更新摄像机投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器
    renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
    // 设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
    // 更新效果合成器
    composer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
});
</script>
  
<style lang="scss" scoped>
#canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.loading {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100000;

    .content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 30%;
        text-align: center;

        .box {
            width: 100%;
            height: 30px;
            background: #1e1d1d;
            border-radius: 30px;
            box-shadow: 0 0 4px 4px #ffffff3c;
            overflow: hidden;

            .process {
                width: 0%;
                height: 100%;
                background-image: linear-gradient(45deg, #0a9798 0%, #0b75cf 100%);
                transition: all 1s;
            }
        }

        p {
            padding-top: 10px;
        }
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
  