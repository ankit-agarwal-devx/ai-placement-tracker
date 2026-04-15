export type CandidateFormState = {
  message: string
  fieldErrors?: Partial<
    Record<"name" | "email" | "password" | "skills" | "resume", string[]>
  >
}

export const initialCandidateFormState: CandidateFormState = {
  message: "",
}
