export type RegisterFormState = {
  message: string
  success: boolean
  fieldErrors?: Partial<Record<"name" | "email" | "password" | "skills" | "resume", string[]>>
}

export const initialRegisterState: RegisterFormState = {
  message: "",
  success: false,
}
