import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Shield, Zap, FileCheck, Eye, Brain, CheckCircle, FileText } from 'lucide-react';
import Spline from '@splinetool/react-spline';

const HomePage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);

  // Scroll animation effect
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
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/detect');
    } else {
      navigate('/signup');
    }
  };

  const handleTryDemo = () => {
    navigate('/demo');
  };

  return (
    <div className="dark-container">
      {/* Hero Section with 3D Element */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-charcoal"></div>
        
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="particle-field">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${15 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-width-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="animate-on-scroll hero-content">
              <h1 className="display-huge text-text-primary mb-6 leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="body-large text-text-secondary mb-8 max-w-lg mx-auto">
                {t('heroSubtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center sm:justify-center">
                <Button 
                  onClick={handleGetStarted}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  <span>{t('getStarted')}</span>
                  <CheckCircle size={20} />
                </Button>
                <Button 
                  onClick={handleTryDemo}
                  variant="secondary"
                  className="btn-secondary px-8 py-4 text-lg"
                >
                  <span>{t('tryDemo')}</span>
                  <Eye size={20} />
                </Button>
                <Button 
                  onClick={() => navigate('/report', { 
                    state: { 
                      analysisData: {
                        id: "demo_analysis_homepage",
                        filename: "sample_deepfake_video.mp4",
                        timestamp: new Date().toISOString(),
                        result: "FAKE",
                        confidence: 0.92,
                        processing_time: "1.8s",
                        file_size: "22.1 MB",
                        duration: "00:02:15",
                        detailed_analysis: {
                          face_regions: 3,
                          temporal_inconsistencies: 18,
                          artifacts_detected: ["Facial boundary artifacts", "Temporal flickering", "Audio-visual mismatch"],
                          risk_score: "HIGH"
                        }
                      }
                    } 
                  })}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  <span>📄 View Report Demo</span>
                  <FileText size={20} />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border-subtle">
                <div className="text-center">
                  <div className="display-medium text-brand-primary mb-2">96.8%</div>
                  <div className="body-small text-text-muted">{t('accuracyRate')}</div>
                </div>
                <div className="text-center">
                  <div className="display-medium text-brand-primary mb-2">2.1s</div>
                  <div className="body-small text-text-muted">{t('avgAnalysis')}</div>
                </div>
                <div className="text-center">
                  <div className="display-medium text-brand-primary mb-2">50K+</div>
                  <div className="body-small text-text-muted">{t('videosAnalyzed')}</div>
                </div>
              </div>
            </div>

            {/* 3D Spline Component with Theme Colors */}
            <div className="animate-on-scroll">
              <div className="relative">
                <div 
                  className="spline-container theme-responsive-3d"
                  style={{ 
                    width: "700px", 
                    height: "700px", 
                    overflow: "visible", 
                    position: "relative",
                    maxWidth: "100%"
                  }}
                >
                  <Spline 
                    scene="https://prod.spline.design/NbVmy6DPLhY-5Lvg/scene.splinecode"
                    style={{ width: "100%", height: "100%" }}
                  />
                  {/* Theme-based glow overlay */}
                  <div className="spline-glow-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-green to-midnight-green-2 opacity-20"></div>
        <div className="relative max-width-container">
          <div className="text-center animate-on-scroll mb-16">
            <h2 className="display-large text-text-primary mb-6">{t('aboutTitle')}</h2>
            <p className="body-large text-text-secondary max-w-4xl mx-auto leading-relaxed">
              {t('aboutText')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: t('trustedSecurity'), desc: t('trustedSecurityDesc') },
              { icon: Zap, title: t('lightningFast'), desc: t('lightningFastDesc') },
              { icon: Brain, title: t('aiPowered'), desc: t('aiPoweredDesc') },
              { icon: FileCheck, title: t('detailedReports'), desc: t('detailedReportsDesc') }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="animate-on-scroll bg-bg-overlay border border-border-subtle rounded-sm p-6 hover:border-brand-primary transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-brand-primary rounded-sm flex items-center justify-center mb-4">
                    <feature.icon size={24} className="text-black" />
                  </div>
                </div>
                <h3 className="heading-3 text-text-primary mb-3">{feature.title}</h3>
                <p className="body-medium text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={featuresRef} className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-dark-purple to-dark-purple-2 opacity-30"></div>
        <div className="relative max-width-container">
          <div className="text-center animate-on-scroll mb-16">
            <h2 className="display-large text-text-primary mb-6">{t('featuresTitle')}</h2>
            <p className="body-large text-text-secondary max-w-2xl mx-auto">
              {t('howItWorksSubtitle')}
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Connecting flow line (desktop) */}
            <div className="hidden lg:block absolute top-[60px] left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-30 pointer-events-none"></div>

            {[
              { 
                step: "01",
                title: t('feature1Title'), 
                desc: t('feature1Text'),
                icon: FileCheck 
              },
              { 
                step: "02", 
                title: t('feature2Title'), 
                desc: t('feature2Text'),
                icon: Brain 
              },
              { 
                step: "03", 
                title: t('feature3Title'), 
                desc: t('feature3Text'),
                icon: CheckCircle 
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="relative animate-on-scroll group"
                style={{ animationDelay: `${index * 0.15}s` }}
                data-testid={`how-it-works-card-${index + 1}`}
              >
                {/* Icon with attached step number */}
                <div className="relative w-[120px] h-[120px] mx-auto mb-8">
                  <div 
                    className="w-full h-full rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1"
                    style={{ 
                      background: 'var(--brand-gradient, var(--brand-primary))',
                      boxShadow: '0 12px 30px -8px rgba(var(--theme-glow-rgb), 0.45)'
                    }}
                  >
                    <step.icon size={44} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-3 -right-3 w-11 h-11 rounded-full bg-bg-primary border-2 border-brand-primary flex items-center justify-center shadow-md">
                    <span className="text-brand-primary font-bold text-base">{step.step}</span>
                  </div>
                </div>

                {/* Text card */}
                <div className="bg-bg-overlay border border-border-subtle rounded-2xl px-6 py-8 text-center transition-all duration-300 group-hover:border-brand-primary group-hover:shadow-[0_20px_50px_-15px_rgba(var(--theme-glow-rgb),0.4)]">
                  <h3 className="heading-2 text-text-primary mb-3">{step.title}</h3>
                  <p className="body-medium text-text-secondary">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Credits Section */}
      <section className="py-24 border-t border-border-subtle">
        <div className="max-width-container">
          <div className="text-center animate-on-scroll">
            <h2 className="display-medium text-text-primary mb-6">{t('teamTitle')}</h2>
            <p className="body-large text-text-secondary mb-8">{t('teamText')}</p>
            
            <div className="bg-bg-overlay border border-border-subtle rounded-sm p-8 max-w-2xl mx-auto">
              <div className="space-y-2 text-text-secondary">
                <p className="heading-3 text-text-primary">{t('courseInfo')}</p>
                <p>{t('supervisor')}</p>
                <p>{t('instructor')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;