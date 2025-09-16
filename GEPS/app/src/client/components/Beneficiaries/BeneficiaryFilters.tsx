import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../cn';
import { Search, Filter, X, Users, Calendar, MapPin } from 'lucide-react';

interface FilterState {
  searchTerm: string;
  beneficiaryType: string;
  gender: string;
  ageRange: string;
  city: string;
  status: string;
}

interface BeneficiaryFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
  language: 'fr' | 'ar';
  className?: string;
}

export default function BeneficiaryFilters({
  filters,
  onFiltersChange,
  resultCount,
  language,
  className
}: BeneficiaryFiltersProps) {
  const isRTL = language === 'ar';

  const t = {
    search: language === 'ar' ? 'البحث...' : 'Rechercher...',
    filter: language === 'ar' ? 'تصفية' : 'Filtrer',
    clearFilters: language === 'ar' ? 'مسح المرشحات' : 'Effacer les filtres',
    all: language === 'ar' ? 'الكل' : 'Tous',
    beneficiaryType: language === 'ar' ? 'نوع المستفيد' : 'Type de bénéficiaire',
    women: language === 'ar' ? 'النساء' : 'Femmes',
    children: language === 'ar' ? 'الأطفال' : 'Enfants',
    male: language === 'ar' ? 'ذكر' : 'Homme',
    female: language === 'ar' ? 'أنثى' : 'Femme',
    gender: language === 'ar' ? 'الجنس' : 'Genre',
    ageRange: language === 'ar' ? 'الفئة العمرية' : 'Tranche d\'âge',
    city: language === 'ar' ? 'المدينة' : 'Ville',
    status: language === 'ar' ? 'الحالة' : 'Statut',
    active: language === 'ar' ? 'نشط' : 'Actif',
    inactive: language === 'ar' ? 'غير نشط' : 'Inactif',
    results: language === 'ar' ? 'نتيجة' : 'résultats',
    showing: language === 'ar' ? 'عرض' : 'Affichage de',
    childrenAge: language === 'ar' ? 'أطفال (0-17)' : 'Enfants (0-17)',
    adults: language === 'ar' ? 'بالغون (18-64)' : 'Adultes (18-64)',
    seniors: language === 'ar' ? 'كبار السن (65+)' : 'Seniors (65+)',
    casablanca: language === 'ar' ? 'الدار البيضاء' : 'Casablanca',
    rabat: language === 'ar' ? 'الرباط' : 'Rabat',
    marrakech: language === 'ar' ? 'مراكش' : 'Marrakech',
    fes: language === 'ar' ? 'فاس' : 'Fès'
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      beneficiaryType: '',
      gender: '',
      ageRange: '',
      city: '',
      status: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length - (filters.searchTerm ? 1 : 0);

  return (
    <Card className={cn('border-2 border-blue-100', className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className={cn(
              'absolute top-3 w-4 h-4 text-gray-400',
              isRTL ? 'right-3' : 'left-3'
            )} />
            <Input
              type="text"
              placeholder={t.search}
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className={cn(
                'h-10 text-sm',
                isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
              )}
            />
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Type de bénéficiaire - FILTRE PRINCIPAL */}
            <div>
              <label className="block text-sm font-bold text-blue-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                {t.beneficiaryType}
              </label>
              <Select value={filters.beneficiaryType || "all"} onValueChange={(value) => handleFilterChange('beneficiaryType', value === "all" ? "" : value)}>
                <SelectTrigger className="h-9 border-2 border-blue-200 bg-blue-50">
                  <SelectValue placeholder={t.all} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="FEMME">{t.women}</SelectItem>
                  <SelectItem value="ENFANT">{t.children}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                {t.gender}
              </label>
              <Select value={filters.gender || "all"} onValueChange={(value) => handleFilterChange('gender', value === "all" ? "" : value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t.all} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="Male">{t.male}</SelectItem>
                  <SelectItem value="Female">{t.female}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tranche d'âge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                {t.ageRange}
              </label>
              <Select value={filters.ageRange || "all"} onValueChange={(value) => handleFilterChange('ageRange', value === "all" ? "" : value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t.all} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="0-17">{t.childrenAge}</SelectItem>
                  <SelectItem value="18-64">{t.adults}</SelectItem>
                  <SelectItem value="65+">{t.seniors}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                {t.city}
              </label>
              <Select value={filters.city || "all"} onValueChange={(value) => handleFilterChange('city', value === "all" ? "" : value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t.all} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="casablanca">{t.casablanca}</SelectItem>
                  <SelectItem value="rabat">{t.rabat}</SelectItem>
                  <SelectItem value="marrakech">{t.marrakech}</SelectItem>
                  <SelectItem value="fes">{t.fes}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                {t.status}
              </label>
              <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value === "all" ? "" : value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t.all} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="active">{t.active}</SelectItem>
                  <SelectItem value="inactive">{t.inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Résultats et actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <Badge variant="info" className="text-sm">
                {resultCount} {t.results}
              </Badge>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {activeFiltersCount} {language === 'ar' ? 'مرشح نشط' : 'filtres actifs'}
                </Badge>
              )}
            </div>

            {(activeFiltersCount > 0 || filters.searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <X className="w-4 h-4 mr-1" />
                {t.clearFilters}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
