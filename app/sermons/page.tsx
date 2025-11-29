"use client"

import { useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, ThumbsUp } from "lucide-react"

const sermons = [
  {
    id: 1,
    title: "Faith in the Storm",
    speaker: "Pastor James",
    date: "Nov 3, 2024",
    duration: "45 min",
    scripture: "Matthew 8:23-27",
    views: 1243,
    likes: 245,
    description: "Learn how to maintain faith during life's challenges and storms.",
  },
  {
    id: 2,
    title: "God's Faithfulness",
    speaker: "Pastor Sarah",
    date: "Oct 27, 2024",
    duration: "38 min",
    scripture: "Psalm 23",
    views: 892,
    likes: 178,
    description: "Discover the unwavering faithfulness of God in our daily lives.",
  },
  {
    id: 3,
    title: "Building Strong Foundations",
    speaker: "Pastor Michael",
    date: "Oct 20, 2024",
    duration: "42 min",
    scripture: "1 Corinthians 3:11",
    views: 756,
    likes: 134,
    description: "A guide to building your spiritual foundation on the rock.",
  },
  {
    id: 4,
    title: "Love Your Neighbor",
    speaker: "Pastor James",
    date: "Oct 13, 2024",
    duration: "40 min",
    scripture: "Luke 10:25-37",
    views: 645,
    likes: 112,
    description: "Understanding the call to love and serve our neighbors.",
  },
]

export default function SermonsPage() {
  const [selectedSermon, setSelectedSermon] = useState(sermons[0])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSermons = sermons.filter(
    (sermon) =>
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Sermons & Preachings</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Watch inspiring sermons from our church leaders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Video Player */}
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 cursor-pointer transition">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold">Play Video</p>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-3">{selectedSermon.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedSermon.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">SPEAKER</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedSermon.speaker}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">DATE</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedSermon.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">DURATION</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedSermon.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">SCRIPTURE</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedSermon.scripture}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Like ({selectedSermon.likes})
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sermon List */}
          <div>
            {/* Search */}
            <div className="mb-6">
              <input
                type="search"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
              />
            </div>

            {/* List */}
            <div className="space-y-4">
              {filteredSermons.map((sermon) => (
                <Card
                  key={sermon.id}
                  onClick={() => setSelectedSermon(sermon)}
                  className={`p-4 cursor-pointer transition ${
                    selectedSermon.id === sermon.id
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:shadow-lg"
                  }`}
                >
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{sermon.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{sermon.speaker}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{sermon.date}</span>
                    <span>{sermon.views} views</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
