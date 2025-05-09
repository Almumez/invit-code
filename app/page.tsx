'use client'

import { useState } from 'react'
import { useInviteStore } from '@/lib/store/invite-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle, Cancel, ArrowForward, AutoAwesome } from '@mui/icons-material'
import Link from 'next/link'

export default function HomePage() {
  const { verifyInviteCode } = useInviteStore()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ valid: boolean; checked: boolean }>({
    valid: false,
    checked: false
  })

  const handleVerify = async () => {
    if (!code.trim()) return
    
    setIsLoading(true)
    try {
      const isValid = await verifyInviteCode(code.trim())
      setResult({ valid: isValid, checked: true })
    } catch (error) {
      console.error('Error verifying code:', error)
      setResult({ valid: false, checked: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4 py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-black mb-4 pulse-animation">
            <AutoAwesome className="inline-block ml-2 h-8 w-8" />
            نظام التحقق من رموز الدعوة
          </h1>
          <p className="text-xl text-gray-700">أدخل رمز الدعوة للتحقق من صلاحيته</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>التحقق من الرمز</CardTitle>
            <CardDescription>
              أدخل رمز الدعوة الذي استلمته
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <Input
                  id="code"
                  placeholder="أدخل رمز الدعوة"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  fullWidth
                  size="medium"
                  dir="rtl"
                />
                <Button 
                  onClick={handleVerify} 
                  disabled={isLoading || !code.trim()}
                  fullWidth
                  variant="contained"
                  size="large"
                >
                  {isLoading ? 'جاري التحقق...' : 'التحقق من الرمز'}
                </Button>
              </div>

              {result.checked && (
                <div className={`p-5 rounded-lg flex items-center ${
                  result.valid 
                    ? 'bg-gray-100 text-black border border-gray-200' 
                    : 'bg-gray-100 text-black border border-gray-200'
                }`}>
                  {result.valid 
                    ? <CheckCircle style={{ color: '#000' }} className="h-6 w-6 ml-3 flex-shrink-0" /> 
                    : <Cancel style={{ color: '#000' }} className="h-6 w-6 ml-3 flex-shrink-0" />
                  }
                  <span className="text-lg">
                    {result.valid 
                      ? 'رمز دعوة صالح!' 
                      : 'رمز دعوة غير صالح أو غير مفعّل.'
                    }
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-500">هل تحتاج إلى رمز دعوة؟</div>
            <Link 
              href="/dashboard"
              style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.3s ease' }}
            >
              لوحة التحكم <ArrowForward style={{ transform: 'scaleX(-1)' }} className="h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
