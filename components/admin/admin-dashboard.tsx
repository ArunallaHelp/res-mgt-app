"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RequestDetailModal } from "./request-detail-modal"
import { signOut } from "@/app/actions/auth"
import type { SupportRequest, RequestStatus, VerificationStatus, PriorityLevel } from "@/lib/types"
import { DISTRICTS } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ManagersList } from "./managers-list"
import { ManagerGroupsList } from "./manager-groups-list"
import { ManagerApplication, ManagerGroup } from "@/lib/types"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchRequestsThunk } from "@/lib/store/thunks/requestThunks"
import { setFilters, resetFilters } from "@/lib/store/slices/uiSlice"

interface AdminDashboardProps {
  userEmail: string
  managers: ManagerApplication[]
  groups: ManagerGroup[]
}

export function AdminDashboard({ userEmail, managers, groups }: AdminDashboardProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Redux state
  const requestsMap = useAppSelector((state) => state.requests?.requests || {})
  const listIds = useAppSelector((state) => state.requests?.listIds || [])
  const loading = useAppSelector((state) => state.requests?.listLoading || false)
  const filters = useAppSelector((state) => state.ui?.filters || {
    district: 'all',
    status: 'all',
    verification: 'all',
    priority: 'all',
    search: '',
  })
  
  // Local state for modal
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null)
  const [activeTab, setActiveTab] = useState("requests")

  // Derived state
  const requests = (listIds || []).map((id) => requestsMap[id]).filter(Boolean) as SupportRequest[]

  const fetchRequests = useCallback(() => {
    dispatch(fetchRequestsThunk())
  }, [dispatch])

  // Fetch on mount and when filters change (except search which is handled by thunk but we might want to debounce)
  // For simplicity, we fetch when any filter changes. The thunk reads the current state.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests()
    }, 300) // Debounce for search
    return () => clearTimeout(timer)
  }, [fetchRequests, filters])

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value }))
  }

  const getStatusBadge = (status: RequestStatus) => {
    const variants: Record<RequestStatus, "default" | "secondary" | "outline"> = {
      new: "default",
      in_progress: "secondary",
      completed: "outline",
    }
    const labels: Record<RequestStatus, string> = {
      new: "New",
      in_progress: "In Progress",
      completed: "Completed",
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getVerificationBadge = (status: VerificationStatus) => {
    const colors: Record<VerificationStatus, string> = {
      unverified: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      verified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    }
    const labels: Record<VerificationStatus, string> = {
      unverified: "Unverified",
      pending: "Pending",
      verified: "Verified",
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getPriorityBadge = (priority: PriorityLevel) => {
    const colors: Record<PriorityLevel, string> = {
      low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  // Calculate stats - Note: These stats are based on the *fetched* requests, which might be filtered.
  // Ideally stats should be fetched separately or calculated on the full dataset.
  // For now, we'll calculate based on the current view to match previous behavior if it was client-side filtering.
  // But wait, previous behavior fetched *filtered* data from Supabase.
  // So stats were only for the filtered view?
  // Let's check previous code:
  // `const stats = { total: requests.length, ... }`
  // Yes, it was based on `requests` state which was the result of `fetchRequests`.
  // So this behavior is preserved.
  const stats = {
    total: requests.length,
    new: requests.filter((r) => r.status === "new").length,
    verified: requests.filter((r) => r.verification_status === "verified").length,
    highPriority: requests.filter((r) => r.priority === "high").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Flood Relief Education Support</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
            <TabsTrigger value="groups">Manager Groups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">New Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name, reference, phone, or email..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={filters.district} onValueChange={(val) => handleFilterChange('district', val)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {DISTRICTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filters.status} onValueChange={(val) => handleFilterChange('status', val)}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.verification} onValueChange={(val) => handleFilterChange('verification', val)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Verification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Verification</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.priority} onValueChange={(val) => handleFilterChange('priority', val)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={fetchRequests}>
                      Refresh
                    </Button>
                    <Button variant="ghost" onClick={() => dispatch(resetFilters())}>
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requests Table */}
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading requests...</div>
                ) : requests.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No requests found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reference</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">District</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Grade</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Verification</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Priority</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {requests.map((request) => (
                          <tr key={request.id} className="hover:bg-muted/50">
                            <td className="px-4 py-3 text-sm font-mono">{request.reference_code}</td>
                            <td className="px-4 py-3 text-sm font-medium">{request.name}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{request.district}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{request.grade}</td>
                            <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                            <td className="px-4 py-3">{getVerificationBadge(request.verification_status)}</td>
                            <td className="px-4 py-3">{getPriorityBadge(request.priority)}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {new Date(request.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => router.push(`/admin/requests/${request.id}`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="managers">
            <ManagersList managers={managers} allGroups={groups} />
          </TabsContent>
          
          <TabsContent value="groups">
            <ManagerGroupsList groups={groups} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          userEmail={userEmail}
          onClose={() => setSelectedRequest(null)}
          onUpdate={() => {
            fetchRequests()
            setSelectedRequest(null)
          }}
        />
      )}
    </div>
  )
}
