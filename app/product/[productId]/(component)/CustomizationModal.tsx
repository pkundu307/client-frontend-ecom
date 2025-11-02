"use client";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, OrbitControls, Loader, useTexture } from '@react-three/drei';
import dynamic from 'next/dynamic';

// Dynamically import DesignCanvas to prevent SSR/hydration issues
const DesignCanvas = dynamic(() => import('./DesignCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-[420px] h-[370px] bg-gradient-to-br from-slate-800/50 to-slate-900/50 animate-pulse rounded-lg border border-cyan-500/30" />
  )
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
  const designTexture = useTexture(designTextureUrl ?? '');
  const defaultTexture = useTexture(defaultImageUrl ?? '');
  const [targetMeshName, setTargetMeshName] = useState<string | null>(null);

  // Skip invalid textures
  if (!designTextureUrl) designTexture.image = null;
  if (!defaultImageUrl) defaultTexture.image = null;

  useEffect(() => {
    const meshes: string[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child.name);
      }
    });
    
    if (meshes.length > 0) {
      setTargetMeshName(meshes[0]);
    }
  }, [scene]);

  useEffect(() => {
    if (!targetMeshName) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name === targetMeshName) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        if (designTexture) {
          material.map = designTexture;
          designTexture.wrapS = THREE.ClampToEdgeWrapping;
          designTexture.wrapT = THREE.ClampToEdgeWrapping;
          designTexture.flipY = true;
          designTexture.repeat.set(1, 1);
          designTexture.needsUpdate = true;
        } else if (defaultTexture) {
          material.map = defaultTexture;
          defaultTexture.wrapS = THREE.ClampToEdgeWrapping;
          defaultTexture.wrapT = THREE.ClampToEdgeWrapping;
          defaultTexture.flipY = true;
          defaultTexture.repeat.set(1, 1);
          defaultTexture.needsUpdate = true;
        } else {
          material.map = null;
          material.color.set('white');
        }

        material.needsUpdate = true;
      }
    });
  }, [scene, designTexture, defaultTexture, targetMeshName]);

  return <primitive object={scene.clone()} />;
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
      <Canvas camera={{ position: [0.3, 0.2, 0.4], fov: 45 }}
              style={{ background: '#e8bf9b' }}

      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Suspense fallback={null}>
          <Model 
            url={modelUrl} 
            designTextureUrl={designTextureUrl} 
            defaultImageUrl={defaultImageUrl} 
          />
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.0} />
      </Canvas>
      <Loader />
    </>
  );
};

// --- Main Modal Component (Sci-Fi Version) ---
const CustomizationModal = ({ isOpen, onClose, product, selectedVariant }: CustomizationModalProps) => {
  const [designTextureUrl, setDesignTextureUrl] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a variant first.");
      return;
    }
    console.log("🛒 Add to cart:", {
      productId: product.id,
      variantId: selectedVariant.id,
      texture: designTextureUrl,
    });
    // TODO: Call your backend API here
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
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75"></div>
            
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/50 rounded-2xl shadow-2xl border border-cyan-500/30 flex flex-col overflow-hidden">
              {/* Header */}
              <header className="relative flex items-center justify-between p-6 border-b border-cyan-500/30 bg-slate-950/50 backdrop-blur-sm">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1">
                    PRODUCT CUSTOMIZATION
                  </h2>
                  <div className="h-0.5 w-48 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  <p className="text-cyan-300 mt-2 text-sm font-medium tracking-wide">
                    ▸ {product.title}
                  </p>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-12 h-12 flex items-center justify-center text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition-all duration-300 bg-slate-800/50 group"
                >
                  <XMarkIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </header>

              {/* Main Content */}
              <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto">
                {/* 3D Model Viewer */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl overflow-hidden border border-cyan-500/30">
                    {product.model3dUrl ? (
                      <div className="h-[600px] relative">
                        <ModelViewer 
                          modelUrl={product.model3dUrl} 
                          designTextureUrl={designTextureUrl} 
                          defaultImageUrl={product.images[0] || null}
                        />
                        {/* Corner accents */}
                        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50"></div>
                        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-cyan-400/50"></div>
                        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-cyan-400/50"></div>
                        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50"></div>
                        
                        {/* Status indicator */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-cyan-500/30">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          <span className="text-cyan-300 text-xs font-medium tracking-wider">3D PREVIEW ACTIVE</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-[600px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 border-2 border-cyan-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-cyan-400 text-2xl">◈</span>
                          </div>
                          <p className="text-cyan-300/50 font-medium">No 3D model available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls and Design Canvas */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-cyan-300 font-bold text-lg mb-1 tracking-wide">▸ DESIGN INTERFACE</h3>
                    <div className="h-0.5 w-32 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <DesignCanvas 
                      onCanvasUpdate={setDesignTextureUrl}
                    />
                  </div>
                  
                  {/* Add to Cart Button */}
                  <div className="w-full mt-6">
                    <button
                      onClick={handleAddToCart}
                      className="group relative w-full overflow-hidden py-4 rounded-lg font-bold text-lg transition-all duration-300"
                    >
                      {/* Glowing background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-100"></div>
                      
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      
                      {/* Button content */}
                      <div className="relative flex items-center justify-center gap-3">
                        <span className="text-2xl">🛒</span>
                        <span className="text-white tracking-wider">ADD TO CART</span>
                      </div>
                      
                      {/* Border glow */}
                      <div className="absolute inset-0 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
                    </button>
                    
                    {/* Price info if available */}
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