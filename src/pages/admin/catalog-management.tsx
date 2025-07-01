
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FrameOption } from "@/types";

const CatalogManagement = () => {
  const queryClient = useQueryClient();
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Fetch Larson Juhl catalog
  const { data: frames = [], isLoading: isLoadingFrames } = useQuery({
    queryKey: ["/api/catalog/larson-juhl"],
    queryFn: async () => {
      const response = await fetch("/api/catalog/larson-juhl");
      return response.json();
    }
  });

  // Fetch Larson Juhl collections
  const { data: collections = [], isLoading: isLoadingCollections } = useQuery({
    queryKey: ["/api/catalog/larson-juhl/collections"],
    queryFn: async () => {
      const response = await fetch("/api/catalog/larson-juhl/collections");
      return response.json();
    }
  });

  // Filtered frames by collection
  const filteredFrames = selectedCollection 
    ? frames.filter((frame: FrameOption) => {
        const details = frame.details as any;
        return details && details.collection === selectedCollection;
      })
    : frames;

  // Mutation for importing catalog
  const importCatalogMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/catalog/larson-juhl/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/catalog/larson-juhl"] });
      queryClient.invalidateQueries({ queryKey: ["/api/catalog/larson-juhl/collections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/frame-options"] });
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Larson Juhl Catalog Management</h1>
          <p className="text-muted-foreground">
            Manage frame options from the Larson Juhl catalog
          </p>
        </div>
        <Button 
          onClick={() => importCatalogMutation.mutate()}
          disabled={importCatalogMutation.isPending}
        >
          {importCatalogMutation.isPending 
            ? "Importing..." 
            : "Import Larson Juhl Catalog"}
        </Button>
      </div>

      {importCatalogMutation.isSuccess && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">
            {importCatalogMutation.data.message}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <Tabs 
          defaultValue="all" 
          onValueChange={(value) => setSelectedCollection(value === "all" ? null : value)}
          className="w-full"
        >
          <div className="mb-6 overflow-x-auto">
            <TabsList className="inline-flex h-10">
              <TabsTrigger value="all">All Collections</TabsTrigger>
              {collections.map((collection: string) => (
                <TabsTrigger key={collection} value={collection}>
                  {collection}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingFrames ? (
                <p>Loading frames...</p>
              ) : filteredFrames.length === 0 ? (
                <p>No frames found. Import the Larson Juhl catalog to get started.</p>
              ) : (
                filteredFrames.map((frame: FrameOption) => (
                  <FrameCard key={frame.id} frame={frame} />
                ))
              )}
            </div>
          </TabsContent>

          {collections.map((collection: string) => (
            <TabsContent key={collection} value={collection} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingFrames ? (
                  <p>Loading frames...</p>
                ) : filteredFrames.length === 0 ? (
                  <p>No frames found in this collection.</p>
                ) : (
                  filteredFrames.map((frame: FrameOption) => (
                    <FrameCard key={frame.id} frame={frame} />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

interface FrameCardProps {
  frame: FrameOption;
}

const FrameCard = ({ frame }: FrameCardProps) => {
  const details = frame.details as any;
  
  return (
    <Card>
      <div 
        className="h-40 bg-cover bg-center border-b" 
        style={{ 
          backgroundColor: frame.color,
          backgroundImage: frame.imageUrl ? `url(${frame.imageUrl})` : undefined
        }}
      />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{frame.name}</CardTitle>
          <Badge variant="outline">{frame.material}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">SKU:</span> {details?.sku || "N/A"}
          </div>
          <div>
            <span className="text-muted-foreground">Style:</span> {details?.style || "N/A"}
          </div>
          <div>
            <span className="text-muted-foreground">Width:</span> {details?.width || "N/A"}
          </div>
          <div>
            <span className="text-muted-foreground">Price/Inch:</span> ${(frame.pricePerInch / 100).toFixed(2)}
          </div>
        </div>
        {details?.description && (
          <p className="text-sm text-muted-foreground">{details.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CatalogManagement;
