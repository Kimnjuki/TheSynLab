import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Key, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ApiKeyManagerProps {
  userId: Id<"novaUsers">;
}

export function ApiKeyManager({ userId }: ApiKeyManagerProps) {
  const [name, setName] = useState("");
  const [showNew, setShowNew] = useState<string | null>(null);

  const keys = useQuery(api.apiKeys.listByUser, { userId }) ?? [];
  const create = useMutation(api.apiKeys.create);
  const revoke = useMutation(api.apiKeys.revoke);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Enter a key name");
      return;
    }
    try {
      const { key } = await create({ userId, keyName: name });
      setShowNew(key);
      setName("");
      toast.success("API key created — copy it now, it won't be shown again");
    } catch {
      toast.error("Failed to create key");
    }
  };

  const handleRevoke = async (keyId: Id<"novaApiKeys">) => {
    try {
      await revoke({ keyId });
      toast.success("Key revoked");
    } catch {
      toast.error("Failed to revoke key");
    }
  };

  return (
    <div className="space-y-6">
      {showNew && (
        <Card className="border-green-500">
          <CardContent className="pt-4">
            <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-2">
              ✓ New API key created – copy it now:
            </p>
            <div className="flex gap-2">
              <Input value={showNew} readOnly className="font-mono text-xs" />
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(showNew);
                  toast.success("Copied!");
                }}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This key will not be displayed again.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="sr-only">Key Name</Label>
              <Input
                placeholder="Key name (e.g. My Dashboard)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </div>

          <div className="space-y-2">
            {keys.map((key) => (
              <div
                key={key._id}
                className="border rounded-lg p-3 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{key.keyName}</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {key.apiKeyPrefix}••••••••
                  </p>
                  {key.lastUsedAt && (
                    <p className="text-xs text-muted-foreground">
                      Last used {format(new Date(key.lastUsedAt), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleRevoke(key._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {keys.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No API keys yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
