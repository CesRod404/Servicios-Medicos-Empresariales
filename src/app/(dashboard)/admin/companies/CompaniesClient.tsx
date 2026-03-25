"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from '@/components/ui/switch'
import { Building2, Pencil, Trash2, Plus } from 'lucide-react'

export default function CompaniesClient() {
  const supabase = createClient()
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', active: true })

  const fetchCompanies = async () => {
    setLoading(true)
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false })
    if (data) setCompanies(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await supabase.from('companies').update(formData).eq('id', editingId)
    } else {
      await supabase.from('companies').insert([formData])
    }
    setModalOpen(false)
    fetchCompanies()
  }

  const openEdit = (comp: any) => {
    setFormData({ name: comp.name, email: comp.email || '', phone: comp.phone || '', active: comp.active })
    setEditingId(comp.id)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar empresa y todos sus empleados? Esta acción causará borrado en cascada.')) {
      await supabase.from('companies').delete().eq('id', id)
      fetchCompanies()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-2xl font-bold flex items-center gap-3 text-[#0F2044]">
             <Building2 className="w-7 h-7 text-[#2C6E9E]"/> Directorio de Empresas
           </h1>
           <p className="text-slate-500 text-sm mt-1">Gestión de corporativos y clientes activos.</p>
         </div>
         <Button onClick={() => { setEditingId(null); setFormData({name:'', email:'', phone:'', active: true}); setModalOpen(true) }} className="bg-[#0F2044] hover:bg-[#0F2044]/90 text-white shadow-none">
           <Plus className="w-4 h-4 mr-2" /> Nueva Empresa
         </Button>
      </div>

      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader className="bg-[#0F2044] hover:bg-[#0F2044]">
            <TableRow className="border-b-0 hover:bg-[#0F2044]">
              <TableHead className="font-medium text-white h-12">Nombre</TableHead>
              <TableHead className="font-medium text-white h-12">Email</TableHead>
              <TableHead className="font-medium text-white h-12">Teléfono</TableHead>
              <TableHead className="font-medium text-white h-12">Estado</TableHead>
              <TableHead className="text-right font-medium text-white h-12">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
             <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">Cargando directorio empresarial...</TableCell></TableRow>
            ) : companies.length === 0 ? (
             <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">No hay empresas registradas</TableCell></TableRow>
            ) : (
               companies.map(c => (
                 <TableRow key={c.id} className="even:bg-[#F8F9FB] border-b-[#E2E8F0] hover:bg-slate-50 transition-colors">
                   <TableCell className="font-medium text-[#0F2044]">{c.name}</TableCell>
                   <TableCell className="text-slate-600">{c.email}</TableCell>
                   <TableCell className="text-slate-600">{c.phone}</TableCell>
                   <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.active ? 'bg-emerald-50 text-[#2A7D5F] border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {c.active ? 'Activa' : 'Inactiva'}
                      </span>
                   </TableCell>
                   <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)} className="hover:text-[#2C6E9E] hover:bg-[#2C6E9E]/10"><Pencil className="w-4 h-4 text-[#2C6E9E]" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="hover:text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4 text-rose-500" /></Button>
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
             <DialogTitle className="text-xl text-[#0F2044]">{editingId ? 'Editar Empresa' : 'Registrar Empresa'}</DialogTitle>
           </DialogHeader>
           <form onSubmit={handleSubmit} className="space-y-5 py-4">
              <div className="space-y-2">
                 <Label className="text-[#0F2044]">Nombre de Empresa <span className="text-rose-500">*</span></Label>
                 <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Acme Corp" className="border-[#CBD5E1] focus-visible:ring-[#2C6E9E] focus-visible:ring-1 focus-visible:ring-offset-0 shadow-none"/>
              </div>
              <div className="space-y-2">
                 <Label className="text-[#0F2044]">Email Comercial <span className="text-slate-400 font-normal">(Opcional)</span></Label>
                 <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contacto@acme.com" className="border-[#CBD5E1] focus-visible:ring-[#2C6E9E] focus-visible:ring-1 focus-visible:ring-offset-0 shadow-none"/>
              </div>
              <div className="space-y-2">
                 <Label className="text-[#0F2044]">Teléfono Fijo / Móvil <span className="text-slate-400 font-normal">(Opcional)</span></Label>
                 <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="55 1234 5678" className="border-[#CBD5E1] focus-visible:ring-[#2C6E9E] focus-visible:ring-1 focus-visible:ring-offset-0 shadow-none"/>
              </div>
              <div className="flex items-center justify-between border border-[#E2E8F0] p-4 rounded-xl bg-[#F8F9FB]">
                 <div className="space-y-0.5">
                     <Label className="text-sm font-medium text-[#0F2044]">Estado Activo</Label>
                     <p className="text-xs text-slate-500">Permitir agendar citas a esta corporación.</p>
                 </div>
                 <Switch checked={formData.active} onCheckedChange={c => setFormData({...formData, active: c})} />
              </div>
              <Button type="submit" className="w-full bg-[#0F2044] hover:bg-[#0F2044]/90 text-white h-11 text-base shadow-none">Guardar Empresa</Button>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
