"use client"

import { useState } from "react"
import { useUserDetails } from "@/lib/cache"
import { Filter } from "lucide-react"

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  earnedAt: string
}

interface User {
  id: string
  name: string
  points: number
  issues_reported: number
  badges: Badge[]
  rank: number
}

interface Issue {
  id: string
  status: string
  mla: {
    id: string
    name: string
    party: string
  }
}

const allBadges = [
  { id: "b1", name: "First Report", icon: "🎯", description: "Report your first issue", requirement: "1 report" },
  { id: "b2", name: "Issue Master", icon: "⭐", description: "Report 10+ civic issues", requirement: "10 reports" },
  { id: "b3", name: "Community Hero", icon: "🦸", description: "Report 50+ civic issues", requirement: "50 reports" },
  {
    id: "b4",
    name: "Quick Response",
    icon: "⚡",
    description: "Report resolved within 24h",
    requirement: "5 resolved",
  },
  {
    id: "b5",
    name: "Accuracy Star",
    icon: "🎖️",
    description: "All reports verified correct",
    requirement: "100% verified",
  },
  {
    id: "b6",
    name: "Consistency King",
    icon: "📈",
    description: "Report every week for month",
    requirement: "4 weeks",
  },
]

export default function Leaderboard() {
  const [filterStatus, setFilterStatus] = useState<"RESOLVED" | "IN_PROGRESS" | "PENDING" | "ALL">("ALL")
  const email = localStorage.getItem("email");

  const { data: citizen, isLoading, error } = useUserDetails(email!);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error || !citizen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">Error loading leaderboard</p>
          <p className="text-muted-foreground text-sm">{error?.message || "No data found"}</p>
        </div>
      </div>
    )
  }

  // Group issues by MLA and calculate their stats
  const mlaStats = citizen.issues.reduce(
    (acc, issue) => {
      if (!issue.mla) return acc

      const mlaId = issue.mla.id
      if (!acc[mlaId]) {
        acc[mlaId] = {
          mla: issue.mla,
          total: 0,
          resolved: 0,
          inProgress: 0,
          pending: 0,
        }
      }

      acc[mlaId].total++
      if (issue.status === "RESOLVED") acc[mlaId].resolved++
      else if (issue.status === "IN_PROGRESS") acc[mlaId].inProgress++
      else if (issue.status === "PENDING") acc[mlaId].pending++

      return acc
    },
    {} as Record<
      string,
      {
        mla: (typeof citizen.issues)[0]["mla"]
        total: number
        resolved: number
        inProgress: number
        pending: number
      }
    >,
  )

  // Convert to array and sort by resolved count
  const leaderboard = Object.values(mlaStats)
    .sort((a, b) => b.resolved - a.resolved)
    .map((item, idx) => ({ ...item, rank: idx + 1 }))

  // Filter based on status
  const filteredLeaderboard =
    filterStatus === "ALL"
      ? leaderboard
      : leaderboard.filter((item) => {
          if (filterStatus === "RESOLVED") return item.resolved > 0
          if (filterStatus === "IN_PROGRESS") return item.inProgress > 0
          if (filterStatus === "PENDING") return item.pending > 0
          return true
        })

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">MLA Leaderboard</h1>
            <p className="text-muted-foreground">MLAs ranked by issues resolved</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === "ALL" ? "bg-blue-500 text-white" : "bg-card border border-border hover:bg-muted"
              }`}
            >
              <Filter className="inline mr-2" size={16} />
              All
            </button>
            <button
              onClick={() => setFilterStatus("RESOLVED")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === "RESOLVED" ? "bg-green-500 text-white" : "bg-card border border-border hover:bg-muted"
              }`}
            >
              Fixed
            </button>
            <button
              onClick={() => setFilterStatus("IN_PROGRESS")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === "IN_PROGRESS"
                  ? "bg-yellow-500 text-white"
                  : "bg-card border border-border hover:bg-muted"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus("PENDING")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === "PENDING" ? "bg-orange-500 text-white" : "bg-card border border-border hover:bg-muted"
              }`}
            >
              Pending
            </button>
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-3">
            {filteredLeaderboard.map((item) => (
              <div key={item.mla!.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        item.rank === 1
                          ? "bg-yellow-500"
                          : item.rank === 2
                            ? "bg-gray-400"
                            : item.rank === 3
                              ? "bg-orange-600"
                              : "bg-blue-500"
                      }`}
                    >
                      {item.rank}
                    </div>

                    {/* MLA Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.mla!.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.mla!.party}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8 text-right">
                    <div>
                      <p className="text-2xl font-bold text-green-500">{item.resolved}</p>
                      <p className="text-xs text-muted-foreground">Fixed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-500">{item.inProgress}</p>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-500">{item.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-500">{item.total}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No MLAs found for this filter</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
