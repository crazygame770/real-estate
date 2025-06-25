
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { languageOptions } from '@/components/ui/language-icons';

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const currentLanguage = languageOptions.find((l) => l.value === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 justify-start hover:bg-muted w-full">
          {currentLanguage?.flag}
          <span>{t(currentLanguage?.label || '')}</span>
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => setLanguage(lang.value as 'en' | 'es')}
            className={cn("cursor-pointer", language === lang.value && "bg-accent")}
          >
            <div className="flex items-center">
              {lang.flag}
              <span>{t(lang.label)}</span>
            </div>
            {language === lang.value && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
