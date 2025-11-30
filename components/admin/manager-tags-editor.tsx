"use client"

import { useState } from "react"
import { ManagerApplication } from "@/lib/types"
import { updateManagerTags } from "@/app/actions/managers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"

interface ManagerTagsEditorProps {
  manager: ManagerApplication
}

export function ManagerTagsEditor({ manager }: ManagerTagsEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTag = async () => {
    if (!newTag.trim()) return
    const currentTags = manager.tags || []
    if (currentTags.includes(newTag.trim())) {
        toast.error("Tag already exists")
        return
    }
    
    setIsLoading(true)
    try {
        const updatedTags = [...currentTags, newTag.trim()]
        await updateManagerTags(manager.id, updatedTags)
        setNewTag("")
        toast.success("Tag added")
    } catch (error) {
        toast.error("Failed to add tag")
    } finally {
        setIsLoading(false)
    }
  }

  const handleRemoveTag = async (tagToRemove: string) => {
    setIsLoading(true)
    try {
        const currentTags = manager.tags || []
        const updatedTags = currentTags.filter(t => t !== tagToRemove)
        await updateManagerTags(manager.id, updatedTags)
        toast.success("Tag removed")
    } catch (error) {
        toast.error("Failed to remove tag")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {manager.tags?.map(tag => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
          {tag}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => handleRemoveTag(tag)}
          />
        </Badge>
      ))}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
            <Plus className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-2">
          <div className="flex gap-2">
            <Input 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag..."
              className="h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleAddTag()
                }
              }}
            />
            <Button size="sm" className="h-8" onClick={handleAddTag} disabled={isLoading}>
              Add
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
