import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebounce } from '../hooks/useDebounce';
import { useInternships } from '../hooks/useInternships';
import { useSavedInternships } from '../hooks/useSavedInternships';
import { ITEMS_PER_PAGE, SORT_OPTIONS } from '../utils/constants';
import { applyFilters, extractUniqueLocations, sortInternships } from '../utils/filters';

import EmptyState from '../components/EmptyState/EmptyState';
import FilterChips from '../components/Filters/FilterChips';
import FilterSidebar from '../components/Filters/FilterSidebar';
import MobileFilterDrawer from '../components/Filters/MobileFilterDrawer';
import InternshipCard from '../components/InternshipCard/InternshipCard';
import PromoCard from '../components/InternshipCard/PromoCard';
import Pagination from '../components/Pagination/Pagination';
import { SkeletonGrid } from '../components/Loader/SkeletonCard';
import Navbar from '../components/Navbar/Navbar';

function parseParams(searchParams) {
  return {
    profile: searchParams.get('profile') || '',
    locations: searchParams.get('locations')
      ? searchParams.get('locations').split(',').filter(Boolean)
      : [],
    workFromHome: searchParams.get('wfh') === 'true',
    partTime: searchParams.get('pt') === 'true',
    duration: parseInt(searchParams.get('duration') || '0', 10),
    stipend: parseInt(searchParams.get('stipend') || '0', 10),
    keyword: searchParams.get('kw') || '',
    sort: searchParams.get('sort') || 'relevance',
    jobOffer: searchParams.get('offer') === 'true',
    fastResponse: searchParams.get('fast') === 'true',
    earlyApplicant: searchParams.get('early') === 'true',
    women: searchParams.get('women') === 'true',
    startDate: searchParams.get('start') || '',
  };
}

