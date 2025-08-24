export const seoConfig = {
  title:
    "Trip Expense Manager - Split Travel Costs Easily | Free Group Expense Tracker",
  description:
    "Best trip expense manager for groups. Split travel costs, track shared expenses, and manage group finances effortlessly. Free expense splitting app for friends and family trips.",
  keywords: [
    "trip expense manager",
    "travel expense tracker",
    "group expense splitter",
    "shared expense app",
    "travel cost calculator",
    "expense sharing app",
    "trip budget tracker",
    "group travel expenses",
    "split travel costs",
    "expense splitting calculator",
    "travel finance app",
    "group expense tracking",
    "trip cost sharing",
    "travel budget management",
    "expense manager for trips",
  ],
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.vercel.app",
  siteName: "Trip Expense Manager",
  locale: "en_US",
  type: "website",

  // Social media
  twitter: {
    handle: "@tripexpenseapp",
    site: "@tripexpenseapp",
    cardType: "summary_large_image",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.vercel.app",
    siteName: "Trip Expense Manager",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Trip Expense Manager - Split Travel Costs Easily",
      },
    ],
  },

  // Structured data
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Trip Expense Manager",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.vercel.app",
    logo: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.vercel.app"
    }/logo.png`,
    description:
      "Best trip expense manager for groups. Split travel costs, track shared expenses, and manage group finances effortlessly.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@tripexpensemanager.com",
    },
    sameAs: [
      "https://twitter.com/tripexpenseapp",
      "https://facebook.com/tripexpensemanager",
    ],
  },

  // FAQ Schema
  faqSchema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does the trip expense manager work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our trip expense manager works in 3 simple steps: 1) Create a trip and invite your group, 2) Add expenses as you go, 3) View balances and settle up. The app automatically calculates fair splits and tracks who owes what.",
        },
      },
      {
        "@type": "Question",
        name: "Is the trip expense tracker free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our basic trip expense tracker is completely free. You can create unlimited trips, add unlimited expenses, and invite unlimited group members at no cost.",
        },
      },
      {
        "@type": "Question",
        name: "How do you split expenses fairly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our expense splitting algorithm automatically calculates fair shares based on who participated in each expense. You can split equally or customize splits based on different participation levels.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this for business travel expenses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! Our trip expense manager works great for business travel, team trips, and corporate events. You can export detailed reports for accounting and reimbursement purposes.",
        },
      },
    ],
  },
};
