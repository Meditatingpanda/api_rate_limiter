import { Layout } from '@/components/custom/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { RateLimitStatus } from './components/rate-limit-status'

import { useEffect, useState } from 'react'
import smsApiServices from '@/services/smsService'
import { TIME_INTERVAL_IN_SECONDS } from '@/constants/time.constant'
import ApiTestingPlayground from './components/api-testing-playground'
import { SmsHistoryChart } from './components/sms-history-chart'

export default function Dashboard() {
  const [smsSentOneDay, setSmsSentOneDay] = useState(0)
  const [smsSentTwoDays, setSmsSentTwoDays] = useState(0)
  const [smsSentOneMinute, setSmsSentOneMinute] = useState(0)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const fetchSmsData = async () => {
      try {
        const oneDayData = await smsApiServices.getSmsSent(
          TIME_INTERVAL_IN_SECONDS.ONE_DAY
        )
        setSmsSentOneDay(oneDayData.sms.length)

        const twoDaysData = await smsApiServices.getSmsSent(
          TIME_INTERVAL_IN_SECONDS.TWO_DAYS
        )
        setSmsSentTwoDays(twoDaysData.sms.length)

        const oneMinuteData = await smsApiServices.getSmsSent(
          TIME_INTERVAL_IN_SECONDS.ONE_MINUTE
        )
        setSmsSentOneMinute(oneMinuteData.sms.length)
      } catch (error) {
        console.error('Error fetching SMS data:', error)
      }
    }

    fetchSmsData()
  }, [refresh])

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='api-testing'>API Testing</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    SMS Sent ( in last 24 hours )
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{smsSentOneDay}</div>
                  {smsSentTwoDays !== 0 && (
                    <p className='flex items-center text-xs'>
                      {(() => {
                        const percentChange =
                          ((smsSentOneDay - smsSentTwoDays) / smsSentTwoDays) *
                          100
                        const isPositive = percentChange > 0
                        const absPercentChange =
                          Math.abs(percentChange).toFixed(1)
                        return (
                          <>
                            <span
                              className={`mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                            >
                              {isPositive ? '↑' : '↓'}
                            </span>
                            <span
                              className={
                                isPositive ? 'text-green-500' : 'text-red-500'
                              }
                            >
                              {absPercentChange}%
                            </span>
                            <span className='ml-1 text-muted-foreground'>
                              from previous day
                            </span>
                          </>
                        )
                      })()}
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    SMS sent ( in last 1 minute )
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{smsSentOneMinute}</div>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>SMS History</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <SmsHistoryChart refresh={refresh} />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Rate Limit Status ( in last 1 day )</CardTitle>
                </CardHeader>
                <CardContent>
                  <RateLimitStatus refresh={refresh} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='api-testing'>
            <ApiTestingPlayground setRefresh={setRefresh} />
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}
