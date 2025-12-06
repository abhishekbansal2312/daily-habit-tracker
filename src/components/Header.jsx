import React from 'react';

export default function Header() {
  return (
    <header className="text-center md:text-left">
      <h1 className="text-3xl md:text-4xl font-semibold text-roseSoftDark tracking-wide">
        Daily Habit Tracker
      </h1>
      <p className="mt-1 text-sm md:text-base text-rose-500 italic">
        Your habits will determine your future!
      </p>
    </header>
  );
}
