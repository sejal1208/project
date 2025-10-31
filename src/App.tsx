import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import {
  Heart,
  Users,
  Waves,
  BookOpen,
  User,
  LogOut,
  Shield,
  Stethoscope,
  Activity,
} from "lucide-react";
import {
  AuthProvider,
  useAuth,
} from "./components/auth/AuthProvider";
import { AuthModal } from "./components/auth/AuthModal";
import { RoleSelectionModal } from "./components/auth/RoleSelectionModal";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { LandingPage } from "./components/LandingPage";
import { DoctorDirectory } from "./components/DoctorDirectory";
import { UserDashboard } from "./components/UserDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { DrPortal } from "./components/DrPortal";
import { ChildrenPlatform } from "./components/ChildrenPlatform";
import { VibrationalHealing } from "./components/VibrationalHealing";
import { GitaChatBot } from "./components/GitaChatBot";
import { AnxietyAssessment } from "./components/AnxietyAssessment";

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [anxietyAssessmentOpen, setAnxietyAssessmentOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin' | null>(null);
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setActiveTab("home");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleRoleSelect = (role: 'patient' | 'doctor' | 'admin') => {
    setSelectedRole(role);
    setRoleModalOpen(false);
    setAuthModalOpen(true);
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'patient':
        return <User className="w-4 h-4 text-teal-600" />;
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'patient':
        return 'bg-teal-600';
      case 'doctor':
        return 'bg-blue-600';
      case 'admin':
        return 'bg-purple-600';
      default:
        return 'bg-teal-600';
    }
  };

  // Check if user is a verified doctor (has doctor user ID)
  const isDoctorPortalUser = user?.id === 'doctor_ananda_id' || user?.id === 'doctor_priya_id';

  // Redirect based on role
  React.useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          setActiveTab('admin');
          break;
        case 'doctor':
          // Check if it's a verified doctor user
          if (isDoctorPortalUser) {
            setActiveTab('drportal');
          } else {
            setActiveTab('doctor');
          }
          break;
        case 'patient':
          setActiveTab('dashboard');
          break;
      }
    }
  }, [user, isDoctorPortalUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-teal-800">
                  SoulCare
                </h1>
                <p className="text-xs text-teal-600">
                  Holistic Wellness Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Check Button - Always visible */}
              <Button
                onClick={() => setAnxietyAssessmentOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md"
                size="sm"
              >
                <Activity className="w-4 h-4 mr-2" />
                Quick Check
              </Button>

              {/* Navigation - Show for patients or when logged out, and for verified doctors */}
              {(!user || user.role === 'patient' || isDoctorPortalUser) && (
                <nav className="hidden md:flex items-center space-x-1">
                  {(!user || user.role === 'patient') && (
                    <>
                      <button
                        onClick={() => setActiveTab("home")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeTab === "home"
                            ? "bg-teal-100 text-teal-800"
                            : "text-slate-600 hover:text-teal-700 hover:bg-teal-50"
                        }`}
                      >
                        Home
                      </button>
                      <button
                        onClick={() => setActiveTab("doctors")}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activeTab === "doctors"
                            ? "bg-teal-100 text-teal-800"
                            : "text-slate-600 hover:text-teal-700 hover:bg-teal-50"
                        }`}
                      >
                        Find Doctors
                      </button>
                    </>
                  )}
                  {user && (
                    <button
                      onClick={() => setActiveTab(isDoctorPortalUser ? "drportal" : "dashboard")}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        (activeTab === "dashboard" || activeTab === "drportal")
                          ? "bg-teal-100 text-teal-800"
                          : "text-slate-600 hover:text-teal-700 hover:bg-teal-50"
                      }`}
                    >
                      {isDoctorPortalUser ? "Dr. Portal" : "Dashboard"}
                    </button>
                  )}
                </nav>
              )}

              {/* Auth Section */}
              <div className="flex items-center gap-2">
                {loading ? (
                  <div className="w-8 h-8 bg-teal-100 rounded-full animate-pulse"></div>
                ) : user ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-slate-800 flex items-center gap-2">
                        {getRoleIcon()}
                        {user.fullName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.email}
                      </p>
                    </div>
                    <div className={`w-8 h-8 ${getRoleBadgeColor()} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-sm">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-slate-600 hover:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setRoleModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Admin Dashboard */}
        {user?.role === 'admin' && activeTab === 'admin' && (
          <AdminDashboard />
        )}

        {/* Dr. Portal - for verified doctors */}
        {isDoctorPortalUser && activeTab === 'drportal' && (
          <DrPortal />
        )}

        {/* Doctor Dashboard - for unverified doctors */}
        {user?.role === 'doctor' && !isDoctorPortalUser && activeTab === 'doctor' && (
          <DoctorDashboard />
        )}

        {/* Patient or Public Content */}
        {(!user || user.role === 'patient') && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              className={`grid w-full mb-8 bg-white/50 backdrop-blur-sm border border-teal-100 ${user ? "grid-cols-5" : "grid-cols-4"}`}
            >
              <TabsTrigger
                value="home"
                className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger
                value="doctors"
                className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Doctors</span>
              </TabsTrigger>
              {user && (
                <TabsTrigger
                  value="dashboard"
                  className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Dashboard
                  </span>
                </TabsTrigger>
              )}
              <TabsTrigger
                value="children"
                className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Kids Zone
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="vibrational"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Waves className="w-4 h-4" />
                <span className="hidden sm:inline">Healing</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="mt-0">
              <LandingPage
                onBookSession={() => setActiveTab("doctors")}
              />
            </TabsContent>

            <TabsContent value="doctors" className="mt-0">
              <DoctorDirectory />
            </TabsContent>

            {user && (
              <TabsContent value="dashboard" className="mt-0">
                <UserDashboard />
              </TabsContent>
            )}

            <TabsContent value="children" className="mt-0">
              <ChildrenPlatform />
            </TabsContent>

            <TabsContent value="vibrational" className="mt-0">
              <VibrationalHealing />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSelectRole={handleRoleSelect}
      />

      {/* Auth Modal */}
      {selectedRole && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            setSelectedRole(null);
          }}
          userRole={selectedRole}
        />
      )}

      {/* Anxiety Assessment Modal */}
      <AnxietyAssessment
        isOpen={anxietyAssessmentOpen}
        onClose={() => setAnxietyAssessmentOpen(false)}
      />

      {/* Gita ChatBot - Always visible */}
      <GitaChatBot />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
