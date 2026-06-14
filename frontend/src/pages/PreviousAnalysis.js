import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { FileVideo, Calendar, Search, Filter, Download, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { mockAnalysisResults } from '../mock';

const PreviousAnalysis = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  if (!user) {
    return (
      <div className="dark-container">
        <div className="max-width-container py-24 text-center">
          <h1 className="display-large text-text-primary mb-6">{t('accessRequired')}</h1>
          <p className="body-large text-text-secondary mb-8">
            {t('accessRequiredDesc')}
          </p>
          <Button onClick={() => navigate('/login')} className="btn-primary">
            {t('login')}
          </Button>
        </div>
      </div>
    );
  }

  const filteredResults = mockAnalysisResults.filter(result => {
    const matchesSearch = result.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterResult === 'all' || result.result.toLowerCase() === filterResult;
    return matchesSearch && matchesFilter;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp);
      case 'confidence':
        return b.confidence - a.confidence;
      case 'filename':
        return a.filename.localeCompare(b.filename);
      default:
        return 0;
    }
  });

  const getResultIcon = (result, confidence) => {
    if (result === 'FAKE') {
      return <AlertTriangle size={20} className="text-red-400" />;
    }
    return <CheckCircle size={20} className="text-green-400" />;
  };

  const getResultColor = (result) => {
    return result === 'FAKE' ? 'text-red-400' : 'text-green-400';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dark-container">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-charcoal to-midnight-green-2 opacity-40"></div>
      
      <div className="relative max-width-container py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          <div>
            <h1 className="display-large text-text-primary mb-4">{t('previousAnalysis')}</h1>
            <p className="body-large text-text-secondary">
              {t('previousAnalysisDesc')}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-6 lg:mt-0">
            <Button onClick={() => navigate('/detect')} className="btn-primary">
              <FileVideo size={20} />
              <span>{t('newAnalysis')}</span>
            </Button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-bg-overlay border border-border-subtle p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-small text-text-muted mb-1">{t('totalAnalyses')}</p>
                <p className="heading-2 text-text-primary">{mockAnalysisResults.length}</p>
              </div>
              <FileVideo size={32} className="text-brand-primary" />
            </div>
          </Card>
          
          <Card className="bg-bg-overlay border border-border-subtle p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-small text-text-muted mb-1">{t('analysesRemaining')}</p>
                <p className="heading-2 text-text-primary">{user.analyses_remaining}</p>
              </div>
              <Clock size={32} className="text-brand-primary" />
            </div>
          </Card>
          
          <Card className="bg-bg-overlay border border-border-subtle p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-small text-text-muted mb-1">{t('subscription')}</p>
                <p className="heading-2 text-text-primary">{user.subscription}</p>
              </div>
              <Badge className="bg-brand-primary text-black">{user.subscription}</Badge>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-bg-overlay border border-border-subtle p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <Input
                placeholder={t('searchByFilename')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-bg-primary border-border-medium text-text-primary"
              />
            </div>

            {/* Filter by Result */}
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger className="bg-bg-primary border-border-medium text-text-primary">
                <SelectValue placeholder={t('filterByResult')} />
              </SelectTrigger>
              <SelectContent className="bg-bg-secondary border-border-medium">
                <SelectItem value="all">{t('allResults')}</SelectItem>
                <SelectItem value="fake">{t('fakeOnly')}</SelectItem>
                <SelectItem value="real">{t('realOnly')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-bg-primary border-border-medium text-text-primary">
                <SelectValue placeholder={t('sortBy')} />
              </SelectTrigger>
              <SelectContent className="bg-bg-secondary border-border-medium">
                <SelectItem value="newest">{t('newestFirst')}</SelectItem>
                <SelectItem value="oldest">{t('oldestFirst')}</SelectItem>
                <SelectItem value="confidence">{t('confidenceSort')}</SelectItem>
                <SelectItem value="filename">{t('filename')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              onClick={() => {
                setSearchTerm('');
                setFilterResult('all');
                setSortBy('newest');
              }}
              variant="secondary"
              className="btn-secondary"
            >
              <Filter size={20} />
              <span>Clear</span>
            </Button>
          </div>
        </Card>

        {/* Results List */}
        {sortedResults.length === 0 ? (
          <Card className="bg-bg-overlay border border-border-subtle p-12 text-center">
            <FileVideo size={64} className="mx-auto mb-6 text-text-muted" />
            <h3 className="heading-2 text-text-primary mb-4">{t('noAnalysisFound')}</h3>
            <p className="body-medium text-text-secondary mb-6">
              {searchTerm || filterResult !== 'all' 
                ? t('noMatchingFilters') 
                : t('noAnalysisYet')
              }
            </p>
            <Button onClick={() => navigate('/detect')} className="btn-primary">
              <FileVideo size={20} />
              <span>{t('analyzeFirstVideo')}</span>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedResults.map((analysis) => (
              <Card key={analysis.id} className="bg-bg-overlay border border-border-subtle hover:border-brand-primary transition-all duration-300">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                    {/* File Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-12 bg-bg-primary border border-border-medium rounded-sm flex items-center justify-center flex-shrink-0">
                          <img 
                            src={analysis.thumbnail} 
                            alt="Video thumbnail"
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="heading-3 text-text-primary mb-2 truncate">
                            {analysis.filename}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                            <span className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(analysis.timestamp)}
                            </span>
                            <span>{analysis.file_size}</span>
                            <span>{analysis.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analysis Result */}
                    <div className="text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                        {getResultIcon(analysis.result, analysis.confidence)}
                        <span className={`heading-3 ${getResultColor(analysis.result)}`}>
                          {t(analysis.result.toLowerCase())}
                        </span>
                      </div>
                      <p className="body-small text-text-secondary">
                        {t('confidence')}: {(analysis.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="body-small text-text-muted">
                        {analysis.processing_time}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="btn-secondary text-sm"
                        onClick={() => {
                          // Navigate to report generation with this analysis
                          navigate('/report', { 
                            state: { 
                              analysisData: analysis
                            } 
                          });
                        }}
                      >
                        <FileText size={16} />
                        <span>{t('generateReport')}</span>
                      </Button>
                      
                      <Button 
                        size="sm"
                        className="btn-primary text-sm"
                        onClick={() => {
                          // Mock view details
                          console.log('View details:', analysis.id);
                        }}
                      >
                        <Download size={16} />
                        <span>{t('viewDetails')}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Risk Indicators */}
                  {analysis.detailed_analysis.artifacts_detected.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border-subtle">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-red-500/20 text-red-400 border border-red-500/40">
                          {analysis.detailed_analysis.artifacts_detected.length} {t('artifactsDetected')}
                        </Badge>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                          {analysis.detailed_analysis.temporal_inconsistencies} {t('temporalIssues')}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/40">
                          {analysis.detailed_analysis.face_regions} {t('faceRegions')}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination would go here in a real app */}
        {sortedResults.length > 0 && (
          <div className="mt-8 text-center">
            <p className="body-small text-text-muted">
              Showing {sortedResults.length} of {mockAnalysisResults.length} analyses
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousAnalysis;;