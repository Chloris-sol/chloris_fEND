import { useState, useEffect, useRef, type ReactNode, type MouseEvent, type ButtonHTMLAttributes } from 'react';
import Lenis from 'lenis';
import { 
  Leaf, 
  Cpu, 
  Menu, 
  X, 
  Github, 
  Twitter, 
  Wallet,
  Activity,
  Zap,
  Wind,
  ArrowRight,
  Code
} from 'lucide-react';
import * as THREE from 'three';
import ChromaGrid from './components/ChromaGrid';
import ImageMarquee from './components/ImageMarquee';
import NetworkingCard from './components/NetworkingCard';

// --- TypeScript Interfaces ---

interface NavigationItem {
  name: string;
  href: string;
}

interface FeatureItem {
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  stat: string;
}

interface RoadmapItem {
  phase: string;
  title: string;
  items: string[];
  status: 'completed' | 'current' | 'upcoming';
}

interface TokenAllocation {
  label: string;
  percent: number;
  desc: string;
  color: string;
}


// --- Data Constants ---

const NAVIGATION: NavigationItem[] = [
  { name: 'ECO-DEFI', href: '#features' },
  { name: 'MECHANISM', href: '#architecture' },
  { name: 'ROADMAP', href: '#roadmap' },
  { name: 'TOKENOMICS', href: '#tokenomics' },
];

const FEATURES: FeatureItem[] = [
  {
    title: 'AI Yield Opt.',
    subtitle: 'Python-Driven Strategy',
    description: 'Predictive ML models (PyTorch) analyze DeFi volatility to route assets into optimal Solana vaults (Jito, Kamino).',
    icon: <Cpu className="w-8 h-8 text-emerald-400" />, 
    stat: '18% APY'
  },
  {
    title: 'Carbon RWAs',
    subtitle: 'Automated Offsetting',
    description: 'Fees automatically purchase tokenized carbon credits. Verify your impact on-chain with Real World Assets.',
    icon: <Leaf className="w-8 h-8 text-emerald-400" />,
    stat: 'Net-Zero'
  },
  {
    title: 'Impact Score',
    subtitle: 'Gamified Yields',
    description: 'Hold longer, offset more. Our AI scores your wallet behavior to boost your staking APY by up to 20%.',
    icon: <Activity className="w-8 h-8 text-emerald-400" />,
    stat: 'Boosted'
  },
  {
    title: 'Solana Speed',
    subtitle: 'High-Throughput Green',
    description: 'Built on the most energy-efficient blockchain. 65,000 TPS ensures real-time offsetting without gas wars.',
    icon: <Zap className="w-8 h-8 text-emerald-400" />,
    stat: '<400ms'
  },
];

const ROADMAP: RoadmapItem[] = [
  {
    phase: 'Q4 2025',
    title: 'MVP Launch',
    items: ['Solana Devnet Deployment', 'AI Prototype (Python Agents)', 'Hackathon Demo'],
    status: 'current'
  },
  {
    phase: 'Q1 2026',
    title: 'Mainnet Beta',
    items: ['RWA Partnerships (Carbon)', 'AgentiPy Framework Integ.', 'Audit by OtterSec'],
    status: 'upcoming'
  },
  {
    phase: 'Q2 2026',
    title: 'Full Launch',
    items: ['$ECO Token Airdrop', 'Impact Score Live', 'Cross-chain Expansion'],
    status: 'upcoming'
  },
];

const TOKENOMICS: TokenAllocation[] = [
  { label: 'Liquidity Mining', percent: 40, desc: 'Yield farming rewards', color: 'bg-emerald-500' },
  { label: 'Team', percent: 20, desc: 'Vesting over 4 years', color: 'bg-teal-600' },
  { label: 'Ecosystem', percent: 20, desc: 'Grants & Partnerships', color: 'bg-green-700' },
  { label: 'Offsets', percent: 10, desc: 'Direct Carbon Purchase', color: 'bg-emerald-800' },
  { label: 'Treasury', percent: 10, desc: 'Protocol reserves', color: 'bg-gray-600' },
];

