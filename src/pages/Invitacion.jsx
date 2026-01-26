import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Invitacion() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [yaConfirmo, setYaConfirmo] = useState(false);

    // Estados del formulario
    const [acompanantes, setAcompanantes] = useState(0); // 0 = Solo, 1 = Con Pareja
    const [nombreAcomp, setNombreAcomp] = useState('');
    const [telefono, setTelefono] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const guardado = localStorage.getItem('invitado_nombre');
        if (!guardado) {
            navigate('/');
        } else {
            setNombre(guardado);
            verificarSiYaConfirmo(guardado);
        }
    }, []);

    // Componente Cuenta Regresiva
    function Countdown({ targetDate }) {
        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

        function calculateTimeLeft() {
            const difference = +new Date(targetDate) - +new Date();
            let timeLeft = {};

            if (difference > 0) {
                timeLeft = {
                    dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hs: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    min: Math.floor((difference / 1000 / 60) % 60),
                    seg: Math.floor((difference / 1000) % 60),
                };
            }
            return timeLeft;
        }

        useEffect(() => {
            const timer = setTimeout(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);
            return () => clearTimeout(timer);
        });

        const timeComponents = [];
        Object.keys(timeLeft).forEach((interval) => {
            timeComponents.push(
                <div key={interval} className="flex flex-col items-center mx-2 md:mx-4">
                    <span className="text-2xl md:text-4xl font-black text-white">{timeLeft[interval]}</span>
                    <span className="text-[10px] uppercase text-gray-500 tracking-widest">{interval}</span>
                </div>
            );
        });

        return (
            <div className="flex justify-center py-6 bg-neutral-800/50 rounded-xl border border-neutral-700 my-6 backdrop-blur-sm">
                {timeComponents.length ? timeComponents : <span>¡Llegó el día!</span>}
            </div>
        );
    }

    const verificarSiYaConfirmo = async (nombreUser) => {
        const { data } = await supabase
            .from('invitados')
            .select('*')
            .eq('nombre', nombreUser)
            .single();

        if (data) {
            setYaConfirmo(true);
            if (data.cantAcomp) setAcompanantes(data.cantAcomp);
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
            alert("Error: " + error.message);
        } else {
            setYaConfirmo(true);
        }
        setEnviando(false);
        navigate('/gracias');
    };

    // Función para abrir el mapa real
    const abrirMapa = () => {
        // Esto busca "Salón Los Álamos, Av Perón 1200" en la app de mapas del celular
        const direccion = encodeURIComponent("Salón Los Álamos, Av. Perón 1200, Tucumán");
        window.open(`https://www.google.com/maps/search/?api=1&query=${direccion}`, '_blank');
    };


    return (
        <div className="min-h-screen bg-neutral-900 text-white pb-20 relative overflow-hidden font-sans">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Encabezado */}
            <div className="px-6 pt-12 space-y-1">
                <p className="text-red-600 font-bold text-[10px] md:text-xs tracking-widest">002_DETALLES // {nombre.toUpperCase()}</p>
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
                        <Countdown targetDate="2026-03-15T22:00:00" />
                    </div>
                </div>

                {/* UBICACIÓN (¡AQUÍ ESTÁ!) */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div className="max-w-[75%]">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold tracking-widest mb-1">UBICACIÓN</p>
                        <p className="text-lg md:text-xl font-bold leading-tight">Salón "Los Álamos"</p>
                        <p className="text-sm text-gray-400">Av. Perón 1200</p>
                    </div>

                    {/* Botón Mapa Inteligente */}
                    <button
                        onClick={abrirMapa}
                        className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center border border-gray-700 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all active:scale-95 shadow-lg"
                    >
                        <span className="text-2xl">📍</span>
                    </button>
                </div>

                {/* --- FORMULARIO --- */}
                {!yaConfirmo && (
                    <div className="space-y-6 animate-fade-in-up">

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
                                    CON ACOMPAÑANTE
                                </button>
                            </div>
                        </div>

                        {/* 2. Nombre del +1 */}
                        {acompanantes === 1 && (
                            <div className="animate-fade-in">
                                <label className="text-gray-500 text-[10px] md:text-xs font-bold tracking-widest mb-2 block text-red-400">
                                    NOMBRE DE TU ACOMPAÑANTE *
                                </label>
                                <input
                                    type="text"
                                    value={nombreAcomp}
                                    onChange={(e) => setNombreAcomp(e.target.value)}
                                    placeholder="Ej: Julieta"
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

                    </div>
                )}

                {/* Botón Final */}
                <div className="pt-2 pb-10">
                    {yaConfirmo ? (
                        <div className="bg-green-900/20 border border-green-600/50 p-6 text-center rounded-lg">
                            <p className="text-green-500 font-bold tracking-widest text-lg">¡CONFIRMADO!</p>
                            <p className="text-sm text-gray-400 mt-2">Gracias por confirmar.</p>
                        </div>
                    ) : (
                        <button
                            onClick={confirmarAsistencia}
                            disabled={enviando}
                            className="w-full bg-white text-black font-black py-5 uppercase tracking-widest text-sm md:text-base hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50 active:scale-95 cursor-pointer rounded-xl"
                        >
                            {enviando ? "Guardando..." : "Confirmar Asistencia"}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}