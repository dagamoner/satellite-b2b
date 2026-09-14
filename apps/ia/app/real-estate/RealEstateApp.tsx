"use client";
import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────────────────────────── */
type View =
  | "home-view"
  | "ceni-view"
  | "proyectos-view"
  | "mar-do-norte-view"
  | "beriyth-view"
  | "alanzar-view";

type InnerView =
  | "mar-presentacion"
  | "mar-book"
  | "mar-videos"
  | "mar-avances"
  | "mar-ultimas"
  | "beriyth-presentacion"
  | "beriyth-book"
  | "beriyth-videos"
  | "beriyth-avances"
  | "beriyth-ultimas"
  | "alanzar-presentacion"
  | "alanzar-book"
  | "alanzar-videos";

type Lang = "es" | "pt";

/* ─────────────────────────────────────────────────────────────────
   ASSETS — todas las rutas prefijadas con /real-estate/
───────────────────────────────────────────────────────────────── */
const A = (name: string) => `/real-estate/${name}`;

/* ─────────────────────────────────────────────────────────────────
   TRADUCCIONES
───────────────────────────────────────────────────────────────── */
const T = {
  es: { volver: "VOLVER", web_ceni: "WEB CENI" },
  pt: { volver: "VOLTAR", web_ceni: "SITE CENI" },
};

/* ─────────────────────────────────────────────────────────────────
   MAPA DE SOLAPAS POR IDIOMA
───────────────────────────────────────────────────────────────── */
const SOLAPA_INICIO    = (lang: Lang) => lang === "es" ? "Solapa_INICIO.png"    : "Solapa_INICIO_Br.png";
const SOLAPA_CENI      = (lang: Lang) => lang === "es" ? "Solapa_CENI.png"      : "Solapa_CENI_Br.png";
const SOLAPA_PROYECTOS = (lang: Lang) => lang === "es" ? "Solapa_PROYECTOS.png" : "Solapa_PROYECTOS_Br.png";
const SOLAPA_LANZAM    = (lang: Lang) => lang === "es" ? "Solapa_LANZAMIENTOS.png" : "Solapa_LANZAMIENTOS_Br.png";
const SOLAPA_PRESENT   = (lang: Lang) => lang === "es" ? "Solapa_Presentacion_Comercial.png" : "Solapa_Presentacion_Comercial_Br.png";

