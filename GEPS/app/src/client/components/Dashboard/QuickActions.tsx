import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../cn';
import { LucideIcon } from 'lucide-react';

interface QuickAction {
  title: string;
  icon: LucideIcon;
  to: string;
  color: string;
  description?: string;
}

interface QuickActionsProps {
  title: string;
  actions: QuickAction[];
  className?: string;
}

export default function QuickActions({
  title,
  actions,
  className
}: QuickActionsProps) {
  return (
    <Card className={cn('border-blue-100 border-2', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center space-y-3 hover:bg-blue-50 border border-blue-100 hover:border-blue-300 transition-all duration-200 group"
                asChild
              >
                <Link to={action.to}>
                  <div className={cn(
                    'p-3 rounded-xl transition-colors group-hover:scale-110 transform transition-transform duration-200',
                    action.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
                      {action.title}
                    </span>
                    {action.description && (
                      <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                    )}
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
