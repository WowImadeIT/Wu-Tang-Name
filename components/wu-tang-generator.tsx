"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Facebook, Mail, Instagram, Twitter, Moon, Sun } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function WuTangGenerator() {
  const [name, setName] = useState("")
  const [generatedName, setGeneratedName] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const generateName = async () => {
    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/generate-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate name')
      }

      const data = await response.json()
      setGeneratedName(data.generatedName)
      setShowResult(true)
    } catch (err) {
      setError("Failed to generate name. Please try again.")
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const shareVia = (platform: string) => {
    if (!generatedName) {
      alert("Please generate a Wu-Tang name first!")
      return
    }
    
    const text = `Check out my Wu-Tang Clan name: ${generatedName} 🎵 Generate yours at`
    const url = window.location.href

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`)
        break
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
        )
        break
      case "email":
        window.open(`mailto:?subject=My Wu-Tang Clan Name&body=${encodeURIComponent(`${text}\n\n${url}`)}`)
        break
      case "instagram":
        // For Instagram, we copy to clipboard since direct sharing isn't possible
        navigator.clipboard.writeText(`${text}\n\n${url}`)
        alert("Text copied! You can now paste it in your Instagram story or post.")
        break
      case "x":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${url}`)}`)
        break
    }
  }

  // Don't render theme toggle until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className={`w-full max-w-sm mx-auto rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-stone-800 to-stone-900' 
        : 'bg-gradient-to-b from-gray-100 to-white border border-gray-200'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 flex items-center justify-between transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-stone-700' 
          : 'bg-gray-200'
      }`}>
        <h1 className={`text-lg font-semibold transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Wu-Tang Name Generator
        </h1>
        <Button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          size="icon"
          className={`w-8 h-8 bg-transparent rounded-full transition-colors duration-300 ${
            theme === 'dark' 
              ? 'hover:bg-stone-600/20' 
              : 'hover:bg-gray-300/50'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </Button>
      </div>

      {/* Input Section */}
      <div className="px-6 py-4">
        <Input
          type="text"
          placeholder="Enter your real name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError("")
          }}
          className={`w-full rounded-lg px-4 py-3 text-base transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-stone-600 border-stone-500 text-yellow-200 placeholder:text-yellow-200/60'
              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
          }`}
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {/* Graffiti Background Section */}
      <div className="relative h-48 mx-4 mb-4 rounded-lg overflow-hidden">
        <Image
          src="/graffiti-bg.jpg"
          alt="Wu Tang Graffiti"
          fill
          className="object-cover object-center"
          style={{
            filter: theme === 'dark' ? "brightness(0.7) contrast(1.1)" : "brightness(0.9) contrast(1.2)",
          }}
        />
        <div className={`absolute inset-0 transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/40'
            : 'bg-gradient-to-t from-white/60 via-transparent to-white/30'
        }`}></div>
      </div>

      {/* Generate Button */}
      <div className="px-6 mb-6">
        <Button
          onClick={generateName}
          disabled={isLoading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold py-4 rounded-full text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="mr-2">Generating...</span>
            </>
          ) : (
            "Generate Wu-Tang Name"
          )}
        </Button>
      </div>

      {/* Generated Name */}
      <div className="px-6 mb-6">
        <div className={`w-full rounded-lg p-4 text-center transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-stone-700/50' 
            : 'bg-gray-100 border border-gray-200'
        }`}>
          {showResult ? (
            <p className={`text-xl font-bold transition-colors duration-300 ${
              theme === 'dark' ? 'text-yellow-400' : 'text-amber-600'
            }`}>
              {generatedName}
            </p>
          ) : (
            <p className={`transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-400' : 'text-gray-500'
            }`}>
              Your Wu-Tang name will appear here
            </p>
          )}
        </div>
      </div>

      {/* Share Buttons */}
      <div className="px-6 pb-8">
        <p className={`text-center text-sm mb-4 transition-colors duration-300 ${
          theme === 'dark' ? 'text-stone-400' : 'text-gray-600'
        }`}>
          Share your Wu-Tang name
        </p>
        <div className="grid grid-cols-5 gap-3">
          <div className="flex flex-col items-center">
            <Button
              onClick={() => shareVia("whatsapp")}
              size="icon"
              className={`w-12 h-12 rounded-full transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-stone-700 hover:bg-stone-600 text-stone-300 hover:text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-amber-600'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <span className={`text-xs mt-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-400' : 'text-gray-600'
            }`}>
              WhatsApp
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => shareVia("facebook")}
              size="icon"
              className={`w-12 h-12 rounded-full transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-stone-700 hover:bg-stone-600 text-stone-300 hover:text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-amber-600'
              }`}
            >
              <Facebook className="w-5 h-5" />
            </Button>
            <span className={`text-xs mt-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-400' : 'text-gray-600'
            }`}>
              Facebook
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => shareVia("email")}
              size="icon"
              className={`w-12 h-12 rounded-full transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-stone-700 hover:bg-stone-600 text-stone-300 hover:text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-amber-600'
              }`}
            >
              <Mail className="w-5 h-5" />
            </Button>
            <span className={`text-xs mt-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-400' : 'text-gray-600'
            }`}>
              Email
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => shareVia("instagram")}
              size="icon"
              className={`w-12 h-12 rounded-full transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-stone-700 hover:bg-stone-600 text-stone-300 hover:text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-amber-600'
              }`}
            >
              <Instagram className="w-5 h-5" />
            </Button>
            <span className={`text-xs mt-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-400' : 'text-gray-600'
            }`}>
              Instagram
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button
              onClick={() => shareVia("x")}
              size="icon"
              className={`w-12 h-12 rounded-full transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-stone-700 hover:bg-stone-600 text-stone-300 hover:text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-amber-600'
              }`}
            >
              <Twitter className="w-5 h-5" />
            </Button>
            <span className={`text-xs mt-1 transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-400' : 'text-gray-600'
            }`}>
              X
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 