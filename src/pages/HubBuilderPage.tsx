import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { GripVertical, Plus, Trash2, Save } from "lucide-react";

type CanvasItem = {
  productId: Id<"novaProducts">;
  name: string;
  slug: string;
};

export default function HubBuilderPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [canvas, setCanvas] = useState<CanvasItem[]>([]);
  const [configName, setConfigName] = useState("My setup");

  const allProducts = useQuery(api.products.list, { status: "active" }) ?? [];
  const saveConfig = useMutation(api.hubBuilder.saveConfig);

  const filtered =
    search.length < 2
      ? []
      : allProducts
          .filter((p: { productName?: string }) =>
            p.productName?.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 8);

  const add = (p: {
    _id: Id<"novaProducts">;
    productName: string;
    productSlug: string;
  }) => {
    if (canvas.some((c) => c.productId === p._id)) return;
    if (canvas.length >= 12) {
      toast.info("Canvas supports up to 12 devices in this preview.");
      return;
    }
    setCanvas((c) => [
      ...c,
      { productId: p._id, name: p.productName, slug: p.productSlug },
    ]);
    setSearch("");
  };

  const remove = (id: Id<"novaProducts">) => {
    setCanvas((c) => c.filter((x) => x.productId !== id));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Sign in to save your hub configuration.");
      return;
    }
    if (canvas.length === 0) {
      toast.error("Add at least one device.");
      return;
    }
    try {
      await saveConfig({
        userId: user.id,
        name: configName,
        devices: canvas.map((c) => ({
          productId: c.productId,
          name: c.name,
          slug: c.slug,
        })),
      });
      toast.success("Saved to userSmartHomeConfigs");
    } catch (e) {
      toast.error("Save failed");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Multi-device hub builder"
        description="Drag-free canvas: add devices, then save to your SynLab smart home config."
        canonical="/tools/hub-builder"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-2 mb-6 text-sm">
          <Link to="/tools/compatibility" className="text-primary hover:underline">
            ← Compatibility checker
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/tools/compatibility-leaderboard" className="text-primary hover:underline">
            Leaderboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2">Multi-device hub builder</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Search products and add them to your canvas. This implements COMPAT-001 (MVP): a device list you can persist to{" "}
          <code className="text-xs">userSmartHomeConfigs</code> for authenticated users.
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Add devices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {filtered.map(
                  (p: {
                    _id: Id<"novaProducts">;
                    productName: string;
                    productSlug: string;
                  }) => (
                  <button
                    key={p._id}
                    type="button"
                    className="w-full text-left text-sm p-2 rounded border hover:bg-accent flex justify-between items-center gap-2"
                    onClick={() => add(p)}
                  >
                    <span className="truncate">{p.productName}</span>
                    <Plus className="h-4 w-4 shrink-0" />
                  </button>
                )
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                Canvas ({canvas.length})
              </CardTitle>
              <div className="flex gap-2 items-center">
                <Input
                  className="w-48 h-9"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                />
                <Button size="sm" className="gap-1" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {canvas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No devices yet — search and add from the left panel.
                </p>
              ) : (
                <ul className="grid sm:grid-cols-2 gap-2">
                  {canvas.map((c) => (
                    <li
                      key={c.productId}
                      className="flex items-center justify-between border rounded-lg p-3 text-sm"
                    >
                      <Link to={`/products/${c.slug}`} className="font-medium hover:underline truncate">
                        {c.name}
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => remove(c.productId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Next step: pair-wise compatibility scoring from{" "}
                <code className="text-[10px]">apiCompatibilityMatrix</code> /{" "}
                <code className="text-[10px]">novaEcosystemCompatibility</code> on the full graph.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
