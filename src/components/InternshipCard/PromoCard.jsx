import { Zap, Clock, ChevronRight } from 'lucide-react';

export default function PromoCard() {
  return (
    <article className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-[var(--color-border)] dark:border-slate-700/50 card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden mb-4">
      <div className="absolute top-4 right-4 bg-orange-500 text-xs font-bold text-white px-2.5 py-1 rounded">
        OFFER
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
          Get Internship and Job Preparation training FREE!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          By enrolling in trainings at 55% + 10% OFF!
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 mb-6">
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-slate-400" />
            <span>Use coupon: <strong className="text-slate-800 dark:text-white">GD10</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            <span>Offer ends in 01d: 12h: 28m: 30s</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] dark:border-slate-700/50">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              Choose from Web Dev., Python, Data Science, Marketing & more
            </p>
            <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs text-slate-600 dark:text-slate-300">
              Government Certified Trainings
            </span>
          </div>

          <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Enroll now <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
