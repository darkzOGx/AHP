"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  title?: string;
}

export function ImageGalleryModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  title = "Image Gallery"
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [zoomScale, setZoomScale] = React.useState(1);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [lastTap, setLastTap] = React.useState(0);
  
  const imageRef = React.useRef<HTMLImageElement>(null);
  const startPosRef = React.useRef({ x: 0, y: 0 });

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
      setZoomScale(1);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        case " ":
          event.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const goToNext = () => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      resetZoom();
    }
  };

  const goToPrevious = () => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      resetZoom();
    }
  };

  const resetZoom = () => {
    setIsZoomed(false);
    setZoomScale(1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    const newScale = Math.min(zoomScale * 1.5, 4);
    setZoomScale(newScale);
    setIsZoomed(newScale > 1);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(zoomScale / 1.5, 1);
    setZoomScale(newScale);
    setIsZoomed(newScale > 1);
    if (newScale === 1) {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      
      // Double tap detection
      const now = Date.now();
      const timeDiff = now - lastTap;
      if (timeDiff < 300 && timeDiff > 0) {
        // Double tap to zoom
        if (isZoomed) {
          resetZoom();
        } else {
          handleZoomIn();
        }
      }
      setLastTap(now);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isZoomed) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPosRef.current.x;
      const deltaY = touch.clientY - startPosRef.current.y;
      
      setDragOffset({ x: deltaX, y: deltaY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isZoomed && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startPosRef.current.x;
      const deltaY = touch.clientY - startPosRef.current.y;
      
      // Horizontal swipe detection for navigation
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
    }
  };

  // Handle mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isZoomed) {
      setIsDragging(true);
      startPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isZoomed) {
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      setDragOffset({ x: deltaX, y: deltaY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // Double click to zoom on desktop
    if (e.detail === 2) {
      if (isZoomed) {
        resetZoom();
      } else {
        handleZoomIn();
      }
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-none w-screen h-screen p-0 bg-black/95 border-none rounded-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Header with controls - Desktop only */}
        <div className="absolute top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2 text-white min-w-0 flex-1">
            <h2 className="text-sm md:text-lg font-semibold truncate">{title}</h2>
            {images.length > 1 && (
              <span className="text-xs md:text-sm text-white/70 whitespace-nowrap">
                {currentIndex + 1}/{images.length}
              </span>
            )}
          </div>

          {/* Desktop: zoom controls and close button */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomScale <= 1}
              className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomScale >= 4}
              className="text-white hover:bg-white/20 h-8 w-8 md:h-10 md:w-10"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            {/* Desktop close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/30 bg-black/50 h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-white/20 hover:border-white/40 transition-all"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>

        {/* Main image container */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <img
            ref={imageRef}
            src={images[currentIndex].includes('storage.googleapis.com') ? `/api/proxy-image?url=${encodeURIComponent(images[currentIndex])}` : images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className={cn(
              "max-w-full max-h-full object-contain transition-transform duration-200 select-none",
              isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
            )}
            style={{
              transform: `scale(${zoomScale}) translate(${dragOffset.x / zoomScale}px, ${dragOffset.y / zoomScale}px)`,
            }}
            onMouseDown={handleMouseDown}
            onClick={handleImageClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400.png";
            }}
          />
        </div>

        {/* Navigation arrows - Mobile responsive */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/30 bg-black/50 h-10 w-10 md:h-12 md:w-12 rounded-full border border-white/20 hover:border-white/40 transition-all"
              disabled={images.length <= 1}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/30 bg-black/50 h-10 w-10 md:h-12 md:w-12 rounded-full border border-white/20 hover:border-white/40 transition-all"
              disabled={images.length <= 1}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </>
        )}

        {/* Thumbnail navigation - Mobile responsive */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 md:p-4">
            <div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide pb-safe">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    resetZoom();
                  }}
                  className={cn(
                    "flex-shrink-0 w-12 h-9 md:w-16 md:h-12 rounded-md overflow-hidden border-2 transition-all",
                    currentIndex === index
                      ? "border-white shadow-lg"
                      : "border-white/30 hover:border-white/60"
                  )}
                >
                  <img
                    src={image.includes('storage.googleapis.com') ? `/api/proxy-image?url=${encodeURIComponent(image)}` : image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400.png";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions overlay - Mobile responsive */}
        {!isZoomed && images.length > 1 && (
          <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-40 text-center text-white/70 text-xs md:text-sm px-4">
            <p className="hidden md:block">Click or double-tap to zoom • Use arrow keys to navigate</p>
            <p className="md:hidden">Double-tap to zoom • Swipe to navigate</p>
          </div>
        )}

        {/* Mobile zoom controls overlay when zoomed */}
        {isZoomed && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/60 rounded-full p-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomScale <= 1}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomScale >= 4}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Mobile close button at bottom - only visible on mobile */}
        <div className="absolute bottom-4 right-4 z-50 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/30 bg-black/50 h-12 w-12 rounded-full border-2 border-white/20 hover:border-white/40 transition-all"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}