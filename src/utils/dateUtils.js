export const getDaysInMonth = (year, monthIndex) => {
  const days = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
};

export const monthLabel = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const dateKeyFor = (ym, day) => {
  const [y, m] = ym.split('-').map(Number);
  const iso = new Date(y, m - 1, day).toISOString().slice(0, 10);
  return iso;
};
