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
  FilterIcon
} from 'lucide-react'

export default function InviteCodesPage() {
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
  const [filterStatus, setFilterStatus] = useState<string>("all")
  
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

  // فلترة وتصفية رموز الدعوة
  const filteredCodes = inviteCodes.filter(code => {
    // فلترة حسب البحث
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase())
    
    // فلترة حسب الحالة
    if (filterStatus === "active") {
      return matchesSearch && code.isActive
    } else if (filterStatus === "inactive") {
      return matchesSearch && !code.isActive
    } else if (filterStatus === "scanned") {
      return matchesSearch && !code.isActive // الرموز الممسوحة هي الغير مفعلة
    } else if (filterStatus === "not_scanned") {
      return matchesSearch && code.isActive // الرموز الغير ممسوحة هي المفعلة
    }
    
    // في حالة الكل، نعرض فقط ما يطابق البحث
    return matchesSearch
  })

  // تنسيق التاريخ بالعربية
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: arSA })
  }

  // إحصائيات للرموز
  const totalCodes = inviteCodes.length
  const activeCodes = inviteCodes.filter(code => code.isActive).length
  const scannedCodes = inviteCodes.filter(code => !code.isActive).length
  
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
                  إدارة وتتبع {totalCodes} رمز دعوة ({activeCodes} نشط, {scannedCodes} مستخدم)
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
                  onChange={(value) => setFilterStatus(value)}
                  placeholder="تصفية حسب الحالة"
                  className="w-[160px]"
                  size="small"
                  sx={{ 
                    '& .MuiSelect-select': { 
                      fontSize: '0.875rem',
                      paddingY: '0.5rem',
                      backgroundColor: 'var(--dashboard-bg)',
                      borderColor: 'var(--dashboard-border)'
                    }
                  }}
                >
                  <SelectItem value="all">كل الرموز</SelectItem>
                  <SelectItem value="active">الرموز النشطة</SelectItem>
                  <SelectItem value="inactive">الرموز الغير نشطة</SelectItem>
                  <SelectItem value="scanned">تم مسحها</SelectItem>
                  <SelectItem value="not_scanned">لم يتم مسحها</SelectItem>
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
          ) : filteredCodes.length === 0 ? (
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
        {!isLoading && !error && filteredCodes.length > 0 && (
          <CardFooter className="border-t border-dashboard-border bg-white py-3 px-6 flex justify-between text-xs text-dashboard-text-muted">
            <div>
              عرض {filteredCodes.length} {filteredCodes.length === 1 ? 'رمز' : 'رموز'}
              {(searchTerm || filterStatus !== "all") && " بعد التصفية"}
            </div>
            <div>آخر تحديث: {format(new Date(), 'HH:mm yyyy/MM/dd', { locale: arSA })}</div>
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