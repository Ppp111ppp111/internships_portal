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
import { SkeletonGrid } from '../components/Loader/SkeletonCard';
import Navbar from '../components/Navbar/Navbar';

function parseParams(searchParams) {
  return {
    profile: searchParams.get('profile') || '',
    locations: searchParams.get('locations')
      ? searchParams.get('locations').split(',').filter(Boolean)
      : [],
    duration: parseInt(searchParams.get('duration') || '0', 10),
    stipend: parseInt(searchParams.get('stipend') || '0', 10),
    sort: searchParams.get('sort') || 'relevance',
  };
}

function filtersToParams(filters) {
  const params = {};
  if (filters.profile) params.profile = filters.profile;
  if (filters.locations.length > 0) params.locations = filters.locations.join(',');
  if (filters.duration > 0) params.duration = String(filters.duration);
  if (filters.stipend > 0) params.stipend = String(filters.stipend);
  if (filters.sort && filters.sort !== 'relevance') params.sort = filters.sort;
  return params;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: internships, loading, error } = useInternships();
  const { savedCount, toggleSave, isSaved } = useSavedInternships();

  const initialFilters = useMemo(() => parseParams(searchParams), []);
  const [profileInput, setProfileInput] = useState(initialFilters.profile);
  const [filters, setFilters] = useState({
    profile: initialFilters.profile,
    locations: initialFilters.locations,
    duration: initialFilters.duration,
    stipend: initialFilters.stipend,
  });
  const [sortBy, setSortBy] = useState(initialFilters.sort);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const debouncedProfile = useDebounce(profileInput, 300);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setFilters((f) => ({ ...f, profile: debouncedProfile }));
  }, [debouncedProfile]);

  useEffect(() => {
    setSearchParams(filtersToParams({ ...filters, sort: sortBy }), { replace: true });
  }, [filters, sortBy, setSearchParams]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
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

  const visibleInternships = useMemo(
    () => sortedInternships.slice(0, visibleCount),
    [sortedInternships, visibleCount]
  );

  const hasMore = visibleCount < sortedInternships.length;

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => c + ITEMS_PER_PAGE);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, sortedInternships.length]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({ profile: '', locations: [], duration: 0, stipend: 0 });
    setProfileInput('');
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
        case 'duration':
          return { ...f, duration: 0 };
        case 'stipend':
          return { ...f, stipend: 0 };
        default:
          return f;
      }
    });
  }, []);

  const hasActiveFilters =
    filters.profile ||
    filters.locations.length > 0 ||
    filters.duration > 0 ||
    filters.stipend > 0;

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)] dark:bg-slate-950">
      <Navbar savedCount={savedCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] dark:text-white">
            Internships
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] dark:text-slate-400 mt-1">
            Find the perfect internship to kickstart your career
          </p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleInternships.map((internship) => (
                    <InternshipCard
                      key={internship.id}
                      internship={internship}
                      isSaved={isSaved(internship.id)}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div ref={sentinelRef} className="flex justify-center py-8">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                      <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                      Loading more...
                    </div>
                  </div>
                )}

                {!hasMore && sortedInternships.length > ITEMS_PER_PAGE && (
                  <p className="text-center text-sm text-[var(--color-text-muted)] dark:text-slate-500 py-6">
                    You&apos;ve reached the end
                  </p>
                )}
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
            {filters.locations.length + (filters.profile ? 1 : 0) + (filters.duration ? 1 : 0) + (filters.stipend ? 1 : 0)}
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
