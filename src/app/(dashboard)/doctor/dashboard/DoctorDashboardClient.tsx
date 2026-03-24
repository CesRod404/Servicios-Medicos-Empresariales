"use client"
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const STATUSES = ['Por llegar', 'En examen médico', 'En laboratorio', 'En rayos x', 'Finalizado']

export default function DoctorDashboardClient({ initialCompanies, initialExams }: any) {
  const supabase = createClient()
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [search, setSearch] = useState('')
  const [compFilter, setCompFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Modal State
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedExams, setSelectedExams] = useState<string[]>([])
  const [isPaid, setIsPaid] = useState(false)

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('patients').select('*, companies(name)').eq('appointment_date', date)
    
    if (search) query = query.ilike('full_name', `%${search}%`)
    if (compFilter) query = query.eq('company_id', compFilter)
    if (statusFilter) query = query.eq('status', statusFilter)

    const { data, error } = await query
    if (!error && data) {
      setPatients(data)
    }
    setLoading(false)
  }, [date, search, compFilter, statusFilter, supabase])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('patients').update({ status: newStatus }).eq('id', id)
    if (newStatus === 'Finalizado') {
       const patient = patients.find(p => p.id === id)
       // Buscar si ya tiene exámenes previos
       const { data: existingExams } = await supabase.from('patient_exams').select('exam_id').eq('patient_id', id)
       setSelectedExams(existingExams ? existingExams.map((e:any) => e.exam_id) : [])
       
       setSelectedPatient(patient)
       setIsPaid(patient?.payment_status || false)
       setModalOpen(true)
    }
    fetchPatients()
  }

  const saveChecklist = async () => {
     if (!selectedPatient) return;
     // Delete old exams
     await supabase.from('patient_exams').delete().eq('patient_id', selectedPatient.id)
     // Insert new
     const inserts = selectedExams.map(examId => {
        const exam = initialExams.find((e: any) => e.id === examId)
        return {
           patient_id: selectedPatient.id,
           exam_id: examId,
           price_charged: exam?.default_price || 0
        }
     })
     if (inserts.length > 0) {
        await supabase.from('patient_exams').insert(inserts)
     }
     
     // Update payment status
     await supabase.from('patients').update({ payment_status: isPaid }).eq('id', selectedPatient.id)
     
     setModalOpen(false)
     fetchPatients()
  }

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-2xl font-bold text-[#0F2044]">Pacientes del Día</h1>
           <p className="text-slate-500 text-sm mt-1">Control activo de atención médica, signos vitales y caja.</p>
         </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-5 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E2E8F0] items-end">
         <div className="space-y-1.5">
            <Label className="text-[#0F2044] font-medium">Fecha de Cita</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="border-[#CBD5E1] focus-visible:ring-[#2C6E9E] focus-visible:ring-1 focus-visible:ring-offset-0 shadow-none"/>
         </div>
         <div className="space-y-1.5 flex-1 min-w-[200px]">
            <Label className="text-[#0F2044] font-medium">Buscar Paciente</Label>
            <Input placeholder="Escribe un nombre..." value={search} onChange={e => setSearch(e.target.value)} className="border-[#CBD5E1] focus-visible:ring-[#2C6E9E] focus-visible:ring-1 focus-visible:ring-offset-0 shadow-none" />
         </div>
         <div className="space-y-1.5 min-w-[180px]">
            <Label className="text-[#0F2044] font-medium">Empresa</Label>
            <select className="flex h-10 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2C6E9E] shadow-none text-slate-700" 
                    value={compFilter} onChange={e => setCompFilter(e.target.value)}>
               <option value="">Todas</option>
               {initialCompanies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
         </div>
         <div className="space-y-1.5 min-w-[180px]">
            <Label className="text-[#0F2044] font-medium">Estado</Label>
            <select className="flex h-10 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2C6E9E] shadow-none text-slate-700" 
                    value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
               <option value="">Todos</option>
               {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0F2044] hover:bg-[#0F2044]">
            <TableRow className="border-b-0 hover:bg-[#0F2044]">
              <TableHead className="font-medium text-white h-12">Nombre Completo</TableHead>
              <TableHead className="font-medium text-white h-12">Empresa</TableHead>
              <TableHead className="font-medium text-white h-12">Estado Actual</TableHead>
              <TableHead className="font-medium text-white h-12">Pago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow><TableCell colSpan={4} className="text-center py-12 text-slate-500 font-medium">Cargando...</TableCell></TableRow>
            ) : patients.length === 0 ? (
               <TableRow><TableCell colSpan={4} className="text-center py-12 text-slate-500 font-medium">No hay pacientes con ese criterio</TableCell></TableRow>
            ) : (
               patients.map(p => (
                 <TableRow key={p.id} className="even:bg-[#F8F9FB] border-b-[#E2E8F0] hover:bg-slate-50 transition-colors">
                   <TableCell className="font-medium text-[#0F2044]">{p.full_name}</TableCell>
                   <TableCell className="text-slate-600 font-medium">{p.companies?.name || <span className="text-slate-400 font-normal italic">Independiente</span>}</TableCell>
                   <TableCell>
                      <select 
                        className="bg-white border border-[#CBD5E1] text-sm p-1.5 rounded-md font-medium text-[#0F2044] outline-none focus:ring-1 focus:ring-[#2C6E9E] shadow-sm"
                        value={p.status}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                      >
                         {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                   </TableCell>
                   <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${p.payment_status ? 'bg-emerald-50 text-[#2A7D5F] border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {p.payment_status ? 'Pagado' : 'Pendiente'}
                      </span>
                   </TableCell>
                 </TableRow>
               ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Checklist */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
           <DialogHeader>
             <DialogTitle className="text-xl text-[#0F2044]">Expediente: <span className="text-[#2C6E9E]">{selectedPatient?.full_name}</span></DialogTitle>
           </DialogHeader>
           <div className="space-y-6 py-4">
              <div className="space-y-4 border border-[#E2E8F0] p-5 rounded-xl bg-[#F8F9FB]">
                 <h3 className="font-semibold text-[#0F2044] mb-2">Exámenes Realizados</h3>
                 {initialExams.map((exam: any) => (
                    <div key={exam.id} className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-[#E2E8F0] shadow-sm">
                       <Checkbox 
                          id={`exam-${exam.id}`} 
                          checked={selectedExams.includes(exam.id)}
                          onCheckedChange={(checked) => {
                             if (checked) setSelectedExams([...selectedExams, exam.id])
                             else setSelectedExams(selectedExams.filter(e => e !== exam.id))
                          }}
                       />
                       <Label htmlFor={`exam-${exam.id}`} className="font-medium text-slate-700 cursor-pointer w-full">
                          {exam.name} <span className="text-slate-500 font-normal ml-1">(${exam.default_price})</span>
                       </Label>
                    </div>
                 ))}
                 {initialExams.length === 0 && <p className="text-sm text-slate-500">No hay exámenes en el catálogo.</p>}
              </div>

              <div className="flex items-center justify-between border border-[#E2E8F0] p-5 rounded-xl bg-[#F8F9FB]">
                 <div className="space-y-1">
                    <Label className="text-sm font-medium text-[#0F2044]">Pago en sitio</Label>
                    <p className="text-xs text-slate-500">Responsabilidad directa de confirmación.</p>
                 </div>
                 <Switch checked={isPaid} onCheckedChange={setIsPaid} />
              </div>

              <Button onClick={saveChecklist} className="w-full bg-[#0F2044] hover:bg-[#0F2044]/90 text-white h-11 text-base shadow-none">Guardar Expediente Temporal</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
