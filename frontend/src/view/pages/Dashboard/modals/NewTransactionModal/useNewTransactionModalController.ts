import { z } from "zod";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { useCategories } from "../../../../../app/hooks/useCategories";
import { useMemo } from "react";
import { UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "../../../../../app/services/transactionsService";
import { CreateTransactionParams } from "../../../../../app/services/transactionsService/create";
import toast from "react-hot-toast";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";

const schema = z.object({
  value: z.string().min(1, 'Informe o valor'),
  name: z.string().min(1, 'Informe o nome'),
  categoryId: z.string().min(1, 'Informe a categoria'),
  bankAccountId: z.string().min(1, 'Informe a categoria'),
  date: z.date(),
  });

  type FormData = z.infer<typeof schema>;

  export function useNewTransactionModalController() {
    const {
      isNewTransactionModalOpen,
      closeNewTransactionModal,
    newTransactionType,
    } = useDashboard();

    const {
      register,
      handleSubmit: hookFormSubmit,
      formState: { errors },
      control,
      reset,
      } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutationOptions: UseMutationOptions<any, Error, CreateTransactionParams> = {
    mutationFn: transactionsService.create,
  };

  const queryClient = useQueryClient();
  const { accounts } = useBankAccounts();
  const { categories: categoriesList } = useCategories();
  const {
      isPending,
      mutateAsync,

    } = useMutation(mutationOptions);

  const handleSubmit = hookFormSubmit(async data => {
    try {
      await mutateAsync({
        ...data,
        value: currencyStringToNumber(data.value),
        type: newTransactionType!,
        date: data.date.toISOString(),
      });

      queryClient.invalidateQueries({ queryKey:['transactions'] });
      queryClient.invalidateQueries({ queryKey:['bankAccounts'] });
      toast.success(
        newTransactionType === 'EXPENSE'
          ? 'Despesa cadastrada com sucesso!'
          : 'Receita cadastrada com sucesso!'
      );
      closeNewTransactionModal();
      reset();
    } catch {
      toast.error(
        newTransactionType === 'EXPENSE'
          ? 'Erro ao cadastrar a despesa!'
          : 'Erro ao cadastrar a receita!'
      );
    }
  });

  const categories = useMemo(() => {
    return categoriesList.filter(category => category.type === newTransactionType)
  }, [categoriesList, newTransactionType])

  return {
    isNewTransactionModalOpen,
    closeNewTransactionModal,
    newTransactionType,
    register,
    errors,
    control,
    handleSubmit,
    accounts,
    categories,
    isPending,
  };
}
