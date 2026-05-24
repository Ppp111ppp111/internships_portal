import { memo, useCallback } from 'react';
import { MapPin, Clock, Calendar, IndianRupee, Bookmark, BookmarkCheck, ExternalLink, Briefcase, Home, Building, Zap } from 'lucide-react';

function CompanyAvatar({ name, logo }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className="w-12 h-12 rounded object-contain bg-white dark:bg-slate-800"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return null;
}

function InitialsAvatar({ name }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/40 dark:to-violet-900/40 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30">
      {initials}
    </div>
  );
}

function InternshipCard({ internship, isSaved, onToggleSave }) {
  const {
    id,
    title,
    companyName,
    companyLogo,
    locationNames,
    workFromHome,
    stipendRaw,
    duration,
    postedLabel,
    isPPO,
  } = internship;

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleSave(id);
    },
    [id, onToggleSave]
  );

  return (
    <article
      className="group bg-white dark:bg-slate-900 rounded-xl border border-[var(--color-border)] dark:border-slate-700/50 mb-4 transition-all hover:shadow-md overflow-hidden relative"
    >
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-center gap-1 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-[var(--color-blue-300)] text-[11px] font-medium text-[var(--color-blue-500)] bg-white dark:bg-slate-900">
            Actively hiring
          </span>
          {isPPO && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-orange-200 text-[11px] font-medium text-orange-600 bg-white dark:bg-slate-900">
              PPO
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] font-semibold text-[#333333] dark:text-white leading-tight mb-1 truncate">
              {title}
            </h3>
            <p className="text-[14px] font-medium text-[#8a8a8a] dark:text-slate-400 truncate">
              {companyName}
            </p>
          </div>
          <div className="flex-shrink-0 relative">
            <div className="w-12 h-12 rounded flex items-center justify-center text-blue-200 dark:text-blue-800 bg-white border border-[#eeeeee]">
               {companyLogo ? <CompanyAvatar name={companyName} logo={companyLogo} /> : <Building size={24} className="text-slate-300" />}
            </div>
            <button
              onClick={handleSave}
              className="absolute -top-1 -right-8 p-1 rounded-full hover:bg-slate-100 transition-colors hidden sm:block"
              aria-label={isSaved ? 'Unsave internship' : 'Save internship'}
            >
              {isSaved ? (
                <BookmarkCheck size={18} className="text-[var(--color-blue-500)]" />
              ) : (
                <Bookmark size={18} className="text-[#8a8a8a] hover:text-[#333333]" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[14px] text-[#444444] dark:text-slate-400 mb-4">
          {workFromHome ? <Home size={16} className="text-[#8a8a8a]" /> : <MapPin size={16} className="text-[#8a8a8a]" />}
          <span className="truncate">
            {locationNames.length > 0 ? locationNames.join(', ') : 'Not specified'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[14px] text-[#444444] dark:text-slate-400 mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#8a8a8a] text-[12px] uppercase tracking-wide">
              <Calendar size={14} /> Start Date
            </div>
            <span>Starts Immediately</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#8a8a8a] text-[12px] uppercase tracking-wide">
              <Clock size={14} /> Duration
            </div>
            <span>{duration}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#8a8a8a] text-[12px] uppercase tracking-wide">
              <IndianRupee size={14} /> Stipend
            </div>
            <span>{stipendRaw}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 mt-4 border-t border-[#eeeeee] dark:border-slate-700/50">
          <span className="text-[12px] font-medium px-2 py-1 rounded bg-[#e0f0fd] text-[var(--color-blue-500)] dark:bg-blue-900/30 flex items-center gap-1">
            <Clock size={12} />
            {postedLabel || '3 days ago'}
          </span>
          
          <span className="text-[12px] text-[#444444] dark:text-slate-300 flex items-center gap-1">
            <Zap size={12} fill="#eab308" className="text-yellow-500" />
            Be an early applicant
          </span>

          {isPPO && (
            <span className="text-[12px] font-medium px-2 py-1 rounded bg-[#fff8e1] text-[#b45309] dark:bg-yellow-900/20 dark:text-yellow-500 flex items-center gap-1">
              <Briefcase size={12} />
              Job offer
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(InternshipCard);
