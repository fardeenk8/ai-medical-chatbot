import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface BodyPart {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BodyDiagramProps {
  onBodyPartSelect: (bodyPart: string) => void;
  selectedParts: string[];
}

const bodyParts: BodyPart[] = [
  { id: 'head', name: 'Head', x: 45, y: 5, width: 10, height: 15 },
  { id: 'neck', name: 'Neck', x: 47, y: 20, width: 6, height: 5 },
  { id: 'chest', name: 'Chest', x: 35, y: 25, width: 30, height: 20 },
  { id: 'abdomen', name: 'Abdomen', x: 40, y: 45, width: 20, height: 20 },
  { id: 'left-arm', name: 'Left Arm', x: 15, y: 25, width: 15, height: 35 },
  { id: 'right-arm', name: 'Right Arm', x: 70, y: 25, width: 15, height: 35 },
  { id: 'left-leg', name: 'Left Leg', x: 35, y: 65, width: 12, height: 30 },
  { id: 'right-leg', name: 'Right Leg', x: 53, y: 65, width: 12, height: 30 },
];

export const BodyDiagram = ({ onBodyPartSelect, selectedParts }: BodyDiagramProps) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const handlePartClick = (partId: string) => {
    onBodyPartSelect(partId);
  };

  const clearSelection = () => {
    selectedParts.forEach(part => onBodyPartSelect(part));
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-foreground">
          Interactive Body Diagram
          {selectedParts.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSelection}
              className="text-xs"
            >
              Clear ({selectedParts.length})
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-96 mx-auto bg-card/50 rounded-lg overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full cursor-pointer"
            style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.3))' }}
          >
            {/* Body outline */}
            <defs>
              <radialGradient id="bodyGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.3)" />
              </radialGradient>
            </defs>
            
            {bodyParts.map((part) => {
              const isSelected = selectedParts.includes(part.id);
              const isHovered = hoveredPart === part.id;
              
              return (
                <g key={part.id}>
                  <rect
                    x={part.x}
                    y={part.y}
                    width={part.width}
                    height={part.height}
                    rx="2"
                    fill={
                      isSelected 
                        ? 'hsl(var(--primary) / 0.8)' 
                        : isHovered 
                          ? 'hsl(var(--primary) / 0.4)' 
                          : 'url(#bodyGradient)'
                    }
                    stroke={
                      isSelected || isHovered 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--border))'
                    }
                    strokeWidth="0.5"
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredPart(part.id)}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={() => handlePartClick(part.id)}
                  />
                  {(isSelected || isHovered) && (
                    <text
                      x={part.x + part.width / 2}
                      y={part.y + part.height / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xs fill-primary-foreground font-semibold"
                      style={{ fontSize: '3px', pointerEvents: 'none' }}
                    >
                      {part.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        
        {selectedParts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Selected areas:</p>
            <div className="flex flex-wrap gap-2">
              {selectedParts.map((partId) => {
                const part = bodyParts.find(p => p.id === partId);
                return (
                  <Button
                    key={partId}
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePartClick(partId)}
                    className="text-xs h-6 px-2"
                  >
                    {part?.name} ×
                  </Button>
                );
              })}
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          Click on body parts to indicate areas of concern
        </p>
      </CardContent>
    </Card>
  );
};