export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary-50 to-primary-50">
      {/* Hero Section */}
      <div className="container-responsive py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="gradient-primary text-gradient">Unconf2</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
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
      <div className="container-responsive py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need for successful unconferences
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From idea submission to final notes, streamline your entire event
            workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Event Management Card */}
          <div className="card group hover:shadow-glow transition-all duration-300 animate-fade-in">
            <div className="card-header">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-primary-600"
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
              <h3 className="text-xl font-semibold text-foreground">
                Event Setup
              </h3>
            </div>
            <div className="card-content">
              <p className="text-muted-foreground">
                Create events with custom rooms, time blocks, and attendee
                management in minutes.
              </p>
            </div>
          </div>

          {/* Voting Card */}
          <div
            className="card group hover:shadow-glow transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="card-header">
              <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-accent-600"
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
              <h3 className="text-xl font-semibold text-foreground">
                Real-time Voting
              </h3>
            </div>
            <div className="card-content">
              <p className="text-muted-foreground">
                Let attendees vote on topics with live updates and democratic
                session selection.
              </p>
            </div>
          </div>

          {/* AI Scheduling Card */}
          <div
            className="card group hover:shadow-glow-accent transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="card-header">
              <div className="w-12 h-12 rounded-xl bg-success-100 dark:bg-success-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-success-600"
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
              <h3 className="text-xl font-semibold text-foreground">
                AI Scheduling
              </h3>
            </div>
            <div className="card-content">
              <p className="text-muted-foreground">
                Smart algorithm optimally assigns sessions to rooms and time
                slots automatically.
              </p>
            </div>
          </div>

          {/* Collaboration Card */}
          <div
            className="card group hover:shadow-glow transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="card-header">
              <div className="w-12 h-12 rounded-xl bg-warning-100 dark:bg-warning-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-warning-600"
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
              <h3 className="text-xl font-semibold text-foreground">
                Live Notes
              </h3>
            </div>
            <div className="card-content">
              <p className="text-muted-foreground">
                Collaborative note-taking with Markdown support and real-time
                synchronization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Typography Showcase */}
      <div className="container-responsive py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-dark mx-auto">
            <h2>Why Choose Unconf2?</h2>
            <p className="text-balance">
              Traditional conference management tools are rigid and outdated.
              Unconf2 brings the flexibility and innovation that unconferences
              deserve.
            </p>
            <ul>
              <li>
                <strong>Real-time collaboration</strong> keeps everyone engaged
              </li>
              <li>
                <strong>AI-powered features</strong> reduce organizer workload
              </li>
              <li>
                <strong>Mobile-first design</strong> works on any device
              </li>
              <li>
                <strong>Open source transparency</strong> you can trust
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-responsive py-24">
        <div className="card max-w-4xl mx-auto text-center gradient-primary shadow-glow">
          <div className="card-content py-16 px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your events?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join the growing community of organizers who trust Unconf2 for
              their unconference events.
            </p>
            <button className="btn bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 text-lg h-12 font-semibold">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
