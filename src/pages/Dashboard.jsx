import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function Dashboard() {
    // Nuevo estado de Sesión Real
    const [session, setSession] = useState(null);
    const [clave, setClave] = useState('');
    const [errorClave, setErrorClave] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // --- ESTADOS DEL DASHBOARD ---
    const [invitados, setInvitados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPersonas, setTotalPersonas] = useState(0);
    const [totalConfirmados, setTotalConfirmados] = useState(0);

    useEffect(() => {
        // Verificar si ya hay sesión iniciada en Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoadingAuth(false);
            if (session) fetchInvitados();
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchInvitados();
        });

        return () => subscription.unsubscribe();
    }, []);

    const intentarLogin = async (e) => {
        e.preventDefault();
        setErrorClave(false);

        // Login real contra Supabase con el usuario que creaste
        const { error } = await supabase.auth.signInWithPassword({
            email: 'admin@gmail.com', // <--- ASEGÚRATE QUE ESTE SEA EL EMAIL QUE CREASTE
            password: clave,
        });

        if (error) {
            console.error("Error:", error.message);
            setErrorClave(true);
            setTimeout(() => setErrorClave(false), 2000);
        }
    };

    const cerrarSesion = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setInvitados([]);
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

    // Función para truncar texto
    const truncarTexto = (texto, maxLength) => {
        if (!texto) return '—';
        if (texto.length <= maxLength) return texto;
        return texto.substring(0, maxLength) + '...';
    };

    // --- PANTALLA DE BLOQUEO ---
    if (!session) {
        return (
            <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
                {/* Fondo animado */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                {/* Contenedor principal */}
                <div className="z-10 w-full max-w-md">
                    <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">

                        {/* Badge superior */}
                        <div className="text-center mb-8 animate-fade-in">
                            <div className="inline-block">
                                <div className="bg-red-600/10 border border-red-600/30 rounded-full px-6 py-2">
                                    <p className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase">
                                        ADMIN_ACCESO
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ícono de candado */}
                        <div className="text-center mb-8 animate-slide-up">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-red-600 blur-3xl opacity-30 animate-pulse"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-neutral-900/50">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Título */}
                        <div className="text-center space-y-4 mb-10 animate-fade-in-up">
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                ÁREA
                            </h1>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-gradient">
                                    RESTRINGIDA
                                </span>
                            </h1>
                            <p className="text-neutral-400 font-bold text-sm mt-4 tracking-wider uppercase">
                                Ingrese código de acceso
                            </p>
                        </div>

                        {/* Línea decorativa */}
                        <div className="flex items-center justify-center gap-3 my-8">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-600/50"></div>
                            <div className="h-1 w-1 rounded-full bg-red-600 animate-pulse"></div>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-600/50"></div>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={intentarLogin} className="space-y-6 animate-fade-in-up delay-300">
                            <div className="relative group">
                                <div className={`absolute -inset-0.5 rounded-2xl opacity-0 blur transition duration-500 ${errorClave
                                    ? 'bg-red-600 opacity-30 animate-pulse'
                                    : 'bg-gradient-to-r from-red-600 to-red-800 group-hover:opacity-20'
                                    }`}></div>
                                <input
                                    type="password"
                                    value={clave}
                                    onChange={(e) => setClave(e.target.value)}
                                    placeholder="••••••"
                                    className={`relative w-full bg-neutral-900 border-2 text-center text-2xl tracking-[0.5em] text-white py-5 rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 ${errorClave
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-600/20 animate-shake'
                                        : 'border-neutral-700 focus:border-red-600 focus:ring-red-600/20'
                                        }`}
                                    autoFocus
                                />
                            </div>

                            {errorClave && (
                                <div className="text-center animate-shake">
                                    <p className="text-red-400 text-sm font-bold flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        ACCESO DENEGADO
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="relative w-full group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-white bg-[length:200%_100%] animate-shimmer"></div>
                                <div className="relative bg-white text-black font-black py-5 rounded-2xl uppercase tracking-widest transition-all active:scale-95 shadow-xl group-hover:shadow-2xl">
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                        DESBLOQUEAR
                                    </span>
                                </div>
                            </button>
                        </form>

                        {/* Dots decorativos */}
                        <div className="mt-8 flex justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-bounce delay-100"></div>
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-bounce delay-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- DASHBOARD PRINCIPAL ---
    return (
        <div className="min-h-screen bg-neutral-900 text-white pb-20 relative overflow-hidden">
            {/* Fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-40 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Navbar */}
            <nav className="relative z-20 bg-neutral-800/50 backdrop-blur-xl border-b border-neutral-700/50 sticky top-0">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                            <div>
                                <h1 className="font-black text-lg md:text-xl tracking-tighter uppercase">
                                    ADMIN <span className="text-red-600">//</span> DASHBOARD
                                </h1>
                                <p className="text-xs text-neutral-500 font-bold tracking-wider">PANEL DE CONTROL</p>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchInvitados}
                                className="p-3 rounded-xl bg-neutral-700/50 hover:bg-neutral-700 border border-neutral-600/50 transition-all group"
                                title="Refrescar datos"
                            >
                                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            <button
                                onClick={cerrarSesion}
                                className="p-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 transition-all group"
                                title="Cerrar sesión"
                            >
                                <svg className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fade-in-up">
                    {/* Total de Personas */}
                    <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-800"></div>
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition-colors"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-3">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-500 text-xs font-bold tracking-[0.2em] uppercase">Total de</p>
                                    <p className="text-neutral-400 text-xs font-bold tracking-wider uppercase">Personas</p>
                                </div>
                            </div>
                            <p className="text-5xl md:text-6xl font-black text-white tabular-nums">{totalPersonas}</p>
                            <p className="text-xs text-neutral-500 font-bold mt-2 uppercase tracking-wider">Asistentes confirmados</p>
                        </div>
                    </div>

                    {/* Total Confirmados */}
                    <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white to-neutral-400"></div>
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/10 border border-white/30 rounded-2xl p-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-500 text-xs font-bold tracking-[0.2em] uppercase">Total</p>
                                    <p className="text-neutral-400 text-xs font-bold tracking-wider uppercase">Confirmados</p>
                                </div>
                            </div>
                            <p className="text-5xl md:text-6xl font-black text-white tabular-nums">{totalConfirmados}</p>
                            <p className="text-xs text-neutral-500 font-bold mt-2 uppercase tracking-wider">Invitados registrados</p>
                        </div>
                    </div>
                </div>

                {/* Header de la lista */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="inline-block bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-2xl px-6 py-3">
                            <h2 className="font-black text-lg tracking-wider uppercase flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                LISTA DE INVITADOS
                            </h2>
                        </div>
                    </div>
                    <div className="bg-red-600/10 border border-red-600/30 rounded-full px-4 py-2">
                        <span className="text-red-500 font-bold text-xs tracking-widest uppercase tabular-nums">
                            {invitados.length} Registros
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-3xl p-20 shadow-2xl">
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-neutral-400 font-bold uppercase tracking-wider">Cargando datos...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Lista Mobile */}
                        <div className="grid grid-cols-1 gap-4 md:hidden animate-fade-in-up delay-300">
                            {invitados.map((invitado, index) => (
                                <div
                                    key={invitado.id}
                                    className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-5 shadow-xl hover:scale-[1.02] transition-transform"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Header del card */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0 pr-3">
                                            <h3 className="font-black text-white text-lg capitalize flex items-center gap-2 truncate" title={invitado.nombre}>
                                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="truncate">{invitado.nombre}</span>
                                            </h3>
                                            {invitado.cantAcomp === 1 ? (
                                                <p className="text-sm text-red-400 mt-2 flex items-center gap-2 font-bold truncate" title={invitado.nombreAcomp}>
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Con: <span className="text-white capitalize truncate">{invitado.nombreAcomp}</span>
                                                </p>
                                            ) : (
                                                <p className="text-sm text-neutral-500 mt-2 font-bold uppercase tracking-wide">Solo/a</p>
                                            )}
                                        </div>
                                        {invitado.asistencia ? (
                                            <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-black border border-green-500/30 uppercase tracking-wider flex-shrink-0">
                                                Sí
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-black border border-red-500/30 uppercase tracking-wider flex-shrink-0">
                                                No
                                            </span>
                                        )}
                                    </div>

                                    {/* Mensaje */}
                                    {invitado.mensaje && (
                                        <div className="bg-neutral-900/50 border border-neutral-700/50 p-4 rounded-xl mb-3">
                                            <div className="flex items-start gap-2">
                                                <svg className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                                <p className="text-sm text-neutral-400 italic line-clamp-2" title={invitado.mensaje}>"{invitado.mensaje}"</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Verificamos si tiene teléfono usando 'inv' */}
                                    {invitado.telefono && (
                                        <div className="flex gap-2 mt-4">
                                            {/* Botón Chat Normal */}
                                            <a
                                                /* Limpiamos el número para que quede solo dígitos (ej: 381555...) */
                                                href={`https://wa.me/${invitado.telefono.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-neutral-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center hover:bg-neutral-600 transition-colors flex items-center justify-center"
                                            >
                                                Chat
                                            </a>

                                            {/* BOTÓN ENVIAR QR (Premium) */}
                                            {/* BOTÓN ENVIAR QR CORREGIDO */}
                                            <a
                                                href={`https://wa.me/${invitado.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                                    `¡Hola ${invitado.nombre}! \n\nYa estás en la lista. Acá tenés tu *ENTRADA DIGITAL* para el 15 de Marzo.\n\nHacé clic en el link y guardá la captura del QR para entrar:\n${window.location.origin}/ticket/${encodeURIComponent(invitado.nombre)}`
                                                )}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-white text-black py-3 rounded-xl text-xs font-black uppercase tracking-wider text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                                            >
                                                🎟️ Enviar QR
                                            </a>
                                        </div>
                                    )}

                                    {/* Fecha */}
                                    <div className="text-xs text-neutral-600 text-right font-mono mt-3 flex items-center justify-end gap-2">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {new Date(invitado.created_at).toLocaleDateString('es-AR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tabla Desktop - SIN OVERFLOW HORIZONTAL */}
                        <div className="hidden md:block bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up delay-300">
                            <table className="w-full table-fixed">
                                <thead>
                                    <tr className="bg-neutral-900/50 border-b border-neutral-700/50">
                                        <th className="w-[25%] p-6 text-left">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="text-neutral-400 uppercase text-xs tracking-[0.15em] font-black">Invitado</span>
                                            </div>
                                        </th>
                                        <th className="w-[20%] p-6 text-left">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                                <span className="text-neutral-400 uppercase text-xs tracking-[0.15em] font-black">Contacto</span>
                                            </div>
                                        </th>
                                        <th className="w-[15%] p-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-neutral-400 uppercase text-xs tracking-[0.15em] font-black">Estado</span>
                                            </div>
                                        </th>
                                        <th className="w-[40%] p-6 text-left">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                                <span className="text-neutral-400 uppercase text-xs tracking-[0.15em] font-black">Mensaje</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-700/50">
                                    {invitados.map((invitado) => (
                                        <tr key={invitado.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-6">
                                                <div className="flex flex-col gap-2 min-w-0">
                                                    <span className="font-black text-white capitalize text-base truncate" title={invitado.nombre}>
                                                        {invitado.nombre}
                                                    </span>
                                                    {invitado.cantAcomp === 1 ? (
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <span className="text-xs text-red-400 font-bold flex items-center gap-1 flex-shrink-0">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                                Con:
                                                            </span>
                                                            <span className="text-xs text-white font-bold capitalize truncate" title={invitado.nombreAcomp}>
                                                                {invitado.nombreAcomp}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-neutral-600 font-bold uppercase tracking-wide">Solo/a</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {invitado.telefono ? (
                                                    <div className="flex gap-2 mt-4">
                                                        {/* Botón Chat Normal */}
                                                        <a
                                                            /* Limpiamos el número para que quede solo dígitos (ej: 381555...) */
                                                            href={`https://wa.me/${invitado.telefono.replace(/[^0-9]/g, '')}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex-1 bg-neutral-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center hover:bg-neutral-600 transition-colors flex items-center justify-center"
                                                        >
                                                            Chat
                                                        </a>

                                                        {/* BOTÓN ENVIAR QR CORREGIDO */}
                                                        <a
                                                            href={`https://wa.me/${invitado.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                                                `¡Hola ${invitado.nombre}!\n\nYa estás en la lista. Acá tenés tu *ENTRADA DIGITAL* para el 15 de Marzo.\n\nHacé clic en el link y guardá la captura del QR para entrar:\n${window.location.origin}/ticket/${encodeURIComponent(invitado.nombre)}`
                                                            )}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex-1 bg-white text-black py-3 rounded-xl text-xs font-black uppercase tracking-wider text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                                                        >
                                                            🎟️ Enviar QR
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <span className="text-neutral-700 font-bold">—</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-center">
                                                {invitado.asistencia ? (
                                                    <span className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-xs font-black border border-green-500/30 uppercase tracking-wider">
                                                        <span className="hidden xl:inline">Confirmado</span>
                                                        <span className="xl:hidden">Sí</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-xs font-black border border-red-500/30 uppercase tracking-wider">
                                                        No
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                {invitado.mensaje ? (
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-neutral-400 italic line-clamp-2" title={invitado.mensaje}>
                                                            "{invitado.mensaje}"
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-neutral-700 font-bold">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
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

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
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

                .animate-shake {
                    animation: shake 0.3s ease-in-out;
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