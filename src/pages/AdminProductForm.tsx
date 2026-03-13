import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [loading, setLoading] = useState(false);
  
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  
  // Fetch product if editing
  const productData = useQuery(
    api.products.getById,
    id ? { id: id as any } : "skip"
  );

  const [formData, setFormData] = useState({
    product_name: "",
    product_slug: "",
    category: "",
    manufacturer: "",
    price: "",
    price_currency: "USD",
    description: "",
    hub: "ai_workflow" as "ai_workflow" | "intelligent_home" | "hybrid_office",
    status: "active" as "active" | "discontinued" | "upcoming" | "under_review",
    featured_image_url: "",
    is_sponsored: false,
  });

  useEffect(() => {
    if (authLoading || adminLoading) return;

    if (!user) {
      toast.error("Please sign in to access admin panel");
      navigate("/auth");
      return;
    }

    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  useEffect(() => {
    if (productData) {
      setFormData({
        product_name: productData.productName,
        product_slug: productData.productSlug,
        category: productData.category || "",
        manufacturer: productData.manufacturer || "",
        price: productData.price?.toString() || "",
        price_currency: productData.priceCurrency || "USD",
        description: productData.description || "",
        hub: productData.hub as any,
        status: productData.status as any || "active",
        featured_image_url: productData.featuredImageUrl || "",
        is_sponsored: productData.isSponsored || false,
      });
    }
  }, [productData]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      product_name: value,
      product_slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productPayload = {
        productName: formData.product_name,
        productSlug: formData.product_slug,
        category: formData.category || undefined,
        manufacturer: formData.manufacturer || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        priceCurrency: formData.price_currency,
        description: formData.description || undefined,
        hub: formData.hub,
        status: formData.status,
        featuredImageUrl: formData.featured_image_url || undefined,
        isSponsored: formData.is_sponsored,
        productType: "hardware",
        priceModel: "one_time",
        sponsorDisclosed: formData.is_sponsored,
      };

      if (id) {
        await updateProduct({
          id: id as any,
          ...productPayload,
        });
        toast.success("Product updated successfully");
      } else {
        await createProduct(productPayload);
        toast.success("Product created successfully");
      }

      navigate("/admin");
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/admin")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <h1 className="text-4xl font-bold mb-8">
        {id ? "Edit Product" : "Add New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="product_name">Product Name *</Label>
          <Input
            id="product_name"
            value={formData.product_name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_slug">Slug *</Label>
          <Input
            id="product_slug"
            value={formData.product_slug}
            onChange={(e) =>
              setFormData({ ...formData, product_slug: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) =>
                setFormData({ ...formData, manufacturer: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_currency">Currency</Label>
            <Input
              id="price_currency"
              value={formData.price_currency}
              onChange={(e) =>
                setFormData({ ...formData, price_currency: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hub">Hub *</Label>
          <Select
            value={formData.hub}
            onValueChange={(value: any) =>
              setFormData({ ...formData, hub: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai_workflow">AI Workflow</SelectItem>
              <SelectItem value="intelligent_home">Intelligent Home</SelectItem>
              <SelectItem value="hybrid_office">Hybrid Office</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="featured_image_url">Featured Image URL</Label>
          <Input
            id="featured_image_url"
            type="url"
            value={formData.featured_image_url}
            onChange={(e) =>
              setFormData({ ...formData, featured_image_url: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_sponsored"
            checked={formData.is_sponsored}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_sponsored: checked })
            }
          />
          <Label htmlFor="is_sponsored">Sponsored Product</Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update Product" : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
