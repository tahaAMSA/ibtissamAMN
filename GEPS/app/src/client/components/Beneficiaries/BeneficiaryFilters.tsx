import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../cn';
import { Search, Filter, X, Users, Calendar, MapPin, Heart, Shield } from 'lucide-react';
import { useAuth } from 'wasp/client/auth';
import { useI18n } from '../../../translations/useI18n';

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
  className?: string;
}

export default function BeneficiaryFilters({
  filters,
  onFiltersChange,
  resultCount,
  className
}: BeneficiaryFiltersProps) {
  const { data: user } = useAuth();
  const { t, lang: language, isRTL, dir } = useI18n(user as any);


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
    <Card className={cn('border-2 border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg', className)}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header avec titre */}
          <div className="flex items-center gap-3 pb-4 border-b border-blue-200">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900">
              {t('filters.beneficiariesTitle')}
            </h3>
            <Badge variant="info" className="ml-auto">
              {resultCount} {t('filters.results')}
            </Badge>
          </div>

          {/* Barre de recherche améliorée */}
          <div className="relative">
            <Search className={cn(
              'absolute top-3 w-5 h-5 text-blue-600',
              isRTL ? 'right-3' : 'left-3'
            )} />
            <Input
              type="text"
              placeholder={t('filters.search')}
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className={cn(
                'h-12 text-sm border-2 border-blue-200 focus:border-blue-400 bg-white/80',
                isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'
              )}
            />
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Type de bénéficiaire - FILTRE PRINCIPAL */}
            <div>
              <label className="block text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded">
                  <Users className="w-4 h-4" />
                </div>
                {t('filters.beneficiaryType')}
              </label>
              <Select value={filters.beneficiaryType || "all"} onValueChange={(value) => handleFilterChange('beneficiaryType', value === "all" ? "" : value)}>
                <SelectTrigger className="h-11 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white hover:border-blue-300 transition-colors">
                  <SelectValue placeholder={t('filters.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-medium">{t('filters.all')}</SelectItem>
                  <SelectItem value="FEMME" className="font-medium text-pink-700">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      {t('filters.women')}
                    </div>
                  </SelectItem>
                  <SelectItem value="ENFANT" className="font-medium text-orange-700">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-orange-500" />
                      {t('filters.children')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <div className="p-1 bg-gray-100 rounded">
                  <Users className="w-4 h-4" />
                </div>
                {t('filters.gender')}
              </label>
              <Select value={filters.gender || "all"} onValueChange={(value) => handleFilterChange('gender', value === "all" ? "" : value)}>
                <SelectTrigger className="h-11 border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors">
                  <SelectValue placeholder={t('filters.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="Male">{t('beneficiary.male')}</SelectItem>
                  <SelectItem value="Female">{t('beneficiary.female')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tranche d'âge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <div className="p-1 bg-gray-100 rounded">
                  <Calendar className="w-4 h-4" />
                </div>
                {t('filters.ageRange')}
              </label>
              <Select value={filters.ageRange || "all"} onValueChange={(value) => handleFilterChange('ageRange', value === "all" ? "" : value)}>
                <SelectTrigger className="h-11 border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors">
                  <SelectValue placeholder={t('filters.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="0-17" className="text-orange-700">{t('filters.childrenAge')}</SelectItem>
                  <SelectItem value="18-64" className="text-pink-700">{t('filters.adults')}</SelectItem>
                  <SelectItem value="65+" className="text-purple-700">{t('filters.seniors')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                {t('filters.city')}
              </label>
              <Select value={filters.city || "all"} onValueChange={(value) => handleFilterChange('city', value === "all" ? "" : value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('filters.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="casablanca">{t('filters.casablanca')}</SelectItem>
                  <SelectItem value="rabat">{t('filters.rabat')}</SelectItem>
                  <SelectItem value="marrakech">{t('filters.marrakech')}</SelectItem>
                  <SelectItem value="fes">{t('filters.fes')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                {t('filters.status')}
              </label>
              <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value === "all" ? "" : value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={t('filters.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="active">{t('beneficiary.active')}</SelectItem>
                  <SelectItem value="inactive">{t('beneficiary.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Résultats et actions améliorées */}
          <div className="flex items-center justify-between pt-6 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Badge 
                variant="info" 
                className="text-sm bg-blue-100 text-blue-800 px-3 py-1"
              >
                {resultCount} {t('filters.results')}
              </Badge>
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="text-sm bg-amber-100 text-amber-800 px-3 py-1"
                >
                  {activeFiltersCount} {t('filters.filtersActive')}
                </Badge>
              )}
            </div>

            {(activeFiltersCount > 0 || filters.searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <X className="w-4 h-4 mr-1" />
                {t('filters.clearFilters')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
