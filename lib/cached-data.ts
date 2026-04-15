import "server-only"

import { unstable_cache } from "next/cache"

import { prisma } from "@/lib/prisma"

const getJobsListCached = unstable_cache(
  async () => {
    return prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
        createdAt: true,
        applications: {
          select: { id: true },
        },
      },
    })
  },
  ["jobs:list"],
  {
    tags: ["jobs", "applications"],
    revalidate: 300,
  }
)

const getJobDetailsCached = unstable_cache(
  async (jobId: string) => {
    return prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
        createdAt: true,
        applications: {
          select: {
            id: true,
            status: true,
            userId: true,
          },
        },
      },
    })
  },
  ["jobs:detail"],
  {
    tags: ["jobs", "applications"],
    revalidate: 300,
  }
)

const getAdminCandidatesCached = unstable_cache(
  async () => {
    return prisma.candidate.findMany({
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
  },
  ["candidates:admin"],
  {
    tags: ["candidates", "applications"],
    revalidate: 300,
  }
)

const getStudentCandidatesCached = unstable_cache(
  async (userId: string) => {
    return prisma.candidate.findMany({
      where: { userId },
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
  },
  ["candidates:student"],
  {
    tags: ["candidates", "applications"],
    revalidate: 300,
  }
)

const getAdminApplicationsCached = unstable_cache(
  async () => {
    return prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        notes: true,
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
        candidate: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
  },
  ["applications:admin"],
  {
    tags: ["applications", "jobs", "candidates"],
    revalidate: 180,
  }
)

const getStudentApplicationsCached = unstable_cache(
  async (userId: string) => {
    return prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
        notes: true,
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
        candidate: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
  },
  ["applications:student"],
  {
    tags: ["applications", "jobs", "candidates"],
    revalidate: 180,
  }
)

const getAdminDashboardCached = unstable_cache(
  async () => {
    const [candidateCount, jobCount, applicationCount, shortlistedCount, recentApplications] =
      await Promise.all([
        prisma.candidate.count(),
        prisma.job.count(),
        prisma.application.count(),
        prisma.application.count({
          where: { status: "SHORTLISTED" },
        }),
        prisma.application.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            status: true,
            createdAt: true,
            candidate: {
              select: {
                name: true,
              },
            },
            job: {
              select: {
                id: true,
                title: true,
                company: true,
              },
            },
          },
        }),
      ])

    return {
      candidateCount,
      jobCount,
      applicationCount,
      shortlistedCount,
      recentApplications,
    }
  },
  ["dashboard:admin"],
  {
    tags: ["dashboard", "jobs", "applications", "candidates"],
    revalidate: 180,
  }
)

const getStudentDashboardCached = unstable_cache(
  async (userId: string) => {
    const [candidateProfile, applications, recentJobs] = await Promise.all([
      prisma.candidate.findUnique({
        where: { userId },
        select: {
          id: true,
          name: true,
          skills: true,
          resume: true,
        },
      }),
      prisma.application.findMany({
        where: { userId },
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
      }),
      prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          title: true,
          company: true,
          description: true,
        },
      }),
    ])

    return {
      candidateProfile,
      applications,
      recentJobs,
    }
  },
  ["dashboard:student"],
  {
    tags: ["dashboard", "jobs", "applications", "candidates"],
    revalidate: 180,
  }
)

export function getCachedJobsList() {
  return getJobsListCached()
}

export function getCachedJobDetails(jobId: string) {
  return getJobDetailsCached(jobId)
}

export function getCachedCandidates(role: "ADMIN" | "STUDENT", userId: string) {
  return role === "ADMIN"
    ? getAdminCandidatesCached()
    : getStudentCandidatesCached(userId)
}

export function getCachedApplications(role: "ADMIN" | "STUDENT", userId: string) {
  return role === "ADMIN"
    ? getAdminApplicationsCached()
    : getStudentApplicationsCached(userId)
}

export function getCachedAdminDashboardData() {
  return getAdminDashboardCached()
}

export function getCachedStudentDashboardData(userId: string) {
  return getStudentDashboardCached(userId)
}
