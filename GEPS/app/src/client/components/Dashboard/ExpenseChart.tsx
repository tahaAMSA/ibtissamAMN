import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { cn } from '../../cn';

interface ExpenseCategory {
  name: string;
  value: number;
  amount: number;
  color: string;
  budget: number;
}

interface ExpenseChartProps {
  title: string;
  categories: ExpenseCategory[];
  className?: string;
  language?: 'ar' | 'fr';
}

export default function ExpenseChart({
  title,
  categories,
  className,
  language = 'fr'
}: ExpenseChartProps) {
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={cn('border-blue-100 border-2', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
        <div className="text-sm text-gray-600">
          <span className="font-medium">
            {language === 'ar' ? `إجمالي المصروف: ${formatCurrency(totalSpent)}` : `Total dépensé: ${formatCurrency(totalSpent)}`}
          </span>
          <span className="mx-2">•</span>
          <span>
            {language === 'ar' ? `الميزانية: ${formatCurrency(totalBudget)}` : `Budget: ${formatCurrency(totalBudget)}`}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Indicateur général */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">
              {language === 'ar' ? 'الاستخدام الإجمالي' : 'Utilisation totale'}
            </span>
            <span className="text-gray-600">{((totalSpent / totalBudget) * 100).toFixed(1)}%</span>
          </div>
          <Progress 
            value={(totalSpent / totalBudget) * 100} 
            className="h-3 bg-gray-200"
          />
        </div>

        {/* Détails par catégorie */}
        <div className="space-y-4">
          {categories.map((category, index) => {
            const percentage = (category.amount / category.budget) * 100;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80 && percentage <= 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn('w-4 h-4 rounded-full', category.color)}></div>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(category.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {language === 'ar' ? `من ${formatCurrency(category.budget)}` : `sur ${formatCurrency(category.budget)}`}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={cn(
                      'h-2',
                      isOverBudget ? 'bg-red-200' : isNearLimit ? 'bg-yellow-200' : 'bg-gray-200'
                    )}
                  />
                  
                  {/* Barre de dépassement de budget si nécessaire */}
                  {isOverBudget && (
                    <div className="relative">
                      <div className="h-1 bg-red-200 rounded-full">
                        <div 
                          className="h-1 bg-red-500 rounded-full"
                          style={{ width: `${Math.min((percentage - 100), 50)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-xs">
                    <span className={cn(
                      'font-medium',
                      isOverBudget ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-600'
                    )}>
                      {percentage.toFixed(1)}%
                    </span>
                    {isOverBudget && (
                      <span className="text-red-600 font-medium">
                        {language === 'ar' 
                          ? `تجاوز: ${formatCurrency(category.amount - category.budget)}`
                          : `Dépassement: ${formatCurrency(category.amount - category.budget)}`
                        }
                      </span>
                    )}
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
