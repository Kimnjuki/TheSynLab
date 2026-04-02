import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  onSave: (name: string) => void;
  disabled?: boolean;
};

export function FilterPresetSaver({ onSave, disabled }: Props) {
  const [name, setName] = useState("");
  return (
    <div className="space-y-2 rounded-lg border p-3">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Preset name" aria-label="Preset name" />
      <Button
        size="sm"
        disabled={disabled || !name.trim()}
        onClick={() => {
          onSave(name.trim());
          setName("");
        }}
      >
        Save Preset
      </Button>
    </div>
  );
}
