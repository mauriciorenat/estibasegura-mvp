import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)

export async function GET() {
  const { data, error } = await supabase
    .from('ordenes_carga')
    .select('categoria_producto, peso_kg')
    .order('fecha_creacion', { ascending: false }) 
  
  // Aquí modelas el agrupamiento solicitado en tu CA
  return NextResponse.json(data)
}