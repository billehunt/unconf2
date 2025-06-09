"use client"

import * as React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-responsive">
          <div className="flex h-14 items-center justify-between">
            {/* Logo/Brand placeholder */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary" />
              <span className="text-lg font-semibold">Unconf2</span>
            </div>

            {/* Navigation placeholder */}
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="#" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Events
              </a>
              <a 
                href="#" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Create
              </a>
              <a 
                href="#" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Help
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1">
        <div className="container-responsive py-6">
          {children}
        </div>
      </main>

      {/* Toast region */}
      <Toaster />
    </div>
  )
} 