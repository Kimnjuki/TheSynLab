import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Database, Loader2, Link2, Bot, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AffiliatePriceDashboard } from "@/components/admin/AffiliatePriceDashboard";
import { MLJobMonitor } from "@/components/admin/MLJobMonitor";
import { SecurityAuditLog } from "@/components/admin/SecurityAuditLog";
import { RedirectManager } from "@/components/admin/RedirectManager";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedingCompetitive, setSeedingCompetitive] = useState(false);
  const convex = useConvex();
  const seedCompetitive = useMutation(api.seedCompetitiveProducts.seedCompetitiveProducts);

  // Convex queries
  const products = useQuery(api.products.list, { status: "active" });
  const deleteProduct = useMutation(api.products.remove);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct({ id: id as any });
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleSeedCompetitiveProducts = async () => {
    setSeedingCompetitive(true);
    try {
      const result = await seedCompetitive({}) as any;
      toast.success(
        `Seeded ${result?.productsInserted ?? 0} products + ${result?.scoresInserted ?? 0} scores. Skipped: ${result?.skipped ?? 0} existing.`
      );
    } catch (error) {
      toast.error("Failed to seed competitive products.");
    } finally {
      setSeedingCompetitive(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      // Use dynamic mutation call for seed module
      const results = await convex.mutation("seed:seedAll" as any, {});
      console.log("Seed results:", results);
      
      const seededTables = Object.entries(results || {})
        .filter(([, value]: [string, any]) => value?.seeded)
        .map(([key]) => key);
      
      if (seededTables.length > 0) {
        toast.success(`Database seeded: ${seededTables.join(", ")}`);
      } else {
        toast.info("Database already seeded with all data");
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      toast.error("Failed to seed database. Run 'npx convex dev' in Git Bash first.");
    } finally {
      setSeeding(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const loading = products === undefined;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <Tabs defaultValue="products">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="affiliate" className="gap-1">
            <Link2 className="h-3 w-3" />Affiliate Prices
          </TabsTrigger>
          <TabsTrigger value="ml" className="gap-1">
            <Bot className="h-3 w-3" />ML Jobs
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1">
            <Shield className="h-3 w-3" />Security
          </TabsTrigger>
          <TabsTrigger value="redirects" className="gap-1">
            <Link2 className="h-3 w-3" />Redirects
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Moderation and Quality</CardTitle>
              <CardDescription>
                Review user-reported forum content and ad-readiness audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/admin/moderation">Open Moderation Queue</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/content-quality">Open Content Quality Audits</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/seo-opportunities">Open SEO Opportunities</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Management
              </CardTitle>
              <CardDescription>
                Seed the Convex database with initial products, automation templates, and policy rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSeedDatabase} disabled={seeding}>
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Seed Sample Data
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleSeedCompetitiveProducts}
              disabled={seedingCompetitive}
            >
              {seedingCompetitive ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding 40 products…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Seed 40 Competitive Products
                </>
              )}
            </Button>
          </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Product Management</h2>
            <Button onClick={() => navigate("/admin/products/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="bg-card rounded-lg border">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(products || []).map((product: any) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        {product.featuredImageUrl ? (
                          <img
                            src={product.featuredImageUrl}
                            alt={product.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.productName}</TableCell>
                      <TableCell>{product.category || "—"}</TableCell>
                      <TableCell>
                        {product.price
                          ? `${product.priceCurrency || "$"}${product.price.toFixed(2)}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/admin/products/${product._id}/edit`)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(product._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="affiliate"><AffiliatePriceDashboard /></TabsContent>
        <TabsContent value="ml"><MLJobMonitor /></TabsContent>
        <TabsContent value="security"><SecurityAuditLog /></TabsContent>
        <TabsContent value="redirects"><RedirectManager /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
