import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Trip Expense Manager Blog - Travel Tips & Expense Management Guides',
  description: 'Expert tips on managing group travel expenses, splitting costs fairly, and budgeting for trips. Learn from travel finance experts and expense management professionals.',
  keywords: 'travel expense tips, group travel budgeting, expense splitting guide, travel finance blog, trip planning expenses',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Trip Expense Manager Blog - Travel Tips & Expense Management',
    description: 'Expert tips on managing group travel expenses, splitting costs fairly, and budgeting for trips.',
    url: '/blog',
  },
}

const blogPosts = [
  {
    title: "10 Essential Tips for Managing Group Travel Expenses",
    excerpt: "Learn the best practices for tracking and splitting expenses during group trips. From setting budgets to handling unexpected costs.",
    slug: "group-travel-expense-tips",
    date: "2024-01-15",
    category: "Travel Tips"
  },
  {
    title: "How to Split Travel Costs Fairly Among Friends",
    excerpt: "Discover fair methods for dividing trip expenses, handling different budgets, and avoiding money conflicts during group travel.",
    slug: "split-travel-costs-fairly",
    date: "2024-01-10",
    category: "Expense Splitting"
  },
  {
    title: "Budget Planning for Group Trips: A Complete Guide",
    excerpt: "Step-by-step guide to creating realistic budgets for group travel, including accommodation, food, activities, and emergency funds.",
    slug: "group-trip-budget-planning",
    date: "2024-01-05",
    category: "Budget Planning"
  },
  {
    title: "Digital vs Traditional Expense Tracking for Travel",
    excerpt: "Compare modern expense tracking apps with traditional methods. Learn why digital solutions are revolutionizing group travel finance.",
    slug: "digital-vs-traditional-expense-tracking",
    date: "2023-12-28",
    category: "Technology"
  },
  {
    title: "Avoiding Common Mistakes in Group Travel Expenses",
    excerpt: "Learn from common pitfalls in group expense management and discover how to prevent money-related conflicts during trips.",
    slug: "common-group-travel-expense-mistakes",
    date: "2023-12-20",
    category: "Travel Tips"
  },
  {
    title: "The Psychology of Money in Group Travel",
    excerpt: "Understanding how different attitudes toward money affect group dynamics and how to navigate financial discussions diplomatically.",
    slug: "psychology-money-group-travel",
    date: "2023-12-15",
    category: "Psychology"
  }
]

export default function BlogPage() {
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
            Travel Expense Management Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert tips, guides, and insights on managing group travel expenses,
            splitting costs fairly, and making the most of your travel budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <time className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary hover:underline font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with Travel Finance Tips</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest tips on managing group travel expenses, budget planning,
            and expense splitting strategies delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
