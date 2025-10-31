import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Mail, Eye, EyeOff, AlertCircle, CheckCircle, User, Stethoscope, Shield } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
  userRole: 'patient' | 'doctor' | 'admin';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'signin', userRole }: AuthModalProps) {
  const { signIn, signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const resetForm = () => {
    setEmailForm({ email: '', password: '', fullName: '' });
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await signIn(emailForm.email, emailForm.password, userRole);
      setSuccess('Signed in successfully!');
      setTimeout(handleClose, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (emailForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await signUp(emailForm.email, emailForm.password, emailForm.fullName, userRole);
      setSuccess('Account created successfully!');
      setTimeout(handleClose, 1000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getRoleInfo = () => {
    switch (userRole) {
      case 'patient':
        return { icon: User, color: 'teal', title: 'Patient Portal' };
      case 'doctor':
        return { icon: Stethoscope, color: 'blue', title: 'Doctor Portal' };
      case 'admin':
        return { icon: Shield, color: 'purple', title: 'Admin Portal' };
      default:
        return { icon: User, color: 'teal', title: 'Patient Portal' };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className={`w-12 h-12 bg-${roleInfo.color}-100 rounded-full flex items-center justify-center`}>
              <RoleIcon className={`w-6 h-6 text-${roleInfo.color}-600`} />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl text-slate-800">
            {roleInfo.title}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            Sign in or create an account as {userRole}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value as any);
          resetForm();
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Email Sign In */}
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="border-teal-200 focus:border-teal-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={emailForm.password}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="border-teal-200 focus:border-teal-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className={`w-full bg-${roleInfo.color}-600 hover:bg-${roleInfo.color}-700`}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                Sign In
              </Button>
            </form>
          </TabsContent>

          {/* Email Sign Up */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  placeholder="Enter your full name"
                  value={emailForm.fullName}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  className="border-teal-200 focus:border-teal-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="border-teal-200 focus:border-teal-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password (min 6 characters)"
                    value={emailForm.password}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="border-teal-200 focus:border-teal-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className={`w-full bg-${roleInfo.color}-600 hover:bg-${roleInfo.color}-700`}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Error/Success Messages */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
