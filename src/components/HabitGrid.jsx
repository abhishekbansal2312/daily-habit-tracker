import React from 'react';
import { useHabitStore } from '../store/useHabitStore.js';
import { getDaysInMonth } from '../utils/dateUtils.js';
import HabitRow from './HabitRow.jsx';

export default function HabitGrid() {
  const { habits, selectedMonth } = useHabitStore((s) => s);
  const [y, m] = selectedMonth.split('-').map(Number);
  const days = getDaysInMonth(y, m - 1);

  return (
    <section className="border border-roseSoft/70 rounded-3xl p-4 overflow-x-auto bg-roseSoft/10">
      <div className="min-w-max">
        <div className="grid grid-cols-[130px_repeat(auto-fit,minmax(28px,1fr))] gap-1 items-end mb-3">
          <div className="text-xs font-semibold text-roseSoftDark">Habits</div>
          {days.map((d) => (
            <div
              key={d}
              className="text-[10px] text-rose-400 text-center px-1"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} days={days} />
          ))}
          {habits.length === 0 && (
            <p className="text-xs text-rose-400 mt-2">
              Add a habit to start tracking.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
