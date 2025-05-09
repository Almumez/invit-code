'use client'

import { useState, useEffect } from 'react'
import { useInviteStore } from '@/lib/store/invite-store'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
  Sparkles,
  Settings,
  Info,
  Check
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
      {/* Header Banner */}
      <Card className="border-0 bg-gradient-to-r from-primary-500/90 to-primary-700 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                <TicketIcon className="h-6 w-6 ml-2" /> 
                توليد رموز الدعوة
              </h1>
              <p className="text-white/80">
                إنشاء رموز دعوة متعددة بسهولة وتخصيصها بالشكل الذي يناسبك
              </p>
            </div>
            
            <div className="bg-white/20 rounded-lg px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                <span>أنشئت اليوم: <strong>{0}</strong></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Generate Invitation Codes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-md border-dashboard-border overflow-hidden">
            <CardHeader className="border-b border-dashboard-border bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-lg font-semibold text-dashboard-text">
                    <Settings className="h-5 w-5 ml-2 text-primary-500" />
                    إعدادات توليد الرموز
                  </CardTitle>
                  <CardDescription className="text-dashboard-text-muted">
                    حدد إعدادات الرموز التي تريد إنشاءها
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="generation-count" className="text-base">عدد رموز الدعوة</Label>
                    <div className="relative">
                      <Input
                        id="generation-count"
                        type="number"
                        min="1"
                        max="1000"
                        value={generationCount}
                        onChange={(e) => setGenerationCount(Number(e.target.value))}
                        className="bg-dashboard-bg border-dashboard-border text-dashboard-text h-12 text-lg"
                      />
                    </div>
                    <p className="text-xs text-dashboard-text-muted">أدخل عدد الرموز التي ترغب في إنشائها (الحد الأقصى: 1000)</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="code-length" className="text-base">عدد خانات الرمز</Label>
                    <div className="relative">
                      <Input
                        id="code-length"
                        type="number"
                        min="4"
                        max="16"
                        value={codeLength}
                        onChange={(e) => setCodeLength(Number(e.target.value))}
                        className="bg-dashboard-bg border-dashboard-border text-dashboard-text h-12 text-lg"
                      />
                    </div>
                    <p className="text-xs text-dashboard-text-muted">أدخل طول كل رمز (من 4 إلى 16 حرف/رقم)</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Label className="text-base text-dashboard-text mb-3 block">خيارات تخصيص الرموز</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    <div className={`flex items-center p-4 border ${includeNumbers ? 'border-primary-500 bg-primary-50/50' : 'border-dashboard-border'} rounded-lg cursor-pointer`}
                      onClick={() => setIncludeNumbers(!includeNumbers)}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${includeNumbers ? 'bg-primary-500' : 'border border-dashboard-border'} ml-3`}>
                        {includeNumbers && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <Label 
                        className="text-dashboard-text cursor-pointer"
                      >
                        أرقام (0-9)
                      </Label>
                    </div>
                    
                    <div className={`flex items-center p-4 border ${includeUppercase ? 'border-primary-500 bg-primary-50/50' : 'border-dashboard-border'} rounded-lg cursor-pointer`}
                      onClick={() => setIncludeUppercase(!includeUppercase)}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${includeUppercase ? 'bg-primary-500' : 'border border-dashboard-border'} ml-3`}>
                        {includeUppercase && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <Label 
                        className="text-dashboard-text cursor-pointer"
                      >
                        أحرف كبيرة (A-Z)
                      </Label>
                    </div>
                    
                    <div className={`flex items-center p-4 border ${includeLowercase ? 'border-primary-500 bg-primary-50/50' : 'border-dashboard-border'} rounded-lg cursor-pointer`}
                      onClick={() => setIncludeLowercase(!includeLowercase)}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${includeLowercase ? 'bg-primary-500' : 'border border-dashboard-border'} ml-3`}>
                        {includeLowercase && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <Label 
                        className="text-dashboard-text cursor-pointer"
                      >
                        أحرف صغيرة (a-z)
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-dashboard-text-muted mt-2">يجب اختيار نوع واحد على الأقل</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 py-4 px-6 border-t border-dashboard-border">
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-dashboard-text-muted">
                  ستتمكن من رؤية جميع الرموز المولدة في صفحة إدارة الرموز
                </div>
                <Button 
                  onClick={handleGenerateCodes} 
                  disabled={isGenerating || generationCount <= 0 || generationCount > 1000 || codeLength < 4 || codeLength > 16 || (!includeNumbers && !includeUppercase && !includeLowercase)}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-sm px-5 py-2.5 h-auto text-base"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <LoaderIcon className="mr-2 h-5 w-5 animate-spin" />
                      جاري توليد الرموز...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="mr-2 h-5 w-5" />
                      توليد رموز الدعوة
                    </>
                  )}
                </Button>
              </div>
              
              {generationSuccess && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center w-full">
                  <CheckCircle className="h-5 w-5 ml-2" />
                  تم توليد {generationCount} رمز دعوة بنجاح!
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white shadow-md border-dashboard-border h-full">
            <CardHeader className="border-b border-dashboard-border bg-white px-6 py-4">
              <CardTitle className="flex items-center text-lg font-semibold text-dashboard-text">
                <Info className="h-5 w-5 ml-2 text-primary-500" />
                معلومات مفيدة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center ml-4">
                    <TicketIcon className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-dashboard-text mb-1">تخصيص الرموز</h4>
                    <p className="text-sm text-dashboard-text-muted">يمكنك تخصيص الرموز باستخدام أرقام وأحرف إنجليزية كبيرة وصغيرة</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center ml-4">
                    <CheckCircle className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-dashboard-text mb-1">رموز فريدة</h4>
                    <p className="text-sm text-dashboard-text-muted">يتم التحقق من فريدية كل رمز في قاعدة البيانات قبل إنشائه</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center ml-4">
                    <BarChart2 className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-dashboard-text mb-1">حد التوليد</h4>
                    <p className="text-sm text-dashboard-text-muted">يمكنك توليد حتى 1000 رمز دفعة واحدة</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center ml-4">
                    <Settings className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-dashboard-text mb-1">إدارة الرموز</h4>
                    <p className="text-sm text-dashboard-text-muted">يمكن بعد ذلك تعديل أي رمز من خلال جدول إدارة الرموز</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* نافذة منبثقة لعرض حالة التوليد */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="bg-white sm:max-w-md text-center p-0 overflow-hidden rounded-xl shadow-2xl">
          <div className="relative">
            {/* خلفية متحركة */}
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
              <div className="absolute -inset-10 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 opacity-80 animate-gradient-bg"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/30 backdrop-blur-sm"></div>
            </div>
            
            <div className="relative p-8 flex flex-col items-center justify-center">
              <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-primary-50 border-4 border-primary-100 animate-float">
                <div className="relative">
                  <TicketIcon className="w-10 h-10 text-primary-500" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-5 h-5 text-primary-700 animate-sparkle" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-dashboard-text mb-2">جاري توليد الرموز</h3>
              <p className="text-dashboard-text-muted mb-5">يرجى الانتظار حتى اكتمال العملية...</p>

              {/* شريط التقدم */}
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-l from-primary-400 to-primary-600 rounded-full transition-all duration-300" 
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-dashboard-text-muted mb-8">
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