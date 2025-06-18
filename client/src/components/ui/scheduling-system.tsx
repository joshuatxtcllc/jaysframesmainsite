
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const SchedulingSystem = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate available time slots (10am-6pm Mon-Fri, 11am-5pm Sat)
  const getAvailableTimeSlots = (date: string) => {
    if (!date) return [];
    
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (dayOfWeek === 0) return []; // Sunday - closed
    
    if (dayOfWeek === 6) { // Saturday
      return [
        '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
        '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
        '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
      ];
    } else { // Monday-Friday
      return [
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
        '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
      ];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setSelectedDate('');
        setSelectedTime('');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Consultation Scheduled!</h3>
          <p className="text-muted-foreground mb-4">
            We've received your appointment request. You'll receive a confirmation email shortly.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Schedule Another Appointment
          </Button>
        </CardContent>
      </Card>
    );
  }

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
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Preferred Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="space-y-2">
              <Label htmlFor="time">Available Times</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimeSlots(selectedDate).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">Service Type</Label>
            <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })} required>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom-framing">Custom Framing Consultation</SelectItem>
                <SelectItem value="art-preservation">Art Preservation & Conservation</SelectItem>
                <SelectItem value="installation">Installation Services</SelectItem>
                <SelectItem value="bulk-order">Bulk/Commercial Order</SelectItem>
                <SelectItem value="general">General Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Details (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your framing project, artwork dimensions, or any specific requirements..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
            disabled={isSubmitting || !selectedDate || !selectedTime}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Consultation'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Business Hours</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
            <p>Saturday: 11:00 AM - 5:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
          <div className="mt-3 text-sm">
            <p><strong>Location:</strong> 218 W 27th St., Houston, TX 77008</p>
            <p><strong>Phone:</strong> (832) 893-3794</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchedulingSystem;
