import { useEffect, useRef } from 'react'
import './style.css'

/**
 *  CHART-LIB
 */

type Layout = { x: number; y: number; width: number; height: number }

interface ChartLayout {
  title: Layout
  chart: Layout
}

interface AxesOptions {
  color: string | CanvasPattern
  width: number
}

interface TitleOptions {
  text: string
  display: boolean
  fontSize: number
  align: 'left' | 'center' | 'right'
}

interface LayoutOptions {
  padding: number
  snapping: number
  gap: number
}

interface ChartOptions {
  axes?: Partial<AxesOptions>
  layout?: Partial<LayoutOptions>
  title?: Partial<TitleOptions>
}

class CartesianChart {
  private ctx: CanvasRenderingContext2D
  private chartLayouts: ChartLayout = {
    title: { x: 0, y: 0, width: 0, height: 0 },
    chart: { x: 0, y: 0, width: 0, height: 0 },
  }

  readonly options: {
    axes: Required<AxesOptions>
    layout: Required<LayoutOptions>
    title: Required<TitleOptions>
  }

  constructor(ctx: CanvasRenderingContext2D, options: ChartOptions = {}) {
    this.ctx = ctx

    this.options = {
      axes: {
        color: 'black',
        width: 1,
        ...options.axes,
      },
      layout: {
        gap: 5,
        padding: 35,
        snapping: 0.5,
        ...options.layout,
      },
      title: {
        align: 'left',
        display: false,
        fontSize: 18,
        text: 'Заголовок',
        ...options.title,
      },
    }

    this.initLayout()
  }

  private initLayout = () => {
    const { ctx, chartLayouts, options } = this

    // init title-layout
    if (options.title.display) {
      chartLayouts.title = {
        x: options.layout.padding + options.layout.snapping,
        y: options.layout.padding + options.layout.snapping,
        width: ctx.canvas.width - options.layout.padding * 2,
        height: options.title.fontSize,
      }
    }

    // init chart-layout
    chartLayouts.chart = {
      x: options.layout.padding + options.layout.snapping,
      y:
        chartLayouts.title.height +
        options.layout.padding +
        options.layout.snapping +
        options.layout.gap,
      width: ctx.canvas.width - options.layout.padding * 2,
      height:
        ctx.canvas.height -
        chartLayouts.title.height -
        options.layout.padding * 2 -
        options.layout.gap,
    }
  }

  private drawTitle = () => {
    const { ctx, chartLayouts, options } = this

    ctx.save()
    ctx.translate(chartLayouts.title.x, chartLayouts.title.y)

    ctx.font = `${options.title.fontSize}px Arial`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    const textMeasure = ctx.measureText(options.title.text)
    let titleX = textMeasure.actualBoundingBoxLeft

    switch (options.title.align) {
      case 'center':
        titleX = chartLayouts.title.width / 2
        break
      case 'right':
        titleX = chartLayouts.title.width - textMeasure.actualBoundingBoxRight
        break
    }

    ctx.fillText(options.title.text, titleX, 0)

    ctx.restore()
  }

  private drawBorderLayouts = () => {
    const { ctx, chartLayouts } = this

    ctx.save()

    ctx.strokeStyle = 'lightblue'

    ctx.strokeRect(
      chartLayouts.title.x,
      chartLayouts.title.y,
      chartLayouts.title.width,
      chartLayouts.title.height,
    )
    ctx.strokeRect(
      chartLayouts.chart.x,
      chartLayouts.chart.y,
      chartLayouts.chart.width,
      chartLayouts.chart.height,
    )

    ctx.restore()
  }

  private drawAxes = () => {
    const { ctx, chartLayouts, options } = this

    ctx.save()
    ctx.translate(chartLayouts.chart.x, chartLayouts.chart.y + chartLayouts.chart.height)
    ctx.scale(1, -1)
    ctx.beginPath()

    ctx.strokeStyle = options.axes.color
    ctx.lineWidth = options.axes.width
    ctx.lineCap = 'square'

    const startX = 0
    const startY = 0

    // x-axis
    ctx.moveTo(startX, startY)
    ctx.lineTo(chartLayouts.chart.width, startY)
    // y-axis
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX, chartLayouts.chart.height)

    ctx.stroke()

    ctx.restore()
  }

  draw = () => {
    const { ctx, options, drawBorderLayouts, drawTitle, drawAxes } = this

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    drawBorderLayouts()

    if (options.title.display) {
      drawTitle()
    }

    drawAxes()
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
        const lineChart = new CartesianChart(ctx, { title: { display: true, align: 'center' } })

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
