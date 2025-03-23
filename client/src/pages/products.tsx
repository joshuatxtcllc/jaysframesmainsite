import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ProductCard } from "@/components/product/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Chatbot from "@/components/ui/chatbot";

const Products = () => {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get category from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  // Fetch all products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["/api/products"],
  });

  // Filter products by category if selected
  const filteredProducts = selectedCategory
    ? products.filter((product: any) => product.category === selectedCategory)
    : products;

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((product: any) => product.category))
  );

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
            Our Framing Products
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Browse our collection of custom frames, shadowboxes, and our patented
            Moonmount™ preservation system.
          </p>
        </div>

        <Tabs 
          defaultValue={selectedCategory || "all"} 
          onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          className="mb-8"
        >
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category === "frame" 
                    ? "Custom Frames" 
                    : category === "shadowbox"
                    ? "Shadowboxes"
                    : category === "moonmount"
                    ? "Moonmounts™"
                    : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-neutral-500">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-error">Failed to load products. Please try again later.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-neutral-500">Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-error">Failed to load products. Please try again later.</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-500">No products found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Custom Framing CTA */}
        {selectedCategory !== "frame" && (
          <div className="mt-16 bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">
              Looking for Custom Framing?
            </h2>
            <p className="text-neutral-500 mb-6 max-w-2xl mx-auto">
              Design your perfect frame with our AI-powered framing assistant. 
              Get personalized recommendations based on your artwork.
            </p>
            <Button 
              className="bg-secondary hover:bg-secondary-light text-white"
              asChild
            >
              <a href="/custom-framing">Start Custom Framing</a>
            </Button>
          </div>
        )}
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Products;
