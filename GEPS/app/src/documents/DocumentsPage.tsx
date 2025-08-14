import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Calendar, 
  User,
  Eye,
  File,
  Image,
  FileCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  Paperclip,
  FolderOpen,
  Camera
} from 'lucide-react';
import { useQuery } from 'wasp/client/operations';
import { getAllDocuments, createDocument, updateDocument, deleteDocument, getAllBeneficiaries } from 'wasp/client/operations';
import { DocumentType, DocumentStatus } from '@prisma/client';

interface DocumentFormData {
  type: DocumentType;
  content: string;
  date: string;
  beneficiaryId: string;
  status: DocumentStatus;
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  notes?: string;
  expiryDate?: string;
}

const DocumentsPage: React.FC = () => {
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<DocumentType | ''>('');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | ''>('');
  const [filterBeneficiary, setFilterBeneficiary] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<DocumentFormData>({
    type: DocumentType.IDENTITY_CARD,
    content: '',
    date: new Date().toISOString().split('T')[0],
    beneficiaryId: '',
    status: DocumentStatus.ACTIVE,
    fileName: '',
    fileSize: 0,
    fileUrl: '',
    notes: '',
    expiryDate: ''
  });

  const { data: documents, isLoading } = useQuery(getAllDocuments, {});
  const { data: beneficiaries } = useQuery(getAllBeneficiaries, {});

  const isRTL = language === 'ar';

  const t = {
    title: language === 'ar' ? 'إدارة الوثائق' : 'Gestion des Documents',
    addNew: language === 'ar' ? 'إضافة وثيقة جديدة' : 'Ajouter un nouveau document',
    search: language === 'ar' ? 'بحث...' : 'Rechercher...',
    noData: language === 'ar' ? 'لا توجد وثائق' : 'Aucun document enregistré',
    loading: language === 'ar' ? 'جاري التحميل...' : 'Chargement...',
    type: language === 'ar' ? 'النوع' : 'Type',
    content: language === 'ar' ? 'المحتوى' : 'Contenu',
    date: language === 'ar' ? 'التاريخ' : 'Date',
    beneficiary: language === 'ar' ? 'المستفيد' : 'Bénéficiaire',
    status: language === 'ar' ? 'الحالة' : 'Statut',
    actions: language === 'ar' ? 'الإجراءات' : 'Actions',
    edit: language === 'ar' ? 'تحرير' : 'Modifier',
    delete: language === 'ar' ? 'حذف' : 'Supprimer',
    view: language === 'ar' ? 'عرض' : 'Voir',
    download: language === 'ar' ? 'تحميل' : 'Télécharger',
    save: language === 'ar' ? 'حفظ' : 'Enregistrer',
    cancel: language === 'ar' ? 'إلغاء' : 'Annuler',
    all: language === 'ar' ? 'الكل' : 'Tous',
    filter: language === 'ar' ? 'تصفية' : 'Filtrer',
    confirmDelete: language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Êtes-vous sûr de vouloir supprimer ?',
    selectBeneficiary: language === 'ar' ? 'اختر مستفيد' : 'Sélectionner un bénéficiaire',
    uploadFile: language === 'ar' ? 'رفع ملف' : 'Téléverser un fichier',
    dragDrop: language === 'ar' ? 'اسحب واسقط الملفات هنا أو انقر للاختيار' : 'Glissez-déposez les fichiers ici ou cliquez pour sélectionner',
    fileName: language === 'ar' ? 'اسم الملف' : 'Nom du fichier',
    fileSize: language === 'ar' ? 'حجم الملف' : 'Taille du fichier',
    notes: language === 'ar' ? 'ملاحظات' : 'Notes',
    expiryDate: language === 'ar' ? 'تاريخ انتهاء الصلاحية' : 'Date d\'expiration',
    preview: language === 'ar' ? 'معاينة' : 'Aperçu',
    documentTypes: {
      IDENTITY_CARD: language === 'ar' ? 'بطاقة الهوية' : 'Carte d\'identité',
      BIRTH_CERTIFICATE: language === 'ar' ? 'شهادة الميلاد' : 'Acte de naissance',
      RESIDENCE_CERTIFICATE: language === 'ar' ? 'شهادة إقامة' : 'Certificat de résidence',
      MEDICAL_CERTIFICATE: language === 'ar' ? 'شهادة طبية' : 'Certificat médical',
      SCHOOL_CERTIFICATE: language === 'ar' ? 'شهادة مدرسية' : 'Certificat scolaire',
      INCOME_CERTIFICATE: language === 'ar' ? 'شهادة دخل' : 'Certificat de revenus',
      FAMILY_COMPOSITION: language === 'ar' ? 'تركيبة الأسرة' : 'Composition familiale',
      PHOTO: language === 'ar' ? 'صورة' : 'Photo',
      OTHER: language === 'ar' ? 'أخرى' : 'Autre'
    },
    documentStatuses: {
      ACTIVE: language === 'ar' ? 'نشط' : 'Actif',
      ARCHIVED: language === 'ar' ? 'مؤرشف' : 'Archivé',
      EXPIRED: language === 'ar' ? 'منتهي الصلاحية' : 'Expiré'
    },
    stats: {
      total: language === 'ar' ? 'إجمالي الوثائق' : 'Total documents',
      active: language === 'ar' ? 'الوثائق النشطة' : 'Documents actifs',
      expired: language === 'ar' ? 'وثائق منتهية الصلاحية' : 'Documents expirés',
      pending: language === 'ar' ? 'في انتظار المراجعة' : 'En attente de révision'
    }
  };

  const resetForm = () => {
    setFormData({
      type: DocumentType.IDENTITY_CARD,
      content: '',
      date: new Date().toISOString().split('T')[0],
      beneficiaryId: '',
      status: DocumentStatus.ACTIVE,
      fileName: '',
      fileSize: 0,
      fileUrl: '',
      notes: '',
      expiryDate: ''
    });
    setSelectedFile(null);
    setFilePreview(null);
    setUploadProgress(0);
    setEditingDocument(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: file.size
      }));

      // Créer un aperçu pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulation de l'upload
      if (selectedFile) {
        setUploadProgress(0);
        const simulateUpload = () => {
          const interval = setInterval(() => {
            setUploadProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                return 100;
              }
              return prev + 10;
            });
          }, 200);
        };
        simulateUpload();
      }

      if (editingDocument) {
        await updateDocument({ id: editingDocument.id, ...formData });
      } else {
        await createDocument(formData);
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (document: any) => {
    setFormData({
      type: document.type as DocumentType,
      content: document.content || '',
      date: document.date ? document.date.split('T')[0] : '',
      beneficiaryId: document.beneficiaryId || '',
      status: document.status as DocumentStatus,
      fileName: '',
      fileSize: 0,
      fileUrl: '',
      notes: '',
      expiryDate: ''
    });
    setEditingDocument(document);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteDocument({ id });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handlePreview = (document: any) => {
    setPreviewDocument(document);
    setShowPreview(true);
  };

  const getTypeColor = (type: DocumentType) => {
    switch (type) {
      case DocumentType.IDENTITY_CARD: return 'bg-blue-100 text-blue-800';
      case DocumentType.BIRTH_CERTIFICATE: return 'bg-purple-100 text-purple-800';
      case DocumentType.RESIDENCE_CERTIFICATE: return 'bg-green-100 text-green-800';
      case DocumentType.MEDICAL_CERTIFICATE: return 'bg-red-100 text-red-800';
      case DocumentType.SCHOOL_CERTIFICATE: return 'bg-orange-100 text-orange-800';
      case DocumentType.INCOME_CERTIFICATE: return 'bg-yellow-100 text-yellow-800';
      case DocumentType.FAMILY_COMPOSITION: return 'bg-pink-100 text-pink-800';
      case DocumentType.PHOTO: return 'bg-indigo-100 text-indigo-800';
      case DocumentType.OTHER: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case DocumentStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      case DocumentStatus.EXPIRED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.ACTIVE:
        return <CheckCircle2 className="w-4 h-4" />;
      case DocumentStatus.ARCHIVED:
        return <FolderOpen className="w-4 h-4" />;
      case DocumentStatus.EXPIRED:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.IDENTITY_CARD:
      case DocumentType.BIRTH_CERTIFICATE:
      case DocumentType.RESIDENCE_CERTIFICATE:
        return <FileCheck className="w-5 h-5" />;
      case DocumentType.MEDICAL_CERTIFICATE:
        return <File className="w-5 h-5" />;
      case DocumentType.PHOTO:
        return <Image className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents?.filter(doc => {
    const searchMatch = 
      doc.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const typeMatch = !filterType || doc.type === filterType;
    const statusMatch = !filterStatus || doc.status === filterStatus;
    const beneficiaryMatch = !filterBeneficiary || doc.beneficiaryId === filterBeneficiary;
    
    return searchMatch && typeMatch && statusMatch && beneficiaryMatch;
  }) || [];

  // Calculs pour les statistiques
  const totalDocuments = documents?.length || 0;
  const activeDocuments = documents?.filter(d => d.status === DocumentStatus.ACTIVE).length || 0;
  const expiredDocuments = documents?.filter(d => d.status === DocumentStatus.EXPIRED).length || 0;
  const archivedDocuments = documents?.filter(d => d.status === DocumentStatus.ARCHIVED).length || 0;

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
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.total}</p>
              <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.active}</p>
              <p className="text-2xl font-bold text-gray-900">{activeDocuments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-50">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">{t.stats.expired}</p>
              <p className="text-2xl font-bold text-gray-900">{expiredDocuments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50">
              <FolderOpen className="w-6 h-6 text-gray-600" />
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className="text-sm font-medium text-gray-600">Archivés</p>
              <p className="text-2xl font-bold text-gray-900">{archivedDocuments}</p>
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
              {t.type}
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as DocumentType | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">{t.all}</option>
              {Object.entries(t.documentTypes).map(([key, label]) => (
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
              onChange={(e) => setFilterStatus(e.target.value as DocumentStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">{t.all}</option>
              {Object.entries(t.documentStatuses).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.beneficiary}
            </label>
            <select
              value={filterBeneficiary}
              onChange={(e) => setFilterBeneficiary(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">{t.all}</option>
              {beneficiaries?.map(beneficiary => (
                <option key={beneficiary.id} value={beneficiary.id}>
                  {beneficiary.firstName} {beneficiary.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.type}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.content}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.beneficiary}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.date}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fichier
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getTypeIcon(document.type)}
                        </div>
                        <div className="ml-3">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(document.type)}`}>
                            {t.documentTypes[document.type as keyof typeof t.documentTypes]}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {document.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          Bénéficiaire #{document.beneficiaryId?.slice(-4)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(document.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                        {getStatusIcon(document.status)}
                        <span className="ml-1">
                          {t.documentStatuses[document.status as keyof typeof t.documentStatuses]}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handlePreview(document)}
                          className="text-blue-600 hover:text-blue-900"
                          title={t.view}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(document)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title={t.edit}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title={t.download}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(document.id)}
                          className="text-red-600 hover:text-red-900"
                          title={t.delete}
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
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
            <p className="mt-1 text-sm text-gray-500">{t.noData}</p>
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingDocument 
                  ? (language === 'ar' ? 'تحرير الوثيقة' : 'Modifier le document')
                  : (language === 'ar' ? 'إضافة وثيقة جديدة' : 'Ajouter un nouveau document')
                }
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Informations de base */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Informations du document
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.type} *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      {Object.entries(t.documentTypes).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.date} *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.expiryDate}
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as DocumentStatus })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      {Object.entries(t.documentStatuses).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload de fichier */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {t.uploadFile}
                </h3>
                
                <div className="space-y-4">
                  {/* Zone de drop */}
                  <div 
                    className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto h-12 w-12 text-blue-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">{t.dragDrop}</p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF jusqu'à 10MB
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                    className="hidden"
                  />

                  {/* Aperçu du fichier sélectionné */}
                  {selectedFile && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <File className="w-8 h-8 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setFilePreview(null);
                            setFormData(prev => ({ ...prev, fileName: '', fileSize: 0 }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {filePreview && (
                        <div className="mt-4">
                          <img 
                            src={filePreview} 
                            alt="Aperçu" 
                            className="max-w-xs max-h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-4">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Upload en cours... {uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Contenu et notes */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Contenu et notes
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.content} *
                    </label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={3}
                      placeholder="Description du document, numéro, détails importants..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.notes}
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                      placeholder="Notes additionnelles, remarques..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
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

      {/* Modal d'aperçu */}
      {showPreview && previewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Aperçu du document</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  {getTypeIcon(previewDocument.type)}
                  <span className={`ml-3 inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(previewDocument.type)}`}>
                    {t.documentTypes[previewDocument.type as keyof typeof t.documentTypes]}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Contenu:</h3>
                  <p className="text-gray-700 mt-1">{previewDocument.content}</p>
                </div>

                {previewDocument.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Notes:</h3>
                    <p className="text-gray-700 mt-1">{previewDocument.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Date:</span>
                    <p className="text-gray-700">{new Date(previewDocument.date).toLocaleDateString()}</p>
                  </div>
                  {previewDocument.expiryDate && (
                    <div>
                      <span className="font-medium text-gray-900">Expiration:</span>
                      <p className="text-gray-700">{new Date(previewDocument.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {previewDocument.fileName && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Paperclip className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{previewDocument.fileName}</span>
                    </div>
                    {previewDocument.fileSize && (
                      <p className="text-xs text-gray-500 mt-1">
                        Taille: {formatFileSize(previewDocument.fileSize)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;