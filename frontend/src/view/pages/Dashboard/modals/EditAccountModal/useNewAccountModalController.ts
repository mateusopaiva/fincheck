import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, UseMutationOptions, useQueryClient  } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { bankAccountsService } from "../../../../../app/services/bankAccountsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import toast from "react-hot-toast";
import { CreateBankAccountParams } from "../../../../../app/services/bankAccountsService/create";

const schema = z.object({
  initialBalance: z.string().min(1, 'Saldo inicial é obrigatório'),
  name: z.string().min(1, 'Nome da Conta é obrigatório'),
  type: z.enum(['CHECKING', 'INVESTMENT', 'CASH']),
  color: z.string().min(1, 'Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function useNewAccountModalController() {
  const {
    isEditAccountModalOpen,
    closeEditAccountModal,
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
  const mutationOptions: UseMutationOptions<any, Error, CreateBankAccountParams> = {
    mutationFn: bankAccountsService.create,
  };

  const QueryClient = useQueryClient();
  const { isPending, mutateAsync } = useMutation(mutationOptions);

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync({
        ...data,
        initialBalance: currencyStringToNumber(data.initialBalance),
      })

      QueryClient.invalidateQueries({ queryKey:['bankAccounts'] });
      toast.success('Conta foi cadastrada com sucesso!');
      closeEditAccountModal();
      reset();
    } catch {
      toast.error('Erro ao cadastrar a conta!');
    }
  });

  return {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isPending,
  };
}
