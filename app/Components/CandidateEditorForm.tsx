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
  const nameErrorId = "candidate-name-error"
  const emailErrorId = "candidate-email-error"
  const passwordErrorId = "candidate-password-error"
  const skillsErrorId = "candidate-skills-error"
  const resumeErrorId = "candidate-resume-error"
  const formMessageId = "candidate-form-message"

  const action =
    mode === "edit" && candidate
      ? updateCandidateProfile.bind(null, candidate.id)
      : createCandidateProfile

  const [state, formAction, pending] = useActionState(action, initialCandidateFormState)

  const isCreate = mode === "create"
  const nameErrors = state.fieldErrors?.name
  const emailErrors = state.fieldErrors?.email
  const passwordErrors = state.fieldErrors?.password
  const skillsErrors = state.fieldErrors?.skills
  const resumeErrors = state.fieldErrors?.resume
  const hasFormMessage = Boolean(state.message)

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
              aria-describedby={nameErrors?.length ? nameErrorId : undefined}
              aria-invalid={nameErrors?.length ? true : undefined}
              required
            />
            <FieldError id={nameErrorId} errors={nameErrors} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={candidate?.email ?? ""}
              placeholder="candidate@example.com"
              aria-describedby={emailErrors?.length ? emailErrorId : undefined}
              aria-invalid={emailErrors?.length ? true : undefined}
              required
            />
            <FieldError id={emailErrorId} errors={emailErrors} />
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
              aria-describedby={passwordErrors?.length ? passwordErrorId : undefined}
              aria-invalid={passwordErrors?.length ? true : undefined}
              required={isCreate}
            />
            <FieldError id={passwordErrorId} errors={passwordErrors} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="skills">Skills</FormLabel>
            <FormTextarea
              id="skills"
              name="skills"
              defaultValue={candidate?.skills ?? ""}
              placeholder="React, Node.js, SQL"
              aria-describedby={skillsErrors?.length ? skillsErrorId : undefined}
              aria-invalid={skillsErrors?.length ? true : undefined}
              required
            />
            <FieldError id={skillsErrorId} errors={skillsErrors} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="resume">Resume URL</FormLabel>
            <Input
              id="resume"
              name="resume"
              type="url"
              defaultValue={candidate?.resume ?? ""}
              placeholder="https://example.com/resume.pdf"
              aria-describedby={resumeErrors?.length ? resumeErrorId : undefined}
              aria-invalid={resumeErrors?.length ? true : undefined}
            />
            <FieldError id={resumeErrorId} errors={resumeErrors} />
          </FormField>

          <FormMessage
            id={formMessageId}
            role={hasFormMessage ? "alert" : undefined}
            tone={hasFormMessage ? "error" : "muted"}
          >
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
