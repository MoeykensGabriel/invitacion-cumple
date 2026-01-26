import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Gracias() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        const guardado = localStorage.getItem('invitado_nombre');
        if (!guardado) navigate('/');
        setNombre(guardado);
    }, []);

    const agendar = () => {
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Cumple Alejo 🎉")}&dates=20260316T010000Z/20260316T090000Z&details=${encodeURIComponent("Fiesta en Los Álamos")}&location=${encodeURIComponent("Salón Los Álamos, Tucumán")}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Contenedor Animado */}
            <div className="relative z-10 text-center space-y-8 animate-fade-in-up max-w-md w-full">

                {/* Ícono Animado */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-neutral-800 animate-bounce-slow">
                        <span className="text-5xl">🥂</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                        ¡Estás <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Adentro!</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-lg">Grande, {nombre}.</p>
                </div>

                <div className="bg-neutral-800/50 backdrop-blur-sm p-6 rounded-2xl border border-neutral-700/50">
                    <p className="text-xs font-bold tracking-widest text-red-500 uppercase mb-4">NO FALTES</p>
                    <div className="flex justify-between items-end border-b border-gray-700 pb-4 mb-4">
                        <div className="text-left">
                            <span className="block text-3xl font-black text-white">15</span>
                            <span className="block text-xs text-gray-400 uppercase">Marzo</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-3xl font-black text-white">22:00</span>
                            <span className="block text-xs text-gray-400 uppercase">Horas</span>
                        </div>
                    </div>

                    <button
                        onClick={agendar}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-white/10"
                    >
                        📅 Agendar ahora
                    </button>
                </div>

                <p className="text-xs text-gray-600 font-mono">Nos vemos en el salón.</p>
            </div>
        </div>
    );
}