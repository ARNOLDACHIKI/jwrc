"use client"

import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Calendar, User, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "The Power of Prayer in Daily Life",
    author: "Pastor James",
    date: "Nov 5, 2024",
    category: "Spiritual Growth",
    excerpt: "Discover how prayer can transform your daily life and deepen your connection with God.",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Building a Strong Marriage in Christ",
    author: "Pastor Sarah",
    date: "Nov 1, 2024",
    category: "Family",
    excerpt: "Biblical principles for strengthening your marriage and creating a Christ-centered home.",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Serving Others: The Heart of Discipleship",
    author: "Pastor Michael",
    date: "Oct 28, 2024",
    category: "Service",
    excerpt: "Learn how serving others is central to following Jesus and living out your faith.",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Finding Peace in Uncertain Times",
    author: "Pastor James",
    date: "Oct 25, 2024",
    category: "Faith",
    excerpt: "God promises peace that surpasses all understanding. Discover where to find it.",
    readTime: "5 min read",
  },
  {
    id: 5,
    title: "Youth: Your Faith Journey Matters",
    author: "Youth Director",
    date: "Oct 22, 2024",
    category: "Youth",
    excerpt: "Empowering young people to take ownership of their spiritual journey.",
    readTime: "4 min read",
  },
  {
    id: 6,
    title: "Financial Stewardship & Generosity",
    author: "Deacon Paul",
    date: "Oct 19, 2024",
    category: "Discipleship",
    excerpt: "Biblical wisdom on managing finances and giving generously to God's kingdom.",
    readTime: "8 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Church Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Spiritual insights, teachings, and inspiration for your faith journey
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition group">
              {/* Cover Image */}
              <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{post.title}</h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{post.readTime}</span>
                  <Link href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-700">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
