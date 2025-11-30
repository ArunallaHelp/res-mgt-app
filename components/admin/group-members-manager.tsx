"use client"

import { useState } from "react"
import { ManagerGroup, ManagerApplication } from "@/lib/types"
import { addManagerToGroup, removeManagerFromGroup } from "@/app/actions/manager-groups"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2, Plus, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface GroupMembersManagerProps {
  group: ManagerGroup
  members: any[] // Using any for now as the join type is complex, ideally should define a type
  allManagers: ManagerApplication[]
}

export function GroupMembersManager({ group, members, allManagers }: GroupMembersManagerProps) {
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const memberIds = new Set(members.map(m => m.manager_id))
  
  const availableManagers = allManagers.filter(m => !memberIds.has(m.id) && (
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  ))

  const handleAddMember = async (managerId: string) => {
    setIsLoading(true)
    try {
        await addManagerToGroup(group.id, managerId)
        toast.success("Manager added to group")
    } catch (error) {
        toast.error("Failed to add manager")
    } finally {
        setIsLoading(false)
    }
  }

  const handleRemoveMember = async (managerId: string) => {
    if (!confirm("Are you sure you want to remove this manager from the group?")) return

    setIsLoading(true)
    try {
        await removeManagerFromGroup(group.id, managerId)
        toast.success("Manager removed from group")
    } catch (error) {
        toast.error("Failed to remove manager")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-muted-foreground">{group.description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Members */}
        <Card>
            <CardHeader>
                <CardTitle>Group Members ({members.length})</CardTitle>
                <CardDescription>Managers currently in this group</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {members.map(member => (
                        <div key={member.manager_id} className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{member.manager.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">{member.manager.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{member.manager.email}</p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveMember(member.manager_id)}
                                disabled={isLoading}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {members.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No members in this group yet.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        {/* Add Members */}
        <Card>
            <CardHeader>
                <CardTitle>Add Members</CardTitle>
                <CardDescription>Search and add managers to this group</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Input 
                        placeholder="Search managers..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {availableManagers.map(manager => (
                            <div key={manager.id} className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{manager.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="truncate">
                                        <p className="text-sm font-medium leading-none truncate">{manager.full_name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-muted-foreground truncate">{manager.email}</p>
                                            {manager.tags?.slice(0, 2).map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-[10px] px-1 h-4">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="secondary"
                                    onClick={() => handleAddMember(manager.id)}
                                    disabled={isLoading}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>
                        ))}
                        {availableManagers.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                {search ? "No matching managers found." : "All managers are already in this group."}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
