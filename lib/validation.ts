import { z } from "zod"

import { isSafeExternalUrl } from "@/lib/security"

export const candidateNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters.")
  .max(100, "Name must be 100 characters or fewer.")

export const emailSchema = z
  .email("Enter a valid email address.")
  .transform((value) => value.toLowerCase())

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .max(128, "Password must be 128 characters or fewer.")

export const skillsSchema = z
  .string()
  .trim()
  .min(2, "Skills must be at least 2 characters.")
  .max(2000, "Skills must be 2000 characters or fewer.")

export const optionalSkillsSchema = z
  .string()
  .trim()
  .max(2000, "Skills must be 2000 characters or fewer.")
  .optional()

export const resumeUrlSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || isSafeExternalUrl(value),
    "Resume must be a valid public http(s) URL."
  )

export const jobTitleSchema = z
  .string()
  .trim()
  .min(2, "Title must be at least 2 characters.")
  .max(120, "Title must be 120 characters or fewer.")

export const companySchema = z
  .string()
  .trim()
  .min(2, "Company must be at least 2 characters.")
  .max(120, "Company must be 120 characters or fewer.")

export const jobDescriptionSchema = z
  .string()
  .trim()
  .min(20, "Description must be at least 20 characters.")
  .max(5000, "Description must be 5000 characters or fewer.")
