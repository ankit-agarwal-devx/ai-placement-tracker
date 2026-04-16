import "server-only"

import { prisma } from "@/lib/prisma"

export async function getServerJobsList() {
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
}

export async function getServerJobDetails(jobId: string) {
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
}

export async function getServerCandidates(role: "ADMIN" | "STUDENT", userId: string) {
  return prisma.candidate.findMany({
    where: role === "ADMIN" ? undefined : { userId },
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
}

export async function getServerApplications(role: "ADMIN" | "STUDENT", userId: string) {
  return prisma.application.findMany({
    where: role === "ADMIN" ? undefined : { userId },
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
}

export async function getServerAdminDashboardData() {
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
}

export async function getServerStudentDashboardData(userId: string) {
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
}
