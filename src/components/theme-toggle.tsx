"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <>
        <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
            System
        </DropdownMenuItem>
    </>
  )
}
