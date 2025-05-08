import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SeoHead } from '@/components/seo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <SeoHead 
        title="Page Not Found | Jay's Frames"
        description="Sorry, the page you were looking for couldn't be found. Jay's Frames offers custom framing services in Houston, TX."
        canonicalUrl="/404"
      />

      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          We're sorry, but the page you were looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full md:w-auto">
              Return to Home
            </Button>
          </Link>
          <Link to="/custom-framing">
            <Button variant="outline" className="w-full md:w-auto">
              Design Your Frame
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="w-full md:w-auto">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}