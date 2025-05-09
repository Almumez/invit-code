'use client'

import { useState, useEffect } from 'react'
import { useInviteStore } from '@/lib/store/invite-store'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  TicketIcon, 
  PlusIcon, 
  LoaderIcon, 
  CheckCircle,
  BarChart2,
  Sparkles
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export default function GeneratePage() {
  const { generateInviteCodes, inviteCodes } = useInviteStore()
  
  // إضافة حالة لنموذج توليد الدعوات
  const [generationCount, setGenerationCount] = useState(5)
  const [codeLength, setCodeLength] = useState(11)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationSuccess, setGenerationSuccess] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  
  // إضافة خيارات تخصيص رموز الدعوة
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(false)
  
  // تتبع تقدم عملية التوليد
  useEffect(() => {
    if (isGenerating && showPopup) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 300);
      
      return () => clearInterval(interval);
    } else if (!isGenerating) {
      setGenerationProgress(0);
    }
  }, [isGenerating, showPopup]);
  
  // وظيفة لتوليد رموز الدعوة
  const handleGenerateCodes = async () => {
    if (generationCount <= 0 || codeLength <= 0) return
    
    // التحقق من تحديد خيار واحد على الأقل
    if (!includeNumbers && !includeUppercase && !includeLowercase) {
      alert("يجب اختيار نوع واحد على الأقل من أنواع الحروف/الأرقام")
      return
    }
    
    setIsGenerating(true)
    setGenerationSuccess(false)
    setShowPopup(true)
    setGenerationProgress(0)
    
    try {
      await generateInviteCodes(
        generationCount, 
        codeLength, 
        { 
          includeNumbers, 
          includeUppercase, 
          includeLowercase 
        }
      )
      setGenerationSuccess(true)
      
      // إغلاق الـ popup بعد اكتمال العملية
      setTimeout(() => {
        setShowPopup(false)
      }, 1500)
      
      // إخفاء رسالة النجاح بعد 3 ثوان
      setTimeout(() => setGenerationSuccess(false), 3000)
    } catch (error) {
      console.error('Error generating codes:', error)
      setShowPopup(false)
    } finally {
      setIsGenerating(false)
    }
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="materio-card h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-dashboard-text-muted text-sm font-medium mb-1">إجمالي الرموز</div>
                  <div className="text-3xl font-bold text-dashboard-text mb-2">
                    {inviteCodes.length}
                  </div>
                  <div className="mt-2 text-xs bg-primary-50 text-primary-600 font-medium px-2 py-1 rounded-full inline-block">
                    رموز الدعوة النشطة
                  </div>
                </div>
                <div className="materio-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                  <TicketIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="materio-card h-full">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-dashboard-text">توليد رموز الدعوة</h1>
                  <p className="text-dashboard-text-muted text-sm">
                    إنشاء رموز دعوة متعددة بسهولة
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-dashboard-text-muted">
                    <BarChart2 className="h-5 w-5" />
                    <span>أنشئت اليوم: <strong>0</strong></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Generate Invitation Codes Section */}
      <Card className="bg-white shadow-sm border-dashboard-border">
        <CardHeader className="border-b border-dashboard-border bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-lg font-semibold text-dashboard-text">
                <TicketIcon className="h-5 w-5 ml-2 text-primary-500" />
                توليد رموز الدعوة
              </CardTitle>
              <CardDescription className="text-dashboard-text-muted">
                إنشاء عدة رموز دعوة دفعة واحدة
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="generation-count">عدد رموز الدعوة</Label>
                <Input
                  id="generation-count"
                  type="number"
                  min="1"
                  max="1000"
                  value={generationCount}
                  onChange={(e) => setGenerationCount(Number(e.target.value))}
                  className="bg-dashboard-bg border-dashboard-border text-dashboard-text"
                />
                <p className="text-xs text-dashboard-text-muted">أدخل عدد الرموز التي ترغب في إنشائها (الحد الأقصى: 1000)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code-length">عدد خانات الرمز</Label>
                <Input
                  id="code-length"
                  type="number"
                  min="4"
                  max="16"
                  value={codeLength}
                  onChange={(e) => setCodeLength(Number(e.target.value))}
                  className="bg-dashboard-bg border-dashboard-border text-dashboard-text"
                />
                <p className="text-xs text-dashboard-text-muted">أدخل طول كل رمز (من 4 إلى 16 حرف/رقم)</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-dashboard-text">خيارات تخصيص الرموز</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox 
                      id="include-numbers" 
                      checked={includeNumbers} 
                      onCheckedChange={setIncludeNumbers}
                    />
                    <Label 
                      htmlFor="include-numbers" 
                      className="text-dashboard-text cursor-pointer"
                    >
                      أرقام (0-9)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox 
                      id="include-uppercase" 
                      checked={includeUppercase} 
                      onCheckedChange={setIncludeUppercase}
                    />
                    <Label 
                      htmlFor="include-uppercase" 
                      className="text-dashboard-text cursor-pointer"
                    >
                      أحرف كبيرة (A-Z)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Checkbox 
                      id="include-lowercase" 
                      checked={includeLowercase} 
                      onCheckedChange={setIncludeLowercase}
                    />
                    <Label 
                      htmlFor="include-lowercase" 
                      className="text-dashboard-text cursor-pointer"
                    >
                      أحرف صغيرة (a-z)
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-dashboard-text-muted mt-1">يجب اختيار نوع واحد على الأقل</p>
              </div>

              <Button 
                onClick={handleGenerateCodes} 
                disabled={isGenerating || generationCount <= 0 || generationCount > 1000 || codeLength < 4 || codeLength > 16 || (!includeNumbers && !includeUppercase && !includeLowercase)}
                className="mt-4 bg-dashboard-accent hover:bg-dashboard-accent-hover text-white shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    جاري توليد الرموز...
                  </>
                ) : (
                  <>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    توليد رموز الدعوة
                  </>
                )}
              </Button>

              {generationSuccess && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 ml-2" />
                  تم توليد {generationCount} رمز دعوة بنجاح!
                </div>
              )}
            </div>

            <div className="bg-dashboard-sidebar p-6 rounded-lg border border-dashboard-border">
              <h3 className="text-lg font-semibold text-dashboard-text mb-4">معلومات عن رموز الدعوة</h3>
              <ul className="space-y-3 text-dashboard-text-muted">
                <li className="flex items-start">
                  <div className="ml-2 mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                  <span>يمكنك تخصيص الرموز باستخدام أرقام وأحرف إنجليزية كبيرة وصغيرة</span>
                </li>
                <li className="flex items-start">
                  <div className="ml-2 mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                  <span>يتم التحقق من فريدية كل رمز في قاعدة البيانات قبل إنشائه</span>
                </li>
                <li className="flex items-start">
                  <div className="ml-2 mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                  <span>يمكنك توليد حتى 1000 رمز دفعة واحدة</span>
                </li>
                <li className="flex items-start">
                  <div className="ml-2 mt-1 h-2 w-2 rounded-full bg-primary-500"></div>
                  <span>يمكن بعد ذلك تعديل أي رمز من خلال جدول إدارة الرموز</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* نافذة منبثقة لعرض حالة التوليد */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="bg-white sm:max-w-md text-center p-0 overflow-hidden rounded-xl">
          <div className="relative">
            {/* خلفية متحركة */}
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
              <div className="absolute -inset-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 opacity-50 animate-gradient-bg"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/60"></div>
            </div>
            
            <div className="relative p-8 flex flex-col items-center justify-center">
              <div className="w-20 h-20 mb-5 flex items-center justify-center rounded-full bg-primary-50 border-4 border-primary-100 animate-float">
                <div className="relative">
                  <TicketIcon className="w-8 h-8 text-primary-500" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-primary-700 animate-sparkle" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-dashboard-text mb-2">جاري توليد الرموز</h3>
              <p className="text-dashboard-text-muted mb-4">يرجى الانتظار حتى اكتمال العملية...</p>

              {/* شريط التقدم */}
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-l from-primary-400 to-primary-600 rounded-full transition-all duration-300" 
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-dashboard-text-muted mb-6">
                {Math.round(generationProgress)}% {generationProgress < 100 
                  ? "جاري إنشاء الرموز وحفظها في قاعدة البيانات..." 
                  : "تم الانتهاء! جاري إغلاق النافذة..."}
              </p>
              
              {/* أيقونات متحركة */}
              <div className="flex justify-center items-center space-x-8 rtl:space-x-reverse mt-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="relative" 
                    style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s', transform: `translateY(${Math.sin(i) * 10}px)` }}
                  >
                    <TicketIcon 
                      className="w-6 h-6 text-primary-400 animate-float" 
                      style={{ animationDelay: `${i * 300}ms` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}