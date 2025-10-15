"use client";
import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import {
  PhotoIcon,
  ChatBubbleBottomCenterTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// --- Constants ---
const FONT_FAMILIES = [
  'Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS',
  'Times New Roman', 'Georgia', 'Garamond',
  'Courier New', 'Brush Script MT', 'Impact', 'Comic Sans MS'
];
const DEFAULT_FONT = 'Arial';
const DEFAULT_COLOR = '#000000';

// --- Component Props Interface ---
interface DesignCanvasProps {
  onCanvasUpdate: (dataUrl: string) => void;
}

const DesignCanvas = ({ onCanvasUpdate }: DesignCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  // State for text controls
  const [selectedFont, setSelectedFont] = useState(DEFAULT_FONT);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);

  // 1. Initialize the canvas (runs once)
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 420,
      height: 240,
      backgroundColor: "transparent",
    });
    setFabricCanvas(canvas);

    // Cleanup on component unmount
    return () => {
      if (canvas && typeof canvas.dispose === "function") {
        canvas.dispose();
      }
    };
  }, []);

  // 2. Set up event listeners and handle updates
  useEffect(() => {
    if (!fabricCanvas) return;

    const updateTexture = () => {
      onCanvasUpdate(
        fabricCanvas.toDataURL({ format: "png", multiplier: 1 })
      );
    };

    const updateActiveObject = () => {
      const currentActiveObject = fabricCanvas.getActiveObject();
      setActiveObject(currentActiveObject || null);
      
      // Sync UI controls with the selected object's properties
      if (currentActiveObject && currentActiveObject.type === 'i-text') {
        const textObject = currentActiveObject as fabric.IText;
        setSelectedFont(textObject.fontFamily || DEFAULT_FONT);
        setSelectedColor(textObject.fill?.toString() || DEFAULT_COLOR);
      }
    };

    // Attach listeners
    fabricCanvas.on("object:modified", updateTexture);
    fabricCanvas.on("object:added", updateTexture);
    fabricCanvas.on("object:removed", updateTexture);
    fabricCanvas.on("selection:created", updateActiveObject);
    fabricCanvas.on("selection:updated", updateActiveObject);
    fabricCanvas.on("selection:cleared", updateActiveObject);

    updateTexture(); // Send initial texture

    // Cleanup listeners on effect re-run or unmount
    return () => {
      fabricCanvas.off("object:modified", updateTexture);
      fabricCanvas.off("object:added", updateTexture);
      fabricCanvas.off("object:removed", updateTexture);
      fabricCanvas.off("selection:created", updateActiveObject);
      fabricCanvas.off("selection:updated", updateActiveObject);
      fabricCanvas.off("selection:cleared", updateActiveObject);
    };
  }, [fabricCanvas, onCanvasUpdate]);

  // --- HANDLER FUNCTIONS ---

  const handleAddText = () => {
    if (!fabricCanvas) return;
    const text = new fabric.IText("Hello", {
      left: 50,
      top: 50,
      fontSize: 24,
      fill: selectedColor,
      fontFamily: selectedFont,
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.requestRenderAll();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      try {
        const img = await fabric.Image.fromURL(dataUrl, { crossOrigin: "anonymous" });
        img.scaleToWidth(150);
        img.set({ left: 50, top: 50 });
        
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.requestRenderAll();
      } catch (err) {
        console.error("Image load error:", err);
      }
    };
    reader.onerror = () => alert("There was an error reading your file.");

    reader.readAsDataURL(file);
    if (e.target) e.target.value = ""; // Reset file input
  };
  
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = e.target.value;
    setSelectedFont(newFont);
    if (activeObject?.type === 'i-text') {
      const textObject = activeObject as fabric.IText;
      textObject.set('fontFamily', newFont);
      fabricCanvas?.requestRenderAll();
      onCanvasUpdate(fabricCanvas!.toDataURL({ format: "png", multiplier: 1 }));
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    if (activeObject?.type === 'i-text') {
      const textObject = activeObject as fabric.IText;
      textObject.set('fill', newColor);
      fabricCanvas?.requestRenderAll();
      onCanvasUpdate(fabricCanvas!.toDataURL({ format: "png", multiplier: 1 }));
    }
  };

  const handleDeleteSelected = () => {
    if (!fabricCanvas || !activeObject) return;
    fabricCanvas.remove(activeObject);
    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();
  };

  // Helper boolean for conditional rendering
  const isTextSelected = activeObject && activeObject.type === 'i-text';

  return (
    <div className="space-y-4 w-full max-w-[420px] mx-auto">
      {/* Canvas container */}
      <div
        className="w-[420px] h-[240px] border border-gray-300 rounded-md"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #eee 25%, transparent 25%),
            linear-gradient(-45deg, #eee 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #eee 75%),
            linear-gradient(-45deg, transparent 75%, #eee 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 p-2 border rounded-md text-blue-950 hover:bg-gray-100 transition-colors"
        >
          <PhotoIcon className="w-5 h-5 text-blue-950" /> Add Image
        </button>
        <button
          onClick={handleAddText}
          className="flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-100 transition-colors text-blue-950"
        >
          <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-blue-950" /> Add Text
        </button>
      </div>
      
      {/* --- NEW: Text Controls (Conditionally rendered) --- */}
      {isTextSelected && (
        <div className="p-4 text-blue-950 border-t border-b grid grid-cols-1 md:grid-cols-2 gap-4 items-center animate-fade-in">
          {/* Font Family Selector */}
          <div>
            <label htmlFor="font-family" className="block text-sm font-medium text-gray-700">Font Family</label>
            <select
              id="font-family"
              value={selectedFont}
              onChange={handleFontChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {FONT_FAMILIES.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Color Picker */}
          <div>
            <label htmlFor="text-color" className="block text-sm font-medium text-gray-700">Text Color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                id="text-color"
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
              />
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{selectedColor.toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delete button (conditionally rendered as before) */}
      {activeObject && (
        <div className="pt-2">
          <button
            onClick={handleDeleteSelected}
            className="w-full flex items-center justify-center gap-2 p-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <TrashIcon className="w-5 h-5" /> Delete Selected
          </button>
        </div>
      )}
    </div>
  );
};

export default DesignCanvas;