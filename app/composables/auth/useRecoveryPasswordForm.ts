import { required, email } from "@regle/rules";

export interface IRecoveryPasswordForm {
  email: string;
}
interface ILoginFormProps {
  initialValues?: IRecoveryPasswordForm;
}

export const useRecoveryPasswordForm = ({
  initialValues = { email: "" },
}: ILoginFormProps = {}) => {
  const state = reactive<IRecoveryPasswordForm>(initialValues);

  const { r$ } = useRegle(
    state,
    {
      email: {
        required: withMessage(required, "Обязательное поле"),
        email: withMessage(email, "Некорректный email"),
      },
    },
    { id: "recovery-password" },
  );

  return { r$ };
};
