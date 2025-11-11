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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === Canvas setup ===
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 350,
      height: 150,
      backgroundColor: "transparent",
    });
    setFabricCanvas(canvas);
    return () => {
      canvas.dispose();
    };
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
      img.scaleToWidth(90);
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
      left: 30,
      top: 30,
      fontSize: 16,
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
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchCategories();
  }, []);

  const fetchSubcategories = async (id: string) => {
    setIsLoadingSubcategories(true);
    setSubcategories([]);
    setImages([]);
    setSelectedSubcategoryId(null);
    try {
      const response = await fetch(SUBCATEGORIES_API_URL(id));
      const data = await response.json();
      setSubcategories(data);
      setSelectedCategoryId(id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSubcategories(false);
    }
  };

  const fetchImages = async (subId: string) => {
    setIsLoadingImages(true);
    setImages([]);
    try {
      const response = await fetch(IMAGES_API_URL(subId));
      const data = await response.json();
      setImages(data);
      setSelectedSubcategoryId(subId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingImages(false);
    }
  };

  // === UI ===
  return (
    <div className="w-full h-full flex flex-col">
      {/* Canvas Container */}
      <div className="flex-shrink-0 mb-2">
        <div className="bg-white/30 backdrop-blur-sm rounded-lg p-1.5 border border-gray-200/40">
          <div className="w-full aspect-[7/3] max-w-full border border-gray-200 rounded-lg relative overflow-hidden bg-white/50 flex items-center justify-center">
            <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-1.5 mb-2 flex-shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-0.5 p-1.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-lg hover:bg-white/60 transition-all duration-200 shadow-sm text-xs"
        >
          <PhotoIcon className="w-3.5 h-3.5 text-gray-700" />
          <span className="text-gray-700 font-medium text-[10px]">Upload</span>
        </button>
        <button
          onClick={handleAddText}
          className="flex flex-col items-center justify-center gap-0.5 p-1.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-lg hover:bg-white/60 transition-all duration-200 shadow-sm text-xs"
        >
          <ChatBubbleBottomCenterTextIcon className="w-3.5 h-3.5 text-gray-700" />
          <span className="text-gray-700 font-medium text-[10px]">Text</span>
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 p-1.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-lg hover:bg-white/60 transition-all duration-200 shadow-sm text-xs"
        >
          <span className="text-gray-700 font-medium text-[10px]">Graphics</span>
        </button>
      </div>

      {/* Controls - Static, No Scroll */}
      <div className="space-y-1.5 flex-shrink-0">
        {isImageSelected && (
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-lg p-2 shadow-sm">
            <label className="text-gray-700 font-medium text-[10px] block mb-1">
              Radius: {cornerRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={cornerRadius}
              onChange={handleCornerRadiusChange}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-400"
            />
          </div>
        )}

        {isTextSelected && (
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-lg p-2 shadow-sm grid grid-cols-2 gap-1.5">
            <select
              value={selectedFont}
              onChange={handleFontChange}
              className="bg-white border border-gray-300 rounded-md p-1.5 text-gray-700 text-xs focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font} className="bg-white text-gray-700">
                  {font}
                </option>
              ))}
            </select>
            <input
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="w-full h-full rounded-md cursor-pointer border border-white/60 bg-white/60 backdrop-blur-xl"
            />
          </div>
        )}

        {activeObject && (
          <button
            onClick={handleDeleteSelected}
            className="w-full flex items-center justify-center gap-1 p-1.5 bg-red-50/40 backdrop-blur-xl border border-red-200/60 rounded-lg hover:bg-red-100/60 transition-all duration-200 shadow-sm"
          >
            <TrashIcon className="w-3.5 h-3.5 text-red-600" />
            <span className="text-red-600 font-medium text-[10px]">Delete</span>
          </button>
        )}
      </div>

      {/* === Modal === */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="relative w-[90%] max-w-2xl h-[80vh]">
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 h-full overflow-y-auto border border-white/60 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Graphics Library</h2>
                  <div className="h-0.5 w-24 bg-gray-300 mt-1"></div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 text-2xl border border-white/60 rounded-lg hover:bg-white/60 transition-all duration-200 bg-white/40 backdrop-blur-xl"
                >
                  ✕
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                    <div className="text-gray-600 text-sm">Loading categories...</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Categories */}
                  {categories.length > 0 && (
                    <div>
                      <h3 className="text-gray-700 font-semibold mb-3 text-sm">Categories</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => fetchSubcategories(cat.id)}
                            className={`relative overflow-hidden p-2 rounded-xl bg-cover bg-center h-20 font-semibold transition-all duration-200 ${
                              selectedCategoryId === cat.id
                                ? "ring-2 ring-gray-400 shadow-md"
                                : "border border-white/60 hover:border-gray-300"
                            }`}
                            style={{ backgroundImage: `url(${cat.imageUrl})` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                            <span className="relative z-10 text-white text-sm drop-shadow-lg">
                              {cat.categoryName}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subcategories Loading */}
                  {isLoadingSubcategories && (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                        <div className="text-gray-600 text-xs">Loading subcategories...</div>
                      </div>
                    </div>
                  )}

                  {/* Subcategories */}
                  {!isLoadingSubcategories && subcategories.length > 0 && (
                    <div>
                      <h3 className="text-gray-700 font-semibold mb-3 text-sm">Subcategories</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => fetchImages(sub.id)}
                            className={`relative overflow-hidden rounded-xl h-20 bg-cover bg-center font-semibold transition-all duration-200 ${
                              selectedSubcategoryId === sub.id
                                ? "ring-2 ring-gray-400 shadow-md"
                                : "border border-white/60 hover:border-gray-300"
                            }`}
                            style={{
                              backgroundImage: sub.imageUrl ? `url(${sub.imageUrl})` : undefined,
                              backgroundColor: !sub.imageUrl ? "#f9fafb" : undefined,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                            <span className="relative z-10 text-white text-sm drop-shadow-lg">
                              {sub.subCategoryName}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Images Loading */}
                  {isLoadingImages && (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                        <div className="text-gray-600 text-xs">Loading images...</div>
                      </div>
                    </div>
                  )}

                  {/* Images */}
                  {!isLoadingImages && images.length > 0 && (
                    <div>
                      <h3 className="text-gray-700 font-semibold mb-3 text-sm">Images</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {images.map((img) => (
                          <button
                            key={img.id}
                            onClick={() => addImageToCanvas(img.url)}
                            className="relative overflow-hidden rounded-xl p-1 h-24 bg-cover bg-center transition-all duration-200 border border-white/60 hover:border-gray-300 hover:shadow-md"
                            style={{ backgroundImage: `url(${img.url})` }}
                          ></button>
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
  );
};

export default DesignCanvas;
