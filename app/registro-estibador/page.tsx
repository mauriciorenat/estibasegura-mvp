'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Estado = 'idle' | 'enviando' | 'exito' | 'error'

export default function RegistroEstibador() {
  const [dni, setDni] = useState('')
  const [nombre, setNombre] = useState('')
  const [estado, setEstado] = useState<Estado>('idle')
  const [mensaje, setMensaje] = useState('')

  // CA: el DNI debe tener exactamente 8 dígitos
  const dniValido = /^\d{8}$/.test(dni)
  const nombreValido = nombre.trim().length >= 3
  const formularioValido = dniValido && nombreValido

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formularioValido) return

    setEstado('enviando')
    setMensaje('')

    const { error } = await supabase
      .from('perfiles_estibadores')
      .insert([{ dni, nombre_completo: nombre.trim() }])

    if (error) {
      // CA: impedir duplicados (restricción UNIQUE en BD) -> Postgres error code 23505
      if (error.code === '23505') {
        setMensaje('Ya existe un estibador registrado con este DNI.')
      } else {
        setMensaje('Error al registrar: ' + error.message)
      }
      setEstado('error')
      return
    }

    setEstado('exito')
    setMensaje('Estibador registrado con éxito.')
    setDni('')
    setNombre('')
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Empadronamiento de Estibadores
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registra a un estibador en el padrón oficial de EstibaSegura.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-slate-700 mb-1">
              DNI
            </label>
            <input
              id="dni"
              inputMode="numeric"
              placeholder="Ej: 71342453"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
              className={`w-full rounded-lg border px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition
                ${dni.length === 0
                  ? 'border-slate-300 focus:ring-blue-200'
                  : dniValido
                    ? 'border-emerald-400 focus:ring-emerald-200'
                    : 'border-red-300 focus:ring-red-200'}`}
            />
            {dni.length > 0 && !dniValido && (
              <p className="text-xs text-red-600 mt-1">
                El DNI debe tener exactamente 8 dígitos ({dni.length}/8).
              </p>
            )}
          </div>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">
              Nombre completo
            </label>
            <input
              id="nombre"
              placeholder="Ej: Mauricio Renato Arambulo Torres"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          <button
            type="submit"
            disabled={!formularioValido || estado === 'enviando'}
            className="w-full rounded-lg bg-blue-600 text-white font-medium py-2.5 transition
              hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {estado === 'enviando' ? 'Registrando...' : 'Registrar estibador'}
          </button>

          {mensaje && (
            <p
              className={`text-sm rounded-lg px-3 py-2 ${
                estado === 'exito'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}