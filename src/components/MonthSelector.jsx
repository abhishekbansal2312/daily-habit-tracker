import React from 'react';
import { useHabitStore } from '../store/useHabitStore.js';
import { monthLabel } from '../utils/dateUtils.js';

const addMonths = (ym, diff) => {
  const [y, m] = ym.split('-').map(Number);
  const date = new Date(y, m - 1 + diff, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export default function MonthSelector() {
  const selectedMonth = useHabitStore((s) => s.selectedMonth);
  const setMonth = useHabitStore((s) => s.setMonth);

  const handlePrev = () => setMonth(addMonths(selectedMonth, -1));
  const handleNext = () => setMonth(addMonths(selectedMonth, 1));

  return (
    <div className="inline-flex items-center gap-2 bg-roseSoft/30 rounded-full px-4 py-2 border border-roseSoft">
      <button
        onClick={handlePrev}
        className="w-7 h-7 flex items-center justify-center rounded-full border border-roseSoft text-roseSoftDark text-xs hover:bg-roseSoft/60"
      >
        ‹
      </button>
      <span className="text-sm font-medium text-roseSoftDark whitespace-nowrap">
        {monthLabel(selectedMonth)}
      </span>
      <button
        onClick={handleNext}
        className="w-7 h-7 flex items-center justify-center rounded-full border border-roseSoft text-roseSoftDark text-xs hover:bg-roseSoft/60"
      >
        ›
      </button>
    </div>
  );
}
