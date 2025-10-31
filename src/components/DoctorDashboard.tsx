import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { APIClient } from '../utils/supabase/client';
import { useAuth } from './auth/AuthProvider';

interface Booking {
  id: string;
  userId: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  bookedAt: string;
  status: 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed';
  completed?: boolean;
}

export function DoctorDashboard() {
  const { user, getAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    completedSessions: 0,
    upcomingSessions: 0
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const data = await APIClient.get('/bookings', token);
      
      // Mock patient data for demonstration
      const bookingsWithPatients = (data.bookings || []).map((booking: any, index: number) => ({
        ...booking,
        patientName: `Patient ${index + 1}`,
        patientEmail: `patient${index + 1}@example.com`,
        patientPhone: `+91 98765${43210 + index}`,
        completed: false
      }));
      
      setBookings(bookingsWithPatients);
      
      // Calculate stats
      const today = new Date().toDateString();
      const todayBookings = bookingsWithPatients.filter((b: Booking) => 
        new Date(b.bookedAt).toDateString() === today
      );
      
      setStats({
        todayAppointments: todayBookings.length,
        totalPatients: new Set(bookingsWithPatients.map((b: Booking) => b.userId)).size,
        completedSessions: bookingsWithPatients.filter((b: Booking) => b.completed).length,
        upcomingSessions: bookingsWithPatients.filter((b: Booking) => !b.completed).length
      });
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (bookingId: string) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, completed: true } : b)
    );
    
    // Update stats
    setStats(prev => ({
      ...prev,
      completedSessions: prev.completedSessions + 1,
      upcomingSessions: prev.upcomingSessions - 1
    }));
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      new Date(booking.bookedAt).toDateString() === date.toDateString()
    );
  };

  const todayBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const statsCards = [
    { title: "Today's Appointments", value: stats.todayAppointments, icon: CalendarIcon, color: 'blue' },
    { title: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'teal' },
    { title: 'Completed Sessions', value: stats.completedSessions, icon: CheckCircle, color: 'green' },
    { title: 'Upcoming Sessions', value: stats.upcomingSessions, icon: Clock, color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-slate-800">Doctor Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user?.fullName}</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <CalendarIcon className="w-4 h-4 mr-2" />
            View Full Schedule
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-l-4" style={{ borderLeftColor: `var(--${stat.color}-600)` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <div className={`w-8 h-8 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-slate-800">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Schedule Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Has appointments</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Appointments for {selectedDate?.toLocaleDateString()}
            </CardTitle>
            <CardDescription>
              {todayBookings.length} appointment{todayBookings.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading appointments...</div>
            ) : todayBookings.length > 0 ? (
              <div className="space-y-4">
                {todayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`p-4 border rounded-lg ${booking.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-slate-800">{booking.patientName}</h4>
                            <p className="text-sm text-slate-500">
                              Booking ID: {booking.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-13 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4" />
                            {booking.patientEmail}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4" />
                            {booking.patientPhone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            {new Date(booking.bookedAt).toLocaleTimeString()}
                          </div>
                        </div>

                        <div className="ml-13 flex gap-2">
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                          <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                            {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending Payment'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {booking.completed ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm">Completed</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleMarkComplete(booking.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No appointments scheduled for this date
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Patient Bookings</CardTitle>
          <CardDescription>Complete history of patient sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {new Date(booking.bookedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{booking.patientName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{booking.patientEmail}</div>
                        <div className="text-slate-500">{booking.patientPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.completed ? (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkComplete(booking.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No bookings yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
