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
  DialogTitle
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
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
  FilterIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  BarChart3Icon,
  CalculatorIcon
} from 'lucide-react'

// مكون البطاقة الإحصائية
function StatCard({ title, value, icon, description, isLoading, className }: { 
  title: string
  value: number | string
  icon: React.ReactNode
  description?: string
  isLoading: boolean
  className?: string
}) {
  return (
    <Card className={`bg-white shadow-sm border-dashboard-border ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dashboard-text-muted">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-dashboard-text">
              {isLoading ? "..." : value}
            </h3>
            {description && (
              <p className="text-xs mt-1 text-dashboard-text-muted">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function InviteCodesPage() {
  const { 
    inviteCodes, 
    pagination,
    stats,
    isLoading,
    isLoadingStats,
    error,
    currentPage,
    searchTerm,
    filterStatus,
    fetchInviteCodes, 
    fetchStats,
    setPage,
    setSearchTerm,
    setFilterStatus,
    addInviteCode, 
    updateInviteCode, 
    deleteInviteCode
  } = useInviteStore()
  
  const [newCode, setNewCode] = useState('')
  const [editCode, setEditCode] = useState({ id: '', code: '', isActive: true })
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  
  // حالة لمربع الحوار التأكيدي
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{open: boolean, codeId: string | null}>({
    open: false,
    codeId: null
  })
  
  useEffect(() => {
    fetchInviteCodes()
    fetchStats()
  }, [fetchInviteCodes, fetchStats])
  
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

  // تنسيق التاريخ بالعربية
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: arSA })
  }

  // المكون الخاص بزر الصفحة
  const PaginationButton = ({ page, isActive, onClick }: { page: number, isActive: boolean, onClick: () => void }) => (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={`h-8 w-8 p-0 ${isActive 
        ? 'bg-primary-500 hover:bg-primary-600 text-white' 
        : 'bg-white border-dashboard-border text-dashboard-text hover:bg-dashboard-bg'}`}
    >
      {page}
    </Button>
  )
  
  // حساب معدل النمو
  const calculateGrowthRate = (current: number, previous: number): string => {
    if (previous === 0) return '0%';
    const rate = ((current - previous) / previous) * 100;
    return `${rate > 0 ? '+' : ''}${Math.round(rate)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="materio-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="materio-gradient-primary w-10 h-10 rounded-lg flex items-center justify-center shadow-sm mr-4">
                <TicketIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dashboard-text">إدارة رموز الدعوة</h1>
                <p className="text-dashboard-text-muted text-sm">
                  إدارة وتتبع {isLoadingStats ? "..." : stats.total} رمز دعوة ({isLoadingStats ? "..." : stats.active} نشط, {isLoadingStats ? "..." : stats.used} مستخدم)
                </p>
              </div>
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
                <Button className="bg-dashboard-accent hover:bg-dashboard-accent-hover text-white shadow-sm" onClick={() => setAddDialogOpen(true)}>
                  <PlusIcon className="h-4 w-4 ml-2" />
                  رمز جديد
                </Button>
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
      
      {/* Main Card */}
      <Card className="bg-white shadow-sm border-dashboard-border">
        <CardHeader className="border-b border-dashboard-border bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center text-lg font-semibold text-dashboard-text">
                <TicketIcon className="h-5 w-5 ml-2 text-primary-500" />
                رموز الدعوة
              </CardTitle>
              <CardDescription className="text-dashboard-text-muted mt-1">
                عرض وتعديل وحذف رموز الدعوة الخاصة بك
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <div className="flex items-center">
                <FilterIcon className="h-4 w-4 ml-2 text-dashboard-text-muted" />
                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value)}
                >
                  <SelectTrigger className="w-[160px] bg-dashboard-bg border-dashboard-border text-dashboard-text">
                    <SelectValue placeholder="كل الرموز" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-dashboard-border text-dashboard-text">
                    <SelectItem value="all">كل الرموز</SelectItem>
                    <SelectItem value="active">الرموز النشطة</SelectItem>
                    <SelectItem value="inactive">الرموز الغير نشطة</SelectItem>
                    <SelectItem value="scanned">تم مسحها</SelectItem>
                    <SelectItem value="not_scanned">لم يتم مسحها</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {!isLoading && (
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
          ) : inviteCodes.length === 0 ? (
            <div className="py-16 text-center text-dashboard-text-muted flex flex-col items-center justify-center">
              {searchTerm || filterStatus !== "all" ? (
                <>
                  <SearchIcon className="h-8 w-8 mb-4 text-dashboard-text-muted" />
                  <div>لم يتم العثور على رموز دعوة تطابق معايير التصفية.</div>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className="mt-2 text-primary-500 hover:text-primary-600"
                  >
                    إعادة ضبط التصفية
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
                    <TableHead className="text-dashboard-text-muted">حالة المسح</TableHead>
                    <TableHead className="text-dashboard-text-muted">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-dashboard-text-muted text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inviteCodes.map((code) => (
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
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          !code.isActive 
                            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {!code.isActive ? 'تم المسح' : 'لم يتم المسح'}
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
        {!isLoading && !error && inviteCodes.length > 0 && (
          <CardFooter className="border-t border-dashboard-border bg-white py-3 px-6 flex flex-col sm:flex-row justify-between gap-3 items-center">
            <div className="text-xs text-dashboard-text-muted">
              عرض {inviteCodes.length} من إجمالي {isLoadingStats ? "..." : stats.total} رمز
              {(searchTerm || filterStatus !== "all") && " بعد التصفية"}
            </div>
            
            {/* عناصر الترقيم */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                  disabled={!pagination.hasPrevPage}
                  className="h-8 w-8 p-0 bg-white border-dashboard-border text-dashboard-text hover:bg-dashboard-bg"
                >
                  <span className="sr-only">الصفحة الأولى</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-180"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="h-8 w-8 p-0 bg-white border-dashboard-border text-dashboard-text hover:bg-dashboard-bg"
                >
                  <span className="sr-only">الصفحة السابقة</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-180"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </Button>
                
                <div className="flex items-center justify-center gap-1">
                  {/* عرض أزرار الصفحات */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    // حساب أرقام الصفحات المعروضة
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1; // عرض كل الصفحات إذا كان عددها 5 أو أقل
                    } else {
                      // منطق عرض الصفحات عندما يكون هناك أكثر من 5
                      if (currentPage <= 3) {
                        pageNum = i + 1; // عرض الصفحات 1-5
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i; // عرض آخر 5 صفحات
                      } else {
                        pageNum = currentPage - 2 + i; // عرض الصفحة الحالية في المنتصف
                      }
                    }
                    
                    return (
                      <PaginationButton
                        key={pageNum}
                        page={pageNum}
                        isActive={pageNum === currentPage}
                        onClick={() => setPage(pageNum)}
                      />
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="h-8 w-8 p-0 bg-white border-dashboard-border text-dashboard-text hover:bg-dashboard-bg"
                >
                  <span className="sr-only">الصفحة التالية</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                  className="h-8 w-8 p-0 bg-white border-dashboard-border text-dashboard-text hover:bg-dashboard-bg"
                >
                  <span className="sr-only">الصفحة الأخيرة</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                </Button>
              </div>
            )}
            
            <div className="text-xs text-dashboard-text-muted">
              صفحة {currentPage} من {pagination.totalPages}
            </div>
          </CardFooter>
        )}
      </Card>

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