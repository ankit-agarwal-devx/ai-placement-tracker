"use client"

import Link from "next/link"
import { useActionState } from "react"

import {
  createCandidateProfile,
  updateCandidateProfile,
} from "@/app/candidates/actions"
import { initialCandidateFormState } from "@/app/candidates/candidate-form-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card"
import {
  FieldError,
  Form,
  FormActions,
  FormField,
  FormLabel,
  FormMessage,
  FormTextarea,
} from "@/components/Form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type CandidateEditorFormProps = {
  candidate?: {
    id: string
    name: string
    email: string
    skills: string
    resume: string | null
  } | null
  mode: "create" | "edit"
  role: "ADMIN" | "STUDENT"
}

export default function CandidateEditorForm({
  candidate,
  mode,
  role,
}: CandidateEditorFormProps) {
  const action =
    mode === "edit" && candidate
      ? updateCandidateProfile.bind(null, candidate.id)
      : createCandidateProfile

  const [state, formAction, pending] = useActionState(action, initialCandidateFormState)

  const isCreate = mode === "create"

  return (
    <Card className="w-full max-w-3xl border-primary/15 shadow-lg shadow-primary/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">
          {isCreate ? "Create candidate account" : "Edit candidate profile"}
        </CardTitle>
        <CardDescription>
          {isCreate
            ? "Admins create both the user account and the connected candidate profile here."
            : role === "ADMIN"
              ? "Admins can update candidate details and keep user records in sync."
              : "Update your candidate profile details used across applications."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction}>
          <FormField>
            <FormLabel htmlFor="name">Full name</FormLabel>
            <Input
              id="name"
              name="name"
              defaultValue={candidate?.name ?? ""}
              placeholder="Ankit Agarwal"
              required
            />
            <FieldError errors={state.fieldErrors?.name} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={candidate?.email ?? ""}
              placeholder="candidate@example.com"
              required
            />
            <FieldError errors={state.fieldErrors?.email} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="password">
              {isCreate ? "Password" : "New password"}
            </FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={isCreate ? "Minimum 6 characters" : "Leave blank to keep current password"}
              required={isCreate}
            />
            <FieldError errors={state.fieldErrors?.password} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="skills">Skills</FormLabel>
            <FormTextarea
              id="skills"
              name="skills"
              defaultValue={candidate?.skills ?? ""}
              placeholder="React, Node.js, SQL"
              required
            />
            <FieldError errors={state.fieldErrors?.skills} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="resume">Resume URL</FormLabel>
            <Input
              id="resume"
              name="resume"
              type="url"
              defaultValue={candidate?.resume ?? ""}
              placeholder="https://example.com/resume.pdf"
            />
            <FieldError errors={state.fieldErrors?.resume} />
          </FormField>

          <FormMessage tone={state.message ? "error" : "muted"}>
            {state.message}
          </FormMessage>

          <FormActions>
            <Button type="submit" className="sm:min-w-40" disabled={pending}>
              {pending
                ? isCreate
                  ? "Creating..."
                  : "Saving..."
                : isCreate
                  ? "Create candidate"
                  : "Save changes"}
            </Button>
            <Link
              href="/candidates"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to candidates
            </Link>
          </FormActions>
        </Form>
      </CardContent>
    </Card>
  )
}
