import React from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">SSME</h1>
      <ThemeToggle />
    </header>
  );
};

export default Header;
