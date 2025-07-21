"use client";

import { Textarea } from "@/components/ui/textarea";

interface KeywordTextAreaProps {
  value: string;
  onChange: (keywordsArray: string[], rawText: string) => void;
  placeholder?: string;
}

export default function KeywordTextArea({
  value,
  onChange,
  placeholder = "📈 Enter keywords here, each on a new line or comma separated"
}: KeywordTextAreaProps) {

  const handleChange = (text: string) => {
    const processedKeywords = text
      .split(/[\n,]+/) // Split by new lines OR commas
      .map((kw) => kw.trim())
      .filter((kw) => kw !== "");

    onChange(processedKeywords, text);
  };

  return (
    <div className="space-y-3">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="h-48 resize-none border border-black text-black rounded-xl"
      />
    </div>
  );
}
