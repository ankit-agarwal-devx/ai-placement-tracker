"use client"

import Link from "next/link"
import { useActionState, useState } from "react"

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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <Card className="w-full max-w-xl border-primary/15 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-card)_92%,white),color-mix(in_oklab,var(--color-accent)_25%,var(--color-card)))] shadow-[0_24px_70px_-32px_color-mix(in_oklab,var(--color-primary)_32%,transparent)]">
      <CardHeader className="space-y-3 border-b border-primary/10 pb-5">
        <div className="inline-flex w-fit rounded-full border border-secondary/20 bg-secondary/12 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-secondary-foreground">
          Member Login
        </div>
        <CardTitle className="text-3xl">Welcome back</CardTitle>
        <CardDescription className="max-w-md text-sm leading-6">
          Sign in with the email and password from your candidate account to resume your workflow instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form action={formAction} className="space-y-6">
          <FormField>
            <FormLabel htmlFor="email" className="text-primary/90">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-11 rounded-xl border-primary/12 bg-background/75 px-3.5"
              required
            />
            <FieldError errors={state.fieldErrors?.password} />
          </FormField>

          <FormMessage tone="error" className="min-h-5">{state.message}</FormMessage>

          <FormActions className="gap-4 pt-2">
            <Button type="submit" className="h-11 rounded-xl px-5 sm:min-w-44" disabled={pending}>
              {pending ? "Signing in..." : "Login"}
            </Button>
            <Link
              href="/register"
              className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-secondary-foreground hover:underline"
            >
              Create an account
            </Link>
          </FormActions>
        </Form>
      </CardContent>
    </Card>
  )
}
