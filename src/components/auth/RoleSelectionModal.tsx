import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { User, Stethoscope, Shield } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'patient' | 'doctor' | 'admin') => void;
}

export function RoleSelectionModal({ isOpen, onClose, onSelectRole }: RoleSelectionModalProps) {
  const roles = [
    {
      id: 'patient' as const,
      title: 'Patient',
      description: 'Book sessions with doctors and join children\'s classes',
      icon: User,
      color: 'teal',
      gradient: 'from-teal-500 to-teal-600'
    },
    {
      id: 'doctor' as const,
      title: 'Doctor',
      description: 'Manage your sessions and view patient bookings',
      icon: Stethoscope,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'admin' as const,
      title: 'Admin',
      description: 'Manage platform, users, and all operations',
      icon: Shield,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-slate-800">
            Welcome to SoulCare
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            Select your role to continue
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-teal-300"
                onClick={() => onSelectRole(role.id)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${role.gradient} rounded-full flex items-center justify-center mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{role.title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{role.description}</p>
                  </div>
                  <Button 
                    className={`w-full bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white`}
                  >
                    Continue as {role.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
