import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../cn';

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function BackButton({ 
  fallbackPath = '/dashboard', 
  className,
  variant = 'ghost',
  size = 'default',
  children 
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    // Essayer de revenir en arrière dans l'historique
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Sinon, aller au chemin de fallback
      navigate(fallbackPath);
    }
  };

  // Ne pas afficher le bouton sur la page dashboard (page principale)
  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGoBack}
      className={cn("flex items-center gap-2", className)}
    >
      <ArrowLeft className="w-4 h-4" />
      {children}
    </Button>
  );
}

export default BackButton;
