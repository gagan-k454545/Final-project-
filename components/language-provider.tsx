"use client"

import { useState, type ReactNode } from "react"
import { LanguageContext } from "@/hooks/use-language"
import { getTranslation, type Language } from "@/lib/translations"

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string) => getTranslation(language, key)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
