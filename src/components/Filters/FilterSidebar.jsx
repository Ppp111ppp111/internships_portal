import { memo, useMemo, useState, useRef, useEffect } from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import FilterSection from './FilterSection';
import CustomDatePicker from './CustomDatePicker';
import { STIPEND_OPTIONS, DURATION_OPTIONS } from '../../utils/constants';

function FilterSidebar({
  filters,
  onFilterChange,
  onClearAll,
  allLocations,
  profileInput,
  onProfileInputChange,
  keywordInput,
  onKeywordInputChange,
}) {
  const [locationSearch, setLocationSearch] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const locationRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = useMemo(() => {
    if (!locationSearch) return allLocations.slice(0, 15);
    const q = locationSearch.toLowerCase();
    return allLocations.filter((l) => l.toLowerCase().includes(q));
  }, [allLocations, locationSearch]);

  const hasActiveFilters =
    filters.profile ||
    filters.locations.length > 0 ||
    filters.workFromHome ||
    filters.partTime ||
    filters.duration > 0 ||
    filters.stipend > 0 ||
    filters.keyword;

  function handleLocationToggle(loc) {
    const current = filters.locations;
    const next = current.includes(loc)
      ? current.filter((l) => l !== loc)
      : [...current, loc];
    onFilterChange('locations', next);
  }

  return (
    <aside className="w-full lg:w-[300px] lg:flex-shrink-0">
      <div className="lg:sticky lg:top-24 bg-white dark:bg-slate-900 rounded border border-[var(--color-border)] dark:border-slate-700/50 p-6 filter-scrollbar lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#333333] dark:text-white" />
            <h2 className="text-[17px] font-semibold text-[#333333] dark:text-white tracking-wide">
              Filters
            </h2>
          </div>
        </div>

        <FilterSection title="Profile">
          <input
            type="text"
            value={profileInput}
            onChange={(e) => onProfileInputChange(e.target.value)}
            placeholder="e.g. Marketing"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[var(--color-border)] dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-500)] focus:border-[var(--color-blue-500)] transition-all placeholder:text-[#999999]"
          />
        </FilterSection>

        <FilterSection title="Location">
          <div className="relative" ref={locationRef}>
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => {
                setLocationSearch(e.target.value);
                setIsLocationDropdownOpen(true);
              }}
              onFocus={() => setIsLocationDropdownOpen(true)}
              placeholder="e.g. Delhi"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[var(--color-border)] dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-500)] focus:border-[var(--color-blue-500)] transition-all placeholder:text-[#999999]"
            />
            {isLocationDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto filter-scrollbar">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      handleLocationToggle(loc);
                      setLocationSearch('');
                      setIsLocationDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-[#444444] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {loc}
                  </button>
                ))}
                {filteredLocations.length === 0 && (
                  <div className="px-3 py-2 text-sm text-[#999999]">No locations found</div>
                )}
              </div>
            )}
            {filters.locations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {filters.locations.map(loc => (
                  <span key={loc} className="inline-flex items-center gap-1 bg-[var(--color-blue-500)] text-white px-2 py-1 rounded text-xs font-medium">
                    {loc}
                    <button onClick={() => handleLocationToggle(loc)} className="hover:text-blue-100">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.workFromHome}
                onChange={(e) => onFilterChange('workFromHome', e.target.checked)}
                className="w-4 h-4 rounded-sm border-[#cccccc] text-[var(--color-blue-500)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[14px] text-[#444444] dark:text-slate-300">
                Work from home
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.partTime}
                onChange={(e) => onFilterChange('partTime', e.target.checked)}
                className="w-4 h-4 rounded-sm border-[#cccccc] text-[var(--color-blue-500)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[14px] text-[#444444] dark:text-slate-300">
                Part-time
              </span>
            </label>
          </div>
        </FilterSection>

        <FilterSection title="Desired minimum monthly stipend (₹)">
          <div className="px-1 pt-2 pb-6">
            <input
              type="range"
              min="0"
              max="10000"
              step="2000"
              value={filters.stipend}
              onChange={(e) => onFilterChange('stipend', parseInt(e.target.value, 10))}
              className="w-full h-1 bg-[#eeeeee] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-blue-500)]"
            />
            <div className="flex justify-between text-[11px] text-[#999999] mt-2 font-medium">
              <span>0</span>
              <span>2K</span>
              <span>4K</span>
              <span>6K</span>
              <span>8K</span>
              <span>10K</span>
            </div>
          </div>
        </FilterSection>

        {isAdvancedOpen && (
          <div className="space-y-6 mt-4">
            <FilterSection title="Starting from (or after)">
              <CustomDatePicker 
                value={filters.startDate}
                onChange={(val) => onFilterChange('startDate', val)}
              />
            </FilterSection>

            <FilterSection title="Max. duration (months)">
              <select
                value={filters.duration}
                onChange={(e) => onFilterChange('duration', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[var(--color-border)] dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-500)] focus:border-[var(--color-blue-500)] transition-all text-[#444444] dark:text-white"
              >
                <option value="0">Choose duration</option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
              </select>
            </FilterSection>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.jobOffer}
                  onChange={(e) => onFilterChange('jobOffer', e.target.checked)}
                  className="w-4 h-4 rounded-sm border-[#cccccc] text-[var(--color-blue-500)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[14px] text-[#444444] dark:text-slate-300">
                  Internships with job offer
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.fastResponse}
                  onChange={(e) => onFilterChange('fastResponse', e.target.checked)}
                  className="w-4 h-4 rounded-sm border-[#cccccc] text-[var(--color-blue-500)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[14px] text-[#444444] dark:text-slate-300">
                  Fast response
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.earlyApplicant}
                  onChange={(e) => onFilterChange('earlyApplicant', e.target.checked)}
                  className="w-4 h-4 rounded-sm border-[#cccccc] text-[var(--color-blue-500)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[14px] text-[#444444] dark:text-slate-300">
                  Early applicant
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.women}
                  onChange={(e) => onFilterChange('women', e.target.checked)}
                  className="w-4 h-4 rounded-sm border-[#cccccc] text-[var(--color-blue-500)] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-[14px] text-[#444444] dark:text-slate-300">
                  Internships for women
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="pt-2 mt-4 flex items-center justify-between">
          <button 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="text-[14px] text-[var(--color-blue-500)] hover:text-[var(--color-blue-600)] font-medium transition-colors"
          >
            {isAdvancedOpen ? 'View less filters \u25B2' : 'View more filters \u25BC'}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-[14px] text-[var(--color-blue-500)] hover:text-[var(--color-blue-600)] font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-4 lg:sticky lg:top-[calc(100vh-100px)] bg-white dark:bg-slate-900 rounded border border-[var(--color-border)] dark:border-slate-700/50 p-6">
        <h3 className="text-[14px] font-semibold text-[#444444] dark:text-white mb-3">
          Keyword Search
        </h3>
        <div className="flex">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => onKeywordInputChange(e.target.value)}
            placeholder="e.g. Design, Mumbai"
            className="flex-1 w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-r-0 border-[var(--color-border)] dark:border-slate-700 rounded-l focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-500)] focus:border-[var(--color-blue-500)] transition-all placeholder:text-[#999999]"
          />
          <button className="px-4 bg-[var(--color-blue-500)] hover:bg-[var(--color-blue-600)] text-white rounded-r transition-colors flex items-center justify-center">
            <Search size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default memo(FilterSidebar);
