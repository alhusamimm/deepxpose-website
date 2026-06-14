import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Globe, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import Logo from './Logo';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="dark-header">
      <div className="flex items-center justify-between w-full">
        {/* Theme-Responsive Logo */}
        <Logo size="header" className="flex-shrink-0" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex dark-nav">
          <Link to="/" className="dark-nav-link">{t('home')}</Link>
          <Link to="/detect" className="dark-nav-link">{t('detectZone')}</Link>
          <Link to="/trending" className="dark-nav-link">{t('trendingAnalysis')}</Link>
          <Link to="/analysis" className="dark-nav-link">{t('previousAnalysis')}</Link>
          <Link to="/pricing" className="dark-nav-link">{t('pricing')}</Link>
          <Link to="/help" className="dark-nav-link">{t('help')}</Link>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border-subtle hover:bg-bg-overlay hover:border-theme-glow transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} className="text-text-muted hover:text-theme-glow" /> : <Moon size={20} className="text-text-muted hover:text-theme-glow" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 p-2 rounded-lg border border-border-subtle hover:bg-bg-overlay hover:border-theme-glow transition-all duration-300"
            aria-label="Toggle language"
          >
            <Globe size={20} className="text-text-muted" />
            <span className="text-text-muted text-sm font-medium">
              {language.toUpperCase()}
            </span>
          </button>

          {/* User Menu or Login/Signup */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-sm border border-border-subtle hover:bg-bg-overlay transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <span className="hidden md:inline text-text-secondary text-sm">{user.name}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-subtle rounded-sm shadow-lg z-50">
                  <div className="p-3 border-b border-border-subtle">
                    <p className="text-text-primary font-medium">{user.name}</p>
                    <p className="text-text-muted text-sm">{user.email}</p>
                    <p className="text-brand-primary text-sm">{user.subscription}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        navigate('/analysis');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 p-2 text-left hover:bg-bg-overlay rounded-sm transition-colors"
                    >
                      <User size={16} className="text-text-muted" />
                      <span className="text-text-secondary">{t('dashboard')}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 p-2 text-left hover:bg-bg-overlay rounded-sm transition-colors"
                    >
                      <LogOut size={16} className="text-text-muted" />
                      <span className="text-text-secondary">{t('logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button
                onClick={() => navigate('/login')}
                variant="secondary"
                className="btn-secondary"
              >
                {t('login')}
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="btn-primary"
              >
                {t('signup')}
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-sm border border-border-subtle hover:bg-bg-overlay transition-colors"
          >
            {mobileMenuOpen ? <X size={20} className="text-text-muted" /> : <Menu size={20} className="text-text-muted" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-border-subtle">
          <nav className="flex flex-col space-y-2">
            <Link to="/" className="dark-nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('home')}
            </Link>
            <Link to="/detect" className="dark-nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('detectZone')}
            </Link>
            <Link to="/trending" className="dark-nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('trendingAnalysis')}
            </Link>
            <Link to="/analysis" className="dark-nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('previousAnalysis')}
            </Link>
            <Link to="/pricing" className="dark-nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('pricing')}
            </Link>
            <Link to="/help" className="dark-nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
              {t('help')}
            </Link>
            
            {!user && (
              <div className="flex flex-col space-y-2 pt-4 border-t border-border-subtle">
                <Button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  variant="secondary"
                  className="btn-secondary w-full"
                >
                  {t('login')}
                </Button>
                <Button
                  onClick={() => {
                    navigate('/signup');
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full"
                >
                  {t('signup')}
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;