import React from 'react';
import { LucideIcon } from 'lucide-react';
import { 
  Bold, 
  Italic, 
  Code, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4, 
  Heading5, 
  Heading6, 
  Link2, 
  Quote,
  SquarePi,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarkdownToolbarProps {
  onFormat: (type: string) => void;
}

interface ToolbarItem {
  icon: LucideIcon;
  type: string;
  tooltip: string;
}

const toolbarItems: ToolbarItem[] = [
  { icon: Bold, type: 'bold', tooltip: 'Bold' },
  { icon: Italic, type: 'italic', tooltip: 'Italic' },
  { icon: Code, type: 'code', tooltip: 'Code' },
  { icon: List, type: 'unordered-list', tooltip: 'Unordered List' },
  { icon: ListOrdered, type: 'ordered-list', tooltip: 'Ordered List' },
  { icon: Heading1, type: 'heading1', tooltip: 'Heading1' },
  { icon: Heading2, type: 'heading2', tooltip: 'Heading2' },
  { icon: Heading3, type: 'heading3', tooltip: 'Heading3' },
  { icon: Heading4, type: 'heading4', tooltip: 'Heading4' },
  { icon: Heading5, type: 'heading5', tooltip: 'Heading5' },
  { icon: Heading6, type: 'heading6', tooltip: 'Heading6' },
  { icon: Link2, type: 'link', tooltip: 'Link' },
  { icon: Quote, type: 'quote', tooltip: 'Quote' },
  { icon: SquarePi, type: 'formula', tooltip: 'Formula' },
];

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ onFormat }) => {
  return (
    <div className="flex space-x-2 p-2 bg-background border-b">
      {toolbarItems.map((item) => (
        <Button 
          key={item.type} 
          variant="ghost" 
          size="icon"
          onClick={() => onFormat(item.type)}
          title={item.tooltip}
        >
          <item.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

export default MarkdownToolbar;
