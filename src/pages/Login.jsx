import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // <--- IMPORTANTE: Importar Supabase

export default function Login() {
    const [nombre, setNombre] = useState('');
    const [cargando, setCargando] = useState(false); // Para mostrar feedback visual
    const navigate = useNavigate();

    const ingresar = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return alert("Porfa poné tu nombre");

        setCargando(true);
        const nombreLimpio = nombre.trim(); // Quitamos espacios accidentales al final

        // 1. Guardamos el nombre en el navegador
        localStorage.setItem('invitado_nombre', nombreLimpio);

        // 2. PREGUNTAMOS A LA BASE DE DATOS: "¿Ya existe alguien con este nombre?"
        // Usamos 'ilike' para que no importe si escribe "Alejo" o "alejo" (ignora mayúsculas)
        const { data, error } = await supabase
            .from('invitados')
            .select('asistencia')
            .ilike('nombre', nombreLimpio)
            .maybeSingle(); // maybeSingle devuelve null si no existe (en vez de error)

        setCargando(false);

        // 3. DECISIÓN DE RUTAS
        if (data && data.asistencia) {
            // CASO A: YA EXISTE y ya confirmó -> Lo mandamos directo al final
            // (Así no puede duplicar su registro)
            navigate('/gracias');
        } else {
            // CASO B: ES NUEVO (o no terminó de confirmar) -> Al formulario
            navigate('/invitacion');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Fondo con ruido */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="z-10 w-full max-w-sm space-y-8 animate-fade-in-up text-center">

                {/* Títulos */}
                <div>
                    <p className="text-red-600 font-bold text-xs tracking-[0.3em] uppercase mb-2">Exclusive Access</p>
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        PARTY <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">TIME</span>
                    </h1>
                </div>

                {/* Formulario de Login */}
                <form onSubmit={ingresar} className="space-y-4">
                    <div className="relative group">
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="TU NOMBRE Y APELLIDO"
                            className="w-full bg-neutral-800 border border-neutral-700 text-center text-lg font-bold text-white py-4 rounded-xl focus:outline-none focus:border-red-600 focus:bg-neutral-800/80 transition-all placeholder-gray-600 uppercase"
                            autoFocus
                        />
                        {/* Decoración borde brillante */}
                        <div className="absolute inset-0 rounded-xl border border-red-600 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {cargando ? "Verificando..." : "INGRESAR"}
                    </button>
                </form>

                <p className="text-[10px] text-gray-600 font-mono uppercase">
                    Sistema de Confirmación v2.0
                </p>
            </div>
        </div>
    );
}