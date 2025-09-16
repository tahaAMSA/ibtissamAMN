"use client"

import React, { memo, useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface OptimizedTooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  className?: string;
  contentClassName?: string;
}

/**
 * Composant Tooltip optimisé pour les performances
 * Évite les re-renders inutiles grâce à la mémorisation
 */
const OptimizedTooltip = memo(({
  children,
  content,
  side = 'right',
  delayDuration = 300,
  className,
  contentClassName = "bg-gray-900 text-white"
}: OptimizedTooltipProps) => {
  // Mémorisation du contenu pour éviter les re-renders
  const memoizedContent = useMemo(() => content, [content]);
  
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild className={className}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={contentClassName}>
        {memoizedContent}
      </TooltipContent>
    </Tooltip>
  );
});

OptimizedTooltip.displayName = 'OptimizedTooltip';

export { OptimizedTooltip };