const TEAM = [
  {
    image: "/aakash.png",
    title: "Sarah Johnson",
    subtitle: "Frontend Developer",
    borderColor: "#14F195", // Primary Solana Green
    gradient: "linear-gradient(145deg, #14F195, #000)",
    url: "https://github.com/sarahjohnson"
  },
  {
    image: "https://i.pravatar.cc/300?img=2",
    title: "Mike Chen",
    subtitle: "Backend Engineer",
    borderColor: "#9945FF", // Primary Solana Purple
    gradient: "linear-gradient(145deg, #9945FF, #000)",
    url: "https://linkedin.com/in/mikechen"
  },
  {
    image: "https://i.pravatar.cc/300?img=1",
    title: "Alex Rivers",
    subtitle: "UI/UX Designer",
    borderColor: "#00FFA3", // Solana Spring Green (Turquoise)
    gradient: "linear-gradient(145deg, #00FFA3, #000)",
    url: "github.com"
  },
  {
    image: "https://i.pravatar.cc/300?img=2",
    title: "Jordan Lee",
    subtitle: "Blockchain Architect",
    borderColor: "#14F195", 
    // Full Solana Logo Gradient transition
    gradient: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
    url: "linkedin.com"
  }
];



const Images = [
  '/Jito.png',
  '/kamino.png',
  '/solana.png',
  '/jupiter.png',
]


// --- Visual Components ---

const CarbonCard = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  return (
    <div className={`relative group overflow-hidden bg-[#0A0A0C] border border-white/5 ${className}`}>
        {/* Carbon Fiber Pattern Overlay */}
        <div className="absolute inset-0 opacity-40 pointer-events-none z-0 carbon-fiber-bg"></div>
        
        {/* Hover Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/0 via-emerald-500/10 to-teal-600/0 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
        
        <div className="relative z-10 h-full">
            {children}
        </div>
    </div>
  );
};

const TiltCard = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setRotation({ x: rotateX, y: rotateY });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setRotation({ x: 0, y: 0 }); }}
      className={`relative transition-all duration-300 ease-out transform-gpu ${className}`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.01, 1.01, 1.01)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      }}
    >
      {children}
    </div>
  );
};

const GlitchText = ({ text }: { text: string }) => (
  <span className="relative inline-block group">
    <span className="relative z-10">{text}</span>
    <span className="absolute top-0 left-0 -ml-0.5 translate-x-[2px] text-emerald-500 opacity-0 group-hover:opacity-70 mix-blend-screen animate-pulse">{text}</span>
    <span className="absolute top-0 left-0 -ml-0.5 -translate-x-[2px] text-teal-300 opacity-0 group-hover:opacity-70 mix-blend-screen animate-pulse delay-75">{text}</span>
  </span>
);

const SectionTitle = ({ children, subtitle }: { children: ReactNode, subtitle?: string }) => (
  <div className="mb-16 px-4 text-center">
    <div className="flex items-center justify-center gap-2 mb-4 text-emerald-500 font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase">
      <span className="w-8 h-[1px] bg-emerald-500"></span>
      System Module
      <span className="w-8 h-[1px] bg-emerald-500"></span>
    </div>
    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase font-display">
      {children}
    </h2>
    {subtitle && (
      <p className="text-gray-400 max-w-2xl text-base md:text-lg leading-relaxed font-light mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'carbon';
}

// --- FIXED BUTTON COMPONENT ---
const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  // Common styles
  const common = "font-mono font-bold uppercase tracking-wider transition-all duration-200 overflow-hidden group relative active:scale-95";
  // Sizes
  const sizes = "px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm";

  if (variant === 'carbon') {
    return (
      <button className={`relative rounded p-[1px] ${common} ${className}`} {...props}>
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-400 to-emerald-900 bg-[length:200%_100%] animate-shimmer"></div>
        {/* Inner Content - Clean Black Background */}
        <div className={`relative h-full w-full bg-[#0A0A0C] flex items-center justify-center gap-2 text-white hover:bg-[#111] transition-colors rounded-[1px] ${sizes}`}>
            <div className="absolute inset-0 opacity-20 carbon-fiber-bg pointer-events-none"></div>
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </div>
      </button>
    );
  }

  if (variant === 'outline') {
      return (
        <button className={`${common} ${sizes} border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 ${className}`} {...props}>
             {children}
        </button>
      )
  }
  
  // Default Primary (Solid Green)
  return (
    <button className={`${common} ${sizes} bg-emerald-600 text-white hover:bg-emerald-500 clip-path-slant ${className}`} {...props}>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 skew-x-12"></div>
    </button>
  );
};

// --- Main App Component ---

