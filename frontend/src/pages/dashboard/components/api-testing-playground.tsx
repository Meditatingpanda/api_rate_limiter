/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import smsApiServices from '@/services/smsService'
import { useToast } from '@/components/ui/use-toast'

const ApiTestingPlayground = ({
  setRefresh,
}: {
  setRefresh: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [response, setResponse] = useState(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSendSms = async () => {
    if (!phoneNumber) {
      toast({
        title: 'Error',
        description: 'Please enter a phone number',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const result = await smsApiServices.sendSms(phoneNumber)
      setResponse(result)
      setStatusCode(200)
      setRefresh((prev) => prev + 1)
      toast({
        title: 'Success',
        description: 'SMS sent successfully',
      })
    } catch (error: any) {
      setResponse(error.response?.data || error.message)
      setStatusCode(error.response?.status || 500)
      toast({
        title: 'Error',
        description: 'Failed to send SMS',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Send SMS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-2'>
            <Input
              type='text'
              placeholder='Enter phone number'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button onClick={handleSendSms} disabled={loading}>
              {loading ? 'Sending...' : 'Send SMS'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(response || statusCode) && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <p>
                <strong>Status Code:</strong> {statusCode}
              </p>
              <p>
                <strong>Response:</strong>
              </p>
              <pre className='overflow-x-auto rounded-md bg-muted p-2'>
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ApiTestingPlayground
