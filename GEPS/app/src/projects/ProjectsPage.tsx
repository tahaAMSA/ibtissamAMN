import React, { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getAllProjects } from 'wasp/client/operations';
import { Lightbulb, Plus, Search } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: projects, isLoading, error } = useQuery(getAllProjects);

  const isRTL = language === 'ar';

  const t = {
    title: language === 'ar' ? 'إدارة المشاريع الريادية' : 'Gestion des Projets Entrepreneuriaux',
    addNew: language === 'ar' ? 'إضافة مشروع جديد' : 'Ajouter un nouveau projet',
    loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600 mt-1">
              {language === 'ar' 
                ? `إجمالي المشاريع: ${projects?.length || 0}`
                : `Total des projets: ${projects?.length || 0}`
              }
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors">
            <Plus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t.addNew}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Module Projets Entrepreneuriaux - En développement</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
