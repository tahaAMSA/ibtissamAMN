import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../cn';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    type: 'up' | 'down' | 'neutral';
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantConfig = {
  default: {
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    cardBorder: 'border-blue-100',
  },
  primary: {
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    cardBorder: 'border-blue-100',
  },
  success: {
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    cardBorder: 'border-green-100',
  },
  warning: {
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    cardBorder: 'border-yellow-100',
  },
  danger: {
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    cardBorder: 'border-red-100',
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  className
}: StatCardProps) {
  const config = variantConfig[variant];

  const getTrendColor = (type: 'up' | 'down' | 'neutral') => {
    switch (type) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (type: 'up' | 'down' | 'neutral') => {
    switch (type) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return null;
    }
  };

  const TrendIcon = trend ? getTrendIcon(trend.type) : null;

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md border-2',
      config.cardBorder,
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn(
              'p-3 rounded-xl',
              config.iconBg
            )}>
              <Icon className={cn('w-6 h-6', config.iconColor)} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <div className={cn(
                  'flex items-center mt-2 text-sm',
                  getTrendColor(trend.type)
                )}>
                  {TrendIcon && <TrendIcon className="w-4 h-4 mr-1" />}
                  <span className="font-medium">
                    {trend.type === 'up' ? '+' : trend.type === 'down' ? '-' : ''}{Math.abs(trend.value)}%
                  </span>
                  <span className="ml-1 text-gray-500">{trend.label}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
