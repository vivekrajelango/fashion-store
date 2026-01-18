'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImagePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    altText: string;
}

export function ImagePreviewModal({ isOpen, onClose, imageUrl, altText }: ImagePreviewModalProps) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleZoomIn = () => setScale(s => Math.min(s + 0.5, 4));
    const handleZoomOut = () => {
        setScale(s => {
            const newScale = Math.max(s - 0.5, 1);
            if (newScale === 1) setPosition({ x: 0, y: 0 }); // Reset position on full zoom out
            return newScale;
        });
    };

    const onMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            e.preventDefault();
            setPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y
            });
        }
    };

    const onMouseUp = () => setIsDragging(false);

    // Touch Support
    const onTouchStart = (e: React.TouchEvent) => {
        if (scale > 1 && e.touches.length === 1) {
            setIsDragging(true);
            const touch = e.touches[0];
            setStartPos({ x: touch.clientX - position.x, y: touch.clientY - position.y });
        }
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (isDragging && scale > 1 && e.touches.length === 1) {
            // e.preventDefault(); // Note: Often better not to preventDefault on touchmove globally unless passive: false is set, but React handles this. 
            // However, to prevent scrolling the background, we rely on the body overflow hidden effect.
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - startPos.x,
                y: touch.clientY - startPos.y
            });
        }
    };

    const onTouchEnd = () => setIsDragging(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Controls */}
            <div className="absolute top-4 right-4 z-[101] flex items-center gap-2">
                <div className="flex bg-gray-800/80 rounded-full p-1 backdrop-blur-md border border-white/10">
                    <button
                        onClick={handleZoomOut}
                        disabled={scale <= 1}
                        className="p-3 text-white hover:bg-white/20 rounded-full disabled:opacity-30 transition-all"
                        title="Zoom Out"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    </button>
                    <span className="flex items-center justify-center w-12 text-sm font-mono font-bold text-white">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        disabled={scale >= 4}
                        className="p-3 text-white hover:bg-white/20 rounded-full disabled:opacity-30 transition-all"
                        title="Zoom In"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            {/* Image Container */}
            <div
                ref={containerRef}
                className={`relative w-full h-full flex items-center justify-center overflow-hidden cursor-${scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'}`}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}

                // Touch Handlers
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}

                onClick={(e) => {
                    // Close if clicking background (but not when dragging)
                    if (scale === 1 && e.target === containerRef.current) onClose();
                }}
                onWheel={(e) => {
                    // Optional: Wheel zoom
                    if (e.ctrlKey) {
                        e.preventDefault();
                        if (e.deltaY < 0) handleZoomIn();
                        else handleZoomOut();
                    }
                }}
            >
                <div
                    style={{
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    }}
                    className="relative max-w-[90vw] max-h-[90vh]"
                >
                    {/* Using standard img tag here for simpler full-size handling without next/image layout constraints in modal */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={altText}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl select-none pointer-events-none" // pointer-events-none ensures drag events bubble to container
                        draggable={false}
                    />
                </div>
            </div>

            {/* Help Text */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs px-4 py-2 bg-black/20 backdrop-blur rounded-full pointer-events-none">
                {scale === 1 ? 'Click Zoom controls to Magnify' : 'Drag to Pan • use Controls to Zoom'}
            </div>
        </div>
    );
}
