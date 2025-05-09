'use client'

import { useState, useEffect, Fragment } from 'react'
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
import MuiSwitch from '@mui/material/Switch';

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

  // حساب معدل النمو
  const calculateGrowthRate = (current: number, previous: number): string => {
    if (previous === 0) return '0%';
    const rate = ((current - previous) / previous) * 100;
    return `${rate > 0 ? '+' : ''}${Math.round(rate)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 bg-gradient-to-r from-primary-500/90 to-primary-700 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-sm mr-4">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">إدارة رموز الدعوة</h1>
                <p className="text-white/80 mt-1">
                  إدارة وتتبع {isLoadingStats ? "..." : stats.total} رمز دعوة ({isLoadingStats ? "..." : stats.active} نشط, {isLoadingStats ? "..." : stats.used} مستخدم)
                </p>
              </div>
            </div>
            
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <Button className="bg-white hover:bg-white/90 text-primary-600 font-medium shadow-sm w-full md:w-auto" onClick={() => setAddDialogOpen(true)}>
                <PlusIcon className="h-5 w-5 ml-2" />
                إضافة رمز جديد
              </Button>
              <DialogContent dir="rtl" className="bg-white border-dashboard-border text-dashboard-text shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-primary-700">إضافة رمز دعوة جديد</DialogTitle>
                  <DialogDescription className="text-dashboard-text-muted">
                    قم بإنشاء رمز دعوة جديد للمستخدمين
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <Label htmlFor="new-code" className="text-dashboard-text font-medium">رمز الدعوة</Label>
                    <Input
                      id="new-code"
                      placeholder="أدخل رمز الدعوة"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="bg-white border-gray-200 focus:border-primary-300 focus:ring-primary-300 text-dashboard-text h-12 text-lg shadow-sm"
                    />
                    <p className="text-xs text-dashboard-text-muted">
                      الرجاء إدخال رمز دعوة فريد غير مستخدم من قبل
                    </p>
                  </div>
                </div>
                <DialogFooter dir="rtl" className="flex flex-row-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                  <Button 
                    onClick={handleAddCode}
                    className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm h-11"
                  >
                    إضافة الرمز
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setAddDialogOpen(false)}
                    className="bg-white border-gray-200 text-dashboard-text hover:bg-gray-50 h-11"
                  >
                    إلغاء
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Search and Filter Bar */}
      <Card className="border border-dashboard-border shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
            <Input
              placeholder="البحث عن رموز الدعوة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-gray-200 focus:border-primary-300 focus:ring-primary-300 text-dashboard-text pr-12 h-12 text-lg w-full shadow-sm"
            />
          </div>
          
          <div className="flex items-center min-w-[200px]">
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-full h-12 bg-white border-gray-200 text-dashboard-text shadow-sm">
                <div className="flex items-center">
                  <FilterIcon className="h-4 w-4 ml-2 text-primary-500" />
                  <SelectValue placeholder="كل الرموز" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-dashboard-border text-dashboard-text">
                <SelectItem value="all">كل الرموز</SelectItem>
                <SelectItem value="active">الرموز النشطة</SelectItem>
                <SelectItem value="inactive">الرموز الغير نشطة</SelectItem>
                <SelectItem value="scanned">تم مسحها</SelectItem>
                <SelectItem value="not_scanned">لم يتم المسح</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {!isLoading && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => fetchInviteCodes()}
              className="h-12 w-12 text-primary-500 border-gray-200 hover:border-primary-300 hover:bg-primary-50 shadow-sm"
            >
              <RefreshCwIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
      </Card>
      
      {/* Main Card */}
      <Card className="bg-white shadow-md border-dashboard-border">
        <CardHeader className="border-b border-dashboard-border bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center text-lg font-semibold text-dashboard-text">
                <TicketIcon className="h-5 w-5 ml-2 text-primary-500" />
                قائمة رموز الدعوة
              </CardTitle>
              <CardDescription className="text-dashboard-text-muted mt-1">
                عرض وتعديل وحذف رموز الدعوة الخاصة بك
              </CardDescription>
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
              <Table className="w-full text-right">
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-dashboard-border hover:bg-gray-50/80">
                    <TableHead className="text-dashboard-text-muted font-medium py-4 px-6 w-1/4 text-center">الرمز</TableHead>
                    <TableHead className="text-dashboard-text-muted font-medium py-4 px-6 w-1/6 text-center">الحالة</TableHead>
                    <TableHead className="text-dashboard-text-muted font-medium py-4 px-6 w-1/6 text-center">حالة المسح</TableHead>
                    <TableHead className="text-dashboard-text-muted font-medium py-4 px-6 w-1/4 text-center">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-dashboard-text-muted font-medium py-4 px-6 w-1/6 text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inviteCodes.map((code, index) => (
                    <TableRow 
                      key={code.id} 
                      className={`border-b border-dashboard-border transition-colors hover:bg-primary-50/20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      <TableCell className="font-medium text-dashboard-text py-4 px-6 text-center">
                        {code.code}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium 
                            ${code.isActive 
                              ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm' 
                              : 'bg-red-100 text-red-700 border border-red-200 shadow-sm'
                            }`}
                          >
                            {code.isActive ? 'مفعّل' : 'غير مفعّل'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium 
                            ${!code.isActive 
                              ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm' 
                              : 'bg-gray-100 text-gray-700 border border-gray-200 shadow-sm'
                            }`}
                          >
                            {!code.isActive ? 'تم المسح' : 'لم يتم المسح'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-dashboard-text-muted py-4 px-6 text-center">
                        {formatDate(code.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full"
                            onClick={() => openEditDialog(code)}
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">تعديل</span>
                          </Button>
                          
                          <AlertDialog 
                            open={deleteDialogOpen.open && deleteDialogOpen.codeId === code.id} 
                            onOpenChange={(open) => setDeleteDialogOpen({open, codeId: open ? code.id : null})}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">حذف</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl" className="bg-white border-dashboard-border text-dashboard-text shadow-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-semibold text-red-600">حذف رمز الدعوة</AlertDialogTitle>
                                <AlertDialogDescription className="text-dashboard-text-muted">
                                  هل أنت متأكد من رغبتك في حذف رمز الدعوة "<span className="font-medium text-dashboard-text">{code.code}</span>"؟ 
                                  <br />هذا الإجراء لا يمكن التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter dir="rtl" className="flex flex-row-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600 text-white shadow-sm h-11"
                                  onClick={() => handleDeleteCode(code.id)}
                                >
                                  نعم، احذف الرمز
                                </AlertDialogAction>
                                <AlertDialogCancel className="bg-white border-gray-200 text-dashboard-text hover:bg-gray-50 h-11">
                                  إلغاء
                                </AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
            
            {/* Pagination */}
            {!isLoading && !error && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(1)}
                    disabled={currentPage === 1}
                    className="h-10 w-10 p-0 bg-white border-gray-200 text-dashboard-text hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 disabled:opacity-50"
                  >
                    <span className="sr-only">الصفحة الأولى</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mirror-rtl"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 w-10 p-0 bg-white border-gray-200 text-dashboard-text hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 disabled:opacity-50"
                  >
                    <span className="sr-only">الصفحة السابقة</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mirror-rtl"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first page, last page, current page, and pages around current page
                        return (
                          page === 1 || 
                          page === pagination.totalPages || 
                          Math.abs(page - currentPage) <= 1
                        )
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there are skipped pages
                        const prevPage = array[index - 1];
                        const showEllipsisBefore = prevPage && page - prevPage > 1;
                        
                        return (
                          <Fragment key={page}>
                            {showEllipsisBefore && (
                              <div className="h-10 w-10 flex items-center justify-center text-dashboard-text-muted">
                                ...
                              </div>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(page)}
                              className={`h-10 w-10 p-0 ${
                                currentPage === page 
                                  ? 'bg-primary-600 hover:bg-primary-700 text-white font-medium' 
                                  : 'bg-white border-gray-200 text-dashboard-text hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200'
                              }`}
                            >
                              {page}
                            </Button>
                          </Fragment>
                        )
                      })
                  }
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="h-10 w-10 p-0 bg-white border-gray-200 text-dashboard-text hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 disabled:opacity-50"
                  >
                    <span className="sr-only">الصفحة التالية</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mirror-rtl"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(pagination.totalPages)}
                    disabled={currentPage === pagination.totalPages}
                    className="h-10 w-10 p-0 bg-white border-gray-200 text-dashboard-text hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 disabled:opacity-50"
                  >
                    <span className="sr-only">الصفحة الأخيرة</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mirror-rtl"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                  </Button>
                </div>
              </div>
            )}
            
            <div className="text-xs text-dashboard-text-muted">
              صفحة {currentPage} من {pagination.totalPages}
            </div>
          </CardFooter>
        )}
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent dir="rtl" className="bg-white border-dashboard-border text-dashboard-text shadow-lg rounded-xl max-w-md mx-auto">
          <DialogHeader className="pb-2 border-b border-gray-100">
            <DialogTitle className="text-xl font-semibold text-primary-700 flex items-center">
              <PencilIcon className="h-5 w-5 ml-2 text-primary-500" />
              تعديل رمز الدعوة
            </DialogTitle>
            <DialogDescription className="text-dashboard-text-muted mt-1">
              قم بتعديل معلومات رمز الدعوة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-5">
            <div className="space-y-3">
              <Label htmlFor="edit-code" className="text-dashboard-text font-medium flex items-center">
                <TicketIcon className="h-4 w-4 ml-2 text-primary-500" />
                رمز الدعوة
              </Label>
              <Input
                id="edit-code"
                placeholder="أدخل رمز الدعوة"
                value={editCode.code}
                onChange={(e) => setEditCode({ ...editCode, code: e.target.value })}
                className="bg-white border-gray-200 focus:border-primary-400 focus:ring-primary-400 text-dashboard-text h-12 text-lg shadow-sm rounded-lg"
              />
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100 transition-all hover:bg-blue-100/50">
                <Label 
                  htmlFor="is-active" 
                  className="text-dashboard-text font-medium cursor-pointer select-none flex items-center"
                >
                  <CheckCircleIcon className="h-4 w-4 ml-2 text-blue-600" />
                  <span>حالة الرمز</span>
                  <span className="mr-2 text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">
                    {editCode.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </Label>
                <MuiSwitch
                  id="is-active"
                  checked={editCode.isActive}
                  onChange={(e) => setEditCode({ ...editCode, isActive: e.target.checked })}
                  sx={{
                    width: 42,
                    height: 22,
                    padding: 0,
                    transform: 'scaleX(-1)',
                    '& .MuiSwitch-switchBase': {
                      padding: 0,
                      margin: '1px',
                      transitionDuration: '300ms',
                      '&.Mui-checked': {
                        transform: 'translateX(20px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#1d4ed8',
                          opacity: 1,
                          border: 0,
                        },
                      },
                      '&.Mui-focusVisible .MuiSwitch-thumb': {
                        border: '2px solid #fff',
                        boxShadow: '0 0 0 4px rgba(29, 78, 216, 0.2)',
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      boxSizing: 'border-box',
                      width: 20,
                      height: 20,
                      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 11,
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      opacity: 1,
                      transition: 'background-color 0.2s, opacity 0.2s',
                    },
                    '&:hover': {
                      '& .MuiSwitch-track': {
                        backgroundColor: 'rgba(0,0,0,0.3)',
                      },
                      '& .Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#1e40af !important',
                      },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-dashboard-text-muted mt-2 mr-1 flex items-center">
                <AlertCircleIcon className="h-3 w-3 ml-1 text-gray-400" />
                الرموز غير النشطة لا يمكن استخدامها للمسح
              </p>
            </div>
          </div>
          <DialogFooter dir="rtl" className="flex flex-row-reverse sm:flex-row sm:justify-end gap-3 pt-3 border-t border-gray-100">
            <Button 
              onClick={handleEditCode}
              className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm h-11 px-5 rounded-lg transition-colors"
            >
              <CheckCircleIcon className="h-5 w-5 ml-2" />
              حفظ التغييرات
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              className="bg-white border-gray-200 text-dashboard-text hover:bg-gray-50 h-11 px-5 rounded-lg transition-colors"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 