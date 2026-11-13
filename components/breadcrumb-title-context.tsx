'use client';

import * as React from 'react';

interface BreadcrumbTitleContextType {
  customTitle: string | null;
  setCustomTitle: (title: string | null) => void;
}

const BreadcrumbTitleContext = React.createContext<BreadcrumbTitleContextType>({
  customTitle: null,
  setCustomTitle: () => {},
});

export function BreadcrumbTitleProvider({ children }: { children: React.ReactNode }) {
  const [customTitle, setCustomTitle] = React.useState<string | null>(null);

  return (
    <BreadcrumbTitleContext.Provider value={{ customTitle, setCustomTitle }}>
      {children}
    </BreadcrumbTitleContext.Provider>
  );
}

export function useBreadcrumbTitle() {
  return React.useContext(BreadcrumbTitleContext);
}

export function SetBreadcrumbTitle({ title }: { title: string }) {
  const { setCustomTitle } = useBreadcrumbTitle();

  React.useEffect(() => {
    setCustomTitle(title);
    return () => {
      setCustomTitle(null);
    };
  }, [title, setCustomTitle]);

  return null;
}
