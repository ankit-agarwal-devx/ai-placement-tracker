import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import React from "react"

import CandidateEditorForm from "@/app/components/CandidateEditorForm"
import { initialCandidateFormState } from "@/app/candidates/candidate-form-state"

const createCandidateProfile = jest.fn()
const updateCandidateProfile = jest.fn()
const useActionStateMock = jest.fn()

jest.mock("next/link", () => {
  return function Link({
    children,
    href,
    ...props
  }: React.ComponentProps<"a"> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

jest.mock("react", () => {
  const actual = jest.requireActual("react") as typeof React

  return {
    ...actual,
    useActionState: (...args: unknown[]) => useActionStateMock(...args),
  }
})

jest.mock("@/app/candidates/actions", () => ({
  createCandidateProfile: (...args: unknown[]) => createCandidateProfile(...args),
  updateCandidateProfile: (...args: unknown[]) => updateCandidateProfile(...args),
}))

describe("CandidateEditorForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useActionStateMock.mockReturnValue([
      initialCandidateFormState,
      jest.fn(),
      false,
    ])
  })

  it("renders the create flow with admin-specific copy", () => {
    render(<CandidateEditorForm mode="create" role="ADMIN" />)

    expect(screen.getByText("Create candidate account")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Admins create both the user account and the connected candidate profile here."
      )
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeRequired()
    expect(
      screen.getByRole("button", { name: "Create candidate" })
    ).toBeEnabled()
    expect(useActionStateMock).toHaveBeenCalledWith(
      expect.any(Function),
      initialCandidateFormState
    )
  })

  it("has no detectable accessibility violations in the create flow", async () => {
    const { container } = render(<CandidateEditorForm mode="create" role="ADMIN" />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("renders the edit flow with current values, validation feedback, and pending state", () => {
    useActionStateMock.mockReturnValueOnce([
      {
        message: "Please fix the highlighted fields.",
        fieldErrors: {
          email: ["This email is already in use."],
        },
      },
      jest.fn(),
      true,
    ])

    render(
      <CandidateEditorForm
        candidate={{
          id: "candidate-1",
          name: "Asha Sharma",
          email: "asha@example.com",
          skills: "React, TypeScript",
          resume: "https://example.com/resume.pdf",
        }}
        mode="edit"
        role="STUDENT"
      />
    )

    expect(screen.getByText("Edit candidate profile")).toBeInTheDocument()
    expect(
      screen.getByText("Update your candidate profile details used across applications.")
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue("Asha Sharma")).toBeInTheDocument()
    expect(screen.getByDisplayValue("asha@example.com")).toBeInTheDocument()
    expect(screen.getByDisplayValue("React, TypeScript")).toBeInTheDocument()
    expect(
      screen.getByDisplayValue("https://example.com/resume.pdf")
    ).toBeInTheDocument()
    expect(screen.getByLabelText("New password")).not.toBeRequired()
    expect(screen.getByText("This email is already in use.")).toBeInTheDocument()
    expect(screen.getByText("Please fix the highlighted fields.")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-describedby",
      "candidate-email-error"
    )
    expect(screen.getByText("This email is already in use.")).toHaveAttribute(
      "role",
      "alert"
    )
    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled()
  })
})
