import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, UseMutationOptions, useQueryClient  } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { bankAccountsService } from "../../../../../app/services/bankAccountsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import toast from "react-hot-toast";
import { UpdateBankAccountParams } from "../../../../../app/services/bankAccountsService/update";
import { useState } from "react";

const schema = z.object({
  initialBalance: z.union([
    z.string().min(1, 'Saldo inicial é obrigatório'),
    z.number(),
  ]),
  name: z.string().min(1, 'Nome da Conta é obrigatório'),
  type: z.enum(['CHECKING', 'INVESTMENT', 'CASH']),
  color: z.string().min(1, 'Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function useEditAccountModalController() {
  const {
    isEditAccountModalOpen,
    closeEditAccountModal,
    accountBeingEdited,
  } = useDashboard();

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      color: accountBeingEdited?.color,
      name: accountBeingEdited?.name,
      type: accountBeingEdited?.type,
      initialBalance: accountBeingEdited?.initialBalance,
    },
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutationOptionsUpdate: UseMutationOptions<any, Error, UpdateBankAccountParams> = {
    mutationFn: bankAccountsService.update,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutationOptionsDelete: UseMutationOptions<any, Error, string> = {
    mutationFn: bankAccountsService.remove,
  };

  const QueryClient = useQueryClient();

  const {
    isPending,
    mutateAsync: updateAccount
  } = useMutation(mutationOptionsUpdate);

  const {
    isPending: isLoadingDelete,
    mutateAsync: removeAccount
  } = useMutation(mutationOptionsDelete);

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await updateAccount({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance),
        id: accountBeingEdited!.id,
      })

      QueryClient.invalidateQueries({ queryKey:['bankAccounts'] });
      toast.success('A conta foi editada com sucesso!');
      closeEditAccountModal();
    } catch {
      toast.error('Erro ao salvar as alterações!');
    }
  });

  function handleOpenDeleteModal(){
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal(){
    setIsDeleteModalOpen(false);
  }

  async function handleDeleteAccount() {
    try {
      await removeAccount(accountBeingEdited!.id)

      QueryClient.invalidateQueries({ queryKey:['bankAccounts'] });
      toast.success('A conta foi deletada com sucesso!');
      closeEditAccountModal();
    } catch {
      toast.error('Erro ao deletar a conta!');
    }
  }

  return {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isPending,
    isDeleteModalOpen,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteAccount,
    isLoadingDelete,
  };
}
