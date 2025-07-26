import { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download, Maximize2, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface MedicalImageViewerProps {
  imageUrl: string;
  imageName?: string;
  onClose?: () => void;
}

export const MedicalImageViewer = ({ imageUrl, imageName, onClose }: MedicalImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageName || 'medical-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Card className="w-full h-full medical-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {imageName || 'Medical Image Viewer'}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-2"
            >
              <Download className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-8 px-2"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-card/50 rounded-lg">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 400}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 min-w-32">
            <span className="text-xs text-muted-foreground">Zoom:</span>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={25}
              max={400}
              step={5}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {zoom}%
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            className="h-8 w-8 p-0"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 px-3 text-xs"
          >
            Reset
          </Button>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Move className="h-3 w-3" />
            Click & drag to pan
          </div>
        </div>

        {/* Image Container */}
        <div 
          className="relative overflow-hidden rounded-lg bg-black/50 border border-border"
          style={{ height: '400px' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt={imageName || 'Medical image'}
            className="absolute inset-0 object-contain transition-transform duration-200 cursor-move select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              maxWidth: 'none',
              maxHeight: 'none',
              width: '100%',
              height: '100%'
            }}
            onMouseDown={handleMouseDown}
            draggable={false}
          />
          
          {/* Image info overlay */}
          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-foreground">
            Zoom: {zoom}% | Rotation: {rotation}°
          </div>
        </div>

        {/* Image Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">File Name:</p>
            <p className="font-medium break-all">{imageName || 'Unknown'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">View Controls:</p>
            <p className="text-xs text-muted-foreground">
              Scroll to zoom, click & drag to pan
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};