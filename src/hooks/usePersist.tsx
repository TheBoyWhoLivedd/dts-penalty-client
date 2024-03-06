import { useState, useEffect } from "react";

const usePersist = () => {
  // Retrieve the item from localStorage and handle null
  const getPersistedValue = () => {
    const item = localStorage.getItem("persist");
    return item ? JSON.parse(item) : false;
  };

  const [persist, setPersist] = useState(getPersistedValue());

  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};

export default usePersist;
