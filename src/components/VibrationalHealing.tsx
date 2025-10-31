import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Waves, 
  AlertTriangle, 
  Heart, 
  Volume2, 
  Clock, 
  Zap, 
  Music, 
  Shield,
  Info,
  Send,
  Phone,
  Mail
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function VibrationalHealing() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    issue: '',
    urgency: '',
    description: '',
    preferredTime: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you would typically send the form data to your backend
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        issue: '',
        urgency: '',
        description: '',
        preferredTime: ''
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const healingTypes = [
    {
      title: "Sound Frequency Healing",
      description: "Therapeutic sound waves to restore energetic balance",
      icon: <Volume2 className="w-6 h-6 text-purple-600" />,
      duration: "30-45 minutes",
      benefits: ["Stress relief", "Energy alignment", "Emotional balance"]
    },
    {
      title: "Vibrational Energy Work",
      description: "Distance healing through focused intention and energy",
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      duration: "20-30 minutes",
      benefits: ["Pain relief", "Chakra balancing", "Mental clarity"]
    },
    {
      title: "Resonance Therapy",
      description: "Harmonic frequencies to support natural healing",
      icon: <Music className="w-6 h-6 text-purple-600" />,
      duration: "45-60 minutes",
      benefits: ["Deep relaxation", "Sleep improvement", "Anxiety reduction"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Medical Disclaimer Banner - Non-dismissable */}
      <Alert className="border-red-200 bg-red-50 border-2">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Important Medical Disclaimer:</strong> Vibrational healing is a complementary practice and should not replace conventional medical treatment. Always consult with qualified healthcare professionals for medical conditions. This service is intended for general wellness and spiritual support only.
        </AlertDescription>
      </Alert>

      {/* Hero Section */}
      <div className="relative">
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Waves className="w-6 h-6" />
              </div>
              <h1 className="text-4xl">Vibrational Healing</h1>
            </div>
            <p className="text-lg text-purple-100 leading-relaxed">
              Experience the gentle power of sound and energy healing. Our practitioners use ancient 
              vibrational techniques to support your body's natural healing abilities and promote 
              deep relaxation and wellbeing.
            </p>
            <div className="flex justify-center">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1698429894891-c5a9e538072d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMHdhdmVzJTIwaGVhbGluZyUyMHZpYnJhdGlvbnxlbnwxfHx8fDE3NTkxNjIxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Sound waves and healing vibrations"
                className="w-64 h-32 object-cover rounded-lg opacity-80"
              />
            </div>
          </div>
          
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>
      </div>

      {/* Healing Types */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl text-slate-800">Types of Vibrational Healing</h2>
          <p className="text-slate-600">Choose from our range of energy healing modalities</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {healingTypes.map((type, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {type.icon}
                </div>
                <CardTitle className="text-xl text-slate-800">{type.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-slate-600">{type.description}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>{type.duration}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm text-slate-700">Benefits:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {type.benefits.map((benefit, idx) => (
                      <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Request Form */}
      <section className="max-w-2xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-slate-800">
              <Heart className="w-6 h-6 text-purple-600" />
              Request Vibrational Support
            </CardTitle>
            <p className="text-slate-600">
              Fill out this form to request a vibrational healing session. Our practitioners will contact you within 24 hours.
            </p>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl text-slate-800">Request Submitted Successfully!</h3>
                <p className="text-slate-600">
                  Thank you for your request. Our healing practitioners will contact you within 24 hours 
                  to schedule your vibrational healing session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue">Primary Concern *</Label>
                    <Select value={formData.issue} onValueChange={(value) => handleInputChange('issue', value)}>
                      <SelectTrigger className="border-purple-200">
                        <SelectValue placeholder="Select your main concern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stress">Stress & Anxiety</SelectItem>
                        <SelectItem value="pain">Physical Pain</SelectItem>
                        <SelectItem value="emotional">Emotional Healing</SelectItem>
                        <SelectItem value="energy">Energy Imbalance</SelectItem>
                        <SelectItem value="sleep">Sleep Issues</SelectItem>
                        <SelectItem value="spiritual">Spiritual Blockages</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                      <SelectTrigger className="border-purple-200">
                        <SelectValue placeholder="How urgent is this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Within a week</SelectItem>
                        <SelectItem value="medium">Medium - Within 3 days</SelectItem>
                        <SelectItem value="high">High - Within 24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Describe Your Situation</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide more details about what you're experiencing and what kind of support you're seeking..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="border-purple-200 focus:border-purple-400 min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time for Session</Label>
                  <Input
                    id="preferredTime"
                    placeholder="e.g., Mornings, Evenings, Weekends"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>

                <Alert className="border-purple-200 bg-purple-50">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    All sessions are conducted remotely. You will receive specific instructions for preparing 
                    for your vibrational healing session via email or phone.
                  </AlertDescription>
                </Alert>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                  disabled={!formData.name || !formData.email || !formData.issue}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Healing Request
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Contact Information */}
      <section className="max-w-2xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <Shield className="w-5 h-5 text-purple-600" />
              Emergency Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              For urgent situations or immediate support, please contact us directly:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Phone className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-slate-800">Emergency Healing Line</p>
                  <p className="text-sm text-slate-600">+91 9999-HEAL-NOW (Available 24/7)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-slate-800">Email Support</p>
                  <p className="text-sm text-slate-600">healing@soulcare.com</p>
                </div>
              </div>
            </div>
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                If you are experiencing a medical emergency, please contact emergency services (911/108) immediately. 
                Vibrational healing is not a substitute for emergency medical care.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}