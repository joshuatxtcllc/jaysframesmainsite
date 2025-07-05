import { SeoHead } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Frame, Palette, Wand2 } from "lucide-react";

const LJDesigner = () => {
  return (
    <>
      <SeoHead 
        title="Virtual Design Studio | Jay's Frames - Online Custom Frame Designer"
        description="Design your custom frames online with our virtual design studio powered by Larson Juhl. Preview your artwork in professional frames with real-time visualization and pricing."
        keywords="virtual frame design, online frame designer, custom frame preview, Larson Juhl designer, frame visualization, Houston custom framing design tool"
        canonicalUrl="/ljdesigner"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Jay's Frames Virtual Design Studio",
          "description": "Professional online frame design tool for custom picture framing",
          "url": "https://jaysframes.com/ljdesigner",
          "applicationCategory": "DesignApplication",
          "operatingSystem": "Web Browser"
        }}
      />

      <div className="min-h-screen bg-black">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-black via-gray-900 to-black py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Virtual Design Studio
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                Professional frame design tool powered by Larson Juhl. Design, preview, and price your custom frames in real-time.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Frame className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold mb-1">Professional Frames</h3>
                    <p className="text-gray-400 text-sm">Access to thousands of museum-quality frame profiles</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Palette className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold mb-1">Real-Time Preview</h3>
                    <p className="text-gray-400 text-sm">See exactly how your artwork will look when framed</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Wand2 className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold mb-1">Instant Pricing</h3>
                    <p className="text-gray-400 text-sm">Get accurate pricing as you design your frame</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Designer Tool Section */}
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <ExternalLink className="w-5 h-5 text-teal-400" />
                Larson Juhl Design Studio
              </CardTitle>
              <p className="text-gray-400">
                Professional frame design tool with instant pricing and visualization
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {/* Iframe container with responsive design */}
              <div className="relative w-full" style={{ paddingBottom: '60%', minHeight: '600px' }}>
                <iframe 
                  src="https://designstudio.larsonjuhl.com/?organisation=JaysFrames&createurl=https://jaysframes.com/ljdesigner"
                  className="absolute top-0 left-0 w-full h-full border-0 rounded-b-lg"
                  style={{ minHeight: '850px' }}
                  title="Larson Juhl Virtual Design Studio"
                  allow="camera; microphone; fullscreen"
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-white text-lg font-semibold mb-3">Need Help with Design?</h3>
                <p className="text-gray-300 mb-4">
                  Our team is here to assist you with your custom framing project. Contact us for expert advice on frame selection, matting, and conservation techniques.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="tel:(832) 893-3794" 
                    className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Call (832) 893-3794
                  </a>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Contact Us Online
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default LJDesigner;