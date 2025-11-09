"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"


const planetsData = [
  {
    name: "Mercurio",
    color: 0x8c7853,
    size: 5,
    distance: 25,
    speed: 0.02,
    moons: [],
    description: "Mercurio es el planeta más cercano al Sol y el más pequeño del sistema solar. Tiene una superficie craterizada similar a la Luna, con temperaturas extremas que van desde -173°C en la noche hasta 427°C durante el día. Su atmósfera es prácticamente inexistente.",
    mass: "3.30 × 10²³ kg",
    diameter: "4,879 km",
    orbitalPeriod: "88 días terrestres",
    rotationPeriod: "58.6 días terrestres",
    temperature: { min: -173, max: 427 },
    atmosphere: "Muy delgada (oxígeno, sodio, hidrógeno, potasio)",
    surface: "Rocas ígneas, superficie craterizada"
  },
  {
    name: "Venus",
    color: 0xe8c468,
    size: 7,
    distance: 40,
    speed: 0.015,
    moons: [],
    description: "Venus es el segundo planeta desde el Sol y el más caliente del sistema solar debido a un intenso efecto invernadero. Su atmósfera densa está compuesta principalmente de dióxido de carbono. Rota en dirección opuesta al resto de planetas.",
    mass: "4.87 × 10²⁴ kg",
    diameter: "12,104 km",
    orbitalPeriod: "225 días terrestres",
    rotationPeriod: "243 días terrestres (retrógrada)",
    temperature: { min: 450, max: 470 },
    atmosphere: "Densa (CO₂ 96.5%, nitrógeno 3.5%)",
    surface: "Rocas basálticas, volcanes, llanuras"
  },
  {
    name: "Tierra",
    color: 0x4a90e2,
    size: 8,
    distance: 60,
    speed: 0.012,
    moons: [{ size: 2.5, color: 0x9e9e9e, distance: 12, speed: 0.08, name: "Luna" }],
    description: "La Tierra es el tercer planeta desde el Sol y el único conocido con vida. Tiene una atmósfera rica en oxígeno y nitrógeno, océanos que cubren el 71% de su superficie, y una luna que estabiliza su rotación. Es el planeta más denso del sistema solar.",
    mass: "5.97 × 10²⁴ kg",
    diameter: "12,756 km",
    orbitalPeriod: "365.25 días",
    rotationPeriod: "24 horas",
    temperature: { min: -89, max: 58 },
    atmosphere: "Nitrógeno 78%, oxígeno 21%, argón 0.9%",
    surface: "Continentes, océanos, hielo polar"
  },
  {
    name: "Marte",
    color: 0xc1440e,
    size: 6,
    distance: 80,
    speed: 0.01,
    moons: [
      { size: 1.5, color: 0x8b6f47, distance: 10, speed: 0.1, name: "Fobos" },
      { size: 1.2, color: 0x9d7f5c, distance: 14, speed: 0.06, name: "Deimos" }
    ],
    description: "Marte, conocido como el planeta rojo, tiene una atmósfera delgada rica en dióxido de carbono. Posee la montaña más alta del sistema solar (Mons Olimpus, 22 km) y evidencia de agua líquida en el pasado. Sus dos pequeñas lunas son irregulares y probablemente asteroides capturados.",
    mass: "6.39 × 10²³ kg",
    diameter: "6,792 km",
    orbitalPeriod: "687 días terrestres",
    rotationPeriod: "24 horas 37 minutos",
    temperature: { min: -87, max: -5 },
    atmosphere: "Delgada (CO₂ 95%, nitrógeno, argón)",
    surface: "Desiertos rojos, volcanes, valles"
  },
  {
    name: "Júpiter",
    color: 0xc88b3a,
    size: 20,
    distance: 120,
    speed: 0.008,
    moons: [
      { size: 3, color: 0xe8d4a0, distance: 30, speed: 0.05, name: "Io" },
      { size: 2.8, color: 0xb8a888, distance: 35, speed: 0.03, name: "Europa" },
      { size: 3.5, color: 0xa89878, distance: 40, speed: 0.025, name: "Ganímedes" },
      { size: 3, color: 0x8b7d6b, distance: 45, speed: 0.02, name: "Calisto" }
    ],
    description: "Júpiter es el planeta más grande del sistema solar, un gigante gaseoso compuesto principalmente de hidrógeno y helio. Tiene al menos 95 lunas, incluyendo las cuatro lunas galileanas. Su característica más famosa es la Gran Mancha Roja, una tormenta anticiclónica gigante.",
    mass: "1.90 × 10²⁷ kg",
    diameter: "142,984 km",
    orbitalPeriod: "4,333 días terrestres",
    rotationPeriod: "9 horas 56 minutos",
    temperature: { min: -108, max: -108 },
    atmosphere: "Hidrógeno 89%, helio 10%, metano, amoníaco",
    surface: "Sin superficie sólida, capas de gas"
  },
  {
    name: "Saturno",
    color: 0xd4a574,
    size: 18,
    distance: 160,
    speed: 0.006,
    hasRings: true,
    moons: [
      { size: 4, color: 0xc8a882, distance: 35, speed: 0.04, name: "Titán" },
      { size: 3, color: 0xb89870, distance: 40, speed: 0.03, name: "Rea" },
      { size: 2.5, color: 0xd4c4b4, distance: 45, speed: 0.025, name: "Encélado" }
    ],
    description: "Saturno es el sexto planeta desde el Sol y el segundo más grande. Es famoso por sus espectaculares anillos compuestos de hielo y roca. Tiene al menos 146 lunas, siendo Titán la más grande y la única con atmósfera significativa. Es menos denso que el agua.",
    mass: "5.68 × 10²⁶ kg",
    diameter: "120,536 km",
    orbitalPeriod: "10,759 días terrestres",
    rotationPeriod: "10 horas 39 minutos",
    temperature: { min: -139, max: -139 },
    atmosphere: "Hidrógeno 96%, helio 3%, metano, amoníaco",
    surface: "Sin superficie sólida, capas de gas"
  },
  {
    name: "Urano",
    color: 0x5ba3a3,
    size: 14,
    distance: 200,
    speed: 0.005,
    moons: [
      { size: 2.5, color: 0x8b9b9b, distance: 25, speed: 0.035, name: "Titania" },
      { size: 2.5, color: 0x7a8a8a, distance: 30, speed: 0.025, name: "Oberón" }
    ],
    description: "Urano es el séptimo planeta desde el Sol y el tercero más grande. Es único por rotar de lado (98° de inclinación axial). Su color azul verdoso se debe al metano en su atmósfera. Tiene 27 lunas conocidas y un sistema de anillos delgados.",
    mass: "8.68 × 10²⁵ kg",
    diameter: "51,118 km",
    orbitalPeriod: "30,687 días terrestres",
    rotationPeriod: "17 horas 14 minutos",
    temperature: { min: -197, max: -197 },
    atmosphere: "Hidrógeno 83%, helio 15%, metano 2%",
    surface: "Sin superficie sólida, capas de gas"
  },
  {
    name: "Neptuno",
    color: 0x4169e1,
    size: 14,
    distance: 240,
    speed: 0.004,
    moons: [{ size: 3.5, color: 0x9ab4c4, distance: 25, speed: 0.04, name: "Tritón" }],
    description: "Neptuno es el octavo y más distante planeta del sistema solar. Tiene el viento más rápido registrado (2100 km/h) y un color azul intenso debido al metano. Su luna más grande, Tritón, orbita en dirección retrógrada y es la única luna grande con atmósfera significativa.",
    mass: "1.02 × 10²⁶ kg",
    diameter: "49,528 km",
    orbitalPeriod: "60,190 días terrestres",
    rotationPeriod: "16 horas 6 minutos",
    temperature: { min: -201, max: -201 },
    atmosphere: "Hidrógeno 80%, helio 19%, metano 1%",
    surface: "Sin superficie sólida, capas de gas"
  }
]

