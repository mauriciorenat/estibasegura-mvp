export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EstibaSegura - MVP</h1>
      <p className="mt-4 text-xl">Sistema de Gestión Logística y Trazabilidad</p>
      <div className="mt-8 p-6 bg-green-100 rounded-lg">
        Estado: 🟢 Operativo
      </div>
    </main>
  );
}