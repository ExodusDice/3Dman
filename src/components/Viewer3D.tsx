'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MaterialOption, ModelGeometryInfo } from '@/types';
import { RotateCw, Eye, Sparkles, Box, Sun, Moon, Maximize2, RefreshCw } from 'lucide-react';

interface Viewer3DProps {
  geometryInfo?: ModelGeometryInfo;
  material?: MaterialOption;
  wireframe?: boolean;
  autoRotate?: boolean;
  className?: string;
  lightingTheme?: 'studio' | 'cyberpunk' | 'warm' | 'dark';
}

export default function Viewer3D({
  geometryInfo = {
    shape: 'cyberpunk_helmet',
    widthCm: 12,
    heightCm: 16,
    depthCm: 11,
    infillPercent: 30,
    triangleCount: 84000,
  },
  material = {
    id: 'sla_ultra_resin',
    name: '8K Ultra-Detail Resin',
    category: 'Resin',
    description: 'Precision resin',
    finish: 'Smooth Matte',
    colorHex: '#38bdf8',
    densityGPerCm3: 1.18,
    pricePerGram: 0.14,
    durability: 4,
    detailLevel: 5,
    textureRoughness: 0.25,
    textureMetalness: 0.1,
  },
  wireframe: initialWireframe = false,
  autoRotate: initialAutoRotate = true,
  className = '',
  lightingTheme: initialTheme = 'studio',
}: Viewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const boundingBoxHelperRef = useRef<THREE.BoxHelper | null>(null);

  const [wireframe, setWireframe] = useState(initialWireframe);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [theme, setTheme] = useState<'studio' | 'cyberpunk' | 'warm' | 'dark'>(initialTheme);
  const [showDimensions, setShowDimensions] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.008);

  // Mouse drag orbit state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc);
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.025);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.5, 7.5);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Ground Grid / Pedestal (Crisp light palette)
    const gridHelper = new THREE.GridHelper(10, 20, 0x818cf8, 0xe2e8f0);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    const platformGeo = new THREE.CylinderGeometry(2.5, 2.7, 0.2, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
      metalness: 0.1,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.6;
    platform.receiveShadow = true;
    scene.add(platform);

    // 5. Lights setup
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;
    updateLighting(lightsGroup, theme);

    // 6. Mesh group setup
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // 7. Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (meshGroupRef.current && autoRotate && !isDraggingRef.current) {
        meshGroupRef.current.rotation.y += rotationSpeed;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // Update lighting when theme changes
  useEffect(() => {
    if (lightsGroupRef.current && sceneRef.current) {
      updateLighting(lightsGroupRef.current, theme);
      const bgColor = theme === 'cyberpunk' ? 0x0f172a : theme === 'dark' ? 0x1e293b : theme === 'warm' ? 0xfef3c7 : 0xf8fafc;
      sceneRef.current.background = new THREE.Color(bgColor);
    }
  }, [theme]);

  // Re-build 3D Model Geometry & Material
  useEffect(() => {
    if (!meshGroupRef.current || !sceneRef.current) return;

    const group = meshGroupRef.current;
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    // Material setup
    const threeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(material.colorHex || '#38bdf8'),
      roughness: material.textureRoughness ?? 0.35,
      metalness: material.textureMetalness ?? 0.15,
      wireframe: wireframe,
    });

    if (material.emissive) {
      threeMaterial.emissive = new THREE.Color(material.emissive);
      threeMaterial.emissiveIntensity = 0.35;
    }

    // Procedural sculpture generation based on shape
    const modelMesh = createProceduralMesh(geometryInfo.shape, threeMaterial);
    modelMesh.castShadow = true;
    modelMesh.receiveShadow = true;
    group.add(modelMesh);

    // Bounding box helper
    if (boundingBoxHelperRef.current && sceneRef.current) {
      sceneRef.current.remove(boundingBoxHelperRef.current);
    }

    if (showDimensions) {
      const boxHelper = new THREE.BoxHelper(group, 0x6366f1);
      sceneRef.current.add(boxHelper);
      boundingBoxHelperRef.current = boxHelper;
    }
  }, [geometryInfo, material, wireframe, showDimensions]);

  // Orbit drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !meshGroupRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    meshGroupRef.current.rotation.y += deltaX * 0.01;
    meshGroupRef.current.rotation.x += deltaY * 0.01;

    meshGroupRef.current.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, meshGroupRef.current.rotation.x));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(3.5, Math.min(15, cameraRef.current.position.z + e.deltaY * 0.005));
  };

  const resetCamera = () => {
    if (!cameraRef.current || !meshGroupRef.current) return;
    cameraRef.current.position.set(0, 2.5, 7.5);
    cameraRef.current.lookAt(0, 0.5, 0);
    meshGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className={`relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex flex-col ${className}`}>
      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full flex-1 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Top Floating Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 text-xs text-slate-800 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-mono font-medium">360° Real-time 3D Engine</span>
        <span className="text-slate-300">•</span>
        <span className="text-violet-600 font-mono font-bold">{(geometryInfo.triangleCount || 64000).toLocaleString()} polys</span>
      </div>

      {/* Bounding Dimensions Ruler Tag */}
      {showDimensions && (
        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-indigo-200 text-[11px] font-mono text-indigo-700 flex items-center gap-1.5 shadow-sm font-semibold">
          <Box className="w-3.5 h-3.5 text-indigo-600" />
          <span>{geometryInfo.widthCm}cm × {geometryInfo.depthCm}cm × {geometryInfo.heightCm}cm (H)</span>
        </div>
      )}

      {/* Bottom Floating Toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-lg px-3 py-2 rounded-2xl border border-slate-200 shadow-lg">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            autoRotate
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="หมุนอัตโนมัติ 360 องศา"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">หมุน 360°</span>
        </button>

        <button
          onClick={() => setWireframe(!wireframe)}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            wireframe
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="ดูโครงสร้างตาข่าย Wireframe"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">โครงตาข่าย</span>
        </button>

        <button
          onClick={() => setShowDimensions(!showDimensions)}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            showDimensions
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="แสดงสเกลขนาดมิติ"
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ขนาดมิติ</span>
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        <button
          onClick={() => {
            const themes: Array<'studio' | 'cyberpunk' | 'warm' | 'dark'> = ['studio', 'cyberpunk', 'warm', 'dark'];
            const next = themes[(themes.indexOf(theme) + 1) % themes.length];
            setTheme(next);
          }}
          className="p-2 rounded-xl text-xs text-amber-600 hover:bg-slate-100 flex items-center gap-1.5 font-medium"
          title={`แสงสตูดิโอ: ${theme}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="capitalize hidden sm:inline">{theme} Light</span>
        </button>

        <button
          onClick={resetCamera}
          className="p-2 rounded-xl text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          title="รีเซ็ตมุมกล้อง"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Lighting setup generator
function updateLighting(group: THREE.Group, theme: 'studio' | 'cyberpunk' | 'warm' | 'dark') {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }

  const ambient = new THREE.AmbientLight(0xffffff, theme === 'dark' ? 0.4 : 1.1);
  group.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0001;
  group.add(keyLight);

  const fillLight = new THREE.DirectionalLight(theme === 'cyberpunk' ? 0x06b6d4 : 0xe0e7ff, 0.7);
  fillLight.position.set(-5, 3, -3);
  group.add(fillLight);

  const rimLight = new THREE.DirectionalLight(theme === 'cyberpunk' ? 0xec4899 : 0xc7d2fe, 0.9);
  rimLight.position.set(0, -2, -5);
  group.add(rimLight);
}

// Procedural Mesh Generator
function createProceduralMesh(shape: string, material: THREE.Material): THREE.Mesh {
  let geometry: THREE.BufferGeometry;

  switch (shape) {
    case 'cyberpunk_helmet': {
      const parent = new THREE.Group();
      const baseGeo = new THREE.DodecahedronGeometry(1.4, 2);
      const pos = baseGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if (y > 0.5) pos.setX(i, pos.getX(i) * 0.85);
        if (y < -0.2) pos.setZ(i, pos.getZ(i) * 1.25);
      }
      baseGeo.computeVertexNormals();
      geometry = baseGeo;
      break;
    }
    case 'roman_bust': {
      const torsoGeo = new THREE.ConeGeometry(1.2, 1.8, 32);
      torsoGeo.scale(1.2, 1.0, 0.8);
      geometry = torsoGeo;
      break;
    }
    case 'dragon_sculpture': {
      geometry = new THREE.TorusKnotGeometry(1.0, 0.35, 128, 32, 2, 3);
      break;
    }
    case 'scifi_mech': {
      geometry = new THREE.OctahedronGeometry(1.3, 3);
      break;
    }
    case 'voronoi_art': {
      geometry = new THREE.IcosahedronGeometry(1.3, 4);
      break;
    }
    case 'anime_cartoon': {
      geometry = new THREE.SphereGeometry(1.2, 32, 32);
      break;
    }
    default: {
      geometry = new THREE.TorusKnotGeometry(1.0, 0.32, 100, 16);
      break;
    }
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 0.2;
  return mesh;
}
