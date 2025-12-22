import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AppState } from '../types';
import { TREE_HEIGHT, TREE_RADIUS } from '../constants';
import { usePhotos } from '../contexts/PhotoContext';

interface PhotoProps {
  photoId: string;
  dataUrl: string;
  index: number;
  total: number;
  appState: AppState;
}

const Photo: React.FC<PhotoProps> = ({ photoId, dataUrl, index, total, appState }) => {
  const { selectPhoto, photos, scatterFlowAt, treeSpotlight, highlightedPhotoId } = usePhotos();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);
  const FLIP_PROBABILITY_SCATTERED = 0.1; // 10% chance to show the back side in scattered mode
  const SCATTER_FLOW_DURATION = 2600;
  const TREE_SPOTLIGHT_DURATION = 3500;

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      dataUrl,
      (loadedTexture) => {
        setTexture(loadedTexture);
        setError(false);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load image:`, err);
        setError(true);
      }
    );

    // Cleanup
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [dataUrl]);
  const groupRef = useRef<THREE.Group>(null);
  const flowSeed = useMemo(
    () => ({
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.8,
    }),
    []
  );

  // Pre-calculate positions and random flip
  const { scatterPos, scatterRot, treePos, treeRot } = useMemo(() => {
    // 1. Scattered Position - Photo wall effect in CHAOS mode
    // Position photos closer to camera and in a more organized grid-like pattern
    const photoWallWidth = 20; // Width of the photo wall
    const photoWallHeight = 15; // Height of the photo wall
    const photoWallDepth = 10; // Depth range for layering

    // Calculate grid-like distribution with some randomness
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);
    const row = Math.floor(index / cols);
    const col = index % cols;

    // Base grid position (handle single row/col case)
    const gridX = cols > 1 ? (col / (cols - 1)) * photoWallWidth - photoWallWidth / 2 : 0;
    const gridY = rows > 1 ? (row / (rows - 1)) * photoWallHeight - photoWallHeight / 2 : 0;

    // Add randomness to break perfect grid
    const randomOffsetX = (Math.random() - 0.5) * 4;
    const randomOffsetY = (Math.random() - 0.5) * 4;
    const randomOffsetZ = (Math.random() - 0.5) * photoWallDepth;

    // Position photos in front (closer to camera, z is smaller)
    const zPos = 5 + randomOffsetZ * 0.5; // Photos are between z=2.5 to z=7.5 (much closer to camera)

    const scatterPos = new THREE.Vector3(
      gridX + randomOffsetX,
      gridY + randomOffsetY,
      zPos
    );

    // Random Flip Logic: 90% front, 10% back when scattered
    const isFlipped = Math.random() < FLIP_PROBABILITY_SCATTERED;

    // Rotation: mostly face camera with slight random tilt
    // Photos should face forward (towards camera) in CHAOS mode
    const tiltX = (Math.random() - 0.5) * 0.3; // Small tilt on X
    const tiltY = (Math.random() - 0.5) * 0.5; // Slight rotation on Y for variety
    const tiltZ = (Math.random() - 0.5) * 0.4; // Small tilt on Z

    // If flipped, rotate 180 degrees around Y axis relative to the tilt
    // We add Math.PI to the Y rotation for the flip
    const finalTiltY = isFlipped ? tiltY + Math.PI : tiltY;

    const scatterRot = new THREE.Euler(tiltX, finalTiltY, tiltZ);

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

    return { scatterPos, scatterRot, treePos, treeRot, isFlipped };
  }, [index, total]);

  // Animation State
  const progress = useRef(0);
  const scaleRef = useRef<THREE.Group>(null);

  // Is this photo currently highlighted?
  const isHighlighted = highlightedPhotoId === photoId;
  const spotlight = treeSpotlight?.photoId === photoId ? treeSpotlight : null;

  useFrame((state, delta) => {
    if (!groupRef.current || !scaleRef.current) return;

    const target = appState === AppState.TREE_SHAPE ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, target, delta * 2);

    const now = Date.now();

    // Add floating motion - more pronounced in CHAOS mode for photo wall effect
    const time = state.clock.getElapsedTime();
    const floatIntensity = (1 - progress.current) * 1.2 + 0.1; // Stronger float when scattered

    // Different floating patterns for each photo
    const floatX = Math.sin(time * 0.3 + index * 0.5) * floatIntensity * 0.15;
    const floatY = Math.cos(time * 0.4 + index * 0.7) * floatIntensity * 0.15;
    const floatZ = Math.sin(time * 0.2 + index * 0.3) * floatIntensity * 0.1;

    // Create floating offset vector
    const floatOffset = new THREE.Vector3(floatX, floatY, floatZ);

    // HIGHLIGHT LOGIC override
    const scatterFlowProgress = scatterFlowAt && appState === AppState.SCATTERED
      ? Math.min((now - scatterFlowAt) / SCATTER_FLOW_DURATION, 1)
      : 0;
    const scatterFlowWave = Math.sin(scatterFlowProgress * Math.PI);
    const scatterFlowOffset = new THREE.Vector3(
      Math.cos(flowSeed.phase + scatterFlowProgress * Math.PI * 4) * scatterFlowWave * 1.2,
      Math.sin(flowSeed.phase + scatterFlowProgress * Math.PI * 3) * scatterFlowWave * 0.8,
      scatterFlowWave * 3.5 + Math.sin(flowSeed.phase + scatterFlowProgress * Math.PI * 2) * scatterFlowWave * 1.5
    );
    let finalScatterPos = scatterPos.clone().add(floatOffset).add(scatterFlowOffset);
    let targetScale = THREE.MathUtils.lerp(1.7, 1.0, progress.current);

    if (isHighlighted && appState === AppState.SCATTERED) {
      // Move to front and center-ish relative to camera, but maintaining some grid context looks better
      // Let's just pull it forward significantly
      finalScatterPos.z += 5; // Move closer
      targetScale = 3.5; // 3x amplification (approx from 1.0 base, or relative to 1.7)
    }

    let treePosWithSpotlight = treePos;
    let treeRotTarget = treeRot;
    if (spotlight && appState === AppState.TREE_SHAPE) {
      const spotlightProgress = Math.min((now - spotlight.startedAt) / TREE_SPOTLIGHT_DURATION, 1);
      const spotlightWave = Math.sin(spotlightProgress * Math.PI);
      const cameraDir = new THREE.Vector3()
        .subVectors(state.camera.position, treePos)
        .normalize();
      treePosWithSpotlight = treePos.clone().add(cameraDir.multiplyScalar(spotlightWave * 6));
      if (spotlight.flip) {
        treeRotTarget = new THREE.Euler(treeRot.x, treeRot.y + Math.PI, treeRot.z);
      }
      targetScale = Math.max(targetScale, 1.0 + spotlightWave * 1.8);
    }

    // Interpolate Position (from floating scatter to tree)
    groupRef.current.position.lerpVectors(finalScatterPos, treePosWithSpotlight, progress.current);

    // Interpolate Rotation with floating tilt
    // Note: scatterRot already includes the flip if isFlipped is true
    const floatRotZ = Math.sin(time * 0.2 + index) * 0.1 * (1 - progress.current);
    const currentRot = new THREE.Euler().setFromVector3(
      new THREE.Vector3(scatterRot.x, scatterRot.y, scatterRot.z + floatRotZ).lerp(
        new THREE.Vector3(treeRotTarget.x, treeRotTarget.y, treeRotTarget.z),
        progress.current
      )
    );
    groupRef.current.rotation.copy(currentRot);

    // Scale
    // Smoothly interpolate scale for highlight effect
    scaleRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
  });

  // Handle click to zoom in
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
      selectPhoto(photo);
    }
  };

  // Don't render if texture failed to load
  if (error || !texture) return null;

  return (
    <group ref={groupRef}>
      <group
        ref={scaleRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
        }}
      >
        {/* Frame (Polaroid border) */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.2, 1.5, 0.05]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
        </mesh>

        {/* Photo */}
        <mesh position={[0, 0.1, 0.026]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={texture} />
        </mesh>

        {/* Note on Back */}
        {photos.find(p => p.id === photoId)?.note && (
          <group position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}>
            <Text
              color="#333333"
              fontSize={0.08}
              maxWidth={1.0}
              lineHeight={1.2}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              position={[0, 0, 0.01]}
            >
              {photos.find(p => p.id === photoId)?.note}
            </Text>
          </group>
        )}
      </group>
    </group>
  );
};

interface PhotoGalleryProps {
  appState: AppState;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ appState }) => {
  const { photos, highlightedPhotoId } = usePhotos();

  // Only render if we have at least 5 photos
  if (photos.length < 5) {
    return null;
  }

  return (
    <group>
      {photos.map((photo, i) => (
        <Photo
          key={photo.id}
          photoId={photo.id}
          dataUrl={photo.dataUrl}
          index={i}
          total={photos.length}
          appState={appState}
        />
      ))}
    </group>
  );
};
