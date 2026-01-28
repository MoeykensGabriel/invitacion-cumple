import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // <--- LA HERRAMIENTA PRO
import { supabase } from '../supabase';

export default function Invitation() {
    const navigate = useNavigate();
    const [nombreInvitado, setNombreInvitado] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [cargando, setCargando] = useState(true);

    // Configuramos el Hook. 
    // 'register': Para conectar los inputs.
    // 'handleSubmit': Para manejar el envío.
    // 'watch': Para "mirar" valores en tiempo real (sirve para mostrar/ocultar el input de pareja).
    // 'formState': Acá viven los errores.
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            acompanantes: "0", // Por defecto va solo
            telefono: "",
            mensaje: ""
        }
    });

    // "Miramos" el valor de acompañantes para saber si mostrar el input extra
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

    // Esta función SOLO se ejecuta si todas las validaciones pasan
    const onSubmit = async (data) => {
        setEnviando(true);

        // Limpieza de datos antes de enviar
        const tienePareja = data.acompanantes === "1";

        const { error } = await supabase.from('invitados').insert([
            {
                nombre: nombreInvitado,
                asistencia: true,
                cantAcomp: tienePareja ? 1 : 0,
                nombreAcomp: tienePareja ? data.nombreAcomp : null, // Si va solo, mandamos null aunque haya escrito algo
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
        <div className="min-h-screen bg-neutral-900 text-white pb-20 relative overflow-hidden font-sans">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="px-6 pt-12 space-y-1 relative z-10">
                <p className="text-red-600 font-bold text-[10px] md:text-xs tracking-widest">002_INVITACION // {nombreInvitado.toUpperCase()}</p>
                <h1 className="text-5xl md:text-6xl font-black text-red-600 uppercase leading-none tracking-tighter">EL <br /> EVENTO</h1>
            </div>

            <div className="mt-8 px-6 space-y-8 relative z-10">

                {/* INFO FECHA */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                        <p className="text-gray-500 text-[10px] font-bold tracking-widest mb-1">FECHA</p>
                        <p className="text-2xl font-black uppercase">15 MARZO</p>
                    </div>
                    <div className="text-4xl grayscale opacity-50">📅</div>
                </div>

                {/* --- FORMULARIO START --- */}
                {/* handleSubmit valida todo y si está OK, llama a onSubmit */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up pt-4">

                    {/* SELECCIÓN: SOLO o PAREJA */}
                    <div>
                        <p className="text-gray-500 text-[10px] font-bold tracking-widest mb-3">¿CÓMO VIENES?</p>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Opción 0: Solo */}
                            <label className={`cursor-pointer py-4 rounded-xl border font-bold text-sm text-center transition-all
                  ${cantidadAcompanantes === "0" ? 'bg-white text-black border-white shadow-lg' : 'bg-neutral-800 text-gray-400 border-gray-700'}`}>
                                <input
                                    type="radio"
                                    value="0"
                                    className="hidden"
                                    {...register("acompanantes")} // Conectamos al form
                                />
                                VOY SOLO/A
                            </label>

                            {/* Opción 1: Con Pareja */}
                            <label className={`cursor-pointer py-4 rounded-xl border font-bold text-sm text-center transition-all
                  ${cantidadAcompanantes === "1" ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'bg-neutral-800 text-gray-400 border-gray-700'}`}>
                                <input
                                    type="radio"
                                    value="1"
                                    className="hidden"
                                    {...register("acompanantes")}
                                />
                                CON PAREJA (+1)
                            </label>
                        </div>
                    </div>

                    {/* INPUT ACOMPAÑANTE (Condicional) */}
                    {/* Solo se muestra si cantidadAcompanantes es "1" */}
                    {cantidadAcompanantes === "1" && (
                        <div className="animate-fade-in">
                            <label className="text-red-400 text-[10px] font-bold tracking-widest mb-2 block">NOMBRE DE TU ACOMPAÑANTE *</label>
                            <input
                                type="text"
                                placeholder="Ej: Julieta / Pedro"
                                className={`w-full bg-neutral-800 border rounded-xl p-4 text-white focus:outline-none transition-colors
                  ${errors.nombreAcomp ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-red-600'}`}
                                // ACÁ ESTÁ LA MAGIA DE LA VALIDACIÓN:
                                {...register("nombreAcomp", {
                                    required: "Por favor escribí el nombre",
                                    minLength: { value: 3, message: "Mínimo 3 letras" }
                                })}
                            />
                            {errors.nombreAcomp && <p className="text-red-500 text-xs mt-2 font-bold">{errors.nombreAcomp.message}</p>}
                        </div>
                    )}

                    {/* INPUT TELÉFONO (Validación compleja con Regex) */}
                    <div>
                        <label className="text-gray-500 text-[10px] font-bold tracking-widest mb-2 block">TU CELULAR (WhatsApp) *</label>
                        <input
                            type="tel"
                            placeholder="Ej: 381 123 4567"
                            className={`w-full bg-neutral-800 border rounded-xl p-4 text-white focus:outline-none transition-colors
                ${errors.telefono ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-red-600'}`}
                            {...register("telefono", {
                                required: "Necesitamos tu celu para avisarte cambios",
                                // Esta función valida que haya al menos 10 números reales ignorando espacios/guiones
                                validate: (value) => {
                                    const numeros = value.replace(/[^0-9]/g, ''); // Deja solo dígitos
                                    return numeros.length >= 10 || "El número parece incompleto (mínimo 10 dígitos)";
                                }
                            })}
                        />
                        {errors.telefono && <p className="text-red-500 text-xs mt-2 font-bold">{errors.telefono.message}</p>}
                    </div>

                    {/* MENSAJE (Opcional) */}
                    <div>
                        <label className="text-gray-500 text-[10px] font-bold tracking-widest mb-2 block">MENSAJE (Opcional)</label>
                        <textarea
                            rows="2"
                            placeholder="Soy vegetariano..."
                            className="w-full bg-neutral-800 border border-gray-700 rounded-xl p-4 text-white focus:border-red-600 focus:outline-none resize-none"
                            {...register("mensaje")} // Sin reglas porque es opcional
                        />
                    </div>

                    <button
                        type="submit" // Importante que sea type="submit"
                        disabled={enviando}
                        className="w-full bg-white text-black font-black py-5 uppercase tracking-widest text-sm rounded-xl mt-4 hover:bg-red-600 hover:text-white transition-all shadow-xl disabled:opacity-50"
                    >
                        {enviando ? "Guardando..." : "CONFIRMAR ASISTENCIA"}
                    </button>

                </form>
            </div>
        </div>
    );
}