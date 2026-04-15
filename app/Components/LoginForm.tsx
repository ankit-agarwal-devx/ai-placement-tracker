"use client"

import Link from "next/link"
import { useActionState } from "react"

import { loginUser } from "@/app/login/actions"
import { initialLoginState } from "@/app/login/login-form-state"
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
} from "@/components/Form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginUser, initialLoginState)

  return (
    <Card className="w-full max-w-xl border-primary/15 shadow-lg shadow-primary/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in with the email and password from your candidate account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction}>
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
              placeholder="Enter your password"
              required
            />
            <FieldError errors={state.fieldErrors?.password} />
          </FormField>

          <FormMessage tone="error">{state.message}</FormMessage>

          <FormActions>
            <Button type="submit" className="sm:min-w-40" disabled={pending}>
              {pending ? "Signing in..." : "Login"}
            </Button>
            <Link
              href="/register"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </FormActions>
        </Form>
      </CardContent>
    </Card>
  )
}
