import React from 'react';

interface FooterProps {
  wordCount: number;
}

const Footer: React.FC<FooterProps> = ({ wordCount }) => {
  return (
    <footer className="p-2 border-t text-center">
      Word Count: {wordCount}
    </footer>
  );
};

export default Footer;
