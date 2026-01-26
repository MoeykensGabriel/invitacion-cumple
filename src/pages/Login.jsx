import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [nombre, setNombre] = useState('');
    const navigate = useNavigate();

    const entrar = () => {
        if (!nombre.trim()) return alert("Por favor escribí tu nombre");
        localStorage.setItem('invitado_nombre', nombre);
        navigate('/invitacion');
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="z-10 w-full max-w-md flex flex-col gap-8">
                <div className="space-y-2">
                    <p className="text-red-600 font-bold tracking-widest text-xs md:text-sm">001_IDENTIFICACIÓN</p>
                    {/* Título adaptable: más chico en celular (4xl), grande en PC (5xl) */}
                    <h1 className="text-4xl md:text-5xl font-black text-red-600 uppercase tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                        ¿QUIÉN SOS?
                    </h1>
                </div>

                <div className="space-y-4 px-4">
                    <label className="text-gray-400 text-xs md:text-sm tracking-widest uppercase">Tu nombre completo</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-600 text-white text-center text-xl md:text-2xl py-2 focus:outline-none focus:border-red-600 transition-colors placeholder-gray-700"
                        placeholder="Ej: Gabo"
                    />
                </div>

                <button
                    onClick={entrar}
                    className="mt-4 bg-neutral-800 text-white border border-gray-700 py-4 px-8 tracking-widest hover:bg-red-600 hover:border-red-600 transition-all duration-300 uppercase font-bold text-sm md:text-base w-full md:w-auto self-center"
                >
                    Ingresar
                </button>
            </div>
        </div>
    );
}