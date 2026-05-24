import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function CustomDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value or use current date
  const initialDate = value ? new Date(value) : new Date();
  
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Calendar logic
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    
    const days = [];
    
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [currentMonth, currentYear]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day) => {
    if (!day) return;
    
    const selectedDate = new Date(currentYear, currentMonth, day);
    // Formatting as YYYY-MM-DD
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`; // Or keep it as standard depending on what is needed
  };

  // Determine today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        readOnly
        value={value ? formatDisplayDate(value) : ''}
        onClick={() => setIsOpen(true)}
        placeholder="Choose date"
        className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-[var(--color-border)] dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-blue-500)] focus:border-[var(--color-blue-500)] transition-all text-[#444444] dark:text-white cursor-pointer"
      />

      {isOpen && (
        <div className="relative mt-2 w-full bg-white dark:bg-slate-900 border border-[#eeeeee] dark:border-slate-700 rounded shadow-md z-50 p-3">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handlePrevMonth}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[var(--color-blue-500)]"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="font-semibold text-[15px] text-[#333333] dark:text-white">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button 
              onClick={handleNextMonth}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[var(--color-blue-500)]"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="text-center text-[13px] font-medium text-[#8a8a8a] dark:text-slate-400 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="h-8"></div>;
              }

              const cellDate = new Date(currentYear, currentMonth, day);
              cellDate.setHours(0, 0, 0, 0);
              
              const isPast = cellDate < today;
              const isSelected = value && cellDate.getTime() === new Date(value).setHours(0,0,0,0);
              const isToday = cellDate.getTime() === today.getTime();

              let cellClasses = "h-8 flex items-center justify-center text-[13px] rounded cursor-pointer transition-colors ";
              
              if (isSelected) {
                cellClasses += "bg-[var(--color-blue-500)] text-white font-medium ";
              } else if (isToday) {
                cellClasses += "bg-[#e0f0fd] text-[var(--color-blue-600)] font-medium ";
              } else if (isPast) {
                cellClasses += "text-[#cccccc] dark:text-slate-600 cursor-not-allowed ";
              } else {
                cellClasses += "text-[#333333] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 ";
              }

              return (
                <button
                  key={day}
                  disabled={isPast}
                  onClick={() => handleDateSelect(day)}
                  className={cellClasses}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomDatePicker;
