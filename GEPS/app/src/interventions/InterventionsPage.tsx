import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User,
  Calendar,
  Clock,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';
import { useQuery } from 'wasp/client/operations';
import { getAllInterventions, createIntervention, updateIntervention, deleteIntervention, getAllBeneficiaries } from 'wasp/client/operations';
import { InterventionStatus } from '@prisma/client';

interface InterventionFormData {
  title: string;
  description: string;
  interventionDate: string;
  duration: number;
  location: string;
  status: InterventionStatus;
}

const InterventionsPage: React.FC = () => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<InterventionStatus | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState<any>(null);

  const [formData, setFormData] = useState<InterventionFormData>({
    title: '',
    description: '',
    interventionDate: new Date().toISOString().split('T')[0],
    duration: 60,
    location: '',
    status: InterventionStatus.PLANNED
  });

  const { data: interventions, isLoading } = useQuery(getAllInterventions, {});
  const { data: beneficiaries } = useQuery(getAllBeneficiaries, {});

  const isRTL = language === 'ar';

  const t = {
    title: language === 'ar' ? 'إدارة التدخلات الاجتماعية' : 'Gestion des Interventions Sociales',
    addNew: language === 'ar' ? 'إضافة تدخل جديد' : 'Nouvelle intervention',
    search: language === 'ar' ? 'بحث...' : 'Rechercher...',
    loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...',
    interventionTitle: language === 'ar' ? 'عنوان التدخل' : 'Titre de l\'intervention',
    description: language === 'ar' ? 'الوصف' : 'Description',
    interventionDate: language === 'ar' ? 'تاريخ التدخل' : 'Date d\'intervention',
    duration: language === 'ar' ? 'المدة (دقائق)' : 'Durée (minutes)',
    location: language === 'ar' ? 'المكان' : 'Lieu',
    status: language === 'ar' ? 'الحالة' : 'Statut',
    save: language === 'ar' ? 'حفظ' : 'Enregistrer',
    cancel: language === 'ar' ? 'إلغاء' : 'Annuler',
    edit: language === 'ar' ? 'تحرير' : 'Modifier',
    delete: language === 'ar' ? 'حذف' : 'Supprimer',
    confirmDelete: language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Êtes-vous sûr de vouloir supprimer ?',
    statuses: {
      PLANNED: language === 'ar' ? 'مخطط' : 'Planifié',
      IN_PROGRESS: language === 'ar' ? 'قيد التنفيذ' : 'En cours',
      COMPLETED: language === 'ar' ? 'مكتمل' : 'Terminé',
      CANCELLED: language === 'ar' ? 'ملغي' : 'Annulé'
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      interventionDate: new Date().toISOString().split('T')[0],
      duration: 60,
      location: '',
      status: InterventionStatus.PLANNED
    });
    setEditingIntervention(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingIntervention) {
        await updateIntervention({ id: editingIntervention.id, ...formData });
      } else {
        await createIntervention(formData);
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (intervention: any) => {
    setFormData({
      title: intervention.title || '',
      description: intervention.description || '',
      interventionDate: intervention.interventionDate ? intervention.interventionDate.split('T')[0] : '',
      duration: intervention.duration || 60,
      location: intervention.location || '',
      status: intervention.status as InterventionStatus
    });
    setEditingIntervention(intervention);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteIntervention({ id });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getStatusColor = (status: InterventionStatus) => {
    switch (status) {
      case InterventionStatus.PLANNED:
        return 'bg-blue-100 text-blue-800';
      case InterventionStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case InterventionStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case InterventionStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: InterventionStatus) => {
    switch (status) {
      case InterventionStatus.PLANNED:
        return <Calendar className="w-4 h-4" />;
      case InterventionStatus.IN_PROGRESS:
        return <PlayCircle className="w-4 h-4" />;
      case InterventionStatus.COMPLETED:
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredInterventions = interventions?.filter(intervention => {
    const searchMatch = 
      intervention.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = !filterStatus || intervention.status === filterStatus;
    
    return searchMatch && statusMatch;
  }) || [];

  if (isLoading) {
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
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
        >
          <Plus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t.addNew}
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.search}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.status}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as InterventionStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">Tous</option>
              {Object.entries(t.statuses).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des interventions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredInterventions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.interventionTitle}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.interventionDate}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInterventions.map((intervention) => (
                  <tr key={intervention.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {intervention.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {intervention.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(intervention.interventionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(intervention.status)}`}>
                        {getStatusIcon(intervention.status)}
                        <span className="ml-1">
                          {t.statuses[intervention.status as keyof typeof t.statuses]}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleEdit(intervention)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(intervention.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune intervention</h3>
            <p className="mt-1 text-sm text-gray-500">Aucune intervention enregistrée</p>
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingIntervention 
                  ? 'Modifier l\'intervention'
                  : 'Nouvelle intervention'
                }
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.interventionTitle} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.interventionDate} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.interventionDate}
                    onChange={(e) => setFormData({ ...formData, interventionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.status} *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as InterventionStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {Object.entries(t.statuses).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.description} *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
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

export default InterventionsPage;