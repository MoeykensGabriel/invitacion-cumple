import { useParams } from 'react-router-dom';
import QRCode from "react-qr-code";
import { useEffect } from 'react';

export default function Ticket() {
    const { nombre } = useParams();
    const nombreDecodificado = decodeURIComponent(nombre);

    // Opcional: Intentar forzar scroll al tope al cargar
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Fondo con ruido y gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-black"></div>
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* CONTENEDOR TIPO "APP" (Ancho limitado para que en PC se vea como celu) */}
            <div className="w-full max-w-sm relative z-10 animate-fade-in-up">

                {/* Tarjeta Principal */}
                <div className="bg-white text-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]">

                    {/* Cabecera Roja */}
                    <div className="bg-red-600 p-6 text-center">
                        <p className="text-white/80 font-bold text-[10px] tracking-[0.3em] uppercase mb-1">OFFICIAL ACCESS</p>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">ALEJO FEST</h1>
                    </div>

                    {/* Cuerpo del Ticket */}
                    <div className="p-8 flex flex-col items-center text-center">

                        {/* Nombre del Invitado */}
                        <div className="mb-6 w-full">
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">INVITADO/A</p>
                            <h2 className="text-2xl font-black uppercase leading-tight break-words">{nombreDecodificado}</h2>
                        </div>

                        {/* El Código QR (Responsive) */}
                        <div className="bg-white p-2 border-2 border-black rounded-xl mb-6 relative">
                            {/* Esquinas decorativas */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-black -translate-x-1 -translate-y-1"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-black translate-x-1 -translate-y-1"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-black -translate-x-1 translate-y-1"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-black translate-x-1 translate-y-1"></div>

                            <div style={{ height: "auto", margin: "0 auto", maxWidth: "200px", width: "100%" }}>
                                <QRCode
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    // ANTES: value={nombreDecodificado}
                                    // AHORA: Es un LINK a la página de control de acceso
                                    value={`${window.location.origin}/access-control/${encodeURIComponent(nombreDecodificado)}`}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        </div>

                        {/* Info del Evento */}
                        <div className="w-full border-t border-dashed border-gray-300 pt-6 mt-2 grid grid-cols-2 gap-4">
                            <div className="text-left">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">FECHA</p>
                                <p className="font-black text-lg">15 MAR</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">HORA</p>
                                <p className="font-black text-lg">22:00 HS</p>
                            </div>
                        </div>

                    </div>

                    {/* Footer de la tarjeta (Brillo) */}
                    <div className="bg-gray-100 p-4 text-center border-t border-gray-200">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                            <p className="text-[10px] font-bold uppercase">SUBIR BRILLO A LA HORA DEL ESCANEO</p>
                        </div>
                    </div>
                </div>

                {/* Botón de acción (Screenshot) */}
                <p className="text-center text-gray-500 text-xs mt-6 font-medium animate-pulse">
                    Hacé una captura de pantalla por las dudas
                </p>

            </div>
        </div>
    );
}