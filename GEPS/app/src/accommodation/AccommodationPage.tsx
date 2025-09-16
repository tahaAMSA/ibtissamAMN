import React, { useState } from 'react';
import { 
  Home, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Users, 
  Bed, 
  Calendar, 
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone
} from 'lucide-react';
import { useQuery } from 'wasp/client/operations';
import { getAllStays, createStay, updateStay, deleteStay, getAllBeneficiaries } from 'wasp/client/operations';
import { StayStatus } from '@prisma/client';

interface StayFormData {
  dormitory: string;
  bed: string;
  checkInDate: string;
  checkOutDate: string;
  beneficiaryId: string;
  status: StayStatus;
}

const AccommodationPage: React.FC = () => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDormitory, setFilterDormitory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStay, setEditingStay] = useState<any>(null);
  const [formData, setFormData] = useState<StayFormData>({
    dormitory: '',
    bed: '',
    checkInDate: '',
    checkOutDate: '',
    beneficiaryId: '',
    status: StayStatus.ACTIVE
  });

  const { data: stays, isLoading } = useQuery(getAllStays, {});
  const { data: beneficiaries } = useQuery(getAllBeneficiaries, {});

  const isRTL = language === 'ar';

  const t = {
    title: language === 'ar' ? 'إدارة الإيواء' : 'Gestion de l\'Hébergement',
    addNew: language === 'ar' ? 'إضافة إقامة جديدة' : 'Ajouter un nouveau séjour',
    search: language === 'ar' ? 'بحث...' : 'Rechercher...',
    noData: language === 'ar' ? 'لا توجد إقامات' : 'Aucun séjour enregistré',
    loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...',
    dormitory: language === 'ar' ? 'المهجع' : 'Dortoir',
    bed: language === 'ar' ? 'السرير' : 'Lit',
    beneficiary: language === 'ar' ? 'المستفيد' : 'Bénéficiaire',
    checkIn: language === 'ar' ? 'تاريخ الدخول' : 'Date d\'entrée',
    checkOut: language === 'ar' ? 'تاريخ الخروج' : 'Date de sortie',
    status: language === 'ar' ? 'الحالة' : 'Statut',
    active: language === 'ar' ? 'نشط' : 'Actif',
    ended: language === 'ar' ? 'منتهي' : 'Terminé',
    suspended: language === 'ar' ? 'معلق' : 'Suspendu',
    actions: language === 'ar' ? 'الإجراءات' : 'Actions',
    edit: language === 'ar' ? 'تحرير' : 'Modifier',
    delete: language === 'ar' ? 'حذف' : 'Supprimer',
    save: language === 'ar' ? 'حفظ' : 'Enregistrer',
    cancel: language === 'ar' ? 'إلغاء' : 'Annuler',
    all: language === 'ar' ? 'الكل' : 'Tous',
    filter: language === 'ar' ? 'تصفية' : 'Filtrer',
    confirmDelete: language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Êtes-vous sûr de vouloir supprimer ?',
    selectBeneficiary: language === 'ar' ? 'اختر مستفيد' : 'Sélectionner un bénéficiaire',
    occupancyRate: language === 'ar' ? 'معدل الإشغال' : 'Taux d\'occupation',
    availableBeds: language === 'ar' ? 'الأسرة المتاحة' : 'Lits disponibles',
    totalCapacity: language === 'ar' ? 'السعة الإجمالية' : 'Capacité totale'
  };

  const resetForm = () => {
    setFormData({
      dormitory: '',
      bed: '',
      checkInDate: '',
      checkOutDate: '',
      beneficiaryId: '',
      status: StayStatus.ACTIVE
    });
    setEditingStay(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const stayData = {
        ...formData,
        checkInDate: formData.checkInDate, // Garder comme string
        checkOutDate: formData.checkOutDate || undefined // String ou undefined
      };

      if (editingStay) {
        await updateStay({ id: editingStay.id, ...stayData });
      } else {
        await createStay(stayData);
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (stay: any) => {
    setFormData({
      dormitory: stay.dormitory,
      bed: stay.bed,
      checkInDate: stay.checkInDate.split('T')[0],
      checkOutDate: stay.checkOutDate ? stay.checkOutDate.split('T')[0] : '',
      beneficiaryId: stay.beneficiaryId,
      status: stay.status as StayStatus
    });
    setEditingStay(stay);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteStay({ id });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getStatusColor = (status: StayStatus) => {
    switch (status) {
      case StayStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case StayStatus.ENDED:
        return 'bg-gray-100 text-gray-800';
      case StayStatus.SUSPENDED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: StayStatus) => {
    switch (status) {
      case StayStatus.ACTIVE:
        return <CheckCircle className="w-4 h-4" />;
      case StayStatus.ENDED:
        return <XCircle className="w-4 h-4" />;
      case StayStatus.SUSPENDED:
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Données des dortoirs (à terme, cela pourrait venir de la base de données)
  const dormitories = [
    { name: 'Dortoir A', capacity: 20, beds: Array.from({length: 20}, (_, i) => `A${i+1}`) },
    { name: 'Dortoir B', capacity: 15, beds: Array.from({length: 15}, (_, i) => `B${i+1}`) },
    { name: 'Dortoir C', capacity: 12, beds: Array.from({length: 12}, (_, i) => `C${i+1}`) },
    { name: 'Dortoir D', capacity: 18, beds: Array.from({length: 18}, (_, i) => `D${i+1}`) }
  ];

  const selectedDormitory = dormitories.find(d => d.name === formData.dormitory);

  const filteredStays = stays?.filter(stay => {
    const searchMatch = 
      stay.dormitory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stay.bed.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = !filterStatus || stay.status === filterStatus;
    const dormitoryMatch = !filterDormitory || stay.dormitory === filterDormitory;
    
    return searchMatch && statusMatch && dormitoryMatch;
  }) || [];

  // Calculs pour les statistiques
  const totalCapacity = dormitories.reduce((sum, d) => sum + d.capacity, 0);
  const occupiedBeds = stays?.filter(s => s.status === StayStatus.ACTIVE).length || 0;
  const availableBeds = totalCapacity - occupiedBeds;
  const occupancyRate = totalCapacity > 0 ? (occupiedBeds / totalCapacity * 100).toFixed(1) : 0;

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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.totalCapacity}</p>
              <p className="text-2xl font-bold text-gray-900">{totalCapacity}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <Bed className="w-6 h-6 text-green-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.availableBeds}</p>
              <p className="text-2xl font-bold text-gray-900">{availableBeds}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-50">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">Lits occupés</p>
              <p className="text-2xl font-bold text-gray-900">{occupiedBeds}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-50">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.occupancyRate}</p>
              <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              {t.dormitory}
            </label>
            <select
              value={filterDormitory}
              onChange={(e) => setFilterDormitory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">{t.all}</option>
              {dormitories.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.status}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">{t.all}</option>
              <option value={StayStatus.ACTIVE}>{t.active}</option>
              <option value={StayStatus.ENDED}>{t.ended}</option>
              <option value={StayStatus.SUSPENDED}>{t.suspended}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des séjours */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredStays.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.beneficiary}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.dormitory}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.bed}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.checkIn}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.checkOut}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStays.map((stay) => (
                  <tr key={stay.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {/* Ici on pourrait afficher le nom du bénéficiaire */}
                          Bénéficiaire #{stay.beneficiaryId.slice(-4)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stay.dormitory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stay.bed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(stay.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stay.checkOutDate ? new Date(stay.checkOutDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(stay.status)}`}>
                        {getStatusIcon(stay.status)}
                        <span className="ml-1">
                          {stay.status === StayStatus.ACTIVE ? t.active : 
                           stay.status === StayStatus.ENDED ? t.ended : t.suspended}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleEdit(stay)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(stay.id)}
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
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun séjour</h3>
            <p className="mt-1 text-sm text-gray-500">{t.noData}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingStay 
                  ? (language === 'ar' ? 'تحرير الإقامة' : 'Modifier le séjour')
                  : (language === 'ar' ? 'إضافة إقامة جديدة' : 'Ajouter un nouveau séjour')
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
                  {t.beneficiary} *
                </label>
                <select
                  required
                  value={formData.beneficiaryId}
                  onChange={(e) => setFormData({ ...formData, beneficiaryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">{t.selectBeneficiary}</option>
                  {beneficiaries?.map(beneficiary => (
                    <option key={beneficiary.id} value={beneficiary.id}>
                      {beneficiary.firstName} {beneficiary.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.dormitory} *
                  </label>
                  <select
                    required
                    value={formData.dormitory}
                    onChange={(e) => setFormData({ ...formData, dormitory: e.target.value, bed: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">{language === 'ar' ? 'اختر مهجع' : 'Sélectionner un dortoir'}</option>
                    {dormitories.map(d => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.capacity} lits)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.bed} *
                  </label>
                  <select
                    required
                    value={formData.bed}
                    onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                    disabled={!selectedDormitory}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">{language === 'ar' ? 'اختر سرير' : 'Sélectionner un lit'}</option>
                    {selectedDormitory?.beds.map(bed => (
                      <option key={bed} value={bed}>{bed}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.checkIn} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.checkOut}
                  </label>
                  <input
                    type="date"
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.status} *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StayStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value={StayStatus.ACTIVE}>{t.active}</option>
                  <option value={StayStatus.ENDED}>{t.ended}</option>
                  <option value={StayStatus.SUSPENDED}>{t.suspended}</option>
                </select>
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

export default AccommodationPage;