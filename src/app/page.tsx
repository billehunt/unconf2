export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-primary/5">
      {/* Hero Section */}
      <div className="py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="gradient-primary text-gradient">Unconf2</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              The modern way to organize and manage unconference events. Empower
              your community with AI-powered scheduling and real-time
              collaboration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary px-8 py-3 text-lg h-12">
              Start Your Event
            </button>
            <button className="btn btn-outline px-8 py-3 text-lg h-12">
              Join an Event
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Everything you need for successful unconferences
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            From idea submission to final notes, streamline your entire event
            workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Event Management Card */}
          <div className="card group hover:shadow-glow transition-all duration-300">
            <div className="card-header">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Event Setup
              </h3>
            </div>
            <div className="card-content">
              <p className="text-sm text-muted-foreground">
                Create events with custom rooms, time blocks, and attendee
                management in minutes.
              </p>
            </div>
          </div>

          {/* Voting Card */}
          <div className="card group hover:shadow-glow transition-all duration-300">
            <div className="card-header">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-accent-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3.5M3 16.5v2a2 2 0 002 2h14a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Real-time Voting
              </h3>
            </div>
            <div className="card-content">
              <p className="text-sm text-muted-foreground">
                Let attendees vote on topics with live updates and democratic
                session selection.
              </p>
            </div>
          </div>

          {/* AI Scheduling Card */}
          <div className="card group hover:shadow-glow-accent transition-all duration-300">
            <div className="card-header">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                AI Scheduling
              </h3>
            </div>
            <div className="card-content">
              <p className="text-sm text-muted-foreground">
                Smart algorithm optimally assigns sessions to rooms and time
                slots automatically.
              </p>
            </div>
          </div>

          {/* Collaboration Card */}
          <div className="card group hover:shadow-glow transition-all duration-300">
            <div className="card-header">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Live Notes
              </h3>
            </div>
            <div className="card-content">
              <p className="text-sm text-muted-foreground">
                Collaborative note-taking with Markdown support and real-time
                synchronization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Development Pages Navigation */}
      <div className="py-8 border-t">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Development Pages</h3>
          <p className="text-sm text-muted-foreground">Quick access to setup and testing pages</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="/setup" 
            className="btn btn-outline text-sm px-4 py-2 h-9 hover:bg-accent"
          >
            📋 Setup & Testing
          </a>
          <a 
            href="/showcase" 
            className="btn btn-outline text-sm px-4 py-2 h-9 hover:bg-accent"
          >
            🎨 Component Showcase
          </a>
          <a 
            href="/api/test-prisma" 
            className="btn btn-outline text-sm px-4 py-2 h-9 hover:bg-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔌 Database Test
          </a>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="card max-w-3xl mx-auto text-center gradient-primary shadow-glow">
          <div className="card-content py-12 px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to transform your events?
            </h2>
            <p className="text-lg text-primary-100 mb-6 max-w-xl mx-auto">
              Join the growing community of organizers who trust Unconf2 for
              their unconference events.
            </p>
            <button className="btn bg-white text-primary-600 hover:bg-primary-50 px-6 py-2 text-base h-10 font-semibold">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