/* ─────────────────────────────────────────────────────────────────
   COMPONENT PRINCIPAL
───────────────────────────────────────────────────────────────── */
export default function RealEstateApp() {
  const [view, setView] = useState<View>("home-view");
  const [floripaBg, setFloripaBg] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [lang, setLang] = useState<Lang>("es");
  const [welcomeMsg, setWelcomeMsg] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Inner views state
  const [marInner, setMarInner]       = useState<InnerView>("mar-presentacion");
  const [beriythInner, setBeriythInner] = useState<InnerView>("beriyth-presentacion");
  const [alanzarInner, setAlanzarInner] = useState<InnerView>("alanzar-presentacion");

  /* ── Splash ── */
  useEffect(() => {
    const t1 = setTimeout(() => setSplashVisible(false), 4000);
    const t2 = setTimeout(() => setSplashVisible(false), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* ── Primer Load flag ── */
  useEffect(() => { setIsFirstLoad(false); }, []);

  /* ── switchView ── */
  const switchView = useCallback((v: View) => {
    setView(v);
    if (v === "home-view") {
      setFloripaBg(false);
    } else {
      setFloripaBg(true);
    }
  }, []);

  /* ── goBack ── */
  const goBack = useCallback(() => {
    if (view === "mar-do-norte-view" || view === "beriyth-view") {
      switchView("proyectos-view");
    } else {
      switchView("home-view");
    }
  }, [view, switchView]);

  /* ── toggleFullscreen ── */
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  /* ── setLang ── */
  const changeLang = useCallback((l: Lang) => {
    setLang(l);
    if (!isFirstLoad) {
      if (l === "es") {
        setWelcomeMsg('<span style="color:#75AADB">BIENVENIDO</span> <span style="color:#FFFFFF">!!!</span>');
      } else {
        setWelcomeMsg('<span style="color:#009B3A">Bem-vindo</span> <span style="color:#FEDF00">!!!!!</span>');
      }
      setTimeout(() => setWelcomeMsg(null), 2000);
    }
  }, [isFirstLoad]);

  /* ── CSS global y animaciones ── */
  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Montserrat:wght@300;400;500;600;700&family=Orbitron:wght@400;600;700&display=swap');

    #re-root *, #re-root *::before, #re-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
    #re-root ::-webkit-scrollbar { width: 8px; height: 8px; }
    #re-root ::-webkit-scrollbar-track { background: rgba(10,30,60,0.08); border-radius: 4px; }
    #re-root ::-webkit-scrollbar-thumb { background: #33E8FF; border-radius: 4px; box-shadow: 0 0 6px rgba(51,232,255,0.5); }
    #re-root ::-webkit-scrollbar-thumb:hover { background: #33E8FF; box-shadow: 0 0 12px rgba(51,232,255,0.9); }

    @keyframes re-spinAxis { 0% { transform: rotateX(-15deg) rotateY(0deg); } 100% { transform: rotateX(-15deg) rotateY(360deg); } }
    @keyframes re-spinCounterMR { 0% { transform: rotateY(0deg) rotateX(15deg); } 100% { transform: rotateY(-360deg) rotateX(15deg); } }
    @keyframes re-spinCounterCENI { 0% { transform: rotateY(-180deg) rotateX(15deg); } 100% { transform: rotateY(-540deg) rotateX(15deg); } }
    @keyframes re-fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
    @keyframes re-fadeInLeft { 0% { opacity: 0; transform: translateX(-50px); } 100% { opacity: 1; transform: translateX(0); } }
    @keyframes re-fadeInRight { 0% { opacity: 0; transform: translateX(50px); } 100% { opacity: 1; transform: translateX(0); } }
    @keyframes re-fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes re-floatUpDown { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-25px); } }
    @keyframes re-rise { 0% { opacity: 0; transform: translateY(0) scale(1); } 10% { opacity: 0.6; } 90% { opacity: 0.2; } 100% { opacity: 0; transform: translateY(-80px) scale(0.3); } }

    .re-tab {
      padding: 8px 2vw;
      background: rgba(10,30,60,0.4);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(201,168,76,0.3);
      border-radius: 30px;
      color: rgba(255,255,255,0.8);
      font-family: 'Montserrat', sans-serif;
      font-size: clamp(10px, 1vw, 14px);
      font-weight: 600;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .re-tab:hover {
      background: rgba(51,232,255,0.15);
      color: #33e8ff;
      border-color: #33e8ff;
      box-shadow: 0 0 15px rgba(51,232,255,0.4);
    }
    .re-tab.re-active {
      background: rgba(51,232,255,0.25) !important;
      color: #33e8ff !important;
      border-color: #33e8ff !important;
      box-shadow: 0 0 25px rgba(51,232,255,0.6) !important;
    }

    .re-img-tab {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      box-shadow: none !important;
      margin: 0 !important;
      transform: none !important;
      display: flex;
      justify-content: center;
      backdrop-filter: none !important;
    }
    .re-img-tab img {
      width: 100%;
      max-width: 240px;
      height: auto;
      transition: all 0.3s ease;
      filter: drop-shadow(0 0 5px rgba(51,232,255,0.3));
    }
    .re-img-tab:hover img {
      transform: scale(1.05);
      filter: drop-shadow(0 0 15px rgba(51,232,255,0.8));
    }
    .re-img-tab.re-active img {
      transform: scale(1.15);
      filter: drop-shadow(0 0 25px rgba(51,232,255,1));
    }

    .re-proyecto-card {
      width: 100%;
      height: 100%;
      border-radius: 20px;
      animation: re-floatUpDown 6s ease-in-out infinite;
      transition: box-shadow 0.5s ease, transform 0.5s ease;
      position: relative;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .re-proyecto-card:hover {
      box-shadow: 0 0 50px rgba(51,232,255,0.7), 0 0 100px rgba(51,232,255,0.4);
    }
    .re-proyecto-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 12px;
    }
    .re-proyecto-wrapper:nth-child(2) .re-proyecto-card {
      animation-delay: 1.5s;
    }

    .re-inner-tab {
      padding: 8px 24px;
      background: rgba(10,30,60,0.05);
      border: 1px solid rgba(10,30,60,0.15);
      border-radius: 20px;
      color: #0a1e46;
      font-family: 'Montserrat', sans-serif;
      font-size: clamp(10px, 0.9vw, 14px);
      font-weight: 600;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      display: flex; justify-content: center; align-items: center;
    }
    .re-inner-tab:hover, .re-inner-tab.re-active {
      background: rgba(51,232,255,0.15);
      border-color: #33e8ff;
      box-shadow: 0 0 10px rgba(51,232,255,0.4);
    }

    .re-inner-view {
      display: none;
      width: 96%;
      max-width: 1400px;
      animation: re-fadeIn 0.5s ease;
      margin: 0 auto;
    }
    .re-inner-view.re-active { display: block; }

    .re-social-link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 13px;
      color: #fff;
      padding: 8px 16px;
      border-radius: 30px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.25);
      transition: all 0.3s ease;
      letter-spacing: 0.05em;
    }
    .re-social-link:hover {
      transform: scale(1.07) translateY(-2px);
      box-shadow: 0 8px 28px rgba(0,0,0,0.3);
      border-color: rgba(255,255,255,0.6);
    }

    .re-mr-tech-link { transition: all 0.3s ease; }
    .re-mr-tech-link:hover img { filter: drop-shadow(0 0 25px rgba(51,232,255,1)); transform: scale(1.05); }

    .re-video-scroll::-webkit-scrollbar { width: 8px; }
    .re-video-scroll::-webkit-scrollbar-track { background: rgba(10,30,60,0.05); border-radius: 4px; }
    .re-video-scroll::-webkit-scrollbar-thumb { background: rgba(51,232,255,0.4); border-radius: 4px; }
    .re-video-scroll::-webkit-scrollbar-thumb:hover { background: rgba(51,232,255,0.8); }

    .re-proyecto-title {
      font-family: 'Montserrat', sans-serif;
      font-size: clamp(14px, 1.2vw, 20px);
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #FFFFFF;
      text-transform: uppercase;
      text-align: center;
      padding: 10px 30px;
      border: 2px solid rgba(255,255,255,0.6);
      border-radius: 50px;
      background: rgba(0,0,0,0.3);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      z-index: 10;
    }
    .re-proyecto-wrapper:hover .re-proyecto-title {
      background: #FFFFFF;
      color: #000000;
      border-color: #FFFFFF;
      box-shadow: 0 0 20px rgba(255,255,255,0.8);
    }

    /* RESPONSIVE LAYOUT CLASSES */
    .re-layout {
      display: flex;
      flex-direction: row;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background: transparent;
      position: relative;
    }
    .re-sidebar {
      width: 250px;
      display: flex;
      flex-direction: column;
      z-index: 50;
      flex-shrink: 0;
      position: relative;
      background: rgba(51,232,255,0.35);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      overflow-y: auto;
    }
    .re-sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 1.5vw 2vh 1.5vw;
      align-items: center;
      margin-bottom: 0;
    }
    .re-main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    .re-ceni-flex {
      width: 100%;
      height: 85vh;
      display: flex;
      flex-direction: row;
      gap: 16px;
      padding: 12px 16px;
      box-sizing: border-box;
      align-items: stretch;
      justify-content: center;
    }
    .re-proyectos-flex {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 3%;
      width: 100%;
      height: 85vh;
      padding-top: 40px;
    }

    @media (max-width: 768px) {
      .re-layout {
        flex-direction: column;
        overflow-y: auto;
        height: auto;
        min-height: 100vh;
      }
      .re-sidebar {
        width: 100%;
        height: auto;
        padding-bottom: 20px;
      }
      .re-sidebar-nav {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }
      .re-sidebar-nav > div {
        flex: 1 1 45%;
        margin-bottom: 5px;
      }
      .re-main-area {
        overflow: visible;
        min-height: 80vh;
      }
      .re-ceni-flex {
        flex-direction: column;
        height: auto;
        min-height: 85vh;
      }
      .re-ceni-flex > div {
        min-height: 300px;
      }
      .re-proyectos-flex {
        flex-direction: column;
        height: auto;
        padding-bottom: 50px;
      }
      .re-proyecto-wrapper {
        width: 90% !important;
        margin-bottom: 40px;
      }
    }
  `;

  /* ── Helpers de flags ── */
  const flagEsStyle: React.CSSProperties = lang === "es"
    ? { background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.3)", boxShadow: "0 0 20px rgba(51,232,255,0.8)", transform: "scale(1.8)", margin: "0 10px" }
    : { background: "transparent", borderColor: "transparent", boxShadow: "none", transform: "scale(1)", margin: "0" };
  const flagPtStyle: React.CSSProperties = lang === "pt"
    ? { background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.3)", boxShadow: "0 0 20px rgba(0,255,0,0.8)", transform: "scale(1.8)", margin: "0 10px" }
    : { background: "transparent", borderColor: "transparent", boxShadow: "none", transform: "scale(1)", margin: "0" };

  /* ── Tab helper ── */
  const tabCls = (id: View) =>
    `re-tab re-img-tab${view === id ? " re-active" : ""}`;
  const innerCls = (id: InnerView, current: InnerView) =>
    `re-inner-tab re-img-tab${id === current ? " re-active" : ""}`;
  const innerViewCls = (id: InnerView, current: InnerView) =>
    `re-inner-view${id === current ? " re-active" : ""}`;

  return (
    <div id="re-root" style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", overflow: "hidden", fontFamily: "'Montserrat', sans-serif", background: "#000" }}>
      <style>{globalCSS}</style>

      {/* ── SVG Filter ── */}
      <svg style={{ width: 0, height: 0, position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="re-remove-black" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  2.5 2.5 2.5 0 0" />
          </filter>
        </defs>
      </svg>

      {/* ════════════════════════════════════════════════════════════
          SPLASH SCREEN
      ════════════════════════════════════════════════════════════ */}
      {splashVisible && (
        <div
          onClick={() => setSplashVisible(false)}
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "linear-gradient(135deg, #020813 0%, #000000 100%)",
            zIndex: 99999, display: "flex", flexDirection: "row", alignItems: "stretch",
            justifyContent: "space-between",
            transition: "opacity 1s ease-in-out, visibility 1s ease-in-out",
            cursor: "pointer",
          }}
        >
          {/* Lado Izquierdo: Mendoza */}
          <div style={{ flex: "0 0 25vw", height: "100%", position: "relative", animation: "re-fadeInLeft 1.5s ease forwards", opacity: 0, boxShadow: "20px 0 50px rgba(0,0,0,0.9)", zIndex: 2 }}>
            <img src={A("Splash_Mendoza.jpg")} alt="Mendoza" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9) contrast(1.2)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 60%, #000000 100%)" }} />
          </div>

          {/* Centro: Órbita 3D */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", perspective: "800px", zIndex: 1 }}>
            <div style={{ position: "relative", width: "100%", height: "40vh", transformStyle: "preserve-3d", animation: "re-spinAxis 8s linear infinite", marginTop: "-5vh" }}>
              {/* Anillo */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotateX(90deg)", width: "36vw", height: "36vw", border: "3px dashed rgba(51,232,255,0.4)", borderRadius: "50%", boxShadow: "0 0 40px rgba(51,232,255,0.4), inset 0 0 40px rgba(51,232,255,0.4)", boxSizing: "border-box" }} />
              {/* MR Real Estate */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transformStyle: "preserve-3d", transform: "translate(-50%, -50%) translateZ(18vw)" }}>
                <div style={{ position: "relative", display: "inline-block", borderRadius: "50%", boxShadow: "0 15px 40px rgba(0,0,0,0.8), 0 0 200px rgba(51,232,255,0.9)", animation: "re-spinCounterMR 8s linear infinite" }}>
                  <img src={A("Logo_MR_Tech.jpg")} alt="MR Real Estate" style={{ height: "35vh", width: "35vh", objectFit: "cover", borderRadius: "50%", clipPath: "circle(47% at 50% 50%)", display: "block" }} />
                  <span style={{ position: "absolute", right: "-10px", top: "15px", color: "#e5c158", fontSize: "24px", fontFamily: "sans-serif", fontWeight: "bold", textShadow: "0 2px 5px rgba(0,0,0,0.9)" }}>®</span>
                </div>
              </div>
              {/* CENI */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transformStyle: "preserve-3d", transform: "translate(-50%, -50%) rotateY(180deg) translateZ(18vw)" }}>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", animation: "re-spinCounterCENI 8s linear infinite" }}>
                  <img src={A("Logo_CENI_White_Transparent.png")} alt="CENI Construcoes" style={{ height: "12vh", width: "auto", display: "block", filter: "drop-shadow(0 0 80px rgba(51,232,255,1))" }} />
                  <span style={{ position: "absolute", right: "-25px", top: "-10px", color: "#ffffff", fontSize: "20px", fontFamily: "sans-serif", fontWeight: "bold", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>®</span>
                </div>
              </div>
            </div>
            {/* Leyenda */}
            <div style={{ textAlign: "center", marginTop: "5vh", display: "flex", flexDirection: "column", gap: "1.2vh", animation: "re-fadeIn 1.5s ease forwards" }}>
              <span style={{ color: "#33E8FF", fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(16px, 1.5vw, 22px)", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", textShadow: "0 0 25px rgba(51,232,255,0.8)" }}>MR Real Estate</span>
              <span style={{ color: "rgba(51,232,255,0.8)", fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(12px, 1vw, 14px)", fontWeight: 600, fontStyle: "italic", letterSpacing: "0.3em", textTransform: "uppercase" }}>BY</span>
              <span style={{ color: "#33E8FF", fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(16px, 1.5vw, 22px)", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", textShadow: "0 0 25px rgba(51,232,255,0.8)" }}>CENI Construcoes</span>
            </div>
          </div>

          {/* Lado Derecho: Floripa */}
          <div style={{ flex: "0 0 25vw", height: "100%", position: "relative", animation: "re-fadeInRight 1.5s ease forwards", opacity: 0, boxShadow: "-20px 0 50px rgba(0,0,0,0.9)", zIndex: 2 }}>
            <img src={A("Splash_Floripa.jpg")} alt="Floripa" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9) contrast(1.2)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, transparent 60%, #000000 100%)" }} />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          DASHBOARD LAYOUT (Sidebar + Main)
      ════════════════════════════════════════════════════════════ */}
      <div className="re-layout">

        {/* ░░ SIDEBAR ░░ */}
        <aside className="re-sidebar">
          {/* Logo */}
          <div style={{ padding: "4vh 2vw", textAlign: "center", borderBottom: "1px solid rgba(51,232,255,0.1)" }}>
            <img src={A("Logo_MR_Tech.jpg")} alt="MR Tech" style={{ height: "160px", width: "160px", borderRadius: "50%", boxShadow: "0 0 25px rgba(51,232,255,0.8)", clipPath: "circle(47%)" }} />
          </div>

          {/* Tabs de navegación */}
          <nav className="re-sidebar-nav">
            {/* INICIO */}
            <div className={tabCls("home-view")} onClick={() => switchView("home-view")} style={{ cursor: "pointer" }}>
              <img src={A(SOLAPA_INICIO(lang))} alt="Inicio" />
            </div>
            {/* CENI */}
            <div className={tabCls("ceni-view")} onClick={() => switchView("ceni-view")} style={{ cursor: "pointer" }}>
              <img src={A(SOLAPA_CENI(lang))} alt="CENI" />
            </div>
            {/* PROYECTOS */}
            <div className={`re-tab re-img-tab${(view === "proyectos-view" || view === "mar-do-norte-view" || view === "beriyth-view") ? " re-active" : ""}`} onClick={() => switchView("proyectos-view")} style={{ cursor: "pointer" }}>
              <img src={A(SOLAPA_PROYECTOS(lang))} alt="Proyectos" />
            </div>
            {/* LANZAMIENTOS */}
            <div className={tabCls("alanzar-view")} onClick={() => switchView("alanzar-view")} style={{ cursor: "pointer" }}>
              <img src={A(SOLAPA_LANZAM(lang))} alt="Lanzamientos" />
            </div>

            {/* Botón Regresar */}
            <div
              className="re-tab"
              onClick={goBack}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", borderColor: "#ffffff", color: "#0a1e3c", background: "#ffffff", padding: "8px 16px", fontSize: "13px", marginTop: "10px", cursor: "pointer", width: "100%", maxWidth: "140px", borderRadius: "20px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span style={{ fontWeight: 800 }}>{T[lang].volver}</span>
            </div>

            {/* Logo MR Tech → mrtechnology.it.com */}
            <div
              onClick={() => window.open("https://www.mrtechnology.it.com", "_blank")}
              className="re-mr-tech-link"
              title="Ir a MR Technology"
              style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", cursor: "pointer", position: "relative", borderRadius: "50%", paddingBottom: "1vh" }}
            >
              <img
                src={A("Logo_MR_Tech_Transparente.png")}
                alt="MR Tech"
                style={{ maxWidth: "180px", height: "auto", transition: "all 0.3s ease", filter: "drop-shadow(0 0 10px rgba(51,232,255,0.4))" }}
              />
            </div>
          </nav>
        </aside>

        {/* ░░ MAIN CONTENT ░░ */}
        <div className="re-main-area">

          {/* HEADER SUPERIOR */}
          <header style={{ height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2vw", zIndex: 40, position: "relative", background: "rgba(51,232,255,0.35)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>

            {/* Banderas + controles izquierda */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {/* Bandera ES */}
              <div onClick={() => changeLang("es")} style={{ cursor: "pointer", padding: "4px 8px", borderRadius: "4px", border: "1px solid", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", ...flagEsStyle }} title="Español (Argentino)">
                <svg width="24" height="16" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                  <rect width="30" height="20" fill="#75AADB" />
                  <rect y="6.67" width="30" height="6.67" fill="#FFF" />
                  <circle cx="15" cy="10" r="2.5" fill="#F6B40E" />
                </svg>
              </div>
              {/* Bandera PT */}
              <div onClick={() => changeLang("pt")} style={{ cursor: "pointer", padding: "4px 8px", borderRadius: "4px", border: "1px solid", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", ...flagPtStyle }} title="Português (Brasil)">
                <svg width="24" height="16" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                  <rect width="30" height="20" fill="#009B3A" />
                  <polygon points="15,2 28,10 15,18 2,10" fill="#FEDF00" />
                  <circle cx="15" cy="10" r="4.5" fill="#002776" />
                </svg>
              </div>
              {/* Fullscreen */}
              <div onClick={toggleFullScreen} style={{ cursor: "pointer", padding: "4px 8px", marginLeft: "15px", borderRadius: "4px", border: "1px solid rgba(51,232,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }} title="Pantalla Completa">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#33E8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </div>
              {/* Mensaje bienvenida */}
              {welcomeMsg && (
                <div style={{ marginLeft: "15px", fontFamily: "'Montserrat', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                  dangerouslySetInnerHTML={{ __html: welcomeMsg }} />
              )}
            </div>

            {/* RRSS derecha */}
            <div style={{ display: "flex", gap: "2vw", alignItems: "center" }}>
              <a href="https://instagram.com/_mr__realestate_" target="_blank" rel="noopener noreferrer" className="re-social-link" style={{ background: "linear-gradient(135deg, rgba(193,53,132,0.85) 0%, rgba(225,119,43,0.85) 50%, rgba(253,204,68,0.85) 100%)", boxShadow: "0 4px 20px rgba(193,53,132,0.4)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="re-ig-grad" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stopColor="#fdf497" /><stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" /><stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect width="24" height="24" rx="6" fill="url(#re-ig-grad)" />
                  <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="white" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="1.5" />
                  <circle cx="17" cy="7" r="1" fill="white" />
                </svg>
                <span>MR Real Estate</span>
              </a>
              <a href="https://instagram.com/ceniysouthierconstrucciones" target="_blank" rel="noopener noreferrer" className="re-social-link" style={{ background: "linear-gradient(135deg, rgba(193,53,132,0.85) 0%, rgba(225,119,43,0.85) 50%, rgba(253,204,68,0.85) 100%)", boxShadow: "0 4px 20px rgba(193,53,132,0.4)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="url(#re-ig-grad)" />
                  <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="white" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="1.5" />
                  <circle cx="17" cy="7" r="1" fill="white" />
                </svg>
                <span>CENI Construcciones</span>
              </a>
              <a href="https://ceniconstrucoes.com.br" target="_blank" rel="noopener noreferrer" className="re-social-link" style={{ background: "linear-gradient(135deg, rgba(29,67,143,0.85) 0%, rgba(29,100,180,0.85) 100%)", boxShadow: "0 4px 20px rgba(29,67,143,0.4)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="white" fillOpacity="0.25" />
                  <text x="12" y="17" fontSize="11" fontWeight="bold" fontFamily="Arial,sans-serif" textAnchor="middle" fill="white" letterSpacing="-0.5">CE</text>
                </svg>
                <span>{T[lang].web_ceni}</span>
              </a>
            </div>
          </header>

          {/* ── ÁREA DE VISTAS ── */}
          <main
            id="re-main-content"
            style={{
              flex: 1, position: "relative", overflowY: "auto", overflowX: "hidden",
              background: floripaBg
                ? `linear-gradient(135deg, #e5e7eb 0%, rgba(51,232,255,0.5) 100%)`
                : "linear-gradient(135deg, #e5e7eb 0%, rgba(51,232,255,0.5) 100%)",
              borderTopLeftRadius: "40px",
              boxShadow: "-10px -10px 30px rgba(0,0,0,0.4)",
              zIndex: 20,
            }}
          >
            {/* Fondo Floripa watermark cuando no estamos en INICIO */}
            {floripaBg && (
              <div style={{ position: "absolute", inset: 0, background: `url(${A("Imagen Floripa.png")}) center/cover no-repeat`, opacity: 0.18, zIndex: 0, pointerEvents: "none", transition: "opacity 0.6s ease" }} />
            )}

            {/* ════ VISTA INICIO ════ */}
            <div style={{ display: view === "home-view" ? "block" : "none", height: "100%", width: "100%", position: "relative", overflow: "auto" }}>
              <div style={{ position: "fixed", inset: 0, background: "linear-gradient(135deg, #e5e7eb 0%, rgba(51,232,255,0.5) 100%)", zIndex: -2 }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "100%", padding: "20px 0" }}>
                <div style={{ width: "100%", maxWidth: "1200px", position: "relative", animation: "re-fadeInUp 1s ease forwards", zIndex: 1, overflow: "visible" }}>
                  <img src={A("Banner Principal WSP.png")} alt="Banner Principal" draggable={false}
                    style={{ width: "100%", height: "auto", objectFit: "contain", display: "block", margin: "0 auto", filter: "brightness(1.1) contrast(1.1)" }} />
                </div>
              </div>
            </div>

            {/* ════ VISTA CENI ════ */}
            <div style={{ display: view === "ceni-view" ? "block" : "none", position: "relative", zIndex: 1 }}>
              <div className="re-ceni-flex">
                {/* PDF */}
                <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", borderRadius: "14px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(51,232,255,0.18)" }}>
                  <iframe src={A("Presentación Comercial CENI.pdf") + "#toolbar=0&navpanes=0&scrollbar=0"} style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
                </div>
                {/* Video */}
                <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", borderRadius: "14px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(51,232,255,0.18)", background: "#000" }}>
                  <video src={A("1. Lanzamiento Mar Do Norte - Marcio.mp4")} controls style={{ width: "100%", height: "100%", display: "block", objectFit: "contain", outline: "none", background: "#000" }} />
                </div>
              </div>
            </div>

            {/* ════ VISTA PROYECTOS ════ */}
            <div style={{ display: view === "proyectos-view" ? "block" : "none", position: "relative", zIndex: 1 }}>
              <div className="re-proyectos-flex">
                {/* Mar do Norte */}
                <div className="re-proyecto-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "46%", height: "85%", gap: "40px" }}>
                  <h2 className="re-proyecto-title">MAR DO NORTE STUDIOS</h2>
                  <div className="re-proyecto-card" onClick={() => switchView("mar-do-norte-view")} style={{ position: "relative" }}>
                    <img src={A("Proyecto Mar do norte.png")} alt="Proyecto Mar do norte" style={{ filter: "url(#re-remove-black)" }} />
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(220,20,60,0.95)", color: "white", fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(20px, 3vw, 40px)", fontWeight: 900, padding: "15px 40px", borderRadius: "8px", border: "3px solid white", boxShadow: "0 10px 40px rgba(220,20,60,0.8)", textTransform: "uppercase", letterSpacing: "4px", pointerEvents: "none", zIndex: 20, textAlign: "center" }}>
                      VENDIDO
                    </div>
                  </div>
                </div>
                {/* BERIYTH */}
                <div className="re-proyecto-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "46%", height: "85%", gap: "40px" }}>
                  <h2 className="re-proyecto-title">BERIYTH RESIDENCE</h2>
                  <div className="re-proyecto-card" onClick={() => switchView("beriyth-view")}>
                    <img src={A("Proyecto Beryhit.png")} alt="Proyecto Beryhit" style={{ filter: "url(#re-remove-black)" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ════ VISTA MAR DO NORTE ════ */}
            <div style={{ display: view === "mar-do-norte-view" ? "block" : "none", position: "relative", zIndex: 1 }}>
              {/* Inner Tabs */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "1%", marginBottom: "2%" }}>
                <div className={innerCls("mar-presentacion", marInner)} onClick={() => setMarInner("mar-presentacion")}>
                  <img src={A(SOLAPA_PRESENT(lang))} alt="Presentación Comercial" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("mar-book", marInner)} onClick={() => setMarInner("mar-book")}>
                  <img src={A("Solapa_Book_Web.png")} alt="Book Web" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("mar-videos", marInner)} onClick={() => setMarInner("mar-videos")}>
                  <img src={A("Solapa_Videos.png")} alt="Videos" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("mar-avances", marInner)} onClick={() => setMarInner("mar-avances")}>
                  <img src={A("Solapa_Avances_Obra.png")} alt="Avances de Obra" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("mar-ultimas", marInner)} onClick={() => setMarInner("mar-ultimas")}>
                  <img src={A("Solapa_Ultimas_Unidades.png")} alt="Últimas Unidades" style={{ maxWidth: "180px" }} />
                </div>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className={innerViewCls("mar-presentacion", marInner)}>
                  <img src={A("Presentacion Comercial MAR.png")} alt="Presentacion Comercial MAR" style={{ width: "100%", height: "auto", maxHeight: "75vh", objectFit: "contain", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
                </div>
                <div className={innerViewCls("mar-book", marInner)}>
                  <iframe src={A("BOOK MAR DO NORTE Studios.pdf") + "#toolbar=0&navpanes=0&scrollbar=0"} style={{ width: "100%", height: "75vh", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
                </div>
                <div className={innerViewCls("mar-videos", marInner)}>
                  <video src={A("Video MAR DO NORTE STUDIOS Español.mp4")} controls style={{ width: "100%", maxHeight: "75vh", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", outline: "none" }} />
                </div>
                <div className={innerViewCls("mar-avances", marInner)}>
                  <div style={{ display: "flex", gap: "20px", width: "100%", height: "75vh" }}>
                    <div style={{ flex: 1 }}>
                      <iframe src={A("1. Avances.pdf") + "#toolbar=0&navpanes=0&scrollbar=0"} style={{ width: "100%", height: "100%", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
                    </div>
                    <div className="re-video-scroll" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "25px", overflowY: "auto", paddingRight: "15px", height: "100%", alignItems: "center" }}>
                      <video src={A("1. Video Avances.mp4")} controls style={{ width: "80%", height: "auto", maxHeight: "300px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", objectFit: "contain", outline: "none", flexShrink: 0, background: "#000" }} />
                      <video src={A("2. Video Avances.mp4")} controls style={{ width: "80%", height: "auto", maxHeight: "300px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", objectFit: "contain", outline: "none", flexShrink: 0, background: "#000" }} />
                    </div>
                  </div>
                </div>
                <div className={innerViewCls("mar-ultimas", marInner)}>
                  <div style={{ width: "100%", height: "75vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: "rgba(10,30,60,0.4)", backdropFilter: "blur(10px)", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.5)", border: "1px solid rgba(51,232,255,0.2)", padding: "40px" }}>
                    <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(3rem, 5vw, 5rem)", color: "#ff3366", textShadow: "0 0 30px rgba(255,51,102,0.8)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "2px" }}>¡ÉXITO TOTAL!</h1>
                    <div style={{ width: "80px", height: "4px", background: "#33E8FF", marginBottom: "30px", borderRadius: "2px" }} />
                    <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(2rem, 3vw, 3rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "2px", marginBottom: "10px" }}>100% VENDIDAS</h2>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(1.2rem, 2vw, 1.8rem)", color: "#33E8FF", letterSpacing: "4px", fontWeight: 500 }}>TODAS LAS UNIDADES</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ════ VISTA BERIYTH RESIDENCE ════ */}
            <div style={{ display: view === "beriyth-view" ? "block" : "none", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "1%", marginBottom: "2%" }}>
                <div className={innerCls("beriyth-presentacion", beriythInner)} onClick={() => setBeriythInner("beriyth-presentacion")}>
                  <img src={A(SOLAPA_PRESENT(lang))} alt="Presentación Comercial" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("beriyth-book", beriythInner)} onClick={() => setBeriythInner("beriyth-book")}>
                  <img src={A("Solapa_Book_Web.png")} alt="Book Web" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("beriyth-videos", beriythInner)} onClick={() => setBeriythInner("beriyth-videos")}>
                  <img src={A("Solapa_Videos.png")} alt="Videos" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("beriyth-avances", beriythInner)} onClick={() => setBeriythInner("beriyth-avances")}>
                  <img src={A("Solapa_Avances_Obra.png")} alt="Avances de Obra" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("beriyth-ultimas", beriythInner)} onClick={() => setBeriythInner("beriyth-ultimas")}>
                  <img src={A("Solapa_Ultimas_Unidades.png")} alt="Últimas Unidades" style={{ maxWidth: "180px" }} />
                </div>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className={innerViewCls("beriyth-presentacion", beriythInner)}>
                  <img src={A("Presentacion Comercial BERYITH.png")} alt="Presentacion Comercial BERYITH" style={{ width: "100%", height: "auto", maxHeight: "75vh", objectFit: "contain", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
                </div>
                <div className={innerViewCls("beriyth-book", beriythInner)}>
                  <iframe src={A("book Beriyth Residence.pdf") + "#toolbar=0&navpanes=0&scrollbar=0"} style={{ width: "100%", height: "75vh", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
                </div>
                <div className={innerViewCls("beriyth-videos", beriythInner)}>
                  <video src={A("Video Promocional BERIYTH Residence.mp4")} controls style={{ width: "100%", maxHeight: "75vh", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", outline: "none", background: "#000" }} />
                </div>
                <div className={innerViewCls("beriyth-avances", beriythInner)}>
                  <div style={{ width: "100%", height: "75vh", display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.4)", borderRadius: "12px" }}>
                    <h2 style={{ fontFamily: "'Montserrat', sans-serif", color: "#0a1e46" }}>[AVANCES DE OBRA BERIYTH RESIDENCE]</h2>
                  </div>
                </div>
                <div className={innerViewCls("beriyth-ultimas", beriythInner)}>
                  <div style={{ width: "100%", height: "75vh", display: "flex", gap: "20px", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ flex: 1, height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <img src={A("Ultimas BERY Metrica.png")} alt="Métricas" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
                    </div>
                    <div style={{ flex: 1, height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <img src={A("Ultimas BERIYTH.png")} alt="Últimas Unidades" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ════ VISTA A LANZAR (Serene Beach) ════ */}
            <div style={{ display: view === "alanzar-view" ? "block" : "none", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "1%", marginBottom: "2%" }}>
                <div className={innerCls("alanzar-presentacion", alanzarInner)} onClick={() => setAlanzarInner("alanzar-presentacion")}>
                  <img src={A(SOLAPA_PRESENT(lang))} alt="Presentación Comercial" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("alanzar-book", alanzarInner)} onClick={() => setAlanzarInner("alanzar-book")}>
                  <img src={A("Solapa_Book_Web.png")} alt="Book Web" style={{ maxWidth: "180px" }} />
                </div>
                <div className={innerCls("alanzar-videos", alanzarInner)} onClick={() => setAlanzarInner("alanzar-videos")}>
                  <img src={A("Solapa_Videos.png")} alt="Videos" style={{ maxWidth: "180px" }} />
                </div>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className={innerViewCls("alanzar-presentacion", alanzarInner)} style={{ maxWidth: "100%", width: "98%" }}>
                  <img src={A("Presentacion SErene.png")} alt="Serene Beach Residence" style={{ width: "100%", height: "auto", maxHeight: "85vh", objectFit: "contain", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
                </div>
                <div className={innerViewCls("alanzar-book", alanzarInner)} style={{ maxWidth: "100%", width: "98%" }}>
                  <iframe src={A("Book Serene Beach Residence.pdf") + "#toolbar=0&navpanes=0&scrollbar=0"} style={{ width: "100%", height: "85vh", border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }} />
                </div>
                <div className={innerViewCls("alanzar-videos", alanzarInner)} style={{ maxWidth: "100%", width: "98%" }}>
                  <video src={A("Video Promocional SERENA BEACH.mp4")} controls style={{ width: "100%", maxHeight: "85vh", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", outline: "none", background: "#000" }} />
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
