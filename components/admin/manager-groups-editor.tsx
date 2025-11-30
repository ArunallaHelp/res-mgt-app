"use client"

import { useState } from "react"
import { ManagerApplication, ManagerGroup } from "@/lib/types"
import { addManagerToGroup, removeManagerFromGroup } from "@/app/actions/manager-groups"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { X, Plus, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ManagerGroupsEditorProps {
  manager: ManagerApplication
  allGroups: ManagerGroup[]
}

export function ManagerGroupsEditor({ manager, allGroups }: ManagerGroupsEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentGroupIds = new Set(manager.group_ids || [])
  const currentGroups = allGroups.filter(g => currentGroupIds.has(g.id))

  const handleToggleGroup = async (groupId: string) => {
    setIsLoading(true)
    try {
        if (currentGroupIds.has(groupId)) {
            await removeManagerFromGroup(groupId, manager.id)
            toast.success("Removed from group")
        } else {
            await addManagerToGroup(groupId, manager.id)
            toast.success("Added to group")
        }
        // Keep open to allow multiple selections? Or close?
        // Let's keep it open for better UX if selecting multiple
    } catch (error) {
        toast.error("Failed to update group")
    } finally {
        setIsLoading(false)
    }
  }

  const handleRemoveGroup = async (groupId: string) => {
    setIsLoading(true)
    try {
        await removeManagerFromGroup(groupId, manager.id)
        toast.success("Removed from group")
    } catch (error) {
        toast.error("Failed to remove from group")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {currentGroups.map(group => (
        <Badge key={group.id} variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
          {group.name}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => handleRemoveGroup(group.id)}
          />
        </Badge>
      ))}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
            <Plus className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Select group..." />
            <CommandList>
              <CommandEmpty>No group found.</CommandEmpty>
              <CommandGroup>
                {allGroups.map((group) => (
                  <CommandItem
                    key={group.id}
                    value={group.name}
                    onSelect={() => {
                        handleToggleGroup(group.id)
                    }}
                    disabled={isLoading}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentGroupIds.has(group.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {group.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
