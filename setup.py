import os

# 定义所有文件的路径和内容
files = {
    "metadata.json": """{
  "name": "Luxury Christmas Tree 3D",
  "description": "A cinematic, high-fidelity 3D interactive experience featuring a particle-based Christmas tree with smooth state transitions and a floating photo gallery.",
  "requestFramePermissions": []
}""",

    "index.html": """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Luxury Christmas Tree</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        background-color: #000502; /* Very dark emerald/black */
        overflow: hidden;
        font-family: 'Playfair Display', serif;
      }
      
      canvas {
        touch-action: none;
      }

      /* Custom Scrollbar hide */
      ::-webkit-scrollbar {
        width: 0px;
        background: transparent;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "@react-three/fiber": "https://aistudiocdn.com/@react-three/fiber@^9.4.2",
    "three": "https://aistudiocdn.com/three@^0.181.2",
    "@react-three/drei": "https://aistudiocdn.com/@react-three/drei@^10.7.7",
    "@react-three/postprocessing": "https://aistudiocdn.com/@react-three/postprocessing@^3.0.4"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
  </body>
</html>""",

    "types.ts": """export enum AppState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface PositionData {
  scatter: [number, number, number];
  tree: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}

export interface ParticleSystemProps {
  mode: AppState;
}""",

    "constants.ts": """// Palette
export const COLORS = {
  bg: '#000502',
  emerald: '#044f1e',
  emeraldLight: '#18a84a',
  gold: '#FFD700',
  goldDark: '#B8860B',
  white: '#FFFFFF',
};

// Particle Counts
export const NEEDLE_COUNT = 4000;
export const ORNAMENT_COUNT = 150;

// Geometry Settings
export const TREE_HEIGHT = 14;
export const TREE_RADIUS = 5.5;
export const SCATTER_RADIUS = 25;

// Photo Gallery Images (Unsplash - Winter/Cozy Theme)
export const PHOTO_URLS = [
  "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=400&q=80", // Snowy forest
  "https://images.unsplash.com/photo-1576919228236-a097c32a58be?auto=format&fit=crop&w=400&q=80", // Ornaments
  "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=400&q=80", // Cozy light
  "https://images.unsplash.com/photo-1482517967863-00e15c9b4499?auto=format&fit=crop&w=400&q=80", // Sparkles
  "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=400&q=80", // Tree closeup
  "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=400&q=80", // Red gift
  "https://images.unsplash.com/photo-1607613009820-a29f7bb6dcaf?auto=format&fit=crop&w=400&q=80", // Cookies
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80", // Cocktails
  "https://images.unsplash.com/photo-1575340115383-37ca7d2d3e14?auto=format&fit=crop&w=400&q=80", // Fireplace
  "https://images.unsplash.com/photo-1511268011861-691ed4e095ab?auto=format&fit=crop&w=400&q=80", // Bokeh
  "https://images.unsplash.com/photo-1545625442-835c24d9c759?auto=format&fit=crop&w=400&q=80", // Snowman
  "https://images.unsplash.com/photo-1605634289895-c9f280689b02?auto=format&fit=crop&w=400&q=80", // Gold star
];""",

    "components/Overlay.tsx": """import React from 'react';
import { AppState } from '../types';

interface OverlayProps {
  currentState: AppState;
  onToggle: (state: AppState) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ currentState, onToggle }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end p-8 md:p-12">
      {/* Controls */}
      <div className="flex flex-col items-center gap-6 pointer-events-auto mb-8 w-full">
        <div className="flex gap-8 items-center backdrop-blur-sm bg-black/20 p-1 rounded-full border border-white/10">
            <button
              onClick={() => onToggle(AppState.SCATTERED)}
              className={`transition-all duration-700 ease-out px-8 py-3 rounded-full text-sm tracking-[0.2em] uppercase border ${
                currentState === AppState.SCATTERED
                  ? 'bg-[#B8860B] text-black border-[#FFD700] shadow-[0_0_30px_rgba(184,134,11,0.6)]'
                  : 'bg-transparent text-[#B8860B] border-[#B8860B]/30 hover:border-[#B8860B] hover:text-[#FFD700]'
              }`}
            >
              Chaos
            </button>
            
            <button
              onClick={() => onToggle(AppState.TREE_SHAPE)}
              className={`transition-all duration-700 ease-out px-8 py-3 rounded-full text-sm tracking-[0.2em] uppercase border ${
                currentState === AppState.TREE_SHAPE
                  ? 'bg-[#044f1e] text-white border-[#18a84a] shadow-[0_0_30px_rgba(4,79,30,0.8)]'
                  : 'bg-transparent text-[#18a84a] border-[#18a84a]/30 hover:border-[#18a84a] hover:text-white'
              }`}
            >
              Form
            </button>
        </div>
      </div>
    </div>
  );
};""",

    "components/Particles.tsx": """import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppState, PositionData } from '../types';
import { COLORS, TREE_HEIGHT, TREE_RADIUS, SCATTER_RADIUS } from '../constants';

// Helper to generate random points in a sphere
const randomInSphere = (radius: number): [number, number, number] => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return [
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi),
  ];
};

// Helper to generate points on a cone (tree shape)
const pointOnTree = (index: number, total: number): [number, number, number] => {
  // Use Golden Angle for spiral distribution
  const y = THREE.MathUtils.mapLinear(index, 0, total, -TREE_HEIGHT / 2, TREE_HEIGHT / 2);
  // Radius decreases as Y increases
  const radiusAtHeight = THREE.MathUtils.mapLinear(y, -TREE_HEIGHT / 2, TREE_HEIGHT / 2, TREE_RADIUS, 0);
  
  const angle = index * 2.39996; // Golden angle in radians approx
  const x = Math.cos(angle) * radiusAtHeight;
  const z = Math.sin(angle) * radiusAtHeight;
  
  return [x, y, z];
};

interface InstancedParticlesProps {
  mode: AppState;
  count: number;
  type: 'needle' | 'ornament';
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
}

export const InstancedParticles: React.FC<InstancedParticlesProps> = ({ 
  mode, 
  count, 
  type,
  color,
  emissive = "#000000",
  emissiveIntensity = 0
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Calculate dual positions once
  const particles = useMemo(() => {
    const data: PositionData[] = [];
    for (let i = 0; i < count; i++) {
      // Scatter Position
      const scatter = randomInSphere(SCATTER_RADIUS);
      
      // Tree Position
      // Add some randomness to tree position so it's not a perfect line
      const [tx, ty, tz] = pointOnTree(i, count);
      const jitter = type === 'needle' ? 0.3 : 0.6;
      const tree: [number, number, number] = [
        tx + (Math.random() - 0.5) * jitter,
        ty + (Math.random() - 0.5) * jitter,
        tz + (Math.random() - 0.5) * jitter
      ];

      // Scale
      const baseScale = type === 'needle' ? 0.2 : 0.4;
      const scale = baseScale + Math.random() * baseScale;

      // Rotation
      const rotation: [number, number, number] = [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ];

      data.push({ scatter, tree, scale, rotation });
    }
    return data;
  }, [count, type]);

  // Current animation progress (0 = scattered, 1 = tree)
  const progress = useRef(0);

  useLayoutEffect(() => {
    // Initial placement to avoid flicker
    if (!meshRef.current) return;
    particles.forEach((data, i) => {
        dummy.position.set(...data.scatter);
        dummy.rotation.set(...data.rotation);
        dummy.scale.setScalar(data.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, particles]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smoothly interpolate progress based on mode
    const targetProgress = mode === AppState.TREE_SHAPE ? 1 : 0;
    // Lerp factor (speed)
    const smoothing = 2.5 * delta; 
    progress.current = THREE.MathUtils.lerp(progress.current, targetProgress, smoothing);

    const time = state.clock.getElapsedTime();

    particles.forEach((data, i) => {
      const { scatter, tree, rotation, scale } = data;

      // Interpolate Position
      const x = THREE.MathUtils.lerp(scatter[0], tree[0], progress.current);
      const y = THREE.MathUtils.lerp(scatter[1], tree[1], progress.current);
      const z = THREE.MathUtils.lerp(scatter[2], tree[2], progress.current);

      // Add a gentle floating motion
      const floatIntensity = THREE.MathUtils.lerp(1.5, 0.2, progress.current);
      const floatX = Math.sin(time * 0.5 + i) * floatIntensity * 0.1;
      const floatY = Math.cos(time * 0.3 + i * 0.5) * floatIntensity * 0.1;

      dummy.position.set(x + floatX, y + floatY, z);

      // Rotate particles slightly over time
      dummy.rotation.set(
        rotation[0] + time * 0.1,
        rotation[1] + time * 0.15,
        rotation[2]
      );
      
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Rotate the whole tree group slowly when formed
    if (progress.current > 0.8) {
        meshRef.current.rotation.y += delta * 0.1 * progress.current;
    }
  });

  // Geometries
  const geometry = type === 'needle' 
    ? new THREE.TetrahedronGeometry(1, 0) // Low poly looks like crystal/needle
    : new THREE.IcosahedronGeometry(1, 1); // Rounder for ornaments

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, count]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={type === 'needle' ? 0.6 : 0.1} // Ornaments are shiny
        metalness={type === 'needle' ? 0.1 : 0.9} // Ornaments are metallic
        transparent={type === 'needle'}
        opacity={type === 'needle' ? 0.9 : 1}
      />
    </instancedMesh>
  );
};""",

    "components/PhotoGallery.tsx": """import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { AppState } from '../types';
import { PHOTO_URLS, SCATTER_RADIUS, TREE_HEIGHT, TREE_RADIUS } from '../constants';

interface PhotoProps {
  url: string;
  index: number;
  total: number;
  appState: AppState;
}

const Photo: React.FC<PhotoProps> = ({ url, index, total, appState }) => {
  const texture = useLoader(THREE.TextureLoader, url);
  const groupRef = useRef<THREE.Group>(null);

  // Pre-calculate positions
  const { scatterPos, scatterRot, treePos, treeRot } = useMemo(() => {
    // 1. Scattered Position
    const r = SCATTER_RADIUS * 0.8;
    const sx = (Math.random() - 0.5) * r * 2;
    const sy = (Math.random() - 0.5) * r * 2;
    const sz = (Math.random() - 0.5) * r * 2;
    const scatterPos = new THREE.Vector3(sx, sy, sz);
    
    const scatterRot = new THREE.Euler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    // 2. Tree Position
    // Distribute spirally on the cone surface
    const yRatio = index / total;
    const y = THREE.MathUtils.mapLinear(yRatio, 0, 1, -TREE_HEIGHT / 2 + 1, TREE_HEIGHT / 2 - 1);
    
    // Cone radius at this height
    const radiusAtHeight = THREE.MathUtils.mapLinear(y, -TREE_HEIGHT / 2, TREE_HEIGHT / 2, TREE_RADIUS + 0.5, 0.5);
    
    const angle = index * 1.5; // Spiral spacing
    const tx = Math.sin(angle) * radiusAtHeight;
    const tz = Math.cos(angle) * radiusAtHeight;
    
    const treePos = new THREE.Vector3(tx, y, tz);
    
    // Calculate rotation to face outward from center
    const lookAtPos = new THREE.Vector3(tx * 2, y, tz * 2); 
    const dummyObj = new THREE.Object3D();
    dummyObj.position.copy(treePos);
    dummyObj.lookAt(lookAtPos);
    // Add slight random tilt for natural look
    dummyObj.rotateZ((Math.random() - 0.5) * 0.2);
    const treeRot = dummyObj.rotation.clone();

    return { scatterPos, scatterRot, treePos, treeRot };
  }, [index, total]);

  // Animation State
  const progress = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const target = appState === AppState.TREE_SHAPE ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, target, delta * 2);

    // Interpolate Position
    groupRef.current.position.lerpVectors(scatterPos, treePos, progress.current);

    // Interpolate Rotation
    const currentRot = new THREE.Euler().setFromVector3(
        new THREE.Vector3(scatterRot.x, scatterRot.y, scatterRot.z).lerp(
            new THREE.Vector3(treeRot.x, treeRot.y, treeRot.z), 
            progress.current
        )
    );
    groupRef.current.rotation.copy(currentRot);

    // Add floating motion
    const time = state.clock.getElapsedTime();
    const floatIntensity = (1 - progress.current) * 0.5 + 0.05; // More float when scattered
    groupRef.current.position.y += Math.sin(time + index) * floatIntensity * 0.02;
  });

  return (
    <group ref={groupRef}>
      {/* Frame (Polaroid border) */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[1.2, 1.5, 0.05]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
      </mesh>

      {/* Photo */}
      <mesh position={[0, 0.1, 0.02]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
};

interface PhotoGalleryProps {
  appState: AppState;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ appState }) => {
  return (
    <group>
      {PHOTO_URLS.map((url, i) => (
        <Photo 
          key={i} 
          url={url} 
          index={i} 
          total={PHOTO_URLS.length} 
          appState={appState} 
        />
      ))}
    </group>
  );
};""",

    "components/Experience.tsx": """import React from 'react';
import { OrbitControls, Sparkles, PerspectiveCamera, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { InstancedParticles } from './Particles';
import { PhotoGallery } from './PhotoGallery';
import { AppState } from '../types';
import { COLORS, NEEDLE_COUNT, ORNAMENT_COUNT } from '../constants';

interface ExperienceProps {
  appState: AppState;
}

export const Experience: React.FC<ExperienceProps> = ({ appState }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={10} 
        maxDistance={50}
        autoRotate={appState === AppState.TREE_SHAPE}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5} 
      />

      {/* Lighting */}
      <ambientLight intensity={0.2} color={COLORS.emerald} />
      <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.gold} />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#ffffff" />
      <spotLight 
        position={[0, 20, 0]} 
        angle={0.5} 
        penumbra={1} 
        intensity={2} 
        color={COLORS.gold} 
        castShadow 
      />
      <spotLight position={[0, -10, 5]} intensity={1.5} color={COLORS.emeraldLight} />

      {/* Environment */}
      <Environment preset="city" blur={0.8} />

      {/* Scene Content */}
      <group>
        {/* Emerald Needles */}
        <InstancedParticles 
          mode={appState} 
          count={NEEDLE_COUNT} 
          type="needle" 
          color={COLORS.emeraldLight} 
        />
        
        {/* Gold Ornaments */}
        <InstancedParticles 
          mode={appState} 
          count={ORNAMENT_COUNT} 
          type="ornament" 
          color={COLORS.gold} 
          emissive={COLORS.goldDark}
          emissiveIntensity={0.5}
        />

        {/* Polaroid Photo Gallery */}
        <PhotoGallery appState={appState} />
      </group>

      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles 
        count={200} 
        scale={20} 
        size={4} 
        speed={0.4} 
        opacity={0.5} 
        color={COLORS.gold}
      />

      {/* Post Processing */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
};""",

    "App.tsx": """import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { AppState } from './types';
import { COLORS } from './constants';

function Loader() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black pointer-events-none transition-opacity duration-1000">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#B8860B] text-xs tracking-[0.3em] uppercase font-light animate-pulse">
          Loading Assets
        </p>
      </div>
    </div>
  );
}

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SCATTERED);

  return (
    <div className="relative w-full h-screen bg-black">
      <Overlay 
        currentState={appState} 
        onToggle={setAppState} 
      />
      
      <Canvas
        dpr={[1, 2]} // Quality scaling
        shadows
        gl={{ 
          antialias: false,
          toneMapping: 3, // THREE.ReinhardToneMapping
          toneMappingExposure: 1.5 
        }} 
      >
        <color attach="background" args={[COLORS.bg]} />
        <fog attach="fog" args={[COLORS.bg, 10, 50]} />
        
        <Suspense fallback={null}>
          <Experience appState={appState} />
        </Suspense>
      </Canvas>
      
      <Suspense fallback={<Loader />}>
         {/* Suspense trigger */}
      </Suspense>
    </div>
  );
}

export default App;""",

    "index.tsx": """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);"""
}

# 创建文件夹
os.makedirs("components", exist_ok=True)

# 写入文件
print("正在创建项目文件...")
for filepath, content in files.items():
    try:
        # 使用 utf-8 编码写入，防止乱码
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ 已创建: {filepath}")
    except Exception as e:
        print(f"❌ 创建失败 {filepath}: {e}")

print("\n所有文件已生成完毕！请在 Cursor 中查看文件。")