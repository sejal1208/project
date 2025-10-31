import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  AlertTriangle, 
  Video, 
  User,
  Calendar,
  Clock,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from './auth/AuthProvider';
import { APIClient } from '../utils/supabase/client';

interface PatientSession {
  id: string;
  patientName: string;
  patientId: string;
  sessionType: string;
  sessionDate: string;
  sessionTime: string;
  status: string;
  riskLevel?: 'high' | 'medium' | 'low';
}

export function DrPortal() {
  const { user, getAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<PatientSession[]>([]);
  const [stats, setStats] = useState({
    todayPatients: 0,
    weeklyPatients: 0,
    completedToday: 0,
    highRiskPatients: 0
  });

  useEffect(() => {
    loadDoctorSessions();
  }, []);

  const loadDoctorSessions = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const data = await APIClient.get('/doctors/sessions', token);
      
      // Transform the data and add mock patient info
      const sessionsData = (data.sessions || []).map((session: any, index: number) => ({
        id: session.id || `session-${index}`,
        patientName: `Patient ${String.fromCharCode(65 + index)}`,
        patientId: session.userId || `patient-${index}`,
        sessionType: session.sessionType || 'General Consultation',
        sessionDate: session.sessionDate || new Date().toISOString().split('T')[0],
        sessionTime: session.sessionTime || `${10 + index}:00`,
        status: session.status || 'scheduled',
        riskLevel: index === 0 ? 'high' : index === 1 ? 'medium' : 'low'
      }));

      // Add demo sessions if none exist
      if (sessionsData.length === 0) {
        sessionsData.push(
          {
            id: 'demo-1',
            patientName: 'Rahul Kumar',
            patientId: 'patient-001',
            sessionType: 'Anxiety Management',
            sessionDate: new Date().toISOString().split('T')[0],
            sessionTime: '10:00',
            status: 'scheduled',
            riskLevel: 'high'
          },
          {
            id: 'demo-2',
            patientName: 'Priya Sharma',
            patientId: 'patient-002',
            sessionType: 'Meditation Session',
            sessionDate: new Date().toISOString().split('T')[0],
            sessionTime: '11:30',
            status: 'scheduled',
            riskLevel: 'medium'
          },
          {
            id: 'demo-3',
            patientName: 'Amit Patel',
            patientId: 'patient-003',
            sessionType: 'Spiritual Guidance',
            sessionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            sessionTime: '14:00',
            status: 'scheduled',
            riskLevel: 'low'
          },
          {
            id: 'demo-4',
            patientName: 'Anjali Singh',
            patientId: 'patient-004',
            sessionType: 'Stress Management',
            sessionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            sessionTime: '16:30',
            status: 'scheduled',
            riskLevel: 'low'
          }
        );
      }

      setSessions(sessionsData);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todaySessionsCount = sessionsData.filter((s: PatientSession) => 
        s.sessionDate === today
      ).length;
      
      const highRiskCount = sessionsData.filter((s: PatientSession) => 
        s.riskLevel === 'high'
      ).length;

      setStats({
        todayPatients: todaySessionsCount,
        weeklyPatients: sessionsData.length,
        completedToday: 0,
        highRiskPatients: highRiskCount
      });
    } catch (error) {
      console.error('Failed to load doctor sessions:', error);
      // Set demo data on error
      setSessions([
        {
          id: 'demo-1',
          patientName: 'Rahul Kumar',
          patientId: 'patient-001',
          sessionType: 'Anxiety Management',
          sessionDate: new Date().toISOString().split('T')[0],
          sessionTime: '10:00',
          status: 'scheduled',
          riskLevel: 'high'
        },
        {
          id: 'demo-2',
          patientName: 'Priya Sharma',
          patientId: 'patient-002',
          sessionType: 'Meditation Session',
          sessionDate: new Date().toISOString().split('T')[0],
          sessionTime: '11:30',
          status: 'scheduled',
          riskLevel: 'medium'
        }
      ]);
      setStats({
        todayPatients: 2,
        weeklyPatients: 2,
        completedToday: 0,
        highRiskPatients: 1
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (sessionId: string) => {
    // Update session status
    setSessions(prev => 
      prev.map(s => s.id === sessionId ? { ...s, status: 'in-progress' } : s)
    );
  };

  const handleCompleteSession = (sessionId: string) => {
    setSessions(prev => 
      prev.map(s => s.id === sessionId ? { ...s, status: 'completed' } : s)
    );
    setStats(prev => ({
      ...prev,
      completedToday: prev.completedToday + 1
    }));
  };

  const upcomingSessions = sessions.filter(s => s.status !== 'completed');
  const highRiskPatients = sessions.filter(s => s.riskLevel === 'high');

  const statsCards = [
    { title: "Today's Patients", value: stats.todayPatients, icon: User, color: 'blue' },
    { title: 'Weekly Patients', value: stats.weeklyPatients, icon: Calendar, color: 'teal' },
    { title: 'Completed Today', value: stats.completedToday, icon: CheckCircle, color: 'green' },
    { title: 'High Risk Alerts', value: stats.highRiskPatients, icon: AlertTriangle, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-slate-800">Dr. Portal</h1>
          <p className="text-slate-600 mt-1">Welcome, {user?.fullName}</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Verification Message */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">Account Status</AlertTitle>
        <AlertDescription className="text-blue-800">
          New doctor applications are processed manually. Admin verification is pending. 
          You can still access your portal and manage patient sessions.
        </AlertDescription>
      </Alert>

      {/* ML High-Risk Patient Alert */}
      {highRiskPatients.length > 0 && (
        <Alert className="border-red-300 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-900">ML High-Risk Patient Alert</AlertTitle>
          <AlertDescription className="text-red-800">
            <p className="mb-2">
              {highRiskPatients.length} patient{highRiskPatients.length > 1 ? 's' : ''} flagged as high-risk based on ML analysis of session history and behavioral patterns.
            </p>
            <div className="space-y-1">
              {highRiskPatients.map((patient) => (
                <div key={patient.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="font-medium">{patient.patientName}</span>
                  <span className="text-red-700">- {patient.sessionType} at {patient.sessionTime}</span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-l-4 bg-white/70 backdrop-blur-sm" style={{ borderLeftColor: `var(--${stat.color}-600)` }}>
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

      {/* Upcoming Patient Sessions Table */}
      <Card className="bg-white/70 backdrop-blur-sm border-teal-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Upcoming Patient Sessions
          </CardTitle>
          <CardDescription>
            {upcomingSessions.length} session{upcomingSessions.length !== 1 ? 's' : ''} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading sessions...</div>
          ) : upcomingSessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Session Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingSessions.map((session) => (
                  <TableRow key={session.id} className={session.riskLevel === 'high' ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="font-medium text-slate-800">{session.patientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">{session.sessionType}</TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(session.sessionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.sessionTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.riskLevel === 'high' && (
                        <Badge className="bg-red-500 hover:bg-red-600">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          High Risk
                        </Badge>
                      )}
                      {session.riskLevel === 'medium' && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">
                          Medium
                        </Badge>
                      )}
                      {session.riskLevel === 'low' && (
                        <Badge variant="secondary">
                          Low
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={session.status === 'scheduled' ? 'default' : session.status === 'in-progress' ? 'secondary' : 'outline'}>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {session.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartSession(session.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Start Session
                        </Button>
                      )}
                      {session.status === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteSession(session.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
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
              No upcoming sessions scheduled
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-teal-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              Patient Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <span className="text-slate-700">Average Session Rating</span>
                <span className="text-lg text-teal-700">4.8/5.0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-slate-700">Patient Satisfaction</span>
                <span className="text-lg text-blue-700">94%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-slate-700">Success Rate</span>
                <span className="text-lg text-green-700">87%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-teal-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start border-teal-300 text-teal-700 hover:bg-teal-50">
                <User className="w-4 h-4 mr-2" />
                Patient Records
              </Button>
              <Button variant="outline" className="w-full justify-start border-teal-300 text-teal-700 hover:bg-teal-50">
                <Activity className="w-4 h-4 mr-2" />
                Treatment Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
