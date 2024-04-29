import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { toast } from 'react-hot-toast';

import { authService } from "../../../app/services/authService";
import { SignupParams } from "../../../app/services/authService/signup";

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatorio'),
  email: z.string().min(1, 'E-mail é obrigatorio').email('Informe um e-mail válido'),
  password: z.string().min(8, "A senha é obrigatoria e deve conter pelo menos 8 dígitos"),
});

type FormData = z.infer<typeof schema>;

export function useRegisterController() {
  const {
    handleSubmit: hookFormSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: SignupParams) => {
      return authService.signup(data);
    },
  });

  const handleSubmit = hookFormSubmit(async (data) => {
   try {
    await mutateAsync(data);
   } catch {
    toast.error('Ocorreu um erro ao criar a sua conta!')
   }
  });

  return { register, errors, handleSubmit, isPending };
}
