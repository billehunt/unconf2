import { Calendar, Vote, Lightbulb, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { AuthDebug } from '@/components/auth-debug';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20">
      {/* Auth Demo Section - Collapsed by default */}
      <div className="mb-12">
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-center py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Authentication Demo (Click to expand)</span>
              <ArrowRight className="h-4 w-4 ml-2 group-open:rotate-90 transition-transform" />
            </div>
          </summary>
          <div className="pt-4">
            <AuthDebug />
          </div>
        </details>
      </div>

      {/* Hero Section */}
      <div className="py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Modern Unconference Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Unconf2
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              The modern way to organize and manage unconference events. Empower
              your community with AI-powered scheduling and real-time collaboration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
              Start Your Event
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
              Join an Event
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Everything you need for successful unconferences
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              From idea submission to final notes, streamline your entire event workflow with our comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Event Management Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Event Setup
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Create events with custom rooms, time blocks, and attendee management in minutes.
                </p>
              </div>
            </div>

            {/* Voting Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Vote className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Real-time Voting
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Let attendees vote on topics with live updates and democratic session selection.
                </p>
              </div>
            </div>

            {/* AI Scheduling Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  AI Scheduling
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Smart algorithm optimally assigns sessions to rooms and time slots automatically.
                </p>
              </div>
            </div>

            {/* Collaboration Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Live Notes
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Collaborative note-taking with Markdown support and real-time synchronization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Development Pages Navigation */}
      <div className="py-16 bg-slate-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Development Pages</h3>
            <p className="text-slate-600 dark:text-slate-300">Quick access to setup and testing pages for developers</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/setup" 
              className="group bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-xl px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all duration-200 flex items-center gap-3 hover:border-blue-300 dark:hover:border-blue-500"
            >
              📋 <span>Setup & Testing</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="/showcase" 
              className="group bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-xl px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all duration-200 flex items-center gap-3 hover:border-purple-300 dark:hover:border-purple-500"
            >
              🎨 <span>Component Showcase</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="/api/test-prisma" 
              className="group bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-xl px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all duration-200 flex items-center gap-3 hover:border-green-300 dark:hover:border-green-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔌 <span>Database Test</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] opacity-20"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to transform your events?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join the growing community of organizers who trust Unconf2 for their unconference events.
              </p>
              <button className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
