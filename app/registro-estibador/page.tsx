'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function RegistroEstibador() {
  const [dni, setDni] = useState('')
  const [nombre, setNombre] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase
      .from('perfiles_estibadores')
      .insert([{ dni, nombre_completo: nombre }])
    
    if (error) alert('Error: ' + error.message)
    else alert('Estibador registrado con éxito')
  }

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <input placeholder="DNI" onChange={(e) => setDni(e.target.value)} className="border p-2 block mb-2"/>
      <input placeholder="Nombre Completo" onChange={(e) => setNombre(e.target.value)} className="border p-2 block mb-2"/>
      <button type="submit" className="bg-blue-500 text-white p-2">Registrar</button>
    </form>
  )
}