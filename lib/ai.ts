import "server-only"

import { execFileSync } from "node:child_process"
import { z } from "zod"

type CandidateSource = {
  name: string
  skills: string
  resume: string | null
}

type JobSource = {
  title: string
  company: string
  description: string
}

export type AiInsight = {
  feature:
    | "resume-analysis"
    | "job-match"
    | "application-help"
    | "interview-prep"
    | "skill-roadmap"
  title: string
  intro: string
  score?: number
  generatedText?: string
  sections: Array<{
    heading: string
    items: string[]
  }>
}

export type AdminCandidateAssessment = {
  candidateId: string
  applicationId: string
  candidateName: string
  score: number
  suitable: boolean
  summary: string
  strengths: string[]
  gaps: string[]
}

const adminAssessmentSchema = z.object({
  candidateId: z.string().min(1),
  applicationId: z.string().min(1),
  candidateName: z.string().min(1),
  score: z.number().min(0).max(100),
  suitable: z.boolean(),
  summary: z.string().min(1),
  strengths: z.array(z.string().min(1)).min(1),
  gaps: z.array(z.string().min(1)).min(1),
})

const adminShortlistSchema = z.object({
  jobTitle: z.string().min(1),
  threshold: z.number().min(0).max(100),
  assessments: z.array(adminAssessmentSchema),
})

const aiInsightSchema = z.object({
  feature: z.enum([
    "resume-analysis",
    "job-match",
    "application-help",
    "interview-prep",
    "skill-roadmap",
  ]),
  title: z.string().min(1),
  intro: z.string().min(1),
  score: z.number().min(0).max(100).optional(),
  generatedText: z.string().min(1).optional(),
  sections: z
    .array(
      z.object({
        heading: z.string().min(1),
        items: z.array(z.string().min(1)).min(1),
      })
    )
    .min(1),
})

const normalizedAiInsightSchema = aiInsightSchema.transform((value) => ({
  ...value,
  generatedText:
    typeof value.generatedText === "string" && value.generatedText.trim() === ""
      ? undefined
      : value.generatedText,
}))

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

export function buildResumeAnalysis(
  candidate: CandidateSource,
  options?: {
    resumeText?: string
    targetRole?: string
  }
): AiInsight {
  return generateAiInsight({
    feature: "resume-analysis",
    context: {
      candidate,
      targetRole: options?.targetRole ?? "",
      pastedResumeText: options?.resumeText ?? "",
      instruction:
        "Analyze the candidate's resume and profile. Highlight strengths, missing keywords, and concrete improvement suggestions for job applications.",
    },
  })
}

export function buildJobMatch(
  candidate: CandidateSource,
  job: JobSource
): AiInsight {
  return generateAiInsight({
    feature: "job-match",
    context: {
      candidate,
      job,
      instruction:
        "Evaluate how well the candidate matches the job. Return a realistic score from 0 to 100 and explain matched strengths, missing skills, and fit improvements.",
    },
  })
}

export function buildApplicationHelp(
  candidate: CandidateSource,
  job: JobSource
): AiInsight {
  return generateAiInsight({
    feature: "application-help",
    context: {
      candidate,
      job,
      instruction:
        "Write a short, credible 'Why I'm a fit' draft for this candidate and job. Keep it concise, professional, and easy to personalize.",
    },
  })
}

export function buildInterviewPrep(
  candidate: CandidateSource,
  job: JobSource
): AiInsight {
  return generateAiInsight({
    feature: "interview-prep",
    context: {
      candidate,
      job,
      instruction:
        "Generate likely interview questions and focused preparation advice based on the job requirements and the candidate's visible background.",
    },
  })
}

export function buildSkillRoadmap(
  candidate: CandidateSource,
  options?: {
    targetRole?: string
  }
): AiInsight {
  return generateAiInsight({
    feature: "skill-roadmap",
    context: {
      candidate,
      targetRole: options?.targetRole?.trim() || "the candidate's next target role",
      instruction:
        "Suggest a practical learning roadmap, including what to strengthen, what to learn next, and a short action plan.",
    },
  })
}

export function buildAdminShortlist(input: {
  job: JobSource & { id: string }
  candidates: Array<{
    candidateId: string
    applicationId: string
    candidateName: string
    email: string
    skills: string
    resume: string | null
    currentStatus: string
  }>
}) {
  const raw = callGeminiWithRetry(
    [
      "You are an AI hiring assistant inside a placement tracker app.",
      "Evaluate each candidate for this one job and return only valid JSON.",
      "Use a score from 0 to 100.",
      "Mark suitable=true only when score is strictly greater than 70.",
      "Be practical and conservative. Do not invent missing experience.",
      "Each candidate must be assessed independently.",
      `Context: ${JSON.stringify(input, null, 2)}`,
      JSON.stringify(
        {
          requiredShape: {
            jobTitle: input.job.title,
            threshold: 70,
            assessments: [
              {
                candidateId: "string",
                applicationId: "string",
                candidateName: "string",
                score: "number 0-100",
                suitable: "boolean, true only if score > 70",
                summary: "short hiring summary",
                strengths: ["string", "string"],
                gaps: ["string", "string"],
              },
            ],
          },
        },
        null,
        2
      ),
    ].join("\n\n")
  )

  const parsed = adminShortlistSchema.parse(normalizeAdminShortlist(raw, input.job.title))

  return {
    ...parsed,
    assessments: parsed.assessments.map((assessment) => ({
      ...assessment,
      suitable: assessment.score > 70,
    })),
  }
}

