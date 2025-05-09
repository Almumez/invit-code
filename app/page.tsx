'use client'

import { useState } from 'react'
import { useInviteStore } from '@/lib/store/invite-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle, Cancel, ArrowForward, AutoAwesome } from '@mui/icons-material'
import Link from 'next/link'

export default function HomePage() {
  const { verifyInviteCode, scanInviteCode } = useInviteStore()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ 
    valid: boolean; 
    checked: boolean;
    isScanned?: boolean;
    scanMessage?: string;
  }>({
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
  
  const handleScan = async () => {
    if (!code.trim()) return
    
    setIsLoading(true)
    try {
      const scanResult = await scanInviteCode(code.trim())
      setResult({ 
        valid: scanResult.success, 
        checked: true,
        isScanned: true,
        scanMessage: scanResult.message
      })
    } catch (error) {
      console.error('Error scanning code:', error)
      setResult({ 
        valid: false, 
        checked: true,
        isScanned: true,
        scanMessage: 'حدث خطأ أثناء مسح الرمز'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dashboard-bg p-4 py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-dashboard-text mb-4 pulse-animation">
            <AutoAwesome className="inline-block ml-2 h-8 w-8" />
            نظام التحقق من رموز الدعوة
          </h1>
          <p className="text-xl text-dashboard-text-muted">أدخل رمز الدعوة للتحقق من صلاحيته</p>
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
                  className="w-full"
                  dir="rtl"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleVerify} 
                    disabled={isLoading || !code.trim()}
                    className="flex-1"
                    variant="materio"
                  >
                    {isLoading ? 'جاري التحقق...' : 'التحقق من الرمز'}
                  </Button>
                  
                  <Button 
                    onClick={handleScan} 
                    disabled={isLoading || !code.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? 'جاري المسح...' : 'مسح الرمز'}
                  </Button>
                </div>
              </div>

              {result.checked && (
                <div className={`p-5 rounded-lg flex items-center ${
                  result.valid 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {result.valid 
                    ? <CheckCircle color="success" className="h-6 w-6 ml-3 flex-shrink-0" /> 
                    : <Cancel color="error" className="h-6 w-6 ml-3 flex-shrink-0" />
                  }
                  <div className="flex flex-col">
                    <span className="text-lg font-medium">
                      {result.isScanned 
                        ? (result.valid ? 'تم مسح الرمز بنجاح!' : 'فشل في مسح الرمز')
                        : (result.valid ? 'رمز دعوة صالح!' : 'رمز دعوة غير صالح أو غير مفعّل.')
                      }
                    </span>
                    {result.isScanned && result.scanMessage && (
                      <span className="text-sm mt-1">{result.scanMessage}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-dashboard-border bg-dashboard-sidebar p-4">
            <div className="text-sm text-dashboard-text-muted">هل تحتاج إلى رمز دعوة؟</div>
            <Link 
              href="/dashboard"
              className="text-dashboard-accent hover:text-dashboard-accent-hover flex items-center gap-1 transition-colors"
            >
              لوحة التحكم <ArrowForward style={{ transform: 'scaleX(-1)' }} className="h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
