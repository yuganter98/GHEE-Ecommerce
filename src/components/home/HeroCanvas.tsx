'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'framer-motion';

interface HeroCanvasProps {
    folderPath: string;
    frameCount: number;
    fileNamePrefix: string;
    startIndex: number;
    width?: number; // Logical width (aspect ratio reference)
    height?: number; // Logical height
    className?: string;
    frameIndex?: number;
    frameStep?: number;
}

export function HeroCanvas({
    folderPath,
    frameCount,
    fileNamePrefix,
    startIndex,
    width = 1920,
    height = 1080,
    className,
    frameIndex,
    frameStep = 1
}: HeroCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.1 });

    // State for Image Assets
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    // Refs for Animation Loop (Decoupled from React State)
    const renderLoopId = useRef<number>(null);
    const currentIndex = useRef<number>(0); // Float for smooth interpolation
    const targetIndex = useRef<number>(0);   // Integer from props
    const lastDrawnIndex = useRef<number>(-1); // To avoid redundant draws

    // 1. Sync Prop to Ref
    useEffect(() => {
        if (frameIndex !== undefined) {
            targetIndex.current = Math.max(0, Math.min(frameIndex, frameCount - 1));
        }
    }, [frameIndex, frameCount]);

    // 2. Load Images
    useEffect(() => {
        let isMounted = true;
        const imgs: HTMLImageElement[] = [];
        let loadedCount = 0;

        const loadImages = async () => {
            const promises: Promise<HTMLImageElement>[] = [];

            for (let i = 0; i < frameCount; i++) {
                const currentFrameIndex = startIndex + (i * frameStep);
                const paddedIndex = currentFrameIndex.toString().padStart(3, '0');
                const src = `${folderPath}/${fileNamePrefix}${paddedIndex}.jpg`;

                const p = new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        loadedCount++;
                        if (isMounted) setProgress(Math.round((loadedCount / frameCount) * 100));
                        resolve(img);
                    };
                    img.onerror = () => resolve(img); // Resolve anyway to keep index alignment
                    img.src = src; // Start loading
                });
                promises.push(p);
            }

            try {
                const loadedImgs = await Promise.all(promises);
                if (isMounted) {
                    setImages(loadedImgs);
                    setIsLoaded(true);
                }
            } catch (e) {
                console.error("Failed to load hero visuals", e);
            }
        };

        loadImages();
        return () => { isMounted = false; };
    }, [folderPath, frameCount, fileNamePrefix, startIndex, frameStep]);

    // 3. Render Loop (Auto-Play)
    useEffect(() => {
        if (!isLoaded || images.length === 0) return;

        let lastTime = performance.now();
        const fps = 30; // Target FPS
        const interval = 1000 / fps;
        let accumulator = 0;

        const render = (time: number) => {
            if (!canvasRef.current || !isInView) {
                renderLoopId.current = requestAnimationFrame(render);
                return;
            }

            const deltaTime = time - lastTime;
            lastTime = time;

            // Fix for "catch-up" effect when switching tabs:
            // If delta is too large (e.g. > 100ms), clamp it to the interval
            // so we don't try to play 1000 frames in 1 second.
            if (deltaTime > 100) {
                accumulator += interval;
            } else {
                accumulator += deltaTime;
            }

            // Update frame if enough time has passed
            if (accumulator >= interval) {
                // Advance frame
                let nextFrame = currentIndex.current + 1;
                if (nextFrame >= frameCount) nextFrame = 0; // Loop
                currentIndex.current = nextFrame;
                accumulator -= interval;
            }

            const frameToDraw = Math.floor(currentIndex.current);

            // Only draw if changed
            if (frameToDraw !== lastDrawnIndex.current) {
                const img = images[frameToDraw];
                if (img) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d', { alpha: false });

                    if (ctx) {
                        // Match Canvas size to Image Native Size (HiDPI friendly)
                        if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                        }

                        // Enforce High Quality Settings CRITICAL every frame
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';

                        ctx.drawImage(img, 0, 0);
                        lastDrawnIndex.current = frameToDraw;
                    }
                }
            }

            renderLoopId.current = requestAnimationFrame(render);
        };

        // Start Loop
        renderLoopId.current = requestAnimationFrame(render);

        return () => {
            if (renderLoopId.current) cancelAnimationFrame(renderLoopId.current);
        };
    }, [isLoaded, isInView, images, frameCount]);

    return (
        <div ref={containerRef} className={`relative w-full h-full overflow-hidden bg-ghee-900 ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-ghee-200">
                    <span className="font-mono text-xs">Loading Visuals {progress}%</span>
                </div>
            )}

            {/* Canvas strictly for rendering. Layout handled by CSS object-fit. */}
            <canvas
                ref={canvasRef}
                className={`w-full h-full object-cover block transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ willChange: 'contents' }} // Hint for compositor
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
        </div>
    );
}
