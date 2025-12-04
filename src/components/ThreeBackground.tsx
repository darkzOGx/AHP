'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random positions
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 50;

      // Random velocities
      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;

      // Red-ish colors with some white
      const colorChoice = Math.random();
      if (colorChoice > 0.7) {
        // White particles
        colors[i] = 1;
        colors[i + 1] = 1;
        colors[i + 2] = 1;
      } else {
        // Red particles with variations
        colors[i] = 0.8 + Math.random() * 0.2;
        colors[i + 1] = Math.random() * 0.3;
        colors[i + 2] = Math.random() * 0.3;
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create car shapes
    const createCar = (type: 'sedan' | 'suv' | 'truck') => {
      const carGroup = new THREE.Group();

      // Car colors - various automotive colors
      const colors = [
        0xdc2626, // Red
        0xffffff, // White
        0x1f2937, // Dark gray/black
        0x3b82f6, // Blue
        0xef4444, // Bright red
        0x6b7280, // Silver
        0xfbbf24, // Yellow
        0x10b981, // Green
      ];
      const carColor = colors[Math.floor(Math.random() * colors.length)];

      if (type === 'sedan') {
        // Sedan: lower, longer body
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(4, 1.2, 2),
          new THREE.MeshBasicMaterial({ color: carColor, wireframe: true, transparent: true, opacity: 0.2 })
        );
        const roof = new THREE.Mesh(
          new THREE.BoxGeometry(2, 0.8, 1.8),
          new THREE.MeshBasicMaterial({ color: carColor, wireframe: true, transparent: true, opacity: 0.2 })
        );
        roof.position.y = 1;
        carGroup.add(body);
        carGroup.add(roof);
      } else if (type === 'suv') {
        // SUV: taller, boxy
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(4, 1.8, 2.2),
          new THREE.MeshBasicMaterial({ color: carColor, wireframe: true, transparent: true, opacity: 0.2 })
        );
        const roof = new THREE.Mesh(
          new THREE.BoxGeometry(2.5, 1, 2),
          new THREE.MeshBasicMaterial({ color: carColor, wireframe: true, transparent: true, opacity: 0.2 })
        );
        roof.position.y = 1.4;
        carGroup.add(body);
        carGroup.add(roof);
      } else {
        // Truck: longer bed, separate cab
        const bed = new THREE.Mesh(
          new THREE.BoxGeometry(2.5, 1, 2),
          new THREE.MeshBasicMaterial({ color: carColor, wireframe: true, transparent: true, opacity: 0.2 })
        );
        bed.position.x = -0.8;
        const cab = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 1.5, 2),
          new THREE.MeshBasicMaterial({ color: carColor, wireframe: true, transparent: true, opacity: 0.2 })
        );
        cab.position.x = 1;
        carGroup.add(bed);
        carGroup.add(cab);
      }

      return carGroup;
    };

    const cars: THREE.Group[] = [];
    const carCount = 20;
    const carTypes: Array<'sedan' | 'suv' | 'truck'> = ['sedan', 'suv', 'truck'];

    for (let i = 0; i < carCount; i++) {
      const carType = carTypes[Math.floor(Math.random() * carTypes.length)];
      const car = createCar(carType);

      car.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40 - 20
      );

      car.rotation.set(
        Math.random() * Math.PI * 0.2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 0.2
      );

      // Random scale for variety
      const scale = 0.8 + Math.random() * 0.6;
      car.scale.set(scale, scale, scale);

      scene.add(car);
      cars.push(car);
    }

    // Create connecting lines between nearby particles
    const createConnections = () => {
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions: number[] = [];
      const positionsArray = particlesGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const i3 = i * 3;
          const j3 = j * 3;

          const dx = positionsArray[i3] - positionsArray[j3];
          const dy = positionsArray[i3 + 1] - positionsArray[j3 + 1];
          const dz = positionsArray[i3 + 2] - positionsArray[j3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 15) {
            linePositions.push(
              positionsArray[i3], positionsArray[i3 + 1], positionsArray[i3 + 2],
              positionsArray[j3], positionsArray[j3 + 1], positionsArray[j3 + 2]
            );
          }
        }
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      return new THREE.LineSegments(
        lineGeometry,
        new THREE.LineBasicMaterial({
          color: 0xdc2626,
          transparent: true,
          opacity: 0.1,
        })
      );
    };

    let connections = createConnections();
    scene.add(connections);

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let frameCount = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frameCount++;

      // Rotate camera slightly based on mouse
      camera.position.x += (mouse.x * 5 - camera.position.x) * 0.01;
      camera.position.y += (mouse.y * 5 - camera.position.y) * 0.01;
      camera.lookAt(scene.position);

      // Animate particles
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Boundary check and bounce
        if (Math.abs(positions[i]) > 50) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 50) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 25) velocities[i + 2] *= -1;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Update connections every 10 frames for performance
      if (frameCount % 10 === 0) {
        scene.remove(connections);
        connections.geometry.dispose();
        connections = createConnections();
        scene.add(connections);
      }

      // Animate cars - gentle floating and rotation
      cars.forEach((car, index) => {
        // Slow rotation around Y axis (like cars drifting)
        car.rotation.y += 0.002 * (index % 2 === 0 ? 1 : -1);

        // Very subtle tilt
        car.rotation.x += 0.0005 * Math.sin(Date.now() * 0.0005 + index);
        car.rotation.z += 0.0005 * Math.cos(Date.now() * 0.0005 + index);

        // Gentle floating motion
        car.position.y += Math.sin(Date.now() * 0.001 + index) * 0.015;

        // Slow horizontal drift
        car.position.x += Math.sin(Date.now() * 0.0003 + index) * 0.01;
      });

      // Rotate particle system slowly
      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose of geometries and materials
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      connections.geometry.dispose();
      (connections.material as THREE.Material).dispose();

      // Dispose of car geometries and materials
      cars.forEach(car => {
        car.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #f9fafb 50%, #ffffff 100%)'
      }}
    />
  );
}
