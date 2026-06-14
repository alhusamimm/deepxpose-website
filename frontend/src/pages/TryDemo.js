import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Play, AlertTriangle, CheckCircle, FileVideo, Brain, Shield, Zap, Eye } from 'lucide-react';
import { mockDemoAnalysis } from '../mock';

const TryDemo = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [demoStarted, setDemoStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState(false);

  const demoSteps = [
    { name: "Loading demo video", icon: FileVideo, time: 1000 },
    { name: "Video preprocessing", icon: Brain, time: 1200 },
    { name: "Face detection and tracking", icon: Eye, time: 1800 },
    { name: "Temporal consistency analysis", icon: Shield, time: 1500 },
    { name: "Deepfake probability calculation", icon: Zap, time: 1000 }
  ];

  const startDemo = () => {
    setDemoStarted(true);
    setCurrentStep(0);
    setProgress(0);
    setResult(null);
    setCompleted(false);
    runDemoAnalysis();
  };

  const runDemoAnalysis = async () => {
    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      
      // Simulate step processing
      const stepTime = demoSteps[i].time;
      const progressIncrement = 100 / demoSteps.length;
      
      await new Promise(resolve => {
        let stepProgress = 0;
        const interval = setInterval(() => {
          stepProgress += 2;
          setProgress((i * progressIncrement) + (stepProgress * progressIncrement / 100));
          
          if (stepProgress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, stepTime / 50);
      });
    }

    // Show results
    setResult(mockDemoAnalysis);
    setCompleted(true);
  };

  const resetDemo = () => {
    setDemoStarted(false);
    setCurrentStep(0);
    setProgress(0);
    setResult(null);
    setCompleted(false);
  };

  return (
    <div className="dark-container">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-midnight-green to-dark-purple opacity-50"></div>
      
      <div className="relative max-width-container py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="display-large text-text-primary mb-6">{t('tryDemoTitle')}</h1>
          <p className="body-large text-text-secondary max-w-3xl mx-auto mb-8">
            {t('tryDemoSubtitle')}
          </p>
        </div>

        {!demoStarted ? (
          /* Demo Introduction */
          <div className="max-w-4xl mx-auto">
            <Card className="bg-bg-overlay border border-border-subtle p-8 mb-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-brand-primary rounded-sm flex items-center justify-center mx-auto mb-6">
                  <Play size={48} className="text-black" />
                </div>
                <h2 className="heading-2 text-text-primary mb-4">Interactive Demo Experience</h2>
                <p className="body-large text-text-secondary">
                  This demo will showcase our deepfake detection process using a sample video file
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: FileVideo, title: "Sample Video", desc: "Pre-loaded test video for analysis" },
                  { icon: Brain, title: "AI Processing", desc: "Advanced transformer model analysis" },
                  { icon: Shield, title: "Detection", desc: "Real-time deepfake probability scoring" },
                  { icon: CheckCircle, title: "Results", desc: "Detailed forensic report generation" }
                ].map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-bg-primary border border-border-medium rounded-sm flex items-center justify-center mx-auto mb-4">
                      <feature.icon size={24} className="text-brand-primary" />
                    </div>
                    <h3 className="heading-3 text-text-primary mb-2">{feature.title}</h3>
                    <p className="body-small text-text-secondary">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button onClick={startDemo} className="btn-primary px-8 py-4">
                  <Play size={24} />
                  <span>{t('startDemoAnalysis')}</span>
                </Button>
              </div>
            </Card>

            {/* Features Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-bg-overlay border border-border-subtle p-6">
                <h3 className="heading-3 text-text-primary mb-4 flex items-center">
                  <Shield size={20} className="mr-3 text-brand-primary" />
                  What You'll See
                </h3>
                <ul className="space-y-3">
                  {[
                    "Real-time video processing simulation",
                    "Face detection and tracking visualization", 
                    "Temporal consistency analysis results",
                    "Confidence scoring and risk assessment",
                    "Detailed forensic findings report"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={16} className="text-brand-primary mr-3 mt-1 flex-shrink-0" />
                      <span className="body-medium text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-bg-overlay border border-border-subtle p-6">
                <h3 className="heading-3 text-text-primary mb-4 flex items-center">
                  <Zap size={20} className="mr-3 text-brand-primary" />
                  Technology Showcase
                </h3>
                <ul className="space-y-3">
                  {[
                    "Advanced transformer neural networks",
                    "Multi-modal deepfake detection",
                    "Temporal inconsistency analysis",
                    "Facial artifact identification", 
                    "Professional forensic reporting"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Brain size={16} className="text-brand-primary mr-3 mt-1 flex-shrink-0" />
                      <span className="body-medium text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        ) : (
          /* Demo Analysis Interface */
          <div className="max-w-3xl mx-auto">
            {!completed ? (
              <Card className="bg-bg-overlay border border-border-subtle p-8">
                <div className="text-center mb-8">
                  <h2 className="heading-2 text-text-primary mb-4">Analyzing Demo Video</h2>
                  <p className="body-medium text-text-secondary">
                    Processing: demo_video.mp4 (12.4 MB, 00:01:23)
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <Progress value={progress} className="mb-4" />
                  <p className="text-center text-text-muted">
                    {Math.round(progress)}% Complete
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {demoSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <div 
                        key={index}
                        className={`
                          flex items-center p-4 rounded-sm border transition-all duration-300
                          ${isActive ? 'border-brand-primary bg-brand-hover' : 
                            isCompleted ? 'border-green-500/40 bg-green-500/10' : 
                            'border-border-subtle bg-bg-primary'}
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-sm flex items-center justify-center mr-4
                          ${isActive ? 'bg-brand-primary' : 
                            isCompleted ? 'bg-green-500' : 
                            'bg-bg-secondary border border-border-medium'}
                        `}>
                          {isCompleted ? (
                            <CheckCircle size={20} className="text-white" />
                          ) : (
                            <StepIcon size={20} className={isActive ? 'text-black' : 'text-text-muted'} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className={`font-medium ${
                            isActive ? 'text-brand-primary' : 
                            isCompleted ? 'text-green-400' : 
                            'text-text-secondary'
                          }`}>
                            {step.name}
                          </p>
                          {isActive && (
                            <p className="text-sm text-text-muted mt-1">Processing...</p>
                          )}
                          {isCompleted && (
                            <p className="text-sm text-green-400 mt-1">Completed</p>
                          )}
                        </div>
                        
                        {isActive && (
                          <div className="animate-spin w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ) : (
              /* Demo Results */
              <div className="space-y-8">
                <Card className="bg-bg-overlay border border-border-subtle p-8">
                  <div className="text-center mb-8">
                    <h2 className="heading-2 text-text-primary mb-4">Demo Analysis Complete</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Result */}
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-6 bg-red-500/20 border border-red-500/40 rounded-sm flex items-center justify-center">
                        <AlertTriangle size={64} className="text-red-400" />
                      </div>
                      <div className="display-medium text-red-400 mb-2">FAKE</div>
                      <div className="body-large text-text-secondary mb-4">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="body-medium text-red-400">
                        HIGH PROBABILITY OF MANIPULATION
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-border-subtle">
                        <span className="text-text-secondary">Processing Time:</span>
                        <span className="text-text-primary font-medium">{result.processing_time}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border-subtle">
                        <span className="text-text-secondary">File Size:</span>
                        <span className="text-text-primary font-medium">{result.file_size}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border-subtle">
                        <span className="text-text-secondary">Duration:</span>
                        <span className="text-text-primary font-medium">{result.duration}</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-text-secondary">Face Regions:</span>
                        <span className="text-text-primary font-medium">{result.detailed_findings.face_regions}</span>
                      </div>
                    </div>
                  </div>

                  {/* Findings */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-sm p-6 mb-8">
                    <h3 className="heading-3 text-red-400 mb-4">Manipulation Indicators</h3>
                    <ul className="space-y-2">
                      {result.detailed_findings.artifacts_detected.map((artifact, index) => (
                        <li key={index} className="text-text-secondary flex items-start">
                          <AlertTriangle size={16} className="text-red-400 mr-3 mt-1 flex-shrink-0" />
                          {artifact}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="text-center space-y-4">
                    <p className="body-medium text-text-secondary">
                      Ready to analyze your own videos? Sign up for full access to DeepXpose.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={resetDemo} variant="secondary" className="btn-secondary">
                        {t('runDemoAgain')}
                      </Button>
                      <Button onClick={() => navigate('/signup')} className="btn-primary">
                        <CheckCircle size={20} />
                        <span>{t('signUpNow')}</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TryDemo;