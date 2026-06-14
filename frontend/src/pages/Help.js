import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Button } from '../components/ui/button';
import { Search, MessageCircle, Book, Shield, Zap, FileText, Mail, Phone, ExternalLink } from 'lucide-react';

const Help = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    { id: 'faq_001', question: t('faq1Q'), answer: t('faq1A') },
    { id: 'faq_002', question: t('faq2Q'), answer: t('faq2A') },
    { id: 'faq_003', question: t('faq3Q'), answer: t('faq3A') },
    { id: 'faq_004', question: t('faq4Q'), answer: t('faq4A') },
    { id: 'faq_005', question: t('faq5Q'), answer: t('faq5A') }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const supportCategories = [
    {
      title: t('catGettingStarted'),
      icon: Book,
      description: t('catGettingStartedDesc'),
      articles: [t('art1'), t('art2'), t('art3'), t('art4')]
    },
    {
      title: t('catTechDocs'),
      icon: FileText,
      description: t('catTechDocsDesc'),
      articles: [t('art5'), t('art6'), t('art7'), t('art8')]
    },
    {
      title: t('catSecurity'),
      icon: Shield,
      description: t('catSecurityDesc'),
      articles: [t('art9'), t('art10'), t('art11'), t('art12')]
    },
    {
      title: t('catPerformance'),
      icon: Zap,
      description: t('catPerformanceDesc'),
      articles: [t('art13'), t('art14'), t('art15'), t('art16')]
    }
  ];

  return (
    <div className="dark-container">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-space-cadet to-dark-purple opacity-50"></div>
      
      <div className="relative max-width-container py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="display-large text-text-primary mb-6">{t('helpTitle')}</h1>
          <p className="body-large text-text-secondary max-w-3xl mx-auto mb-8">
            {t('helpSubtitle')}
          </p>
          
          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <Input
              placeholder={t('searchHelpPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-medium)'
              }}
              className="pl-12 h-14 text-lg"
              data-testid="help-search-input"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-bg-overlay border border-border-subtle p-6 text-center hover:border-brand-primary transition-colors">
            <MessageCircle size={32} className="mx-auto mb-4 text-brand-primary" />
            <h3 className="heading-3 text-text-primary mb-2">{t('liveChat')}</h3>
            <p className="body-medium text-text-secondary mb-4">
              {t('liveChatDesc')}
            </p>
            <Button className="btn-primary w-full">
              {t('startChat')}
            </Button>
          </Card>
          
          <Card className="bg-bg-overlay border border-border-subtle p-6 text-center hover:border-brand-primary transition-colors">
            <Mail size={32} className="mx-auto mb-4 text-brand-primary" />
            <h3 className="heading-3 text-text-primary mb-2">{t('emailSupport')}</h3>
            <p className="body-medium text-text-secondary mb-4">
              {t('emailSupportDesc')}
            </p>
            <Button variant="secondary" className="btn-secondary w-full">
              {t('sendEmail')}
            </Button>
          </Card>
          
          <Card className="bg-bg-overlay border border-border-subtle p-6 text-center hover:border-brand-primary transition-colors">
            <Phone size={32} className="mx-auto mb-4 text-brand-primary" />
            <h3 className="heading-3 text-text-primary mb-2">{t('phoneSupport')}</h3>
            <p className="body-medium text-text-secondary mb-4">
              {t('phoneSupportDesc')}
            </p>
            <Button variant="secondary" className="btn-secondary w-full">
              {t('callUs')}
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="heading-2 text-text-primary mb-6">{t('helpTitle')}</h2>
            
            {filteredFAQs.length === 0 ? (
              <Card className="bg-bg-overlay border border-border-subtle p-8 text-center">
                <Search size={48} className="mx-auto mb-4 text-text-muted" />
                <h3 className="heading-3 text-text-primary mb-2">{t('noResultsFound')}</h3>
                <p className="body-medium text-text-secondary">
                  {t('noResultsDesc')}
                </p>
              </Card>
            ) : (
              <Card className="bg-bg-overlay border border-border-subtle">
                <Accordion type="single" collapsible className="p-6">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border-border-subtle">
                      <AccordionTrigger className="text-text-primary hover:text-brand-primary text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-text-secondary">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            )}
          </div>

          {/* Help Categories */}
          <div>
            <h2 className="heading-2 text-text-primary mb-6">{t('helpCategories')}</h2>
            
            <div className="space-y-4">
              {supportCategories.map((category, index) => (
                <Card key={index} className="bg-bg-overlay border border-border-subtle p-6 hover:border-brand-primary transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-brand-primary rounded-sm flex items-center justify-center flex-shrink-0">
                      <category.icon size={24} className="text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-3 text-text-primary mb-2">{category.title}</h3>
                      <p className="body-medium text-text-secondary mb-4">{category.description}</p>
                      
                      <ul className="space-y-2">
                        {category.articles.map((article, idx) => (
                          <li key={idx}>
                            <button className="text-brand-primary hover:text-brand-active transition-colors flex items-center text-sm">
                              <ExternalLink size={14} className="mr-2" />
                              {article}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16">
          <Card className="bg-bg-overlay border border-border-subtle p-8">
            <div className="text-center mb-8">
              <h2 className="heading-2 text-text-primary mb-4">Still Need Help?</h2>
              <p className="body-large text-text-secondary">
                Our support team is available 24/7 to assist you with any questions or issues.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Mail size={24} className="mx-auto mb-3 text-brand-primary" />
                <h3 className="heading-3 text-text-primary mb-2">Email</h3>
                <p className="body-medium text-text-secondary">support@deepxpose.com</p>
                <p className="body-small text-text-muted">Response within 2 hours</p>
              </div>
              
              <div>
                <MessageCircle size={24} className="mx-auto mb-3 text-brand-primary" />
                <h3 className="heading-3 text-text-primary mb-2">Live Chat</h3>
                <p className="body-medium text-text-secondary">Available 24/7</p>
                <p className="body-small text-text-muted">Instant response</p>
              </div>
              
              <div>
                <Phone size={24} className="mx-auto mb-3 text-brand-primary" />
                <h3 className="heading-3 text-text-primary mb-2">Phone</h3>
                <p className="body-medium text-text-secondary">+1 (555) 123-4567</p>
                <p className="body-small text-text-muted">Mon-Fri, 9am-6pm PST</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Emergency Support */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/40 rounded-sm flex items-center justify-center">
                <Shield size={24} className="text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="heading-3 text-text-primary mb-2">{t('emergencySupport')}</h3>
                <p className="body-medium text-text-secondary">
                  {t('emergencySupportDesc')}
                </p>
              </div>
              <Button variant="secondary" className="btn-secondary">
                {t('emergencyContact')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;