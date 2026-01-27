import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Login() {
    const [nombre, setNombre] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const ingresar = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return alert("Por favor poné tu nombre");

        setCargando(true);
        const nombreLimpio = nombre.trim();

        // 1. Guardamos nombre en navegador
        localStorage.setItem('invitado_nombre', nombreLimpio);

        // 2. CONSULTAMOS A SUPABASE: ¿Este nombre ya confirmó?
        const { data } = await supabase
            .from('invitados')
            .select('asistencia')
            .ilike('nombre', nombreLimpio) // ilike ignora mayúsculas/minúsculas
            .maybeSingle();

        setCargando(false);

        // 3. DECIDIMOS A DÓNDE VA
        if (data && data.asistencia) {
            // SI YA EXISTE Y CONFIRMÓ -> Lo mandamos directo al final (No lo dejamos registrarse de nuevo)
            console.log("Usuario ya registrado, redirigiendo...");
            navigate('/gracias');
        } else {
            // SI ES NUEVO -> Lo mandamos al formulario
            navigate('/invitacion');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="z-10 w-full max-w-sm space-y-8 text-center animate-fade-in-up">
                <div>
                    <p className="text-red-600 font-bold text-xs tracking-[0.3em] uppercase mb-2">Bienvenido a</p>
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        ALEJO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">FEST</span>
                    </h1>
                </div>

                <form onSubmit={ingresar} className="space-y-4">
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="TU NOMBRE Y APELLIDO"
                        className="w-full bg-neutral-800 border border-neutral-700 text-center text-lg font-bold text-white py-4 rounded-xl focus:outline-none focus:border-red-600 uppercase placeholder-gray-600"
                    />
                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {cargando ? "Verificando..." : "INGRESAR"}
                    </button>
                </form>
            </div>
        </div>
    );
}