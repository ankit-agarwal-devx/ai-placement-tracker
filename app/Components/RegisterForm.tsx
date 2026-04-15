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
    <Card className="w-full max-w-xl border-primary/15 shadow-lg shadow-primary/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Create your candidate account</CardTitle>
        <CardDescription>
          Every new account is registered as a candidate and gets a connected
          candidate profile automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction}>
          <FormField>
            <FormLabel htmlFor="name">Full name</FormLabel>
            <Input id="name" name="name" placeholder="Ankit Agarwal" required />
            <FieldError errors={state.fieldErrors?.name} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
            <FieldError errors={state.fieldErrors?.email} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              required
            />
            <FieldError errors={state.fieldErrors?.password} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="skills">Skills</FormLabel>
            <FormTextarea
              id="skills"
              name="skills"
              placeholder="React, Node.js, SQL"
            />
            <FieldError errors={state.fieldErrors?.skills} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="resume">Resume URL</FormLabel>
            <Input
              id="resume"
              name="resume"
              type="url"
              placeholder="https://example.com/resume.pdf"
            />
            <FieldError errors={state.fieldErrors?.resume} />
          </FormField>

          <FormMessage tone={state.success ? "success" : "error"}>
            {state.message}
          </FormMessage>

          <FormActions>
            <Button type="submit" className="sm:min-w-40" disabled={pending}>
              {pending ? "Creating account..." : "Register now"}
            </Button>
            <div className="flex gap-4 text-sm font-medium">
              <Link
                href="/login"
                className="text-primary underline-offset-4 hover:underline"
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
