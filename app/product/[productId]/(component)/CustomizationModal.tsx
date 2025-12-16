"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon, 
  PencilSquareIcon, 
  ArrowUpTrayIcon 
} from "@heroicons/react/24/outline";
import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, OrbitControls, Loader, useTexture } from "@react-three/drei";
import dynamic from "next/dynamic";
import axios from "axios";
import html2canvas from "html2canvas"; // Import html2canvas
import DesignPng from "./DesignPng";

// --- Helper Functions ---

const dataURLtoFile = (dataurl: string, filename: string): File | null => {
  try {
    const arr = dataurl.split(",");
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  } catch (e) {
    console.error("Error converting data URL to file:", e);
    return null;
  }
};

const isPngModel = (url: string | null) => {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".png") || clean.endsWith(".jpg") || clean.endsWith(".jpeg");
};

// --- Dynamic Imports ---
const DesignCanvas = dynamic(() => import("./DesignCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#e8ecf0]" />,
});

// --- Types ---
interface ProductDetails {
  id: string;
  title: string;
  images: string[];
  model3dUrl: string | null;
  customizationConfig: unknown | null;
  slicenseDocumentUrl: string | null;
}
interface Variant {
  id: string;
  sku: string;
  price: string;
}
interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetails;
  selectedVariant: Variant | null;
}

// --- 3D Model Components (Unchanged) ---
const Model = ({ url, designTextureUrl, defaultImageUrl }: { url: string; designTextureUrl: string | null; defaultImageUrl: string | null; }) => {
  const { scene } = useGLTF(url);
  const designTexture = useTexture(designTextureUrl || "/placeholder.png");
  const defaultTexture = useTexture(defaultImageUrl || "/placeholder.png");
  
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const material = child.material as THREE.MeshStandardMaterial;
      const tex = designTextureUrl ? designTexture : defaultTexture;

      if (tex) {
        tex.flipY = false;
        material.map = tex;
        tex.needsUpdate = true;
        material.needsUpdate = true;
      } else {
        material.map = null;
        material.color.set("#ffffff");
        material.needsUpdate = true;
      }
    });
  }, [scene, designTexture, defaultTexture, designTextureUrl]);

  return <primitive object={scene} />;
};

interface ModelViewerProps {
  modelUrl: string;
  designTextureUrl: string | null;
  defaultImageUrl: string | null;
}

const ModelViewer = ({ modelUrl, designTextureUrl, defaultImageUrl }: ModelViewerProps) => {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} className="w-full h-full">
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} />
        <Suspense fallback={null}>
          <Model url={modelUrl} designTextureUrl={designTextureUrl} defaultImageUrl={defaultImageUrl} />
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.1} enableZoom />
      </Canvas>
      <Loader />
    </>
  );
};

// --- Animation Variants ---
const springIn = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};
const tap = { scale: 0.98 };

