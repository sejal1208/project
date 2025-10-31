import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Star, Clock, Shield, Heart, ArrowRight, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onBookSession: () => void;
}

export function LandingPage({ onBookSession }: LandingPageProps) {
  const benefits = [
    'Overcome Procrastination',
    'Reduce Anxiety',
    'Build Self-Confidence',
    'Find Inner Peace',
    'Develop Emotional Balance',
    'Strengthen Mental Clarity'
  ];

  const features = [
    {
      icon: <Clock className="w-6 h-6 text-teal-600" />,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your lifestyle"
    },
    {
      icon: <Shield className="w-6 h-6 text-teal-600" />,
      title: "Trusted Practitioners",
      description: "Verified spiritual doctors and healers"
    },
    {
      icon: <Heart className="w-6 h-6 text-teal-600" />,
      title: "Holistic Approach",
      description: "Mind, body, and spirit wellness"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl text-slate-800 leading-tight">
                Transform Your Life with 
                <span className="text-teal-700 block">Spiritual Guidance</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Connect with experienced spiritual doctors who understand your journey. 
                Find peace, clarity, and purpose through personalized sessions rooted in 
                ancient wisdom and modern understanding.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 bg-teal-50 px-3 py-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-teal-800">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onBookSession}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg"
              >
                Book Your First Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-teal-300 text-teal-700 hover:bg-teal-50 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm text-slate-600">2,000+ happy clients</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-slate-600">4.9/5 rating</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1606733572375-35620adc4a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjBuYXR1cmV8ZW58MXx8fHwxNzU5MDM2OTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Peaceful meditation in nature"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-teal-600/20 to-transparent rounded-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-80 blur-xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full opacity-60 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl text-slate-800">Why Choose SoulCare?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We provide a safe, supportive environment for your spiritual growth and healing journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-teal-100 hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl text-slate-800">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-3xl p-12 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl lg:text-4xl">Ready to Begin Your Journey?</h2>
          <p className="text-lg text-teal-100">
            Take the first step towards a more balanced, peaceful, and fulfilling life. 
            Our spiritual doctors are here to guide you every step of the way.
          </p>
          <Button 
            onClick={onBookSession}
            size="lg" 
            className="bg-white text-teal-700 hover:bg-teal-50 px-8 py-6 text-lg"
          >
            Start Your Healing Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}