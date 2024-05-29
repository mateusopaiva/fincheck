import { useState } from "react";
import { useDashboard } from "../DashboardContext/useDashboard";

export function useTransactionsController() {
  const { areValuesVisible } = useDashboard();

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(true);

  function handleOpenFilterModal() {
    setIsFiltersModalOpen(true);
  }

  function handleCloseFilterModal() {
    setIsFiltersModalOpen(false);
  }

  return {
    areValuesVisible,
    transactions: [{}],
    isInitialLoading: false,
    isLoading: false,
    handleOpenFilterModal,
    handleCloseFilterModal,
    isFiltersModalOpen,
  };
}
