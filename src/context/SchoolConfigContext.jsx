import { createContext, useContext } from 'react';

export const SchoolConfigContext = createContext();

export const useSchoolConfig = () => {
  const context = useContext(SchoolConfigContext);
  if (!context) {
    throw new Error("useSchoolConfig must be used within a SchoolConfigProvider");
  }
  return context;
};
