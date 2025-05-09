'use client'

import { useState, useEffect } from 'react'
import { useInviteStore } from '@/lib/store/invite-store'
import { useVisitStore } from '@/lib/store/visit-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { TicketIcon, SearchIcon, CheckIcon, XIcon, LoaderIcon } from 'lucide-react'
import React from 'react'

export default function HomePage() {
  const { scanInviteCode } = useInviteStore()
  const { recordVisit } = useVisitStore()
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
  
  // تسجيل زيارة عند فتح الصفحة - استخدام useRef لضمان عدم تكرار الاستدعاء
  const visitRecorded = React.useRef(false);
  
  useEffect(() => {
    if (!visitRecorded.current) {
      recordVisit('/')
      visitRecorded.current = true;
    }
  }, [recordVisit])
  
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
          <div className="inline-block p-3 rounded-full bg-primary-50 mb-4">
            <TicketIcon className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-dashboard-text mb-3">
            نظام مسح رموز الدعوة
          </h1>
          <p className="text-lg text-dashboard-text-muted">أدخل رمز الدعوة لمسحه والتحقق من صلاحيته</p>
        </div>

        <Card className="border-dashboard-border shadow-md overflow-hidden">
          <CardHeader className="bg-white border-b border-dashboard-border">
            <CardTitle className="text-xl font-semibold text-dashboard-text flex items-center">
              <SearchIcon className="h-5 w-5 ml-2 text-primary-500" />
              مسح الرمز
            </CardTitle>
            <CardDescription className="text-dashboard-text-muted">
              أدخل رمز الدعوة الذي تريد التحقق منه
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <TicketIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
                  <Input
                    id="code"
                    placeholder="أدخل رمز الدعوة"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    className="bg-white border-gray-200 focus:border-primary-400 focus:ring-primary-400 text-dashboard-text pr-12 h-12 text-lg w-full shadow-sm rounded-lg"
                    dir="rtl"
                  />
                </div>
                <Button 
                  onClick={handleScan} 
                  disabled={isLoading || !code.trim()}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 rounded-lg font-medium shadow-sm transition-colors"
                >
                  {isLoading ? (
                    <>
                      <LoaderIcon className="h-5 w-5 ml-2 animate-spin" />
                      جاري المسح...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="h-5 w-5 ml-2" />
                      مسح الرمز
                    </>
                  )}
                </Button>
              </div>

              {result.checked && (
                <div className={`p-5 rounded-lg flex items-center shadow-sm ${
                  result.valid 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {result.valid 
                    ? <CheckIcon className="h-6 w-6 ml-3 flex-shrink-0 text-green-600" /> 
                    : <XIcon className="h-6 w-6 ml-3 flex-shrink-0 text-red-600" />
                  }
                  <div className="flex flex-col">
                    <span className="text-lg font-medium">
                      {result.valid ? 'تم مسح الرمز بنجاح!' : 'فشل في مسح الرمز'}
                    </span>
                    {result.scanMessage && (
                      <span className="text-sm mt-1">{result.scanMessage}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-dashboard-border py-4">
            <p className="text-xs text-dashboard-text-muted w-full text-center">
              قم بإدخال رمز الدعوة للتحقق من صلاحيته وإمكانية استخدامه
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
