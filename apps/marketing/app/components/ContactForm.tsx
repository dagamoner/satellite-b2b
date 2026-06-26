'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fieldVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

interface FormState {
  empresa: string;
  nombre: string;
  celular: string;
  email: string;
  contanos: string;
}

interface FieldMeta {
  key: keyof FormState;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  multiline?: boolean;
}

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 21V7l6-4v18M9 7h6M3 21V11l6-4" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <circle cx="12" cy="8" r="4" />
    <path strokeLinecap="round" d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.45.69 3.57a1 1 0 01-.24 1.01l-2.33 2.21z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
);

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    empresa: '',
    nombre: '',
    celular: '',
    email: '',
    contanos: '',
  });
  const [focused, setFocused] = useState<keyof FormState | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const fields: FieldMeta[] = [
    { key: 'empresa',  label: 'EMPRESA',   type: 'text',  placeholder: 'Nombre de tu empresa…',   icon: <BuildingIcon /> },
    { key: 'nombre',   label: 'NOMBRE',    type: 'text',  placeholder: 'Tu nombre completo…',      icon: <PersonIcon />   },
    { key: 'celular',  label: 'CELULAR',   type: 'tel',   placeholder: '+54 9 261 000 0000',       icon: <PhoneIcon />    },
    { key: 'email',    label: 'E-MAIL',    type: 'email', placeholder: 'correo@tuempresa.com',     icon: <MailIcon />     },
    { key: 'contanos', label: 'CONTANOS',  type: 'text',  placeholder: '¿En qué podemos ayudarte?…', icon: <ChatIcon />, multiline: true },
  ];

  const handleChange = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const subject = encodeURIComponent(`Contacto Web - ${form.empresa || 'Nueva consulta'}`);
    const body = encodeURIComponent(
      `EMPRESA: ${form.empresa}\nNOMBRE: ${form.nombre}\nCELULAR: ${form.celular}\nE-MAIL: ${form.email}\n\nCONTANOS:\n${form.contanos}`
    );

    // Open mailto in a new tab so the form doesn't navigate away
    window.open(`mailto:mr@mrestudioinformatico.com?subject=${subject}&body=${body}`, '_blank');

    // Brief delay then show "sent" confirmation
    setTimeout(() => {
      setStatus('sent');
      setForm({ empresa: '', nombre: '', celular: '', email: '', contanos: '' });
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative mt-16 mb-4 w-full max-w-2xl mx-auto"
    >
      {/* Ambient glow backdrop */}
      <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-[#00ffd0]/10 rounded-3xl blur-2xl pointer-events-none" />

      {/* Glass card */}
      <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#020617]/90 via-[#0a1628]/90 to-[#020617]/90 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,162,184,0.12)] p-8 md:p-12 overflow-hidden">

        {/* Decorative top scan line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ffd0]/40 to-transparent" />

        {/* Corner accent dots */}
        <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-cyan-400 opacity-60 animate-pulse" />
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00ffd0] opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-blue-400 opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-cyan-400 opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.35em] text-cyan-400 uppercase mb-2 font-semibold">Iniciá la conversación</p>
          <h3
            className="text-2xl md:text-3xl font-black tracking-tight text-white"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            CONTACTANOS
          </h3>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/60" />
          </div>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-16 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-[#00ffd0] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,208,0.5)]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h4 className="text-xl font-bold text-white" style={{ fontFamily: "'Orbitron', monospace" }}>¡Mensaje enviado!</h4>
              <p className="text-slate-400 text-sm max-w-xs">A la brevedad nos contactaremos con vos. ¡Gracias por confiar en MR Tech!</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
              >
                Enviar otro mensaje
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
              {fields.map((field, i) => (
                <motion.div
                  key={field.key}
                  custom={i}
                  variants={fieldVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Floating label */}
                  <label
                    htmlFor={`contact-${field.key}`}
                    className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.3em] mb-2 transition-colors duration-300"
                    style={{
                      color: focused === field.key ? '#00ffd0' : 'rgba(148,163,184,0.9)',
                      fontFamily: "'Orbitron', monospace",
                    }}
                  >
                    <span
                      className="transition-colors duration-300"
                      style={{ color: focused === field.key ? '#00ffd0' : '#00a2b8' }}
                    >
                      {field.icon}
                    </span>
                    {field.label}
                  </label>

                  {/* Input glow border */}
                  <div
                    className="relative rounded-xl transition-all duration-300"
                    style={{
                      boxShadow: focused === field.key
                        ? '0 0 0 1px rgba(0,255,208,0.6), 0 0 20px rgba(0,255,208,0.12)'
                        : '0 0 0 1px rgba(6,182,212,0.2)',
                    }}
                  >
                    {field.multiline ? (
                      <textarea
                        id={`contact-${field.key}`}
                        value={form[field.key]}
                        onChange={e => handleChange(field.key, e.target.value)}
                        onFocus={() => setFocused(field.key)}
                        onBlur={() => setFocused(null)}
                        placeholder={field.placeholder}
                        rows={4}
                        required
                        className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none resize-none transition-colors duration-200 focus:bg-white/8"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    ) : (
                      <input
                        id={`contact-${field.key}`}
                        type={field.type}
                        value={form[field.key]}
                        onChange={e => handleChange(field.key, e.target.value)}
                        onFocus={() => setFocused(field.key)}
                        onBlur={() => setFocused(null)}
                        placeholder={field.placeholder}
                        required
                        className="w-full bg-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none transition-colors duration-200 focus:bg-white/8"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-500 text-center tracking-wide pt-1">
                A la brevedad nos contactaremos con vos. 🚀
              </p>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative w-full mt-2 py-4 rounded-xl font-black text-sm tracking-[0.25em] uppercase overflow-hidden transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  background: 'linear-gradient(135deg, #006a78 0%, #00a2b8 40%, #00ffd0 100%)',
                  boxShadow: '0 0 30px rgba(0,162,184,0.4), 0 0 60px rgba(0,255,208,0.1)',
                  color: '#020617',
                }}
              >
                {/* Shimmer sweep */}
                <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

                <span className="relative flex items-center justify-center gap-3">
                  {status === 'sending' ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      ENVIANDO…
                    </>
                  ) : (
                    <>
                      <SendIcon />
                      ENVIAR
                    </>
                  )}
                </span>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
