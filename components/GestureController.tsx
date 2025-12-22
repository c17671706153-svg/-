import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import { AppState } from '../types';

interface GestureControllerProps {
    setAppState: (state: AppState) => void;
    onPinch?: () => void;
}

export const GestureController: React.FC<GestureControllerProps> = ({ setAppState, onPinch }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [recognizer, setRecognizer] = useState<GestureRecognizer | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const requestRef = useRef<number>();
    const lastStateRef = useRef<AppState | null>(null);

    // Initialize Gesture Recognizer
    useEffect(() => {
        const init = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO"
                });
                setRecognizer(gestureRecognizer);
                setIsLoaded(true);
                console.log("MediaPipe Gesture Recognizer Loaded");
            } catch (error) {
                console.error("Failed to load gesture recognizer:", error);
            }
        };
        init();
    }, []);

    // Start Webcam
    useEffect(() => {
        if (!isLoaded || !videoRef.current) return;

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.addEventListener('loadeddata', predict);
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
            }
        };

        startWebcam();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isLoaded]);

    const lastPinchTimeRef = useRef<number>(0);

    const predict = () => {
        if (videoRef.current && recognizer) {
            let nowInMs = Date.now();
            const results = recognizer.recognizeForVideo(videoRef.current, nowInMs);

            if (results.gestures.length > 0) {
                const gesture = results.gestures[0][0];
                if (gesture.score > 0.6) {
                    handleGesture(gesture.categoryName);
                }
            }

            // Pinch Detection (Thumb Tip [4] vs Index Finger Tip [8])
            if (results.landmarks && results.landmarks.length > 0) {
                const landmarks = results.landmarks[0];
                const thumbTip = landmarks[4];
                const indexTip = landmarks[8];

                // Calculate Euclidean distance (using 3D coordinates if available, here approximated with x/y)
                // MediaPipe returns normalized [0,1] coordinates.
                const distance = Math.hypot(
                    thumbTip.x - indexTip.x,
                    thumbTip.y - indexTip.y
                );

                // Threshold for pinch (approximately touching)
                if (distance < 0.05) {
                    const now = Date.now();
                    // Debounce: prevent triggering multiple times too quickly (2 seconds)
                    if (now - lastPinchTimeRef.current > 2000) {
                        console.log("Pinch detected!");
                        if (onPinch) onPinch();
                        lastPinchTimeRef.current = now;
                    }
                }
            }
        }
        requestRef.current = requestAnimationFrame(predict);
    };

    const handleGesture = (categoryName: string) => {
        let newState: AppState | null = null;
        if (categoryName === 'Closed_Fist') {
            newState = AppState.TREE_SHAPE;
        } else if (categoryName === 'Open_Palm') {
            newState = AppState.SCATTERED;
        }

        if (newState !== null && newState !== lastStateRef.current) {
            console.log(`Triggering State Change: ${categoryName} -> ${newState}`);
            setAppState(newState);
            lastStateRef.current = newState;
        }
    };

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            width: '160px',
            height: '120px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.3)',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            pointerEvents: 'none', // Allow clicking through
            transform: 'scaleX(-1)' // Mirror preview
        }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {!isLoaded && <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                transform: 'scaleX(-1)' // Unmirror text
            }}>
                Loading AI...
            </div>}
        </div>
    );
};