function generateAiInsight(input: {
  feature: AiInsight["feature"]
  context: Record<string, unknown>
}) {
  const raw = callGeminiWithRetry(buildPrompt(input.feature, input.context))
  const parsed = normalizedAiInsightSchema.parse(raw)

  return {
    ...parsed,
    feature: input.feature,
  } satisfies AiInsight
}

function buildPrompt(
  feature: AiInsight["feature"],
  context: Record<string, unknown>
) {
  return [
    "You are an AI career assistant inside a placement tracker app.",
    "Return only valid JSON that matches the provided schema.",
    "Do not wrap JSON in markdown fences.",
    "Be specific, practical, and grounded in the supplied candidate/job data.",
    "Do not invent experience the candidate does not appear to have.",
    "If information is missing, acknowledge that and give the most useful next step.",
    `Feature: ${feature}`,
    `Context: ${JSON.stringify(context, null, 2)}`,
    JSON.stringify(
      {
        requiredShape: {
          feature,
          title: "string",
          intro: "string",
          score: "number from 0 to 100 when feature is job-match, otherwise omit",
          generatedText:
            "string only when feature is application-help, otherwise omit",
          sections: [
            {
              heading: "string",
              items: ["string", "string"],
            },
          ],
        },
      },
      null,
      2
    ),
  ].join("\n\n")
}

function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.")
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: getResponseSchema(),
      temperature: 0.4,
    },
  }

  const workerScript = `
    const [, targetUrl, targetApiKey, payload] = process.argv;
    async function main() {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": targetApiKey,
        },
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(JSON.stringify(data));
        process.exit(1);
      }

      const text = data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text ?? "")
        .join("")
        .trim();

      if (!text) {
        console.error(JSON.stringify(data));
        process.exit(1);
      }

      process.stdout.write(text);
    }

    main().catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
  `

  const stdout = execFileSync(
    process.execPath,
    ["-e", workerScript, url, apiKey, JSON.stringify(requestBody)],
    {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 4,
    }
  ).trim()

  return JSON.parse(stdout)
}

function callGeminiWithRetry(prompt: string) {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return callGemini(prompt)
    } catch (error) {
      const details =
        error instanceof Error ? error.message : "Unknown Gemini request failure."

      const isBusyModel =
        details.includes('"status":"UNAVAILABLE"') ||
        details.includes("high demand") ||
        details.includes("503")

      if (isBusyModel && attempt < maxAttempts) {
        sleep(attempt * 1200)
        continue
      }

      if (isBusyModel) {
        throw new Error(
          "Gemini is temporarily overloaded. Please try again in a moment."
        )
      }

      if (details.includes('"reason":"API_KEY_INVALID"')) {
        throw new Error("Gemini API key is invalid. Please check GEMINI_API_KEY.")
      }

      throw new Error(`Gemini generation failed: ${details}`)
    }
  }

  throw new Error("Gemini generation failed after multiple attempts.")
}

function sleep(ms: number) {
  const end = Date.now() + ms

  while (Date.now() < end) {
    // Busy wait is acceptable here because this file already uses a sync worker process.
  }
}

function getResponseSchema() {
  return {
    type: "object",
    properties: {
      feature: {
        type: "string",
        enum: [
          "resume-analysis",
          "job-match",
          "application-help",
          "interview-prep",
          "skill-roadmap",
        ],
      },
      title: {
        type: "string",
      },
      intro: {
        type: "string",
      },
      score: {
        type: "number",
      },
      generatedText: {
        type: "string",
      },
      sections: {
        type: "array",
        items: {
          type: "object",
          properties: {
            heading: {
              type: "string",
            },
            items: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["heading", "items"],
        },
      },
    },
    required: ["feature", "title", "intro", "sections"],
  }
}

function normalizeAdminShortlist(raw: unknown, jobTitle: string) {
  if (!raw || typeof raw !== "object") {
    return raw
  }

  const candidate = raw as Record<string, unknown>

  if (
    typeof candidate.jobTitle === "string" &&
    typeof candidate.threshold === "number" &&
    Array.isArray(candidate.assessments)
  ) {
    return candidate
  }

  if (
    candidate.result &&
    typeof candidate.result === "object"
  ) {
    const nested = candidate.result as Record<string, unknown>

    if (
      typeof nested.jobTitle === "string" &&
      typeof nested.threshold === "number" &&
      Array.isArray(nested.assessments)
    ) {
      return nested
    }
  }

  if (Array.isArray(candidate.assessments)) {
    return {
      jobTitle,
      threshold: 70,
      assessments: candidate.assessments,
    }
  }

  if (Array.isArray(candidate.candidates)) {
    return {
      jobTitle,
      threshold: 70,
      assessments: candidate.candidates,
    }
  }

  if (Array.isArray(candidate.shortlistedCandidates)) {
    return {
      jobTitle,
      threshold: 70,
      assessments: candidate.shortlistedCandidates,
    }
  }

  return candidate
}
