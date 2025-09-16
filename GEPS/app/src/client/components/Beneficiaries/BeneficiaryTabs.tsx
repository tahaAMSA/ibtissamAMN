import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../cn';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface BeneficiaryTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  language: 'fr' | 'ar';
  className?: string;
}

export default function BeneficiaryTabs({
  tabs,
  activeTab,
  onTabChange,
  language,
  className
}: BeneficiaryTabsProps) {
  const isRTL = language === 'ar';

  return (
    <Card className={cn('border-blue-100 border-2', className)}>
      <CardContent className="p-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center space-x-2 h-12 px-4 transition-all duration-200',
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-600'
                  )}>
                    {tab.count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
