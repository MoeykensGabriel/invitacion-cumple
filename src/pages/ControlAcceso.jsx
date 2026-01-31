import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ControlAcceso() {
    const { nombre } = useParams();
    const nombreDecodificado = decodeURIComponent(nombre);
    const [fecha, setFecha] = useState('');

    useEffect(() => {
        // Fecha y hora actual para validar que no es captura vieja
        const ahora = new Date();
        setFecha(ahora.toLocaleString());
    }, []);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-neutral-900 rounded-3xl border-4 border-green-500 p-8 text-center shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-pulse-slow">

                {/* Ícono Gigante de Check */}
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <svg className="w-20 h-20 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-green-500 font-black text-4xl uppercase tracking-tighter mb-2">
                    ACCESO<br />PERMITIDO
                </h1>

                <div className="bg-neutral-800 rounded-xl p-4 mt-6 border border-neutral-700">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">INVITADO</p>
                    <p className="text-white text-2xl font-black uppercase">{nombreDecodificado}</p>
                </div>

                <div className="mt-8 text-gray-500 text-xs font-mono">
                    VERIFICADO: {fecha}
                    <br />
                    SISTEMA PARTY TIME
                </div>

            </div>
        </div>
    );
}