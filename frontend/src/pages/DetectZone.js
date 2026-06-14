import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Upload, FileVideo, Clock, Shield, AlertTriangle, CheckCircle, Download, FileText } from 'lucide-react';
import { analyzeVideo, generateAnalysisReport } from '../mock';

const DetectZone = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [report, setReport] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = async (file) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check file type
    const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, MOV, AVI, MKV, WebM)');
      return;
    }

    // Check file size (limit based on user plan)
    const maxSize = user.subscription === 'BASIC' ? 500 * 1024 * 1024 : // 500MB
                   user.subscription === 'PRO' ? 2 * 1024 * 1024 * 1024 : // 2GB
                   100 * 1024 * 1024; // 100MB for trial

    if (file.size > maxSize) {
      alert(`File too large. Maximum size for ${user.subscription} plan: ${Math.floor(maxSize / (1024 * 1024))}MB`);
      return;
    }

    setCurrentFile(file);
    setAnalysisResult(null);
    setReport(null);

    // Simulate upload
    setUploading(true);
    setUploadProgress(0);
    
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploading(false);
          startAnalysis(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const startAnalysis = async (file) => {
    setAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const analysisInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(analysisInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 300);

    try {
      const result = await analyzeVideo(file);
      setAnalysisResult(result);
      setAnalysisProgress(100);
      setAnalyzing(false);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalyzing(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!analysisResult || !user) return;
    
    // Navigate to the report generation page with analysis data
    navigate('/report', { 
      state: { 
        analysisData: analysisResult 
      } 
    });
  };

  const getRiskColor = (result, confidence) => {
    if (result === 'FAKE') {
      return confidence > 0.8 ? 'text-red-400' : 'text-yellow-400';
    }
    return 'text-green-400';
  };

  const getRiskLevel = (result, confidence) => {
    if (result === 'FAKE') {
      return confidence > 0.8 ? t('riskHigh') : t('riskMedium');
    }
    return t('riskLow');
  };

  return (
    <div className="dark-container">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-midnight-green-3 to-dark-purple opacity-40"></div>
      
      <div className="relative max-width-container py-12">
        <div className="text-center mb-12">
          <h1 className="display-large text-text-primary mb-4">{t('uploadTitle')}</h1>
          <p className="body-large text-text-secondary max-w-2xl mx-auto">
            Upload your video files for instant AI-powered deepfake detection analysis
          </p>
        </div>

        {!currentFile && (
          <Card className="max-w-2xl mx-auto bg-bg-overlay border border-border-subtle p-12">
            <div
              className={`
                border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
                ${dragActive 
                  ? 'border-brand-primary bg-brand-hover' 
                  : 'border-border-medium hover:border-brand-primary hover:bg-bg-overlay'
                }
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-brand-primary rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Upload size={40} className="text-black" />
                </div>
              </div>
              
              <h3 className="heading-2 text-text-primary mb-4">{t('uploadSubtitle')}</h3>
              <p className="body-medium text-text-secondary mb-6">
                {t('supportedFormats')}
              </p>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                <FileVideo size={20} />
                <span>{t('chooseFile')}</span>
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          </Card>
        )}

        {/* Upload Progress */}
        {uploading && currentFile && (
          <Card className="max-w-2xl mx-auto bg-bg-overlay border border-border-subtle p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-primary rounded-sm flex items-center justify-center mx-auto mb-4">
                <FileVideo size={32} className="text-black" />
              </div>
              <h3 className="heading-3 text-text-primary">Uploading {currentFile.name}</h3>
              <p className="body-medium text-text-secondary mt-2">
                {(currentFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
            <Progress value={uploadProgress} className="mb-4" />
            <p className="text-center text-text-muted">{uploadProgress}% uploaded</p>
          </Card>
        )}

        {/* Analysis Progress */}
        {analyzing && currentFile && (
          <Card className="max-w-2xl mx-auto bg-bg-overlay border border-border-subtle p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-primary rounded-sm flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-black animate-pulse" />
              </div>
              <h3 className="heading-3 text-text-primary">{t('analyzing')}</h3>
              <p className="body-medium text-text-secondary mt-2">
                AI processing: {currentFile.name}
              </p>
            </div>
            <Progress value={analysisProgress} className="mb-4" />
            <p className="text-center text-text-muted">
              {analysisProgress < 30 && "Preprocessing video frames..."}
              {analysisProgress >= 30 && analysisProgress < 60 && "Detecting faces and regions..."}
              {analysisProgress >= 60 && analysisProgress < 90 && "Analyzing temporal consistency..."}
              {analysisProgress >= 90 && "Finalizing analysis..."}
            </p>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && !analyzing && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-bg-overlay border border-border-subtle p-8">
              <div className="text-center mb-8">
                <h2 className="display-medium text-text-primary mb-4">{t('resultsTitle')}</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Result */}
                <div className="text-center">
                  <div className={`
                    w-32 h-32 mx-auto mb-6 rounded-sm flex items-center justify-center
                    ${analysisResult.result === 'FAKE' ? 'bg-red-500/20 border border-red-500/40' : 'bg-green-500/20 border border-green-500/40'}
                  `}>
                    {analysisResult.result === 'FAKE' ? 
                      <AlertTriangle size={64} className="text-red-400" /> : 
                      <CheckCircle size={64} className="text-green-400" />
                    }
                  </div>
                  <div className={`display-medium mb-2 ${getRiskColor(analysisResult.result, analysisResult.confidence)}`}>
                    {t(analysisResult.result.toLowerCase())}
                  </div>
                  <div className="body-large text-text-secondary mb-4">
                    {t('confidence')}: {(analysisResult.confidence * 100).toFixed(1)}%
                  </div>
                  <div className={`body-medium ${getRiskColor(analysisResult.result, analysisResult.confidence)}`}>
                    {getRiskLevel(analysisResult.result, analysisResult.confidence)}
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border-subtle">
                    <span className="text-text-secondary">{t('fileName')}</span>
                    <span className="text-text-primary font-medium">{analysisResult.filename}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border-subtle">
                    <span className="text-text-secondary">{t('processingTime')}:</span>
                    <span className="text-text-primary font-medium">{analysisResult.processing_time}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border-subtle">
                    <span className="text-text-secondary">{t('fileSize')}</span>
                    <span className="text-text-primary font-medium">{analysisResult.file_size}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border-subtle">
                    <span className="text-text-secondary">{t('faceRegions')}:</span>
                    <span className="text-text-primary font-medium">{analysisResult.detailed_analysis.face_regions}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-secondary">{t('temporalIssues')}:</span>
                    <span className="text-text-primary font-medium">{analysisResult.detailed_analysis.temporal_inconsistencies}</span>
                  </div>
                </div>
              </div>

              {/* Artifacts Detected */}
              {analysisResult.detailed_analysis.artifacts_detected.length > 0 && (
                <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-sm">
                  <h3 className="heading-3 text-red-400 mb-4 flex items-center">
                    <AlertTriangle size={20} className="mr-2" />
                    {t('manipulationIndicatorsDetected')}
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.detailed_analysis.artifacts_detected.map((artifact, index) => (
                      <li key={index} className="text-text-secondary flex items-start">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        {artifact}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions for All Users */}
              <div className="mt-8 text-center space-y-4">
                <div className="bg-bg-overlay border border-border-subtle rounded-lg p-6">
                  <h4 className="heading-3 text-text-primary mb-3">Analysis Complete</h4>
                  <p className="body-medium text-text-secondary mb-4">
                    {user?.role === 'END_USER' 
                      ? 'Your video analysis is complete. Generate a detailed report below.'
                      : 'Professional forensic analysis complete. Generate comprehensive report.'
                    }
                  </p>
                  
                  {/* Generate Report Button for All Users */}
                  <Button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="btn-primary"
                  >
                    {generatingReport ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>{t('generating')}</span>
                      </>
                    ) : (
                      <>
                        <FileText size={20} />
                        <span>{t('generateReport')}</span>
                      </>
                    )}
                  </Button>
                  
                  {user?.role === 'END_USER' && (
                    <p className="text-text-muted text-sm mt-2">
                      {t('upgradeToInvestigator')}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Report Display */}
            {report && (
              <Card className="bg-bg-overlay border border-border-subtle p-8">
                <h3 className="heading-2 text-text-primary mb-6 flex items-center">
                  <FileText size={24} className="mr-3" />
                  {t('forensicReport')}
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="heading-3 text-text-primary mb-3">{t('executiveSummary')}</h4>
                    <p className="body-medium text-text-secondary">{report.executive_summary}</p>
                  </div>
                  
                  {report.technical_findings.length > 0 && (
                    <div>
                      <h4 className="heading-3 text-text-primary mb-3">{t('technicalFindings')}</h4>
                      <ul className="space-y-2">
                        {report.technical_findings.map((finding, index) => (
                          <li key={index} className="text-text-secondary flex items-start">
                            <span className="w-2 h-2 bg-brand-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="heading-3 text-text-primary mb-3">{t('recommendations')}</h4>
                    <ul className="space-y-2">
                      {report.recommendations.map((rec, index) => (
                        <li key={index} className="text-text-secondary flex items-start">
                          <CheckCircle size={16} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-6 border-t border-border-subtle">
                    <Button className="btn-primary">
                      <Download size={20} />
                      <span>{t('downloadReport')}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* New Analysis Button */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setCurrentFile(null);
                  setAnalysisResult(null);
                  setReport(null);
                }}
                variant="secondary"
                className="btn-secondary"
              >
                {t('analyzeAnotherVideo')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectZone;