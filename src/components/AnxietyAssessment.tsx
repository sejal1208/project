import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Card, CardContent } from './ui/card';
import { Loader2, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { APIClient } from '../utils/supabase/client';
import { useAuth } from './auth/AuthProvider';

interface AnxietyAssessmentProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PredictionResult {
  anxietyLevel: 'low' | 'moderate' | 'high';
  score: number;
  recommendations: string[];
}

export function AnxietyAssessment({ isOpen, onClose }: AnxietyAssessmentProps) {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    stress: 5,
    sleep: 7,
    overwhelmed: 'no'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = await getAccessToken();
      const response = await APIClient.post('/ml/predict-anxiety', {
        stress: parseInt(formData.stress.toString()),
        sleep: parseFloat(formData.sleep.toString()),
        overwhelmed: formData.overwhelmed === 'yes'
      }, token || undefined);

      if (response.prediction) {
        setResult(response.prediction);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Anxiety prediction error:', err);
      setError(err.message || 'Failed to process assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      stress: 5,
      sleep: 7,
      overwhelmed: 'no'
    });
    setResult(null);
    setError(null);
  };

  const getAnxietyColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getAnxietyIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'moderate':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'high':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Activity className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <Activity className="w-5 h-5 text-teal-600" />
            Quick Anxiety Check
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Get an instant ML-powered assessment of your current anxiety level based on key indicators.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stress Level */}
            <div className="space-y-2">
              <Label htmlFor="stress" className="text-slate-700">
                Stress Level (1-10)
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="stress"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.stress}
                  onChange={(e) => setFormData({ ...formData, stress: parseInt(e.target.value) || 1 })}
                  className="flex-1 border-teal-200 focus:border-teal-400"
                  required
                />
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100">
                  <span className="text-lg text-teal-700">{formData.stress}</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Low Stress</span>
                <span>High Stress</span>
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-2">
              <Label htmlFor="sleep" className="text-slate-700">
                Sleep (Hours per night)
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="sleep"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.sleep}
                  onChange={(e) => setFormData({ ...formData, sleep: parseFloat(e.target.value) || 0 })}
                  className="flex-1 border-teal-200 focus:border-teal-400"
                  required
                />
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                  <span className="text-lg text-blue-700">{formData.sleep}h</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Recommended: 7-9 hours</p>
            </div>

            {/* Feeling Overwhelmed */}
            <div className="space-y-2">
              <Label htmlFor="overwhelmed" className="text-slate-700">
                Feeling Overwhelmed?
              </Label>
              <Select 
                value={formData.overwhelmed} 
                onValueChange={(value) => setFormData({ ...formData, overwhelmed: value })}
              >
                <SelectTrigger id="overwhelmed" className="border-teal-200 focus:border-teal-400">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No - I feel in control</SelectItem>
                  <SelectItem value="yes">Yes - I feel overwhelmed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-900">Error</AlertTitle>
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Get Assessment'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Result Card */}
            <Card className={`border-2 ${getAnxietyColor(result.anxietyLevel)}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {getAnxietyIcon(result.anxietyLevel)}
                  <div className="flex-1">
                    <h3 className="text-lg capitalize mb-1">
                      {result.anxietyLevel} Anxiety Level
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            result.anxietyLevel === 'low'
                              ? 'bg-green-600'
                              : result.anxietyLevel === 'moderate'
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${result.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{result.score}%</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <h4 className="text-sm text-slate-700">Recommendations:</h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                Take Another Check
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
