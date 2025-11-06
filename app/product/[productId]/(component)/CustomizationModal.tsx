"use client";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, OrbitControls, Loader, useTexture } from "@react-three/drei";
import dynamic from "next/dynamic";
import axios from "axios";
// Assuming you have these configured, otherwise replace with your actual values/logic
// import { baseUrl } from "@/app/utilities/baseUrl";
// import { addItemToServer } from "@/app/store/cartSlice";
// import { useDispatch } from "react-redux";

// --- Helper Function to Convert Data URL to File ---
// This is essential for sending the canvas design as a file.
const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    try {
        const arr = dataurl.split(',');
        if (arr.length < 2) return null;
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return null;
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    } catch (e) {
        console.error("Error converting data URL to file:", e);
        return null;
    }
};


// Dynamically import DesignCanvas to prevent SSR/hydration issues
const DesignCanvas = dynamic(() => import("./DesignCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-[420px] h-[370px] bg-gradient-to-br from-slate-800/50 to-slate-900/50 animate-pulse rounded-lg border border-cyan-500/30" />
  ),
});

// --- TYPES ---
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

// --- 3D Model Component ---
const Model = ({
  url,
  designTextureUrl,
  defaultImageUrl,
}: {
  url: string;
  designTextureUrl: string | null;
  defaultImageUrl: string | null;
}) => {
  const { scene } = useGLTF(url);
  const designTexture = useTexture(designTextureUrl ?? "");
  const defaultTexture = useTexture(defaultImageUrl ?? "");

useEffect(() => {
  if (!scene) return;
  let meshFound = false; // Use a flag to only affect the first mesh

  scene.traverse((child) => {
    // If we already found and processed our mesh, do nothing more.
    if (meshFound) return;

    if (child instanceof THREE.Mesh) {
      meshFound = true; // Mark that we've found our target
      
      // TypeScript knows `child` is a THREE.Mesh here, so `child.material` is safe.
      const material = child.material as THREE.MeshStandardMaterial;
      const activeTexture = designTextureUrl ? designTexture : (defaultImageUrl ? defaultTexture : null);

      if (activeTexture) {
        material.map = activeTexture;
        activeTexture.flipY = true; // Correct orientation
        activeTexture.needsUpdate = true;
        material.needsUpdate = true;
      } else {
        material.map = null;
        material.color.set("white");
        material.needsUpdate = true;
      }
    }
  });
}, [scene, designTexture, defaultTexture, designTextureUrl, defaultImageUrl]);

  return <primitive object={scene} />;
};


// --- 3D Viewer Component ---
const ModelViewer = ({
  modelUrl,
  designTextureUrl,
  defaultImageUrl,
}: {
  modelUrl: string;
  designTextureUrl: string | null;
  defaultImageUrl: string | null;
}) => {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        style={{
          background: "linear-gradient(to bottom, #001f3f, #00cfff 30%)",
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} />
        <Suspense fallback={null}>
          <Model
            url={modelUrl}
            designTextureUrl={designTextureUrl}
            defaultImageUrl={defaultImageUrl}
          />
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.3} enableZoom={true} />
      </Canvas>
      <Loader />
    </>
  );
};

