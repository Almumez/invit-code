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
import { PlusIcon, PencilIcon, TrashIcon, Code2, TicketIcon, SearchIcon, LoaderIcon, AlertCircleIcon, RefreshCwIcon } from 'lucide-react'

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center">
            <Code2 className="h-8 w-8 ml-3 text-purple-300" />
            رموز الدعوة
          </h1>
          <p className="text-white/70">
            إدارة رموز الدعوة للوصول الحصري
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Input
              placeholder="البحث عن رموز..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border-white/20 text-white pr-10 w-full sm:w-64 text-right"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          </div>
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="button-hover-effect bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border border-white/10">
                <PlusIcon className="h-4 w-4 ml-2" />
                رمز جديد
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl" className="glass-effect border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl">إضافة رمز دعوة جديد</DialogTitle>
                <DialogDescription className="text-white/70">
                  قم بإنشاء رمز دعوة جديد للمستخدمين
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-code" className="text-white">رمز الدعوة</Label>
                  <Input
                    id="new-code"
                    placeholder="أدخل رمز الدعوة"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="bg-white/5 border-white/20 text-white focus:ring-purple-400/50 text-right"
                  />
                </div>
              </div>
              <DialogFooter dir="rtl" className="flex flex-row-reverse sm:flex-row sm:justify-end gap-2">
                <Button 
                  onClick={handleAddCode}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  إضافة الرمز
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setAddDialogOpen(false)}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  إلغاء
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card className="glass-effect card-glow border-white/20 text-white">
        <CardHeader className="border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <TicketIcon className="h-5 w-5 ml-2 text-purple-300" />
                إدارة رموز الدعوة
              </CardTitle>
              <CardDescription className="text-white/70">
                عرض وتعديل وحذف رموز الدعوة الخاصة بك
              </CardDescription>
            </div>
            {isLoading ? null : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => fetchInviteCodes()}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-white/70 flex flex-col items-center justify-center">
              <LoaderIcon className="h-8 w-8 animate-spin mb-4 text-purple-400" />
              <div>جارِ تحميل رموز الدعوة...</div>
            </div>
          ) : error ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <AlertCircleIcon className="h-8 w-8 mb-4 text-red-400" />
              <div className="text-red-400">{error}</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchInviteCodes()}
                className="mt-4 bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCwIcon className="h-4 w-4 ml-2" />
                إعادة المحاولة
              </Button>
            </div>
          ) : filteredCodes.length === 0 ? (
            <div className="py-16 text-center text-white/70 flex flex-col items-center justify-center">
              {searchTerm ? (
                <>
                  <SearchIcon className="h-8 w-8 mb-4 text-white/50" />
                  <div>لم يتم العثور على رموز دعوة تطابق "{searchTerm}".</div>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-purple-400 hover:text-purple-300"
                  >
                    مسح البحث
                  </Button>
                </>
              ) : (
                <>
                  <TicketIcon className="h-8 w-8 mb-4 text-white/50" />
                  <div>لم يتم العثور على رموز دعوة. قم بإنشاء أول رمز باستخدام زر "رمز جديد".</div>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20 hover:bg-white/5">
                    <TableHead className="text-white/70">الرمز</TableHead>
                    <TableHead className="text-white/70">الحالة</TableHead>
                    <TableHead className="text-white/70">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-white/70 text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodes.map((code) => (
                    <TableRow key={code.id} className="border-white/20 hover:bg-white/5">
                      <TableCell className="font-medium">{code.code}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          code.isActive 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {code.isActive ? 'مفعّل' : 'غير مفعّل'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatDate(code.createdAt)}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex justify-end gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">حذف</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl" className="glass-effect border-white/20 text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف رمز الدعوة</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/70">
                                  هل أنت متأكد من رغبتك في حذف رمز الدعوة "{code.code}"؟ هذا الإجراء لا يمكن التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter dir="rtl" className="flex flex-row-reverse sm:flex-row sm:justify-end gap-2">
                                <AlertDialogAction
                                  className="bg-red-500/80 hover:bg-red-600 text-white"
                                  onClick={() => handleDeleteCode(code.id)}
                                >
                                  حذف
                                </AlertDialogAction>
                                <AlertDialogCancel className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                                  إلغاء
                                </AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
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
          <CardFooter className="border-t border-white/10 bg-white/5 py-3 px-6 flex justify-between text-xs text-white/50">
            <div>
              عرض {filteredCodes.length} {filteredCodes.length === 1 ? 'رمز' : 'رموز'}
              {searchTerm && ` تطابق "${searchTerm}"`}
            </div>
            <div>آخر تحديث: {format(new Date(), 'HH:mm yyyy/MM/dd', { locale: arSA })}</div>
          </CardFooter>
        )}
      </Card>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent dir="rtl" className="glass-effect border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">تعديل رمز الدعوة</DialogTitle>
            <DialogDescription className="text-white/70">
              تحديث تفاصيل رمز الدعوة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code" className="text-white">رمز الدعوة</Label>
              <Input
                id="edit-code"
                placeholder="أدخل رمز الدعوة"
                value={editCode.code}
                onChange={(e) => setEditCode({ ...editCode, code: e.target.value })}
                className="bg-white/5 border-white/20 text-white focus:ring-purple-400/50 text-right"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="active-status" className="text-white">مفعّل</Label>
              <Switch
                id="active-status"
                checked={editCode.isActive}
                onCheckedChange={(checked) => setEditCode({ ...editCode, isActive: checked })}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
          <DialogFooter dir="rtl" className="flex flex-row-reverse sm:flex-row sm:justify-end gap-2">
            <Button 
              onClick={handleEditCode}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              حفظ التغييرات
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 