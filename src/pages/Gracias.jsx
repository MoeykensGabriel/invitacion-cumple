import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Gracias() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [tiempoRestante, setTiempoRestante] = useState({
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0
    });

    useEffect(() => {
        const guardado = localStorage.getItem('invitado_nombre');
        if (!guardado) navigate('/');
        setNombre(guardado);
    }, []);

    // Contador en tiempo real
    useEffect(() => {
        const calcularTiempo = () => {
            const fechaEvento = new Date('2026-03-15T22:00:00').getTime();
            const ahora = new Date().getTime();
            const diferencia = fechaEvento - ahora;

            if (diferencia > 0) {
                setTiempoRestante({
                    dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
                    horas: Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutos: Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)),
                    segundos: Math.floor((diferencia % (1000 * 60)) / 1000)
                });
            }
        };

        calcularTiempo();
        const intervalo = setInterval(calcularTiempo, 1000);

        return () => clearInterval(intervalo);
    }, []);

    const agendar = () => {
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Cumple Alejo 🎉")}&dates=20260316T010000Z/20260316T090000Z&details=${encodeURIComponent("Fiesta en Los Álamos")}&location=${encodeURIComponent("Salón Los Álamos, Tucumán")}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Fondo animado con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"></div>

            {/* Círculos decorativos animados */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

            {/* Textura de ruido */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Contenido principal */}
            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-3xl p-6 md:p-12 shadow-2xl">

                    {/* Badge superior */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-block">
                            <div className="bg-red-600/10 border border-red-600/30 rounded-full px-6 py-2">
                                <p className="text-red-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase">
                                    003_CONFIRMACIÓN
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ícono de check animado */}
                    <div className="text-center mb-8 animate-slide-up">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-red-600 blur-3xl opacity-30 animate-pulse"></div>
                            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-neutral-900/50">
                                <svg
                                    className="w-10 h-10 md:w-12 md:h-12 text-white animate-check"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Título principal */}
                    <div className="text-center space-y-2 md:space-y-4 mb-8 md:mb-10 animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            ESTÁS
                        </h1>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-gradient">
                                ADENTRO
                            </span>
                        </h1>
                        <p className="text-neutral-400 font-bold text-base md:text-lg mt-4">
                            Grande, <span className="text-white">{nombre}</span>
                        </p>
                    </div>

                    {/* Línea decorativa */}
                    <div className="flex items-center justify-center gap-3 my-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-600/50"></div>
                        <div className="h-1 w-1 rounded-full bg-red-600 animate-pulse"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-600/50"></div>
                    </div>

                    {/* Contador en tiempo real */}
                    <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-neutral-700/50 mb-6 animate-fade-in-up delay-300">
                        <div className="text-center mb-6">
                            <div className="inline-block bg-red-600/10 border border-red-600/30 rounded-full px-5 py-2">
                                <p className="text-red-500 font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase">
                                    Cuenta Regresiva
                                </p>
                            </div>
                        </div>

                        {/* Grid del contador (CORREGIDO PARA CELULARES) */}
                        <div className="grid grid-cols-4 gap-2 md:gap-3 mb-6">

                            {/* Días */}
                            <div className="bg-neutral-800/80 rounded-xl p-2 md:p-4 border border-neutral-700/50 transform hover:scale-105 transition-all flex flex-col items-center justify-center">
                                <div className="text-xl sm:text-2xl md:text-4xl font-black text-white tabular-nums">
                                    {String(tiempoRestante.dias).padStart(2, '0')}
                                </div>
                                <div className="text-[10px] md:text-xs text-neutral-400 uppercase font-bold tracking-wider mt-1">
                                    Días
                                </div>
                            </div>

                            {/* Horas */}
                            <div className="bg-neutral-800/80 rounded-xl p-2 md:p-4 border border-neutral-700/50 transform hover:scale-105 transition-all flex flex-col items-center justify-center">
                                <div className="text-xl sm:text-2xl md:text-4xl font-black text-white tabular-nums">
                                    {String(tiempoRestante.horas).padStart(2, '0')}
                                </div>
                                <div className="text-[10px] md:text-xs text-neutral-400 uppercase font-bold tracking-wider mt-1">
                                    Hs
                                </div>
                            </div>

                            {/* Minutos */}
                            <div className="bg-neutral-800/80 rounded-xl p-2 md:p-4 border border-neutral-700/50 transform hover:scale-105 transition-all flex flex-col items-center justify-center">
                                <div className="text-xl sm:text-2xl md:text-4xl font-black text-red-500 tabular-nums animate-pulse-subtle">
                                    {String(tiempoRestante.minutos).padStart(2, '0')}
                                </div>
                                <div className="text-[10px] md:text-xs text-neutral-400 uppercase font-bold tracking-wider mt-1">
                                    Min
                                </div>
                            </div>

                            {/* Segundos */}
                            <div className="bg-neutral-800/80 rounded-xl p-2 md:p-4 border border-neutral-700/50 transform hover:scale-105 transition-all flex flex-col items-center justify-center">
                                <div className="text-xl sm:text-2xl md:text-4xl font-black text-red-600 tabular-nums">
                                    {String(tiempoRestante.segundos).padStart(2, '0')}
                                </div>
                                <div className="text-[10px] md:text-xs text-neutral-400 uppercase font-bold tracking-wider mt-1">
                                    Seg
                                </div>
                            </div>
                        </div>

                        {/* Info del evento */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-700/50">
                            <div className="text-center">
                                <div className="text-xl md:text-3xl font-black text-white">15</div>
                                <div className="text-[10px] md:text-xs text-neutral-400 uppercase font-bold tracking-wider mt-1">
                                    Marzo 2026
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl md:text-3xl font-black text-white">22:00</div>
                                <div className="text-[10px] md:text-xs text-neutral-400 uppercase font-bold tracking-wider mt-1">
                                    Horas
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón de agendar */}
                    <button
                        onClick={agendar}
                        className="relative w-full group overflow-hidden animate-fade-in-up delay-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-white bg-[length:200%_100%] animate-shimmer"></div>
                        <div className="relative bg-white text-black font-black py-4 md:py-5 rounded-2xl uppercase tracking-widest transition-all active:scale-95 shadow-xl group-hover:shadow-2xl text-xs md:text-base">
                            <span className="flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                AGENDAR AHORA
                            </span>
                        </div>
                    </button>

                    {/* Footer */}
                    <p className="text-center text-neutral-500 text-[10px] md:text-xs font-bold tracking-wider mt-8 uppercase animate-fade-in-up delay-700">
                        Te esperamos para festejar juntos
                    </p>

                    {/* Dots decorativos */}
                    <div className="mt-6 flex justify-center gap-2">
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

                @keyframes check {
                    0% {
                        stroke-dasharray: 0, 100;
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        stroke-dasharray: 100, 0;
                        opacity: 1;
                    }
                }

                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
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

                .animate-check {
                    animation: check 0.6s ease-out forwards;
                }

                .animate-pulse-subtle {
                    animation: pulse-subtle 2s ease-in-out infinite;
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

                .delay-500 {
                    animation-delay: 0.5s;
                }

                .delay-700 {
                    animation-delay: 0.7s;
                }
                
                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </div>
    );
}