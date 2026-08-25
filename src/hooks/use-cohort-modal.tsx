import { createContext, useContext, useState } from "react";
import CohortModal from "@/components/CohortModal.tsx";

type CohortModalContextType = {
  openCohortModal: () => void;
};

const CohortModalContext = createContext<CohortModalContextType>({
  openCohortModal: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export function useCohortModal() {
  return useContext(CohortModalContext);
}

export function CohortModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <CohortModalContext.Provider value={{ openCohortModal: () => setOpen(true) }}>
      {children}
      <CohortModal open={open} onOpenChange={setOpen} />
    </CohortModalContext.Provider>
  );
}
