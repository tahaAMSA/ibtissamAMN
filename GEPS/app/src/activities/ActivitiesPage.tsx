import React, { useState } from 'react';
import { 
  Activity, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserPlus,
  UserMinus,
  Star,
  Trophy,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target
} from 'lucide-react';
import { useQuery } from 'wasp/client/operations';
import { getAllActivities, createActivity, updateActivity, deleteActivity, getAllBeneficiaries } from 'wasp/client/operations';
import { ActivityCategory, ActivityStatus } from '@prisma/client';

interface ActivityFormData {
  title: string;
  category: ActivityCategory;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  status: ActivityStatus;
  objectives: string;
  requirements: string;
  materials: string;
  instructor: string;
  cost: number;
  notes: string;
}

interface ParticipationFormData {
  activityId: string;
  beneficiaryId: string;
  registrationDate: string;
  status: string;
  notes: string;
}

const ActivitiesPage: React.FC = () => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<ActivityCategory | ''>('');
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [showParticipationModal, setShowParticipationModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const [formData, setFormData] = useState<ActivityFormData>({
    title: '',
    category: ActivityCategory.CULTURAL,
    description: '',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    capacity: 20,
    status: ActivityStatus.PLANNED,
    objectives: '',
    requirements: '',
    materials: '',
    instructor: '',
    cost: 0,
    notes: ''
  });

  const [participationForm, setParticipationForm] = useState<ParticipationFormData>({
    activityId: '',
    beneficiaryId: '',
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'REGISTERED',
    notes: ''
  });

  const { data: activities, isLoading } = useQuery(getAllActivities, {});
  const { data: beneficiaries } = useQuery(getAllBeneficiaries, {});

  const isRTL = language === 'ar';

  const t = {
    title: language === 'ar' ? 'إدارة الأنشطة' : 'Gestion des Activités',
    addNew: language === 'ar' ? 'إضافة نشاط جديد' : 'Nouvelle activité',
    search: language === 'ar' ? 'بحث...' : 'Rechercher...',
    noData: language === 'ar' ? 'لا توجد أنشطة' : 'Aucune activité enregistrée',
    loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...',
    activityTitle: language === 'ar' ? 'عنوان النشاط' : 'Titre de l\'activité',
    category: language === 'ar' ? 'الفئة' : 'Catégorie',
    description: language === 'ar' ? 'الوصف' : 'Description',
    location: language === 'ar' ? 'المكان' : 'Lieu',
    startDate: language === 'ar' ? 'تاريخ البداية' : 'Date de début',
    endDate: language === 'ar' ? 'تاريخ النهاية' : 'Date de fin',
    capacity: language === 'ar' ? 'السعة' : 'Capacité',
    status: language === 'ar' ? 'الحالة' : 'Statut',
    objectives: language === 'ar' ? 'الأهداف' : 'Objectifs',
    requirements: language === 'ar' ? 'المتطلبات' : 'Prérequis',
    materials: language === 'ar' ? 'المواد' : 'Matériel',
    instructor: language === 'ar' ? 'المدرب' : 'Instructeur',
    cost: language === 'ar' ? 'التكلفة' : 'Coût',
    notes: language === 'ar' ? 'ملاحظات' : 'Notes',
    participants: language === 'ar' ? 'المشاركون' : 'Participants',
    addParticipant: language === 'ar' ? 'إضافة مشارك' : 'Ajouter participant',
    registrations: language === 'ar' ? 'التسجيلات' : 'Inscriptions',
    save: language === 'ar' ? 'حفظ' : 'Enregistrer',
    cancel: language === 'ar' ? 'إلغاء' : 'Annuler',
    edit: language === 'ar' ? 'تحرير' : 'Modifier',
    delete: language === 'ar' ? 'حذف' : 'Supprimer',
    view: language === 'ar' ? 'عرض' : 'Voir',
    register: language === 'ar' ? 'تسجيل' : 'Inscrire',
    confirmDelete: language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Êtes-vous sûr de vouloir supprimer ?',
    available: language === 'ar' ? 'متاح' : 'Disponible',
    full: language === 'ar' ? 'مكتمل' : 'Complet',
    listView: language === 'ar' ? 'عرض القائمة' : 'Vue liste',
    gridView: language === 'ar' ? 'عرض الشبكة' : 'Vue grille',
    categories: {
      SPORTS: language === 'ar' ? 'رياضة' : 'Sport',
      CULTURAL: language === 'ar' ? 'ثقافي' : 'Culturel',
      EDUCATIONAL: language === 'ar' ? 'تعليمي' : 'Éducatif'
    },
    statuses: {
      PLANNED: language === 'ar' ? 'مخطط' : 'Planifié',
      IN_PROGRESS: language === 'ar' ? 'قيد التنفيذ' : 'En cours',
      COMPLETED: language === 'ar' ? 'مكتمل' : 'Terminé',
      CANCELLED: language === 'ar' ? 'ملغي' : 'Annulé'
    },
    stats: {
      total: language === 'ar' ? 'إجمالي الأنشطة' : 'Total activités',
      active: language === 'ar' ? 'أنشطة نشطة' : 'Activités actives',
      participants: language === 'ar' ? 'إجمالي المشاركين' : 'Total participants',
      upcoming: language === 'ar' ? 'أنشطة قادمة' : 'Activités à venir'
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: ActivityCategory.CULTURAL,
      description: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      capacity: 20,
      status: ActivityStatus.PLANNED,
      objectives: '',
      requirements: '',
      materials: '',
      instructor: '',
      cost: 0,
      notes: ''
    });
    setEditingActivity(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingActivity) {
        await updateActivity({ id: editingActivity.id, ...formData });
      } else {
        await createActivity(formData);
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (activity: any) => {
    setFormData({
      title: activity.title || '',
      category: activity.category as ActivityCategory,
      description: activity.description || '',
      location: activity.location || '',
      startDate: activity.startDate ? activity.startDate.split('T')[0] : '',
      endDate: activity.endDate ? activity.endDate.split('T')[0] : '',
      capacity: activity.capacity || 20,
      status: activity.status as ActivityStatus,
      objectives: activity.objectives || '',
      requirements: activity.requirements || '',
      materials: activity.materials || '',
      instructor: activity.instructor || '',
      cost: activity.cost || 0,
      notes: activity.notes || ''
    });
    setEditingActivity(activity);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteActivity({ id });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleParticipationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fonctionnalité à implémenter plus tard
    setShowParticipationModal(false);
  };

  const getCategoryColor = (category: ActivityCategory) => {
    switch (category) {
      case ActivityCategory.SPORTS:
        return 'bg-green-100 text-green-800 border-green-200';
      case ActivityCategory.CULTURAL:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case ActivityCategory.EDUCATIONAL:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case ActivityCategory.SPORTS:
        return <Trophy className="w-5 h-5" />;
      case ActivityCategory.CULTURAL:
        return <Star className="w-5 h-5" />;
      case ActivityCategory.EDUCATIONAL:
        return <FileText className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.PLANNED:
        return 'bg-blue-100 text-blue-800';
      case ActivityStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case ActivityStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case ActivityStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.PLANNED:
        return <Clock className="w-4 h-4" />;
      case ActivityStatus.IN_PROGRESS:
        return <PlayCircle className="w-4 h-4" />;
      case ActivityStatus.COMPLETED:
        return <CheckCircle2 className="w-4 h-4" />;
      case ActivityStatus.CANCELLED:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getAvailableSpots = (activity: any) => {
    // Simule le nombre de participants (à implémenter avec les vraies données)
    const simulatedParticipants = Math.floor(Math.random() * (activity.capacity || 20));
    return (activity.capacity || 20) - simulatedParticipants;
  };

  const filteredActivities = activities?.filter(activity => {
    const searchMatch = 
      activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const categoryMatch = !filterCategory || activity.category === filterCategory;
    const statusMatch = !filterStatus || activity.status === filterStatus;
    
    return searchMatch && categoryMatch && statusMatch;
  }) || [];

  // Calculs pour les statistiques
  const totalActivities = activities?.length || 0;
  const activeActivities = activities?.filter(a => a.status === ActivityStatus.IN_PROGRESS).length || 0;
  const totalParticipants = Math.floor(Math.random() * 100); // Simulation
  const upcomingActivities = activities?.filter(a => 
    a.status === ActivityStatus.PLANNED && new Date(a.startDate) > new Date()
  ).length || 0;

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
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.gridView}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.listView}
            </button>
          </div>
          
          <button 
            onClick={() => setShowParticipationModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <UserPlus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t.addParticipant}
          </button>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
          >
            <Plus className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t.addNew}
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.total}</p>
              <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-50">
              <PlayCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.active}</p>
              <p className="text-2xl font-bold text-gray-900">{activeActivities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.participants}</p>
              <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.upcoming}</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingActivities}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {t.category}
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ActivityCategory | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">Toutes</option>
              {Object.entries(t.categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.status}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ActivityStatus | '')}
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

      {/* Liste/Grille des activités */}
              {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const availableSpots = getAvailableSpots(activity);
            
            return (
              <div key={activity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getCategoryIcon(activity.category)}
                      <span className={`ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(activity.category)}`}>
                        {t.categories[activity.category as keyof typeof t.categories]}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                      {getStatusIcon(activity.status)}
                      <span className="ml-1">
                        {t.statuses[activity.status as keyof typeof t.statuses]}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.description}</p>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(activity.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {activity.location || 'Non spécifié'}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {(activity.capacity || 20) - availableSpots}/{activity.capacity || 20} participants
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${availableSpots > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {availableSpots > 0 ? `${availableSpots} ${t.available}` : t.full}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title={t.edit}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="text-red-600 hover:text-red-900"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredActivities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.activityTitle}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.category}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.startDate}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.participants}
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
                  {filteredActivities.map((activity) => {
                    const availableSpots = getAvailableSpots(activity);
                    
                    return (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                            <div className="text-sm text-gray-500">{activity.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(activity.category)}`}>
                            {getCategoryIcon(activity.category)}
                            <span className="ml-1">
                              {t.categories[activity.category as keyof typeof t.categories]}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(activity.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(activity.capacity || 20) - availableSpots}/{activity.capacity || 20}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                            {getStatusIcon(activity.status)}
                            <span className="ml-1">
                              {t.statuses[activity.status as keyof typeof t.statuses]}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleEdit(activity)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title={t.edit}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(activity.id)}
                              className="text-red-600 hover:text-red-900"
                              title={t.delete}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité</h3>
              <p className="mt-1 text-sm text-gray-500">{t.noData}</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingActivity ? 'Modifier l\'activité' : 'Nouvelle activité'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.activityTitle} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.category} *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ActivityCategory })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {Object.entries(t.categories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.startDate} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.endDate} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.capacity} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 20 })}
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ActivityStatus })}
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

      {/* Modal d'inscription */}
      {showParticipationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Inscrire un participant</h2>
            </div>

            <form onSubmit={handleParticipationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activité *
                </label>
                <select
                  required
                  value={participationForm.activityId}
                  onChange={(e) => setParticipationForm({ ...participationForm, activityId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une activité</option>
                  {activities?.map(activity => (
                    <option key={activity.id} value={activity.id}>
                      {activity.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bénéficiaire *
                </label>
                <select
                  required
                  value={participationForm.beneficiaryId}
                  onChange={(e) => setParticipationForm({ ...participationForm, beneficiaryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un bénéficiaire</option>
                  {beneficiaries?.map(beneficiary => (
                    <option key={beneficiary.id} value={beneficiary.id}>
                      {beneficiary.firstName} {beneficiary.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowParticipationModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Inscrire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;