const planetQuizzes = {
  'Mercurio': [
    { question: '¿Cuál es la composición principal de la atmósfera de Mercurio?', options: ['Nitrógeno y oxígeno', 'Dióxido de carbono', 'Sodio y potasio', 'Hidrógeno y helio'], correct: 2, explanation: '¡Correcto! La atmósfera de Mercurio contiene principalmente sodio y potasio vaporizados.' },
    { question: '¿Cuántos días terrestres tarda Mercurio en completar una órbita alrededor del Sol?', options: ['88 días', '225 días', '365 días', '687 días'], correct: 0, explanation: '¡Correcto! Mercurio completa una órbita en solo 88 días terrestres.' },
    { question: '¿Cuál es la característica más notable de la superficie de Mercurio?', options: ['Grandes océanos', 'Valles profundos', 'Crateres de impacto', 'Montañas altas'], correct: 2, explanation: '¡Correcto! Mercurio tiene la superficie más craterizada del sistema solar.' },
    { question: '¿Por qué Mercurio tiene temperaturas tan extremas?', options: ['Está muy lejos del Sol', 'No tiene atmósfera', 'Rota muy lentamente', 'Tiene una órbita elíptica'], correct: 1, explanation: '¡Correcto! Sin atmósfera para retener el calor, Mercurio experimenta variaciones extremas de temperatura.' }
  ],
  'Venus': [
    { question: '¿Cuál es el período de rotación de Venus?', options: ['24 horas', '243 días terrestres', '365 días', '30 días'], correct: 1, explanation: '¡Correcto! Venus rota en dirección opuesta al resto de planetas y tarda 243 días terrestres en completar una rotación.' },
    { question: '¿Qué fenómeno hace que Venus sea el planeta más caliente?', options: ['Está más cerca del Sol', 'Efecto invernadero extremo', 'Actividad volcánica intensa', 'Campo magnético fuerte'], correct: 1, explanation: '¡Correcto! El efecto invernadero extremo causado por la densa atmósfera de CO2 hace que Venus sea el planeta más caliente.' },
    { question: '¿Cuál es la composición principal de la atmósfera de Venus?', options: ['Nitrógeno', 'Oxígeno', 'Dióxido de carbono', 'Argón'], correct: 2, explanation: '¡Correcto! La atmósfera de Venus está compuesta principalmente por dióxido de carbono (96.5%).' },
    { question: '¿Cuántas veces más denso es el aire en Venus comparado con la Tierra?', options: ['2 veces', '10 veces', '50 veces', '90 veces'], correct: 3, explanation: '¡Correcto! La atmósfera de Venus es 90 veces más densa que la de la Tierra.' }
  ],
  'Tierra': [
    { question: '¿Cuál es el porcentaje aproximado de agua en la superficie de la Tierra?', options: ['10%', '30%', '50%', '71%'], correct: 3, explanation: '¡Correcto! Aproximadamente el 71% de la superficie terrestre está cubierta por agua.' },
    { question: '¿Qué capa de la Tierra es la más delgada?', options: ['Núcleo', 'Manto', 'Corteza', 'Atmósfera'], correct: 2, explanation: '¡Correcto! La corteza terrestre es la capa más delgada, con un espesor promedio de solo 30 km.' },
    { question: '¿Cuál es la teoría aceptada sobre el origen de la Luna?', options: ['Se formó junto con la Tierra', 'Fue capturada por la gravedad terrestre', 'Colisión con un planeta del tamaño de Marte', 'Es un satélite artificial'], correct: 2, explanation: '¡Correcto! La teoría más aceptada es que la Luna se formó por la colisión de un protoplaneta del tamaño de Marte con la Tierra primitiva.' },
    { question: '¿Cuántas placas tectónicas principales componen la litosfera terrestre?', options: ['3', '7', '12', '20'], correct: 1, explanation: '¡Correcto! La litosfera terrestre está dividida en aproximadamente 7 placas tectónicas principales.' }
  ],
  'Marte': [
    { question: '¿Cuál es el nombre de las dos lunas de Marte?', options: ['Ío y Europa', 'Fobos y Deimos', 'Titán y Rea', 'Calisto y Ganímedes'], correct: 1, explanation: '¡Correcto! Las dos lunas de Marte se llaman Fobos y Deimos.' },
    { question: '¿Cuál es la montaña más alta del sistema solar?', options: ['Everest en la Tierra', 'Mons Olimpus en Marte', 'Mauna Kea en la Tierra', 'Monte Etna en la Tierra'], correct: 1, explanation: '¡Correcto! Mons Olimpus en Marte es la montaña más alta del sistema solar, con 22 km de altura.' },
    { question: '¿Qué evidencia sugiere que Marte pudo tener agua líquida en el pasado?', options: ['Océanos actuales', 'Ríos y lagos secos', 'Nubes de vapor', 'Glaciares activos'], correct: 1, explanation: '¡Correcto! Los valles secos, deltas y formaciones rocosas sugieren que Marte tuvo ríos y lagos en el pasado.' },
    { question: '¿Cuánto dura un día en Marte?', options: ['24 horas', '24 horas 37 minutos', '48 horas', '12 horas'], correct: 1, explanation: '¡Correcto! Un día marciano (sol) dura 24 horas y 37 minutos.' }
  ],
  'Júpiter': [
    { question: '¿Cuál es la composición principal de la atmósfera de Júpiter?', options: ['Nitrógeno', 'Oxígeno', 'Hidrógeno y helio', 'Dióxido de carbono'], correct: 2, explanation: '¡Correcto! La atmósfera de Júpiter está compuesta principalmente por hidrógeno (89%) y helio (10%).' },
    { question: '¿Cuántas lunas principales tiene Júpiter?', options: ['4', '16', '63', '95'], correct: 3, explanation: '¡Correcto! Júpiter tiene 95 lunas confirmadas, incluyendo las 4 lunas galileanas principales.' },
    { question: '¿Qué es la Gran Mancha Roja de Júpiter?', options: ['Un continente', 'Una tormenta anticiclónica', 'Un océano', 'Un volcán'], correct: 1, explanation: '¡Correcto! La Gran Mancha Roja es una tormenta anticiclónica gigante que ha estado activa por al menos 400 años.' },
    { question: '¿Cuál es el diámetro ecuatorial de Júpiter?', options: ['6,000 km', '12,756 km', '142,984 km', '50,724 km'], correct: 2, explanation: '¡Correcto! Júpiter tiene un diámetro ecuatorial de 142,984 km, 11 veces más grande que la Tierra.' }
  ],
  'Saturno': [
    { question: '¿Cuál es la composición principal de los anillos de Saturno?', options: ['Rocas sólidas', 'Hielo de agua con rocas', 'Gas metano', 'Polvo metálico'], correct: 1, explanation: '¡Correcto! Los anillos de Saturno están compuestos principalmente por hielo de agua con fragmentos de roca.' },
    { question: '¿Cuántas lunas tiene Saturno?', options: ['4', '18', '63', '146'], correct: 3, explanation: '¡Correcto! Saturno tiene 146 lunas confirmadas, más que cualquier otro planeta.' },
    { question: '¿Cuál es la luna más grande de Saturno?', options: ['Rea', 'Titán', 'Encélado', 'Mimas'], correct: 1, explanation: '¡Correcto! Titán es la luna más grande de Saturno y la segunda más grande del sistema solar.' },
    { question: '¿Por qué Saturno tiene menor densidad que el agua?', options: ['Es hueco', 'Tiene mucha atmósfera', 'Está compuesto principalmente de gas', 'Tiene muchos anillos'], correct: 2, explanation: '¡Correcto! Saturno es un planeta gaseoso con densidad menor que el agua, por lo que flotaría si hubiera un océano lo suficientemente grande.' }
  ],
  'Urano': [
    { question: '¿Cuál es la característica más notable de la rotación de Urano?', options: ['Rota muy rápido', 'Rota de lado', 'No rota', 'Rota al revés'], correct: 1, explanation: '¡Correcto! Urano rota prácticamente de lado, con un eje de rotación inclinado 98 grados.' },
    { question: '¿Cuál es la composición principal de la atmósfera de Urano?', options: ['Hidrógeno y oxígeno', 'Hidrógeno, helio y metano', 'Nitrógeno y oxígeno', 'Dióxido de carbono'], correct: 1, explanation: '¡Correcto! La atmósfera de Urano contiene hidrógeno (83%), helio (15%) y metano (2%).' },
    { question: '¿Cuántas lunas tiene Urano?', options: ['5', '18', '27', '62'], correct: 2, explanation: '¡Correcto! Urano tiene 27 lunas conocidas.' },
    { question: '¿Qué hace que Urano tenga un color azul verdoso?', options: ['Océanos de agua', 'Metano en la atmósfera', 'Polvo del espacio', 'Actividad volcánica'], correct: 1, explanation: '¡Correcto! El metano en la atmósfera de Urano absorbe la luz roja y refleja la azul, dándole su color característico.' }
  ],
  'Neptuno': [
    { question: '¿Cuál es la luna más grande de Neptuno?', options: ['Nereida', 'Proteo', 'Tritón', 'Larisa'], correct: 2, explanation: '¡Correcto! Tritón es la luna más grande de Neptuno y la única con atmósfera significativa.' },
    { question: '¿Qué hace que Neptuno tenga un color azul intenso?', options: ['Océanos superficiales', 'Metano en la atmósfera', 'Polvo interestelar', 'Tormentas eléctricas'], correct: 1, explanation: '¡Correcto! El metano en la atmósfera de Neptuno absorbe la luz roja y refleja la azul, creando su intenso color azul.' },
    { question: '¿Cuántas lunas tiene Neptuno?', options: ['1', '8', '14', '27'], correct: 2, explanation: '¡Correcto! Neptuno tiene 14 lunas conocidas.' },
    { question: '¿Cuál es la velocidad máxima registrada de los vientos en Neptuno?', options: ['500 km/h', '1200 km/h', '2100 km/h', '3000 km/h'], correct: 2, explanation: '¡Correcto! Los vientos en Neptuno pueden alcanzar velocidades de hasta 2100 km/h, los más rápidos del sistema solar.' }
  ]
};

