import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Star, MapPin, Clock, Filter, Search, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from './auth/AuthProvider';
import { AuthModal } from './auth/AuthModal';
import { BookingModal } from './booking/BookingModal';

export function DoctorDirectory() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [problemFilter, setProblemFilter] = useState('all');
  const [traditionFilter, setTraditionFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const doctors = [
    {
      id: 1,
      name: "Dr. Ananda Sharma",
      userId: "doctor_ananda_id",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
      specialties: ["Anxiety", "Meditation", "Gita Wisdom"],
      tradition: "Bhagavad Gita",
      rating: 4.9,
      reviews: 156,
      experience: "15 years",
      location: "Online & Mumbai",
      availability: "Available Today",
      languages: ["English", "Hindi", "Sanskrit"],
      description: "Specialist in ancient Vedic practices for modern stress relief and spiritual awakening.",
      sessionPrice: "₹1,500"
    },
    {
      id: 2,
      name: "Dr. Priya Meditation",
      userId: "doctor_priya_id",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      specialties: ["Depression", "Self-Doubt", "Mindfulness"],
      tradition: "Buddhist Meditation",
      rating: 4.8,
      reviews: 203,
      experience: "12 years",
      location: "Online & Delhi",
      availability: "Available Tomorrow",
      languages: ["English", "Hindi"],
      description: "Combines traditional Buddhist meditation with modern therapeutic approaches.",
      sessionPrice: "₹1,200"
    },
    {
      id: 3,
      name: "Dr. Rajesh Mindful",
      userId: "doctor_rajesh_id",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      specialties: ["Procrastination", "Focus", "Life Purpose"],
      tradition: "Yoga Philosophy",
      rating: 4.7,
      reviews: 128,
      experience: "10 years",
      location: "Online Only",
      availability: "Available Today",
      languages: ["English", "Hindi", "Tamil"],
      description: "Expert in yoga philosophy and practical spiritual solutions for daily challenges.",
      sessionPrice: "₹1,000"
    },
    {
      id: 4,
      name: "Dr. Sita Wisdom",
      userId: "doctor_sita_id",
      image: "https://images.unsplash.com/photo-1594824797073-8a8e5b0d8ba9?w=300&h=300&fit=crop&crop=face",
      specialties: ["Relationship Issues", "Emotional Balance", "Self-Love"],
      tradition: "Devotional Practices",
      rating: 4.9,
      reviews: 245,
      experience: "18 years",
      location: "Online & Bangalore",
      availability: "Available in 2 days",
      languages: ["English", "Hindi", "Kannada"],
      description: "Specializes in heart-centered healing and devotional practices for emotional wellness.",
      sessionPrice: "₹1,800"
    },
    {
      id: 5,
      name: "Dr. Arjun Balance",
      userId: "doctor_arjun_id",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      specialties: ["Anger Management", "Work Stress", "Leadership"],
      tradition: "Karma Yoga",
      rating: 4.6,
      reviews: 89,
      experience: "8 years",
      location: "Online & Chennai",
      availability: "Available Today",
      languages: ["English", "Hindi", "Telugu"],
      description: "Focuses on action-oriented spirituality and leadership development through ancient wisdom.",
      sessionPrice: "₹1,300"
    },
    {
      id: 6,
      name: "Dr. Maya Healing",
      userId: "doctor_maya_id",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&crop=face",
      specialties: ["Trauma Healing", "Inner Child Work", "Forgiveness"],
      tradition: "Tantric Healing",
      rating: 4.8,
      reviews: 167,
      experience: "14 years",
      location: "Online & Pune",
      availability: "Available Tomorrow",
      languages: ["English", "Hindi", "Marathi"],
      description: "Expert in deep healing practices and transformational spiritual therapy.",
      sessionPrice: "₹2,000"
    }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProblem = problemFilter === 'all' || doctor.specialties.some(s => 
      s.toLowerCase().includes(problemFilter.toLowerCase()));
    const matchesTradition = traditionFilter === 'all' || 
                            doctor.tradition.toLowerCase().includes(traditionFilter.toLowerCase());
    const matchesAvailability = availabilityFilter === 'all' || 
                               doctor.availability.toLowerCase().includes(availabilityFilter.toLowerCase());
    
    return matchesSearch && matchesProblem && matchesTradition && matchesAvailability;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl text-slate-800">Find Your Spiritual Doctor</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Connect with experienced practitioners who can guide you on your healing journey
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/50 backdrop-blur-sm border-teal-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search doctors or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-teal-200 focus:border-teal-400"
              />
            </div>
            
            <Select value={problemFilter} onValueChange={setProblemFilter}>
              <SelectTrigger className="border-teal-200">
                <SelectValue placeholder="Problem Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Problems</SelectItem>
                <SelectItem value="anxiety">Anxiety</SelectItem>
                <SelectItem value="depression">Depression</SelectItem>
                <SelectItem value="procrastination">Procrastination</SelectItem>
                <SelectItem value="self-doubt">Self-Doubt</SelectItem>
                <SelectItem value="stress">Stress</SelectItem>
              </SelectContent>
            </Select>

            <Select value={traditionFilter} onValueChange={setTraditionFilter}>
              <SelectTrigger className="border-teal-200">
                <SelectValue placeholder="Tradition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Traditions</SelectItem>
                <SelectItem value="gita">Bhagavad Gita</SelectItem>
                <SelectItem value="meditation">Meditation</SelectItem>
                <SelectItem value="yoga">Yoga Philosophy</SelectItem>
                <SelectItem value="buddhist">Buddhist</SelectItem>
                <SelectItem value="tantric">Tantric Healing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="border-teal-200">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Time</SelectItem>
                <SelectItem value="today">Available Today</SelectItem>
                <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Showing {filteredDoctors.length} of {doctors.length} spiritual doctors
        </p>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">Sort by rating</span>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="bg-white/70 backdrop-blur-sm border-teal-100 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <ImageWithFallback
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-slate-800 group-hover:text-teal-700 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-slate-600">{doctor.tradition}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{doctor.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400">({doctor.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 line-clamp-2">{doctor.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {doctor.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.experience} experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-green-600">{doctor.availability}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-teal-100">
                <div>
                  <p className="text-sm text-slate-500">Session</p>
                  <p className="text-lg text-slate-800">{doctor.sessionPrice}</p>
                </div>
                <Button 
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() => {
                    if (user) {
                      setSelectedDoctor(doctor);
                      setBookingModalOpen(true);
                    } else {
                      setAuthModalOpen(true);
                    }
                  }}
                >
                  {user ? 'Book Now' : 'Sign In to Book'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-xl text-slate-800 mb-2">No doctors found</h3>
          <p className="text-slate-600">Try adjusting your search filters to find more options.</p>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        userRole="patient"
      />

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedDoctor(null);
          }}
          doctor={selectedDoctor}
        />
      )}
    </div>
  );
}