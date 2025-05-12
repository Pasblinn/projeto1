"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface HeatmapCanvasProps {
  scanId: string
  viewMode: string
  zoomLevel: number
}

export function HeatmapCanvas({ scanId, viewMode, zoomLevel }: HeatmapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  // Simulated data for the heatmap
  const heatmapData = {
    width: 800,
    height: 600,
    points: generateHeatmapPoints(),
    accessPoints: [
      { x: 200, y: 150, name: "AP-01", signal: 85 },
      { x: 600, y: 250, name: "AP-02", signal: 90 },
      { x: 400, y: 450, name: "AP-03", signal: 75 },
    ],
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
      drawHeatmap(ctx)
    }, 1000)

    return () => clearTimeout(timer)
  }, [scanId, viewMode, zoomLevel, position])

  function drawHeatmap(ctx: CanvasRenderingContext2D) {
    const canvas = canvasRef.current
    if (!canvas) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom and position
    ctx.save()
    ctx.translate(position.x, position.y)
    ctx.scale(zoomLevel, zoomLevel)

    // Draw floor plan (placeholder)
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 2
    ctx.strokeRect(50, 50, heatmapData.width - 100, heatmapData.height - 100)

    // Draw rooms (placeholder)
    ctx.strokeRect(100, 100, 200, 150)
    ctx.strokeRect(100, 300, 200, 150)
    ctx.strokeRect(350, 100, 300, 150)
    ctx.strokeRect(350, 300, 300, 150)

    // Draw heatmap based on view mode
    if (viewMode === "signal" || viewMode === "coverage") {
      drawSignalHeatmap(ctx)
    } else if (viewMode === "interference") {
      drawInterferenceHeatmap(ctx)
    } else if (viewMode === "channels") {
      drawChannelsHeatmap(ctx)
    }

    // Draw access points
    drawAccessPoints(ctx)

    ctx.restore()
  }

  function drawSignalHeatmap(ctx: CanvasRenderingContext2D) {
    heatmapData.points.forEach((point) => {
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius)

      gradient.addColorStop(0, getSignalColor(point.value, 0.7))
      gradient.addColorStop(1, getSignalColor(point.value, 0))

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  function drawInterferenceHeatmap(ctx: CanvasRenderingContext2D) {
    // Similar to signal heatmap but with different colors
    heatmapData.points.forEach((point) => {
      const interferenceValue = 100 - point.value // Invert signal to get interference

      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius)

      gradient.addColorStop(0, getInterferenceColor(interferenceValue, 0.7))
      gradient.addColorStop(1, getInterferenceColor(interferenceValue, 0))

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  function drawChannelsHeatmap(ctx: CanvasRenderingContext2D) {
    // Simplified channel visualization
    const channels = [1, 6, 11]
    const colors = ["#3b82f6", "#10b981", "#f59e0b"]

    heatmapData.accessPoints.forEach((ap, index) => {
      const channel = channels[index % channels.length]
      const color = colors[index % colors.length]

      const gradient = ctx.createRadialGradient(ap.x, ap.y, 0, ap.x, ap.y, 150)

      gradient.addColorStop(0, `${color}99`)
      gradient.addColorStop(1, `${color}00`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(ap.x, ap.y, 150, 0, Math.PI * 2)
      ctx.fill()

      // Draw channel number
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`CH ${channel}`, ap.x, ap.y + 30)
    })
  }

  function drawAccessPoints(ctx: CanvasRenderingContext2D) {
    heatmapData.accessPoints.forEach((ap) => {
      // Draw AP icon
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(ap.x, ap.y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Draw AP name
      ctx.fillStyle = "#000"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(ap.name, ap.x, ap.y - 15)
    })
  }

  function getSignalColor(value: number, alpha: number) {
    if (value >= 80) {
      return `rgba(16, 185, 129, ${alpha})` // Green
    } else if (value >= 50) {
      return `rgba(245, 158, 11, ${alpha})` // Yellow
    } else {
      return `rgba(239, 68, 68, ${alpha})` // Red
    }
  }

  function getInterferenceColor(value: number, alpha: number) {
    if (value >= 80) {
      return `rgba(239, 68, 68, ${alpha})` // Red
    } else if (value >= 50) {
      return `rgba(245, 158, 11, ${alpha})` // Yellow
    } else {
      return `rgba(16, 185, 129, ${alpha})` // Green
    }
  }

  function generateHeatmapPoints() {
    const points = []
    const numPoints = 50

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * heatmapData.width,
        y: Math.random() * heatmapData.height,
        value: Math.random() * 100,
        radius: 50 + Math.random() * 100,
      })
    }

    return points
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setDragging(true)
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging) return

    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    })
  }

  function handleMouseUp() {
    setDragging(false)
  }

  return (
    <div className="relative w-full h-full">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando mapa de calor...</span>
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        width={heatmapData.width}
        height={heatmapData.height}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}
