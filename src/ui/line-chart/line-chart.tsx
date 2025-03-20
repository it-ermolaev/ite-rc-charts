import { useEffect, useRef } from 'react'
import './style.css'

/**
 *  CONSTANTS
 */

const PADDING = 50
const SNAPPING = 0.5

const AXIOS_ARROW_WIDTH = 3
const AXIOS_LABELS_MARGIN = 7
const AXIS_X_LABEL = 'x'
const AXIS_Y_LABEL = 'y'

/**
 *  DRAWS METHODS
 */

const drawCanvasLayout = (ctx: CanvasRenderingContext2D) => {
  const { canvas } = ctx

  ctx.beginPath()

  ctx.strokeStyle = 'lightblue'

  ctx.moveTo(PADDING - SNAPPING, 0)
  ctx.lineTo(PADDING - SNAPPING, canvas.height)
  ctx.moveTo(canvas.width - PADDING - SNAPPING, 0)
  ctx.lineTo(canvas.width - PADDING - SNAPPING, canvas.height)
  ctx.moveTo(0, PADDING - SNAPPING)
  ctx.lineTo(canvas.width, PADDING - SNAPPING)
  ctx.moveTo(0, canvas.height - PADDING - SNAPPING)
  ctx.lineTo(canvas.width, canvas.height - PADDING - SNAPPING)

  ctx.stroke()
}

interface AxiosOptions {
  isArrows?: boolean
  isAxiosLabels?: boolean
}

const drawAxios = (ctx: CanvasRenderingContext2D, options: AxiosOptions = {}) => {
  const { isArrows = false, isAxiosLabels = false } = options
  const { canvas } = ctx
  const xAxis = { x1: 0, y1: 0, x2: canvas.width - PADDING * 2, y2: 0 }
  const yAxis = { x1: 0, y1: 0, x2: 0, y2: canvas.height - PADDING * 2 }

  // draw axios-labels
  if (isAxiosLabels) {
    ctx.font = '14px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const xAxisLabelMeasure = ctx.measureText(AXIS_X_LABEL)
    const yAxisLabelMeasure = ctx.measureText(AXIS_Y_LABEL)

    const xAxisLabel = { x: xAxis.x2 - xAxisLabelMeasure.width / 2, y: -xAxis.y2 }
    const yAxisLabel = {
      x: yAxis.x2,
      y: -yAxis.y2 + yAxisLabelMeasure.actualBoundingBoxAscent,
    }

    xAxis.x2 = xAxis.x2 - xAxisLabelMeasure.width - AXIOS_LABELS_MARGIN
    yAxis.y2 =
      yAxis.y2 -
      yAxisLabelMeasure.actualBoundingBoxAscent -
      yAxisLabelMeasure.actualBoundingBoxDescent -
      AXIOS_LABELS_MARGIN

    ctx.save()
    ctx.scale(1, -1)

    ctx.fillText(AXIS_X_LABEL, xAxisLabel.x, xAxisLabel.y)
    ctx.fillText(AXIS_Y_LABEL, yAxisLabel.x, yAxisLabel.y)

    ctx.restore()
  }

  // draw axios
  ctx.beginPath()

  ctx.strokeStyle = 'black'

  // x-axios
  ctx.moveTo(xAxis.x1, xAxis.y1)
  ctx.lineTo(xAxis.x2, xAxis.y2)
  // y-axios
  ctx.moveTo(yAxis.x1, yAxis.y1)
  ctx.lineTo(yAxis.x2, yAxis.y2)

  // draw axios-arrows
  if (isArrows) {
    // x-axis-arrow
    ctx.moveTo(xAxis.x2, xAxis.y2)
    ctx.lineTo(xAxis.x2 - AXIOS_ARROW_WIDTH, xAxis.y2 - AXIOS_ARROW_WIDTH)
    ctx.moveTo(xAxis.x2, xAxis.y2)
    ctx.lineTo(xAxis.x2 - AXIOS_ARROW_WIDTH, xAxis.y2 + AXIOS_ARROW_WIDTH)
    // y-axis-arrow
    ctx.moveTo(yAxis.x2, yAxis.y2)
    ctx.lineTo(yAxis.x2 - AXIOS_ARROW_WIDTH, yAxis.y2 - AXIOS_ARROW_WIDTH)
    ctx.moveTo(yAxis.x2, yAxis.y2)
    ctx.lineTo(yAxis.x2 + AXIOS_ARROW_WIDTH, yAxis.y2 - AXIOS_ARROW_WIDTH)
  }

  ctx.stroke()
}

const draw = (ctx: CanvasRenderingContext2D) => {
  const { canvas } = ctx

  drawCanvasLayout(ctx)

  ctx.save()
  ctx.translate(PADDING - SNAPPING, canvas.height - PADDING - SNAPPING)
  ctx.scale(1, -1)

  drawAxios(ctx, { isArrows: true, isAxiosLabels: true })

  ctx.restore()
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
        draw(ctx)
      }
    }
  }, [])

  return (
    <canvas className="line-chart" ref={ref} width={800} height={400}>
      Your browser does not support the HTML canvas tag
    </canvas>
  )
}
