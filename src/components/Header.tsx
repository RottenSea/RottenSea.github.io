// src/components/Header.tsx
import DarkModeToggle from './DarkModeToggle';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'RottenSea' }: HeaderProps) {
  return (
    <header class="header">
      <div class="header__inner">
        <a href="/" class="header__title">{title}</a>
        <nav class="header__nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
