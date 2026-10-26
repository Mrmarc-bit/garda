"use client";

import * as React from "react";
import * as THREE from "three";

interface CyberConstellation3DProps {
  className?: string;
  nodeCount?: number;
  interactive?: boolean;
}

export function CyberConstellation3D({
  className = "",
  nodeCount = 42,
  interactive = true,
}: CyberConstellation3DProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return; // WebGL not available or supported
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 85;

    // Node particle points data
    const nodes: {
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      type: "IT" | "OT" | "GATEWAY";
    }[] = [];

    const bounds = 45;
    for (let i = 0; i < nodeCount; i++) {
      const type = i % 5 === 0 ? "OT" : i % 3 === 0 ? "GATEWAY" : "IT";
      nodes.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * bounds * 1.8,
          (Math.random() - 0.5) * bounds,
          (Math.random() - 0.5) * bounds * 0.8
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.04
        ),
        type,
      });
    }

    // Geometry for points
    const pointsGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    // Color definitions
    const colorOT = new THREE.Color("#FF6B35"); // Safety Orange
    const colorIT = new THREE.Color("#38BDF8"); // Light Cyan/Blue
    const colorGateway = new THREE.Color("#4ADE80"); // Audit Green

    nodes.forEach((node, i) => {
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;

      const chosenColor =
        node.type === "OT" ? colorOT : node.type === "GATEWAY" ? colorGateway : colorIT;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    });

    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    scene.add(pointsMesh);

    // Wireframe Cage in the background
    const cageGeo = new THREE.IcosahedronGeometry(36, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x333333,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    scene.add(cageMesh);

    // Lines geometry for dynamic interconnecting laser links
    const maxLines = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    linesGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });

    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);

    // Mouse movement state
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 14;
      targetY = y * 8;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const linkDistance = 18;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera interpolation
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;
      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(0, 0, 0);

      // Rotate cage slowly
      cageMesh.rotation.y += 0.0015;
      cageMesh.rotation.x += 0.0008;

      // Update positions
      let lineIndex = 0;
      const posArray = pointsGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];
        node.position.add(node.velocity);

        // Bounce on virtual bounds
        if (Math.abs(node.position.x) > bounds * 0.9) node.velocity.x *= -1;
        if (Math.abs(node.position.y) > bounds * 0.5) node.velocity.y *= -1;
        if (Math.abs(node.position.z) > bounds * 0.4) node.velocity.z *= -1;

        posArray[i * 3] = node.position.x;
        posArray[i * 3 + 1] = node.position.y;
        posArray[i * 3 + 2] = node.position.z;

        // Find neighbors to connect lines
        for (let j = i + 1; j < nodeCount; j++) {
          const neighbor = nodes[j];
          const dist = node.position.distanceTo(neighbor.position);

          if (dist < linkDistance) {
            const alpha = 1.0 - dist / linkDistance;

            linePositions[lineIndex * 6] = node.position.x;
            linePositions[lineIndex * 6 + 1] = node.position.y;
            linePositions[lineIndex * 6 + 2] = node.position.z;
            linePositions[lineIndex * 6 + 3] = neighbor.position.x;
            linePositions[lineIndex * 6 + 4] = neighbor.position.y;
            linePositions[lineIndex * 6 + 5] = neighbor.position.z;

            // Gradient colors between nodes
            const c1 = node.type === "OT" ? colorOT : colorIT;
            const c2 = neighbor.type === "OT" ? colorOT : colorGateway;

            lineColors[lineIndex * 6] = c1.r * alpha;
            lineColors[lineIndex * 6 + 1] = c1.g * alpha;
            lineColors[lineIndex * 6 + 2] = c1.b * alpha;
            lineColors[lineIndex * 6 + 3] = c2.r * alpha;
            lineColors[lineIndex * 6 + 4] = c2.g * alpha;
            lineColors[lineIndex * 6 + 5] = c2.b * alpha;

            lineIndex++;
          }
        }
      }

      pointsGeo.attributes.position.needsUpdate = true;
      linesGeo.setDrawRange(0, lineIndex * 2);
      linesGeo.attributes.position.needsUpdate = true;
      linesGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      pointsGeo.dispose();
      pointsMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      renderer.dispose();
    };
  }, [nodeCount, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
