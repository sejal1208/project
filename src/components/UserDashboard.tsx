import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Calendar, Clock, TrendingUp, Target, BookOpen, Video, MessageCircle, Award, Loader2, RefreshCw, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from './auth/AuthProvider';
import { APIClient } from '../utils/supabase/client';
import { PatientDetailsModal } from './profile/PatientDetailsModal';

export function UserDashboard() {
  const { user, getAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [userSessions, setUserSessions] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [patientDetailsModalOpen, setPatientDetailsModalOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Listen for new bookings to refresh dashboard
  useEffect(() => {
    const handleBookingCreated = (event: any) => {
      console.log('New booking created, refreshing dashboard:', event.detail);
      loadDashboardData(); // Refresh the dashboard data
    };

    window.addEventListener('bookingCreated', handleBookingCreated);
    return () => window.removeEventListener('bookingCreated', handleBookingCreated);
  }, []);

  // Add some mock sessions if none are loaded
  useEffect(() => {
    if (!loading && userSessions.length === 0) {
      // Add some demo sessions to show how it looks
      setUserSessions([
        {
          id: 'demo_session_1',
          doctorId: 1,
          sessionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          sessionTime: '10:00',
          sessionType: 'consultation',
          duration: '60',
          status: 'confirmed'
        },
        {
          id: 'demo_session_2', 
          doctorId: 2,
          sessionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          sessionTime: '14:30',
          sessionType: 'meditation',
          duration: '45',
          status: 'confirmed'
        }
      ]);
    }
  }, [loading, userSessions.length]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      if (!token) return;

      // Load user bookings, sessions, classes, and profile in parallel
      const [bookingsResponse, sessionsResponse, classesResponse, profileResponse] = await Promise.allSettled([
        APIClient.get('/bookings', token),
        APIClient.get('/sessions', token),
        APIClient.get('/user-classes', token),
        APIClient.get('/profile', token)
      ]);

      if (bookingsResponse.status === 'fulfilled') {
        setUserBookings(bookingsResponse.value.bookings || []);
      }

      if (sessionsResponse.status === 'fulfilled') {
        setUserSessions(sessionsResponse.value.sessions || []);
      }

      if (classesResponse.status === 'fulfilled') {
        // Combine sessions and classes for a unified view
        const userClasses = classesResponse.value.classes || [];
        setUserSessions(prev => [...prev, ...userClasses]);
      }

      if (profileResponse.status === 'fulfilled') {
        setUserProfile(profileResponse.value.profile);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Doctor lookup data - this should match the doctors in DoctorDirectory
  const doctorsData = {
    1: { name: "Dr. Ananda Sharma", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face" },
    2: { name: "Dr. Priya Mehta", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" },
    3: { name: "Dr. Rajesh Kumar", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face" },
    4: { name: "Dr. Kavita Singh", image: "https://images.unsplash.com/photo-1594824371018-07db21a24b2b?w=100&h=100&fit=crop&crop=face" },
    5: { name: "Dr. Arjun Patel", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    6: { name: "Dr. Sneha Reddy", image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=100&h=100&fit=crop&crop=face" }
  };

  // Map sessions with proper doctor/instructor information
  const upcomingSessions = userSessions.length > 0 ? userSessions.slice(0, 3).map(session => {
    if (session.type === 'children_class') {
      // Handle children's classes
      return {
        id: session.id,
        doctor: session.instructor,
        doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
        date: new Date(session.sessionDate).toLocaleDateString(),
        time: session.sessionTime,
        type: `${session.className} (${session.ageGroup})`,
        duration: `${session.duration} mins`,
        status: session.status || "confirmed",
        isClass: true
      };
    } else {
      // Handle doctor sessions
      const doctorInfo = doctorsData[session.doctorId] || { name: `Dr. Unknown (ID: ${session.doctorId})`, image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face" };
      return {
        id: session.id,
        doctor: doctorInfo.name,
        doctorImage: doctorInfo.image,
        date: new Date(session.sessionDate).toLocaleDateString(),
        time: session.sessionTime,
        type: session.sessionType,
        duration: "60 mins",
        status: session.status || "confirmed",
        isClass: false
      };
    }
  }) : [
    {
      id: 1,
      doctor: "Dr. Ananda Sharma",
      doctorImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
      date: "Today",
      time: "3:00 PM",
      type: "Anxiety Management",
      duration: "60 mins",
      status: "confirmed"
    },
    {
      id: 2,
      doctor: "Dr. Priya Meditation",
      doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      date: "Tomorrow",
      time: "11:00 AM",
      type: "Mindfulness Session",
      duration: "45 mins",
      status: "confirmed"
    },
    {
      id: 3,
      doctor: "Dr. Rajesh Mindful",
      doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
      date: "Thursday",
      time: "5:30 PM",
      type: "Procrastination Workshop",
      duration: "90 mins",
      status: "pending"
    }
  ];

  const getUserStats = () => {
    if (!userProfile) {
      return {
        sessionsCompleted: userSessions.filter(s => s.status === 'completed').length,
        daysActive: Math.floor(Math.random() * 30) + 1,
        goalProgress: Math.floor(Math.random() * 100),
        wellnessScore: (Math.random() * 2 + 3).toFixed(1)
      };
    }
    
    return {
      sessionsCompleted: userProfile.progress?.sessionsCompleted || userSessions.filter(s => s.status === 'completed').length,
      daysActive: userProfile.progress?.daysActive || Math.floor((Date.now() - new Date(userProfile.joinedAt).getTime()) / (1000 * 60 * 60 * 24)),
      goalProgress: userProfile.progress?.goalProgress || 85,
      wellnessScore: userProfile.progress?.wellnessScore || 4.8
    };
  };

  const stats = getUserStats();

  const progressMetrics = [
    {
      title: "Anxiety Level",
      current: 65,
      target: 30,
      improvement: -20,
      color: "bg-green-500",
      description: "20% improvement this month"
    },
    {
      title: "Meditation Streak",
      current: 12,
      target: 30,
      improvement: 12,
      color: "bg-blue-500",
      description: "12 days in a row"
    },
    {
      title: "Self-Confidence",
      current: 75,
      target: 90,
      improvement: 25,
      color: "bg-purple-500",
      description: "25% growth this quarter"
    },
    {
      title: "Focus Score",
      current: 60,
      target: 80,
      improvement: 15,
      color: "bg-orange-500",
      description: "15% improvement"
    }
  ];

  const recentContent = [
    {
      type: "video",
      title: "Morning Meditation for Anxiety",
      duration: "12 mins",
      completed: true,
      icon: <Video className="w-4 h-4" />
    },
    {
      type: "reading",
      title: "Chapter 3: Karma Yoga Principles",
      duration: "8 mins",
      completed: false,
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      type: "exercise",
      title: "Breathing Exercise for Stress",
      duration: "5 mins",
      completed: true,
      icon: <Target className="w-4 h-4" />
    }
  ];

  const achievements = [
    {
      title: "First Session Complete",
      description: "Completed your first spiritual session",
      date: "2 weeks ago",
      icon: <Award className="w-6 h-6 text-gold-500" />
    },
    {
      title: "Meditation Beginner",
      description: "Meditated for 7 days in a row",
      date: "1 week ago",
      icon: <Target className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Progress Tracker",
      description: "Tracked your progress for 30 days",
      date: "3 days ago",
      icon: <TrendingUp className="w-6 h-6 text-green-500" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl">Welcome back, {user?.fullName || 'Friend'}!</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadDashboardData}
                disabled={loading}
                className="text-white hover:bg-white/10"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <p className="text-teal-100">Continue your journey of spiritual growth and healing.</p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPatientDetailsModalOpen(true)}
                className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-white/10 backdrop-blur-sm"
              >
                <User className="w-4 h-4 mr-1 text-white" />
                <span className="text-white">Complete Profile</span>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1655970580622-4a547789c850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlJTIwbWVkaXRhdGlvbiUyMHdlbGxuZXNzfGVufDF8fHx8MTU5MTE2MjE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Meditation illustration"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm border-teal-100">
          <CardContent className="p-4 text-center">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1 text-teal-600" />
            ) : (
              <div className="text-2xl text-teal-600 mb-1">{stats.sessionsCompleted}</div>
            )}
            <div className="text-sm text-slate-600">Sessions Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-teal-100">
          <CardContent className="p-4 text-center">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1 text-blue-600" />
            ) : (
              <div className="text-2xl text-blue-600 mb-1">{stats.daysActive}</div>
            )}
            <div className="text-sm text-slate-600">Days Active</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-teal-100">
          <CardContent className="p-4 text-center">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1 text-purple-600" />
            ) : (
              <div className="text-2xl text-purple-600 mb-1">{stats.goalProgress}%</div>
            )}
            <div className="text-sm text-slate-600">Goal Progress</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm border-teal-100">
          <CardContent className="p-4 text-center">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1 text-green-600" />
            ) : (
              <div className="text-2xl text-green-600 mb-1">{stats.wellnessScore}</div>
            )}
            <div className="text-sm text-slate-600">Wellness Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Sessions */}
          <Card className="bg-white/70 backdrop-blur-sm border-teal-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg">
                  <ImageWithFallback
                    src={session.doctorImage}
                    alt={session.doctor}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-slate-800">{session.doctor}</h4>
                    <p className="text-sm text-slate-600">{session.type}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span>{session.date} at {session.time}</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.status === 'confirmed' ? 'default' : 'secondary'}>
                      {session.status}
                    </Badge>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-teal-300 text-teal-700 hover:bg-teal-50">
                Schedule New Session
              </Button>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card className="bg-white/70 backdrop-blur-sm border-teal-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {progressMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-slate-800">{metric.title}</h4>
                    <span className="text-sm text-slate-600">{metric.description}</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={(metric.current / metric.target) * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Current: {metric.current}{metric.title.includes('Streak') ? ' days' : '%'}</span>
                      <span>Target: {metric.target}{metric.title.includes('Streak') ? ' days' : '%'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Content */}
          <Card className="bg-white/70 backdrop-blur-sm border-teal-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Recent Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentContent.map((content, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    content.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {content.icon}
                  </div>
                  <div className="flex-1">
                    <h5 className={`text-sm ${content.completed ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
                      {content.title}
                    </h5>
                    <p className="text-xs text-slate-500">{content.duration}</p>
                  </div>
                  {content.completed && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full border-teal-300 text-teal-700 hover:bg-teal-50">
                View All Content
              </Button>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-white/70 backdrop-blur-sm border-teal-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm text-slate-800">{achievement.title}</h5>
                    <p className="text-xs text-slate-600 mb-1">{achievement.description}</p>
                    <p className="text-xs text-slate-500">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={patientDetailsModalOpen}
        onClose={() => setPatientDetailsModalOpen(false)}
        onComplete={() => {
          setPatientDetailsModalOpen(false);
          loadDashboardData(); // Refresh dashboard data
        }}
      />
    </div>
  );
}