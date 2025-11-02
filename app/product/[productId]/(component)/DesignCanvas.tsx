"use client";
import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import {
  PhotoIcon,
  ChatBubbleBottomCenterTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

declare module "fabric" {
  export interface Object {
    customCornerRadius?: number;
  }
  export interface Image {
    customCornerRadius?: number;
  }
}

interface Category {
  id: string;
  categoryName: string;
  imageUrl: string;
}
interface Subcategory {
  id: string;
  subCategoryName: string;
  imageUrl: string | null;
}
interface PredefinedImage {
  id: string;
  subCategoryId: string;
  url: string;
}
interface DesignCanvasProps {
  onCanvasUpdate: (dataUrl: string) => void;
}

// APIs
const CATEGORIES_API_URL =
  "https://seller-side-backend-fastify-nest.onrender.com/user/predefined-assets/categories";
const SUBCATEGORIES_API_URL = (categoryId: string) =>
  `https://seller-side-backend-fastify-nest.onrender.com/user/predefined-assets/categories/${categoryId}/subcategories`;
const IMAGES_API_URL = (subCategoryId: string) =>
  `https://seller-side-backend-fastify-nest.onrender.com/user/predefined-assets/subcategories/${subCategoryId}/images`;

const FONT_FAMILIES = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Impact",
  "Comic Sans MS",
];

const DEFAULT_FONT = "Arial";
const DEFAULT_COLOR = "#000000";

