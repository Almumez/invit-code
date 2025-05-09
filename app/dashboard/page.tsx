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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { arSA } from 'date-fns/locale'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  TicketIcon, 
  SearchIcon, 
  LoaderIcon, 
  AlertCircleIcon, 
  RefreshCwIcon,
  ArrowRightIcon,
  BarChart4,
  Users,
  ShoppingBag,
  MoreVertical
} from 'lucide-react'

export default function DashboardPage() {
  const { 
    inviteCodes, 
    isLoading,
    error,
    fetchInviteCodes, 
    addInviteCode, 
    updateInviteCode, 
    deleteInviteCode
  } = useInviteStore()
  
  const [newCode, setNewCode] = useState('')
  const [editCode, setEditCode] = useState({ id: '', code: '', isActive: true })
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // حالة لمربع الحوار التأكيدي
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{open: boolean, codeId: string | null}>({
    open: false,
    codeId: null
  })
  
  useEffect(() => {
    fetchInviteCodes()
  }, [fetchInviteCodes])
  
  const handleAddCode = async () => {
    if (newCode.trim()) {
      await addInviteCode(newCode.trim())
      setNewCode('')
      setAddDialogOpen(false)
    }
  }
  
  const handleEditCode = async () => {
    if (editCode.code.trim()) {
      await updateInviteCode(editCode.id, {
        code: editCode.code.trim(),
        isActive: editCode.isActive
      })
      setEditDialogOpen(false)
    }
  }
  
  const handleDeleteCode = async (id: string) => {
    setDeleteDialogOpen({open: false, codeId: null})
    await deleteInviteCode(id)
  }
  
  const openEditDialog = (code: any) => {
    setEditCode({
      id: code.id,
      code: code.code,
      isActive: code.isActive
    })
    setEditDialogOpen(true)
  }

  // فلترة رموز الدعوة حسب البحث
  const filteredCodes = inviteCodes.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // تنسيق التاريخ بالعربية
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: arSA })
  }
  
  return (
    <div className="space-y-8">
      {/* Header & Statistics */}
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
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-dashboard-text">رموز الدعوة</h1>
                  <p className="text-dashboard-text-muted text-sm mr-2">
                    إدارة رموز الدعوة للوصول الحصري
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Input
                      placeholder="البحث عن رموز..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-dashboard-bg border-dashboard-border text-dashboard-text pr-10 w-full sm:w-64 text-right"
                    />
                    <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dashboard-text-muted" />
                  </div>
                  
                  <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-dashboard-accent hover:bg-dashboard-accent-hover text-white shadow-sm">
                        <PlusIcon className="h-4 w-4 ml-2" />
                        رمز جديد
                      </Button>
                    </DialogTrigger>
                    <DialogContent dir="rtl" className="bg-white border-dashboard-border text-dashboard-text">
                      <DialogHeader>
                        <DialogTitle className="text-xl">إضافة رمز دعوة جديد</DialogTitle>
                        <DialogDescription className="text-dashboard-text-muted">
                          قم بإنشاء رمز دعوة جديد للمستخدمين
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-code">رمز الدعوة</Label>
                          <Input
                            id="new-code"
                            placeholder="أدخل رمز الدعوة"
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                            className="bg-dashboard-bg border-dashboard-border text-dashboard-text focus:ring-primary-500/50 text-right"
                          />
                        </div>
                      </div>
                      <DialogFooter dir="rtl" className="flex flex-row-reverse sm:flex-row sm:justify-end gap-2">
                        <Button 
                          onClick={handleAddCode}
                          className="bg-primary-500 hover:bg-primary-600 text-white"
                        >
                          إضافة الرمز
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setAddDialogOpen(false)}
                          className="bg-white border-dashboard-border text-dashboard-text hover:bg-dashboard-bg"
                        >
                          إلغاء
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Main Cards */}
      <Card className="bg-white shadow-sm border-dashboard-border">
        <CardHeader className="border-b border-dashboard-border bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-lg font-semibold text-dashboard-text">
                <TicketIcon className="h-5 w-5 ml-2 text-primary-500" />
                إدارة رموز الدعوة
              </CardTitle>
              <CardDescription className="text-dashboard-text-muted">
                عرض وتعديل وحذف رموز الدعوة الخاصة بك
              </CardDescription>
            </div>
            {isLoading ? null : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fetchInviteCodes()}
                className="text-dashboard-text-muted hover:text-dashboard-text hover:bg-dashboard-bg"
              >
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-dashboard-text-muted flex flex-col items-center justify-center">
              <LoaderIcon className="h-8 w-8 animate-spin mb-4 text-primary-500" />
              <div>جارِ تحميل رموز الدعوة...</div>
            </div>
          ) : error ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <AlertCircleIcon className="h-8 w-8 mb-4 text-red-500" />
              <div className="text-red-500">{error}</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchInviteCodes()}
                className="mt-4 bg-white border-dashboard-border text-dashboard-text hover:bg-dashboard-bg"
              >
                <RefreshCwIcon className="h-4 w-4 ml-2" />
                إعادة المحاولة
              </Button>
            </div>
          ) : filteredCodes.length === 0 ? (
            <div className="py-16 text-center text-dashboard-text-muted flex flex-col items-center justify-center">
              {searchTerm ? (
                <>
                  <SearchIcon className="h-8 w-8 mb-4 text-dashboard-text-muted" />
                  <div>لم يتم العثور على رموز دعوة تطابق "{searchTerm}".</div>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-primary-500 hover:text-primary-600"
                  >
                    مسح البحث
                  </Button>
                </>
              ) : (
                <>
                  <TicketIcon className="h-8 w-8 mb-4 text-dashboard-text-muted" />
                  <div>لم يتم العثور على رموز دعوة. قم بإنشاء أول رمز باستخدام زر "رمز جديد".</div>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-dashboard-border hover:bg-dashboard-bg">
                    <TableHead className="text-dashboard-text-muted">الرمز</TableHead>
                    <TableHead className="text-dashboard-text-muted">الحالة</TableHead>
                    <TableHead className="text-dashboard-text-muted">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-dashboard-text-muted text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodes.map((code) => (
                    <TableRow key={code.id} className="border-dashboard-border hover:bg-dashboard-bg">
                      <TableCell className="font-medium text-dashboard-text">{code.code}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          code.isActive 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {code.isActive ? 'مفعّل' : 'غير مفعّل'}
                        </span>
                      </TableCell>
                      <TableCell className="text-dashboard-text-muted">
                        {formatDate(code.createdAt)}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex justify-end gap-2">
                          <AlertDialog 
                            open={deleteDialogOpen.open && deleteDialogOpen.codeId === code.id} 
                            onOpenChange={(open) => setDeleteDialogOpen({open, codeId: open ? code.id : null})}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-dashboard-text-muted hover:text-dashboard-text hover:bg-dashboard-bg"
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">حذف</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl" className="bg-white border-dashboard-border text-dashboard-text">
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف رمز الدعوة</AlertDialogTitle>
                                <AlertDialogDescription className="text-dashboard-text-muted">
                                  هل أنت متأكد من رغبتك في حذف رمز الدعوة "{code.code}"؟ هذا الإجراء لا يمكن التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter dir="rtl" className="flex flex-row-reverse sm:flex-row sm:justify-end gap-2">
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  onClick={() => handleDeleteCode(code.id)}
                                >
                                  حذف
                                </AlertDialogAction>
                                <AlertDialogCancel className="bg-white border-dashboard-border text-dashboard-text hover:bg-dashboard-bg">
                                  إلغاء
                                </AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-dashboard-text-muted hover:text-dashboard-text hover:bg-dashboard-bg"
                            onClick={() => openEditDialog(code)}
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">تعديل</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      {!isLoading && !error && filteredCodes.length > 0 && (
        <CardFooter className="border-t border-dashboard-border bg-white py-3 px-6 flex justify-between text-xs text-dashboard-text-muted">
          <div>
            عرض {filteredCodes.length} {filteredCodes.length === 1 ? 'رمز' : 'رموز'}
            {searchTerm && ` تطابق "${searchTerm}"`}
          </div>
          <div>آخر تحديث: {format(new Date(), 'HH:mm yyyy/MM/dd', { locale: arSA })}</div>
        </CardFooter>
      )}
      </Card>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border-dashboard-border">
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
            <CardTitle className="text-lg font-semibold text-dashboard-text">إحصائيات الاستخدام</CardTitle>
            <button>
              <MoreVertical className="h-5 w-5 text-dashboard-text-muted" />
            </button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dashboard-text-muted text-sm">إجمالي الزيارات</div>
                  <div className="text-xl font-semibold text-dashboard-text">1,248</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dashboard-text-muted text-sm">تم استخدامها</div>
                  <div className="text-xl font-semibold text-dashboard-text">{Math.round(filteredCodes.length * 0.6)}</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TicketIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-dashboard-text-muted text-sm">متوسط الاستخدام</div>
                  <div className="text-xl font-semibold text-dashboard-text">68%</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BarChart4 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm border-dashboard-border h-full">
            <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
              <CardTitle className="text-lg font-semibold text-dashboard-text">أحدث النشاطات</CardTitle>
              <button className="text-primary-500 text-sm font-medium">
                عرض الكل
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 border-b border-dashboard-border hover:bg-dashboard-bg rounded-lg transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <span className="text-primary-500 font-medium">ع م</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-dashboard-text">تم استخدام الرمز ABC123</div>
                    <div className="text-xs text-dashboard-text-muted">منذ 2 ساعة</div>
                  </div>
                  <div className="text-dashboard-text-muted">
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center p-3 border-b border-dashboard-border hover:bg-dashboard-bg rounded-lg transition-colors">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <span className="text-green-500 font-medium">س ن</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-dashboard-text">تم إنشاء رمز جديد XYZ789</div>
                    <div className="text-xs text-dashboard-text-muted">منذ 5 ساعات</div>
                  </div>
                  <div className="text-dashboard-text-muted">
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center p-3 hover:bg-dashboard-bg rounded-lg transition-colors">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                    <span className="text-red-500 font-medium">م ك</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-dashboard-text">تم حذف الرمز DEF456</div>
                    <div className="text-xs text-dashboard-text-muted">منذ يوم واحد</div>
                  </div>
                  <div className="text-dashboard-text-muted">
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent dir="rtl" className="bg-white border-dashboard-border text-dashboard-text">
          <DialogHeader>
            <DialogTitle className="text-xl">تعديل رمز الدعوة</DialogTitle>
            <DialogDescription className="text-dashboard-text-muted">
              تحديث تفاصيل رمز الدعوة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">رمز الدعوة</Label>
              <Input
                id="edit-code"
                placeholder="أدخل رمز الدعوة"
                value={editCode.code}
                onChange={(e) => setEditCode({ ...editCode, code: e.target.value })}
                className="bg-dashboard-bg border-dashboard-border text-dashboard-text focus:ring-primary-500/50 text-right"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="active-status">مفعّل</Label>
              <Switch
                id="active-status"
                checked={editCode.isActive}
                onCheckedChange={(checked: boolean) => setEditCode({ ...editCode, isActive: checked })}
                className="data-[state=checked]:bg-primary-500"
              />
            </div>
          </div>
          <DialogFooter dir="rtl" className="flex flex-row-reverse sm:flex-row sm:justify-end gap-2">
            <Button 
              onClick={handleEditCode}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              حفظ التغييرات
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              className="bg-white border-dashboard-border text-dashboard-text hover:bg-dashboard-bg"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 