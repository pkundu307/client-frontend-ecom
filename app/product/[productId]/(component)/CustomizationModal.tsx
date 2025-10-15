"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, OrbitControls, Loader, useTexture } from '@react-three/drei';
import dynamic from 'next/dynamic';
import Image from "next/image"; // Make sure Image is imported

// Dynamically import DesignCanvas to prevent SSR/hydration issues
const DesignCanvas = dynamic(() => import('./DesignCanvas'), {
  ssr: false,
  loading: () => <div className="w-[420px] h-[370px] bg-gray-100 animate-pulse rounded-md" />
});

// --- TYPES ---
interface ProductDetails {
  id: string;
  title: string;
  images: string[];
  model3dUrl: string | null;
  customizationConfig: any | null;
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

// --- 3D Model Component (Updated to handle default image) ---
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
  
  // Load both potential textures
  const designTexture = designTextureUrl ? useTexture(designTextureUrl) : null;
  const defaultTexture = defaultImageUrl ? useTexture(defaultImageUrl) : null;
  
  const [targetMeshName, setTargetMeshName] = useState<string | null>(null);

  // Find all meshes and set the first one as the target
  useEffect(() => {
    const meshes: string[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child.name);
      }
    });
    
    if (meshes.length > 0) {
      console.log("Setting target mesh to:", meshes[0]);
      setTargetMeshName(meshes[0]);
    }
  }, [scene]);

  // Apply the correct texture based on priority
  useEffect(() => {
    if (!targetMeshName) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name === targetMeshName) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        // Priority: 1. Custom Design, 2. Default Image, 3. White Color
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
          material.map = null; // Clear any old texture
          material.color.set('white');
        }

        material.needsUpdate = true;
      }
    });
  }, [scene, designTexture, defaultTexture, targetMeshName]);

  return <primitive object={scene.clone()} />;
};


// --- 3D Viewer Component (Updated to accept default image) ---
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
      <Canvas camera={{ position: [0.3, 0.2, 0.4], fov: 45 }}>
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


// --- Main Modal Component (Updated to pass default image) ---
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl text-blue-950 font-bold">Customize: {product.title}</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto">
              {/* 3D Model Viewer */}
              <div className="bg-gray-100 rounded-lg overflow-hidden relative">
                {product.model3dUrl ? (
                  <ModelViewer 
                    modelUrl={product.model3dUrl} 
                    designTextureUrl={designTextureUrl} 
                    // Pass the product's first image as the default
                    defaultImageUrl={"https://png.pngtree.com/thumb_back/fh260/background/20210206/pngtree-blue-green-glow-light-effect-blur-background-image_556767.jpg" }
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No 3D model available</p>
                  </div>
                )}
              </div>

              {/* Controls and Design Canvas */}
              <div className="flex flex-col items-center">
                <h3 className="font-semibold text-gray-800 mb-2">Design Your Product</h3>
                <DesignCanvas onCanvasUpdate={setDesignTextureUrl} />
                
                {/* Add to Cart Button */}
                <div className="w-full mt-auto pt-6">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    🛒 Add to Cart
                  </button>
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