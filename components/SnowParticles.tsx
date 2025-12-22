import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppState } from '../types';
import { TREE_HEIGHT, TREE_RADIUS, SCATTER_RADIUS } from '../constants';

const pointOnTree = (index: number, total: number): [number, number, number] => {
    const y = THREE.MathUtils.mapLinear(index, 0, total, -TREE_HEIGHT / 2, TREE_HEIGHT / 2);
    const radiusAtHeight = THREE.MathUtils.mapLinear(y, -TREE_HEIGHT / 2, TREE_HEIGHT / 2, TREE_RADIUS, 0);
    const angle = index * 2.39996;
    const x = Math.cos(angle) * radiusAtHeight;
    const z = Math.sin(angle) * radiusAtHeight;
    return [x, y, z];
};

interface SnowParticlesProps {
    mode: AppState;
    count: number;
}

export const SnowParticles: React.FC<SnowParticlesProps> = ({ mode, count }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const colorWhite = useMemo(() => new THREE.Color('#ffffff'), []);
    const colorBlue = useMemo(() => new THREE.Color('#a5d8ff'), []); // Icy Blue
    const colorGold = useMemo(() => new THREE.Color('#FFD700'), []); // Warm Gold
    const colorRed = useMemo(() => new THREE.Color('#FF4500'), []); // Orange Red

    // Particle State
    const particles = useMemo(() => {
        const data = [];
        for (let i = 0; i < count; i++) {
            // Target tree position
            const [tx, ty, tz] = pointOnTree(i, count);
            const jitter = 1.0;
            const treePos = new THREE.Vector3(
                tx + (Math.random() - 0.5) * jitter,
                ty + (Math.random() - 0.5) * jitter,
                tz + (Math.random() - 0.5) * jitter
            );

            // Spiral parameters
            const radius = SCATTER_RADIUS * (0.3 + Math.random() * 0.7);
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * SCATTER_RADIUS * 1.5;
            const speed = 0.2 + Math.random() * 0.5;
            const verticalSpeed = (Math.random() - 0.5) * 0.5;

            const currentPos = new THREE.Vector3(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );

            // Visuals - Point varying sizes
            // "Bokeh" effect: some large and faint, some small and bright
            const isBigBokeh = Math.random() > 0.8;
            const scale = isBigBokeh
                ? (0.03 + Math.random() * 0.03) // Large
                : (0.005 + Math.random() * 0.01); // Small sharp dot

            // Color mix
            const rand = Math.random();
            let color;
            if (rand > 0.75) color = colorWhite;     // 25% White
            else if (rand > 0.5) color = colorBlue;  // 25% Blue
            else if (rand > 0.25) color = colorGold; // 25% Gold
            else color = colorRed;                   // 25% Red

            data.push({
                treePos,
                currentPos,
                angle,
                radius,
                height,
                speed,
                verticalSpeed,
                scale,
                color,
                rotation: Math.random() * Math.PI,
            });
        }
        return data;
    }, [count, colorWhite, colorBlue, colorGold, colorRed]);

    useLayoutEffect(() => {
        if (!meshRef.current) return;
        particles.forEach((p, i) => {
            dummy.position.copy(p.currentPos);
            dummy.scale.setScalar(p.scale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
            meshRef.current!.setColorAt(i, p.color);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [dummy, particles, colorRed, colorGold, colorBlue, colorWhite]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        const time = state.clock.elapsedTime;
        const isTree = mode === AppState.TREE_SHAPE;

        particles.forEach((p, i) => {
            if (isTree) {
                p.currentPos.lerp(p.treePos, delta * 2.5);
            } else {
                p.angle += p.speed * delta * 0.5;
                p.height += p.verticalSpeed * delta;

                // Spiral breathing
                const r = p.radius + Math.sin(time + p.angle) * 1.0;

                p.currentPos.x = Math.cos(p.angle) * r;
                p.currentPos.z = Math.sin(p.angle) * r;
                p.currentPos.y = p.height;

                const boundary = SCATTER_RADIUS * 0.8;
                if (p.height > boundary) p.height -= boundary * 2;
                if (p.height < -boundary) p.height += boundary * 2;
            }

            dummy.position.copy(p.currentPos);

            // Pulse scale slightly for twinkling effect
            const pulse = 1 + Math.sin(time * 5 + i) * 0.2;
            dummy.scale.setScalar(p.scale * pulse);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    // Use a Sphere for the light point (better 3D volume) or Circle for billboard
    // Sphere is good for "glowing orb" look
    const geo = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);

    return (
        <instancedMesh
            ref={meshRef}
            args={[geo, undefined, count]}
            castShadow={false}
            receiveShadow={false}
        >
            <meshStandardMaterial
                color="#ffffff" // Base, instance color overrides
                transparent={true}
                opacity={0.8}
                roughness={1.0} // No specular, just emission
                metalness={0.0}
                emissive="#ffffff"
                emissiveIntensity={2.0} // High glow
                toneMapped={false} // Allow super bright colors
            />
        </instancedMesh>
    );
};
