import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { User, Heart, Brain, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { APIClient } from '../../utils/supabase/client';

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function PatientDetailsModal({ isOpen, onClose, onComplete }: PatientDetailsModalProps) {
  const { user, getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const [personalDetails, setPersonalDetails] = useState({
    dateOfBirth: '',
    gender: '',
    occupation: '',
    maritalStatus: '',
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [medicalHistory, setMedicalHistory] = useState({
    currentMedications: '',
    allergies: '',
    chronicConditions: [],
    previousTherapy: '',
    familyHistory: '',
    surgeries: '',
    smokingStatus: '',
    alcoholConsumption: '',
    exerciseFrequency: ''
  });

  const [mentalHealthInfo, setMentalHealthInfo] = useState({
    primaryConcerns: [],
    symptomsExperienced: [],
    triggerFactors: '',
    copingMechanisms: '',
    stressLevel: '',
    sleepQuality: '',
    socialSupport: '',
    previousCounseling: '',
    spiritualPractices: [],
    lifeGoals: ''
  });

  const [preferences, setPreferences] = useState({
    preferredLanguage: '',
    communicationStyle: '',
    sessionPreference: '',
    culturalConsiderations: '',
    religiousBackground: '',
    dietaryRestrictions: '',
    availableTimeSlots: [],
    sessionFrequency: '',
    privacyLevel: ''
  });

  const chronicConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 
    'Thyroid Disorders', 'Kidney Disease', 'Liver Disease', 'Cancer History'
  ];

  const primaryConcerns = [
    'Anxiety', 'Depression', 'Stress', 'Relationship Issues', 'Work Stress',
    'Family Problems', 'Grief/Loss', 'Trauma', 'Self-Esteem', 'Life Transitions',
    'Spiritual Crisis', 'Purpose/Meaning', 'Anger Management', 'Sleep Issues'
  ];

  const symptoms = [
    'Persistent Sadness', 'Excessive Worry', 'Panic Attacks', 'Mood Swings',
    'Difficulty Concentrating', 'Sleep Disturbances', 'Appetite Changes',
    'Fatigue', 'Irritability', 'Social Withdrawal', 'Restlessness', 'Memory Issues'
  ];

  const spiritualPractices = [
    'Meditation', 'Prayer', 'Yoga', 'Chanting', 'Reading Scriptures',
    'Attending Religious Services', 'Mindfulness', 'Journaling', 'Nature Connection'
  ];

  const availableSlots = [
    'Early Morning (6-9 AM)', 'Morning (9-12 PM)', 'Afternoon (12-4 PM)',
    'Evening (4-7 PM)', 'Night (7-10 PM)', 'Weekends Only', 'Flexible'
  ];

  const handleCheckboxChange = (category: string, item: string, checked: boolean) => {
    if (category === 'chronicConditions') {
      setMedicalHistory(prev => ({
        ...prev,
        chronicConditions: checked 
          ? [...prev.chronicConditions, item]
          : prev.chronicConditions.filter(c => c !== item)
      }));
    } else if (category === 'primaryConcerns') {
      setMentalHealthInfo(prev => ({
        ...prev,
        primaryConcerns: checked
          ? [...prev.primaryConcerns, item]
          : prev.primaryConcerns.filter(c => c !== item)
      }));
    } else if (category === 'symptoms') {
      setMentalHealthInfo(prev => ({
        ...prev,
        symptomsExperienced: checked
          ? [...prev.symptomsExperienced, item]
          : prev.symptomsExperienced.filter(s => s !== item)
      }));
    } else if (category === 'spiritualPractices') {
      setMentalHealthInfo(prev => ({
        ...prev,
        spiritualPractices: checked
          ? [...prev.spiritualPractices, item]
          : prev.spiritualPractices.filter(s => s !== item)
      }));
    } else if (category === 'availableTimeSlots') {
      setPreferences(prev => ({
        ...prev,
        availableTimeSlots: checked
          ? [...prev.availableTimeSlots, item]
          : prev.availableTimeSlots.filter(t => t !== item)
      }));
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Please sign in to continue');
      }

      const profileData = {
        personalDetails,
        medicalHistory,
        mentalHealthInfo,
        preferences,
        completedAt: new Date().toISOString()
      };

      await APIClient.post('/profile/complete', profileData, token);
      
      setSuccess(true);
      onComplete?.();
      
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setStep(1);
      setSuccess(false);
      setError('');
      onClose();
    }
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Profile Completion Success</DialogTitle>
            <DialogDescription className="sr-only">Your patient profile has been successfully completed</DialogDescription>
          </DialogHeader>
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl text-slate-800">Profile Completed!</h3>
            <p className="text-slate-600">
              Thank you for providing your details. This will help our doctors provide better personalized care.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-slate-800">
            Complete Your Patient Profile
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            Help us provide better personalized care by completing your comprehensive health profile
          </DialogDescription>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= num
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalDetails.dateOfBirth}
                    onChange={(e) => setPersonalDetails(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="border-teal-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={personalDetails.gender} onValueChange={(value) => 
                    setPersonalDetails(prev => ({ ...prev, gender: value }))
                  }>
                    <SelectTrigger className="border-teal-200">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={personalDetails.occupation}
                    onChange={(e) => setPersonalDetails(prev => ({ ...prev, occupation: e.target.value }))}
                    className="border-teal-200"
                    placeholder="Your profession"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select value={personalDetails.maritalStatus} onValueChange={(value) => 
                    setPersonalDetails(prev => ({ ...prev, maritalStatus: value }))
                  }>
                    <SelectTrigger className="border-teal-200">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                      <SelectItem value="separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={personalDetails.emergencyContact}
                    onChange={(e) => setPersonalDetails(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    className="border-teal-200"
                    placeholder="Contact person name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={personalDetails.emergencyPhone}
                    onChange={(e) => setPersonalDetails(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                    className="border-teal-200"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={personalDetails.address}
                    onChange={(e) => setPersonalDetails(prev => ({ ...prev, address: e.target.value }))}
                    className="border-teal-200"
                    placeholder="Your complete address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={personalDetails.city}
                    onChange={(e) => setPersonalDetails(prev => ({ ...prev, city: e.target.value }))}
                    className="border-teal-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={personalDetails.state}
                    onChange={(e) => setPersonalDetails(prev => ({ ...prev, state: e.target.value }))}
                    className="border-teal-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    value={personalDetails.pincode}
                    onChange={(e) => setPersonalDetails(prev => ({ ...prev, pincode: e.target.value }))}
                    className="border-teal-200"
                    placeholder="123456"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Medical History */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-teal-600" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">Current Medications</Label>
                    <Textarea
                      id="currentMedications"
                      value={medicalHistory.currentMedications}
                      onChange={(e) => setMedicalHistory(prev => ({ ...prev, currentMedications: e.target.value }))}
                      className="border-teal-200"
                      placeholder="List all current medications and dosages"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={medicalHistory.allergies}
                      onChange={(e) => setMedicalHistory(prev => ({ ...prev, allergies: e.target.value }))}
                      className="border-teal-200"
                      placeholder="Food, drug, or environmental allergies"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Chronic Conditions (Select all that apply)</Label>
                  <div className="grid md:grid-cols-3 gap-2">
                    {chronicConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={medicalHistory.chronicConditions.includes(condition)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('chronicConditions', condition, checked as boolean)
                          }
                        />
                        <Label htmlFor={condition} className="text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="previousTherapy">Previous Therapy/Counseling</Label>
                    <Textarea
                      id="previousTherapy"
                      value={medicalHistory.previousTherapy}
                      onChange={(e) => setMedicalHistory(prev => ({ ...prev, previousTherapy: e.target.value }))}
                      className="border-teal-200"
                      placeholder="Details about previous mental health treatment"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyHistory">Family Medical History</Label>
                    <Textarea
                      id="familyHistory"
                      value={medicalHistory.familyHistory}
                      onChange={(e) => setMedicalHistory(prev => ({ ...prev, familyHistory: e.target.value }))}
                      className="border-teal-200"
                      placeholder="Relevant family medical history"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smokingStatus">Smoking Status</Label>
                    <Select value={medicalHistory.smokingStatus} onValueChange={(value) => 
                      setMedicalHistory(prev => ({ ...prev, smokingStatus: value }))
                    }>
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="current">Current smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                    <Select value={medicalHistory.alcoholConsumption} onValueChange={(value) => 
                      setMedicalHistory(prev => ({ ...prev, alcoholConsumption: value }))
                    }>
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                    <Select value={medicalHistory.exerciseFrequency} onValueChange={(value) => 
                      setMedicalHistory(prev => ({ ...prev, exerciseFrequency: value }))
                    }>
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="1-2-week">1-2 times/week</SelectItem>
                        <SelectItem value="3-4-week">3-4 times/week</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Mental Health Information */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-teal-600" />
                  Mental Health & Spiritual Well-being
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Primary Concerns (Select all that apply)</Label>
                  <div className="grid md:grid-cols-3 gap-2">
                    {primaryConcerns.map((concern) => (
                      <div key={concern} className="flex items-center space-x-2">
                        <Checkbox
                          id={concern}
                          checked={mentalHealthInfo.primaryConcerns.includes(concern)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('primaryConcerns', concern, checked as boolean)
                          }
                        />
                        <Label htmlFor={concern} className="text-sm">{concern}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Symptoms Experienced (Select all that apply)</Label>
                  <div className="grid md:grid-cols-3 gap-2">
                    {symptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={mentalHealthInfo.symptomsExperienced.includes(symptom)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('symptoms', symptom, checked as boolean)
                          }
                        />
                        <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Spiritual Practices (Select all that apply)</Label>
                  <div className="grid md:grid-cols-3 gap-2">
                    {spiritualPractices.map((practice) => (
                      <div key={practice} className="flex items-center space-x-2">
                        <Checkbox
                          id={practice}
                          checked={mentalHealthInfo.spiritualPractices.includes(practice)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('spiritualPractices', practice, checked as boolean)
                          }
                        />
                        <Label htmlFor={practice} className="text-sm">{practice}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="triggerFactors">Trigger Factors</Label>
                    <Textarea
                      id="triggerFactors"
                      value={mentalHealthInfo.triggerFactors}
                      onChange={(e) => setMentalHealthInfo(prev => ({ ...prev, triggerFactors: e.target.value }))}
                      className="border-teal-200"
                      placeholder="What triggers your stress or anxiety?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="copingMechanisms">Current Coping Mechanisms</Label>
                    <Textarea
                      id="copingMechanisms"
                      value={mentalHealthInfo.copingMechanisms}
                      onChange={(e) => setMentalHealthInfo(prev => ({ ...prev, copingMechanisms: e.target.value }))}
                      className="border-teal-200"
                      placeholder="How do you currently manage stress?"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stressLevel">Current Stress Level</Label>
                    <Select value={mentalHealthInfo.stressLevel} onValueChange={(value) => 
                      setMentalHealthInfo(prev => ({ ...prev, stressLevel: value }))
                    }>
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (1-3)</SelectItem>
                        <SelectItem value="moderate">Moderate (4-6)</SelectItem>
                        <SelectItem value="high">High (7-8)</SelectItem>
                        <SelectItem value="severe">Severe (9-10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleepQuality">Sleep Quality</Label>
                    <Select value={mentalHealthInfo.sleepQuality} onValueChange={(value) => 
                      setMentalHealthInfo(prev => ({ ...prev, sleepQuality: value }))
                    }>
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socialSupport">Social Support Level</Label>
                    <Select value={mentalHealthInfo.socialSupport} onValueChange={(value) => 
                      setMentalHealthInfo(prev => ({ ...prev, socialSupport: value }))
                    }>
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strong">Strong</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="weak">Weak</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lifeGoals">Life Goals & Aspirations</Label>
                  <Textarea
                    id="lifeGoals"
                    value={mentalHealthInfo.lifeGoals}
                    onChange={(e) => setMentalHealthInfo(prev => ({ ...prev, lifeGoals: e.target.value }))}
                    className="border-teal-200"
                    placeholder="What are your main life goals and aspirations?"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  Treatment Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Select value={preferences.preferredLanguage} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, preferredLanguage: value }))
                    }>
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="telugu">Telugu</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                        <SelectItem value="marathi">Marathi</SelectItem>
                        <SelectItem value="gujarati">Gujarati</SelectItem>
                        <SelectItem value="kannada">Kannada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionPreference">Session Preference</Label>
                    <Select value={preferences.sessionPreference} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, sessionPreference: value }))
                    }>
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="chat">Text Chat</SelectItem>
                        <SelectItem value="in-person">In-Person (if available)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Time Slots (Select all that apply)</Label>
                  <div className="grid md:grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <div key={slot} className="flex items-center space-x-2">
                        <Checkbox
                          id={slot}
                          checked={preferences.availableTimeSlots.includes(slot)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('availableTimeSlots', slot, checked as boolean)
                          }
                        />
                        <Label htmlFor={slot} className="text-sm">{slot}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionFrequency">Preferred Session Frequency</Label>
                    <Select value={preferences.sessionFrequency} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, sessionFrequency: value }))
                    }>
                      <SelectTrigger className="border-teal-200">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="as-needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="religiousBackground">Religious/Spiritual Background</Label>
                    <Input
                      id="religiousBackground"
                      value={preferences.religiousBackground}
                      onChange={(e) => setPreferences(prev => ({ ...prev, religiousBackground: e.target.value }))}
                      className="border-teal-200"
                      placeholder="e.g., Hindu, Buddhist, Christian, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culturalConsiderations">Cultural Considerations</Label>
                  <Textarea
                    id="culturalConsiderations"
                    value={preferences.culturalConsiderations}
                    onChange={(e) => setPreferences(prev => ({ ...prev, culturalConsiderations: e.target.value }))}
                    className="border-teal-200"
                    placeholder="Any cultural or religious considerations for treatment"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                disabled={loading}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            
            {step < 4 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}