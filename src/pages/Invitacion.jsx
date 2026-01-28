import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabase';

export default function Invitation() {
    const navigate = useNavigate();
    const [nombreInvitado, setNombreInvitado] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [cargando, setCargando] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            acompanantes: "0",
            telefono: "",
            mensaje: ""
        }
    });

    const cantidadAcompanantes = watch("acompanantes");

    useEffect(() => {
        const nombreGuardado = localStorage.getItem('invitado_nombre');
        if (!nombreGuardado) {
            navigate('/');
        } else {
            setNombreInvitado(nombreGuardado);
            verificarSiYaConfirmo(nombreGuardado);
        }
    }, []);

    const verificarSiYaConfirmo = async (nombreUser) => {
        const { data } = await supabase
            .from('invitados')
            .select('asistencia')
            .ilike('nombre', nombreUser)
            .maybeSingle();

        if (data && data.asistencia) {
            navigate('/gracias');
        } else {
            setCargando(false);
        }
    };

    const onSubmit = async (data) => {
        setEnviando(true);

        const tienePareja = data.acompanantes === "1";

        const { error } = await supabase.from('invitados').insert([
            {
                nombre: nombreInvitado,
                asistencia: true,
                cantAcomp: tienePareja ? 1 : 0,
                nombreAcomp: tienePareja ? data.nombreAcomp : null,
                telefono: data.telefono,
                mensaje: data.mensaje
            }
        ]);

        if (error) {
            alert("Error al guardar: " + error.message);
            setEnviando(false);
        } else {
            navigate('/gracias');
        }
    };

    const abrirMapa = () => {
        const direccion = encodeURIComponent("Salón Los Álamos, Av. Perón 1200, Tucumán");
        window.open(`https://www.google.com/maps/search/?api=1&query=${direccion}`, '_blank');
    };

    if (cargando) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white pb-20 relative overflow-hidden">
            {/* Fondo animado con gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"></div>

            {/* Círculos decorativos animados */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-40 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

            {/* Textura de ruido */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Contenido principal */}
            <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">

                {/* Header */}
                <div className="text-center space-y-6 mb-12 animate-fade-in">
                    {/* Badge superior */}
                    <div className="inline-block">
                        <div className="bg-red-600/10 border border-red-600/30 rounded-full px-6 py-2">
                            <p className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase">
                                002_INVITACIÓN // {nombreInvitado.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Título principal */}
                    <div className="animate-slide-up">
                        <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            EL
                        </h1>
                        <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-gradient">
                                EVENTO
                            </span>
                        </h1>
                    </div>

                    {/* Línea decorativa */}
                    <div className="flex items-center justify-center gap-3 my-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-600/50"></div>
                        <div className="h-1 w-1 rounded-full bg-red-600 animate-pulse"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-600/50"></div>
                    </div>
                </div>

                {/* Tarjeta de información */}
                <div className="bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-3xl p-8 md:p-10 shadow-2xl mb-8 animate-fade-in-up">

                    {/* Fecha del evento */}
                    <div className="flex items-center justify-between border-b border-neutral-700/50 pb-6 mb-8">
                        <div>
                            <p className="text-neutral-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">Fecha del evento</p>
                            <p className="text-4xl md:text-5xl font-black uppercase tracking-tight">15 MARZO</p>
                            <p className="text-neutral-400 text-sm font-bold mt-2">2026 • 22:00 HS</p>
                        </div>
                        <div className="opacity-30">
                            <svg className="w-16 h-16 md:w-20 md:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        {/* Selección de asistencia */}
                        <div className="space-y-4">
                            <div className="bg-neutral-900/50 rounded-2xl py-3 px-6 border border-neutral-700/30 inline-block">
                                <p className="text-red-500 font-bold text-xs tracking-[0.2em] uppercase">
                                    ¿Cómo vienes?
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${cantidadAcompanantes === "0"
                                    ? 'bg-white text-black shadow-2xl'
                                    : 'bg-neutral-900/80 text-neutral-400 border-2 border-neutral-700/50 hover:border-neutral-600'
                                    }`}>
                                    {cantidadAcompanantes === "0" && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-white bg-[length:200%_100%] animate-shimmer"></div>
                                    )}
                                    <div className="relative py-6 text-center">
                                        <div className="mb-3">
                                            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="radio"
                                            value="0"
                                            className="hidden"
                                            {...register("acompanantes")}
                                        />
                                        <p className="font-black text-sm tracking-wider uppercase">Voy Solo/a</p>
                                    </div>
                                </label>

                                <label className={`group cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${cantidadAcompanantes === "1"
                                    ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl shadow-red-600/20'
                                    : 'bg-neutral-900/80 text-neutral-400 border-2 border-neutral-700/50 hover:border-neutral-600'
                                    }`}>
                                    {cantidadAcompanantes === "1" && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-shimmer"></div>
                                    )}
                                    <div className="relative py-6 text-center">
                                        <div className="mb-3">
                                            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="radio"
                                            value="1"
                                            className="hidden"
                                            {...register("acompanantes")}
                                        />
                                        <p className="font-black text-sm tracking-wider uppercase">Con Pareja (+1)</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Campo de nombre del acompañante */}
                        {cantidadAcompanantes === "1" && (
                            <div className="space-y-3 animate-fade-in">
                                <div className="bg-neutral-900/50 rounded-2xl py-2 px-5 border border-red-600/30 inline-block">
                                    <label className="text-red-400 text-xs font-bold tracking-[0.2em] uppercase">
                                        Nombre de tu acompañante *
                                    </label>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                                    <input
                                        type="text"
                                        placeholder="Ej: Julieta / Pedro"
                                        className={`relative w-full bg-neutral-900 border-2 p-5 rounded-2xl text-white font-semibold focus:outline-none focus:ring-2 transition-all duration-300 ${errors.nombreAcomp
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-600/20'
                                            : 'border-neutral-700 focus:border-red-600 focus:ring-red-600/20'
                                            }`}
                                        {...register("nombreAcomp", {
                                            required: "Por favor escribí el nombre",
                                            minLength: { value: 3, message: "Mínimo 3 letras" }
                                        })}
                                    />
                                </div>
                                {errors.nombreAcomp && (
                                    <p className="text-red-400 text-sm font-bold flex items-center gap-2 animate-shake">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.nombreAcomp.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Campo de teléfono */}
                        <div className="space-y-3">
                            <div className="bg-neutral-900/50 rounded-2xl py-2 px-5 border border-neutral-700/30 inline-block">
                                <label className="text-neutral-400 text-xs font-bold tracking-[0.2em] uppercase">
                                    Tu Celular (WhatsApp) *
                                </label>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                                <input
                                    type="tel"
                                    placeholder="Ej: 381 123 4567"
                                    className={`relative w-full bg-neutral-900 border-2 p-5 rounded-2xl text-white font-semibold focus:outline-none focus:ring-2 transition-all duration-300 ${errors.telefono
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-600/20'
                                        : 'border-neutral-700 focus:border-red-600 focus:ring-red-600/20'
                                        }`}
                                    {...register("telefono", {
                                        required: "Campo obligatorio",
                                        validate: (value) => {
                                            const numeros = value.replace(/[^0-9]/g, '');
                                            if (numeros.length < 10) return "El número debe tener al menos 10 dígitos";
                                            if (numeros.length > 14) return "El número es inválido";
                                            const todosIguales = /^(\d)\1+$/.test(numeros);
                                            if (todosIguales) return "Pone un número real";
                                            return true;
                                        }
                                    })}
                                />
                            </div>
                            {errors.telefono && (
                                <p className="text-red-400 text-sm font-bold flex items-center gap-2 animate-shake">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.telefono.message}
                                </p>
                            )}
                        </div>

                        {/* Campo de mensaje opcional */}
                        <div className="space-y-3">
                            <div className="bg-neutral-900/50 rounded-2xl py-2 px-5 border border-neutral-700/30 inline-block">
                                <label className="text-neutral-400 text-xs font-bold tracking-[0.2em] uppercase">
                                    Mensaje (Opcional)
                                </label>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                                <textarea
                                    rows="3"
                                    placeholder="Ej: Soy vegetariano, tengo alguna alergia..."
                                    className="relative w-full bg-neutral-900 border-2 border-neutral-700 p-5 rounded-2xl text-white font-semibold focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 resize-none transition-all duration-300"
                                    {...register("mensaje")}
                                />
                            </div>
                        </div>

                        {/* Botón de ubicación */}
                        <button
                            type="button"
                            onClick={abrirMapa}
                            className="w-full bg-neutral-900/80 border-2 border-neutral-700 text-neutral-300 font-bold py-5 rounded-2xl uppercase tracking-widest hover:border-red-600 hover:text-white hover:bg-neutral-800 transition-all text-sm md:text-base group"
                        >
                            <span className="flex items-center justify-center gap-3">
                                <svg className="w-5 h-5 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                VER UBICACIÓN
                            </span>
                        </button>

                        {/* Botón de envío */}
                        <button
                            type="submit"
                            disabled={enviando}
                            className="relative w-full group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-white bg-[length:200%_100%] animate-shimmer"></div>
                            <div className="relative bg-white text-black font-black py-6 rounded-2xl uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl group-hover:shadow-2xl text-sm md:text-base">
                                {enviando ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        GUARDANDO...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        CONFIRMAR ASISTENCIA
                                    </span>
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
                
                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </div>
    );
}