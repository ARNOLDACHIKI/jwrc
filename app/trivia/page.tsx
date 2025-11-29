"use client"

import { useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Trophy, Clock, Users } from "lucide-react"

const questions = [
  {
    id: 1,
    question: "How many books are in the Bible?",
    options: ["60", "66", "72", "80"],
    correct: 1,
    scripture: "The Bible contains 66 books.",
  },
  {
    id: 2,
    question: "Who was the first apostle to be martyred?",
    options: ["Peter", "James", "Stephen", "John"],
    correct: 1,
    scripture: "James was killed by Herod (Acts 12:2).",
  },
  {
    id: 3,
    question: "How many times did Jesus rise Lazarus?",
    options: ["Once", "Twice", "Three times", "Four times"],
    correct: 0,
    scripture: "Jesus raised Lazarus once (John 11).",
  },
  {
    id: 4,
    question: "Which book is the longest in the Bible?",
    options: ["Genesis", "Psalms", "Matthew", "Isaiah"],
    correct: 1,
    scripture: "Psalms is the longest book with 150 chapters.",
  },
]

export default function TriviaPage() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const handleAnswer = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)

    if (index === questions[currentQuestion].correct) {
      setScore(score + 10)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  const handleRestart = () => {
    setGameStarted(false)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(false)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
        <MainNav />
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4 flex items-center justify-center gap-3">
              <Zap className="w-10 h-10 text-yellow-500" />
              Bible Trivia Quiz
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Test your biblical knowledge with our interactive trivia game
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Clock, label: "Quick Game", desc: "5-10 minutes" },
              { icon: Trophy, label: "Earn Points", desc: "10 points per answer" },
              { icon: Users, label: "Leaderboard", desc: "Compete with others" },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.label}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
                </Card>
              )
            })}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setGameStarted(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold rounded-lg"
            >
              Start Trivia
              <Zap className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const isGameOver = currentQuestion === questions.length - 1 && answered

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <MainNav />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-900 dark:text-white">
              Question {currentQuestion + 1}/{questions.length}
            </span>
            <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{score} pts</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{question.question}</h2>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answered}
                className={`w-full p-4 rounded-lg border-2 transition font-medium text-left ${
                  !answered
                    ? "border-gray-300 dark:border-gray-600 hover:border-blue-500 cursor-pointer"
                    : idx === question.correct
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                      : idx === selectedAnswer
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white opacity-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {answered && (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 mb-8">
              <p className="text-blue-900 dark:text-blue-300">
                <strong>Did you know?</strong> {question.scripture}
              </p>
            </div>
          )}

          {/* Button */}
          {answered && (
            <Button
              onClick={isGameOver ? handleRestart : handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 font-bold"
            >
              {isGameOver ? `Finish - Final Score: ${score}` : "Next Question"}
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}
