'use client';

import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import PrivateRouteProps from './PrivateRoute';
import {
  ArrowRight,
  CheckSquare,
  Code,
  FileCode,
  FileJson,
  FileText,
  Fingerprint,
  Home,
  KeyRound,
  MessageSquare,
  Newspaper,
  Palette,
  QrCode,
  Search,
  ShieldCheck,
  Terminal,
  Layers
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const CommandItem = ({ children, value, onSelect, icon }: { 
  children: React.ReactNode;
  value: string;
  onSelect: () => void;
  icon?: React.ReactNode;
}) => {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
    
      className="px-2 py-3 rounded-md text-sm flex items-center gap-2 cursor-pointer data-[selected=true]:bg-gray-800 data-[selected=true]:text-blue-400 hover:bg-gray-800 text-gray-200"
    >
      {icon && <div className="flex items-center justify-center text-gray-400">{icon}</div>}
      <span className="flex-1">{children}</span>
      <ArrowRight className="w-4 h-4 text-gray-500 opacity-0 data-[selected=true]:opacity-100" />
    </Command.Item>
  );
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // ⌘ + K or Ctrl + K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (path: string) => {
    setIsLoading(true);
    router.push(path);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      setOpen(false);
      setIsLoading(false);
      setSearch('');
    }, 300);
  };

  const tools = [
  {
    category: 'Navigation',
    items: [
      { name: 'Home', path: '/', icon: <Home size={16} /> },
      { name: 'Chat', path: '/chat', icon: <MessageSquare size={16} /> },
      { name: 'News', path: '/news', icon: <Newspaper size={16} /> },
      { name: 'Todos', path: '/todos', icon: <CheckSquare size={16} /> }
    ]
  },
  {
    category: 'Developer Tools',
    items: [
      { name: 'API Tester', path: '/tools/apitester', icon: <Terminal size={16} /> },
      { name: 'Code Explain', path: '/tools/code-explain', icon: <FileCode size={16} /> },
      { name: 'Code Preview', path: '/tools/code-preview', icon: <Code size={16} /> },
      { name: 'QR Code Generator', path: '/tools/qrcode', icon: <QrCode size={16} /> },
      { name: 'Resource Finder', path: '/tools/resourcefinder', icon: <Search size={16} /> },
    ]
  },
  {
    category: 'Data Tools',
    items: [
      { name: 'JSON Formatter', path: '/tools/json-formatter', icon: <FileJson size={16} /> },
      { name: 'Markdown Preview', path: '/tools/markdown', icon: <FileText size={16} /> },
    ]
  },
  {
    category: 'Utilities',
    items: [
      { name: 'Color Picker', path: '/tools/color-picker', icon: <Palette size={16} /> },
      { name: 'UUID Generator', path: '/tools/uuid-generator', icon: <Fingerprint size={16} /> },
      { name: 'Hash Generator', path: '/tools/hash-generator', icon: <ShieldCheck size={16} /> },
      { name: 'Password Generator', path: '/tools/password-generator', icon: <KeyRound size={16} /> },
    ]
  }
];

  // Flatten tools for searching
  const allTools = tools.flatMap(category => 
    category.items.map(item => ({...item, category: category.category}))
  );

  // Filter tools based on search
  const filteredTools = search.length > 0
    ? allTools.filter(tool => 
        tool.name.toLowerCase().includes(search.toLowerCase()) || 
        tool.category.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Group filtered tools by category
  const groupedFilteredTools = search.length > 0 
    ? Object.entries(
        filteredTools.reduce((acc, tool) => {
          if (!acc[tool.category]) acc[tool.category] = [];
          acc[tool.category].push(tool);
          return acc;
        }, {} as Record<string, typeof filteredTools>)
      )
    : [];

  return (
    <PrivateRouteProps>
    <AnimatePresence>
      {open && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div 
            className="bg-gray-900 w-full max-w-lg rounded-lg overflow-hidden shadow-2xl border border-gray-800"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Command 
              className="w-full"
              filter={(value, search) => {
                // Custom filter to match anywhere in the string
                if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                return 0;
              }}
            >
              <div className="flex items-center border-b border-gray-800 px-3">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <Command.Input 
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search tools..." 
                  className="flex-1 h-12 bg-transparent border-0 outline-none text-sm text-gray-100 placeholder:text-gray-500"
                />
                <kbd className="hidden sm:flex items-center text-xs font-mono text-gray-500 px-1 py-0.5 border border-gray-700 rounded">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[360px] overflow-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {search.length === 0 ? (
                  <>
                    {tools.map((category) => (
                      <Command.Group key={category.category} heading={
                        <div className="px-2 py-1 text-xs font-semibold text-gray-400">
                          {category.category}
                        </div>
                      }>
                        {category.items.map((tool) => (
                          <CommandItem
                            key={tool.path}
                            value={tool.name}
                            onSelect={() => handleSelect(tool.path)}
                            icon={tool.icon}
                          >
                            {tool.name}
                          </CommandItem>
                        ))}
                      </Command.Group>
                    ))}
                  </>
                ) : (
                  <>
                    {groupedFilteredTools.length > 0 ? (
                      groupedFilteredTools.map(([category, tools]) => (
                        <Command.Group key={category} heading={
                          <div className="px-2 py-1 text-xs font-semibold text-gray-400">
                            {category}
                          </div>
                        }>
                          {tools.map((tool) => (
                            <CommandItem
                              key={tool.path}
                              value={tool.name}
                              onSelect={() => handleSelect(tool.path)}
                              icon={tool.icon}
                            >
                              {tool.name}
                            </CommandItem>
                          ))}
                        </Command.Group>
                      ))
                    ) : (
                      <div className="py-6 text-center text-gray-500">
                        <div className="flex justify-center mb-2">
                          <Layers className="w-6 h-6" />
                        </div>
                        <p className="text-sm">No tools found for &quot;{search}&quot;</p>
                        <p className="text-xs mt-1">Try searching for another term</p>
                      </div>
                    )}
                  </>
                )}
                
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-gray-400 mt-2">Loading tool...</p>
                    </div>
                  </div>
                )}
              </Command.List>

              <div className="border-t border-gray-800 p-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <div className="flex gap-2">
                    <span>
                      <span className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">↑↓</span> to navigate
                    </span>
                    <span>
                      <span className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">Enter</span> to select
                    </span>
                  </div>
                  <div>
                    <kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">Ctrl K</kbd> to toggle
                  </div>
                </div>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </PrivateRouteProps>
  );
}