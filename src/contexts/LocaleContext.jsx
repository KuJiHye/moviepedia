import { createContext, useContext, useState } from "react";

const LocaleContext = createContext();

export function LocaleProvider({ defaultValue = "ko", children }) {
  const [locale, setLocale] = useState(defaultValue);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>  {/* 리액트 Fragment처럼 실제로 렌더링 될 때는 아무것도 렌더링 되지 않는다. */}
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("반드시 LocalProvider 안에서 사용해야 합니다.");
  }

  const { locale } = context;

  return locale;
}

export function useSetLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("반드시 LocalProvider 안에서 사용해야 합니다.");
  }

  const { setLocale } = context;

  return setLocale;
}
