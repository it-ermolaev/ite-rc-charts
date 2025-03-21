import { useEffect, useRef } from 'react'
import './style.css'

/**
 *  CHART-LIB
 */

type Line = { x1: number; y1: number; x2: number; y2: number }
type Point = { x: number; y: number }

interface ChartOptions {
  padding?: number
  snapping?: number
  axesArrowsWidth?: number
  axesArrowsColor?: string | CanvasPattern
  axesColor?: string | CanvasPattern
  axesLabelsColor?: string | CanvasPattern
  axesLabelsFontFamily?: string
  axesLabelsFontSize?: number
  axesLabelsMargin?: number
  xAxisLabel?: string
  yAxisLabel?: string
  borderLayoutColor?: string | CanvasPattern
  isAxesArrows?: boolean
  isAxesLabels?: boolean
  isBorderLayout?: boolean
}

class CartesianChart {
  private ctx: CanvasRenderingContext2D
  private xAxisRawCoords: Line = { x1: 0, y1: 0, x2: 0, y2: 0 }
  private yAxisRawCoords: Line = { x1: 0, y1: 0, x2: 0, y2: 0 }
  private xAxisCoords: Line = this.xAxisRawCoords
  private yAxisCoords: Line = this.yAxisRawCoords
  private xAxisLabelCoords: Point = { x: 0, y: 0 }
  private yAxisLabelCoords: Point = { x: 0, y: 0 }

  readonly snapping: number
  readonly padding: number
  readonly axesArrowsWidth: number
  readonly axesArrowsColor: string | CanvasPattern
  readonly axesColor: string | CanvasPattern
  readonly axesLabelsColor: string | CanvasPattern
  readonly axesLabelsFontFamily: string
  readonly axesLabelsFontSize: number
  readonly axesLabelsMargin: number
  readonly xAxisLabel: string
  readonly yAxisLabel: string
  readonly borderLayoutColor: string | CanvasPattern
  readonly isAxesArrows: boolean
  readonly isAxesLabels: boolean
  readonly isBorderLayout: boolean

  constructor(ctx: CanvasRenderingContext2D, options: ChartOptions = {}) {
    const {
      padding = 50,
      snapping = 0.5,
      axesArrowsWidth = 3,
      axesArrowsColor = 'black',
      axesColor = 'black',
      axesLabelsColor = 'black',
      axesLabelsFontFamily = 'system-ui',
      axesLabelsFontSize = 14,
      axesLabelsMargin = 10,
      xAxisLabel = 'x',
      yAxisLabel = 'y',
      borderLayoutColor = 'lightblue',
      isAxesArrows = false,
      isAxesLabels = false,
      isBorderLayout = false,
    } = options

    this.ctx = ctx

    this.padding = padding
    this.snapping = snapping
    this.axesArrowsWidth = axesArrowsWidth
    this.axesArrowsColor = axesArrowsColor
    this.axesColor = axesColor
    this.axesLabelsColor = axesLabelsColor
    this.axesLabelsFontFamily = axesLabelsFontFamily
    this.axesLabelsFontSize = axesLabelsFontSize
    this.axesLabelsMargin = axesLabelsMargin
    this.xAxisLabel = xAxisLabel
    this.yAxisLabel = yAxisLabel
    this.borderLayoutColor = borderLayoutColor
    this.isAxesArrows = isAxesArrows
    this.isAxesLabels = isAxesLabels
    this.isBorderLayout = isBorderLayout

    this.initCoords()
  }

  private initCoords() {
    // axes raw coords
    this.xAxisRawCoords = { x1: 0, y1: 0, x2: this.ctx.canvas.width - this.padding * 2, y2: 0 }
    this.yAxisRawCoords = { x1: 0, y1: 0, x2: 0, y2: this.ctx.canvas.height - this.padding * 2 }

    // axes mutable coords
    this.xAxisCoords = { ...this.xAxisRawCoords }
    this.yAxisCoords = { ...this.yAxisRawCoords }

    if (this.isAxesLabels) {
      this.ctx.save()

      this.ctx.font = `${this.axesLabelsFontSize}px ${this.axesLabelsFontFamily}`
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'

      const xAxisLabelMeasure = this.ctx.measureText(this.xAxisLabel)
      const yAxisLabelMeasure = this.ctx.measureText(this.yAxisLabel)

      this.ctx.restore()

      //axes-labels-coords
      this.xAxisLabelCoords = {
        x: this.xAxisRawCoords.x2 - xAxisLabelMeasure.width / 2,
        y: -this.xAxisRawCoords.y2,
      }
      this.yAxisLabelCoords = {
        x: this.yAxisRawCoords.x2,
        y: -this.yAxisRawCoords.y2 + yAxisLabelMeasure.actualBoundingBoxAscent,
      }

      // axes-offseted-coords
      const xAxisOffset = xAxisLabelMeasure.width + this.axesLabelsMargin
      const yAxisOffset =
        yAxisLabelMeasure.actualBoundingBoxAscent +
        yAxisLabelMeasure.actualBoundingBoxDescent +
        this.axesLabelsMargin

      this.xAxisCoords.x2 = this.xAxisRawCoords.x2 - xAxisOffset
      this.yAxisCoords.y2 = this.yAxisRawCoords.y2 - yAxisOffset
    }
  }

