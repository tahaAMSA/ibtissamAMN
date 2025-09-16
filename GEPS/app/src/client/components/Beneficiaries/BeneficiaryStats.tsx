import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../cn';
import { FileText, Activity, Lightbulb, GraduationCap, Home, MessageSquare } from 'lucide-react';

interface Stat {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface BeneficiaryStatsProps {
  language: 'fr' | 'ar';
  className?: string;
}

export default function BeneficiaryStats({
  language,
  className
}: BeneficiaryStatsProps) {
  const t = {
    title: language === 'ar' ? 'الإحصائيات' : 'Statistiques',
    documents: language === 'ar' ? 'الوثائق' : 'Documents',
    activities: language === 'ar' ? 'الأنشطة' : 'Activités',
    projects: language === 'ar' ? 'المشاريع' : 'Projets',
    education: language === 'ar' ? 'التعليم' : 'Éducation',
    accommodation: language === 'ar' ? 'الإيواء' : 'Hébergement',
    interventions: language === 'ar' ? 'التدخلات' : 'Interventions'
  };

  const stats: Stat[] = [
    {
      label: t.documents,
      value: 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: t.activities,
      value: 0,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: t.projects,
      value: 0,
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: t.education,
      value: 0,
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: t.accommodation,
      value: 0,
      icon: Home,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: t.interventions,
      value: 0,
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <Card className={cn('border-blue-100 border-2', className)}>
      <CardHeader>
        <CardTitle className="text-xl text-blue-900">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-lg border border-opacity-20 transition-all duration-200 hover:shadow-md cursor-pointer group',
                  stat.bgColor
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                      {stat.value}
                    </p>
                    <p className={cn('text-sm font-medium', stat.color)}>
                      {stat.label}
                    </p>
                  </div>
                  <div className={cn('p-2 rounded-lg', stat.bgColor.replace('50', '100'))}>
                    <Icon className={cn('w-6 h-6', stat.color)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
