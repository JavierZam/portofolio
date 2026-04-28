import { useEffect, useRef, useState, useCallback } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function useYouTubePlayer(containerId: string) {
  const playerRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const timeIntervalRef = useRef<number | null>(null)

  // Load YouTube IFrame API script
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      return // Already loaded
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  }, [])

  const loadVideo = useCallback((videoId: string) => {
    // Destroy previous player
    if (playerRef.current) {
      playerRef.current.destroy()
      playerRef.current = null
      setIsReady(false)
    }

    const createPlayer = () => {
      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration())
            setIsReady(true)
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
              // Start tracking time
              timeIntervalRef.current = window.setInterval(() => {
                if (playerRef.current) {
                  setCurrentTime(playerRef.current.getCurrentTime())
                }
              }, 50) // 20fps tracking for precision
            } else {
              setIsPlaying(false)
              if (timeIntervalRef.current) {
                clearInterval(timeIntervalRef.current)
              }
            }
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      window.onYouTubeIframeAPIReady = createPlayer
    }
  }, [containerId])

  const play = useCallback(() => {
    playerRef.current?.playVideo()
  }, [])

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo()
  }, [])

  const stop = useCallback(() => {
    playerRef.current?.stopVideo()
    setCurrentTime(0)
  }, [])

  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current)
      if (playerRef.current) playerRef.current.destroy()
    }
  }, [])

  return { loadVideo, play, pause, stop, isReady, isPlaying, currentTime, duration }
}
