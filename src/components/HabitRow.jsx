import React from 'react';
import { useHabitStore } from '../store/useHabitStore.js';
import { dateKeyFor } from '../utils/dateUtils.js';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function HabitRow({ habit, days }) {
  const { completions, selectedMonth, toggleCompletion, deleteHabit } =
    useHabitStore((s) => s);

  const handleToggle = (day) => {
    const keyDate = dateKeyFor(selectedMonth, day);
    toggleCompletion(habit.id, keyDate);
  };

  const completedCount = days.reduce((acc, d) => {
    const keyDate = dateKeyFor(selectedMonth, d);
    return acc + (completions[`${habit.id}:${keyDate}`] ? 1 : 0);
  }, 0);

  const completionPct = days.length
    ? Math.round((completedCount / days.length) * 100)
    : 0;

  return (
    <div className="grid grid-cols-[130px_repeat(auto-fit,minmax(28px,1fr))] gap-1 items-center">
      <div className="flex items-center justify-between pr-2 text-xs">
        <div>
          <p className="font-medium text-roseSoftDark">{habit.name}</p>
          <p className="text-[10px] text-rose-400">{habit.category}</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-rose-400">
          <span>{completionPct}%</span>
          <button
            onClick={() => deleteHabit(habit.id)}
            className="w-5 h-5 flex items-center justify-center rounded-full border border-roseSoft text-rose-300 hover:bg-roseSoft/40"
            title="Delete habit"
          >
            <span className="text-[9px]">×</span>
          </button>
        </div>
      </div>

      {days.map((d) => {
        const keyDate = dateKeyFor(selectedMonth, d);
        const checked = !!completions[`${habit.id}:${keyDate}`];

        return (
          <button
            key={d}
            type="button"
            onClick={() => handleToggle(d)}
            className={`w-7 h-7 border flex items-center justify-center text-[11px] ${
              checked
                ? 'border-roseAccent bg-roseAccent'
                : 'border-roseSoft bg-white hover:bg-roseSoft/40'
            }`}
          >
            {checked ? '✓' : ''}
          </button>
        );
      })}
    </div>
  );
}
