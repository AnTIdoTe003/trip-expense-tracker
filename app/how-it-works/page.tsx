import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'How Trip Expense Manager Works - Simple 3-Step Process',
  description: 'Learn how to use our trip expense manager in 3 easy steps: Create a trip, add expenses, and split costs automatically. Perfect for group travel expense tracking.',
  keywords: 'how to split trip expenses, group expense tracking tutorial, travel cost sharing guide, expense manager instructions',
  alternates: {
    canonical: '/how-it-works',
  },
  openGraph: {
    title: 'How Trip Expense Manager Works - Simple 3-Step Process',
    description: 'Learn how to use our trip expense manager in 3 easy steps: Create a trip, add expenses, and split costs automatically.',
    url: '/how-it-works',
  },
}

export default function HowItWorksPage() {
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
            How Our Trip Expense Manager Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Managing group travel expenses is simple with our 3-step process.
            From creating trips to settling balances, we make expense sharing effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h2 className="text-3xl font-bold mb-4">Create Your Trip</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Start by creating a new trip and inviting your travel companions.
                  Share a simple code with your group - no complex setup required.
                  Everyone can join instantly and start tracking expenses together.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Set trip name and description
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Generate unique share code
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Invite friends and family
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="font-semibold mb-4">Create New Trip</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Trip Name</label>
                        <div className="bg-gray-100 p-2 rounded text-sm">Weekend in Paris</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Share Code</label>
                        <div className="bg-blue-100 p-2 rounded text-sm font-mono">ABC123</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h2 className="text-3xl font-bold mb-4">Add Expenses as You Go</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Record expenses in real-time during your trip. Add details like amount,
                  description, and who participated. Our system automatically tracks who
                  paid and calculates fair splits for everyone.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Quick expense entry
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Automatic split calculations
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Real-time balance updates
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-8 rounded-lg">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="font-semibold mb-4">Add Expense</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Description</label>
                        <div className="bg-gray-100 p-2 rounded text-sm">Dinner at Restaurant</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Amount</label>
                        <div className="bg-gray-100 p-2 rounded text-sm">$120.00</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Split Between</label>
                        <div className="bg-gray-100 p-2 rounded text-sm">4 people</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h2 className="text-3xl font-bold mb-4">View Balances & Settle Up</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  See exactly who owes what with our clear balance summary.
                  Get detailed expense reports and settle balances easily.
                  Export data for your records or accounting purposes.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Clear balance summaries
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Detailed expense reports
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Easy settlement tracking
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-8 rounded-lg">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h3 className="font-semibold mb-4">Trip Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Expenses</span>
                        <span className="font-semibold">$480.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Your Share</span>
                        <span className="font-semibold">$120.00</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span className="text-sm">You are owed</span>
                        <span className="font-semibold">$30.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Group Expenses?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start using the best trip expense manager today. It's free and takes less than a minute to set up.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/signup">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
