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
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <div className="h-3 w-3 rounded-sm bg-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Unconf2</span>
                <span className="text-xs text-muted-foreground -mt-1">Unconference Platform</span>
              </div>
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
            <div className="flex items-center space-x-3">
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