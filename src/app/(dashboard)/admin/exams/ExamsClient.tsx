"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ClipboardList, Pencil, Trash2, Plus } from 'lucide-react'

export default function ExamsClient() {
  const supabase = createClient()
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', default_price: 0 })

  const fetchExams = async () => {
    setLoading(true)
    const { data } = await supabase.from('exams').select('*').order('created_at', { ascending: true })
    if (data) setExams(data)
    setLoading(false)
  }

  useEffect(() => { fetchExams() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await supabase.from('exams').update(formData).eq('id', editingId)
    } else {
      await supabase.from('exams').insert([formData])
    }
    setModalOpen(false)
    fetchExams()
  }

  const openEdit = (exam: any) => {
    setFormData({ name: exam.name, default_price: exam.default_price })
    setEditingId(exam.id)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este examen del catálogo? Todos los historiales que ya lo usaron conservarán sus precios copiados, pero no se podrá volver a asignar.')) {
      await supabase.from('exams').delete().eq('id', id)
      fetchExams()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-2xl font-bold flex items-center gap-3 text-[#0F2044]"><ClipboardList className="w-7 h-7 text-[#2C6E9E]"/> Catálogo de Exámenes</h1>
           <p className="text-slate-500 text-sm mt-1">Gestión de tarifario base y catálogo de estudios.</p>
         </div>
         <Button onClick={() => { setEditingId(null); setFormData({name:'', default_price: 0}); setModalOpen(true) }} className="bg-[#0F2044] hover:bg-[#0F2044]/90 text-white shadow-none">
           <Plus className="w-4 h-4 mr-2" /> Nuevo Examen
         </Button>
      </div>

      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
        <Table className="min-w-[500px]">
          <TableHeader className="bg-[#0F2044] hover:bg-[#0F2044]">
            <TableRow className="border-b-0 hover:bg-[#0F2044]">
              <TableHead className="font-medium text-white h-12">Nombre del Examen/Estudio</TableHead>
              <TableHead className="font-medium text-white h-12 w-[200px]">Precio Base ($)</TableHead>
              <TableHead className="text-right font-medium text-white h-12 w-[150px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
             <TableRow><TableCell colSpan={3} className="text-center py-12 text-slate-500">Cargando catálogo...</TableCell></TableRow>
            ) : exams.length === 0 ? (
             <TableRow><TableCell colSpan={3} className="text-center py-12 text-slate-500">No hay exámenes registrados</TableCell></TableRow>
            ) : (
               exams.map(e => (
                 <TableRow key={e.id} className="even:bg-[#F8F9FB] border-b-[#E2E8F0] hover:bg-slate-50 transition-colors">
                   <TableCell className="font-medium text-[#0F2044]">{e.name}</TableCell>
                   <TableCell className="text-slate-600 text-lg">${e.default_price.toLocaleString()}</TableCell>
                   <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(e)} className="hover:text-[#2C6E9E] hover:bg-[#2C6E9E]/10"><Pencil className="w-4 h-4 text-[#2C6E9E]" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} className="hover:text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4 text-rose-500" /></Button>
                   </TableCell>
                 </TableRow>
               ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
           <DialogHeader>
             <DialogTitle className="text-xl text-[#0F2044]">{editingId ? 'Editar Examen' : 'Registrar Examen'}</DialogTitle>
           </DialogHeader>
           <form onSubmit={handleSubmit} className="space-y-5 py-4">
              <div className="space-y-2">
                 <Label className="text-[#0F2044]">Nombre del Examen/Estudio <span className="text-rose-500">*</span></Label>
                 <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Biometría Hemática" className="border-[#CBD5E1] focus-visible:ring-[#2C6E9E] focus-visible:ring-1 focus-visible:ring-offset-0 shadow-none"/>
              </div>
              <div className="space-y-2">
                 <Label className="text-[#0F2044]">Precio Base Comercial ($) <span className="text-rose-500">*</span></Label>
                 <Input type="number" step="0.01" min="0" required value={formData.default_price} onChange={e => setFormData({...formData, default_price: parseFloat(e.target.value) || 0})} placeholder="450.00" className="border-[#CBD5E1] focus-visible:ring-[#2C6E9E] focus-visible:ring-1 focus-visible:ring-offset-0 shadow-none"/>
              </div>
              <Button type="submit" className="w-full bg-[#0F2044] hover:bg-[#0F2044]/90 text-white h-11 text-base shadow-none">Guardar en Catálogo</Button>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
