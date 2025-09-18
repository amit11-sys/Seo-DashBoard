'use client'
import { getlanguageData } from "@/actions/locations_Language";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type LanguageContextType = {
  languages: string[];
  loading: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
  languages: [],
  loading: false,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      setLoading(true);
      try {
        const data = await getlanguageData();
        const langdata: string[] = data?.allLanguages ?? [];
        setLanguages(langdata);
      } catch (error) {
        console.error("language error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <LanguageContext.Provider value={{ languages, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguages = () => useContext(LanguageContext);
