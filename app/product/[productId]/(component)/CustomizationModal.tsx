"use client";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, OrbitControls, Loader, useTexture } from "@react-three/drei";
import dynamic from "next/dynamic";
import axios from "axios";

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

const DesignCanvas = dynamic(() => import("./DesignCanvas"), {
  ssr: false,
  loading: () => (
    <div 
      className="w-full h-full rounded-xl bg-[#e8ecf0]"
      style={{
        boxShadow: 'inset 6px 6px 12px #c5cdd5, inset -6px -6px 12px #ffffff'
      }}
    />
  ),
});

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

/* 3D model */
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
    let meshFound = false;
    scene.traverse((child) => {
      if (meshFound) return;
      if (child instanceof THREE.Mesh) {
        meshFound = true;
        const material = child.material as THREE.MeshStandardMaterial;
        const activeTexture = designTextureUrl
          ? designTexture
          : defaultImageUrl
          ? defaultTexture
          : null;

        if (activeTexture) {
          material.map = activeTexture;
          activeTexture.flipY = true;
          activeTexture.needsUpdate = true;
          material.needsUpdate = true;
        } else {
          material.map = null;
          material.color.set("#ffffff");
          material.needsUpdate = true;
        }
      }
    });
  }, [scene, designTexture, defaultTexture, designTextureUrl, defaultImageUrl]);

  return <primitive object={scene} />;
};

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
        className="w-full h-full"
        style={{
          background: "#e8ecf0",
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} />
        <Suspense fallback={null}>
          <Model
            url={modelUrl}
            designTextureUrl={designTextureUrl}
            defaultImageUrl={defaultImageUrl}
          />
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.1} enableZoom />
      </Canvas>
      <Loader />
    </>
  );
};

