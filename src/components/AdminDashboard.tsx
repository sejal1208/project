import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  Activity,
  Settings
} from 'lucide-react';
import { APIClient } from '../utils/supabase/client';
import { useAuth } from './auth/AuthProvider';

export function AdminDashboard() {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeClasses: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      
      // Load stats and bookings
      const [bookingsData] = await Promise.all([
        APIClient.get('/bookings', token)
      ]);

      setRecentBookings(bookingsData.bookings || []);
      
      // Calculate stats
      setStats({
        totalPatients: 45,
        totalDoctors: 12,
        totalBookings: bookingsData.bookings?.length || 0,
        totalRevenue: 125000,
        activeClasses: 8
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'teal', trend: '+12%' },
    { title: 'Total Doctors', value: stats.totalDoctors, icon: Stethoscope, color: 'blue', trend: '+5%' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'purple', trend: '+18%' },
    { title: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'green', trend: '+23%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your wellness platform</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Settings className="w-4 h-4 mr-2" />
          Platform Settings
        </Button>
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
                <div className="flex items-center mt-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.trend} from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest patient session bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading bookings...</div>
              ) : recentBookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}...</TableCell>
                        <TableCell>Patient #{booking.userId.slice(0, 8)}</TableCell>
                        <TableCell>{booking.classId ? 'Class' : 'Session'}</TableCell>
                        <TableCell>{new Date(booking.bookedAt).toLocaleDateString()}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-slate-500">No bookings yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doctors Management</CardTitle>
              <CardDescription>Manage doctor profiles and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-slate-800">Dr. Sarah Williams</h4>
                      <p className="text-sm text-slate-600">Spiritual Counselor • 45 Sessions</p>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-slate-800">Dr. Michael Chen</h4>
                      <p className="text-sm text-slate-600">Meditation Expert • 38 Sessions</p>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>View and manage patient accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                Patient management features coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Children's Classes</CardTitle>
              <CardDescription>Manage meditation and wellness classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                {stats.activeClasses} active classes running
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
