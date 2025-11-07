"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/app/_components/navbar"
import { Footer } from "@/app/_components/footer"
import { motion } from "framer-motion"
import { LogOut, BarChart3, AlertCircle, CheckCircle, Clock, MapPin, TrendingUp } from "lucide-react"
import { useUserDetails } from "@/lib/cache/index"
import axios from "axios"

export default function DashboardPage() {
  const router = useRouter()
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const id = typeof window !== "undefined" ? localStorage.getItem("id") : null

  const email = localStorage.getItem("email")

  const { data: user, isLoading, isError } = useUserDetails(email!);

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    localStorage.removeItem("email")
    router.push("/login")
  }

  useEffect(() => {
    if (!token || !id) {
      router.push("/login")
    }
  }, [token, id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark-blue"></div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error fetching user data. Please login again.</p>
      </div>
    )
  }

  const mockStats = [
    { label: "Issues Reported", value: "24", icon: AlertCircle, color: "text-red-500" },
    { label: "Resolved", value: "18", icon: CheckCircle, color: "text-green-500" },
    { label: "In Progress", value: "4", icon: Clock, color: "text-yellow-500" },
    { label: "Impact Score", value: "8.5/10", icon: TrendingUp, color: "text-blue-500" },
  ]

  const mockIssues = [
    { id: 1, title: "Pothole on MG Road", status: "Resolved", date: "2025-01-10", location: "Banjara Hills" },
    { id: 2, title: "Broken streetlight", status: "In Progress", date: "2025-01-15", location: "Jubilee Hills" },
    { id: 3, title: "Water leak near market", status: "Pending", date: "2025-01-18", location: "Banjara Hills" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user.name}! 👋</h1>
              <p className="text-muted-foreground mt-2">Track your civic contributions</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>
          </motion.div>

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Profile Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Constituency</p>
                    <p className="font-semibold">{user.constituency}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Linked MLAs</h3>
                <div className="space-y-3">
                  {user.linked_MLAs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No MLAs linked</p>
                  ) : (
                    user.linked_MLAs.map((mla) => (
                      <div key={mla.id} className="p-2 border border-border rounded-lg">
                        <p className="font-semibold">{mla.name}</p>
                        <p className="text-xs text-muted-foreground">{mla.party}</p>
                        <p className="text-xs text-muted-foreground">{mla.email}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {mockStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <stat.icon className={`${stat.color}`} size={24} />
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-primary-dark-blue" size={24} />
              <h2 className="text-xl font-bold">Your Recent Issues</h2>
            </div>

            <div className="space-y-4">
              {mockIssues.map((issue) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin size={14} />
                        {issue.location}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Reported: {issue.date}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        issue.status === "Resolved"
                          ? "bg-green-500/10 text-green-600"
                          : issue.status === "In Progress"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-gray-500/10 text-gray-600"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-6 py-2 border border-border rounded-lg hover:bg-muted transition font-medium">
              View All Issues
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
