import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Invitacion() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [cargando, setCargando] = useState(true); // Para que no parpadee el formulario

    // Estados del formulario
    const [acompanantes, setAcompanantes] = useState(0); // 0 = Solo, 1 = Con Pareja
    const [nombreAcomp, setNombreAcomp] = useState('');
    const [telefono, setTelefono] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const nombreGuardado = localStorage.getItem('invitado_nombre');

        // 1. Si no tiene nombre, lo mandamos al Login
        if (!nombreGuardado) {
            navigate('/');
        } else {
            setNombre(nombreGuardado);
            verificarSiYaConfirmo(nombreGuardado);
        }
    }, []);

    // --- LÓGICA DE SEGURIDAD (ANTI DOBLE REGISTRO) ---
    const verificarSiYaConfirmo = async (nombreUser) => {
        // Preguntamos a la base de datos si este usuario ya existe
        const { data } = await supabase
            .from('invitados')
            .select('asistencia')
            .ilike('nombre', nombreUser) // 'ilike' ignora mayúsculas/minúsculas
            .maybeSingle();

        // Si la base de datos dice que ya confirmó...
        if (data && data.asistencia) {
            // ...lo mandamos DIRECTO a la pantalla de Gracias/Ticket
            navigate('/gracias');
        } else {
            // Si no confirmó, dejamos de cargar y mostramos el formulario
            setCargando(false);
        }
    };

    const confirmarAsistencia = async () => {
        // Validaciones
        if (acompanantes === 1 && !nombreAcomp.trim()) {
            return alert("Por favor escribí el nombre de tu acompañante 🙏");
        }

        if (!telefono.trim()) {
            return alert("Por favor dejanos tu WhatsApp por cualquier cambio 📱");
        }

        setEnviando(true);

        // Guardamos en la base de datos
        const { error } = await supabase.from('invitados').insert([
            {
                nombre: nombre,
                asistencia: true,
                cantAcomp: acompanantes,
                nombreAcomp: acompanantes === 1 ? nombreAcomp : null,
                telefono: telefono,
                mensaje: mensaje
            }
        ]);

        if (error) {
            alert("Error al guardar: " + error.message);
            setEnviando(false);
        } else {
            // ÉXITO: Lo mandamos a la pantalla final
            navigate('/gracias');
        }
    };

    // Función Mapa Universal
    const abrirMapa = () => {
        const direccion = encodeURIComponent("Salón Los Álamos, Av. Perón 1200, Tucumán");
        window.open(`https://www.google.com/maps/search/?api=1&query=${direccion}`, '_blank');
    };

    // Pantalla de Carga (mientras verifica si ya confirmaste)
    if (cargando) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white pb-20 relative overflow-hidden font-sans">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Encabezado */}
            <div className="px-6 pt-12 space-y-1 relative z-10">
                <p className="text-red-600 font-bold text-[10px] md:text-xs tracking-widest">002_INVITACION // {nombre.toUpperCase()}</p>
                <h1 className="text-5xl md:text-6xl font-black text-red-600 uppercase leading-none tracking-tighter">
                    EL <br /> EVENTO
                </h1>
            </div>

            <div className="mt-8 px-6 space-y-8 relative z-10">

                {/* FECHA */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold tracking-widest mb-1">FECHA</p>
                        <p className="text-2xl md:text-3xl font-black uppercase">15 MARZO</p>
                        <p className="text-sm text-gray-400">22:00 HS</p>
                    </div>
                    <div className="text-4xl grayscale opacity-50">📅</div>
                </div>

                {/* UBICACIÓN */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div className="max-w-[75%]">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold tracking-widest mb-1">UBICACIÓN</p>
                        <p className="text-lg md:text-xl font-bold leading-tight">Salón "Los Álamos"</p>
                        <p className="text-sm text-gray-400">Av. Perón 1200</p>
                    </div>

                    <button
                        onClick={abrirMapa}
                        className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center border border-gray-700 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all active:scale-95 shadow-lg"
                    >
                        <span className="text-2xl">📍</span>
                    </button>
                </div>

                {/* --- FORMULARIO --- */}
                <div className="space-y-6 animate-fade-in-up pt-4">

                    {/* 1. SELECCIÓN SIMPLE (SOLO o +1) */}
                    <div>
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold tracking-widest mb-3">¿CÓMO VIENES?</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setAcompanantes(0)}
                                className={`py-4 rounded-xl border border-gray-700 font-bold text-sm md:text-base transition-all
                  ${acompanantes === 0
                                        ? 'bg-white text-black border-white shadow-lg shadow-white/20'
                                        : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}
                `}
                            >
                                VOY SOLO/A
                            </button>

                            <button
                                onClick={() => setAcompanantes(1)}
                                className={`py-4 rounded-xl border border-gray-700 font-bold text-sm md:text-base transition-all
                  ${acompanantes === 1
                                        ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30'
                                        : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}
                `}
                            >
                                CON PAREJA (+1)
                            </button>
                        </div>
                    </div>

                    {/* 2. Nombre del +1 (Solo aparece si elegiste pareja) */}
                    {acompanantes === 1 && (
                        <div className="animate-fade-in">
                            <label className="text-red-400 text-[10px] md:text-xs font-bold tracking-widest mb-2 block">
                                NOMBRE DE TU ACOMPAÑANTE *
                            </label>
                            <input
                                type="text"
                                value={nombreAcomp}
                                onChange={(e) => setNombreAcomp(e.target.value)}
                                placeholder="Ej: Julieta / Pedro"
                                className="w-full bg-neutral-800 border border-gray-700 rounded-xl p-4 text-white focus:border-red-600 focus:outline-none placeholder-gray-600"
                            />
                        </div>
                    )}

                    {/* 3. Celular */}
                    <div>
                        <label className="text-gray-500 text-[10px] md:text-xs font-bold tracking-widest mb-2 block">
                            TU CELULAR (WhatsApp) *
                        </label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ej: 381..."
                            className="w-full bg-neutral-800 border border-gray-700 rounded-xl p-4 text-white focus:border-red-600 focus:outline-none placeholder-gray-600"
                        />
                    </div>

                    {/* 4. Mensaje */}
                    <div>
                        <label className="text-gray-500 text-[10px] md:text-xs font-bold tracking-widest mb-2 block">
                            MENSAJE (Comida/Saludos)
                        </label>
                        <textarea
                            rows="2"
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            placeholder="Soy vegetariano / celíaco..."
                            className="w-full bg-neutral-800 border border-gray-700 rounded-xl p-4 text-white focus:border-red-600 focus:outline-none placeholder-gray-600 resize-none"
                        />
                    </div>

                    {/* Botón Final */}
                    <button
                        onClick={confirmarAsistencia}
                        disabled={enviando}
                        className="w-full bg-white text-black font-black py-5 uppercase tracking-widest text-sm md:text-base hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50 active:scale-95 cursor-pointer rounded-xl mt-4 shadow-xl"
                    >
                        {enviando ? "Guardando..." : "CONFIRMAR ASISTENCIA"}
                    </button>

                </div>
            </div>
        </div>
    );
}