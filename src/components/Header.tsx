// src/components/Header.tsx
import DarkModeToggle from './DarkModeToggle';
import Search from './Search';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'RottenSea' }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__inner">
        <a href="/" className="header__title">{title}</a>
        <nav className="header__nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <Search />
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
