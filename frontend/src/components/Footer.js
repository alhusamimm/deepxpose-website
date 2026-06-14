import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-primary border-t border-border-subtle mt-auto">
      <div className="max-width-container pt-20 pb-12">
        <div className="flex flex-col items-center text-center">
          {/* Brand */}
          <div className="footer-logo mb-4">
            <Logo size="footer" className="footer-logo" />
          </div>
          <p className="text-text-secondary mb-6 max-w-md">
            {t('heroSubtitle')}
          </p>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <Link to="/demo" className="text-text-muted hover:text-brand-primary transition-colors">
              {t('tryDemo')}
            </Link>
            <Link to="/pricing" className="text-text-muted hover:text-brand-primary transition-colors">
              {t('pricing')}
            </Link>
            <Link to="/help" className="text-text-muted hover:text-brand-primary transition-colors">
              {t('help')}
            </Link>
          </nav>

          {/* Team Credits */}
          <div className="text-text-muted text-sm space-y-1">
            <p className="font-medium text-text-secondary">{t('teamTitle')}</p>
            <p>Amani Albarazi • Bushra Alshehri • Maram Alhusami</p>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-muted text-sm">{t('copyright')}</p>
          <p className="text-text-muted text-sm mt-2 md:mt-0">
            {t('madeWithLove')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;