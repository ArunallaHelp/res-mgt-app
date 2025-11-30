"use client"

import { useState } from "react"
import { ManagerGroup } from "@/lib/types"
import { createManagerGroup, deleteManagerGroup } from "@/app/actions/manager-groups"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Users } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ManagerGroupsListProps {
  groups: ManagerGroup[]
}

export function ManagerGroupsList({ groups }: ManagerGroupsListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDesc, setNewGroupDesc] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return
    
    setIsLoading(true)
    try {
        await createManagerGroup(newGroupName, newGroupDesc)
        setNewGroupName("")
        setNewGroupDesc("")
        setIsCreateDialogOpen(false)
        toast.success("Group created")
    } catch (error) {
        toast.error("Failed to create group")
    } finally {
        setIsLoading(false)
    }
  }

  const handleDeleteGroup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return

    try {
        await deleteManagerGroup(id)
        toast.success("Group deleted")
    } catch (error) {
        toast.error("Failed to delete group")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manager Groups</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input 
                  id="name" 
                  value={newGroupName} 
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Science Teachers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                  id="desc" 
                  value={newGroupDesc} 
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup} disabled={isLoading || !newGroupName.trim()}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map(group => (
          <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/admin/managers/groups/${group.id}`)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteGroup(group.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{group.description || "No description"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                <span>View Members</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {groups.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
                No groups found. Create one to get started.
            </div>
        )}
      </div>
    </div>
  )
}
