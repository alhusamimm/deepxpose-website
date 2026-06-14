import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Zap, Shield, FileText, Cpu, Clock, Star } from 'lucide-react';
import { mockPricingPlans } from '../mock';

const Pricing = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    if (!user) {
      navigate('/signup');
    } else {
      // Mock subscription selection
      console.log('Selected plan:', plan.id);
      // In real app, would integrate with payment processor
    }
  };

  const handleTryDemo = () => {
    navigate('/demo');
  };

  const getFeatureIcon = (feature) => {
    if (feature.includes('analyses') || feature.includes('video')) return <FileText size={16} />;
    if (feature.includes('processing') || feature.includes('speed')) return <Zap size={16} />;
    if (feature.includes('API') || feature.includes('integration')) return <Cpu size={16} />;
    if (feature.includes('support')) return <Shield size={16} />;
    if (feature.includes('report')) return <FileText size={16} />;
    return <CheckCircle size={16} />;
  };

  return (
    <div className="dark-container">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-prussian-blue to-dark-purple-2 opacity-60"></div>
      
      <div className="relative max-width-container py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="display-large text-text-primary mb-6">{t('pricingTitle')}</h1>
          <p className="body-large text-text-secondary max-w-3xl mx-auto mb-8">
            {t('pricingSubtitle')}
          </p>
          
          {/* Demo CTA */}
          <div className="bg-bg-overlay border border-border-subtle rounded-sm p-6 max-w-md mx-auto mb-12">
            <h3 className="heading-3 text-text-primary mb-3">{t('tryBeforeSubscribe')}</h3>
            <p className="body-medium text-text-secondary mb-4">
              {t('tryBeforeSubscribeDesc')}
            </p>
            <Button onClick={handleTryDemo} className="btn-primary w-full">
              <Zap size={20} />
              <span>{t('tryDemo')}</span>
            </Button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {mockPricingPlans.map((plan, index) => (
            <Card 
              key={plan.id}
              className={`
                relative bg-bg-overlay border-2 p-8 transition-all duration-300 hover:transform hover:scale-105
                ${plan.popular 
                  ? 'border-brand-primary shadow-lg shadow-brand-primary/20' 
                  : 'border-border-subtle hover:border-brand-primary'
                }
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-brand-primary text-black px-4 py-1 rounded-sm">
                    <Star size={14} className="mr-1" />
                    {t('popular')}
                  </Badge>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="heading-2 text-text-primary mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="display-medium text-brand-primary">{plan.price}</span>
                  {plan.period !== 'pricing' && (
                    <span className="body-medium text-text-muted">{t('month')}</span>
                  )}
                </div>
                <p className="body-small text-text-secondary">
                  {plan.analyses_included} {t('analysesIncludedSuffix')}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="text-brand-primary mt-1">
                      {getFeatureIcon(feature)}
                    </div>
                    <span className="body-medium text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Suitable For */}
              <div className="mb-8 p-4 bg-bg-primary border border-border-subtle rounded-sm">
                <p className="body-small text-text-muted mb-2">{t('suitable')}:</p>
                <p className="body-medium text-text-primary">{plan.suitable_for}</p>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handleSelectPlan(plan)}
                className={
                  plan.popular 
                    ? 'btn-primary w-full' 
                    : 'btn-secondary w-full'
                }
              >
                {plan.id === 'enterprise' ? t('contactSales') : t('getStarted')}
              </Button>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-bg-overlay border border-border-subtle rounded-sm p-8">
          <h2 className="heading-2 text-text-primary mb-8 text-center">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-4 text-text-primary font-medium">Feature</th>
                  <th className="py-4 text-center text-text-primary font-medium">Basic</th>
                  <th className="py-4 text-center text-text-primary font-medium">Professional</th>
                  <th className="py-4 text-center text-text-primary font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {[
                  { name: 'Monthly Analyses', basic: '50', pro: '200', enterprise: 'Unlimited' },
                  { name: 'Processing Speed', basic: 'Standard', pro: '2x Faster', enterprise: 'Priority' },
                  { name: 'File Size Limit', basic: '500MB', pro: '2GB', enterprise: 'No Limit' },
                  { name: 'API Access', basic: '❌', pro: '✅', enterprise: '✅' },
                  { name: 'Custom Reports', basic: '❌', pro: '✅', enterprise: '✅' },
                  { name: 'On-premise Deploy', basic: '❌', pro: '❌', enterprise: '✅' },
                  { name: 'Support Level', basic: 'Email', pro: 'Priority', enterprise: '24/7 Dedicated' }
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="py-4 text-text-secondary">{row.name}</td>
                    <td className="py-4 text-center text-text-primary">{row.basic}</td>
                    <td className="py-4 text-center text-text-primary">{row.pro}</td>
                    <td className="py-4 text-center text-text-primary">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <h3 className="heading-2 text-text-primary mb-8">Trusted by Organizations Worldwide</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {[
              'Law Enforcement',
              'Media Organizations', 
              'Digital Forensics',
              'Academic Research'
            ].map((org, index) => (
              <div key={index} className="p-4 bg-bg-overlay border border-border-subtle rounded-sm">
                <p className="body-small text-text-muted font-medium">{org}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="heading-2 text-text-primary mb-8 text-center">Pricing FAQ</h3>
          <div className="space-y-6">
            {[
              {
                q: "Can I change my plan anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "What happens if I exceed my monthly analysis limit?", 
                a: "You'll be notified when approaching your limit. Additional analyses can be purchased as needed."
              },
              {
                q: "Is there a free trial available?",
                a: "New users get 5 free analyses to test our platform. No credit card required."
              },
              {
                q: "Do you offer volume discounts for Enterprise customers?",
                a: "Yes, we offer custom pricing for high-volume usage. Contact our sales team for details."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-bg-overlay border border-border-subtle rounded-sm p-6">
                <h4 className="heading-3 text-text-primary mb-3">{faq.q}</h4>
                <p className="body-medium text-text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 border border-brand-primary/20 rounded-sm p-8">
          <h3 className="heading-2 text-text-primary mb-4">Ready to Get Started?</h3>
          <p className="body-large text-text-secondary mb-6">
            Join thousands of professionals using DeepXpose for media authentication
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleTryDemo} variant="secondary" className="btn-secondary">
              <Zap size={20} />
              <span>{t('tryFreeDemo')}</span>
            </Button>
            <Button 
              onClick={() => navigate('/report', { 
                state: { 
                  analysisData: {
                    id: "pricing_demo_analysis",
                    filename: "enterprise_test_video.mp4",
                    timestamp: new Date().toISOString(),
                    result: "REAL",
                    confidence: 0.94,
                    processing_time: "1.2s",
                    file_size: "18.7 MB",
                    duration: "00:01:45",
                    detailed_analysis: {
                      face_regions: 1,
                      temporal_inconsistencies: 2,
                      artifacts_detected: [],
                      risk_score: "LOW"
                    }
                  }
                } 
              })}
              variant="secondary" 
              className="btn-secondary"
            >
              <FileText size={20} />
              <span>{t('viewSampleReport')}</span>
            </Button>
            <Button onClick={() => navigate('/signup')} className="btn-primary">
              <CheckCircle size={20} />
              <span>{t('startFreeTrial')}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;