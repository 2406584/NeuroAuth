 interface LoginFormValues {
    username: string;
    password: string;
    termsOfService: boolean;
  }
 interface RegisterFormValues {
    username: string;
    password: string;
    confirmPassword: string;
    termsOfService: boolean;
  }
  export type { LoginFormValues, RegisterFormValues };