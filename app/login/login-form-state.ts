export type LoginFormState = {
  message: string
  fieldErrors?: Partial<Record<"email" | "password", string[]>>
}

export const initialLoginState: LoginFormState = {
  message: "",
}