const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error en síntesis de voz:', error);
    }
  } else {
    console.warn('Síntesis de voz no disponible en este navegador');
  }
};

export default function SolarSystem() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [enableNarration, setEnableNarration] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    console.log('🚀 Inicializando Sistema Solar 3D...');

    // Verificar WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error('❌ WebGL no está disponible');
        mountRef.current.innerHTML = '<div style="color: white; text-align: center; padding: 50px; background: black;">❌ WebGL no está disponible en este navegador</div>';
        return;
      }
      console.log('✅ WebGL disponible');
    } catch (e) {
      console.error('❌ Error verificando WebGL:', e);
      return;
    }

    // Crear escena con fondo espacial más claro
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a); // Azul muy oscuro en lugar de negro puro

    // Cámara 3D optimizada para resolución 1280x1024
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 80, 150);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controles interactivos para vista 360 grados
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.minDistance = 50;
    controls.maxDistance = 500;

    // Raycaster para detectar clics en planetas
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Función para manejar clics
    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const planetMeshes = planetGroups.map(group => (group as any).planetMesh);
      const intersects = raycaster.intersectObjects(planetMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const planetIndex = planetMeshes.indexOf(clickedMesh);
        if (planetIndex !== -1) {
          setSelectedPlanet(planetsData[planetIndex].name);
        }
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Luces simples y efectivas
    const ambientLight = new THREE.AmbientLight(0x666666, 0.6);
    scene.add(ambientLight);

    // Luz principal del sol
    const sunLight = new THREE.PointLight(0xffffff, 2, 800);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Estrellas de fondo
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 2000;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Sol 3D con efecto de brillo realista
    const sunGeometry = new THREE.SphereGeometry(15, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffdd44
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Glow del sol más intenso
    const sunGlowGeometry = new THREE.SphereGeometry(20, 64, 64);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.3
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);

    // Grupo del sistema solar
    const solarSystemGroup = new THREE.Group();
    scene.add(solarSystemGroup);

    // Arrays para planetas, ángulos y órbitas
    const planetGroups: THREE.Group[] = [];
    const orbitLines: THREE.Mesh[] = [];

    // Crear planetas
    planetsData.forEach((planet) => {
      const planetGroup = new THREE.Group();

      // 🪐 Crear planeta principal con texturas realistas
      const geometry = new THREE.SphereGeometry(planet.size, 64, 64);

      // Materiales simples y brillantes para mejor apariencia
      const material = new THREE.MeshPhongMaterial({
        color: planet.color,
        shininess: 100,
        specular: 0xffffff,
      });

      const planetMesh = new THREE.Mesh(geometry, material);
      // No posicionar aquí, se hace en la animación
      planetGroup.add(planetMesh);

      // Crear etiqueta de texto para el nombre del planeta
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;

      context.font = 'Bold 24px Arial';
      context.fillStyle = 'white';
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.strokeText(planet.name, 10, 40);
      context.fillText(planet.name, 10, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(20, 5, 1);
      sprite.position.y = planet.size + 8;
      planetGroup.add(sprite);

      // 💫 Anillos realistas de Saturno
      if (planet.hasRings) {
        const ringGeometry = new THREE.RingGeometry(
          planet.size * 1.8,
          planet.size * 3.2,
          256
        );
        const ringMaterial = new THREE.MeshPhongMaterial({
          color: 0xcccccc,           // Gris hielo realista
          shininess: 100,
          specular: 0xffffff,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2.5;
        planetGroup.add(rings);
      }

      // 🌙 Crear lunas (si tiene)
      const moonMeshes: {
        mesh: THREE.Mesh;
        speed: number;
        distance: number;
        angle: number;
      }[] = [];

      planet.moons.forEach((moon) => {
        const moonGeo = new THREE.SphereGeometry(moon.size, 32, 32);
        const moonMat = new THREE.MeshPhongMaterial({
          color: moon.color || 0x9e9e9e,
          shininess: 50,
          specular: 0xcccccc,
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        // No posicionar aquí, se hace en la animación
        planetGroup.add(moonMesh);

        moonMeshes.push({
          mesh: moonMesh,
          speed: moon.speed || 0.05,
          distance: moon.distance,
          angle: Math.random() * Math.PI * 2,
        });
      });

      // ✨ Órbita dorada del planeta
      const orbitGeometry = new THREE.RingGeometry(
        planet.distance - 0.05,
        planet.distance + 0.05,
        128
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xc99700,            // Dorado tenue
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
      orbitLines.push(orbit);

      // Guardamos referencias en el grupo
      (planetGroup as any).planetMesh = planetMesh;
      (planetGroup as any).moonMeshes = moonMeshes;
      (planetGroup as any).speed = planet.speed;
      (planetGroup as any).angle = Math.random() * Math.PI * 2;

      solarSystemGroup.add(planetGroup);
      planetGroups.push(planetGroup);
    });

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);


      // Rotar sol y su glow
      sun.rotation.y += 0.005;
      sunGlow.rotation.y -= 0.003;

      // Mover planetas
      planetGroups.forEach((group, i) => {
        const planet = planetsData[i];
        const groupData = group as any;
        groupData.angle += groupData.speed;
        group.position.x = Math.cos(groupData.angle) * planet.distance;
        group.position.z = Math.sin(groupData.angle) * planet.distance;
        groupData.planetMesh.rotation.y += 0.01;

        // Mover lunas alrededor del planeta
        groupData.moonMeshes.forEach((moonData: any) => {
          moonData.angle += moonData.speed;
          moonData.mesh.position.x = Math.cos(moonData.angle) * moonData.distance;
          moonData.mesh.position.z = Math.sin(moonData.angle) * moonData.distance;
        });
      });

      // Órbitas siempre visibles
      orbitLines.forEach(orbit => orbit.visible = true);

      // Actualizar controles
      controls.update();

      renderer.render(scene, camera);
    };

    console.log('▶️ Iniciando animación...');
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      controls.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Sprite) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m?.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      renderer.dispose();
      console.log('✅ Sistema Solar limpiado');
    };
  }, []);

  const selectedPlanetData = planetsData.find(p => p.name === selectedPlanet);

  // Multimedia functions
  const narratePlanet = (planet: any) => {
    if (enableNarration) {
      const moonText = planet.moons && planet.moons.length > 0
        ? ` Tiene ${planet.moons.length} luna${planet.moons.length > 1 ? 's' : ''}.`
        : ' No tiene lunas conocidas.';

      const text = `${planet.name}. ${planet.description}${moonText} Su distancia al Sol es de ${planet.distance} unidades astronómicas. Tiene un tamaño de ${planet.size} unidades y una velocidad orbital de ${planet.speed} radianes por segundo.`;
      speakText(text);
    }
  };

  const startQuiz = (planetName: string) => {
    const quiz = planetQuizzes[planetName as keyof typeof planetQuizzes];
    if (quiz) {
      setCurrentQuiz({ questions: quiz, planetName });
      setCurrentQuestionIndex(0);
      setQuizScore(0);
      setShowQuiz(true);
    }
  };

  const answerQuiz = (selectedIndex: number) => {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    if (selectedIndex === currentQuestion.correct) {
      const message = '¡Respuesta correcta! ' + currentQuestion.explanation;
      setQuizScore(prev => prev + 1);
      setQuizResult(message);
    } else {
      const message = 'Respuesta incorrecta. ' + currentQuestion.explanation;
      setQuizResult(message);
    }

    // Si hay más preguntas, pasar a la siguiente
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setQuizResult(null);
      }, 2000);
    } else {
      // Quiz completado
      setTimeout(() => {
        const finalMessage = `Quiz completado. Puntaje: ${quizScore + (selectedIndex === currentQuestion.correct ? 1 : 0)}/${currentQuiz.questions.length}`;
        setQuizResult(finalMessage);
        setTimeout(() => {
          setShowQuiz(false);
          setCurrentQuiz(null);
          setCurrentQuestionIndex(0);
        }, 3000);
      }, 2000);
    }
  };

  // Auto-narrate when planet is selected
  useEffect(() => {
    if (selectedPlanetData && enableNarration) {
      narratePlanet(selectedPlanetData);
    }
  }, [selectedPlanet, enableNarration]);

  return (
    <div className="h-full w-full p-6 bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">🌌 Sistema Solar Interactivo 3D</h1>

      {/* Controles */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex justify-center">
          <button
            onClick={() => setEnableNarration(!enableNarration)}
            className={`px-6 py-3 rounded-lg font-medium transition ${enableNarration ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
          >
            {enableNarration ? '🔊 Narración ON' : '🔊 Narración OFF'}
          </button>
        </div>
      </div>

      {/* Información del planeta seleccionado */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-bold mb-3 text-white">📊 Información del Planeta</h3>
        {selectedPlanetData ? (
          <div>
            <h4 className="text-2xl font-bold mb-2" style={{ color: `#${selectedPlanetData.color.toString(16)}` }}>{selectedPlanetData.name}</h4>
            <p className="text-gray-300 text-sm mb-3">{selectedPlanetData.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4 text-gray-300">
              <div><strong className="text-white">Masa:</strong> {selectedPlanetData.mass}</div>
              <div><strong className="text-white">Diámetro:</strong> {selectedPlanetData.diameter}</div>
              <div><strong className="text-white">Período orbital:</strong> {selectedPlanetData.orbitalPeriod}</div>
              <div><strong className="text-white">Rotación:</strong> {selectedPlanetData.rotationPeriod}</div>
              <div><strong className="text-white">Temperatura:</strong> {selectedPlanetData.temperature.min}°C a {selectedPlanetData.temperature.max}°C</div>
              <div><strong className="text-white">Atmósfera:</strong> {selectedPlanetData.atmosphere}</div>
              <div className="col-span-2"><strong className="text-white">Superficie:</strong> {selectedPlanetData.surface}</div>
              {selectedPlanetData.moons && selectedPlanetData.moons.length > 0 && (
                <div className="col-span-2">
                  <strong className="text-white">Lunas principales:</strong> {selectedPlanetData.moons.map(m => m.name).join(', ')}
                </div>
              )}
            </div>
            <button
              onClick={() => startQuiz(selectedPlanetData.name)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-3"
            >
              🎯 Hacer Quiz sobre {selectedPlanetData.name}
            </button>
            {quizResult && (
              <div className={`p-3 rounded-lg mb-3 ${quizResult.includes('correcta') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                {quizResult}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Haz clic en un planeta para ver su información</p>
        )}
      </div>

      {/* Lista de planetas */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-bold mb-3 text-white">🪐 Planetas del Sistema Solar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {planetsData.map((planet) => (
            <button
              key={planet.name}
              onClick={() => setSelectedPlanet(planet.name)}
              className={`p-3 rounded-lg text-sm transition-all ${
                selectedPlanet === planet.name
                  ? 'bg-gray-700 border-2 border-blue-400 shadow-lg'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full shadow-md"
                  style={{ backgroundColor: `#${planet.color.toString(16)}` }}
                ></div>
                <span className="font-medium text-white">{planet.name}</span>
              </div>
              {planet.moons && (
                <div className="text-xs text-gray-400 mt-1">
                  🌙 {planet.moons.length} luna{planet.moons.length !== 1 ? 's' : ''}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Escena 3D */}
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
        <div ref={mountRef} className="w-full h-96 lg:h-[600px]" />
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        Usa el mouse para rotar la vista, hacer zoom con la rueda, y arrastra para mover la cámara.
      </div>

      {/* Quiz Modal */}
      {showQuiz && currentQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-white">🎯 Quiz: {currentQuiz.planetName}</h3>
            <div className="mb-4 text-sm text-gray-300">
              Pregunta {currentQuestionIndex + 1} de {currentQuiz.questions.length}
            </div>
            <p className="text-gray-300 mb-4 text-base leading-relaxed">
              {currentQuiz.questions[currentQuestionIndex].question}
            </p>
            <div className="space-y-3">
              {currentQuiz.questions[currentQuestionIndex].options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => answerQuiz(index)}
                  className="w-full text-left p-3 rounded-lg border border-gray-600 text-white hover:bg-gray-700 transition text-sm"
                >
                  {option}
                </button>
              ))}
            </div>
            {quizResult && (
              <div className={`mt-4 p-3 rounded-lg ${quizResult.includes('correcta') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                {quizResult}
              </div>
            )}
            <button
              onClick={() => {
                setShowQuiz(false);
                setCurrentQuiz(null);
                setCurrentQuestionIndex(0);
                setQuizScore(0);
                setQuizResult(null);
              }}
              className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Cerrar Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
