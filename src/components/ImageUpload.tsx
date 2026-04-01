import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  preview?: string;
  onClearImage?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  preview,
  onClearImage
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  }, [onImageUpload]);

  if (preview) {
    return (
      <Card className="relative overflow-hidden bg-gradient-nature border-primary/30 shadow-lifted group animate-fade-in-scale">
        <div className="aspect-video relative">
          <img
            src={preview}
            alt="Uploaded plant"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-soft hover:scale-110 transition-all duration-300"
            onClick={onClearImage}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-white text-sm font-medium">Ready for analysis</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`border-2 border-dashed transition-all duration-500 cursor-pointer relative overflow-hidden group ${
        dragActive
          ? 'border-primary bg-primary/10 shadow-glow scale-102'
          : 'border-muted-foreground/30 hover:border-primary/60 bg-gradient-nature/60 hover:shadow-soft'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-16 h-16 bg-primary rounded-full animate-float"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 bg-accent rounded-full animate-wave"></div>
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-success rounded-full animate-pulse"></div>
      </div>
      
      <div className="flex flex-col items-center justify-center p-12 relative z-10">
        <div className="mb-6 p-6 bg-gradient-primary/15 rounded-full animate-float group-hover:scale-110 transition-transform duration-500 shadow-soft">
          <Camera className="h-12 w-12 text-primary group-hover:text-primary-glow transition-colors duration-300" />
        </div>
        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            Upload a photo of your tomato plant
          </p>
          <p className="text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
            Drag and drop or click to browse
          </p>
          <p className="text-sm text-muted-foreground/80 mt-2">
            Supports JPG, PNG, WebP • Max 10MB
          </p>
        </div>
        <Button variant="upload" size="lg" className="group-hover:scale-105 transition-all duration-300" onClick={() => fileInputRef.current?.click()} type="button">
          <Upload className="h-5 w-5" />
          Choose Photo
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </Card>
  );
};