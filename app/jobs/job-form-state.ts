export type JobFormState = {
  message: string
  fieldErrors?: Partial<Record<"title" | "company" | "description", string[]>>
}

export const initialJobFormState: JobFormState = {
  message: "",
}