export default function App() {
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenisRef = useRef<any>(null);

  // --- THREE.js Hero Effect ---
  useEffect(() => {
    if (!heroCanvasRef.current) return;
  
    const container = heroCanvasRef.current;
  
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
  
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.zIndex = "2"; 
    renderer.domElement.style.pointerEvents = "none";
  
    container.appendChild(renderer.domElement);
  
   
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 10);
    camera.position.z = 5;
  
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load("/tree.png", render);
    texture.colorSpace = THREE.SRGBColorSpace;
  
    
    let mesh: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial
    >;
  
    function createMesh() {
      const w = container.clientWidth;
      const h = container.clientHeight;
  
      renderer.setSize(w, h);
  
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
  
      const imgAspect =
        texture.image.width / texture.image.height;
      const containerAspect = w / h;
  
      let planeW = w;
      let planeH = h;
  
      if (containerAspect > imgAspect) {
        planeW = h * imgAspect;
        planeH = h;
      } else {
        planeW = w;
        planeH = w / imgAspect;
      }
  
      const geometry = new THREE.PlaneGeometry(planeW, planeH);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.20,
        depthWrite: false,
      });
  
      if (mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh.geometry = geometry;
        mesh.material = material;
      } else {
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      }
    }
  
    function render() {
      if (!texture.image) return;
      createMesh();
      renderer.render(scene, camera);
    }
  
    // ---------- Resize ----------
    const onResize = () => render();
    window.addEventListener("resize", onResize);
  
    return () => {
      window.removeEventListener("resize", onResize);
  
      if (mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
  
      texture.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  
  // --- Scroll & Mobile Menu Handlers ---
  useEffect(()=>{ const handleScroll=()=>setIsScrolled(window.scrollY>50); window.addEventListener('scroll',handleScroll); return()=>window.removeEventListener('scroll',handleScroll); },[]);
  useEffect(()=>{ document.body.style.overflow = mobileMenuOpen ? 'hidden':'unset'; },[mobileMenuOpen]);
  const handleNavClick=(e:MouseEvent<HTMLAnchorElement>,href:string)=>{ e.preventDefault(); setMobileMenuOpen(false); const target=document.querySelector(href); if(target&&lenisRef.current){ lenisRef.current.scrollTo(target,{offset:-100,duration:1.5}); }};
  const scrollToTop=()=>{ if(lenisRef.current){ lenisRef.current.scrollTo(0,{duration:1.5}); }else{ window.scrollTo({top:0,behavior:'smooth'}); } };

  
  return (
    <div
  className="min-h-screen bg-[#050505] text-white overflow-x-hidden"
  style={{
    backgroundImage: `
      radial-gradient(60% 60% at 15% 20%, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.15) 20%, rgba(16,185,129,0.05) 35%, transparent 60%),
      radial-gradient(50% 50% at 85% 25%, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.1) 25%, rgba(16,185,129,0.03) 45%, transparent 65%),
      radial-gradient(70% 70% at 50% 100%, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.05) 30%, transparent 60%)
    `,
  }}
>
       
      
      {/* --- MOBILE MENU OVERLAY --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      >
          <div 
            className={`w-full max-w-[340px] bg-[#0A0A0C]/90 backdrop-blur-2xl border border-emerald-500/20 rounded-[32px] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] transform transition-all duration-500 flex flex-col relative ${mobileMenuOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            onClick={(e) => e.stopPropagation()} 
          >
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3 opacity-90">
                    <img src="/chloris-logo.png" alt="" className='h-6'/>
                    <img src="/chloris-text.png" alt="" className='h-6'/>
                </div>
                <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
             </div>

             <div className="flex flex-col gap-8 items-center text-center mb-12">
                {NAVIGATION.map((item) => (
                  <a 
                    key={item.name} 
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-base font-bold font-mono tracking-[0.2em] text-gray-300 hover:text-emerald-400 hover:text-shadow-glow transition-all duration-300 uppercase"
                  >
                    {item.name}
                  </a>
                ))}
             </div>

             <div className="flex justify-center gap-6 mt-auto">
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={20}/></a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20}/></a>
             </div>
          </div>
      </div>

      {/* --- FLOATING NAVBAR --- */}
      <nav className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 rounded-2xl md:rounded-full border border-white/10 bg-[#0A0A0C]/80 backdrop-blur-xl px-4 md:px-6 py-3 transition-all duration-300 ${isScrolled ? 'shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] border-emerald-500/20' : 'shadow-none'}`}>
        <div className="flex items-center justify-between relative">
          
          <div className="flex items-center gap-2 cursor-pointer group z-20" onClick={scrollToTop}>
            <img src="/chloris-logo.png" alt="" className='h-8'/>
            <img src="/chloris-text.png" alt="" className='h-4'/>
          </div>
          
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {NAVIGATION.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-xs font-mono font-medium text-gray-400 hover:text-emerald-400 transition-colors relative group uppercase tracking-widest cursor-pointer"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 z-20">
            <div className="hidden md:block">
              {/* LAUNCH APP BUTTON */}
              <Button 
                variant="primary" 
                onClick={() => console.log('Launch App')}
              >
                Launch App <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="md:hidden">
              <button 
                  onClick={() => setMobileMenuOpen(true)} 
                  className="text-gray-300 hover:text-white p-2 focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <section  className="relative pt-40 pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
     
      <div ref={heroCanvasRef} className="absolute inset-0 z-0">
      
        </div>
      
       

        <div className="max-w-7xl mx-auto px-6 text-center relative z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-[#0A0A0C]/80 backdrop-blur-sm mb-8 animate-fade-in-up shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Live on Solana Devnet</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-700 mb-6 leading-[0.9] tracking-tighter font-display drop-shadow-xl">
                YIELD IS <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">NATURE</span>
            </h1>

            <p className="text-gray-400 text-sm md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed tracking-wide">
                The first decentralized <span className="text-white font-medium">Eco-DeFi Aggregator</span>. 
                Generate compounded returns on Solana while automatically offsetting carbon with AI-driven RWA strategies.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <Button className="w-full md:w-auto shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    Launch App <ArrowRight size={16} />
                </Button>
                <Button variant="outline" className="w-full md:w-auto bg-black/50 backdrop-blur-md">
                    Read Whitepaper
                </Button>
            </div>

            {/* <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12 max-w-4xl mx-auto bg-gradient-to-b from-white/5 to-transparent rounded-xl p-8 backdrop-blur-sm">
                {[
                    { label: 'Network', val: 'Solana' },
                    { label: 'Offsets', val: 'Verified RWA' },
                    { label: 'Impact APY', val: 'Up to 20%' },
                    { label: 'Latency', val: '< 400ms' },
                ].map((s, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-bold text-white font-display">{s.val}</span>
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">{s.label}</span>
                    </div>
                ))}
            </div> */}

          <div className="max-w-8xl mx-auto mt-20">
            <ImageMarquee images={Images} speed={25} />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Chloris bridges the gap between high-frequency DeFi and verifiable environmental impact.">
            PROTOCOL FEATURES
          </SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <TiltCard key={idx} className="h-full">
                <CarbonCard className="h-full p-8 rounded-lg flex flex-col transition-all hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {feature.icon}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-500/60 border border-emerald-900/50 px-2 py-1 rounded bg-black">
                      {feature.stat}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-display">
                    <GlitchText text={feature.title} />
                  </h3>
                  <div className="text-xs font-mono text-emerald-600 mb-4 uppercase tracking-widest">{feature.subtitle}</div>
                  <p className="text-gray-400 text-sm leading-relaxed mt-auto border-t border-white/5 pt-4">
                    {feature.description}
                  </p>
                </CarbonCard>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture / Terminal Section - WITH SYNAPTIC LINE */}
      <section id="architecture" className="py-32 px-6 bg-[#080808] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 carbon-fiber-bg opacity-20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            
            <div className="space-y-12">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-display uppercase">Net-Zero <br/><span className="text-emerald-500">Architecture</span></h2>
                    <p className="text-gray-400 text-lg font-light leading-relaxed">
                        Chloris utilizes Python-based AI agents (AgentiPy) to bridge off-chain intelligence with on-chain execution.
                    </p>
                </div>

                {/* THE VERTICAL SYNAPSE LINE */}
                <div className="relative pl-6 md:pl-0">
                    {/* The animated line background */}
                    <div 
                      className="absolute left-[23px] lg:left-6 top-4 bottom-12 w-[2px] -translate-x-1/2 z-0 overflow-visible"
                      style={{
                        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                      }}
                    >
                      {/* Static Base Line */}
                      <div className="absolute inset-0 bg-emerald-900/30 w-[1px] mx-auto"></div>
                      
                      {/* Dotted Flow Animation */}
                      <div 
                        className="absolute inset-0 w-full h-full opacity-60 animate-dotted-flow"
                        style={{
                          backgroundImage: 'radial-gradient(circle, #10B981 40%, transparent 50%)',
                          backgroundSize: '4px 20px', 
                          backgroundRepeat: 'repeat-y',
                          backgroundPositionX: 'center'
                        }}
                      ></div>

                      {/* Beam Drop Animation */}
                      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-emerald-400 to-transparent blur-md opacity-0 animate-beam-drop"></div>
                      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-white to-transparent opacity-0 animate-beam-drop delay-75"></div>
                    </div>

                    {/* The Items */}
                    <div className="space-y-8">
                      {[
                          { title: 'User Deposit', desc: 'SOL, USDC, or LSTs (Sanctum/Jito) deposited into Vault.', icon: <Wallet size={18}/> },
                          { title: 'AI Optimization', desc: 'Off-chain Python models predict yield volatility & select best RWA offsets.', icon: <Code size={18}/> },
                          { title: 'Offset Execution', desc: 'Fees routed via Jupiter to purchase carbon credits (Toucan/SolCarbon).', icon: <Wind size={18}/> },
                      ].map((step, i) => (
                          <div key={i} className="flex gap-8 group relative z-10">
                              <div className="flex-shrink-0 w-12 h-12 bg-[#0A0A0C] border border-gray-800 flex items-center justify-center text-emerald-500 rounded-lg group-hover:border-emerald-500/50 transition-colors shadow-lg relative overflow-hidden">
                                  <div className="absolute inset-0 carbon-fiber-bg opacity-30"></div>
                                  <div className="relative z-10">{step.icon}</div>
                              </div>
                              <div className="pt-1">
                                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                                  <p className="text-sm text-gray-500">{step.desc}</p>
                              </div>
                          </div>
                      ))}
                    </div>
                </div>
            </div>

            {/* Terminal Visualization */}
            {/* <div className="relative group w-fit justify-self-center md:justify-self-end">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-[#050505] border border-gray-800 rounded-lg shadow-2xl overflow-hidden font-mono text-xs">
                    <div className="bg-[#111] px-4 py-2 flex items-center gap-2 border-b border-gray-800">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                        <span className="ml-auto text-gray-600">agent_v1.py</span>
                    </div>
                    <div className="p-6 space-y-2 text-gray-300 flex flex-col relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent opacity-20 pointer-events-none animate-scanline"></div>
                        
                        <div className="opacity-50"># Initializing Chloris Yield Agent...</div>
                        <div><span className="text-emerald-500">➜</span> import <span className="text-yellow-400">torch</span></div>
                        <div><span className="text-emerald-500">➜</span> from <span className="text-blue-400">solana.rpc</span> import AsyncClient</div>
                        <div className="h-4"></div>
                        <div><span className="text-purple-400">[INFO]</span> Connecting to Solana Mainnet-Beta...</div>
                        <div><span className="text-green-400">[SUCCESS]</span> Connected (4ms)</div>
                        <div><span className="text-purple-400">[INFO]</span> Fetching Pyth Oracle Price (Carbon/USD)...</div>
                        <div className="text-emerald-300">{'>>'} $14.20 / tonne</div>
                        <div className="h-4"></div>
                        <div><span className="text-blue-400">[TASK]</span> Optimizing Vault Strategy...</div>
                        <div className="pl-4 border-l border-gray-700 ml-1 text-gray-400">
                            Forecast: Volatility Low<br/>
                            Action: Rebalance to JitoSOL<br/>
                            Offset Target: 4.2 Tonnes CO2
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
                            <span className="animate-pulse text-emerald-500">EXECUTING_TX...</span>
                            <span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded">Confirmed</span>
                        </div>
                    </div>
                </div>
            </div> */}

            <NetworkingCard/>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-24 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6">
              <SectionTitle subtitle="The path to sustainable decentralized finance.">ROADMAP</SectionTitle>
              
              <div className="grid md:grid-cols-3 gap-8">
                  {ROADMAP.map((item, idx) => {
                      const isActive = item.status === 'current';
                      return (
                        <CarbonCard key={idx} className={`p-8 rounded-xl flex flex-col h-full border-t-4 ${isActive ? 'border-t-emerald-500 bg-emerald-900/10' : 'border-t-gray-800'}`}>
                            <div className="mb-6">
                                <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${isActive ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                                    {item.phase}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-6 font-display">{item.title}</h3>
                            <ul className="space-y-4 mt-auto">
                                {item.items.map((pt, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        </CarbonCard>
                      )
                  })}
              </div>
          </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className="py-24 bg-[#080808] border-t border-white/5 relative">
        <div className="absolute inset-0 carbon-fiber-bg opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <SectionTitle subtitle="ECO Token Distribution & Utility">TOKENOMICS</SectionTitle>
            
            <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full border-[20px] border-[#1a1a1a]"></div>
                    <div className="absolute inset-0 rounded-full opacity-90 shadow-[0_0_50px_rgba(16,185,129,0.2)]" 
                         style={{ background: 'conic-gradient(#10B981 0% 40%, #0D9488 40% 60%, #15803d 60% 80%, #064E3B 80% 90%, #333 90% 100%)' }}>
                    </div>
                    <div className="absolute inset-6 rounded-full bg-[#050505] flex items-center justify-center flex-col z-10 border border-white/5">
                        <div className="absolute inset-0 carbon-fiber-bg opacity-30 rounded-full"></div>
                        <span className="text-3xl font-bold text-white font-display relative z-10">1B</span>
                        <span className="text-xs text-gray-500 font-mono uppercase relative z-10">Total Supply</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                    {TOKENOMICS.map((token, idx) => (
                        <div key={idx} className="bg-[#0A0A0C] border border-gray-800 p-4 rounded-lg flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
                            <div className="pl-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-white">{token.percent}%</span>
                                    <span className="text-sm font-bold text-gray-300 font-mono uppercase">{token.label}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{token.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24 bg-[#050505] border-t border-white/5 relative">
        <div className="absolute inset-0 carbon-fiber-bg opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <SectionTitle subtitle="Founding Team of Chloris Protocol">HALL OF FAME</SectionTitle>

          <div className='flex flex-wrap justify-center gap-10 items-center'>
            <ChromaGrid 
              items={TEAM}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 md:py-16 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                 <img src="/chloris-logo.png" alt="" className='h-6'/>
                  <img src="/chloris-text.png" alt="" className='h-3'/>
              </div>

              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
               Generating compounded returns on Solana while automatically offsetting carbon with AI-driven RWA strategies.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 md:mb-6 font-mono text-sm uppercase">
                Built With
              </h4>
              <ul className="space-y-3 md:space-y-4 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <img
                    alt="Avalanche Logo"
                    className="w-5 h-5"
                    src="/solana-logo.png"
                  />
                  Solana
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 md:mb-6 font-mono text-sm uppercase">
                Community
              </h4>
              <ul className="space-y-3 md:space-y-4 text-sm text-gray-500 mb-4">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">
                  <a
                    href="mailto:chloris@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    chloris@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-gray-600 font-mono uppercase tracking-wider text-center md:text-left">
            <div>© 2025 CHLORIS PROTOCOL. DECENTRALIZED ECO-FINANCE.</div>
            <div className="flex gap-6 md:gap-8">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>


      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');
        
        .font-sans { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-display { font-family: 'Syne', sans-serif; }
        
        .carbon-fiber-bg {
          background-color: #111;
          background-image:
            linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000),
            linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000);
          background-size: 8px 8px;
          background-position: 0 0, 4px 4px;
        }

        .hero-carbon-bg {
          background-color: #080808;
          background-image: 
            linear-gradient(45deg, #121212 25%, transparent 25%, transparent 75%, #121212 75%, #121212), 
            linear-gradient(45deg, #121212 25%, transparent 25%, transparent 75%, #121212 75%, #121212);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          opacity: 0.5;
        }

        .clip-path-slant { clip-path: polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%); }
        
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .animate-shimmer { animation: shimmer 3s linear infinite; }

        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scanline { animation: scanline 4s linear infinite; }

        /* NEW ANIMATIONS FOR DOTTED FLOW */
        @keyframes dotted-flow {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }
        .animate-dotted-flow { animation: dotted-flow 1s linear infinite; }

        @keyframes beam-drop {
          0% { top: -20%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 120%; opacity: 0; }
        }
        .animate-beam-drop { animation: beam-drop 3s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer, .animate-scanline, .animate-dotted-flow, .animate-beam-drop { animation: none; }
        }
      `}} />
    </div>
  );
}