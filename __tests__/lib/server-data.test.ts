/** @jest-environment node */

jest.mock("@/lib/prisma", () => ({
  prisma: {
    candidate: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    job: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    application: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"
import { getServerCandidates, getServerStudentDashboardData } from "@/lib/server-data"

const mockCandidateFindMany = prisma.candidate.findMany as jest.Mock
const mockCandidateFindUnique = prisma.candidate.findUnique as jest.Mock
const mockApplicationFindMany = prisma.application.findMany as jest.Mock
const mockJobFindMany = prisma.job.findMany as jest.Mock

describe("server-data", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("requests all candidates for admins without a user filter", async () => {
    mockCandidateFindMany.mockResolvedValueOnce([
      { id: "candidate-1", name: "Asha" },
    ])

    const result = await getServerCandidates("ADMIN", "user-1")

    expect(mockCandidateFindMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        skills: true,
        resume: true,
        createdAt: true,
        userId: true,
        applications: {
          select: { id: true },
        },
      },
    })
    expect(result).toEqual([{ id: "candidate-1", name: "Asha" }])
  })

  it("limits student dashboard queries to the current user and returns the combined payload", async () => {
    const candidateProfile = {
      id: "candidate-1",
      name: "Asha",
      skills: "React, Node.js",
      resume: null,
    }
    const applications = [
      {
        id: "application-1",
        status: "APPLIED",
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        job: {
          id: "job-1",
          title: "Frontend Engineer",
          company: "Acme",
        },
      },
    ]
    const recentJobs = [
      {
        id: "job-1",
        title: "Frontend Engineer",
        company: "Acme",
        description: "Build UI",
      },
    ]

    mockCandidateFindUnique.mockResolvedValueOnce(candidateProfile)
    mockApplicationFindMany.mockResolvedValueOnce(applications)
    mockJobFindMany.mockResolvedValueOnce(recentJobs)

    const result = await getServerStudentDashboardData("user-42")

    expect(mockCandidateFindUnique).toHaveBeenCalledWith({
      where: { userId: "user-42" },
      select: {
        id: true,
        name: true,
        skills: true,
        resume: true,
      },
    })
    expect(mockApplicationFindMany).toHaveBeenCalledWith({
      where: { userId: "user-42" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        status: true,
        createdAt: true,
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    })
    expect(mockJobFindMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
      },
    })
    expect(result).toEqual({
      candidateProfile,
      applications,
      recentJobs,
    })
  })
})
