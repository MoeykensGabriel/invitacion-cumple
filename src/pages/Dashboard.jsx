import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function Dashboard() {
    // --- ESTADO DEL "LOGIN" ---
    // Leemos si ya ingresó antes (para que no le pida clave a cada rato)
    const [autorizado, setAutorizado] = useState(localStorage.getItem('admin_auth') === 'true');
    const [clave, setClave] = useState('');
    const [errorClave, setErrorClave] = useState(false);

    // --- ESTADOS DEL DASHBOARD ---
    const [invitados, setInvitados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPersonas, setTotalPersonas] = useState(0);
    const [totalConfirmados, setTotalConfirmados] = useState(0);

    // Cargar datos SOLO si está autorizado
    useEffect(() => {
        if (autorizado) fetchInvitados();
    }, [autorizado]);

    const intentarLogin = (e) => {
        e.preventDefault();

        console.log("Lo que escribí:", clave);
        console.log("Lo que el código ve:", clave.toUpperCase());

        if (clave.toUpperCase() === 'ADMIN') {
            localStorage.setItem('admin_auth', 'true');
            setAutorizado(true);
        } else {
            setErrorClave(true);
            setTimeout(() => setErrorClave(false), 2000);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('admin_auth');
        setAutorizado(false);
    };

    const fetchInvitados = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('invitados')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            alert('Error: ' + error.message);
        } else {
            setInvitados(data);
            calcularEstadisticas(data);
        }
        setLoading(false);
    };

    const calcularEstadisticas = (data) => {
        const confirmados = data.filter(i => i.asistencia === true);
        setTotalConfirmados(confirmados.length);
        const totalGente = confirmados.reduce((acc, curr) => acc + 1 + (curr.cantAcomp || 0), 0);
        setTotalPersonas(totalGente);
    };

    // --- PANTALLA DE BLOQUEO (SI NO ESTÁ AUTORIZADO) ---
    if (!autorizado) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                <div className="z-10 w-full max-w-sm space-y-8 animate-fade-in-up">
                    <div>
                        <div className="w-16 h-16 bg-neutral-900 rounded-2xl mx-auto flex items-center justify-center border border-neutral-800 mb-4 shadow-2xl">
                            <span className="text-3xl">🔒</span>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Área Restringida</h1>
                        <p className="text-gray-500 text-xs font-mono mt-2">INGRESE CÓDIGO DE ACCESO</p>
                    </div>

                    <form onSubmit={intentarLogin} className="space-y-4">
                        <input
                            type="password"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            placeholder="••••••"
                            className={`w-full bg-neutral-900 border text-center text-2xl tracking-[0.5em] text-white py-4 rounded-xl focus:outline-none transition-all
                ${errorClave ? 'border-red-600 animate-shake' : 'border-neutral-800 focus:border-white'}
              `}
                            autoFocus
                        />

                        <button
                            type="submit"
                            className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-colors"
                        >
                            Desbloquear
                        </button>
                    </form>

                    {errorClave && <p className="text-red-500 text-xs font-bold animate-pulse">ACCESO DENEGADO</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-gray-200 font-sans pb-10 relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Navbar con botón de Salir */}
            <nav className="bg-neutral-900/90 backdrop-blur border-b border-neutral-800 px-4 py-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <h1 className="font-black text-lg text-white tracking-tighter">
                        ADMIN <span className="text-red-600">//</span> EVENTO
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchInvitados} className="text-xl p-2 rounded-lg hover:bg-neutral-800">🔄</button>
                    <button onClick={cerrarSesion} className="text-xl p-2 rounded-lg hover:bg-neutral-800 text-red-500">❌</button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 relative z-10">
                {/* KPIs */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-neutral-800 p-4 md:p-6 rounded-2xl border border-neutral-700 relative overflow-hidden">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Comida Total</p>
                        <p className="text-4xl md:text-5xl font-black text-white">{totalPersonas}</p>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>
                    </div>
                    <div className="bg-neutral-800 p-4 md:p-6 rounded-2xl border border-neutral-700 relative overflow-hidden">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Confirmados</p>
                        <p className="text-4xl md:text-5xl font-black text-white">{totalConfirmados}</p>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                    </div>
                </div>

                {/* Título */}
                <div className="flex justify-between items-end px-1">
                    <h2 className="font-bold text-white text-lg tracking-wide">INVITADOS</h2>
                    <span className="text-xs text-gray-500 font-mono">{invitados.length} REGISTROS</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500 animate-pulse">Cargando...</div>
                ) : (
                    <>
                        {/* Lista Mobile */}
                        <div className="grid grid-cols-1 gap-3 md:hidden">
                            {invitados.map((invitado) => (
                                <div key={invitado.id} className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 shadow-sm flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white text-lg capitalize">{invitado.nombre}</h3>
                                            {invitado.cantAcomp === 1 ? (
                                                <p className="text-xs text-red-400 mt-1 flex items-center gap-1"> +1: <span className="text-gray-300 capitalize">{invitado.nombreAcomp}</span></p>
                                            ) : (
                                                <p className="text-xs text-gray-500 mt-1">Solo/a</p>
                                            )}
                                        </div>
                                        {invitado.asistencia ? (
                                            <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">SI</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20">NO</span>
                                        )}
                                    </div>
                                    {invitado.mensaje && (
                                        <div className="bg-neutral-900/50 p-3 rounded border border-neutral-700/50">
                                            <p className="text-xs text-gray-400 italic">"{invitado.mensaje}"</p>
                                        </div>
                                    )}
                                    {invitado.telefono && (
                                        <a href={`https://wa.me/${invitado.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-600/10 text-green-400 border border-green-600/20 font-bold text-sm hover:bg-green-600/20 transition-colors">
                                            WhatsApp
                                        </a>
                                    )}
                                    <div className="text-[10px] text-gray-600 text-right font-mono">{new Date(invitado.created_at).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>

                        {/* Tabla PC */}
                        <div className="hidden md:block bg-neutral-800 rounded-2xl border border-neutral-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-900/50 text-gray-500 uppercase text-xs tracking-wider font-bold border-b border-neutral-700">
                                            <th className="p-6">Invitado</th>
                                            <th className="p-6">Contacto</th>
                                            <th className="p-6 text-center">Estado</th>
                                            <th className="p-6">Mensaje</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-700 text-sm">
                                        {invitados.map((invitado) => (
                                            <tr key={invitado.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-6 align-top">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white capitalize text-base">{invitado.nombre}</span>
                                                        {invitado.cantAcomp === 1 ? (
                                                            <span className="text-xs text-red-400 mt-1"> Con: {invitado.nombreAcomp}</span>
                                                        ) : (
                                                            <span className="text-xs text-gray-600 mt-1">Solo/a</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6 align-top">
                                                    {invitado.telefono ? (
                                                        <a href={`https://wa.me/${invitado.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 font-bold text-xs"><span>📱</span> WhatsApp</a>
                                                    ) : <span className="text-gray-700">-</span>}
                                                </td>
                                                <td className="p-6 align-top text-center">
                                                    {invitado.asistencia ? (
                                                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">CONFIRMADO</span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">NO VA</span>
                                                    )}
                                                </td>
                                                <td className="p-6 align-top text-gray-400 italic max-w-xs">{invitado.mensaje || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}