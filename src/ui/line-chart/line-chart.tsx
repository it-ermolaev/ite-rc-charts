import { useEffect, useRef } from 'react'
import './style.css'

const getDistance = (x2: number, x1: number, y2: number, y1: number) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

export default function LineChart() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current

    if (canvas) {
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const idention = 15
        const snapping = 0.5

        // x-axis
        const xAxisStartX = idention
        const xAxisStartY = idention + snapping
        const xAxisEndX = canvas.width - idention
        const xAxisEndY = idention + snapping
        const xAxisLength = getDistance(xAxisEndX, xAxisStartX, xAxisEndY, xAxisStartY)

        // y-axis
        const yAxisStartX = idention + snapping
        const yAxisStartY = idention
        const yAxisEndX = idention + snapping
        const yAxisEndY = canvas.height - idention
        const yAxisLenght = getDistance(yAxisEndX, yAxisStartX, yAxisEndY, yAxisStartY)

        ctx.save()
        ctx.translate(0, canvas.height)
        ctx.scale(1, -1)
        ctx.beginPath()

        ctx.strokeStyle = 'gray'

        ctx.moveTo(xAxisStartX, xAxisStartY)
        ctx.lineTo(xAxisEndX, xAxisEndY)
        ctx.moveTo(yAxisStartX, yAxisStartY)
        ctx.lineTo(yAxisEndX, yAxisEndY)

        console.log(xAxisLength, yAxisLenght)

        ctx.stroke()
        ctx.restore()
      }
    }
  }, [])

  return (
    <canvas className="line-chart" ref={ref} width={400} height={400}>
      Your browser does not support the HTML canvas tag
    </canvas>
  )
}
