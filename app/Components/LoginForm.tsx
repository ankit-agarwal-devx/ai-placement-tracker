"use client"

import Link from "next/link"
import { useActionState } from "react"

import { loginUser } from "@/app/login/actions"
import { initialLoginState } from "@/app/login/login-form-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
        <form action={formAction} className="space-y-5">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-primary">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium text-primary">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
            <FieldError errors={state.fieldErrors?.password} />
          </div>

          <p aria-live="polite" className="text-sm text-destructive">
            {state.message}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" className="sm:min-w-40" disabled={pending}>
              {pending ? "Signing in..." : "Login"}
            </Button>
            <Link
              href="/register"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null
  }

  return <p className="text-sm text-destructive">{errors[0]}</p>
}