// --- Main Component ---
const CustomizationModal = ({
  isOpen,
  onClose,
  product,
  selectedVariant,
}: CustomizationModalProps) => {
  const [designTextureUrl, setDesignTextureUrl] = useState<string | null>(null);
  const [allImageSources, setAllImageSources] = useState<(File | string)[]>([]);
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref to capture the DOM element for PNG mode
  const captureRef = useRef<HTMLDivElement>(null);

  const pngModel = isPngModel(product.model3dUrl);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDesignTextureUrl(url); 
      setAllImageSources([file]); 
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Please select a variant first.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", product.id);
      formData.append("variantId", selectedVariant.id);
      formData.append("quantity", "1");
      formData.append("customizationDetails", JSON.stringify({ instructions: customInstructions }));

      let finalFile: File | null = null;

      // --- LOGIC 1: PNG MODE (Snapshots the Drag-and-Drop Area) ---
      if (pngModel && captureRef.current && designTextureUrl) {
        
        // Use html2canvas to capture the specific referenced div
        const canvas = await html2canvas(captureRef.current, {
          backgroundColor: null, // Keep transparency if any
          scale: 4, // High resolution for printing
          // useCORS: true, // Allow external images
        });

        // Convert canvas to Blob -> File
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        
        if (blob) {
          finalFile = new File([blob], `design-${selectedVariant.sku}-${Date.now()}.png`, { type: "image/png" });
          formData.append("customizationImages", finalFile);
        }

      } 
      // --- LOGIC 2: 3D CANVAS MODE (Using Data URL) ---
      else if (!pngModel && designTextureUrl && designTextureUrl.startsWith("data:")) {
        // DesignCanvas usually updates state with a base64 Data URL
        finalFile = dataURLtoFile(designTextureUrl, `design-${selectedVariant.sku}.png`);
        if (finalFile) formData.append("customizationImages", finalFile);
      }
      // --- LOGIC 3: FALLBACK (Direct File Upload) ---
      else {
        // If no snapshot logic ran, send the original file
        for (const src of allImageSources) {
          if (src instanceof File) {
            formData.append("customizationImages", src);
          }
        }
      }

      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add-item`,
        formData,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      alert("Item added to cart successfully!");
      setAllImageSources([]);
      setDesignTextureUrl(null);
      setCustomInstructions("");
      onClose();

    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-md flex items-center justify-center p-3 md:p-6"
          onClick={onClose}
        >
          {pngModel ? (
            /* --- PNG MODEL LAYOUT --- */
            <motion.div
                variants={springIn}
                initial="initial"
                animate="animate"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[600px]"
            >
                <div className="flex-1 bg-[#e8ecf0] relative flex items-center justify-center p-4">
                    {/* Pass the captureRef to DesignPng */}
                    <DesignPng 
                        ref={captureRef}
                        mockupUrl={product.model3dUrl as string} 
                        designTextureUrl={designTextureUrl}
                        onRemoveDesign={() => {
                            setDesignTextureUrl(null);
                            setAllImageSources([]);
                        }}
                    />
                </div>
                <div className="w-full md:w-[400px] bg-white p-6 flex flex-col justify-between border-l border-gray-100 overflow-y-auto">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{product.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{selectedVariant ? `Variant: ${selectedVariant.sku}` : "Select a variant"}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><XMarkIcon className="w-6 h-6 text-gray-500" /></button>
                        </div>
                        <div className="space-y-4 mb-6">
                            <label className="block w-full group cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                                    <ArrowUpTrayIcon className="w-8 h-8" />
                                    <span className="text-sm font-semibold">Click to Upload Image</span>
                                </div>
                            </label>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-2 text-gray-700">
                                    <PencilSquareIcon className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Instructions</span>
                                </div>
                                <textarea rows={3} value={customInstructions} onChange={(e) => setCustomInstructions(e.target.value)} placeholder="E.g. Center the face..." className="w-full bg-transparent text-sm text-gray-900 focus:outline-none resize-none" />
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100 space-y-4">
                        {selectedVariant && <div className="flex justify-between items-end"><span className="text-sm font-medium text-gray-500">Total Price</span><span className="text-3xl font-bold text-gray-900">₹{selectedVariant.price}</span></div>}
                        <motion.button whileTap={tap} onClick={handleAddToCart} disabled={isSubmitting || !selectedVariant} className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">{isSubmitting ? "Processing..." : "Add to Cart"}</motion.button>
                    </div>
                </div>
            </motion.div>
          ) : (
            /* --- 3D CANVAS LAYOUT --- */
            <motion.div
              variants={springIn}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[1400px] max-h-[90vh] bg-[#e8ecf0] text-gray-800 rounded-3xl overflow-hidden flex flex-col"
            >
              {/* Header and 3D Viewers... (Unchanged from your previous version) */}
              <header className="relative flex items-center justify-between p-4 bg-[#e8ecf0]">
                <h2 className="text-xl font-bold">Product Customization (3D)</h2>
                <button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button>
              </header>
              <main className="relative flex-1 overflow-y-auto bg-[#e8ecf0] p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[400px] rounded-2xl overflow-hidden"><ModelViewer modelUrl={product.model3dUrl!} designTextureUrl={designTextureUrl} defaultImageUrl={product.images[0]} /></div>
                    <div className="h-[400px] rounded-2xl overflow-hidden"><DesignCanvas onCanvasUpdate={setDesignTextureUrl} /></div>
                    <div className="h-[150px]"><textarea className="w-full h-full p-2 rounded-xl" value={customInstructions} onChange={e=>setCustomInstructions(e.target.value)} placeholder="Instructions"/></div>
                    <div className="flex items-center justify-center"><button onClick={handleAddToCart} className="bg-black text-white px-8 py-3 rounded-xl font-bold">Add to Cart</button></div>
                 </div>
              </main>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomizationModal;