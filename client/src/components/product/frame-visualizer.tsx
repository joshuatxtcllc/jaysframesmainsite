import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore - OrbitControls types issue
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FrameOption, MatOption, GlassOption } from "@/types";

interface FrameVisualizerProps {
  artwork?: string;
  width: number;
  height: number;
  selectedFrame: FrameOption | null;
  selectedMat: MatOption | null;
  selectedGlass: GlassOption | null;
  onRender?: (dataURL: string) => void;
}

/**
 * FrameVisualizer Component
 * 
 * Core component for the virtual framing application that renders
 * the artwork with selected frame and mat options using Three.js
 */
const FrameVisualizer = ({
  artwork,
  width,
  height,
  selectedFrame,
  selectedMat,
  selectedGlass,
  onRender
}: FrameVisualizerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<THREE.Group | null>(null);
  const artworkRef = useRef<THREE.Mesh | null>(null);
  const matRef = useRef<THREE.Mesh | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      50, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.enablePan = false;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Load and update artwork
  useEffect(() => {
    if (!sceneRef.current || !artwork) return;
    
    setIsLoading(true);
    
    // Remove previous artwork if exists
    if (artworkRef.current) {
      sceneRef.current.remove(artworkRef.current);
      artworkRef.current = null;
    }
    
    // Load artwork texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      artwork,
      (texture) => {
        const aspectRatio = texture.image.width / texture.image.height;
        
        // Create artwork plane
        const artWidth = width / 100; // Convert to meters
        const artHeight = height / 100;
        
        const geometry = new THREE.PlaneGeometry(artWidth, artHeight);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const artworkMesh = new THREE.Mesh(geometry, material);
        
        sceneRef.current?.add(artworkMesh);
        artworkRef.current = artworkMesh;
        
        updateFrame();
        updateMat();
        setIsLoading(false);
        
        // Capture rendered image
        setTimeout(() => {
          if (rendererRef.current) {
            const dataURL = rendererRef.current.domElement.toDataURL('image/png');
            setRenderedImage(dataURL);
            if (onRender) onRender(dataURL);
          }
        }, 500);
      },
      undefined,
      (error) => {
        console.error('Error loading artwork:', error);
        setIsLoading(false);
      }
    );
  }, [artwork, width, height]);

  // Load default placeholder if no artwork provided
  useEffect(() => {
    if (!sceneRef.current || artwork) return;
    
    setIsLoading(true);
    
    // Remove previous artwork if exists
    if (artworkRef.current) {
      sceneRef.current.remove(artworkRef.current);
      artworkRef.current = null;
    }
    
    // Create a default placeholder
    const artWidth = width / 100; // Convert to meters
    const artHeight = height / 100;
    
    const geometry = new THREE.PlaneGeometry(artWidth, artHeight);
    
    // Create a canvas for the placeholder texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = "#f8f8f8";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#aaaaaa";
      context.font = "bold 48px Arial";
      context.textAlign = "center";
      context.fillText("Your Artwork Here", canvas.width / 2, canvas.height / 2);
      context.font = "32px Arial";
      context.fillText(`${width}" × ${height}"`, canvas.width / 2, canvas.height / 2 + 60);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const artworkMesh = new THREE.Mesh(geometry, material);
    
    sceneRef.current.add(artworkMesh);
    artworkRef.current = artworkMesh;
    
    updateFrame();
    updateMat();
    setIsLoading(false);
    
  }, [sceneRef.current, artwork, width, height]);

  // Update frame when selection changes
  const updateFrame = () => {
    if (!sceneRef.current || !artworkRef.current || !selectedFrame) return;
    
    // Remove previous frame if exists
    if (frameRef.current) {
      sceneRef.current.remove(frameRef.current);
      frameRef.current = null;
    }
    
    // @ts-ignore - Three.js geometry parameters typing issue
    const artworkWidth = artworkRef.current.geometry.parameters.width;
    // @ts-ignore - Three.js geometry parameters typing issue
    const artworkHeight = artworkRef.current.geometry.parameters.height;
    
    // Calculate frame dimensions
    const frameThickness = 0.05; // 5cm thickness
    const frameWidth = artworkWidth + frameThickness * 2;
    const frameHeight = artworkHeight + frameThickness * 2;
    const frameDepth = 0.03; // 3cm depth
    
    // Create frame
    const frame = new THREE.Group();
    
    // Convert color to hex if it's a CSS color name or other format
    const frameColor = new THREE.Color(selectedFrame.color);
    
    // Create frame material
    const frameMaterial = new THREE.MeshStandardMaterial({ 
      color: frameColor,
      roughness: 0.7,
      metalness: 0.2
    });
    
    // Create frame sides
    // Top bar
    const topGeometry = new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth);
    const topMesh = new THREE.Mesh(topGeometry, frameMaterial);
    topMesh.position.y = artworkHeight / 2 + frameThickness / 2;
    topMesh.position.z = -frameDepth / 2;
    frame.add(topMesh);
    
    // Bottom bar
    const bottomGeometry = new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth);
    const bottomMesh = new THREE.Mesh(bottomGeometry, frameMaterial);
    bottomMesh.position.y = -artworkHeight / 2 - frameThickness / 2;
    bottomMesh.position.z = -frameDepth / 2;
    frame.add(bottomMesh);
    
    // Left bar
    const leftGeometry = new THREE.BoxGeometry(frameThickness, frameHeight - frameThickness * 2, frameDepth);
    const leftMesh = new THREE.Mesh(leftGeometry, frameMaterial);
    leftMesh.position.x = -artworkWidth / 2 - frameThickness / 2;
    leftMesh.position.z = -frameDepth / 2;
    frame.add(leftMesh);
    
    // Right bar
    const rightGeometry = new THREE.BoxGeometry(frameThickness, frameHeight - frameThickness * 2, frameDepth);
    const rightMesh = new THREE.Mesh(rightGeometry, frameMaterial);
    rightMesh.position.x = artworkWidth / 2 + frameThickness / 2;
    rightMesh.position.z = -frameDepth / 2;
    frame.add(rightMesh);
    
    sceneRef.current.add(frame);
    frameRef.current = frame;
    
    // Adjust camera to frame the entire composition
    if (cameraRef.current) {
      const fieldOfViewRadians = cameraRef.current.fov * (Math.PI / 180);
      const height = Math.max(frameHeight, frameWidth) * 1.2; // Add 20% margin
      const distance = height / (2 * Math.tan(fieldOfViewRadians / 2));
      cameraRef.current.position.z = distance;
      cameraRef.current.lookAt(0, 0, 0);
    }
  };
  
  // Update mat when configuration changes
  const updateMat = () => {
    if (!sceneRef.current || !artworkRef.current || !selectedMat) return;
    
    // Remove previous mat if exists
    if (matRef.current) {
      sceneRef.current.remove(matRef.current);
      matRef.current = null;
    }
    
    // @ts-ignore - Three.js geometry parameters typing issue
    const artworkWidth = artworkRef.current.geometry.parameters.width;
    // @ts-ignore - Three.js geometry parameters typing issue
    const artworkHeight = artworkRef.current.geometry.parameters.height;
    
    // Calculate mat dimensions (standard matting is typically 2-4 inches)
    const matWidth = 0.05; // 5cm mat width
    
    const totalMatWidth = artworkWidth + matWidth * 2;
    const totalMatHeight = artworkHeight + matWidth * 2;
    
    // Get mat color
    const matColor = new THREE.Color(selectedMat.color);
    
    // Create mat geometry
    const matGeometry = new THREE.PlaneGeometry(totalMatWidth, totalMatHeight);
    const matMaterial = new THREE.MeshBasicMaterial({ color: matColor });
    const mat = new THREE.Mesh(matGeometry, matMaterial);
    
    // Position mat behind artwork
    mat.position.z = -0.001;
    
    sceneRef.current.add(mat);
    matRef.current = mat;
  };
  
  // Update frame when selection changes
  useEffect(() => {
    if (sceneRef.current && artworkRef.current) {
      updateFrame();
    }
  }, [selectedFrame]);
  
  // Update mat when configuration changes
  useEffect(() => {
    if (sceneRef.current && artworkRef.current) {
      updateMat();
    }
  }, [selectedMat]);
  
  return (
    <div className="frame-visualizer">
      <div 
        className="visualizer-container w-full h-[400px] rounded-lg overflow-hidden shadow-md" 
        ref={mountRef}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            <p className="ml-3 text-primary">Loading visualization...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrameVisualizer;