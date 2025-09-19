import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../../cn';
import { LucideIcon, Clock } from 'lucide-react';

interface Activity {
  type: string;
  action: string;
  time: string;
  icon: LucideIcon;
  priority?: 'high' | 'medium' | 'low';
}

interface RecentActivityProps {
  title: string;
  activities: Activity[];
  className?: string;
  language?: 'ar' | 'fr';
}

const typeColors = {
  beneficiary: 'bg-blue-100 text-blue-600',
  document: 'bg-green-100 text-green-600',
  intervention: 'bg-yellow-100 text-yellow-600',
  budget: 'bg-red-100 text-red-600',
  activity: 'bg-purple-100 text-purple-600',
  accommodation: 'bg-orange-100 text-orange-600',
};

export default function RecentActivity({
  title,
  activities,
  className,
  language = 'fr'
}: RecentActivityProps) {
  return (
    <Card className={cn('border-blue-100 border-2', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm">
              {language === 'ar' ? 'لا توجد أنشطة حديثة' : 'Aucune activité récente'}
            </p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const Icon = activity.icon;
            const colorClass = typeColors[activity.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-600';
            
            return (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-transparent hover:border-blue-200"
              >
                <div className={cn(
                  'p-2 rounded-lg flex-shrink-0',
                  colorClass
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-relaxed">
                    {activity.action}
                  </p>
                  <div className="flex items-center mt-1 space-x-2">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {language === 'ar' ? `منذ ${activity.time}` : `Il y a ${activity.time}`}
                    </p>
                    {activity.priority && (
                      <Badge 
                        variant={
                          activity.priority === 'high' ? 'destructive' :
                          activity.priority === 'medium' ? 'warning' : 'info'
                        }
                        className="text-xs"
                      >
                        {language === 'ar' 
                          ? (activity.priority === 'high' ? 'عاجل' : 
                             activity.priority === 'medium' ? 'مهم' : 'عادي')
                          : (activity.priority === 'high' ? 'Urgent' : 
                             activity.priority === 'medium' ? 'Important' : 'Normal')
                        }
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
