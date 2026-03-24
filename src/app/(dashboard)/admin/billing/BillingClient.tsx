"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wallet, Download, CheckCircle, Clock } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function BillingClient() {
  const supabase = createClient()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { data: companies } = await supabase.from('companies').select(`
       id, name,
       patients(
          id, full_name, payment_status,
          patient_exams(price_charged)
       )
    `)
    if (companies) {
       // Procesar para tener totales
       const processed = companies.map(c => {
          let unpaidTotal = 0
          let paidTotal = 0
          let unpaidCount = 0

          c.patients.forEach((p: any) => {
             const cost = p.patient_exams.reduce((sum: number, e: any) => sum + Number(e.price_charged), 0)
             p.total_cost = cost
             if (!p.payment_status) {
                unpaidTotal += cost
                if (cost > 0) unpaidCount++
             } else {
                paidTotal += cost
             }
          })
          
          return { ...c, unpaidTotal, paidTotal, unpaidCount }
       })
       setData(processed)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const markAsPaid = async (patientId: string) => {
     await supabase.from('patients').update({ payment_status: true }).eq('id', patientId)
     // locally update the selected company data for immediate UI feedback
     const updated = { ...selectedCompany }
     const pIndex = updated.patients.findIndex((p:any) => p.id === patientId)
     if (pIndex > -1) {
        updated.patients[pIndex].payment_status = true
     }
     setSelectedCompany(updated)
     fetchData() // Refresh full underlying data
  }

  const exportExcel = (company: any) => {
     const rows = company.patients.map((p: any) => ({
        "Nombre del Empleado": p.full_name,
        "Total de Estudios ($)": p.total_cost,
        "Estado del Pago": p.payment_status ? "Pagado" : "Pendiente"
     }));
     
     // Fila de sumatoria al final
     rows.push({
        "Nombre del Empleado": "TOTAL ADEUDADO",
        "Total de Estudios ($)": company.unpaidTotal,
        "Estado del Pago": ""
     })

     const ws = XLSX.utils.json_to_sheet(rows);
     const wb = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, "Reporte_Cobranza");
     XLSX.writeFile(wb, `Cobranza_${company.name.replace(/\s+/g, '_')}.xlsx`);
  }

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-2xl font-bold flex items-center gap-3 text-[#0F2044]"><Wallet className="w-7 h-7 text-[#2C6E9E]"/> Centro de Cobranza</h1>
           <p className="text-slate-500 text-sm mt-1">Control financiero de cuentas por cobrar y pagos saldados.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-slate-500 font-medium">Cuentas por Cobrar Totales</h3>
            <p className="text-3xl font-bold text-rose-600 mt-2">${data.reduce((sum, c) => sum + c.unpaidTotal, 0).toLocaleString()}</p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-slate-500 font-medium">Cobros Realizados</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">${data.reduce((sum, c) => sum + c.paidTotal, 0).toLocaleString()}</p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
            <h3 className="text-slate-500 font-medium">Pacientes con Saldo Pendiente</h3>
            <p className="text-3xl font-bold text-[#0F2044] mt-2">{data.reduce((sum, c) => sum + c.unpaidCount, 0)}</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E2E8F0] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0F2044] hover:bg-[#0F2044]">
            <TableRow className="border-b-0 hover:bg-[#0F2044]">
              <TableHead className="font-medium text-white h-12">Empresa Cliente</TableHead>
              <TableHead className="font-medium text-white h-12 text-right">Pacientes con Deuda</TableHead>
              <TableHead className="font-medium text-white h-12 text-right">Monto Adeudado ($)</TableHead>
              <TableHead className="font-medium text-white h-12 text-center w-[200px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
             <TableRow><TableCell colSpan={4} className="text-center py-12 text-slate-500">Calculando finanzas...</TableCell></TableRow>
            ) : data.length === 0 ? (
             <TableRow><TableCell colSpan={4} className="text-center py-12 text-slate-500">No hay información financiera disponible.</TableCell></TableRow>
            ) : (
               data.map(c => (
                 <TableRow key={c.id} className="even:bg-[#F8F9FB] border-b-[#E2E8F0] hover:bg-slate-50 transition-colors">
                   <TableCell className="font-medium text-[#0F2044]">{c.name}</TableCell>
                   <TableCell className="text-right text-slate-600 font-medium">{c.unpaidCount}</TableCell>
                   <TableCell className="text-right text-rose-600 font-bold">${c.unpaidTotal.toLocaleString()}</TableCell>
                   <TableCell className="text-center space-x-2">
                      <Button variant="outline" className="border-[#2C6E9E] text-[#2C6E9E] bg-transparent hover:bg-[#2C6E9E]/10 h-8 text-xs shadow-none" onClick={() => { setSelectedCompany(c); setModalOpen(true); }}>
                         Ver Detalle
                      </Button>
                   </TableCell>
                 </TableRow>
               ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
           <DialogHeader className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8F9FB]">
             <DialogTitle className="text-xl text-[#0F2044] flex justify-between items-center pr-6">
                <span>Estado de Cuenta: <span className="text-[#2C6E9E]">{selectedCompany?.name}</span></span>
                <Button variant="outline" onClick={() => exportExcel(selectedCompany)} className="bg-white border-[#E2E8F0] text-slate-700 hover:bg-slate-50 shadow-none">
                   <Download className="w-4 h-4 mr-2" /> Exportar a Excel
                </Button>
             </DialogTitle>
           </DialogHeader>
           
           <div className="flex-1 overflow-auto bg-white p-6">
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
                 <Table>
                    <TableHeader className="bg-[#0F2044] hover:bg-[#0F2044]">
                      <TableRow className="border-b-0 hover:bg-[#0F2044]">
                         <TableHead className="font-medium text-white h-10">Empleado / Paciente</TableHead>
                         <TableHead className="font-medium text-white h-10 text-right">Total Generado</TableHead>
                         <TableHead className="font-medium text-white h-10 text-center">Estado de Pago</TableHead>
                         <TableHead className="font-medium text-white h-10 text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCompany?.patients?.map((p: any) => (
                         <TableRow key={p.id} className="even:bg-[#F8F9FB] border-b-[#E2E8F0] hover:bg-slate-50">
                            <TableCell className="font-medium text-[#0F2044]">{p.full_name}</TableCell>
                            <TableCell className="text-right font-semibold text-slate-700">${p.total_cost.toLocaleString()}</TableCell>
                            <TableCell className="text-center">
                               {p.payment_status ? (
                                  <span className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-50 border border-emerald-200 py-1 rounded-full px-2.5 mx-auto w-fit"><CheckCircle className="w-3.5 h-3.5"/> Pagado</span>
                               ) : (
                                  <span className="flex items-center justify-center gap-1.5 text-amber-700 text-xs font-bold bg-amber-50 border border-amber-200 py-1 rounded-full px-2.5 mx-auto w-fit"><Clock className="w-3.5 h-3.5"/> Pendiente</span>
                               )}
                            </TableCell>
                            <TableCell className="text-right text-xs">
                               {!p.payment_status && p.total_cost > 0 && (
                                  <Button size="sm" onClick={() => markAsPaid(p.id)} className="h-8 text-xs bg-[#0F2044] hover:bg-[#0F2044]/90 text-white shadow-none rounded-md">Saldar Deuda</Button>
                               )}
                            </TableCell>
                         </TableRow>
                      ))}
                      {selectedCompany?.patients.length === 0 && (
                         <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-500">Ningún empleado agendado de esta empresa.</TableCell></TableRow>
                      )}
                    </TableBody>
                 </Table>
              </div>
           </div>
           
           <div className="border-t border-[#E2E8F0] bg-[#F8F9FB] p-6 flex justify-between items-center">
              <span className="text-slate-600 font-medium">Deuda Pendiente Restante:</span>
              <span className="text-3xl font-bold text-rose-600">${selectedCompany?.unpaidTotal.toLocaleString()}</span>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
