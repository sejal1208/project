import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calendar, 
  Clock, 
  Play, 
  Users, 
  Star, 
  BookOpen, 
  Brain, 
  Heart, 
  Sparkles,
  Trophy,
  Timer,
  Volume2,
  Loader2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from './auth/AuthProvider';
import { AuthModal } from './auth/AuthModal';
import { PaymentModal } from './payments/PaymentModal';
import { APIClient } from '../utils/supabase/client';

export function ChildrenPlatform() {
  const { user, getAccessToken } = useAuth();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [connectionError, setConnectionError] = useState(false);

  // Load classes from backend
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      const response = await APIClient.get('/classes');
      
      // Add instructor images and day labels to the classes
      const enrichedClasses = response.classes.map((cls: any, index: number) => ({
        ...cls,
        instructorImage: cls.instructor === "Uncle Raj" 
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
          : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
        day: index === 0 ? "Today" : index === 1 ? "Tomorrow" : cls.day
      }));
      
      setClasses(enrichedClasses);
    } catch (error) {
      console.warn('Failed to load classes from backend, using fallback data:', error);
      setConnectionError(true);
      // Fallback to static data if backend fails
      setClasses([
        {
          id: 'fallback_1',
          title: "Brain Gym Morning Session",
          instructor: "Uncle Raj",
          instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
          time: "9:00 AM - 9:45 AM",
          ageGroup: "6-10 years",
          participants: 12,
          maxParticipants: 15,
          day: "Today",
          type: "Brain Gym",
          difficulty: "Beginner",
          description: "Fun exercises to boost memory and focus through movement and games",
          price: 500
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const videoLessons = [
    {
      id: 1,
      title: "The Brave Little Monkey",
      type: "Virtue Story",
      duration: "8 mins",
      ageGroup: "4-8 years",
      virtue: "Courage",
      thumbnail: "https://images.unsplash.com/photo-1758274525122-25d1fa65d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHlvZ2ElMjBtZWRpdGF0aW9uJTIwY2xhc3N8ZW58MXx8fHwxNzU5MTYyMTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 145,
      rating: 4.8
    },
    {
      id: 2,
      title: "Memory Game: Remember the Colors",
      type: "Brain Exercise",
      duration: "5 mins",
      ageGroup: "6-10 years",
      virtue: "Focus",
      thumbnail: "https://images.unsplash.com/photo-1758274525122-25d1fa65d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHlvZ2ElMjBtZWRpdGF0aW9uJTIwY2xhc3N8ZW58MXx8fHwxNzU5MTYyMTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 89,
      rating: 4.6
    },
    {
      id: 3,
      title: "Arjuna's Choice: Right vs Easy",
      type: "Wisdom Story",
      duration: "12 mins",
      ageGroup: "10-14 years",
      virtue: "Righteousness",
      thumbnail: "https://images.unsplash.com/photo-1758274525122-25d1fa65d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHlvZ2ElMjBtZWRpdGF0aW9uJTIwY2xhc3N8ZW58MXx8fHwxNzU5MTYyMTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 203,
      rating: 4.9
    },
    {
      id: 4,
      title: "Breathing Like a Dragon",
      type: "Meditation",
      duration: "6 mins",
      ageGroup: "4-8 years",
      virtue: "Calmness",
      thumbnail: "https://images.unsplash.com/photo-1758274525122-25d1fa65d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHlvZ2ElMjBtZWRpdGF0aW9uJTIwY2xhc3N8ZW58MXx8fHwxNzU5MTYyMTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 167,
      rating: 4.7
    },
    {
      id: 5,
      title: "The Sharing Tree",
      type: "Virtue Story",
      duration: "10 mins",
      ageGroup: "6-12 years",
      virtue: "Generosity",
      thumbnail: "https://images.unsplash.com/photo-1758274525122-25d1fa65d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHlvZ2ElMjBtZWRpdGF0aW9uJTIwY2xhc3N8ZW58MXx8fHwxNzU5MTYyMTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 134,
      rating: 4.8
    },
    {
      id: 6,
      title: "Super Memory Superhero Training",
      type: "Brain Exercise",
      duration: "15 mins",
      ageGroup: "8-14 years",
      virtue: "Concentration",
      thumbnail: "https://images.unsplash.com/photo-1758274525122-25d1fa65d256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHlvZ2ElMjBtZWRpdGF0aW9uJTIwY2xhc3N8ZW58MXx8fHwxNzU5MTYyMTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      views: 98,
      rating: 4.5
    }
  ];

  const handleClassBooking = async (classItem: any) => {
    console.log('Booking class:', classItem.title);
    console.log('Current user:', user);
    
    if (!user) {
      console.log('No user found, opening auth modal');
      setAuthModalOpen(true);
      return;
    }

    try {
      setLoading(true);
      console.log('Getting access token...');
      const token = await getAccessToken();
      console.log('Access token:', token ? `${token.substring(0, 20)}...` : 'none');
      
      if (!token) {
        throw new Error('Authentication required - no access token');
      }

      console.log('Making booking request for class:', classItem.id);
      const booking = await APIClient.post(`/classes/${classItem.id}/book`, {}, token);
      console.log('Booking successful:', booking);
      
      setBookingResult(booking.booking);
      setSelectedClass(classItem);
      setPaymentModalOpen(true);
    } catch (error: any) {
      console.error('Booking failed:', error);
      alert('Failed to book class: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    setSelectedClass(null);
    setBookingResult(null);
    alert('Class booked successfully! Check your dashboard for details.');
  };

  const filteredClasses = selectedAgeGroup === 'all' 
    ? classes 
    : classes.filter(cls => cls.ageGroup.includes(selectedAgeGroup));

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Brain Gym': return 'bg-blue-100 text-blue-700';
      case 'Meditation': return 'bg-green-100 text-green-700';
      case 'Wisdom': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getVirtueColor = (virtue: string) => {
    const colors = [
      'bg-red-100 text-red-700',
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700'
    ];
    return colors[virtue.length % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Connection Error Alert */}
      {connectionError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-600">⚠️</span>
            </div>
            <div>
              <h3 className="text-amber-800 font-medium">Using Offline Mode</h3>
              <p className="text-amber-700 text-sm">
                Some features may be limited. Classes shown are sample data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Colorful Header */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-4xl">Kids Wisdom Zone</h1>
          </div>
          <p className="text-lg text-white/90 mb-6">
            Fun learning adventures for bright young minds! Join Uncle Raj and Aunt Priya 
            for exciting classes that make you smarter, calmer, and kinder.
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              🧠 Brain Gym
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              🧘‍♀️ Meditation
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              📚 Wisdom Stories
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              🎯 Memory Games
            </Badge>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-orange-50 border border-orange-200">
          <TabsTrigger 
            value="schedule" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Live Classes
          </TabsTrigger>
          <TabsTrigger 
            value="library" 
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Video Library
          </TabsTrigger>
        </TabsList>

        {/* Live Classes Tab */}
        <TabsContent value="schedule" className="space-y-6">
          {/* Age Group Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedAgeGroup === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedAgeGroup('all')}
              className={selectedAgeGroup === 'all' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-300 text-orange-700 hover:bg-orange-50'}
            >
              All Ages
            </Button>
            <Button
              variant={selectedAgeGroup === '4-8' ? 'default' : 'outline'}
              onClick={() => setSelectedAgeGroup('4-8')}
              className={selectedAgeGroup === '4-8' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-300 text-orange-700 hover:bg-orange-50'}
            >
              4-8 years
            </Button>
            <Button
              variant={selectedAgeGroup === '8-12' ? 'default' : 'outline'}
              onClick={() => setSelectedAgeGroup('8-12')}
              className={selectedAgeGroup === '8-12' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-300 text-orange-700 hover:bg-orange-50'}
            >
              8-12 years
            </Button>
            <Button
              variant={selectedAgeGroup === '10-16' ? 'default' : 'outline'}
              onClick={() => setSelectedAgeGroup('10-16')}
              className={selectedAgeGroup === '10-16' ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-300 text-orange-700 hover:bg-orange-50'}
            >
              10-16 years
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                <p className="text-slate-600">Loading exciting classes for you...</p>
              </div>
            </div>
          )}

          {/* Class Cards */}
          {!loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((cls) => (
              <Card key={cls.id} className="bg-white/80 backdrop-blur-sm border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${getTypeColor(cls.type)} text-xs px-2 py-1`}>
                      {cls.type}
                    </Badge>
                    <span className="text-xs text-slate-500">{cls.day}</span>
                  </div>
                  <CardTitle className="text-lg text-slate-800 group-hover:text-orange-600 transition-colors">
                    {cls.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={cls.instructorImage}
                      alt={cls.instructor}
                      className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                    />
                    <div>
                      <p className="text-sm text-slate-800">{cls.instructor}</p>
                      <p className="text-xs text-slate-600">{cls.ageGroup}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2">{cls.description}</p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{cls.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>{cls.participants}/{cls.maxParticipants} kids joined</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-orange-100">
                    <div className="flex flex-col">
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 mb-1">
                        {cls.difficulty}
                      </Badge>
                      {cls.price && (
                        <span className="text-sm text-slate-600">₹{cls.price}</span>
                      )}
                    </div>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => handleClassBooking(cls)}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : user ? (
                        'Join Class'
                      ) : (
                        'Sign In to Join'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </TabsContent>

        {/* Video Library Tab */}
        <TabsContent value="library" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl text-slate-800">Video Library</h2>
            <p className="text-slate-600">Watch fun videos anytime to learn new things!</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoLessons.map((video) => (
              <Card key={video.id} className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge className={`${getVirtueColor(video.virtue)} text-xs mb-1`}>
                      {video.virtue}
                    </Badge>
                    <p className="text-white text-sm">{video.ageGroup}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 rounded px-2 py-1">
                    <div className="flex items-center gap-1 text-white text-xs">
                      <Timer className="w-3 h-3" />
                      {video.duration}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-purple-600 ml-1" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-sm text-slate-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">{video.type}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{video.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      <span>{video.views} views</span>
                    </div>
                  </div>

                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        userRole="patient"
      />

      {/* Payment Modal */}
      {selectedClass && bookingResult && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          bookingDetails={{
            id: bookingResult.id,
            type: 'class',
            title: selectedClass.title,
            amount: selectedClass.price || 500,
            currency: 'INR',
            description: `${selectedClass.type} class with ${selectedClass.instructor} - ${selectedClass.time}`
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}