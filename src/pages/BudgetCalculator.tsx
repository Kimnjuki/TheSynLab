import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { id: "productivity", label: "Productivity Software", priority: 1 },
  { id: "smart_home", label: "Smart Home Devices", priority: 2 },
  { id: "desk_hardware", label: "Desk Hardware", priority: 3 },
  { id: "audio_video", label: "Audio/Video Equipment", priority: 4 },
  { id: "networking", label: "Networking", priority: 5 },
];

export default function BudgetCalculator() {
  const [budget, setBudget] = useState([2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetName, setBudgetName] = useState("");
  
  const { products } = useProducts({
    priceRange: [0, budget[0]],
    categories: selectedCategories,
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const recommendedProducts = products?.slice(0, 6) || [];
  const totalEstimate = recommendedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const remainingBudget = budget[0] - totalEstimate;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Budget Calculator
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Plan your perfect setup with our intelligent budget calculator. 
              Get personalized recommendations based on your budget and priorities.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Budget Configuration */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Your Budget</CardTitle>
                  <CardDescription>Configure your setup budget and priorities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget-name">Configuration Name</Label>
                    <Input
                      id="budget-name"
                      placeholder="My Dream Setup"
                      value={budgetName}
                      onChange={(e) => setBudgetName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Total Budget</Label>
                      <span className="text-2xl font-bold text-primary">
                        ${budget[0].toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      min={100}
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$100</span>
                      <span>$10,000</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Select Categories</Label>
                    {CATEGORIES.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                        />
                        <label
                          htmlFor={category.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Total</span>
                      <span className="font-semibold">${totalEstimate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className={`font-semibold ${remainingBudget < 0 ? 'text-destructive' : 'text-primary'}`}>
                        ${Math.abs(remainingBudget).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full">Save Configuration</Button>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Recommended Products</h2>
                <p className="text-muted-foreground">
                  Based on your budget of ${budget[0].toLocaleString()} and selected categories
                </p>
              </div>

              {selectedCategories.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      Select at least one category to see recommendations
                    </p>
                  </CardContent>
                </Card>
              ) : recommendedProducts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No products found matching your criteria. Try adjusting your budget or categories.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {recommendedProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{product.product_name}</h3>
                              <Badge variant="secondary">{product.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {product.description?.slice(0, 150)}...
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Price: </span>
                                <span className="font-semibold text-primary">
                                  ${product.price?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {product.featured_image_url && (
                            <img
                              src={product.featured_image_url}
                              alt={product.product_name}
                              className="w-24 h-24 object-cover rounded"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {remainingBudget < 0 && (
                <Card className="border-destructive">
                  <CardContent className="p-6">
                    <p className="text-destructive font-semibold">
                      ⚠️ You're over budget by ${Math.abs(remainingBudget).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Consider increasing your budget or removing some products from your selection.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
