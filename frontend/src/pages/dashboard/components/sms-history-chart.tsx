import { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import smsApiServices from '@/services/smsService'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface SmsData {
  id: number
  phoneNumber: string
  message: string
  createdAt: string
}

interface ChartDataPoint {
  date: string
  count: number
}

const chartConfig = {
  sms: {
    label: 'SMS Count',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function SmsHistoryChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    const fetchSmsData = async () => {
      try {
        const response = await smsApiServices.getAllSms()
        const smsData: SmsData[] = response.sms

        // Process the data for the chart
        const processedData = processDataForChart(smsData)
        setChartData(processedData)
      } catch (error) {
        console.error('Error fetching SMS data:', error)
      }
    }

    fetchSmsData()
  }, [])

  const processDataForChart = (data: SmsData[]): ChartDataPoint[] => {
    const dateCounts: { [key: string]: number } = {}

    data.forEach((sms) => {
      const date = new Date(sms.createdAt).toISOString().split('T')[0]
      dateCounts[date] = (dateCounts[date] || 0) + 1
    })

    return Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS History</CardTitle>
        <CardDescription>Number of SMS sent per day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey='count'
              type='monotone'
              stroke='var(--color-sms)'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
