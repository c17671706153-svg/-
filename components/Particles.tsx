import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import * as THREE from 'three';
import { AppState, PositionData } from '../types';
import { COLORS, TREE_HEIGHT, TREE_RADIUS, SCATTER_RADIUS } from '../constants';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

// Helper to create colored geometries
const colorGeometry = (geo: THREE.BufferGeometry, color: THREE.Color) => {
  const count = geo.attributes.position.count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
};

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
  type: 'needle' | 'ornament' | 'stocking' | 'candy' | 'gift';
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
  // For ornaments: Bell Body + Clapper
  const bellRef = useRef<THREE.InstancedMesh>(null);
  const clapperRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Calculate dual positions once
  const particles = useMemo(() => {
    const data: PositionData[] = [];
    for (let i = 0; i < count; i++) {
      // Scatter Position
      const scatter = randomInSphere(SCATTER_RADIUS);

      // Tree Position
      const [tx, ty, tz] = pointOnTree(i, count);

      const isDecoration = ['stocking', 'candy', 'gift'].includes(type);
      const jitter = type === 'needle' ? 0.3 : (isDecoration ? 0.8 : 0.6); // Decor slightly looser

      const tree: [number, number, number] = [
        tx + (Math.random() - 0.5) * jitter,
        ty + (Math.random() - 0.5) * jitter,
        tz + (Math.random() - 0.5) * jitter
      ];

      // Scale
      const baseScale = type === 'needle' ? 0.2 : (isDecoration ? 1.0 : 0.5); // Decor larger
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
    if (type === 'needle' || ['stocking', 'candy', 'gift'].includes(type)) {
      if (!meshRef.current) return;
      particles.forEach((data, i) => {
        dummy.position.set(...data.scatter);
        dummy.rotation.set(...data.rotation);
        dummy.scale.setScalar(data.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    } else {
      // Ornaments: Bell + Clapper
      if (!bellRef.current || !clapperRef.current) return;
      particles.forEach((data, i) => {
        dummy.position.set(...data.scatter);
        dummy.rotation.set(...data.rotation);
        dummy.scale.setScalar(data.scale);
        dummy.updateMatrix();
        bellRef.current!.setMatrixAt(i, dummy.matrix);
        clapperRef.current!.setMatrixAt(i, dummy.matrix);
      });
      bellRef.current.instanceMatrix.needsUpdate = true;
      clapperRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [dummy, particles, type]);

  useFrame((state, delta) => {
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

      const isDecoration = ['stocking', 'candy', 'gift'].includes(type);

      if ((type === 'needle' || isDecoration) && meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      } else if (type === 'ornament' && bellRef.current && clapperRef.current) {
        bellRef.current.setMatrixAt(i, dummy.matrix);
        clapperRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    if ((type === 'needle' || ['stocking', 'candy', 'gift'].includes(type)) && meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    } else if (type === 'ornament' && bellRef.current && clapperRef.current) {
      bellRef.current.instanceMatrix.needsUpdate = true;
      clapperRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Geometries
  const needleGeo = useMemo(() => new THREE.TetrahedronGeometry(1, 0), []);
  // ---------------------------------------------------------
  // Procedural Geometries
  // ---------------------------------------------------------

  // 1. Gift Box (Red Box + Gold Ribbons)
  const giftGeo = useMemo(() => {
    const baseSize = 0.8;
    const box = new THREE.BoxGeometry(baseSize, baseSize, baseSize);
    colorGeometry(box, new THREE.Color('#D62828')); // Red

    const ribbonWidth = 0.2;
    const ribbonScale = 1.05;

    // Ribbon 1
    const r1 = new THREE.BoxGeometry(baseSize * ribbonScale, baseSize * ribbonScale, ribbonWidth);
    colorGeometry(r1, new THREE.Color('#FFD700')); // Gold

    // Ribbon 2
    const r2 = new THREE.BoxGeometry(ribbonWidth, baseSize * ribbonScale, baseSize * ribbonScale);
    colorGeometry(r2, new THREE.Color('#FFD700')); // Gold

    const merged = mergeGeometries([box, r1, r2]);
    merged.computeVertexNormals();
    return merged;
  }, []);

  // 2. Candy Cane (Red/White Striped Tube)
  const candyGeo = useMemo(() => {
    // Create a J-shape curve
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(0.1, 0.4, 0),
      new THREE.Vector3(0.3, 0.35, 0)
    ]);
    const tube = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);

    // Color stripes
    const count = tube.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const uvs = tube.attributes.uv;
    const red = new THREE.Color('#D62828');
    const white = new THREE.Color('#FFFFFF');

    for (let i = 0; i < count; i++) {
      const u = uvs.getX(i); // 0 to 1 along tube
      // Stripe frequency
      const isRed = Math.sin(u * 20) > 0;
      const c = isRed ? red : white;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    tube.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    tube.center();
    return tube;
  }, []);

  // 3. Stocking (Red Boot + White Cuff)
  const stockingGeo = useMemo(() => {
    const geometries = [];
    const red = new THREE.Color('#D62828');
    const white = new THREE.Color('#FFFFFF');

    // Leg (Cylinder)
    const leg = new THREE.CylinderGeometry(0.15, 0.12, 0.5, 16);
    leg.translate(0, 0.2, 0);
    colorGeometry(leg, red);
    geometries.push(leg);

    // Foot (Cylinder rotated)
    const foot = new THREE.CylinderGeometry(0.13, 0.12, 0.4, 16);
    foot.rotateZ(Math.PI / 2); // Horizontal
    foot.translate(0.15, -0.05, 0);
    // foot.rotateZ(-Math.PI / 6); // Slight angle
    colorGeometry(foot, red);
    geometries.push(foot);

    // Heel (Sphere for joint)
    const heel = new THREE.SphereGeometry(0.14, 16, 16);
    heel.translate(0, -0.05, 0);
    colorGeometry(heel, red);
    geometries.push(heel);

    // Toe (Sphere)
    const toe = new THREE.SphereGeometry(0.13, 16, 16);
    toe.translate(0.35, -0.05, 0);
    colorGeometry(toe, red);
    geometries.push(toe);

    // Cuff (White Torus/Cylinder)
    const cuff = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16);
    cuff.translate(0, 0.45, 0);
    colorGeometry(cuff, white);
    geometries.push(cuff);

    const merged = mergeGeometries(geometries);
    merged.computeVertexNormals();
    merged.center();
    return merged;
  }, []);

  // Bell: Lathe Geometry for a nice curve with hollow interior
  const bellGeo = useMemo(() => {
    const points = [];
    // Outer wall (Top to Bottom)
    points.push(new THREE.Vector2(0, 0.4));      // Top Center
    points.push(new THREE.Vector2(0.15, 0.35));  // Shoulder
    points.push(new THREE.Vector2(0.25, 0.1));   // Waist
    points.push(new THREE.Vector2(0.35, -0.2));  // Flaring
    points.push(new THREE.Vector2(0.5, -0.4));   // Outer Rim

    // Rim bottom
    points.push(new THREE.Vector2(0.45, -0.4));  // Thickness edge

    // Inner wall (Bottom to Top) - adhering to the outer shape
    points.push(new THREE.Vector2(0.30, -0.2));
    points.push(new THREE.Vector2(0.20, 0.1));
    points.push(new THREE.Vector2(0.10, 0.35));
    points.push(new THREE.Vector2(0, 0.35));     // Close at inner top

    const geo = new THREE.LatheGeometry(points, 32); // Smoother
    return geo;
  }, []);

  // Clapper: Small sphere at the bottom
  const clapperGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.12, 16, 16);
    geo.translate(0, -0.45, 0);
    return geo;
  }, []);

  if (type === 'needle') {
    return (
      <instancedMesh
        ref={meshRef}
        args={[needleGeo, undefined, count]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.6}
          metalness={0.1}
          transparent={true}
          opacity={0.9}
        />
      </instancedMesh>
    );
  }

  // Render Decorations
  if (['stocking', 'candy', 'gift'].includes(type)) {
    let geo;
    if (type === 'stocking') geo = stockingGeo;
    if (type === 'candy') geo = candyGeo;
    if (type === 'gift') geo = giftGeo;

    return (
      <instancedMesh
        ref={meshRef}
        args={[geo, undefined, count]}
        castShadow={true}
        receiveShadow={true}
      >
        <meshStandardMaterial
          vertexColors={true} // IMPORTANT: Enable vertex colors
          roughness={0.4}
          metalness={0.1}
        />
      </instancedMesh>
    );
  }

  // Render Ornaments (Bell + Clapper)
  return (
    <group>
      {/* Bell Body - Shiny Gold */}
      <instancedMesh
        ref={bellRef}
        args={[bellGeo, undefined, count]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={"#FDB931"} // Richer Gold
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.15}
          metalness={1.0}
          envMapIntensity={1}
        />
      </instancedMesh>

      {/* Clapper - Gold */}
      <instancedMesh
        ref={clapperRef}
        args={[clapperGeo, undefined, count]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={"#B8860B"} // Darker Gold
          roughness={0.2}
          metalness={1.0}
        />
      </instancedMesh>
    </group>
  );
};
