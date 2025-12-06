import React, { useMemo } from 'react';
import { useHabitStore } from '../store/useHabitStore.js';
import { getDaysInMonth, dateKeyFor } from '../utils/dateUtils.js';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

// Assign a color to each category, fallback to a default color if needed
const DEFAULT_COLORS = [
  '#f3a8b8', // rose
  '#f9c6c3', // pink
  '#f7e1d7', // peach
  '#f1a5a5', // red
  '#b5e0e3', // teal
  '#f7e6ad', // yellow
  '#c3aed6', // purple
  '#b8e0d2', // green
];

export default function OverviewPanel() {
  const { habits, completions, selectedMonth, categories } = useHabitStore((s) => s);

  // Generate a color map for current categories
  const CATEGORY_COLORS = useMemo(() => {
    const map = {};
    categories.forEach((cat, idx) => {
      map[cat] = DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
    });
    return map;
  }, [categories]);

  const stats = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const days = getDaysInMonth(y, m - 1);
    const totalPossible = habits.length * days.length;

    // Build dynamic category objects
    const byCategory = {};
    const categoryTotals = {};
    categories.forEach(cat => {
      byCategory[cat] = 0;
      categoryTotals[cat] = 0;
    });

    const completedPerDay = days.map((d) => {
      const keyDate = dateKeyFor(selectedMonth, d);
      let count = 0;
      habits.forEach((h) => {
        if (categoryTotals[h.category] !== undefined) categoryTotals[h.category]++;
        if (completions[`${h.id}:${keyDate}`]) {
          count += 1;
          if (byCategory[h.category] !== undefined) byCategory[h.category] += 1;
        }
      });
      return { day: d, completed: count };
    });

    // Completion rate by category
    const categoryCompletionRate = Object.keys(byCategory).map((cat) => ({
      category: cat,
      rate: categoryTotals[cat] ? Math.round((byCategory[cat] / categoryTotals[cat]) * 100) : 0,
    }));

    // Streak calculation (longest consecutive days with at least one completion)
    let maxStreak = 0, currentStreak = 0;
    completedPerDay.forEach((d) => {
      if (d.completed > 0) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    });

    // Stacked bar data
    const stackedBarData = days.map((d) => {
      const keyDate = dateKeyFor(selectedMonth, d);
      const dayData = { day: d };
      categories.forEach((cat) => {
        dayData[cat] = habits.filter(h => h.category === cat && completions[`${h.id}:${keyDate}`]).length;
      });
      return dayData;
    });

    const totalCompleted = completedPerDay.reduce((s, d) => s + d.completed, 0);
    const completedPct = totalPossible ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    return {
      byCategory,
      completedPct,
      incompletePct: 100 - completedPct,
      completedPerDay,
      categoryCompletionRate,
      stackedBarData,
      maxStreak,
      totalHabits: habits.length,
      totalCompleted,
    };
  }, [habits, completions, selectedMonth, categories]);

  const donutData = Object.entries(stats.byCategory).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  const barData = [
    { name: 'Completed', value: stats.completedPct },
    { name: 'Incomplete', value: stats.incompletePct },
  ];

  return (
    <aside className="bg-roseSoft/20 rounded-3xl border border-roseSoft/70 p-4 flex flex-col gap-6">
      {/* Summary Stats */}
      <div className="flex gap-6 mb-2 text-xs">
        <div>
          <span className="font-bold text-roseSoftDark">{stats.totalHabits}</span>
          <span className="ml-1 text-rose-400">Habits</span>
        </div>
        <div>
          <span className="font-bold text-roseSoftDark">{stats.totalCompleted}</span>
          <span className="ml-1 text-rose-400">Completions</span>
        </div>
        <div>
          <span className="font-bold text-roseSoftDark">{stats.maxStreak}</span>
          <span className="ml-1 text-rose-400">Day Streak</span>
        </div>
      </div>

          <h3 className="text-sm font-semibold text-roseSoftDark mb-2">
            Monthly Overview
          </h3>
      {/* Habit types and Complete vs incomplete tasks side by side */}
      <div className="flex flex-row gap-6 flex-nowrap items-start">
        {/* Habit types (Donut Chart) */}
        <div className="flex-1 min-w-[180px]">
          <p className="text-[11px] text-rose-500 mb-3">Habit types</p>
          {stats.totalCompleted === 0 ? (
            <div className="text-center text-rose-400 text-sm py-10">
              No monthly data available...
            </div>
          ) : (
            <>
              <div className="h-40">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={4}
                    >
                      {donutData.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={CATEGORY_COLORS[entry.name]}
                          stroke="#ffffff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] mt-2">
                {categories.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[c] }}
                    />
                    {c}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Complete vs Incomplete Bar */}
        <div className="flex-1 min-w-[180px]">
          <p className="text-[11px] text-rose-500 mb-2">
            Complete vs incomplete tasks
          </p>
          {stats.totalCompleted === 0 ? (
            <div className="text-center text-rose-400 text-sm py-10">
              No monthly data available...
            </div>
          ) : (
            <div className="h-40">
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} hide />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.4)' }} />
                  <Bar dataKey="value" radius={6} fill="#f3a8b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Daily Completed Habits Line */}
      <div>
        <p className="text-[11px] text-rose-500 mb-2">
          Daily completed habits
        </p>
        <div className="h-28">
          <ResponsiveContainer>
            <LineChart data={stats.completedPerDay}>
              <XAxis dataKey="day" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#f3a8b8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stacked Bar Chart: Habits Completed by Category */}
      <div>
        <p className="text-[11px] text-rose-500 mb-2">
          Habits completed by category (per day)
        </p>
        <div className="h-32">
          <ResponsiveContainer>
            <BarChart data={stats.stackedBarData}>
              <XAxis dataKey="day" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
              <Tooltip />
              {categories.map((cat) => (
                <Bar key={cat} dataKey={cat} stackId="a" fill={CATEGORY_COLORS[cat]} />
              ))}
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </aside>
  );
}
