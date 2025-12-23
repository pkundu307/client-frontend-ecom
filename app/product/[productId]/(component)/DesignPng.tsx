"use client";

import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  ForwardedRef,
} from "react";
import Image from "next/image";
import { Rnd } from "react-rnd";

interface DesignPngProps {
  mockupUrl: string;
  designTextureUrl: string | null;
  onRemoveDesign: () => void;
}

const DesignPng = forwardRef<HTMLDivElement, DesignPngProps>(
  ({ mockupUrl, designTextureUrl, onRemoveDesign }, ref: ForwardedRef<HTMLDivElement>) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    const [rndState, setRndState] = useState({
      x: 0,
      y: 0,
      width: 180,
      height: 270,
    });

    // load image once and compute natural aspect ratio
    useEffect(() => {
      if (!designTextureUrl) {
        setAspectRatio(null);
        return;
      }

      const img = new window.Image();
      img.src = designTextureUrl;
      img.onload = () => {
        const ratio = img.width / img.height || 1;
        setAspectRatio(ratio);

        const baseWidth = 180;
        const baseHeight = baseWidth / ratio;

        setRndState({
          x: 0,
          y: 0,
          width: baseWidth,
          height: baseHeight,
        });
      };
    }, [designTextureUrl]);

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#e8ecf0] relative overflow-hidden select-none">
        <div
          ref={containerRef}
          className="relative w-[240px] h-[480px] shadow-2xl rounded-[3rem]"
        >
          {/* LAYER 1: PRINTABLE AREA REGION (no overflow here) */}
          <div
            ref={ref}
            className="absolute inset-[14px] rounded-[2.2rem] bg-white z-10"
          >
            {designTextureUrl && aspectRatio ? (
              <div className="relative w-full h-full">
                <Rnd
                  size={{ width: rndState.width, height: rndState.height }}
                  position={{ x: rndState.x, y: rndState.y }}
                  onDragStop={(e, d) =>
                    setRndState(prev => ({ ...prev, x: d.x, y: d.y }))
                  }
                  onResizeStop={(e, direction, refToResize, delta, position) => {
                    const newWidth = parseFloat(refToResize.style.width || "0");
                    const newHeight = parseFloat(refToResize.style.height || "0");

                    setRndState({
                      width: Math.max(40, newWidth),
                      height: Math.max(40, newHeight),
                      ...position,
                    });
                  }}
                  lockAspectRatio={true}
                  minWidth={40}
                  minHeight={40}
                  className="border-2 border-blue-500/50 bg-blue-500/10 hover:border-blue-500 transition-all duration-200 overflow-visible"
                  style={{ cursor: "move" }}
                  enableResizing={{
                    topLeft: true,
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                    top: false,
                    right: false,
                    bottom: false,
                    left: false,
                  }}
                  resizeHandleComponent={{
                    topLeft: (
                      <div className="w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow" />
                    ),
                    topRight: (
                      <div className="w-4 h-4 bg-blue-500 rounded-full translate-x-1/2 -translate-y-1/2 shadow" />
                    ),
                    bottomLeft: (
                      <div className="w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 translate-y-1/2 shadow" />
                    ),
                    bottomRight: (
                      <div className="w-4 h-4 bg-blue-500 rounded-full translate-x-1/2 translate-y-1/2 shadow" />
                    ),
                  }}
                >
                  {/* This inner wrapper is the ONLY thing that clips */}
                  <div className="w-full h-full overflow-hidden rounded-[2.2rem] bg-white">
                    <Image
                      src={designTextureUrl}
                      alt="Design"
                      fill
                      className="object-contain pointer-events-none select-none"
                      draggable={false}
                      crossOrigin="anonymous"
                      priority
                      quality={100}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </Rnd>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-sm font-medium">
                Preview Area
                <span className="text-xs text-gray-500 mt-1">
                  (Drag to upload design)
                </span>
              </div>
            )}
          </div>

          {/* LAYER 2: FRAME OVERLAY */}
          <div className="absolute inset-0 z-20 pointer-events-none select-none">
            <Image
              src={mockupUrl}
              alt="Phone Case"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Delete Photo button */}
          {designTextureUrl && (
            <button
              type="button"
              onClick={onRemoveDesign}
              className="absolute top-3 right-3 z-30 text-xs font-medium text-white bg-red-500 px-2 py-1 rounded-full shadow active:scale-95"
            >
              Delete photo
            </button>
          )}
        </div>
      </div>
    );
  }
);

DesignPng.displayName = "DesignPng";

export default DesignPng;
