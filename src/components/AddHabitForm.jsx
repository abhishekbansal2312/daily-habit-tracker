import React, { useState } from 'react';
import { useHabitStore } from '../store/useHabitStore.js';

export default function AddHabitForm() {
  const addHabit = useHabitStore((s) => s.addHabit);
  const categories = useHabitStore((s) => s.categories);
  const addCategory = useHabitStore((s) => s.addCategory);
  const removeCategory = useHabitStore((s) => s.removeCategory);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(name.trim(), category);
    setName('');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      addCategory(cat);
      setCategory(cat);
      setNewCategory('');
    }
  };

  return (
    <div className="space-y-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-2 items-center justify-end"
      >
        {/* Add new habit */}
        <input
          className="h-9 rounded-full border border-roseSoft/70 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-roseSoftDark bg-rose-50/60 flex-2"
          placeholder="Add new habit..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="h-9 rounded-full border border-roseSoft/70 px-3 text-xs text-roseSoftDark flex-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          type="submit"
          className="h-9 px-4 rounded-full bg-roseAccent text-xs font-semibold shadow-sm hover:bg-roseSoftDark flex-1 cursor-pointer"
        >
          Add
        </button>
        {/* Add new category */}
        <input
          className="h-9 rounded-full border border-roseSoft/70 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-roseSoftDark bg-rose-50/60 flex-2"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          type="button"
          className="h-9 px-4 rounded-full bg-roseAccent text-xs font-semibold shadow-sm hover:bg-roseSoftDark flex-1 cursor-pointer"
          onClick={handleAddCategory}
        >
          Add
        </button>
      </form>
      
      <div className="flex flex-wrap gap-1">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className="h-6 px-2 rounded-full bg-rose-200 text-rose-700 text-xs hover:bg-rose-300 flex items-center gap-1 cursor-pointer"
            onClick={() => removeCategory(c)}
          >
            <span className="text-base font-bold">×</span>
            <span>{c}</span>
          </button>
        ))}
      </div>
    </div>
  );
}