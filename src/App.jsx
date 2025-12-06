import React from 'react';
import Header from './components/Header.jsx';
import MonthSelector from './components/MonthSelector.jsx';
import OverviewPanel from './components/OverviewPanel.jsx';
import HabitGrid from './components/HabitGrid.jsx';
import AddHabitForm from './components/AddHabitForm.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-rose-50">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-sm border border-roseSoft/60 p-6 md:p-8">
        <Header />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
          <MonthSelector />
          <AddHabitForm />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
          <OverviewPanel />
          <HabitGrid />
        </div>
      </div>
    </div>
  );
}
