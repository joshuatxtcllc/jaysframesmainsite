import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Search, Phone } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50">
      <Helmet>
        <title>Page Not Found - Jay's Frames</title>
        <meta name="description" content="Sorry, the page you're looking for cannot be found. Return to Jay's Frames homepage for custom framing services, or contact us for assistance." />
        <meta property="og:title" content="Page Not Found - Jay's Frames" />
        <meta property="og:description" content="Sorry, the page you're looking for cannot be found. Return to Jay's Frames homepage for custom framing services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jaysframes.com/404" />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Page Not Found - Jay's Frames" />
        <meta name="twitter:description" content="Sorry, the page you're looking for cannot be found. Return to Jay's Frames homepage for custom framing services." />
      </Helmet>
      
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Page Not Found</h1>
            <p className="text-neutral-600 mb-6">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
            </p>
            
            <div className="w-full border-t border-neutral-200 my-6"></div>
            
            <div className="space-y-4 w-full">
              <h2 className="text-lg font-medium text-primary">Here are some helpful links:</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </Link>
                
                <Link href="/custom-framing">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    Custom Framing
                  </Button>
                </Link>
                
                <Link href="/products">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Products
                  </Button>
                </Link>
                
                <Link href="/order-status">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    Track Your Order
                  </Button>
                </Link>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-neutral-500 mb-2">Need further assistance?</p>
                <a href="tel:+18328933794" className="inline-flex items-center text-secondary hover:underline">
                  <Phone className="h-4 w-4 mr-1" />
                  (832) 893-3794
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
