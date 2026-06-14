import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Mail, Lock, Eye, EyeOff, User, Building, UserPlus } from 'lucide-react';
import Logo from '../components/Logo';

const Signup = () => {
  const { signup, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'END_USER',
    organization: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await signup(formData);
      if (result.success) {
        navigate('/detect');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        navigate('/detect');
      } else {
        setError(result.error || 'Google signup failed');
      }
    } catch (err) {
      setError('Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="dark-container">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-prussian-blue to-dark-purple-2 opacity-60"></div>
      
      <div className="relative max-width-container py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="large" />
            </div>
            <h1 className="heading-2 text-text-primary mb-2">{t('createAccount')}</h1>
            <p className="body-medium text-text-secondary">
              {t('createAccountDesc')}
            </p>
          </div>

          <Card className="bg-bg-overlay border border-border-subtle p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Google Signup */}
            <Button
              onClick={handleGoogleSignup}
              disabled={loading}
              variant="secondary"
              className="btn-secondary w-full mb-6"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{t('signUpWithGoogle')}</span>
              </div>
            </Button>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-border-subtle"></div>
              <span className="px-4 text-text-muted text-sm">or</span>
              <div className="flex-1 border-t border-border-subtle"></div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-text-primary mb-2 block">
                  {t('fullName')}
                </Label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('enterFullName')}
                    className="pl-10 bg-bg-primary border-border-medium text-text-primary"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-text-primary mb-2 block">
                  {t('emailAddress')}
                </Label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('enterEmail')}
                    className="pl-10 bg-bg-primary border-border-medium text-text-primary"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role" className="text-text-primary mb-2 block">
                  {t('accountType')}
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="bg-bg-primary border-border-medium text-text-primary">
                    <SelectValue placeholder={t('selectRole')} />
                  </SelectTrigger>
                  <SelectContent className="bg-bg-secondary border-border-medium">
                    <SelectItem value="END_USER">{t('endUser')}</SelectItem>
                    <SelectItem value="INVESTIGATOR">{t('investigator')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Organization */}
              <div>
                <Label htmlFor="organization" className="text-text-primary mb-2 block">
                  {t('organization')}
                </Label>
                <div className="relative">
                  <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <Input
                    id="organization"
                    name="organization"
                    type="text"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder={t('enterOrganization')}
                    className="pl-10 bg-bg-primary border-border-medium text-text-primary"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-text-primary mb-2 block">
                  {t('password')}
                </Label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('createPassword')}
                    className="pl-10 pr-10 bg-bg-primary border-border-medium text-text-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-text-primary mb-2 block">
                  {t('confirmPassword')}
                </Label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('confirmYourPassword')}
                    className="pl-10 pr-10 bg-bg-primary border-border-medium text-text-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="text-sm text-text-secondary">
                {t('termsAgreement')}{' '}
                <Link to="/terms" className="text-brand-primary hover:text-brand-active">
                  {t('termsOfService')}
                </Link>{' '}
                {t('and')}{' '}
                <Link to="/privacy" className="text-brand-primary hover:text-brand-active">
                  {t('privacy')}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                    <span>{t('creatingAccount')}</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>{t('createAccount')}</span>
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-border-subtle">
              <p className="text-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-primary hover:text-brand-active transition-colors font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </Card>

          {/* Trial Info */}
          <Card className="bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 border border-brand-primary/20 p-4 mt-4">
            <div className="text-center">
              <p className="text-brand-primary text-sm font-medium mb-1">{t('freeTrialIncluded')}</p>
              <p className="text-text-secondary text-sm">
                {t('freeTrialDesc')}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;