"use client"

import Link from "next/link"
import { useActionState } from "react"

import { registerCandidate } from "@/app/register/actions"
import { initialRegisterState } from "@/app/register/register-form-state"
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

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerCandidate,
    initialRegisterState
  )

  return (
    <Card className="w-full max-w-xl border-primary/15 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-card)_94%,white),color-mix(in_oklab,var(--color-secondary)_16%,var(--color-card)))] shadow-[0_24px_70px_-32px_color-mix(in_oklab,var(--color-secondary)_34%,transparent)]">
      <CardHeader className="space-y-3 border-b border-primary/10 pb-5">
        <div className="inline-flex w-fit rounded-full border border-tertiary/24 bg-tertiary/16 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-tertiary-foreground">
          Join HireFlow
        </div>
        <CardTitle className="text-3xl">Create your candidate account</CardTitle>
        <CardDescription className="max-w-md text-sm leading-6">
          Every new account is registered as a candidate and gets a connected
          candidate profile automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form action={formAction} className="space-y-6">
          <FormField>
            <FormLabel htmlFor="name" className="text-primary/90">Full name</FormLabel>
            <Input
              id="name"
              name="name"
              placeholder="Ankit Agarwal"
              className="h-11 rounded-xl border-primary/12 bg-background/75 px-3.5"
              required
            />
            <FieldError errors={state.fieldErrors?.name} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="email" className="text-primary/90">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="h-11 rounded-xl border-primary/12 bg-background/75 px-3.5"
              required
            />
            <FieldError errors={state.fieldErrors?.email} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="password" className="text-primary/90">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              className="h-11 rounded-xl border-primary/12 bg-background/75 px-3.5"
              required
            />
            <FieldError errors={state.fieldErrors?.password} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="skills" className="text-primary/90">Skills</FormLabel>
            <FormTextarea
              id="skills"
              name="skills"
              placeholder="React, Node.js, SQL"
              className="min-h-28 rounded-2xl border-primary/12 bg-background/75 px-3.5 py-3"
            />
            <FieldError errors={state.fieldErrors?.skills} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="resume" className="text-primary/90">Resume URL</FormLabel>
            <Input
              id="resume"
              name="resume"
              type="url"
              placeholder="https://example.com/resume.pdf"
              className="h-11 rounded-xl border-primary/12 bg-background/75 px-3.5"
            />
            <FieldError errors={state.fieldErrors?.resume} />
          </FormField>

          <FormMessage tone={state.success ? "success" : "error"} className="min-h-5">
            {state.message}
          </FormMessage>

          <FormActions className="gap-4 pt-2">
            <Button type="submit" className="h-11 rounded-xl px-5 sm:min-w-44" disabled={pending}>
              {pending ? "Creating account..." : "Register now"}
            </Button>
            <div className="flex gap-4 text-sm font-medium">
              <Link
                href="/login"
                className="text-primary underline-offset-4 transition-colors hover:text-secondary-foreground hover:underline"
              >
                Already have an account?
              </Link>
            </div>
          </FormActions>
        </Form>
      </CardContent>
    </Card>
  )
}
