import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Trip Expense Manager Features - Split Costs, Track Budgets, Share Expenses',
  description: 'Discover powerful features of our trip expense manager: automatic expense splitting, real-time budget tracking, group sharing, and detailed expense reports for travel groups.',
  keywords: 'trip expense features, expense splitting calculator, group budget tracker, travel expense sharing, expense report generator',
  alternates: {
    canonical: '/features',
  },
  openGraph: {
    title: 'Trip Expense Manager Features - Split Costs, Track Budgets',
    description: 'Discover powerful features of our trip expense manager: automatic expense splitting, real-time budget tracking, group sharing, and detailed expense reports.',
    url: '/features',
  },
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-serif font-bold">Trip Expense Manager</Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Group Travel Expenses
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to manage, split, and track expenses for your group trips.
            From automatic calculations to detailed reports, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-6 rounded-lg border">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Expense Splitting</h3>
            <p className="text-muted-foreground">
              Automatically calculate fair splits based on who paid and who participated.
              Handle complex scenarios like unequal splits and partial participation.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Budget Tracking</h3>
            <p className="text-muted-foreground">
              Set trip budgets and monitor spending in real-time. Get alerts when approaching
              budget limits and see detailed spending breakdowns by category.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Group Sharing</h3>
            <p className="text-muted-foreground">
              Invite friends with simple share codes. Everyone can add expenses, view balances,
              and stay updated on group spending without creating accounts.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Detailed Expense Reports</h3>
            <p className="text-muted-foreground">
              Generate comprehensive expense reports with breakdowns by person, category,
              and date. Export data for accounting or reimbursement purposes.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Mobile Optimized</h3>
            <p className="text-muted-foreground">
              Add expenses on the go with our mobile-optimized interface.
              Works perfectly on all devices, from smartphones to tablets.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your financial data is encrypted and secure. We never share your information
              and you maintain full control over your expense data.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Managing Your Trip Expenses?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of travelers who trust ourse manager for their group trips.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/signup">Start Free Today</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
