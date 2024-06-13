import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { useCategories } from "../../../../../app/hooks/useCategories";
import { useMemo, useState } from "react";
import { Transaction } from "../../../../../app/entities/Transaction";
import { UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateTransactionParams } from "../../../../../app/services/transactionsService/update";
import { transactionsService } from "../../../../../app/services/transactionsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import toast from "react-hot-toast";

const schema = z.object({
  value: z.union([
    z.string().min(1, 'Informe o valor'),
    z.number(),
  ]),
  name: z.string().min(1, 'Informe o nome'),
  categoryId: z.string().min(1, 'Informe a categoria'),
  bankAccountId: z.string().min(1, 'Informe a categoria'),
  date: z.date(),
  });

  type FormData = z.infer<typeof schema>;

  export function useEditTransactionModalController(
    transaction: Transaction | null,
    onClose: () => void,
  ) {
    const {
      register,
      handleSubmit: hookFormSubmit,
      formState: { errors },
      control,
      } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
          bankAccountId: transaction?.bankAccountId,
          categoryId: transaction?.categoryId,
          name: transaction?.name,
          value: transaction?.value,
          date: transaction ? new Date(transaction.date) : new Date(),
        },
    });

  const { accounts } = useBankAccounts();
  const { categories: categoriesList } = useCategories();
  const queryClient = useQueryClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutationOptionsUpdate: UseMutationOptions<any, Error, UpdateTransactionParams> = {
      mutationFn: transactionsService.update,
    };

  const {
    isPending,
    mutateAsync: updateTransaction,
  } = useMutation(mutationOptionsUpdate);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mutationOptionsDelete: UseMutationOptions<any, Error, string> = {
      mutationFn: transactionsService.remove,
    };

    const {
      isPending: isLoadingDelete,
      mutateAsync: removeTransaction,
    } = useMutation(mutationOptionsDelete);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateTransaction({
        ...data,
        id: transaction!.id,
        type: transaction!.type,
        value: currencyStringToNumber(data.value),
        date: data.date.toISOString(),
      });

      queryClient.invalidateQueries({ queryKey:['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });

      toast.success(
        transaction!.type === 'EXPENSE'
          ? 'Despesa editada com sucesso!'
          : 'Receita editada com sucesso!'
      );
      onClose();
    } catch (error) {
      console.log('Erro ao salvar a transação:', error);
      toast.error(
        transaction!.type === 'EXPENSE'
          ? 'Erro ao salvar a despesa!'
          : 'Erro ao salvar a receita!'
      );
    }
  });

  const categories = useMemo(() => {
    return categoriesList.filter(category => category.type === transaction?.type)
  }, [categoriesList, transaction]);

  async function handleDeleteTransaction() {
    try {
      await removeTransaction(transaction!.id)

      queryClient.invalidateQueries({ queryKey:['transactions'] });
      queryClient.invalidateQueries({ queryKey:['bankAccounts'] });

      toast.success(
        transaction!.type === 'EXPENSE'
          ? 'A despesa foi deletada com sucesso!'
          : 'A receita foi deletada com sucesso!'
        );
      onClose();
    } catch(error) {
      console.log('Erro ao deletar a transação:', error);
      toast.error(
        transaction!.type === 'EXPENSE'
        ? 'Erro ao deletar a despesa!'
        : 'Erro ao deletar a receita!'
      );
    }
  }

  function handleOpenDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  return {
    register,
    errors,
    control,
    handleSubmit,
    accounts,
    categories,
    isPending,
    isDeleteModalOpen,
    isLoadingDelete,
    handleDeleteTransaction,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
  };
}
