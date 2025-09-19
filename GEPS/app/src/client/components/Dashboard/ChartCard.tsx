import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { cn } from '../../cn';

interface ChartDataItem {
  month: string;
  beneficiaires: number;
  interventions: number;
  activites: number;
}

interface ChartCardProps {
  title: string;
  description?: string;
  data: ChartDataItem[];
  className?: string;
  language?: 'ar' | 'fr';
}

export default function ChartCard({
  title,
  description,
  data,
  className,
  language = 'fr'
}: ChartCardProps) {
  const maxValues = {
    beneficiaires: Math.max(...data.map(d => d.beneficiaires)),
    interventions: Math.max(...data.map(d => d.interventions)),
    activites: Math.max(...data.map(d => d.activites))
  };

  return (
    <Card className={cn('border-blue-100 border-2', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
        {description && (
          <CardDescription className="text-gray-600">{description}</CardDescription>
        )}
        
        {/* Légende */}
        <div className="flex space-x-6 text-sm mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-700">
              {language === 'ar' ? 'المستفيدون' : 'Bénéficiaires'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-700">
              {language === 'ar' ? 'التدخلات' : 'Interventions'}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-700">
              {language === 'ar' ? 'الأنشطة' : 'Activités'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 w-12">{item.month}</span>
            </div>
            
            <div className="space-y-2">
              {/* Bénéficiaires */}
              <div className="flex items-center space-x-3">
                <div className="w-20 text-xs text-gray-600">
                  {language === 'ar' ? 'مستفيدون' : 'Bénéficiaires'}
                </div>
                <div className="flex-1 relative">
                  <Progress 
                    value={(item.beneficiaires / maxValues.beneficiaires) * 100} 
                    className="h-3 bg-blue-100"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{item.beneficiaires}</span>
                  </div>
                </div>
              </div>
              
              {/* Interventions */}
              <div className="flex items-center space-x-3">
                <div className="w-20 text-xs text-gray-600">
                  {language === 'ar' ? 'تدخلات' : 'Interventions'}
                </div>
                <div className="flex-1 relative">
                  <Progress 
                    value={(item.interventions / maxValues.interventions) * 100} 
                    className="h-3"
                  />
                  <div 
                    className="absolute top-0 left-0 h-3 bg-green-500 rounded-full transition-all"
                    style={{ width: `${(item.interventions / maxValues.interventions) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{item.interventions}</span>
                  </div>
                </div>
              </div>
              
              {/* Activités */}
              <div className="flex items-center space-x-3">
                <div className="w-20 text-xs text-gray-600">
                  {language === 'ar' ? 'أنشطة' : 'Activités'}
                </div>
                <div className="flex-1 relative">
                  <Progress 
                    value={(item.activites / maxValues.activites) * 100} 
                    className="h-3"
                  />
                  <div 
                    className="absolute top-0 left-0 h-3 bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${(item.activites / maxValues.activites) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{item.activites}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