  private drawBorderLayout() {
    this.ctx.beginPath()
    this.ctx.strokeStyle = this.borderLayoutColor

    this.ctx.moveTo(this.padding - this.snapping, 0)
    this.ctx.lineTo(this.padding - this.snapping, this.ctx.canvas.height)
    this.ctx.moveTo(this.ctx.canvas.width - this.padding - this.snapping, 0)
    this.ctx.lineTo(this.ctx.canvas.width - this.padding - this.snapping, this.ctx.canvas.height)
    this.ctx.moveTo(0, this.padding - this.snapping)
    this.ctx.lineTo(this.ctx.canvas.width, this.padding - this.snapping)
    this.ctx.moveTo(0, this.ctx.canvas.height - this.padding - this.snapping)
    this.ctx.lineTo(this.ctx.canvas.width, this.ctx.canvas.height - this.padding - this.snapping)

    this.ctx.stroke()
  }

  private drawAxesArrows() {
    this.ctx.beginPath()
    this.ctx.strokeStyle = this.axesArrowsColor

    // x-axis-arrow
    this.ctx.moveTo(this.xAxisCoords.x2, this.xAxisCoords.y2)
    this.ctx.lineTo(
      this.xAxisCoords.x2 - this.axesArrowsWidth,
      this.xAxisCoords.y2 + this.axesArrowsWidth,
    )
    this.ctx.moveTo(this.xAxisCoords.x2, this.xAxisCoords.y2)
    this.ctx.lineTo(
      this.xAxisCoords.x2 - this.axesArrowsWidth,
      this.xAxisCoords.y2 - this.axesArrowsWidth,
    )

    // y-axis-arrow
    this.ctx.moveTo(this.yAxisCoords.x2, this.yAxisCoords.y2)
    this.ctx.lineTo(
      this.yAxisCoords.x2 + this.axesArrowsWidth,
      this.yAxisCoords.y2 - this.axesArrowsWidth,
    )
    this.ctx.moveTo(this.yAxisCoords.x2, this.yAxisCoords.y2)
    this.ctx.lineTo(
      this.yAxisCoords.x2 - this.axesArrowsWidth,
      this.yAxisCoords.y2 - this.axesArrowsWidth,
    )

    this.ctx.stroke()
  }

  private drawAxesLabels() {
    this.ctx.save()
    this.ctx.scale(1, -1)

    this.ctx.font = `${this.axesLabelsFontSize}px ${this.axesLabelsFontFamily}`
    this.ctx.fillStyle = this.axesLabelsColor
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    this.ctx.fillText(this.xAxisLabel, this.xAxisLabelCoords.x, this.xAxisLabelCoords.y)
    this.ctx.fillText(this.yAxisLabel, this.yAxisLabelCoords.x, this.yAxisLabelCoords.y)

    this.ctx.restore()
  }

  private drawAxes() {
    this.ctx.beginPath()
    this.ctx.strokeStyle = this.axesColor

    // x-axis
    this.ctx.moveTo(this.xAxisCoords.x1, this.xAxisCoords.y1)
    this.ctx.lineTo(this.xAxisCoords.x2, this.xAxisCoords.y2)

    // y-axis
    this.ctx.moveTo(this.yAxisCoords.x1, this.yAxisCoords.y1)
    this.ctx.lineTo(this.yAxisCoords.x2, this.yAxisCoords.y2)

    this.ctx.stroke()
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    if (this.isBorderLayout) {
      this.drawBorderLayout()
    }

    this.ctx.save()
    this.ctx.translate(
      this.padding - this.snapping,
      this.ctx.canvas.height - this.padding - this.snapping,
    )
    this.ctx.scale(1, -1)

    this.drawAxes()

    if (this.isAxesArrows) {
      this.drawAxesArrows()
    }

    if (this.isAxesLabels) {
      this.drawAxesLabels()
    }

    this.ctx.restore()
  }
}

/**
 *  LINE-CHART COMPONENT
 */

export default function LineChart() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current

    if (canvas) {
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const lineChart = new CartesianChart(ctx, {
          isAxesArrows: true,
          isAxesLabels: true,
          isBorderLayout: true,
        })

        lineChart.draw()

        console.log(lineChart)
      }
    }
  }, [])

  return (
    <canvas className="line-chart" ref={ref} width={800} height={400}>
      Your browser does not support the HTML canvas tag
    </canvas>
  )
}
