import { useState } from "react";
import { Power, Lightbulb, Thermometer, Lock, Camera, Speaker, Fan } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SmartHomeToggleProps {
  deviceType: 'light' | 'thermostat' | 'lock' | 'camera' | 'speaker' | 'fan';
  name: string;
  initialState?: boolean;
  value?: number;
  onToggle?: (isOn: boolean) => void;
  onValueChange?: (value: number) => void;
}

const SmartHomeToggle = ({
  deviceType,
  name,
  initialState = false,
  value = 0,
  onToggle,
  onValueChange,
}: SmartHomeToggleProps) => {
  const [isOn, setIsOn] = useState(initialState);
  const [currentValue, setCurrentValue] = useState(value);

  const getIcon = () => {
    switch (deviceType) {
      case 'light': return Lightbulb;
      case 'thermostat': return Thermometer;
      case 'lock': return Lock;
      case 'camera': return Camera;
      case 'speaker': return Speaker;
      case 'fan': return Fan;
    }
  };

  const getValueLabel = () => {
    switch (deviceType) {
      case 'light': return `${currentValue}%`;
      case 'thermostat': return `${currentValue}°F`;
      case 'speaker': return `${currentValue}%`;
      case 'fan': return `Speed ${currentValue}`;
      default: return '';
    }
  };

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle?.(newState);
    toast.success(`${name} turned ${newState ? 'on' : 'off'}`);
  };

  const Icon = getIcon();

  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group",
        "hover:shadow-lg active:scale-[0.98]",
        isOn
          ? "bg-primary/10 border-primary shadow-md"
          : "bg-card border-border hover:border-primary/30"
      )}
      onClick={handleToggle}
    >
      {/* Glow effect when on */}
      {isOn && (
        <div className="absolute inset-0 rounded-xl bg-primary/5 animate-pulse-glow" />
      )}
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300",
              isOn
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted text-muted-foreground group-hover:bg-muted/80"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className={cn(
              "text-sm transition-colors",
              isOn ? "text-primary" : "text-muted-foreground"
            )}>
              {isOn ? (getValueLabel() || 'On') : 'Off'}
            </p>
          </div>
        </div>

        {/* Power indicator */}
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
            isOn
              ? "bg-success text-success-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Power className="h-5 w-5" />
        </div>
      </div>

      {/* Value slider (for dimmable devices) */}
      {isOn && ['light', 'thermostat', 'speaker', 'fan'].includes(deviceType) && (
        <div
          className="mt-4 pt-3 border-t border-primary/20"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="range"
            min={deviceType === 'thermostat' ? 60 : 0}
            max={deviceType === 'thermostat' ? 85 : 100}
            value={currentValue}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setCurrentValue(val);
              onValueChange?.(val);
            }}
            className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      )}
    </div>
  );
};

export default SmartHomeToggle;
