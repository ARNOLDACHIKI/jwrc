"use client"

import { useState } from "react"
import { Bell, BookOpen, Clock, Heart, Share2, Bookmark, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

const bibleReadings = [
  {
    id: 1,
    title: "Romans 12:1-2",
    passage:
      "Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship.",
    chapter: "Romans",
    verses: "12:1-2",
    theme: "Dedication & Sacrifice",
    readTime: "3 min",
    commentary:
      "This passage encourages believers to dedicate their whole selves to God as a living sacrifice, emphasizing the transformation that comes through faith.",
    reflectionQuestions: [
      "What does it mean to offer your body as a living sacrifice?",
      "How can you renew your mind according to this passage?",
      "What practical steps can you take this week to live as a sacrifice?",
    ],
  },
  {
    id: 2,
    title: "Psalm 23",
    passage:
      "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    chapter: "Psalm",
    verses: "23:1-3",
    theme: "God's Care & Protection",
    readTime: "4 min",
    commentary:
      "A beloved Psalm expressing the security and care found in God's guidance, written during times of uncertainty and fear.",
    reflectionQuestions: [
      "In what ways has God acted as a shepherd in your life?",
      "What are the 'quiet waters' and 'green pastures' in your spiritual journey?",
      "How does this Psalm bring you comfort today?",
    ],
  },
  {
    id: 3,
    title: "John 3:16",
    passage:
      "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    chapter: "John",
    verses: "3:16",
    theme: "God's Love & Salvation",
    readTime: "2 min",
    commentary:
      "The most beloved verse in the Bible, encapsulating the core message of Christian faith—God's unconditional love and the offer of salvation.",
    reflectionQuestions: [
      "What does this verse reveal about God's character?",
      "How has God's love changed your life?",
      "How can you share this message of love with others?",
    ],
  },
  {
    id: 4,
    title: "Proverbs 3:5-6",
    passage:
      "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    chapter: "Proverbs",
    verses: "3:5-6",
    theme: "Trust & Guidance",
    readTime: "3 min",
    commentary:
      "Wisdom literature calling believers to place full trust in God's direction rather than relying solely on human reasoning.",
    reflectionQuestions: [
      "What does it mean to trust with all your heart?",
      "When is it hardest for you to trust God?",
      "How can you submit your ways to God this week?",
    ],
  },
  {
    id: 5,
    title: "1 Corinthians 13:4-7",
    passage:
      "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.",
    chapter: "1 Corinthians",
    verses: "13:4-7",
    theme: "Love & Compassion",
    readTime: "4 min",
    commentary:
      "The apostle Paul's definition of love, providing a powerful model for Christian relationships and community life.",
    reflectionQuestions: [
      "Which aspect of love do you need to develop more?",
      "How does this passage challenge your relationships?",
      "What would change if you lived by this definition of love?",
    ],
  },
  {
    id: 6,
    title: "Matthew 6:25-34",
    passage:
      "Therefore I tell you, do not worry about your life, what you will eat or drink; or about your body, what you will wear. Is not life more than clothes, and the body more than clothes?",
    chapter: "Matthew",
    verses: "6:25-34",
    theme: "Faith & Freedom from Worry",
    readTime: "5 min",
    commentary: "Jesus teaches about freedom from anxiety through trust in God's provision and care for our needs.",
    reflectionQuestions: [
      "What worries are you carrying today?",
      "How can you practice trusting God more?",
      "What does 'seek first his kingdom' mean in your daily life?",
    ],
  },
]

export default function BibleReadingPage() {
  const [selectedReading, setSelectedReading] = useState(bibleReadings[0])
  const [remindersEnabled, setRemindersEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState("08:00")
  const [bookmarked, setBookmarked] = useState(false)
  const [liked, setLiked] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-300 mb-2">Bible Reading</h1>
              <p className="text-gray-600 dark:text-gray-400">Daily scripture for spiritual growth and reflection</p>
            </div>
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Bible Study Reminder */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Daily Bible Study Reminder</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Get notified for daily scripture reading</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time:</label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="mt-1 px-3 py-2 border border-blue-200 rounded-lg dark:bg-slate-800 dark:border-blue-700 text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Enable</span>
                  <Switch checked={remindersEnabled} onCheckedChange={setRemindersEnabled} />
                </div>
              </div>
            </div>
            {remindersEnabled && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Daily reminder set for {reminderTime}. You will receive notifications to encourage your Bible study
                  routine.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Daily Reading */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900 overflow-hidden">
              {/* Reading Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedReading.title}</h2>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                        {selectedReading.chapter}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4" />
                        {selectedReading.readTime}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">{selectedReading.theme}</Badge>
                </div>
              </div>

              {/* Reading Content */}
              <div className="p-6 space-y-6">
                {/* Scripture Passage */}
                <div className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed italic">
                    "{selectedReading.passage}"
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">— {selectedReading.verses}</p>
                </div>

                {/* Commentary */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Commentary</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedReading.commentary}</p>
                </div>

                {/* Reflection Questions */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Reflection Questions</h3>
                  <ul className="space-y-2">
                    {selectedReading.reflectionQuestions.map((question, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                        <span className="text-blue-600 font-bold">{idx + 1}.</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => setLiked(!liked)}
                    variant={liked ? "default" : "outline"}
                    className={liked ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                    {liked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    onClick={() => setBookmarked(!bookmarked)}
                    variant={bookmarked ? "default" : "outline"}
                    className={bookmarked ? "bg-amber-600 hover:bg-amber-700" : ""}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
                    {bookmarked ? "Saved" : "Bookmark"}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Readings Sidebar */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Select a Reading</h3>
            <div className="space-y-3">
              {bibleReadings.map((reading) => (
                <button
                  key={reading.id}
                  onClick={() => setSelectedReading(reading)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selectedReading.id === reading.id
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-500"
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
                >
                  <div className="font-semibold text-sm text-gray-800 dark:text-gray-100">{reading.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{reading.theme}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {reading.readTime}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookmarked Readings */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              <Bookmark className="w-6 h-6 inline mr-2 text-amber-600" />
              Your Bookmarked Readings
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bibleReadings.slice(0, 3).map((reading) => (
              <Card
                key={reading.id}
                className="bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900 hover:shadow-lg transition cursor-pointer p-4"
              >
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{reading.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{reading.passage}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{reading.theme}</Badge>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
