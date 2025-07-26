import { useState, useRef } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onImageRemove: () => void;
  isDisabled?: boolean;
}

export const ImageUpload = ({ onImageSelect, selectedImage, onImageRemove, isDisabled }: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="medical-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-accent/20">
          <FileImage className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Medical Image Analysis</h3>
          <p className="text-sm text-muted-foreground">Upload X-rays, scans, or medical images</p>
        </div>
      </div>

      {!selectedImage ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            dragOver 
              ? 'border-primary bg-primary/5 medical-glow' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!isDisabled ? triggerFileInput : undefined}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">Drop your medical image here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
          <Button 
            variant="outline" 
            className="rounded-xl"
            disabled={isDisabled}
            onClick={triggerFileInput}
          >
            Choose File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isDisabled}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden glass-effect p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground truncate">
                {selectedImage.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onImageRemove}
              className="h-8 w-8 p-0 hover:bg-destructive/20 rounded-lg"
              disabled={isDisabled}
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          
          <div className="relative rounded-lg overflow-hidden bg-muted/20">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Medical scan preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</span>
            <span className="px-2 py-1 rounded-md bg-primary/20 text-primary">
              {selectedImage.type.split('/')[1].toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};