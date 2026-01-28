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

        localStorage.setItem('invitado_nombre', nombreLimpio);

        const { data } = await supabase
            .from('invitados')
            .select('asistencia')
            .ilike('nombre', nombreLimpio)
            .maybeSingle();

        setCargando(false);

        if (data && data.asistencia) {
            console.log("Usuario ya registrado, redirigiendo...");
            navigate('/gracias');
        } else {
            navigate('/invitacion');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Fondo animado con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"></div>

            {/* Círculos decorativos animados */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

            {/* Textura de ruido */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Contenedor principal */}
            <div className="z-10 w-full max-w-md">
                {/* Tarjeta principal */}
                <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-3xl p-8 md:p-12 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">

                    {/* Header con animación */}
                    <div className="text-center space-y-6 mb-8">
                        {/* Badge superior */}
                        <div className="inline-block">
                            <div className="bg-red-600/10 border border-red-600/30 rounded-full px-6 py-2 animate-fade-in">
                                <p className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase">
                                    001_IDENTIFICATE
                                </p>
                            </div>
                        </div>

                        {/* Título principal con animación */}
                        <div className="space-y-2 animate-slide-up">
                            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                PARTY
                            </h1>
                            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-600 animate-gradient">
                                    TIME
                                </span>
                            </h1>
                        </div>

                        {/* Línea decorativa */}
                        <div className="flex items-center justify-center gap-3 my-6">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-600/50"></div>
                            <div className="h-1 w-1 rounded-full bg-red-600 animate-pulse"></div>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-600/50"></div>
                        </div>

                        {/* Subtítulo */}
                        <div className="bg-neutral-900/50 rounded-2xl py-3 px-6 border border-neutral-700/30">
                            <p className="text-red-500 font-bold text-sm tracking-[0.25em] uppercase animate-pulse">
                                ¿Quién eres?
                            </p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={ingresar} className="space-y-6 animate-fade-in-up delay-300">
                        {/* Input con efecto glow */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="TU NOMBRE Y APELLIDO"
                                className="relative w-full bg-neutral-900 border-2 border-neutral-700 text-center text-base md:text-lg font-bold text-white py-5 rounded-2xl focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 uppercase placeholder-neutral-600 transition-all duration-300"
                            />
                        </div>

                        {/* Botón con animación */}
                        <button
                            type="submit"
                            disabled={cargando}
                            className="relative w-full group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-white bg-[length:200%_100%] animate-shimmer"></div>
                            <div className="relative bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl group-hover:shadow-2xl">
                                {cargando ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        VERIFICANDO...
                                    </span>
                                ) : (
                                    "INGRESAR"
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Footer decorativo */}
                    <div className="mt-8 flex justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }

                .animate-shimmer {
                    animation: shimmer 3s linear infinite;
                }
                
                .delay-100 {
                    animation-delay: 0.1s;
                }
                
                .delay-200 {
                    animation-delay: 0.2s;
                }
                
                .delay-300 {
                    animation-delay: 0.3s;
                }
                
                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </div>
    );
}