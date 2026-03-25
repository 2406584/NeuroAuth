 interface LoginFormValues {
    username: string;
    password: string;
    termsOfService: boolean;
  }
 interface RegisterFormValues {
    username: string;
    password: string;
    neuro: boolean;
    confirmPassword: string;
    termsOfService: boolean;
  }
  export type { LoginFormValues, RegisterFormValues };