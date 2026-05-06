// src/components/DarkModeToggle.tsx
import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button class="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
