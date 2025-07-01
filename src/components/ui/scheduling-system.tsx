
import React from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

const SchedulingSystem = () => {
  const handleScheduleClick = () => {
    window.open('https://calendly.com/frames-jaysframes/30min?month=2025-06', '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
          Schedule Your Consultation
        </CardTitle>
        <CardDescription>
          Book a personalized framing consultation at our Houston Heights location
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="bg-cyan-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Calendar className="h-10 w-10 text-cyan-600" />
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Ready to Schedule?</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Click below to access our online scheduling system and book your consultation at a time that works best for you.
        </p>
        
        <Button 
          onClick={handleScheduleClick}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-lg px-8 py-3 mb-6"
        >
          Schedule on Calendly
          <ExternalLink className="ml-2 h-5 w-5" />
        </Button>

        <div className="p-4 bg-gray-50 rounded-lg text-left">
          <h4 className="font-semibold mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-cyan-500" />
            Business Hours
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
            <p>Saturday: 11:00 AM - 5:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
          <div className="mt-4 text-sm">
            <p><strong>Location:</strong> 218 W 27th St., Houston, TX 77008</p>
            <p><strong>Phone:</strong> (832) 893-3794</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchedulingSystem;