function filtersToParams(filters) {
  const params = {};
  if (filters.profile) params.profile = filters.profile;
  if (filters.locations.length > 0) params.locations = filters.locations.join(',');
  if (filters.workFromHome) params.wfh = 'true';
  if (filters.partTime) params.pt = 'true';
  if (filters.duration > 0) params.duration = String(filters.duration);
  if (filters.stipend > 0) params.stipend = String(filters.stipend);
  if (filters.keyword) params.kw = filters.keyword;
  if (filters.sort && filters.sort !== 'relevance') params.sort = filters.sort;
  if (filters.jobOffer) params.offer = 'true';
  if (filters.fastResponse) params.fast = 'true';
  if (filters.earlyApplicant) params.early = 'true';
  if (filters.women) params.women = 'true';
  if (filters.startDate) params.start = filters.startDate;
  return params;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: internships, loading, error } = useInternships();
  const { savedCount, toggleSave, isSaved } = useSavedInternships();

  const initialFilters = useMemo(() => parseParams(searchParams), []);
  const [profileInput, setProfileInput] = useState(initialFilters.profile);
  const [keywordInput, setKeywordInput] = useState(initialFilters.keyword);
  const [filters, setFilters] = useState({
    profile: initialFilters.profile,
    locations: initialFilters.locations,
    workFromHome: initialFilters.workFromHome,
    partTime: initialFilters.partTime,
    duration: initialFilters.duration,
    stipend: initialFilters.stipend,
    keyword: initialFilters.keyword,
    jobOffer: initialFilters.jobOffer,
    fastResponse: initialFilters.fastResponse,
    earlyApplicant: initialFilters.earlyApplicant,
    women: initialFilters.women,
    startDate: initialFilters.startDate,
  });
  const [sortBy, setSortBy] = useState(initialFilters.sort);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const debouncedProfile = useDebounce(profileInput, 300);
  const debouncedKeyword = useDebounce(keywordInput, 300);

  useEffect(() => {
    setFilters((f) => ({ ...f, profile: debouncedProfile, keyword: debouncedKeyword }));
  }, [debouncedProfile, debouncedKeyword]);

  useEffect(() => {
    setSearchParams(filtersToParams({ ...filters, sort: sortBy }), { replace: true });
  }, [filters, sortBy, setSearchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const allLocations = useMemo(
    () => extractUniqueLocations(internships),
    [internships]
  );

  const filteredInternships = useMemo(
    () => applyFilters(internships, filters),
    [internships, filters]
  );

  const sortedInternships = useMemo(
    () => sortInternships(filteredInternships, sortBy),
    [filteredInternships, sortBy]
  );

  const totalPages = Math.ceil(sortedInternships.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const visibleInternships = useMemo(
    () => sortedInternships.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [sortedInternships, currentPage]
  );

  const handleFilterChange = useCallback((key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({ profile: '', locations: [], workFromHome: false, partTime: false, duration: 0, stipend: 0, keyword: '' });
    setProfileInput('');
    setKeywordInput('');
    setSortBy('relevance');
  }, []);

  const handleRemoveChip = useCallback((type, value) => {
    setFilters((f) => {
      switch (type) {
        case 'profile':
          setProfileInput('');
          return { ...f, profile: '' };
        case 'location':
          return { ...f, locations: f.locations.filter((l) => l !== value) };
        case 'workFromHome':
          return { ...f, workFromHome: false };
        case 'partTime':
          return { ...f, partTime: false };
        case 'duration':
          return { ...f, duration: 0 };
        case 'stipend':
          return { ...f, stipend: 0 };
        case 'keyword':
          setKeywordInput('');
          return { ...f, keyword: '' };
        default:
          return f;
      }
    });
  }, []);

  const hasActiveFilters =
    filters.profile ||
    filters.locations.length > 0 ||
    filters.workFromHome ||
    filters.partTime ||
    filters.duration > 0 ||
    filters.stipend > 0 ||
    filters.keyword ||
    filters.jobOffer ||
    filters.fastResponse ||
    filters.earlyApplicant ||
    filters.women ||
    filters.startDate;

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] dark:bg-slate-950">
      <Navbar savedCount={savedCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-6 text-center mt-4">
          <h1 className="text-[22px] font-bold text-[#333333] dark:text-white">
            {sortedInternships.length} internships
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              allLocations={allLocations}
              profileInput={profileInput}
              onProfileInputChange={setProfileInput}
              keywordInput={keywordInput}
              onKeywordInputChange={setKeywordInput}
            />
          </div>

          <div className="flex-1 min-w-0">
            <FilterChips
              filters={filters}
              onRemove={handleRemoveChip}
              onClearAll={handleClearAll}
            />

            <div className="flex items-center justify-end mb-4">
              <div className="relative">
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-xl text-sm bg-[var(--color-surface)] dark:bg-slate-900 border border-[var(--color-border)] dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && <SkeletonGrid count={6} />}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400 font-medium mb-2">
                  Failed to load internships
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] dark:text-slate-400">
                  {error}
                </p>
              </div>
            )}

            {!loading && !error && sortedInternships.length === 0 && (
              <EmptyState
                onClearFilters={handleClearAll}
                hasFilters={hasActiveFilters}
              />
            )}

                {!loading && !error && sortedInternships.length > 0 && (
              <>
                <div className="flex flex-col gap-4">
                  <PromoCard />
                  {visibleInternships.map((internship) => (
                    <InternshipCard
                      key={internship.id}
                      internship={internship}
                      isSaved={isSaved(internship.id)}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </div>

                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                />
              </>
            )}
          </div>
        </div>
      </main>

      <button
        onClick={() => setMobileFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={20} />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
            {filters.locations.length + 
             (filters.profile ? 1 : 0) + 
             (filters.workFromHome ? 1 : 0) + 
             (filters.partTime ? 1 : 0) + 
             (filters.duration > 0 ? 1 : 0) + 
             (filters.stipend > 0 ? 1 : 0) + 
             (filters.keyword ? 1 : 0) + 
             (filters.jobOffer ? 1 : 0) + 
             (filters.fastResponse ? 1 : 0) + 
             (filters.earlyApplicant ? 1 : 0) + 
             (filters.women ? 1 : 0) + 
             (filters.startDate ? 1 : 0)}
          </span>
        )}
      </button>

      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        allLocations={allLocations}
        profileInput={profileInput}
        onProfileInputChange={setProfileInput}
      />
    </div>
  );
}
