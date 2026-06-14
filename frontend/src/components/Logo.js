import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Logo = ({ size = 'large', className = '' }) => {
  const { isDark } = useTheme();

  // Logo URLs from uploaded assets
  const darkModeLogo = "https://customer-assets.emergentagent.com/job_deepxpose-ai/artifacts/jq8f6ra9_DeepXposePurpule.png";
  const lightModeLogo = "https://customer-assets.emergentagent.com/job_deepxpose-ai/artifacts/d2x96pft_DeepXposeGreen%20%281%29.png";

  // Custom sizing to achieve exactly 85x53 pixels
  const sizeClasses = {
    micro: 'h-6 w-auto md:h-8', // Very small contexts
    tiny: 'h-8 w-auto md:h-10', // Compact areas  
    small: 'h-10 w-auto md:h-12', // Small screens
    medium: 'h-11 w-auto md:h-14', // Standard mobile
    large: 'h-12 w-auto md:h-15', // Desktop standard
    xlarge: 'h-14 w-auto md:h-16', // Large displays
    // Custom size for exact 85x53px requirement
    header: 'w-auto', // Will use custom style for exact dimensions
    footer: 'h-10 w-auto md:h-12', // Footer: slightly smaller
  };

  const logoSize = sizeClasses[size] || sizeClasses.large;

  return (
    <Link 
      to="/" 
      className={`logo-container inline-flex items-center justify-center ${className}`}
    >
      <div className="logo-image-wrapper relative group">
        <img
          src={isDark ? darkModeLogo : lightModeLogo}
          alt="DeepXpose"
          className={`
            ${logoSize}
            transition-all duration-300 ease-out
            group-hover:scale-110 group-hover:rotate-1
            ${isDark 
              ? 'group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]' 
              : 'group-hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]'
            }
          `}
          style={{
            // Custom size for exact 85x53px requirement
            ...(size === 'header' ? { width: '85px', height: '53px' } : {}),
            filter: isDark 
              ? 'drop-shadow(0 0 6px rgba(168,85,247,0.3))' 
              : 'drop-shadow(0 0 6px rgba(34,197,94,0.3))'
          }}
        />
      </div>
    </Link>
  );
};

export default Logo;