// --- Main Modal Component ---
const CustomizationModal = ({
  isOpen,
  onClose,
  product,
  selectedVariant,
}: CustomizationModalProps) => {
  // State for canvas design
  const [designTextureUrl, setDesignTextureUrl] = useState<string | null>(null);
  
  // State for all images (user uploaded files AND library URLs)
  const [allImageSources, setAllImageSources] = useState<(File | string)[]>([]);
  
  // State for user text input
  const [customInstructions, setCustomInstructions] = useState<string>("");
  
  // State for API submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Placeholder for dispatch, replace with your actual hook
  // const dispatch = useDispatch();
  // const dispatch = (action: any) => console.log("Dispatching:", action);

  // This handler receives a mix of File objects (from upload) and string URLs (from library)
  const handleImagesUpdate = (images: (File | string)[]) => {
    setAllImageSources(images);
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

      // 1. Build and append customizationDetails JSON
      const customizationDetails = {
        instructions: customInstructions,
      };
      formData.append("customizationDetails", JSON.stringify(customizationDetails));

      // 2. Process and append ALL images for customizationImages
      const imageUploadPromises: Promise<File>[] = [];

      // Add the final canvas design as the primary image
      if (designTextureUrl) {
        const canvasFile = dataURLtoFile(designTextureUrl, `design-${selectedVariant.sku}.png`);
        if(canvasFile) {
            formData.append('customizationImages', canvasFile);
        }
      }
      
      // Handle other images (user uploads, library)
      for (const source of allImageSources) {
        if (source instanceof File) {
          // It's already a file, append directly
          formData.append('customizationImages', source);
        } else if (typeof source === 'string' && source.startsWith('http')) {
          // It's a URL, fetch it and convert to a File
          const promise = fetch(source)
            .then(res => res.blob())
            .then(blob => {
              const filename = source.substring(source.lastIndexOf('/') + 1);
              return new File([blob], filename, { type: blob.type });
            });
          imageUploadPromises.push(promise);
        }
      }

      // Wait for all URL-to-File conversions to finish
      const convertedFiles = await Promise.all(imageUploadPromises);
      convertedFiles.forEach(file => formData.append('customizationImages', file));

      // 3. Send the request
      const token = localStorage.getItem("token");
      const response = await axios.post(
        // Replace with your actual backend URL
        `${process.env.NEXT_PUBLIC_API_URL}/cart/add-item`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // IMPORTANT: Do NOT set 'Content-Type'. Axios/browser will do it automatically for FormData.
          },
        }
      );

      console.log("✅ Cart item added successfully:", response.data);
      // dispatch(addItemToServer(response.data));
      alert("Item added to cart successfully!");
      onClose();

    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      let errorMessage = "Failed to add item to cart.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl h-[100vh] flex flex-col overflow-hidden"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/50 rounded-2xl shadow-2xl border border-cyan-500/30 flex flex-col overflow-hidden">
              <header className="relative flex items-center justify-between p-6 border-b border-cyan-500/30 bg-slate-950/50 backdrop-blur-sm">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1">PRODUCT CUSTOMIZATION</h2>
                  <div className="h-0.5 w-48 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  <p className="text-cyan-300 mt-2 text-sm font-medium tracking-wide">▸ {product.title}</p>
                </div>
                <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition-all duration-300 bg-slate-800/50 group">
                  <XMarkIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </header>

              <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl overflow-hidden border border-cyan-500/30 h-[600px]">
                    {product.model3dUrl ? (
                      <ModelViewer
                        modelUrl={product.model3dUrl}
                        designTextureUrl={designTextureUrl}
                        defaultImageUrl={product.images[0] || null}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <p className="text-cyan-300/50 font-medium">No 3D model available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-cyan-300 font-bold text-lg mb-1 tracking-wide">▸ DESIGN INTERFACE</h3>
                    <div className="h-0.5 w-32 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <DesignCanvas
                      onCanvasUpdate={setDesignTextureUrl}
                      onImagesUpdate={handleImagesUpdate}
                    />
                  </div>

                  {/* --- NEW, STYLED INPUT BOX --- */}
                  <div className="w-full mt-6">
                     <label htmlFor="custom-instructions" className="flex items-center gap-2 text-cyan-300 font-semibold mb-2 text-sm tracking-wider">
                        <PencilSquareIcon className="w-5 h-5" />
                        SPECIAL INSTRUCTIONS
                     </label>
                     <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                        <textarea
                            id="custom-instructions"
                            rows={3}
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            placeholder="e.g., Use the blue logo on the front, and place 'Happy Birthday' on the back..."
                            className="relative w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                     </div>
                  </div>

                  <div className="w-full mt-6">
                    <button
                      onClick={handleAddToCart}
                      disabled={isSubmitting}
                      className="group relative w-full overflow-hidden py-4 rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        <span className="text-2xl">🛒</span>
                        <span className="text-white tracking-wider">
                          {isSubmitting ? 'SUBMITTING...' : 'ADD TO CART'}
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
                    </button>
                    {selectedVariant && (
                      <div className="mt-3 text-center">
                        <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30">
                          <span className="text-purple-300 text-sm font-medium">Price:</span>
                          <span className="text-purple-400 text-lg font-bold">${selectedVariant.price}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </main>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomizationModal;