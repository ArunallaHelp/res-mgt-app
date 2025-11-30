"use client"

import { useState } from "react"
import { ManagerApplication, ManagerGroup } from "@/lib/types"
import { ManagerTagsEditor } from "./manager-tags-editor"
import { ManagerGroupsEditor } from "./manager-groups-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ManagersListProps {
  managers: ManagerApplication[]
  allGroups: ManagerGroup[]
}

export function ManagersList({ managers, allGroups }: ManagersListProps) {
  const [search, setSearch] = useState("")

  const filteredManagers = managers.filter(m => 
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Managers</h2>
            <div className="w-64">
                <Input 
                    placeholder="Search managers..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">District</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">Tags</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">Groups</th>
                                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredManagers.map(manager => (
                                <tr key={manager.id} className="hover:bg-muted/50">
                                    <td className="p-3 font-medium">{manager.full_name}</td>
                                    <td className="p-3 text-muted-foreground">{manager.email}</td>
                                    <td className="p-3 text-muted-foreground">{manager.district}</td>
                                    <td className="p-3">
                                        <ManagerTagsEditor manager={manager} />
                                    </td>
                                    <td className="p-3">
                                        <ManagerGroupsEditor manager={manager} allGroups={allGroups} />
                                    </td>
                                    <td className="p-3">
                                        <Badge variant={manager.verification_status === 'verified' ? 'default' : 'secondary'}>
                                            {manager.verification_status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            {filteredManagers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        No managers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
