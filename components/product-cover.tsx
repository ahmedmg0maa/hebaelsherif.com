"use client"

import { useMemo, useState } from "react"
import { BookOpen, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type ProductCoverProps = {
  title: string
  imageUrl?: string
  kind?: "book" | "course"
  className?: string
  imageClassName?: string
}

export function ProductCover({ title, imageUrl = "", kind = "book", className, imageClassName }: ProductCoverProps) {
  const [failed, setFailed] = useState(false)
  const canShowImage = Boolean(imageUrl) && !failed

  const Icon = useMemo(() => (kind === "course" ? Sparkles : BookOpen), [kind])

  return (
    <div className={cn("relative overflow-hidden rounded-[1.6rem] bg-[#eee5d8]", className)}>
      {canShowImage ? (
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#f5f0e7] via-[#e6ddcf] to-[#d8ccb8] p-5 text-center">
          <div className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f6173]/12 text-[#2f6173]">
              <Icon className="h-6 w-6" />
            </div>
            <p className="line-clamp-3 text-sm font-bold leading-7 text-[#2f6173]">{title}</p>
          </div>
        </div>
      )}
    </div>
  )
}
