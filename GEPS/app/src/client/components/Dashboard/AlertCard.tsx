import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../cn';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface Alert {
  type: 'warning' | 'error' | 'success' | 'info';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface AlertCardProps {
  title: string;
  alerts: Alert[];
  className?: string;
  language?: 'ar' | 'fr';
}

const alertConfig = {
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-l-yellow-500',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-l-red-500',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-l-green-500',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-l-blue-500',
  },
};

const priorityVariants = {
  high: 'destructive',
  medium: 'warning',
  low: 'info',
} as const;

export default function AlertCard({
  title,
  alerts,
  className,
  language = 'fr'
}: AlertCardProps) {
  return (
    <Card className={cn('border-blue-100 border-2', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p className="text-sm">
              {language === 'ar' ? 'لا توجد تنبيهات في الوقت الحالي' : 'Aucune alerte pour le moment'}
            </p>
          </div>
        ) : (
          alerts.map((alert, index) => {
            const config = alertConfig[alert.type];
            const Icon = config.icon;
            
            return (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm',
                  config.bgColor,
                  config.borderColor
                )}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.iconColor)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed">{alert.message}</p>
                  </div>
                  <Badge 
                    variant={priorityVariants[alert.priority]}
                    className="ml-2 flex-shrink-0"
                  >
                    {language === 'ar' 
                      ? (alert.priority === 'high' ? 'عاجل' : 
                         alert.priority === 'medium' ? 'متوسط' : 'منخفض')
                      : (alert.priority === 'high' ? 'Urgent' : 
                         alert.priority === 'medium' ? 'Moyen' : 'Faible')
                    }
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
