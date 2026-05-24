import { memo } from 'react';
import { Search, ChevronDown, Bookmark } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function Navbar({ savedCount = 0 }) {
  const { dark } = useTheme(); // Keeping theme for compatibility but Internshala is primarily light mode

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-[var(--color-border)] dark:border-slate-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center">
              <span className="text-[24px] font-bold text-[var(--color-blue-600)] dark:text-blue-400 tracking-tight">
                Crack<span className="text-[#333333] dark:text-white">Inta</span>
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-[#444444] dark:text-slate-200">
              <a href="#" className="hover:text-[var(--color-blue-500)] transition-colors">Internships</a>
              <a href="#" className="hover:text-[var(--color-blue-500)] transition-colors">Jobs</a>
              <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--color-blue-500)] transition-colors group">
                Courses
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">OFFER</span>
                <ChevronDown size={16} className="text-[#8a8a8a] group-hover:text-[var(--color-blue-500)] transition-colors" />
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-[#444444] dark:text-slate-200 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block">
              <Search size={20} />
            </button>
            
            {savedCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[var(--color-blue-500)] text-sm font-medium">
                <Bookmark size={14} />
                <span className="hidden sm:inline">{savedCount}</span>
              </div>
            )}

            <button className="hidden sm:block px-5 py-2 text-[15px] font-medium text-[var(--color-blue-500)] border border-[var(--color-blue-500)] rounded hover:bg-[var(--color-blue-50)] dark:hover:bg-blue-900/20 transition-colors">
              Login
            </button>
            
            <div className="flex items-center relative group">
              <button className="px-5 py-2 text-[15px] font-medium text-white bg-[var(--color-blue-500)] rounded hover:bg-[var(--color-blue-600)] transition-colors flex items-center gap-1">
                Candidate Sign-up
                <ChevronDown size={16} />
              </button>
            </div>
            
            <button className="hidden lg:block text-[15px] font-medium text-[#444444] dark:text-slate-200 ml-2 hover:text-[var(--color-blue-500)]">
              Employer? Log in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);
