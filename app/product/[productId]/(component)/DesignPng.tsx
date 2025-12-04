"use client";

import React, { useRef, useState, useEffect, forwardRef } from "react";
import Image from "next/image";
import { Rnd } from "react-rnd";

interface DesignPngProps {
  mockupUrl: string;
  designTextureUrl: string | null;
  onRemoveDesign: () => void;
}

const DesignPng = forwardRef<HTMLDivElement, DesignPngProps>(({
  mockupUrl,
  designTextureUrl,
  onRemoveDesign,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [rndState, setRndState] = useState({
    x: 0,
    y: 0,
    width: 180,  // Slightly smaller initial size for better fit
    height: 270,
  });

  const handleReset = () => {
    setRndState({ x: 0, y: 0, width: 180, height: 270 });
  };

  // Reset on new design load
  useEffect(() => {
    if (designTextureUrl) {
      handleReset();
    }
  }, [designTextureUrl]);

  // ESC key to remove design
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && designTextureUrl) {
        onRemoveDesign();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [designTextureUrl, onRemoveDesign]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#e8ecf0] relative overflow-hidden select-none">
      <div
        ref={containerRef}
        className="relative w-[240px] h-[480px] shadow-2xl rounded-[3rem]"
      >
        {/* LAYER 1: PRINTABLE AREA MASK (html2canvas captures this) */}
        <div 
          ref={ref} 
          className="absolute inset-[14px] rounded-[2.2rem] overflow-hidden bg-white z-10"
        >
          {designTextureUrl ? (
            <Rnd
              size={{ width: rndState.width, height: rndState.height }}
              position={{ x: rndState.x, y: rndState.y }}
              onDragStop={(e, d) => setRndState((prev) => ({ ...prev, x: d.x, y: d.y }))}
              onResizeStop={(e, direction, refToResize, delta, position) => {
                setRndState({
                  width: Math.max(50, parseInt(refToResize.style.width || '0')),  // Min size
                  height: Math.max(50, parseInt(refToResize.style.height || '0')),
                  ...position,
                });
              }}
              lockAspectRatio={true}  // Keeps image proportions
              bounds="parent"
              minWidth={50}
              minHeight={50}
              resizeHandleStyles={{
                bottom: { 
                  width: '20px', 
                  height: '20px', 
                  background: '#3b82f6', 
                  right: '-10px',
                  bottom: '-10px',
                  borderRadius: '50%',
                  cursor: 'se-resize'
                },
                bottomRight: { 
                  width: '20px', 
                  height: '20px', 
                  background: '#3b82f6', 
                  right: '-10px',
                  bottom: '-10px',
                  borderRadius: '50%',
                  cursor: 'se-resize'
                },
                bottomLeft: { 
                  width: '20px', 
                  height: '20px', 
                  background: '#3b82f6', 
                  left: '-10px',
                  bottom: '-10px',
                  borderRadius: '50%',
                  cursor: 'sw-resize'
                },
                topRight: { 
                  width: '20px', 
                  height: '20px', 
                  background: '#3b82f6', 
                  right: '-10px',
                  top: '-10px',
                  borderRadius: '50%',
                  cursor: 'ne-resize'
                },
                topLeft: { 
                  width: '20px', 
                  height: '20px', 
                  background: '#3b82f6', 
                  left: '-10px',
                  top: '-10px',
                  borderRadius: '50%',
                  cursor: 'nw-resize'
                }
              }}
              resizeHandleComponent={{
                bottom: <div className="w-5 h-5 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2" />,
                bottomRight: <div className="w-5 h-5 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2" />,
                bottomLeft: <div className="w-5 h-5 bg-blue-500 rounded-full translate-x-1/2 -translate-y-1/2" />,
                topRight: <div className="w-5 h-5 bg-blue-500 rounded-full -translate-x-1/2 translate-y-1/2" />,
                topLeft: <div className="w-5 h-5 bg-blue-500 rounded-full translate-x-1/2 translate-y-1/2" />,
              }}
              className="border-2 border-blue-500/50 bg-blue-500/10 hover:border-blue-500 transition-all duration-200"
              style={{ cursor: 'move' }}
            >
              {/* Use Next.js Image for better quality + loading */}
              <Image
                src={designTextureUrl}
                alt="Design"
                fill
                className="object-cover pointer-events-none select-none rounded-lg"
                draggable={false}
                crossOrigin="anonymous"
                priority  // Ensures high priority loading
                quality={100}  // Maximum quality
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Rnd>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
              Preview Area
              <br />
              <span className="text-xs text-gray-500 mt-1">(Drag to upload design)</span>
            </div>
          )}
        </div>

        {/* LAYER 2: FRAME (Overlay) - NOT captured by html2canvas */}
        <div className="absolute inset-0 z-20 pointer-events-none select-none">
          <Image
            src={mockupUrl}
            alt="Phone Case"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* ESC TO REMOVE hint */}
        {designTextureUrl && (
          <div className="absolute top-3 right-3 z-30 text-xs text-gray-500 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
            ESC to remove
          </div>
        )}
      </div>
    </div>
  );
});

DesignPng.displayName = "DesignPng";

export default DesignPng;
