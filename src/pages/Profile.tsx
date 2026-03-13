import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, DollarSign, Star, Settings } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

export default function Profile() {
  const { user, loading } = useAuth();

  // Get user's reviews from localStorage
  const reviews = user
    ? JSON.parse(localStorage.getItem(`reviews_${user.id}`) || "[]")
    : [];

  // Local storage for favorites, liked setups, and budget configs
  const favorites = user
    ? JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]")
    : [];
  const likedSetups = user
    ? JSON.parse(localStorage.getItem(`liked_setups_${user.id}`) || "[]")
    : [];
  const budgetConfigs = user
    ? JSON.parse(localStorage.getItem(`budget_configs_${user.id}`) || "[]")
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-background to-secondary/5">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Link to="/settings">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="favorites" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="w-4 h-4" />
                Favorites ({favorites?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="likes" className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                Liked Setups ({likedSetups?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="budgets" className="gap-2">
                <DollarSign className="w-4 h-4" />
                Budgets ({budgetConfigs?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <Star className="w-4 h-4" />
                Reviews ({reviews?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites" className="space-y-4 mt-6">
              {!favorites || favorites.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No favorite products yet</p>
                    <Link to="/tools/compare">
                      <Button>Browse Products</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((fav: any) => (
                    <Card key={fav.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {fav.product_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge>{fav.category}</Badge>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {fav.description}
                          </p>
                          <Link to={`/products/${fav.product_slug}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              View Product
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="likes" className="space-y-4 mt-6">
              {!likedSetups || likedSetups.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ThumbsUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No liked setups yet</p>
                    <Link to="/community/setups">
                      <Button>Browse Community Setups</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {likedSetups.map((like: any) => (
                    <Card key={like.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {like.post_title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {like.post_excerpt}
                        </p>
                        <Link to="/community/setups">
                          <Button variant="outline" size="sm" className="w-full mt-4">
                            View Setup
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="budgets" className="space-y-4 mt-6">
              {!budgetConfigs || budgetConfigs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No saved budget configurations</p>
                    <Link to="/tools/budget-calculator">
                      <Button>Create Budget Plan</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {budgetConfigs.map((config: any) => (
                    <Card key={config.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{config.config_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Budget:</span>
                            <span className="font-semibold">
                              ${config.total_budget?.toLocaleString() || 0}
                            </span>
                          </div>
                          <Link to="/tools/budget-calculator">
                            <Button variant="outline" size="sm" className="w-full mt-2">
                              View Configuration
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 mt-6">
              {!reviews || reviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No reviews written yet</p>
                    <Link to="/tools/compare">
                      <Button>Browse Products to Review</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <Card key={review.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {review.nova_products?.product_name}
                            </CardTitle>
                            <div className="flex gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "fill-primary text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <Link to={`/products/${review.nova_products?.product_slug}`}>
                            <Button variant="outline" size="sm">
                              View Product
                            </Button>
                          </Link>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-2">{review.review_title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {review.review_content}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {review.helpful_count || 0} people found this helpful
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