const springIn = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 32, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.98,
    transition: { duration: 0.18 },
  },
};
const tap = { scale: 0.98 };

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

      if (designTextureUrl) {
        const f = dataURLtoFile(designTextureUrl, `design-${selectedVariant.sku}.png`);
        if (f) formData.append("customizationImages", f);
      }

      const promises: Promise<File>[] = [];
      for (const src of allImageSources) {
        if (src instanceof File) {
          formData.append("customizationImages", src);
        } else if (typeof src === "string" && src.startsWith("http")) {
          const p = fetch(src)
            .then((r) => r.blob())
            .then((b) => new File([b], src.substring(src.lastIndexOf("/") + 1), { type: b.type }));
          promises.push(p);
        }
      }
      const converted = await Promise.all(promises);
      converted.forEach((f) => formData.append("customizationImages", f));

      const token = localStorage.getItem("token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart/add-item`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Item added to cart successfully!");
      setAllImageSources([]);
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
          <motion.div
            key="modal"
            variants={springIn}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[1400px] max-h-[90vh] bg-[#e8ecf0] text-gray-800 rounded-3xl overflow-hidden flex flex-col"
            style={{
              boxShadow: '20px 20px 40px #c5cdd5, -20px -20px 40px #ffffff'
            }}
          >
            {/* Header */}
            <header 
              className="relative flex items-center justify-between p-4 md:p-5 flex-shrink-0 bg-[#e8ecf0]"
              style={{
                boxShadow: '0 4px 8px #c5cdd5'
              }}
            >
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 truncate">
                  Product Customization
                </h2>
                <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">{product.title}</p>
              </div>
              <motion.button
                whileTap={tap}
                onClick={onClose}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 rounded-xl transition bg-[#e8ecf0] flex-shrink-0 ml-4"
                style={{
                  boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff'
                }}
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </header>

            {/* Body - 2x2 Grid Layout with custom row heights */}
            <main className="relative flex-1 overflow-y-auto bg-[#e8ecf0]">
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Top Left - 3D Model Viewer */}
                  <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative rounded-2xl overflow-hidden bg-[#e8ecf0] h-[400px] md:h-[400px]"
                    style={{
                      boxShadow: '10px 10px 20px #c5cdd5, -10px -10px 20px #ffffff'
                    }}
                  >
                    <div 
                      className="absolute top-3 left-3 z-10 bg-[#e8ecf0] px-3 py-1.5 rounded-lg"
                      style={{
                        boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff'
                      }}
                    >
                      <p className="text-xs font-semibold text-gray-900">3D Model Viewer</p>
                    </div>
                    {product.model3dUrl ? (
                      <ModelViewer
                        modelUrl={product.model3dUrl}
                        designTextureUrl={designTextureUrl}
                        defaultImageUrl={product.images[0] || null}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">No 3D model available</p>
                      </div>
                    )}
                  </motion.section>

                  {/* Top Right - Canvas */}
                  <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative rounded-2xl overflow-hidden bg-[#e8ecf0] h-[400px] md:h-[400px]"
                    style={{
                      boxShadow: '10px 10px 20px #c5cdd5, -10px -10px 20px #ffffff'
                    }}
                  >
                    <div 
                      className="absolute top-3 left-3 z-10 bg-[#e8ecf0] px-3 py-1.5 rounded-lg"
                      style={{
                        boxShadow: '4px 4px 8px #c5cdd5, -4px -4px 8px #ffffff'
                      }}
                    >
                      <p className="text-xs font-semibold text-gray-900">Design Canvas</p>
                    </div>
                    <div className="p-4 h-full flex items-center justify-center">
                      <DesignCanvas onCanvasUpdate={setDesignTextureUrl} />
                    </div>
                  </motion.section>

                  {/* Bottom Left - Controls (Reduced Height) */}
                  <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative rounded-2xl bg-[#e8ecf0] p-4 h-[140px] md:h-[180px] flex flex-col"
                    style={{
                      boxShadow: '10px 10px 20px #c5cdd5, -10px -10px 20px #ffffff'
                    }}
                  >
                    <div className="mb-2">
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <PencilSquareIcon className="w-4 h-4 text-gray-700" />
                        Special Instructions
                      </h3>
                    </div>
                    <textarea
                      id="custom-instructions"
                      rows={3}
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="Controls like corner radius, text color and font, browse graphics library, add image, text..."
                      className="flex-1 w-full p-2.5 rounded-xl bg-[#e8ecf0] text-gray-900 placeholder-gray-600 focus:outline-none transition resize-none text-sm"
                      style={{
                        boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                      }}
                    />
                  </motion.section>

                  {/* Bottom Right - Pricing and Add to Cart (Reduced Height) */}
                  <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative rounded-2xl bg-[#e8ecf0] p-4 h-[140px] md:h-[180px] flex flex-col justify-between"
                    style={{
                      boxShadow: '10px 10px 20px #c5cdd5, -10px -10px 20px #ffffff'
                    }}
                  >
                    <div className="flex-1 flex flex-col justify-center">
                      {selectedVariant && (
                        <div className="text-center">
                          <p className="text-xs text-gray-600 mb-1.5 font-semibold">Total Price</p>
                          <div 
                            className="inline-flex items-center gap-2 bg-[#e8ecf0] px-5 py-2 rounded-xl"
                            style={{
                              boxShadow: 'inset 4px 4px 8px #c5cdd5, inset -4px -4px 8px #ffffff'
                            }}
                          >
                            <span className="text-gray-900 text-2xl font-bold">₹{selectedVariant.price}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileTap={tap}
                      whileHover={{ scale: 1.02 }}
                      onClick={handleAddToCart}
                      disabled={isSubmitting}
                      className="relative w-full overflow-hidden py-3 rounded-2xl font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-900 text-white hover:bg-gray-800"
                      style={{
                        boxShadow: '6px 6px 12px #c5cdd5, -4px -4px 8px #ffffff'
                      }}
                    >
                      <span className="relative z-10">
                        {isSubmitting ? "Submitting..." : "Add to Cart"}
                      </span>
                    </motion.button>
                  </motion.section>
                </div>
              </div>
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomizationModal;
