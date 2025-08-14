import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle2,
  Download
} from 'lucide-react';
import { useQuery } from 'wasp/client/operations';
import { getAllBudgets, createBudget, updateBudget, deleteBudget } from 'wasp/client/operations';

interface BudgetFormData {
  module: string;
  description: string;
  initialAmount: number;
  year: number;
}



const BudgetPage: React.FC = () => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const [budgetForm, setBudgetForm] = useState<BudgetFormData>({
    module: 'OPERATIONS',
    description: '',
    initialAmount: 0,
    year: new Date().getFullYear()
  });



  const { data: budgets, isLoading: budgetsLoading } = useQuery(getAllBudgets, {});

  const isRTL = language === 'ar';

  const t = {
    title: language === 'ar' ? 'إدارة الميزانية' : 'Gestion du Budget',
    budgets: language === 'ar' ? 'الميزانيات' : 'Budgets',
    addBudget: language === 'ar' ? 'إضافة ميزانية' : 'Nouveau budget',

    search: language === 'ar' ? 'بحث...' : 'Rechercher...',
    loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...',
    name: language === 'ar' ? 'الاسم' : 'Nom',
    description: language === 'ar' ? 'الوصف' : 'Description',
    amount: language === 'ar' ? 'المبلغ' : 'Montant',
    totalAmount: language === 'ar' ? 'المبلغ الإجمالي' : 'Montant total',
    category: language === 'ar' ? 'الفئة' : 'Catégorie',
    date: language === 'ar' ? 'التاريخ' : 'Date',
    save: language === 'ar' ? 'حفظ' : 'Enregistrer',
    cancel: language === 'ar' ? 'إلغاء' : 'Annuler',
    edit: language === 'ar' ? 'تحرير' : 'Modifier',
    delete: language === 'ar' ? 'حذف' : 'Supprimer',
    spent: language === 'ar' ? 'مُنفق' : 'Dépensé',
    remaining: language === 'ar' ? 'متبقي' : 'Restant',
    stats: {
      totalBudget: language === 'ar' ? 'إجمالي الميزانية' : 'Budget total',
      totalExpenses: language === 'ar' ? 'إجمالي المصروفات' : 'Total dépenses',
      totalRevenues: language === 'ar' ? 'إجمالي الإيرادات' : 'Total revenus',
      balance: language === 'ar' ? 'الرصيد' : 'Solde'
    }
  };

  const resetBudgetForm = () => {
    setBudgetForm({
      module: 'OPERATIONS',
      description: '',
      initialAmount: 0,
      year: new Date().getFullYear()
    });
    setEditingBudget(null);
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBudget) {
        await updateBudget({ id: editingBudget.id, ...budgetForm });
      } else {
        await createBudget(budgetForm);
      }
      
      setShowBudgetModal(false);
      resetBudgetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const calculateBudgetProgress = (budget: any) => {
    const totalSpent = budget.usedAmount || 0;
    const totalBudget = budget.initialAmount || 0;
    const percentage = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;
    return {
      spent: totalSpent,
      remaining: totalBudget - totalSpent,
      percentage: Math.min(percentage, 100)
    };
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculs pour les statistiques
  const totalBudgetAmount = budgets?.reduce((sum, b) => sum + (b.initialAmount || 0), 0) || 0;
  const totalExpenseAmount = budgets?.reduce((sum, b) => sum + (b.usedAmount || 0), 0) || 0;
  const currentBalance = totalBudgetAmount - totalExpenseAmount;

  if (budgetsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <button 
          onClick={() => setShowBudgetModal(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
        >
          <Plus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t.addBudget}
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.totalBudget}</p>
              <p className="text-2xl font-bold text-gray-900">{totalBudgetAmount.toLocaleString()} DH</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-50">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.totalExpenses}</p>
              <p className="text-2xl font-bold text-gray-900">{totalExpenseAmount.toLocaleString()} DH</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">Budgets actifs</p>
              <p className="text-2xl font-bold text-gray-900">{budgets?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${currentBalance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <DollarSign className={`w-6 h-6 ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.balance}</p>
              <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentBalance.toLocaleString()} DH
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'budgets', label: t.budgets, icon: Target }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className="py-4 px-1 border-b-2 font-medium text-sm flex items-center border-yellow-500 text-yellow-600"
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Onglet Budgets */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets?.map((budget) => {
                  const progress = calculateBudgetProgress(budget);
                  
                  return (
                    <div key={budget.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{budget.module}</h3>
                          <p className="text-sm text-gray-600">{budget.year}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budget initial:</span>
                          <span className="font-medium">{budget.initialAmount?.toLocaleString()} DH</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t.spent}:</span>
                          <span className="font-medium text-red-600">{progress.spent.toLocaleString()} DH</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t.remaining}:</span>
                          <span className="font-medium text-green-600">{progress.remaining.toLocaleString()} DH</span>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progression:</span>
                            <span className="font-medium">{progress.percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress.percentage)}`}
                              style={{ width: `${progress.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>


        </div>
      </div>

      {/* Modal Budget */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Nouveau budget</h2>
              <button
                onClick={() => setShowBudgetModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBudgetSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module *
                  </label>
                  <input
                    type="text"
                    required
                    value={budgetForm.module}
                    onChange={(e) => setBudgetForm({ ...budgetForm, module: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant initial *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={budgetForm.initialAmount}
                    onChange={(e) => setBudgetForm({ ...budgetForm, initialAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année *
                  </label>
                  <input
                    type="number"
                    required
                    min="2020"
                    max="2030"
                    value={budgetForm.year}
                    onChange={(e) => setBudgetForm({ ...budgetForm, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.description}
                </label>
                <textarea
                  value={budgetForm.description}
                  onChange={(e) => setBudgetForm({ ...budgetForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default BudgetPage;