const DesignCanvas = ({ onCanvasUpdate }: DesignCanvasProps) => {
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [selectedFont, setSelectedFont] = useState(DEFAULT_FONT);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [cornerRadius, setCornerRadius] = useState(0);

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [images, setImages] = useState<PredefinedImage[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === Canvas setup ===
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 420,
      height: 240,
      backgroundColor: "transparent",
    });
    setFabricCanvas(canvas);
    return () => canvas.dispose();
  }, []);

  // === Fabric listeners ===
  useEffect(() => {
    if (!fabricCanvas) return;
    const updateTexture = () =>
      onCanvasUpdate(fabricCanvas.toDataURL({ format: "png", multiplier: 1 }));
    const updateActiveObject = () => {
      const obj = fabricCanvas.getActiveObject();
      setActiveObject(obj || null);
      if (obj?.type === "i-text") {
        setSelectedFont((obj as fabric.IText).fontFamily || DEFAULT_FONT);
        setSelectedColor((obj as fabric.IText).fill?.toString() || DEFAULT_COLOR);
      } else if (obj?.type === "image") {
        setCornerRadius(obj.customCornerRadius || 0);
      }
    };
    fabricCanvas.on("object:modified", updateTexture);
    fabricCanvas.on("object:added", updateTexture);
    fabricCanvas.on("object:removed", updateTexture);
    fabricCanvas.on("selection:created", updateActiveObject);
    fabricCanvas.on("selection:updated", updateActiveObject);
    fabricCanvas.on("selection:cleared", updateActiveObject);
    updateTexture();
    return () => fabricCanvas.off();
  }, [fabricCanvas, onCanvasUpdate]);

  // === Add image safely ===
  const addImageToCanvas = async (url: string) => {
    if (!fabricCanvas || !url) return;
    try {
      const imgEl = new Image();
      imgEl.crossOrigin = "anonymous";
      const loaded = await new Promise<HTMLImageElement>((resolve, reject) => {
        imgEl.onload = () => resolve(imgEl);
        imgEl.onerror = () => reject(new Error("Image failed to load"));
        imgEl.src = url;
      });
      const img = new fabric.Image(loaded, {});
      img.customCornerRadius = 0;
      img.scaleToWidth(150);
      img.set({
        left: (fabricCanvas.width! - img.getScaledWidth()) / 2,
        top: (fabricCanvas.height! - img.getScaledHeight()) / 2,
      });
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.requestRenderAll();
      setIsModalOpen(false);
    } catch {
      alert("This image could not be loaded. Try another one.");
    }
  };

  // === Basic actions ===
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) addImageToCanvas(dataUrl);
    };
    reader.readAsDataURL(file);
  };
  const handleAddText = () => {
    if (!fabricCanvas) return;
    const text = new fabric.IText("Enter Your Text", {
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
  const handleDeleteSelected = () => {
    if (fabricCanvas && activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
    }
  };

  const isTextSelected = activeObject?.type === "i-text";
  const isImageSelected = activeObject?.type === "image";

  // === Controls ===
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFont(e.target.value);
    if (activeObject?.type === "i-text") {
      (activeObject as fabric.IText).set("fontFamily", e.target.value);
      fabricCanvas?.requestRenderAll();
    }
  };
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
    if (activeObject?.type === "i-text") {
      (activeObject as fabric.IText).set("fill", e.target.value);
      fabricCanvas?.requestRenderAll();
    }
  };
  const handleCornerRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const r = parseInt(e.target.value, 10);
    setCornerRadius(r);
    if (activeObject?.type === "image") {
      const img = activeObject as fabric.Image;
      img.customCornerRadius = r;
      img.clipPath = r
        ? new fabric.Rect({
            width: img.width,
            height: img.height,
            rx: r / img.scaleX!,
            ry: r / img.scaleY!,
            left: -img.width! / 2,
            top: -img.height! / 2,
          })
        : undefined;
      fabricCanvas?.requestRenderAll();
    }
  };

  // === Data fetching ===
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORIES_API_URL);
        const data = await response.json();
        setCategories(data);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchCategories();
  }, []);

  const fetchSubcategories = async (id: string) => {
    try {
      const response = await fetch(SUBCATEGORIES_API_URL(id));
      const data = await response.json();
      setSubcategories(data);
      setSelectedCategoryId(id);
      setImages([]);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchImages = async (subId: string) => {
    try {
      const response = await fetch(IMAGES_API_URL(subId));
      const data = await response.json();
      setImages(data);
      setSelectedSubcategoryId(subId);
    } catch (e) {
      console.error(e);
    }
  };

  // === UI ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="space-y-6 w-full max-w-[440px] mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            DESIGN MATRIX v2.0
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Canvas Container */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-slate-950 rounded-lg p-2">
            <div
              className="w-[420px] h-[240px] border-2 border-cyan-500/30 rounded-md relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(45deg, rgba(20,20,40,0.5) 25%, transparent 25%), 
                                 linear-gradient(-45deg, rgba(20,20,40,0.5) 25%, transparent 25%), 
                                 linear-gradient(45deg, transparent 75%, rgba(20,20,40,0.5) 75%), 
                                 linear-gradient(-45deg, transparent 75%, rgba(20,20,40,0.5) 75%)`,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                backgroundColor: "#e1e1f7",
              }}
            >
              <canvas ref={canvasRef} />
              {/* Scan line effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" 
                     style={{animation: "scanline 3s linear infinite"}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative overflow-hidden flex items-center justify-center gap-2 p-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <PhotoIcon className="w-5 h-5 text-cyan-400 relative z-10" />
            <span className="text-cyan-300 font-medium relative z-10">UPLOAD</span>
          </button>
          <button
            onClick={handleAddText}
            className="group relative overflow-hidden flex items-center justify-center gap-2 p-3 bg-slate-800/50 border border-purple-500/30 rounded-lg hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-purple-400 relative z-10" />
            <span className="text-purple-300 font-medium relative z-10">ADD TEXT</span>
          </button>
        </div>

        {/* Graphics Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative w-full overflow-hidden p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg hover:border-pink-400 transition-all duration-300 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold relative z-10">
            ◈ GRAPHIC LIBRARY ACCESS ◈
          </span>
        </button>

        {/* Controls */}
        {isImageSelected && (
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
            <label className="text-cyan-300 font-medium mb-2 block">
              ▸ CORNER RADIUS: <span className="text-cyan-400">{cornerRadius}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={cornerRadius}
              onChange={handleCornerRadiusChange}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              style={{
                background: `linear-gradient(to right, rgb(34 211 238) 0%, rgb(34 211 238) ${cornerRadius}%, rgb(51 65 85) ${cornerRadius}%, rgb(51 65 85) 100%)`
              }}
            />
          </div>
        )}
        
        {isTextSelected && (
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm grid grid-cols-2 gap-3">
            <select 
              value={selectedFont} 
              onChange={handleFontChange}
              className="bg-slate-900 border border-purple-500/30 rounded-lg p-2 text-purple-300 focus:outline-none focus:border-purple-400"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} className="bg-slate-900">{font}</option>
              ))}
            </select>
            <div className="relative">
              <input 
                type="color" 
                value={selectedColor} 
                onChange={handleColorChange}
                className="w-full h-full rounded-lg cursor-pointer border border-purple-500/30 bg-slate-900"
              />
            </div>
          </div>
        )}
        
        {activeObject && (
          <button
            onClick={handleDeleteSelected}
            className="group relative w-full overflow-hidden flex items-center justify-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg hover:border-red-400 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <TrashIcon className="w-5 h-5 text-red-400 relative z-10" />
            <span className="text-red-300 font-bold relative z-10">DELETE SELECTED</span>
          </button>
        )}

        {/* === Modal === */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative w-[90%] max-w-2xl h-[80vh]">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl blur opacity-75"></div>
              
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-6 h-full overflow-y-auto border border-cyan-500/30">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                      GRAPHIC ARCHIVES
                    </h2>
                    <div className="h-0.5 w-24 bg-gradient-to-r from-cyan-500 to-transparent mt-1"></div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 flex items-center justify-center text-cyan-400 hover:text-cyan-300 text-2xl border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition-all duration-300 bg-slate-800/50"
                  >
                    ✕
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-cyan-400 text-lg animate-pulse">◆ LOADING DATA ◆</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Categories */}
                    {categories.length > 0 && (
                      <div>
                        <h3 className="text-cyan-300 font-semibold mb-3 text-sm tracking-wider">▸ CATEGORIES</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => fetchSubcategories(cat.id)}
                              className={`relative overflow-hidden p-2 rounded-lg bg-cover bg-center h-20 font-semibold transition-all duration-300 group ${
                                selectedCategoryId === cat.id 
                                  ? "ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/50" 
                                  : "border border-slate-700 hover:border-cyan-500/50"
                              }`}
                              style={{ backgroundImage: `url(${cat.imageUrl})` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                              <span className="relative z-10 text-cyan-100 text-sm drop-shadow-lg">
                                {cat.categoryName}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subcategories */}
                    {subcategories.length > 0 && (
                      <div>
                        <h3 className="text-purple-300 font-semibold mb-3 text-sm tracking-wider">▸ SUBCATEGORIES</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => fetchImages(sub.id)}
                              className={`relative overflow-hidden rounded-lg h-20 bg-cover bg-center font-semibold transition-all duration-300 ${
                                selectedSubcategoryId === sub.id
                                  ? "ring-2 ring-purple-400 shadow-lg shadow-purple-500/50"
                                  : "border border-slate-700 hover:border-purple-500/50"
                              }`}
                              style={{
                                backgroundImage: sub.imageUrl
                                  ? `url(${sub.imageUrl})`
                                  : undefined,
                                backgroundColor: !sub.imageUrl ? "#1e293b" : undefined
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                              <span className="relative z-10 text-purple-100 text-sm drop-shadow-lg">
                                {sub.subCategoryName}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Images */}
                    {images.length > 0 && (
                      <div>
                        <h3 className="text-pink-300 font-semibold mb-3 text-sm tracking-wider">▸ ASSETS</h3>
                        <div className="grid grid-cols-4 gap-3">
                          {images.map((img) => (
                            <button
                              key={img.id}
                              onClick={() => addImageToCanvas(img.url)}
                              className="group relative overflow-hidden rounded-lg p-1 h-24 bg-cover bg-center transition-all duration-300 border border-slate-700 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/30"
                              style={{ backgroundImage: `url(${img.url})` }}
                            >
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default DesignCanvas;