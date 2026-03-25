"use client"
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Pencil, Trash2, Plus, Upload, Download } from 'lucide-react'
import Papa from 'papaparse'

export default function PatientsClient({ initialCompanies }: any) {
  const supabase = createClient()
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ full_name: '', company_id: '', appointment_date: new Date().toISOString().split('T')[0] })

  const fetchPatients = async () => {
    setLoading(true)
    const { data } = await supabase.from('patients').select('*, companies(name)').order('created_at', { ascending: false })
    if (data) setPatients(data)
    setLoading(false)
  }

  useEffect(() => { fetchPatients() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Convertir string vacio a null para company_id si es necesario para Supabase FK restriction
    const payload = { ...formData, company_id: formData.company_id || null }

    if (editingId) {
      await supabase.from('patients').update(payload).eq('id', editingId)
    } else {
      await supabase.from('patients').insert([payload])
    }
    setModalOpen(false)
    fetchPatients()
  }

  const openEdit = (p: any) => {
    setFormData({ full_name: p.full_name, company_id: p.company_id || '', appointment_date: p.appointment_date || '' })
    setEditingId(p.id)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este paciente permanentemente?')) {
      await supabase.from('patients').delete().eq('id', id)
      fetchPatients()
    }
  }

  const downloadTemplate = () => {
     const csv = "Nombre Completo,Empresa\nJuan Perez,Acme Corp\nMaria Gomez,Acme Corp"
     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
     const url = URL.createObjectURL(blob)
     const a = document.createElement('a')
     a.href = url
     a.download = 'plantilla_pacientes.csv'
     a.click()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0]
     if (!file) return

     Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
           const rows = results.data as any[]
           const inserts = []
           for (const row of rows) {
              const name = row['Nombre Completo']
              const compName = row['Empresa']
              if (!name) continue
              
              const comp = initialCompanies.find((c: any) => c.name.toLowerCase() === compName?.trim()?.toLowerCase())
              inserts.push({
                 full_name: name,
                 company_id: comp ? comp.id : null,
                 appointment_date: new Date().toISOString().split('T')[0] // Se asignan para hoy por defecto para empezar el proceso
              })
           }
           if (inserts.length > 0) {
              await supabase.from('patients').insert(inserts)
              fetchPatients()
              alert(`Se importaron ${inserts.length} pacientes correctamente.`)
           }
           if (fileInputRef.current) fileInputRef.current.value = ''
        }
     })
  }

  const getStatusBadge = (status: string) => {
     let classes = "bg-slate-100 text-slate-700 border-slate-200"
     if (status === 'Pendiente') classes = "bg-amber-50 text-amber-700 border-amber-200"
     if (status === 'En Toma de Muestras' || status === 'En Consultorio') classes = "bg-blue-50 text-[#2C6E9E] border-blue-200"
     if (status === 'Finalizado') classes = "bg-emerald-50 text-[#2A7D5F] border-emerald-200"
     
     return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>{status}</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-2xl font-bold flex items-center gap-3 text-[#0F2044]"><Users className="w-7 h-7 text-[#2C6E9E]"/> Base de Pacientes</h1>
           <p className="text-slate-500 text-sm mt-1">Directorio médico y estatus de atención en piso.</p>
         </div>
         <div className="flex flex-wrap gap-3">
           <Button variant="outline" onClick={downloadTemplate} className="border-[#2C6E9E] text-[#2C6E9E] hover:bg-[#2C6E9E]/10 bg-transparent shadow-none"><Download className="w-4 h-4 mr-2" /> Plantilla CSV</Button>
           <div>
              <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="border-[#E2E8F0] text-slate-700 hover:bg-slate-50 shadow-none"><Upload className="w-4 h-4 mr-2" /> Importar CSV</Button>
           </div>
           <Button onClick={() => { setEditingId(null); setFormData({full_name:'', company_id: '', appointment_date: new Date().toISOString().split('T')[0]}); setModalOpen(true) }} className="bg-[#0F2044] hover:bg-[#0F2044]/90 text-white shadow-none">
             <Plus className="w-4 h-4 mr-2" /> Nuevo Paciente
           </Button>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader className="bg-[#0F2044] hover:bg-[#0F2044]">
            <TableRow className="border-b-0 hover:bg-[#0F2044]">
              <TableHead className="font-medium text-white h-12">Nombre Completo</TableHead>
              <TableHead className="font-medium text-white h-12">Empresa Asignada</TableHead>
              <TableHead className="font-medium text-white h-12">Fecha Cita</TableHead>
              <TableHead className="font-medium text-white h-12">Estado Interno</TableHead>
              <TableHead className="text-right font-medium text-white h-12">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
             <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">Cargando censo de pacientes...</TableCell></TableRow>
            ) : patients.length === 0 ? (
             <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">No hay pacientes registrados</TableCell></TableRow>
            ) : (
               patients.map(p => (
                 <TableRow key={p.id} className="even:bg-[#F8F9FB] border-b-[#E2E8F0] hover:bg-slate-50 transition-colors">
                   <TableCell className="font-medium text-[#0F2044]">{p.full_name}</TableCell>
                   <TableCell className="text-slate-600">{p.companies?.name || <span className="text-slate-400 font-normal italic">No asignada</span>}</TableCell>
                   <TableCell className="text-slate-600">{p.appointment_date}</TableCell>
                   <TableCell>
                     {getStatusBadge(p.status)}
                   </TableCell>
                   <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="hover:text-[#2C6E9E] hover:bg-[#2C6E9E]/10"><Pencil className="w-4 h-4 text-[#2C6E9E]" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="hover:text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4 text-rose-500" /></Button>
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
             <DialogTitle className="text-xl text-[#0F2044]">{editingId ? 'Editar Paciente' : 'Registrar Paciente Manual'}</DialogTitle>
           </DialogHeader>
           <form onSubmit={handleSubmit} className="space-y-5 py-4">
              <div className="space-y-2">
                 <Label className="text-[#0F2044]">Nombre Completo <span className="text-rose-500">*</span></Label>
                 <Input required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="Ej. Juan Pérez" className="border-[#CBD5E1] focus-visible:ring-[#2C6E9E] focus-visible:ring-1 focus-visible:ring-offset-0 shadow-none"/>
              </div>
              <div className="space-y-2">
                 <Label className="text-[#0F2044]">Empresa Perteneciente <span className="text-slate-400 font-normal">(Opcional)</span></Label>
                 <select className="flex h-11 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2C6E9E] shadow-none text-slate-700" 
                         value={formData.company_id} onChange={e => setFormData({...formData, company_id: e.target.value})}>
                    <option value="">Seleccionar Empresa...</option>
                    {initialCompanies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <Label className="text-[#0F2044]">Fecha de Cita Programada</Label>
                 <Input type="date" required value={formData.appointment_date} onChange={e => setFormData({...formData, appointment_date: e.target.value})} className="border-[#CBD5E1] focus-visible:ring-[#2C6E9E] focus-visible:ring-1 focus-visible:ring-offset-0 shadow-none"/>
              </div>
              <Button type="submit" className="w-full bg-[#0F2044] hover:bg-[#0F2044]/90 text-white h-11 text-base shadow-none">Guardar Paciente</Button>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
