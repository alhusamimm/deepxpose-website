import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Play, Shield, Clock, Eye, CheckCircle, AlertTriangle, ExternalLink, Verified, Filter } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';

const TrendingAnalysis = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [analyzingVideo, setAnalyzingVideo] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState(null);

  const platforms = ['All', 'X', 'Instagram', 'YouTube'];
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Load trending videos from backend
  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/trending-videos`, {
          params: { 
            ...(activeFilter !== 'All' ? { platform: activeFilter } : {}),
            include_analysis: false  // Don't load existing analysis results
          }
        });
        setVideos(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching trending videos:', error);
      setError(t('failedToLoadVideos'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, [activeFilter, backendUrl]);

  // Filter videos based on active platform (client-side backup)
  const filteredVideos = activeFilter === 'All' 
    ? videos 
    : videos.filter(video => video.platform === activeFilter);

  // Scroll animation setup
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s ease-out';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredVideos]);

  const handleAnalyzeVideo = async (videoId) => {
    if (!user) {
      // Prompt the user to sign in before running an analysis
      setError(t('loginToCheck'));
      setTimeout(() => navigate('/login'), 1200);
      return;
    }

    setError(null);
    setAnalyzingVideo(videoId);
    setAnalysisProgress(0);

    // Simulate progress with more realistic timing
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 400);

    try {
      const video = videos.find(v => v.id === videoId);
      const response = await axios.post(`${backendUrl}/api/analyze-video`, {
        video_id: videoId,
        video_url: video?.url
      });

      const result = response.data;
      
      // Update the video with analysis result
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                analyzed: true, 
                analysis_result: {
                  id: result.id,
                  result: result.result,
                  confidence: result.confidence,
                  processing_time: result.processing_time,
                  risk_factors: result.risk_factors
                }
              }
            : video
        )
      );
      
      setAnalysisProgress(100);
      
      // Clear progress after a short delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setAnalysisProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      clearInterval(progressInterval);
      setError('Analysis failed. Please try again.');
    } finally {
      setTimeout(() => {
        setAnalyzingVideo(null);
      }, 1000);
    }
  };

  const handleGenerateReport = async (video) => {
    if (!video.analysis_result || user?.role !== 'INVESTIGATOR') {
      return;
    }

    try {
      // Create PDF document
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 30;

      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DeepXpose Forensic Analysis Report', margin, yPosition);
      
      yPosition += 20;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);
      
      yPosition += 15;
      pdf.text(`Analyst: ${user.name} (${user.organization || 'N/A'})`, margin, yPosition);

      // Video Information
      yPosition += 25;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Video Information', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      const videoInfo = [
        `Title: ${video.title}`,
        `Platform: ${video.platform}`,
        `URL: ${video.url}`,
        `Duration: ${video.duration}`,
        `Engagement: ${video.engagement}`,
        `Timestamp: ${video.timestamp}`,
        `Verified Account: ${video.verified_account ? 'Yes' : 'No'}`
      ];

      videoInfo.forEach(info => {
        pdf.text(info, margin, yPosition);
        yPosition += 8;
      });

      // Analysis Results
      yPosition += 15;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analysis Results', margin, yPosition);

      yPosition += 15;
      pdf.setFontSize(12);
      
      // Result with color coding
      const resultColor = video.analysis_result.result === 'FAKE' ? [255, 0, 0] : [0, 128, 0];
      pdf.setTextColor(...resultColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Detection Result: ${video.analysis_result.result}`, margin, yPosition);
      
      yPosition += 10;
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Confidence Score: ${(video.analysis_result.confidence * 100).toFixed(1)}%`, margin, yPosition);
      
      yPosition += 8;
      pdf.text(`Processing Time: ${video.analysis_result.processing_time}`, margin, yPosition);
      
      yPosition += 8;
      pdf.text(`Analysis ID: ${video.analysis_result.id}`, margin, yPosition);

      // Risk Factors
      if (video.analysis_result.risk_factors && video.analysis_result.risk_factors.length > 0) {
        yPosition += 15;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Key Findings:', margin, yPosition);
        
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        video.analysis_result.risk_factors.forEach((factor, index) => {
          pdf.text(`${index + 1}. ${factor}`, margin + 5, yPosition);
          yPosition += 8;
        });
      }

      // Summary
      yPosition += 15;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Executive Summary:', margin, yPosition);
      
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      const summaryText = video.analysis_result.result === 'FAKE' 
        ? `This video has been analyzed and shows significant indicators of digital manipulation. With a confidence score of ${(video.analysis_result.confidence * 100).toFixed(1)}%, the content should be considered suspicious and requires further verification.`
        : `This video has been analyzed and appears to be authentic content. With a confidence score of ${(video.analysis_result.confidence * 100).toFixed(1)}%, no significant manipulation indicators were detected.`;
      
      const splitText = pdf.splitTextToSize(summaryText, pageWidth - (margin * 2));
      pdf.text(splitText, margin, yPosition);

      // Footer
      yPosition = pdf.internal.pageSize.getHeight() - 30;
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('This report is generated by DeepXpose AI Detection System', margin, yPosition);
      pdf.text('For questions about this analysis, contact your system administrator.', margin, yPosition + 10);

      // Generate filename
      const filename = `DeepXpose_Analysis_${video.platform}_${video.id}_${new Date().getTime()}.pdf`;
      
      // Download PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'X': return 'bg-blue-500';
      case 'Instagram': return 'bg-pink-500';
      case 'YouTube': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'X': return '𝕏';
      case 'Instagram': return '📷';
      case 'YouTube': return '▶️';
      default: return '🎥';
    }
  };

  return (
    <div className="dark-container">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-prussian-blue to-dark-purple-2 opacity-40"></div>
      
      <div className="relative max-width-container py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-on-scroll">
          <h1 className="display-large text-text-primary mb-6">{t('trendingAnalysis')}</h1>
          <p className="body-large text-text-secondary max-w-3xl mx-auto mb-8">
            {t('trendingSubtitle')}
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-text-muted">
            <div className="flex items-center space-x-2">
              <Shield size={16} />
              <span className="body-small">{t('realtimeAIDetection')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span className="body-small">{t('liveSocialMedia')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye size={16} />
              <span className="body-small">{t('trendingContent')}</span>
            </div>
          </div>
        </div>

        {/* Platform Filter Tabs */}
        <div className="flex justify-center mb-12 animate-on-scroll">
          <div className="bg-bg-overlay border border-border-subtle rounded-lg p-2 flex space-x-1">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setActiveFilter(platform)}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2
                  ${activeFilter === platform
                    ? 'bg-theme-glow text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-overlay'
                  }
                `}
              >
                <span>{platform !== 'All' ? getPlatformIcon(platform) : <Filter size={16} />}</span>
                <span>{platform}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-500/10 border border-red-500/20 p-4 mb-8 animate-on-scroll">
            <div className="flex items-center space-x-3">
              <AlertTriangle size={20} className="text-red-400" />
              <p className="text-red-400">{error}</p>
              <Button 
                onClick={() => {
                  setError(null);
                  window.location.reload();
                }}
                variant="secondary" 
                size="sm"
                className="ml-auto"
              >
                {t('retry')}
              </Button>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 animate-on-scroll">
            <div className="w-16 h-16 border-4 border-theme-glow border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="heading-2 text-text-primary mb-4">{t('loadingTrendingVideos')}</h3>
            <p className="body-medium text-text-secondary">
              {t('loadingTrendingDesc')}
            </p>
          </div>
        )}

        {/* Analysis in Progress */}
        {analyzingVideo && (
          <Card className="bg-bg-overlay border border-border-subtle p-6 mb-8 animate-on-scroll">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-theme-glow rounded-lg flex items-center justify-center">
                  <Shield size={24} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="heading-3 text-text-primary">{t('analyzingVideoContent')}</h3>
                  <p className="body-medium text-text-secondary">{t('processingWithAI')}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-theme-glow mb-1">{analysisProgress}%</div>
                <Progress value={analysisProgress} className="w-32" />
              </div>
            </div>
          </Card>
        )}

        {/* Videos Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video, index) => (
            <Card 
              key={video.id}
              className={`
                bg-bg-overlay border-2 transition-all duration-300 hover:transform hover:scale-105 animate-on-scroll
                ${video.analyzed 
                  ? (video.analysis_result?.result === 'FAKE' ? 'border-red-500/40' : 'border-green-500/40')
                  : 'border-border-subtle hover:border-theme-glow'
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-0">
                {/* Video Thumbnail */}
                <div className="relative group">
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                    <Play size={40} className="text-white" />
                  </div>
                  
                  {/* Platform Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getPlatformColor(video.platform)} text-white border-0`}>
                      <span className="mr-1">{getPlatformIcon(video.platform)}</span>
                      {video.platform}
                    </Badge>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                  
                  {/* Verified Badge */}
                  {video.verified_account && (
                    <div className="absolute top-3 right-3">
                      <Verified size={20} className="text-blue-400" />
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="heading-3 text-text-primary mb-3 line-clamp-2">{video.title}</h3>
                  
                  <div className="flex items-center justify-between text-text-muted text-sm mb-4">
                    <span className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{video.engagement}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{video.timestamp}</span>
                    </span>
                  </div>

                  {/* Analysis Result */}
                  {video.analyzed && video.analysis_result ? (
                    <div className="mb-4 p-6 rounded-xl border-2 bg-gradient-to-br from-bg-overlay to-bg-secondary animate-fade-in-up shadow-lg transition-all duration-500">
                      {/* Result Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            video.analysis_result.result === 'FAKE' 
                              ? 'bg-red-500/20 border-2 border-red-500/40' 
                              : 'bg-green-500/20 border-2 border-green-500/40'
                          }`}>
                            {video.analysis_result.result === 'FAKE' ? (
                              <AlertTriangle size={20} className="text-red-400" />
                            ) : (
                              <CheckCircle size={20} className="text-green-400" />
                            )}
                          </div>
                          <div>
                            <div className={`font-bold text-lg ${
                              video.analysis_result.result === 'FAKE' ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {video.analysis_result.result === 'FAKE' ? t('fakeLabel') : t('realLabel')}
                            </div>
                            <p className={`text-sm ${
                              video.analysis_result.result === 'FAKE' ? 'text-red-300' : 'text-green-300'
                            }`}>
                              {video.analysis_result.result === 'FAKE' 
                                ? t('fakeMessage') 
                                : t('realMessage')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Confidence Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-theme-glow mb-1">
                            {(video.analysis_result.confidence * 100).toFixed(0)}%
                          </div>
                          <p className="text-text-muted text-sm">{t('confidence')}</p>
                        </div>
                      </div>
                      
                      {/* Analysis Details */}
                      <div className="bg-bg-primary/30 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-text-muted">{t('processingTimeLabel')}</span>
                            <span className="text-text-primary ml-2 font-medium">{video.analysis_result.processing_time}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">{t('analysisIdLabel')}</span>
                            <span className="text-text-primary ml-2 font-medium">#{video.analysis_result.id?.slice(-6) || 'N/A'}</span>
                          </div>
                        </div>
                        
                        {video.analysis_result.risk_factors && video.analysis_result.risk_factors.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border-subtle">
                            <span className="text-text-muted text-sm">Key findings:</span>
                            <ul className="text-text-primary text-sm mt-1 space-y-1">
                              {video.analysis_result.risk_factors.slice(0, 2).map((factor, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <span className="text-theme-glow mt-1">•</span>
                                  <span>{factor}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* View Report Button for Investigators */}
                      {user && user.role === 'INVESTIGATOR' && (
                        <Button
                          onClick={() => handleGenerateReport(video)}
                          className="w-full btn-secondary bg-theme-glow/10 border border-theme-glow/30 text-theme-glow hover:bg-theme-glow hover:text-white transition-all duration-300"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View Report
                        </Button>
                      )}
                    </div>
                  ) : null}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {!video.analyzed ? (
                      <Button
                        onClick={() => handleAnalyzeVideo(video.id)}
                        disabled={analyzingVideo === video.id}
                        className="btn-primary flex-1"
                      >
                        {analyzingVideo === video.id ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>{t('analyzing')}</span>
                          </>
                        ) : (
                          <>
                            <Shield size={16} />
                            <span>{t('checkAuthenticity')}</span>
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleAnalyzeVideo(video.id)}
                        className="btn-secondary flex-1"
                      >
                        <Shield size={16} />
                        <span>{t('reanalyze')}</span>
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => window.open(video.url, '_blank')}
                      variant="secondary"
                      className="btn-secondary"
                    >
                      <ExternalLink size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-16 animate-on-scroll">
            <div className="w-24 h-24 bg-bg-overlay rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter size={32} className="text-text-muted" />
            </div>
            <h3 className="heading-2 text-text-primary mb-4">{t('noVideosFound')}</h3>
            <p className="body-medium text-text-secondary">
              {t('noVideosDesc')}
            </p>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-16 text-center animate-on-scroll">
          <Card className="bg-bg-overlay border border-border-subtle p-8 max-w-4xl mx-auto">
            <h3 className="heading-2 text-text-primary mb-4">How Trending Analysis Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="w-12 h-12 bg-theme-glow rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="heading-3 text-text-primary mb-2">Real-time Monitoring</h4>
                <p className="body-medium text-text-secondary">
                  We continuously monitor trending content across major social media platforms.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-theme-glow rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="heading-3 text-text-primary mb-2">AI Analysis</h4>
                <p className="body-medium text-text-secondary">
                  Advanced transformer models analyze each video for manipulation indicators.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-theme-glow rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="heading-3 text-text-primary mb-2">Instant Results</h4>
                <p className="body-medium text-text-secondary">
                  Get immediate authenticity verification with confidence scores and risk assessment.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrendingAnalysis;
