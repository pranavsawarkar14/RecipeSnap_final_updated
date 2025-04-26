// /components/LanguageFilter.tsx

/**
 * Language options available for filtering and translating content
 */
export type Languages = 
  | "en"  // English
  | "es"  // Spanish
  | "fr"  // French
  | "de"  // German
  | "ja"  // Japanese
  | "hi"  // Hindi
  | "mr"; // Marathi

/**
 * Maps language codes to their full names for display
 */
export const languageNames: Record<Languages, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  hi: "Hindi",
  mr: "Marathi"
};

/**
 * Component for filtering content by language
 */
import { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageFilterProps {
  value: Languages;
  onChange: (value: Languages) => void;
  className?: string;
}

export const LanguageFilter: FC<LanguageFilterProps> = ({ 
  value, 
  onChange,
  className = ""
}) => {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as Languages)} className={className}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(languageNames) as [Languages, string][]).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageFilter;