(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,61936,e=>{"use strict";var r=e.i(43476),t=e.i(71645);let i=e=>`/real-estate/${e}`,a={es:{volver:"VOLVER",web_ceni:"WEB CENI"},pt:{volver:"VOLTAR",web_ceni:"SITE CENI"}},s=e=>"es"===e?"Solapa_Presentacion_Comercial.png":"Solapa_Presentacion_Comercial_Br.png";e.s(["default",0,function(){let[e,o]=(0,t.useState)("home-view"),[n,l]=(0,t.useState)(!1),[d,c]=(0,t.useState)(!0),[p,x]=(0,t.useState)("es"),[h,g]=(0,t.useState)(null),[b,m]=(0,t.useState)(!0),[f,y]=(0,t.useState)("mar-presentacion"),[v,w]=(0,t.useState)("beriyth-presentacion"),[u,j]=(0,t.useState)("alanzar-presentacion");(0,t.useEffect)(()=>{let e=setTimeout(()=>c(!1),4e3),r=setTimeout(()=>c(!1),6e3);return()=>{clearTimeout(e),clearTimeout(r)}},[]),(0,t.useEffect)(()=>{m(!1)},[]);let k=(0,t.useCallback)(e=>{o(e),"home-view"===e?l(!1):l(!0)},[]),S=(0,t.useCallback)(()=>{"mar-do-norte-view"===e||"beriyth-view"===e?k("proyectos-view"):k("home-view")},[e,k]),C=(0,t.useCallback)(e=>{x(e),b||("es"===e?g('<span style="color:#75AADB">BIENVENIDO</span> <span style="color:#FFFFFF">!!!</span>'):g('<span style="color:#009B3A">Bem-vindo</span> <span style="color:#FEDF00">!!!!!</span>'),setTimeout(()=>g(null),2e3))},[b]),I=`
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
  `,F="es"===p?{background:"rgba(255,255,255,0.1)",borderColor:"rgba(255,255,255,0.3)",boxShadow:"0 0 20px rgba(51,232,255,0.8)",transform:"scale(1.8)",margin:"0 10px"}:{background:"transparent",borderColor:"transparent",boxShadow:"none",transform:"scale(1)",margin:"0"},R="pt"===p?{background:"rgba(255,255,255,0.1)",borderColor:"rgba(255,255,255,0.3)",boxShadow:"0 0 20px rgba(0,255,0,0.8)",transform:"scale(1.8)",margin:"0 10px"}:{background:"transparent",borderColor:"transparent",boxShadow:"none",transform:"scale(1)",margin:"0"},N=r=>`re-tab re-img-tab${e===r?" re-active":""}`,E=(e,r)=>`re-inner-tab re-img-tab${e===r?" re-active":""}`,B=(e,r)=>`re-inner-view${e===r?" re-active":""}`;return(0,r.jsxs)("div",{id:"re-root",style:{position:"fixed",inset:0,width:"100vw",height:"100vh",overflow:"hidden",fontFamily:"'Montserrat', sans-serif",background:"#000"},children:[(0,r.jsx)("style",{children:I}),(0,r.jsx)("svg",{style:{width:0,height:0,position:"absolute"},"aria-hidden":"true",children:(0,r.jsx)("defs",{children:(0,r.jsx)("filter",{id:"re-remove-black",colorInterpolationFilters:"sRGB",children:(0,r.jsx)("feColorMatrix",{type:"matrix",values:"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  2.5 2.5 2.5 0 0"})})})}),d&&(0,r.jsxs)("div",{onClick:()=>c(!1),style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"linear-gradient(135deg, #020813 0%, #000000 100%)",zIndex:99999,display:"flex",flexDirection:"row",alignItems:"stretch",justifyContent:"space-between",transition:"opacity 1s ease-in-out, visibility 1s ease-in-out",cursor:"pointer"},children:[(0,r.jsxs)("div",{style:{flex:"0 0 25vw",height:"100%",position:"relative",animation:"re-fadeInLeft 1.5s ease forwards",opacity:0,boxShadow:"20px 0 50px rgba(0,0,0,0.9)",zIndex:2},children:[(0,r.jsx)("img",{src:i("Splash_Mendoza.jpg"),alt:"Mendoza",style:{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.9) contrast(1.2)"}}),(0,r.jsx)("div",{style:{position:"absolute",inset:0,background:"linear-gradient(90deg, transparent 60%, #000000 100%)"}})]}),(0,r.jsxs)("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",perspective:"800px",zIndex:1},children:[(0,r.jsxs)("div",{style:{position:"relative",width:"100%",height:"40vh",transformStyle:"preserve-3d",animation:"re-spinAxis 8s linear infinite",marginTop:"-5vh"},children:[(0,r.jsx)("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%) rotateX(90deg)",width:"36vw",height:"36vw",border:"3px dashed rgba(51,232,255,0.4)",borderRadius:"50%",boxShadow:"0 0 40px rgba(51,232,255,0.4), inset 0 0 40px rgba(51,232,255,0.4)",boxSizing:"border-box"}}),(0,r.jsx)("div",{style:{position:"absolute",top:"50%",left:"50%",transformStyle:"preserve-3d",transform:"translate(-50%, -50%) translateZ(18vw)"},children:(0,r.jsxs)("div",{style:{position:"relative",display:"inline-block",borderRadius:"50%",boxShadow:"0 15px 40px rgba(0,0,0,0.8), 0 0 200px rgba(51,232,255,0.9)",animation:"re-spinCounterMR 8s linear infinite"},children:[(0,r.jsx)("img",{src:i("Logo_MR_Tech.jpg"),alt:"MR Real Estate",style:{height:"35vh",width:"35vh",objectFit:"cover",borderRadius:"50%",clipPath:"circle(47% at 50% 50%)",display:"block"}}),(0,r.jsx)("span",{style:{position:"absolute",right:"-10px",top:"15px",color:"#e5c158",fontSize:"24px",fontFamily:"sans-serif",fontWeight:"bold",textShadow:"0 2px 5px rgba(0,0,0,0.9)"},children:"®"})]})}),(0,r.jsx)("div",{style:{position:"absolute",top:"50%",left:"50%",transformStyle:"preserve-3d",transform:"translate(-50%, -50%) rotateY(180deg) translateZ(18vw)"},children:(0,r.jsxs)("div",{style:{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",animation:"re-spinCounterCENI 8s linear infinite"},children:[(0,r.jsx)("img",{src:i("Logo_CENI_White_Transparent.png"),alt:"CENI Construcoes",style:{height:"12vh",width:"auto",display:"block",filter:"drop-shadow(0 0 80px rgba(51,232,255,1))"}}),(0,r.jsx)("span",{style:{position:"absolute",right:"-25px",top:"-10px",color:"#ffffff",fontSize:"20px",fontFamily:"sans-serif",fontWeight:"bold",textShadow:"0 2px 4px rgba(0,0,0,0.8)"},children:"®"})]})})]}),(0,r.jsxs)("div",{style:{textAlign:"center",marginTop:"5vh",display:"flex",flexDirection:"column",gap:"1.2vh",animation:"re-fadeIn 1.5s ease forwards"},children:[(0,r.jsx)("span",{style:{color:"#33E8FF",fontFamily:"'Orbitron', sans-serif",fontSize:"clamp(16px, 1.5vw, 22px)",fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",textShadow:"0 0 25px rgba(51,232,255,0.8)"},children:"MR Real Estate"}),(0,r.jsx)("span",{style:{color:"rgba(51,232,255,0.8)",fontFamily:"'Orbitron', sans-serif",fontSize:"clamp(12px, 1vw, 14px)",fontWeight:600,fontStyle:"italic",letterSpacing:"0.3em",textTransform:"uppercase"},children:"BY"}),(0,r.jsx)("span",{style:{color:"#33E8FF",fontFamily:"'Orbitron', sans-serif",fontSize:"clamp(16px, 1.5vw, 22px)",fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",textShadow:"0 0 25px rgba(51,232,255,0.8)"},children:"CENI Construcoes"})]})]}),(0,r.jsxs)("div",{style:{flex:"0 0 25vw",height:"100%",position:"relative",animation:"re-fadeInRight 1.5s ease forwards",opacity:0,boxShadow:"-20px 0 50px rgba(0,0,0,0.9)",zIndex:2},children:[(0,r.jsx)("img",{src:i("Splash_Floripa.jpg"),alt:"Floripa",style:{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.9) contrast(1.2)"}}),(0,r.jsx)("div",{style:{position:"absolute",inset:0,background:"linear-gradient(270deg, transparent 60%, #000000 100%)"}})]})]}),(0,r.jsxs)("div",{style:{display:"flex",height:"100vh",width:"100vw",overflow:"hidden",background:"transparent",position:"relative"},children:[(0,r.jsxs)("aside",{style:{width:"250px",display:"flex",flexDirection:"column",zIndex:50,flexShrink:0,position:"relative",background:"rgba(51,232,255,0.35)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"},children:[(0,r.jsx)("div",{style:{padding:"4vh 2vw",textAlign:"center",borderBottom:"1px solid rgba(51,232,255,0.1)"},children:(0,r.jsx)("img",{src:i("Logo_MR_Tech.jpg"),alt:"MR Tech",style:{height:"160px",width:"160px",borderRadius:"50%",boxShadow:"0 0 25px rgba(51,232,255,0.8)",clipPath:"circle(47%)"}})}),(0,r.jsxs)("nav",{style:{flex:1,display:"flex",flexDirection:"column",gap:"8px",padding:"0 1.5vw 2vh 1.5vw",alignItems:"center",marginBottom:0},children:[(0,r.jsx)("div",{className:N("home-view"),onClick:()=>k("home-view"),style:{cursor:"pointer"},children:(0,r.jsx)("img",{src:i("es"===p?"Solapa_INICIO.png":"Solapa_INICIO_Br.png"),alt:"Inicio"})}),(0,r.jsx)("div",{className:N("ceni-view"),onClick:()=>k("ceni-view"),style:{cursor:"pointer"},children:(0,r.jsx)("img",{src:i("es"===p?"Solapa_CENI.png":"Solapa_CENI_Br.png"),alt:"CENI"})}),(0,r.jsx)("div",{className:`re-tab re-img-tab${"proyectos-view"===e||"mar-do-norte-view"===e||"beriyth-view"===e?" re-active":""}`,onClick:()=>k("proyectos-view"),style:{cursor:"pointer"},children:(0,r.jsx)("img",{src:i("es"===p?"Solapa_PROYECTOS.png":"Solapa_PROYECTOS_Br.png"),alt:"Proyectos"})}),(0,r.jsx)("div",{className:N("alanzar-view"),onClick:()=>k("alanzar-view"),style:{cursor:"pointer"},children:(0,r.jsx)("img",{src:i("es"===p?"Solapa_LANZAMIENTOS.png":"Solapa_LANZAMIENTOS_Br.png"),alt:"Lanzamientos"})}),(0,r.jsxs)("div",{className:"re-tab",onClick:S,style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",borderColor:"#ffffff",color:"#0a1e3c",background:"#ffffff",padding:"8px 16px",fontSize:"13px",marginTop:"10px",cursor:"pointer",width:"100%",maxWidth:"140px",borderRadius:"20px"},children:[(0,r.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:(0,r.jsx)("path",{d:"M19 12H5M12 19l-7-7 7-7"})}),(0,r.jsx)("span",{style:{fontWeight:800},children:a[p].volver})]}),(0,r.jsx)("div",{onClick:()=>window.open("https://www.mrtechnology.it.com","_blank"),className:"re-mr-tech-link",title:"Ir a MR Technology",style:{marginTop:"auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",cursor:"pointer",position:"relative",borderRadius:"50%",paddingBottom:"1vh"},children:(0,r.jsx)("img",{src:i("Logo_MR_Tech_Transparente.png"),alt:"MR Tech",style:{maxWidth:"180px",height:"auto",transition:"all 0.3s ease",filter:"drop-shadow(0 0 10px rgba(51,232,255,0.4))"}})})]})]}),(0,r.jsxs)("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"},children:[(0,r.jsxs)("header",{style:{height:"60px",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 2vw",zIndex:40,position:"relative",background:"rgba(51,232,255,0.35)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"},children:[(0,r.jsxs)("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[(0,r.jsx)("div",{onClick:()=>C("es"),style:{cursor:"pointer",padding:"4px 8px",borderRadius:"4px",border:"1px solid",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s",...F},title:"Español (Argentino)",children:(0,r.jsxs)("svg",{width:"24",height:"16",viewBox:"0 0 30 20",xmlns:"http://www.w3.org/2000/svg",children:[(0,r.jsx)("rect",{width:"30",height:"20",fill:"#75AADB"}),(0,r.jsx)("rect",{y:"6.67",width:"30",height:"6.67",fill:"#FFF"}),(0,r.jsx)("circle",{cx:"15",cy:"10",r:"2.5",fill:"#F6B40E"})]})}),(0,r.jsx)("div",{onClick:()=>C("pt"),style:{cursor:"pointer",padding:"4px 8px",borderRadius:"4px",border:"1px solid",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s",...R},title:"Português (Brasil)",children:(0,r.jsxs)("svg",{width:"24",height:"16",viewBox:"0 0 30 20",xmlns:"http://www.w3.org/2000/svg",children:[(0,r.jsx)("rect",{width:"30",height:"20",fill:"#009B3A"}),(0,r.jsx)("polygon",{points:"15,2 28,10 15,18 2,10",fill:"#FEDF00"}),(0,r.jsx)("circle",{cx:"15",cy:"10",r:"4.5",fill:"#002776"})]})}),(0,r.jsx)("div",{onClick:()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(console.error)},style:{cursor:"pointer",padding:"4px 8px",marginLeft:"15px",borderRadius:"4px",border:"1px solid rgba(51,232,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s"},title:"Pantalla Completa",children:(0,r.jsx)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"#33E8FF",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:(0,r.jsx)("path",{d:"M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"})})}),h&&(0,r.jsx)("div",{style:{marginLeft:"15px",fontFamily:"'Montserrat', sans-serif",fontSize:"13px",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",whiteSpace:"nowrap",textShadow:"0 2px 4px rgba(0,0,0,0.5)"},dangerouslySetInnerHTML:{__html:h}})]}),(0,r.jsxs)("div",{style:{display:"flex",gap:"2vw",alignItems:"center"},children:[(0,r.jsxs)("a",{href:"https://instagram.com/_mr__realestate_",target:"_blank",rel:"noopener noreferrer",className:"re-social-link",style:{background:"linear-gradient(135deg, rgba(193,53,132,0.85) 0%, rgba(225,119,43,0.85) 50%, rgba(253,204,68,0.85) 100%)",boxShadow:"0 4px 20px rgba(193,53,132,0.4)"},children:[(0,r.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:[(0,r.jsx)("defs",{children:(0,r.jsxs)("radialGradient",{id:"re-ig-grad",cx:"30%",cy:"107%",r:"150%",children:[(0,r.jsx)("stop",{offset:"0%",stopColor:"#fdf497"}),(0,r.jsx)("stop",{offset:"5%",stopColor:"#fdf497"}),(0,r.jsx)("stop",{offset:"45%",stopColor:"#fd5949"}),(0,r.jsx)("stop",{offset:"60%",stopColor:"#d6249f"}),(0,r.jsx)("stop",{offset:"90%",stopColor:"#285AEB"})]})}),(0,r.jsx)("rect",{width:"24",height:"24",rx:"6",fill:"url(#re-ig-grad)"}),(0,r.jsx)("rect",{x:"6",y:"6",width:"12",height:"12",rx:"3.5",fill:"none",stroke:"white",strokeWidth:"1.5"}),(0,r.jsx)("circle",{cx:"12",cy:"12",r:"3",fill:"none",stroke:"white",strokeWidth:"1.5"}),(0,r.jsx)("circle",{cx:"17",cy:"7",r:"1",fill:"white"})]}),(0,r.jsx)("span",{children:"MR Real Estate"})]}),(0,r.jsxs)("a",{href:"https://instagram.com/ceniysouthierconstrucciones",target:"_blank",rel:"noopener noreferrer",className:"re-social-link",style:{background:"linear-gradient(135deg, rgba(193,53,132,0.85) 0%, rgba(225,119,43,0.85) 50%, rgba(253,204,68,0.85) 100%)",boxShadow:"0 4px 20px rgba(193,53,132,0.4)"},children:[(0,r.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:[(0,r.jsx)("rect",{width:"24",height:"24",rx:"6",fill:"url(#re-ig-grad)"}),(0,r.jsx)("rect",{x:"6",y:"6",width:"12",height:"12",rx:"3.5",fill:"none",stroke:"white",strokeWidth:"1.5"}),(0,r.jsx)("circle",{cx:"12",cy:"12",r:"3",fill:"none",stroke:"white",strokeWidth:"1.5"}),(0,r.jsx)("circle",{cx:"17",cy:"7",r:"1",fill:"white"})]}),(0,r.jsx)("span",{children:"CENI Construcciones"})]}),(0,r.jsxs)("a",{href:"https://ceniconstrucoes.com.br",target:"_blank",rel:"noopener noreferrer",className:"re-social-link",style:{background:"linear-gradient(135deg, rgba(29,67,143,0.85) 0%, rgba(29,100,180,0.85) 100%)",boxShadow:"0 4px 20px rgba(29,67,143,0.4)"},children:[(0,r.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:[(0,r.jsx)("rect",{width:"24",height:"24",rx:"6",fill:"white",fillOpacity:"0.25"}),(0,r.jsx)("text",{x:"12",y:"17",fontSize:"11",fontWeight:"bold",fontFamily:"Arial,sans-serif",textAnchor:"middle",fill:"white",letterSpacing:"-0.5",children:"CE"})]}),(0,r.jsx)("span",{children:a[p].web_ceni})]})]})]}),(0,r.jsxs)("main",{id:"re-main-content",style:{flex:1,position:"relative",overflowY:"auto",overflowX:"hidden",background:"linear-gradient(135deg, #e5e7eb 0%, rgba(51,232,255,0.5) 100%)",borderTopLeftRadius:"40px",boxShadow:"-10px -10px 30px rgba(0,0,0,0.4)",zIndex:20},children:[n&&(0,r.jsx)("div",{style:{position:"absolute",inset:0,background:`url(${i("Imagen Floripa.png")}) center/cover no-repeat`,opacity:.18,zIndex:0,pointerEvents:"none",transition:"opacity 0.6s ease"}}),(0,r.jsxs)("div",{style:{display:"home-view"===e?"block":"none",height:"100%",width:"100%",position:"relative"},children:[(0,r.jsx)("div",{style:{position:"absolute",inset:0,background:"linear-gradient(135deg, #e5e7eb 0%, rgba(51,232,255,0.5) 100%)",zIndex:-2}}),(0,r.jsx)("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"flex-start",width:"100%",height:"100%"},children:(0,r.jsxs)("div",{style:{width:"100%",height:"100%",overflow:"hidden",position:"relative",animation:"re-fadeInUp 1s ease forwards",zIndex:1},children:[(0,r.jsx)("img",{src:i("Banner Principal WSP.png"),alt:"Banner Principal",draggable:!1,style:{width:"100%",height:"100%",objectFit:"fill",objectPosition:"center",display:"block",filter:"brightness(1.1) contrast(1.1)"}}),(0,r.jsx)("div",{style:{position:"absolute",inset:0,background:"radial-gradient(circle, transparent 60%, rgba(0,0,0,0.6) 100%)",pointerEvents:"none"}})]})})]}),(0,r.jsx)("div",{style:{display:"ceni-view"===e?"block":"none",position:"relative",zIndex:1},children:(0,r.jsxs)("div",{style:{width:"100%",height:"85vh",display:"flex",flexDirection:"row",gap:"16px",padding:"12px 16px",boxSizing:"border-box",alignItems:"stretch",justifyContent:"center"},children:[(0,r.jsx)("div",{style:{flex:"1 1 0",minWidth:0,display:"flex",flexDirection:"column",borderRadius:"14px",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(51,232,255,0.18)"},children:(0,r.jsx)("iframe",{src:i("Presentación Comercial CENI.pdf")+"#toolbar=0&navpanes=0&scrollbar=0",style:{width:"100%",height:"100%",border:"none",display:"block"}})}),(0,r.jsx)("div",{style:{flex:"1 1 0",minWidth:0,display:"flex",flexDirection:"column",borderRadius:"14px",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(51,232,255,0.18)",background:"#000"},children:(0,r.jsx)("video",{src:i("1. Lanzamiento Mar Do Norte - Marcio.mp4"),controls:!0,style:{width:"100%",height:"100%",display:"block",objectFit:"contain",outline:"none",background:"#000"}})})]})}),(0,r.jsx)("div",{style:{display:"proyectos-view"===e?"block":"none",position:"relative",zIndex:1},children:(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"3%",width:"100%",height:"85vh",paddingTop:"40px"},children:[(0,r.jsxs)("div",{className:"re-proyecto-wrapper",style:{display:"flex",flexDirection:"column",alignItems:"center",width:"46%",height:"85%",gap:"40px"},children:[(0,r.jsx)("h2",{className:"re-proyecto-title",children:"MAR DO NORTE STUDIOS"}),(0,r.jsxs)("div",{className:"re-proyecto-card",onClick:()=>k("mar-do-norte-view"),style:{position:"relative"},children:[(0,r.jsx)("img",{src:i("Proyecto Mar do norte.png"),alt:"Proyecto Mar do norte",style:{filter:"url(#re-remove-black)"}}),(0,r.jsx)("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",background:"rgba(220,20,60,0.95)",color:"white",fontFamily:"'Montserrat', sans-serif",fontSize:"clamp(20px, 3vw, 40px)",fontWeight:900,padding:"15px 40px",borderRadius:"8px",border:"3px solid white",boxShadow:"0 10px 40px rgba(220,20,60,0.8)",textTransform:"uppercase",letterSpacing:"4px",pointerEvents:"none",zIndex:20,textAlign:"center"},children:"VENDIDO"})]})]}),(0,r.jsxs)("div",{className:"re-proyecto-wrapper",style:{display:"flex",flexDirection:"column",alignItems:"center",width:"46%",height:"85%",gap:"40px"},children:[(0,r.jsx)("h2",{className:"re-proyecto-title",children:"BERIYTH RESIDENCE"}),(0,r.jsx)("div",{className:"re-proyecto-card",onClick:()=>k("beriyth-view"),children:(0,r.jsx)("img",{src:i("Proyecto Beryhit.png"),alt:"Proyecto Beryhit",style:{filter:"url(#re-remove-black)"}})})]})]})}),(0,r.jsxs)("div",{style:{display:"mar-do-norte-view"===e?"block":"none",position:"relative",zIndex:1},children:[(0,r.jsxs)("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"12px",marginTop:"1%",marginBottom:"2%"},children:[(0,r.jsx)("div",{className:E("mar-presentacion",f),onClick:()=>y("mar-presentacion"),children:(0,r.jsx)("img",{src:i(s(p)),alt:"Presentación Comercial",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("mar-book",f),onClick:()=>y("mar-book"),children:(0,r.jsx)("img",{src:i("Solapa_Book_Web.png"),alt:"Book Web",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("mar-videos",f),onClick:()=>y("mar-videos"),children:(0,r.jsx)("img",{src:i("Solapa_Videos.png"),alt:"Videos",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("mar-avances",f),onClick:()=>y("mar-avances"),children:(0,r.jsx)("img",{src:i("Solapa_Avances_Obra.png"),alt:"Avances de Obra",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("mar-ultimas",f),onClick:()=>y("mar-ultimas"),children:(0,r.jsx)("img",{src:i("Solapa_Ultimas_Unidades.png"),alt:"Últimas Unidades",style:{maxWidth:"180px"}})})]}),(0,r.jsxs)("div",{style:{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"},children:[(0,r.jsx)("div",{className:B("mar-presentacion",f),children:(0,r.jsx)("img",{src:i("Presentacion Comercial MAR.png"),alt:"Presentacion Comercial MAR",style:{width:"100%",height:"auto",maxHeight:"75vh",objectFit:"contain",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}})}),(0,r.jsx)("div",{className:B("mar-book",f),children:(0,r.jsx)("iframe",{src:i("BOOK MAR DO NORTE Studios.pdf")+"#toolbar=0&navpanes=0&scrollbar=0",style:{width:"100%",height:"75vh",border:"none",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}})}),(0,r.jsx)("div",{className:B("mar-videos",f),children:(0,r.jsx)("video",{src:i("Video MAR DO NORTE STUDIOS Español.mp4"),controls:!0,style:{width:"100%",maxHeight:"75vh",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)",outline:"none"}})}),(0,r.jsx)("div",{className:B("mar-avances",f),children:(0,r.jsxs)("div",{style:{display:"flex",gap:"20px",width:"100%",height:"75vh"},children:[(0,r.jsx)("div",{style:{flex:1},children:(0,r.jsx)("iframe",{src:i("1. Avances.pdf")+"#toolbar=0&navpanes=0&scrollbar=0",style:{width:"100%",height:"100%",border:"none",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}})}),(0,r.jsxs)("div",{className:"re-video-scroll",style:{flex:1,display:"flex",flexDirection:"column",gap:"25px",overflowY:"auto",paddingRight:"15px",height:"100%",alignItems:"center"},children:[(0,r.jsx)("video",{src:i("1. Video Avances.mp4"),controls:!0,style:{width:"80%",height:"auto",maxHeight:"300px",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)",objectFit:"contain",outline:"none",flexShrink:0,background:"#000"}}),(0,r.jsx)("video",{src:i("2. Video Avances.mp4"),controls:!0,style:{width:"80%",height:"auto",maxHeight:"300px",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)",objectFit:"contain",outline:"none",flexShrink:0,background:"#000"}})]})]})}),(0,r.jsx)("div",{className:B("mar-ultimas",f),children:(0,r.jsxs)("div",{style:{width:"100%",height:"75vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",background:"rgba(10,30,60,0.4)",backdropFilter:"blur(10px)",borderRadius:"20px",boxShadow:"0 10px 40px rgba(0,0,0,0.5)",border:"1px solid rgba(51,232,255,0.2)",padding:"40px"},children:[(0,r.jsx)("h1",{style:{fontFamily:"'Orbitron', sans-serif",fontSize:"clamp(3rem, 5vw, 5rem)",color:"#ff3366",textShadow:"0 0 30px rgba(255,51,102,0.8)",marginBottom:"20px",textTransform:"uppercase",letterSpacing:"2px"},children:"¡ÉXITO TOTAL!"}),(0,r.jsx)("div",{style:{width:"80px",height:"4px",background:"#33E8FF",marginBottom:"30px",borderRadius:"2px"}}),(0,r.jsx)("h2",{style:{fontFamily:"'Montserrat', sans-serif",fontSize:"clamp(2rem, 3vw, 3rem)",fontWeight:800,color:"#ffffff",letterSpacing:"2px",marginBottom:"10px"},children:"100% VENDIDAS"}),(0,r.jsx)("p",{style:{fontFamily:"'Montserrat', sans-serif",fontSize:"clamp(1.2rem, 2vw, 1.8rem)",color:"#33E8FF",letterSpacing:"4px",fontWeight:500},children:"TODAS LAS UNIDADES"})]})})]})]}),(0,r.jsxs)("div",{style:{display:"beriyth-view"===e?"block":"none",position:"relative",zIndex:1},children:[(0,r.jsxs)("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"12px",marginTop:"1%",marginBottom:"2%"},children:[(0,r.jsx)("div",{className:E("beriyth-presentacion",v),onClick:()=>w("beriyth-presentacion"),children:(0,r.jsx)("img",{src:i(s(p)),alt:"Presentación Comercial",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("beriyth-book",v),onClick:()=>w("beriyth-book"),children:(0,r.jsx)("img",{src:i("Solapa_Book_Web.png"),alt:"Book Web",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("beriyth-videos",v),onClick:()=>w("beriyth-videos"),children:(0,r.jsx)("img",{src:i("Solapa_Videos.png"),alt:"Videos",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("beriyth-avances",v),onClick:()=>w("beriyth-avances"),children:(0,r.jsx)("img",{src:i("Solapa_Avances_Obra.png"),alt:"Avances de Obra",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("beriyth-ultimas",v),onClick:()=>w("beriyth-ultimas"),children:(0,r.jsx)("img",{src:i("Solapa_Ultimas_Unidades.png"),alt:"Últimas Unidades",style:{maxWidth:"180px"}})})]}),(0,r.jsxs)("div",{style:{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"},children:[(0,r.jsx)("div",{className:B("beriyth-presentacion",v),children:(0,r.jsx)("img",{src:i("Presentacion Comercial BERYITH.png"),alt:"Presentacion Comercial BERYITH",style:{width:"100%",height:"auto",maxHeight:"75vh",objectFit:"contain",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}})}),(0,r.jsx)("div",{className:B("beriyth-book",v),children:(0,r.jsx)("iframe",{src:i("book Beriyth Residence.pdf")+"#toolbar=0&navpanes=0&scrollbar=0",style:{width:"100%",height:"75vh",border:"none",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}})}),(0,r.jsx)("div",{className:B("beriyth-videos",v),children:(0,r.jsx)("video",{src:i("Video Promocional BERIYTH Residence.mp4"),controls:!0,style:{width:"100%",maxHeight:"75vh",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)",outline:"none",background:"#000"}})}),(0,r.jsx)("div",{className:B("beriyth-avances",v),children:(0,r.jsx)("div",{style:{width:"100%",height:"75vh",display:"flex",justifyContent:"center",alignItems:"center",background:"rgba(255,255,255,0.4)",borderRadius:"12px"},children:(0,r.jsx)("h2",{style:{fontFamily:"'Montserrat', sans-serif",color:"#0a1e46"},children:"[AVANCES DE OBRA BERIYTH RESIDENCE]"})})}),(0,r.jsx)("div",{className:B("beriyth-ultimas",v),children:(0,r.jsxs)("div",{style:{width:"100%",height:"75vh",display:"flex",gap:"20px",justifyContent:"center",alignItems:"center"},children:[(0,r.jsx)("div",{style:{flex:1,height:"100%",display:"flex",justifyContent:"center",alignItems:"center"},children:(0,r.jsx)("img",{src:i("Ultimas BERY Metrica.png"),alt:"Métricas",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}})}),(0,r.jsx)("div",{style:{flex:1,height:"100%",display:"flex",justifyContent:"center",alignItems:"center"},children:(0,r.jsx)("img",{src:i("Ultimas BERIYTH.png"),alt:"Últimas Unidades",style:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}})})]})})]})]}),(0,r.jsxs)("div",{style:{display:"alanzar-view"===e?"block":"none",position:"relative",zIndex:1},children:[(0,r.jsxs)("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"12px",marginTop:"1%",marginBottom:"2%"},children:[(0,r.jsx)("div",{className:E("alanzar-presentacion",u),onClick:()=>j("alanzar-presentacion"),children:(0,r.jsx)("img",{src:i(s(p)),alt:"Presentación Comercial",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("alanzar-book",u),onClick:()=>j("alanzar-book"),children:(0,r.jsx)("img",{src:i("Solapa_Book_Web.png"),alt:"Book Web",style:{maxWidth:"180px"}})}),(0,r.jsx)("div",{className:E("alanzar-videos",u),onClick:()=>j("alanzar-videos"),children:(0,r.jsx)("img",{src:i("Solapa_Videos.png"),alt:"Videos",style:{maxWidth:"180px"}})})]}),(0,r.jsxs)("div",{style:{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"},children:[(0,r.jsx)("div",{className:B("alanzar-presentacion",u),style:{maxWidth:"100%",width:"98%"},children:(0,r.jsx)("img",{src:i("Presentacion SErene.png"),alt:"Serene Beach Residence",style:{width:"100%",height:"auto",maxHeight:"85vh",objectFit:"contain",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}})}),(0,r.jsx)("div",{className:B("alanzar-book",u),style:{maxWidth:"100%",width:"98%"},children:(0,r.jsx)("iframe",{src:i("Book Serene Beach Residence.pdf")+"#toolbar=0&navpanes=0&scrollbar=0",style:{width:"100%",height:"85vh",border:"none",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)"}})}),(0,r.jsx)("div",{className:B("alanzar-videos",u),style:{maxWidth:"100%",width:"98%"},children:(0,r.jsx)("video",{src:i("Video Promocional SERENA BEACH.mp4"),controls:!0,style:{width:"100%",maxHeight:"85vh",borderRadius:"12px",boxShadow:"0 10px 30px rgba(0,0,0,0.15)",outline:"none",background:"#000"}})})]})]})]})]})]})]})}])}]);