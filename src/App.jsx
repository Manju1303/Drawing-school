import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import logo from './logo.png';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Instagram, MapPin, Phone, Mail, Clock, LayoutGrid, Palette, Users, Info, ExternalLink, Menu, X, ArrowRight, Star, Sparkles } from 'lucide-react';

// Asset Helper
const getAsset = (name) => {
  const base = import.meta.env.BASE_URL || '/';
  // If the base URL ends with / and the name starts with /, remove one
  return `${base.replace(/\/$/, '')}/${name.replace(/^\//, '')}`;
};

const Magnetic = ({ children, strength = 0.2 }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const moveX = (clientX - centerX) * strength;
    const moveY = (clientY - centerY) * strength;
    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// Animation Helpers
const GlitterCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState('default');
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });
      
      const newParticle = {
        id: Math.random(),
        x: clientX,
        y: clientY,
        scale: Math.random() * 1.2 + 0.3,
        opacity: 1
      };

      setTrail(prev => [...prev.slice(-15), newParticle]);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .interactive');
      if (target) {
        setIsHovering(true);
        if (target.classList.contains('btn-primary')) setHoverType('primary');
        else if (target.tagName === 'A') setHoverType('link');
        else setHoverType('default');
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block">
      {/* Main Cursor Dot */}
      <motion.div 
        initial={{ 
          backgroundColor: 'rgba(216, 27, 96, 0.4)', 
          borderColor: 'rgb(255, 255, 255)',
          scale: 1
        }}
        animate={{ 
          x: position.x - (isHovering ? 20 : 6), 
          y: position.y - (isHovering ? 20 : 6),
          width: isHovering ? 40 : 12,
          height: isHovering ? 40 : 12,
          backgroundColor: isHovering ? 'rgba(216, 27, 96, 0.2)' : 'rgba(216, 27, 96, 0.4)',
          borderColor: isHovering ? 'rgb(236, 64, 122)' : 'rgb(255, 255, 255)',
          borderWidth: 2,
          scale: isHovering ? 1.5 : 1
        }} 
        transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.6 }} 
        className="border-2 rounded-full absolute backdrop-blur-[2px] flex items-center justify-center overflow-hidden" 
      >
        {isHovering && hoverType === 'link' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[6px] font-black uppercase text-[#d81b60]">View</motion.div>
        )}
      </motion.div>
      
      {/* Glitters Trail */}
      {trail.map((p) => (
        <motion.div 
          key={p.id} 
          initial={{ x: p.x, y: p.y, scale: p.scale, opacity: 1 }} 
          animate={{ opacity: 0, scale: 0, y: p.y + (Math.random() * 40 - 20) }} 
          transition={{ duration: 1.2, ease: "easeOut" }} 
          className="absolute w-2 h-2 bg-[#ec407a] rounded-full blur-[0.5px] shadow-[0_0_15px_#ec407a]" 
        />
      ))}
    </div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-[3px] bg-[#d81b60] origin-[0%] z-[1000] shadow-[0_0_10px_#d81b60]"
      style={{ scaleX }}
    />
  );
};

const SectionReveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
);

const FloatingParticles = () => (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        {[...Array(30)].map((_, i) => (
            <motion.div key={i} initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }} animate={{ y: [null, "-20%", "20%"], x: [null, "10%", "-10%"], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: Math.random() * 10 + 20, repeat: Infinity, ease: "linear" }} className="absolute w-1.5 h-1.5 bg-[#d81b60]/20 rounded-full blur-sm shadow-xl" />
        ))}
    </div>
);

// Components
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Commission', path: '/commission' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className={`fixed w-full top-0 z-[100] transition-all duration-700 ${(isScrolled || (location.pathname !== '/' && location.pathname !== '')) ? 'py-4 bg-white/80 backdrop-blur-2xl border-b border-[#ec407a]/10 shadow-xl' : 'py-8 bg-transparent'}`}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ scale: 1.05 }} className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 transition-all">
            <img src={logo} alt="RSA Logo" className="w-full h-full object-contain" />
          </motion.div>
          <div className="flex flex-col">
            <span className={`text-2xl md:text-4xl font-black font-serif italic tracking-normal transition-colors duration-500 leading-none ${isScrolled || (location.pathname !== '/' && location.pathname !== '') ? 'text-[#d81b60]' : 'text-white'}`}>RSA</span>
            <span className={`text-[7px] md:text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-500 ${isScrolled || (location.pathname !== '/' && location.pathname !== '') ? 'text-[#ad1457]' : 'text-white/90'}`}>RIVYA SCHOOL OF ARTS</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 xl:gap-11">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const useDark = isScrolled || (location.pathname !== '/' && location.pathname !== '');
            
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`relative text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 ${
                  isActive 
                    ? (useDark ? 'text-[#d81b60]' : 'text-white') 
                    : (useDark ? 'text-slate-800 hover:text-[#d81b60]' : 'text-white/70 hover:text-white')
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div layoutId="nav-underline" className={`absolute -bottom-2 left-0 right-0 h-0.5 rounded-full ${useDark ? 'bg-[#d81b60]' : 'bg-white'}`} />
                )}
              </Link>
            );
          })}
          <Magnetic strength={0.2}>
            <Link to="/join" className="btn-primary" style={{ padding: '0.8rem 2.8rem', fontSize: '11px', fontWeight: '900', letterSpacing: '0.1em' }}>Join Now</Link>
          </Magnetic>
        </div>

        {/* Mobile Toggle */}
        <button className={`lg:hidden p-3 rounded-2xl backdrop-blur-md transition-all ${isScrolled ? 'bg-[#d81b60]/10 text-[#d81b60]' : 'bg-white/10 text-white shadow-lg'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[120] flex flex-col justify-between items-center py-20 lg:hidden"
          >
            <div className="flex flex-col items-center gap-2">
               <div className="w-20 h-20 rounded-2xl bg-[#fff5f8] p-2 flex items-center justify-center mb-4">
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
               </div>
               <span className="text-3xl font-black text-[#d81b60] font-serif italic">RSA</span>
               <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-10">Rivya School of Arts</span>
            </div>

            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all border border-slate-100"
            >
              <X size={28} />
            </button>
            
            <div className="flex flex-col items-center gap-8 w-full px-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`text-2xl md:text-3xl font-black tracking-tight uppercase ${location.pathname === link.path ? 'text-[#d81b60]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
            >
              <Link to="/join" onClick={() => setIsMenuOpen(false)} className="btn-primary mt-8 px-10 py-4 text-xs font-black tracking-widest">Enroll Now</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="footer bg-white pt-24 pb-12 border-t border-[#ec407a]/10">
      <div className="container grid md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-3xl font-bold font-serif italic mb-8 block">
            <span className="gradient-text">RSA</span>
          </Link>
          <p className="text-[#2d3436]/70 mb-8 text-sm leading-relaxed">Founded by professional artists, RSA is dedicated to teaching fine arts and creating unique commission pieces for art lovers around the world.</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/_oeuvre_world_?igsh=MXBpMXludzM2dm16dg==" target="_blank" className="p-2 glass-card hover:bg-[#6a1b9a] transition-all"><Instagram size={18} /></a>
            <a href="https://jsdl.in/RSL-EUI1775137878" target="_blank" className="p-2 glass-card hover:bg-[#00bcd4] transition-all"><ExternalLink size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-4 opacity-60 text-sm">
            <li><Link to="/gallery">Art Gallery</Link></li>
            <li><Link to="/courses">Browse Courses</Link></li>
            <li><Link to="/commission">Order Painting</Link></li>
            <li><Link to="/about">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black mb-8 text-slate-800">Contact Us</h4>
          <ul className="flex flex-col gap-6 text-slate-500 font-medium text-sm">
            <li className="flex items-center gap-4 group transition-colors hover:text-[#d81b60]"><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#d81b60]/10"><Phone size={16} /></div> +91 95669 51629</li>
            <li className="flex items-center gap-4 group transition-colors hover:text-[#d81b60]"><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#d81b60]/10"><Mail size={16} /></div> rivyaartsschool17@gmail.com</li>
            <li className="flex items-center gap-4 group transition-colors hover:text-[#d81b60]"><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#d81b60]/10"><MapPin size={16} /></div> Perumanallur, Tiruppur, TN</li>
            <li className="flex items-center gap-4 group transition-colors hover:text-[#d81b60]"><div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#d81b60]/10"><Clock size={16} /></div> Mon - Sat: 6:00 PM - 8:00 PM</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Socials</h4>
          <ul className="flex flex-col gap-4 opacity-60 text-sm">
            <li><a href="https://www.instagram.com/_oeuvre_world_?igsh=MXBpMXludzM2dm16dg==" target="_blank">Instagram Portfolio</a></li>
            <li><a href="https://jsdl.in/RSL-EUI1775137878" target="_blank">Justdial Business</a></li>
            <li><a href="#" target="_blank">Google Profile</a></li>
          </ul>
        </div>
      </div>
      <div className="container pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center opacity-40 text-xs gap-4">
        <p>&copy; 2024 Rivya School of Arts. All Rights Reserved.</p>
        <div className="flex gap-8">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

// Pages
const Home = () => {
  const [showPoster, setShowPoster] = useState(false);

  useEffect(() => {
    // Show the summer poster only once per session
    const hasSeenPoster = sessionStorage.getItem('hasSeenSummerPoster');
    
    if (!hasSeenPoster) {
      const timer = setTimeout(() => {
        setShowPoster(true);
        sessionStorage.setItem('hasSeenSummerPoster', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="relative min-h-screen py-32 flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Enhanced Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#1a0b12] to-[#2d0a18] z-0" />
          
          {/* Animated Background Mesh/Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 45, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-[#d81b60]/10 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, -45, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#ad1457]/10 rounded-full blur-[100px]"
          />
        </div>
        <div className="container relative z-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.1em] mb-8"
            >
              <Sparkles size={12} className="text-[#f8bbd0]" /> MSME Certified Art Institute
            </motion.div>
            
            <div className="overflow-hidden mb-4 md:mb-6">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.5 }}
                className="leading-[1.1] text-white text-4xl sm:text-6xl md:text-8xl"
              >
                Elevate Your <br />
                <span className="italic font-normal text-[#f8bbd0]">Artistic</span><br />
                <span className="gradient-text drop-shadow-2xl">Vision.</span>
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed font-light max-w-xl"
            >
              From curious beginners to skilled artists, 
              <span className="text-white font-medium"> RSA</span> provides the canvas for your imagination to flourish with world-class mentorship.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 items-center"
            >
              <Magnetic strength={0.3}>
                <Link to="/courses" className="btn-primary group w-full sm:w-auto justify-center px-6 py-2.5 md:px-10 md:py-4 text-[10px] md:text-xs flex items-center">
                  Begin Your Journey <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link to="/join" className="btn-primary w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-2.5 md:px-10 md:py-4 text-[10px] md:text-xs font-black tracking-widest uppercase">
                   Enroll Now
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link to="/commission" className="btn-primary w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-2.5 md:px-10 md:py-4 text-[10px] md:text-xs font-black tracking-widest uppercase !bg-slate-900 border-2 border-white/20">
                   Order Now
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button 
                  onClick={() => setShowPoster(true)}
                  className="btn-secondary w-full sm:w-auto justify-center !border-white !text-white hover:!bg-white hover:!text-slate-950 flex items-center gap-2 px-6 py-2.5 md:px-10 md:py-4 text-[10px] md:text-xs font-black tracking-widest uppercase"
                >
                  <Sparkles size={14} /> Summer Offer
                </button>
              </Magnetic>
            </motion.div>
          </motion.div>
        </div>

        {/* Poster Pop-up Modal */}
        <AnimatePresence>
          {showPoster && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 pointer-events-auto"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPoster(false)}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
              />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative z-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide rounded-[2.5rem] md:rounded-[3.5rem] border border-white/20 shadow-2xl bg-slate-900"
              >
                <div className="absolute top-6 right-6 z-20">
                  <button 
                    onClick={() => setShowPoster(false)}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all shadow-xl"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="px-6 pb-12 md:px-12">
                   <img 
                    src={getAsset('poster_summer.jpg')} 
                    alt="Summer Offer Poster" 
                    className="w-full h-auto rounded-[2rem] shadow-2xl border-4 border-white/10" 
                  />
                  <div className="mt-8 text-center">
                    <h3 className="text-3xl font-serif text-[#f8bbd0] mb-2 tracking-tight">Special Summer Classes</h3>
                    <p className="text-white/60 text-sm">Join RSA this summer to ignite your artistic potential!</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity"
        >
          <span className="text-xs uppercase tracking-[0.5em] font-black text-white">Explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent rounded-full overflow-hidden relative">
            <motion.div 
              animate={{ y: [0, 64] }} 
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute top-0 left-0 w-full h-1/2 bg-[#d81b60]" 
            />
          </div>
        </motion.div>
      </section>

      <section className="bg-white border-y border-[#ec407a]/10 py-24">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {[
            { tag: '500+', label: 'Students Taught' },
            { tag: 'Kids-Adults', label: 'All Age Groups' },
            { tag: 'Online', label: '& Offline Classes' },
            { tag: 'MSME', label: 'Approved Institute' }
          ].map((stat, i) => (
            <div key={i} className="glass-card !p-8 flex flex-col justify-center items-center min-h-[160px]">
              <h3 className="text-3xl md:text-4xl font-serif mb-2 font-bold gradient-text">{stat.tag}</h3>
              <p className="text-[10px] md:text-sm uppercase tracking-widest opacity-60 font-black">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section - Transformed to Category Grid */}
      <section id="services" className="bg-[#fff5f8] py-24 relative overflow-hidden">
        <div className="container relative z-10">
          <SectionReveal>
            <div className="text-center mb-16">
              <h4 className="text-sm uppercase tracking-[0.1em] font-bold text-[#d81b60] mb-4 flex items-center justify-center gap-2">
                <Sparkles size={14} /> Comprehensive Programs <Sparkles size={14} />
              </h4>
              <h2 className="text-5xl text-[#ad1457] font-serif">What We Offer</h2>
            </div>
          </SectionReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: 'Basic & Fine Arts',
                icon: <Palette size={20} />,
                courses: ['Still Life Sketching', 'Anatomy & Figures', 'Perspective Drawing', 'Pencil Shading', 'Landscape Art'],
                color: '#d81b60'
              },
              {
                title: 'Painting Mastery',
                icon: <Palette size={20} />,
                courses: ['Oil Painting Basics', 'Acrylic Techniques', 'Water Color Portraits', 'Texture & Impasto', 'Color Theory'],
                color: '#ad1457'
              },
              {
                title: 'Traditional Arts',
                icon: <Sparkles size={20} />,
                courses: ['Mandala Patterns', 'Glass Painting', 'Pot Decoration', 'Mehandi Design', 'Folk Art Styles'],
                color: '#6a1b9a'
              },
              {
                title: 'Professional Art',
                icon: <Users size={20} />,
                courses: ['Hyper-Realistic Portraits', 'Mural Designing', 'Interior Art Decor', 'Canvas Composition', 'Teaching Diploma'],
                color: '#2d3436'
              },
              {
                title: 'Languages & Skills',
                icon: <Users size={20} />,
                courses: ['Spoken English Fluency', 'Confidence Building', 'Handwriting Repair', 'Modern Calligraphy', 'Public Speaking'],
                color: '#1a237e'
              },
              {
                title: 'Vocational Art',
                icon: <LayoutGrid size={20} />,
                courses: ['Fashion Illustration', 'Jewelry Designing', 'Clay Modeling', 'Fabric Painting', 'Digital Art Basics'],
                color: '#e65100'
              }
            ].map((domain, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-[#ec407a]/10 flex flex-col h-full group"
                >
                  <div className="flex flex-col items-center gap-3 px-8 py-7 text-white group-hover:scale-[1.02] transition-transform min-h-[140px] text-center justify-center" style={{ backgroundColor: domain.color }}>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mb-1">
                      {domain.icon}
                    </div>
                    <h5 className="text-base font-black tracking-widest uppercase !font-sans leading-tight">{domain.title}</h5>
                  </div>
                  <div className="bg-[#fffde7]/50 px-8 py-3 border-b border-yellow-100 flex items-center justify-center gap-2">
                    <Star size={10} className="text-yellow-500" fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ad1457]">Skill-Based learning</span>
                    <Star size={10} className="text-yellow-500" fill="currentColor" />
                  </div>
                  <div className="p-8 flex-grow">
                    <ul className="space-y-4 flex flex-col items-center">
                      {domain.courses.map((course, j) => (
                        <li key={j} className="flex items-center justify-center gap-3 text-sm font-medium text-slate-600 group/item text-center">
                          <div className="w-5 h-5 rounded-full bg-[#d81b60]/10 flex items-center justify-center text-[#d81b60] group-hover/item:bg-[#d81b60] group-hover/item:text-white transition-colors shrink-0">
                            <Star size={10} fill="currentColor" />
                          </div>
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-8 py-6 border-t border-slate-50 mt-auto bg-slate-50/50 flex justify-center">
                    <Link to="/courses" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#d81b60] hover:gap-4 transition-all">
                      View All Courses <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artwork / Portfolio */}
      <section id="portfolio" className="bg-white py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-16 text-center md:text-left">
            <div>
              <h4 className="text-sm uppercase tracking-[0.1em] font-bold text-[#d81b60] mb-4">Our Portfolio</h4>
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#ad1457] font-serif">Already Done Works</h2>
            </div>
            <Link to="/gallery" className="text-[#d81b60] hover:underline flex items-center gap-2 font-bold text-sm tracking-widest uppercase mb-2 transition-all">View Full Gallery <ArrowRight size={16} /></Link>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <SectionReveal delay={0.2}>
              <motion.div whileHover={{ y: -20 }} className="group relative overflow-hidden rounded-[4rem] aspect-[4/5] shadow-2xl">
                 <img src={getAsset('portrait_women.jpg')} alt="Pencil Portrait" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-12 flex flex-col justify-end transform translate-y-10 group-hover:translate-y-0">
                    <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest mb-4">Commissions</span>
                    <h3 className="text-3xl text-white mb-2 leading-snug">Pencil <br />Portraits</h3>
                    <p className="text-sm text-white/60 mb-8 max-w-[200px]">Hyper-realistic custom commissions created with soul.</p>
                    <Link to="/gallery" className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 group/link">View Work <div className="w-8 h-[1px] bg-white group-hover/link:w-12 transition-all"></div></Link>
                 </div>
              </motion.div>
            </SectionReveal>

            <SectionReveal delay={0.4}>
              <motion.div whileHover={{ y: -20 }} className="group relative overflow-hidden rounded-[4rem] aspect-[4/5] shadow-2xl lg:translate-y-20">
                 <img src={getAsset('painting_justice.jpg')} alt="Acrylic Painting" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#ad1457] via-[#ad1457]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-12 flex flex-col justify-end transform translate-y-10 group-hover:translate-y-0">
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Oil & Acrylic</span>
                    <h3 className="text-3xl text-white mb-2 leading-snug">Artistic <br />Visions</h3>
                    <p className="text-sm text-white/80 mb-8 max-w-[200px]">Professional paintings that breathe life into spaces.</p>
                    <Link to="/gallery" className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 group/link">Explore <div className="w-8 h-[1px] bg-white group-hover/link:w-12 transition-all"></div></Link>
                 </div>
              </motion.div>
            </SectionReveal>

            <SectionReveal delay={0.6}>
              <motion.div whileHover={{ y: -20 }} className="group relative overflow-hidden rounded-[4rem] aspect-[4/5] shadow-2xl">
                 <img src={getAsset('portrait_couple.jpg')} alt="Couple Art" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-12 flex flex-col justify-end transform translate-y-10 group-hover:translate-y-0">
                    <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest mb-4">Charcoal Art</span>
                    <h3 className="text-3xl text-white mb-2 leading-snug">Couple <br />Masterpieces</h3>
                    <p className="text-sm text-white/60 mb-8 max-w-[200px]">Detailed textures capturing emotions forever.</p>
                    <Link to="/gallery" className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 group/link">Gallery <div className="w-8 h-[1px] bg-white group-hover/link:w-12 transition-all"></div></Link>
                 </div>
              </motion.div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#fff0f6]">
        <div className="container text-center max-w-4xl">
          <h4 className="text-sm uppercase tracking-[0.3em] font-bold text-[#d81b60] mb-4">Student Life</h4>
          <h2 className="text-6xl mb-16 text-[#ad1457]">Nurturing Creativity</h2>
          
          <div className="grid lg:grid-cols-2 gap-20 items-center mt-24 max-w-6xl mx-auto text-left">
              <SectionReveal>
                <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_80px_-20px_rgba(216,27,96,0.3)] border-8 border-white bg-slate-100 aspect-[4/3] flex items-center justify-center">
                   <motion.img 
                      whileHover={{ scale: 1.05 }}
                      src={getAsset('group_students.jpg')} 
                      alt="Students" 
                      className="w-full h-full object-cover" 
                   />
                </div>
              </SectionReveal>
             <SectionReveal delay={0.2}>
               <div className="glass-card !p-12 md:!p-20 relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#d81b60]/10 rounded-full flex items-center justify-center text-[#d81b60] text-6xl font-serif italic">"</div>
                  <p className="text-xl md:text-3xl italic leading-relaxed mb-12 text-slate-700 font-light font-serif relative z-10">"Every canvas is a journey, and every stroke tells a story. At RSA, we don't just teach art; we nurture the creator within you."</p>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-1 bg-gradient-to-r from-[#d81b60] to-transparent"></div>
                    <div>
                      <h5 className="text-2xl font-black text-slate-900 tracking-tight">Thrinethraa D S</h5>
                      <p className="text-xs font-black text-[#d81b60] uppercase tracking-[0.3em] mt-1">Lead Artist & Founder</p>
                    </div>
                  </div>
               </div>
             </SectionReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

const About = () => (
  <div className="bg-white min-h-screen" style={{ paddingTop: '180px' }}>
    <section className="container py-20 lg:py-32">
      <SectionReveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
             <div className="relative group">
                <div className="absolute -inset-4 bg-[#d81b60]/10 rounded-[5rem] blur-2xl group-hover:bg-[#d81b60]/20 transition-all"></div>
                <img src={getAsset('founder.jpg')} alt="Founder" className="relative rounded-[4.5rem] shadow-2xl border-[16px] border-white z-10" />
             </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h4 className="text-sm uppercase tracking-[0.1em] font-bold text-[#d81b60] mb-4">Our Heritage</h4>
            <h2 className="text-3xl md:text-6xl mb-6 md:mb-8 md:leading-snug text-[#ad1457] font-serif">Mastery in <br /><span className="italic font-normal">Every Stroke</span></h2>
            <p className="text-base md:text-lg text-[#2d3436]/80 mb-6 leading-relaxed">RIVYA SCHOOL OF ARTS is an MSME approved institute dedicated to providing professional drawing and painting training. Founded by our lead artist at Oeuvre World, we specialize in teaching students how to transform their imagination into masterpieces.</p>
            <p className="text-base md:text-lg text-[#2d3436]/80 mb-10 leading-relaxed">Located in Perumanallur, Tiruppur, we offer both offline and online classes for all age groups, from kids to adults. Our curriculum covers everything from basic sketching to specialized courses like Mandala and Pot Painting.</p>
            <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-[#ec407a]/10 pt-10">
              <div>
                 <h3 className="text-xl md:text-2xl font-bold mb-1 text-[#ad1457] font-serif">MSME Certified</h3>
                  <p className="text-[9px] md:text-[11px] text-[#d81b60] font-bold uppercase tracking-widest opacity-60">Regd. Govt Institute</p>
              </div>
              <div>
                 <h3 className="text-xl md:text-2xl font-bold mb-1 text-[#ad1457] font-serif">6 PM - 8 PM</h3>
                  <p className="text-[9px] md:text-[11px] text-[#d81b60] font-bold uppercase tracking-widest opacity-60">Class Timings</p>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionReveal>
    </section>
  </div>
);

const Courses = () => {
  const coursesList = [
    { name: 'Basic Drawing & Sketching', duration: '1–3 Months', level: 'Beginner', icon: <Palette size={24} />, desc: 'Learn fundamentals of drawing and sketching from scratch.' },
    { name: 'Mandala Art', duration: '1 Month', level: 'Intermediate', icon: <LayoutGrid size={24} />, desc: 'Master the intricate patterns and geometric symmetry of Mandala.' },
    { name: 'Glass Painting', duration: '1 Month', level: 'All Ages', icon: <Info size={24} />, desc: 'Vibrant techniques for painting on glass surfaces.' },
    { name: 'Pot Painting', duration: '1 Month', level: 'Creative', icon: <Palette size={24} />, desc: 'Traditional and modern pot decoration techniques.' },
    { name: 'Handwriting Improvement', duration: '1–2 Months', level: 'Kids/Adults', icon: <Users size={24} />, desc: 'Improve your handwriting and calligraphy skills.' },
    { name: 'Mehandi Design', duration: '1 Month', level: 'Specialized', icon: <Palette size={24} />, desc: 'Learn traditional and modern Henna/Mehandi patterns.' },
    { name: 'Advanced Painting (Oil/Acrylic)', duration: '3+ Months', level: 'Advanced', icon: <Palette size={24} />, desc: 'Professional techniques in oil and acrylic mediums.' },
    { name: 'Portrait Art (Pencil/Charcoal)', duration: '2–4 Months', level: 'Semi-Pro', icon: <Users size={24} />, desc: 'Master hyper-realistic portraiture with pencil and charcoal.' },
    { name: 'Mural Design', duration: '2 Months', level: 'Expert', icon: <Palette size={24} />, desc: 'Learn to create large-scale artworks on walls and interiors.' },
    { name: 'Certificate Course (Basic)', duration: '3 Months', level: 'Beginner', icon: <Star size={24} />, desc: 'Covers Glass Painting, Pot Painting, Basic Sketching, Water Color & Fabric Painting.' },
    { name: 'Certificate Course (Intermediate)', duration: '6 Months', level: 'Intermediate', icon: <Star size={24} />, desc: 'Includes all Basic courses plus Illustration, Pen Drawing, and more advanced techniques.' },
    { name: 'Certificate Course (Advance)', duration: '1 Year', level: 'Advanced', icon: <Star size={24} />, desc: 'Complete mastery including Portraits, Oil Painting, and Mural Painting.' },
    { name: 'Spoken English Class', duration: '2–3 Months', level: 'All Ages', icon: <Users size={24} />, desc: 'Gain confidence and fluency with our comprehensive spoken English training.' }
  ];

  return (
    <div className="bg-[#fff5f8]" style={{ paddingTop: '180px' }}>
      <section className="container pb-24">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h4 className="text-sm uppercase tracking-[0.3em] font-bold text-[#d81b60] mb-4">Enroll Today</h4>
          <h2 className="text-6xl mb-6 text-[#ad1457]">Our Courses</h2>
          <p className="text-lg text-[#2d3436]/60">Offline & Online modes available. Certificates provided upon successful completion.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesList.map((course, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-10 rounded-[3rem] border border-[#ec407a]/10 hover:shadow-2xl hover:shadow-[#ec407a]/10 transition-all flex flex-col items-start text-left group">
              <div className="w-16 h-16 rounded-3xl bg-[#fff0f6] text-[#d81b60] flex items-center justify-center mb-8 border border-[#ec407a]/10 group-hover:bg-[#d81b60] group-hover:text-white transition-all">
                {course.icon}
              </div>
              <h3 className="text-2xl mb-2 text-[#ad1457]">{course.name}</h3>
              <div className="flex gap-4 mb-6 text-[11px] font-bold uppercase tracking-widest text-[#2d3436]/40">
                <span>{course.duration}</span>
                <span className="w-1 h-1 bg-[#ec407a]/20 rounded-full mt-1.5"></span>
                <span>{course.level}</span>
              </div>
              <p className="text-[#2d3436]/70 mb-10 flex-grow leading-relaxed">{course.desc}</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link to="/join" className="btn-primary flex-1 text-center py-4">Enroll Now</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Gallery = () => {
    const galleryImages = [
        { src: 'portrait_women.jpg', cat: 'Pencil' },
        { src: 'painting_justice.jpg', cat: 'Artistic' },
        { src: 'portrait_couple.jpg', cat: 'Portrait' },
        { src: 'poster_summer.jpg', cat: 'Events' },
        { src: 'poster_regular.jpg', cat: 'Courses' },
        { src: 'commission_delivery.jpg', cat: 'Commissions' },
        { src: 'group_students.jpg', cat: 'Studio' },
        { src: 'founder.jpg', cat: 'Artist' }
    ];
    return (
        <div className="bg-white" style={{ paddingTop: '180px' }}>
            <section className="container pb-24">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h4 className="text-sm uppercase tracking-[0.3em] font-bold text-[#d81b60] mb-4">Visual Story</h4>
                    <h2 className="text-6xl mb-4 text-[#ad1457]">Our Gallery</h2>
                    <p className="text-lg text-[#2d3436]/60">Explore our collection of commissioned works and student achievements across all age groups.</p>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
                    {galleryImages.map((img, i) => (
                        <SectionReveal key={i} delay={i * 0.05}>
                            <motion.div 
                                whileHover={{ y: -10 }} 
                                className="break-inside-avoid relative overflow-hidden rounded-[2.5rem] group cursor-pointer border border-slate-100 shadow-xl"
                            >
                                <img 
                                    src={getAsset(img.src)} 
                                    alt={`Art ${i}`} 
                                    className="w-full h-auto object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center backdrop-blur-[2px]">
                                    <span className="text-[11px] uppercase tracking-[0.1em] font-black text-white mb-4 bg-[#d81b60] px-4 py-1 rounded-full">{img.cat}</span>
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform scale-50 group-hover:scale-100 transition-transform">
                                        <ExternalLink size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        </SectionReveal>
                    ))}
                </div>
            </section>
        </div>
    );
}

const Commission = () => {
  const [refImage, setRefImage] = useState(null);
  const [refPreview, setRefPreview] = useState(null);
  const handleRefImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRefImage(file);
      setRefPreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="bg-[#fffdfd]" style={{ paddingTop: '180px' }}>
        <section className="container pb-24">
            <div className="grid lg:grid-cols-2 gap-24">
                <div>
                  <SectionReveal>
                    <h4 className="text-sm uppercase tracking-[0.5em] font-black text-[#d81b60] mb-6">Custom Orders</h4>
                    <h2 className="text-5xl md:text-7xl mb-10 text-slate-900 leading-tight">Bring Your <span className="italic font-normal serif">Vision</span> To Life.</h2>
                    <p className="text-2xl text-slate-500 mb-12 leading-relaxed font-light">Looking for a personalized gift or a stunning wall painting? We accept commissions for high-quality custom artworks tailored to your exact desires.</p>
                    
                    <div className="relative group mb-16">
                        <div className="absolute -inset-6 bg-[#d81b60]/5 rounded-[4rem] blur-3xl"></div>
                        <img src={getAsset('commission_delivery.jpg')} className="relative rounded-[4rem] shadow-2xl border-8 border-white z-10 w-full object-cover" alt="Commission Delivery" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8 mb-12">
                        <div className="glass-card !p-8 !rounded-[3rem]">
                            <div className="h-16 w-16 bg-[#d81b60]/10 rounded-2xl flex items-center justify-center text-3xl mb-6">🎨</div>
                            <h4 className="font-black text-xl text-slate-900 mb-2">Portrait Art</h4>
                            <p className="text-sm text-slate-500">Realistic oil or pencil portraits that capture more than just a likeness.</p>
                        </div>
                        <div className="glass-card !p-8 !rounded-[3rem]">
                            <div className="h-16 w-16 bg-[#d81b60]/10 rounded-2xl flex items-center justify-center text-3xl mb-6">🏠</div>
                            <h4 className="font-black text-xl text-slate-900 mb-2">Wall Murals</h4>
                            <p className="text-sm text-slate-500">Transform your living spaces with elite, custom-painted wall murals.</p>
                        </div>
                    </div>
                  </SectionReveal>
                </div>

                <div className="relative">
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 sm:p-10 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[4rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] mb-10 lg:mb-0 lg:sticky lg:top-32"
                  >
                    <h3 className="text-2xl md:text-4xl mb-8 md:mb-10 text-[#ad1457] font-serif">Custom Order Request</h3>
                    <form className="flex flex-col gap-8" onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target;
                        emailjs.sendForm(
                          'service_rivyaarts',
                          'template_commission',
                          form,
                          'Gg0xDxs9IK_aQQegv'
                        ).then(() => {
                          alert('Commission request sent! We will contact you soon.');
                          form.reset();
                        }).catch(() => {
                          alert('Failed to send. Please call us directly at +91 95669 51629.');
                        });
                      }}>
                        <div className="flex flex-col gap-4">
                            <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em] ml-4">Artwork Category</label>
                            <select name="artwork_type" className="bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-6 py-4 rounded-2xl text-slate-900 text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                                <option>Fine Art Portrait (Oil/Acrylic)</option>
                                <option>Sketch Portrait (Pencil/Charcoal)</option>
                                <option>Wall Mural Project</option>
                                <option>Modern Abstract Canvas</option>
                                <option>Wedding Pair Painting</option>
                                <option>Custom Gift Collection</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                                <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Full Name *</label>
                                <input name="from_name" required type="text" className="bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-6 py-4 rounded-2xl text-slate-900 text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all shadow-sm" placeholder="Enter full name" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Contact Phone *</label>
                                <input name="phone" required type="text" className="bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-6 py-4 rounded-2xl text-slate-900 text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all shadow-sm" placeholder="+91 ..." />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Vision & Requirements</label>
                            <textarea name="message" className="bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-6 py-4 rounded-2xl text-slate-900 text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all h-40 resize-none shadow-sm" placeholder="Describe size, medium and timeline..."></textarea>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em] ml-4">Reference Image (Optional)</label>
                            <label className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all px-6 py-6 ${
                                refPreview ? 'border-[#d81b60] bg-[#fff5f8]' : 'border-[#ec407a]/20 bg-[#fff5f8]/50 hover:border-[#d81b60] hover:bg-[#fff5f8]'
                            } shadow-sm`}>
                              <input type="file" accept="image/*" className="hidden" onChange={handleRefImage} />
                              {refPreview ? (
                                <div className="relative w-full">
                                  <img src={refPreview} alt="Reference preview" className="w-full max-h-64 object-contain rounded-2xl" />
                                  <p className="text-xs text-[#d81b60] font-bold mt-4 text-center">{refImage?.name}</p>
                                </div>
                              ) : (
                                <>
                                  <div className="w-16 h-16 bg-[#d81b60]/10 rounded-2xl flex items-center justify-center text-[#d81b60] mb-2">
                                    <Sparkles size={28} />
                                  </div>
                                  <div className="text-center px-4">
                                    <p className="font-bold text-slate-700 text-sm">Upload reference drawing</p>
                                    <p className="text-xs text-slate-400 mt-2">JPG, PNG or WEBP (Max 10MB)</p>
                                  </div>
                                </>
                              )}
                            </label>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                          <button type="submit" className="btn-primary flex-1 py-5 text-sm font-black tracking-[0.2em] shadow-2xl">Send Request →</button>
                        </div>
                    </form>
                  </motion.div>
                </div>
            </div>
        </section>
    </div>
  );
};

const Contact = () => (
    <div className="bg-[#fff5f8] min-h-screen" style={{ paddingTop: '180px' }}>
        <section className="container pb-24">
            <div className="text-center mb-20 max-w-2xl mx-auto">
                <h4 className="text-sm uppercase tracking-[0.1em] font-bold text-[#d81b60] mb-4">Get In Touch</h4>
                <h2 className="text-6xl mb-6 text-[#ad1457] font-serif">Let's Talk Art</h2>
                <p className="text-lg text-[#2d3436]/60">Have questions about courses or commissions? We're just a message away.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div whileHover={{ y: -5 }} className="bg-white text-center p-8 rounded-[3rem] border border-[#ec407a]/10 hover:shadow-2xl transition-all shadow-sm flex flex-col">
                    <div className="w-16 h-16 rounded-full bg-[#fff5f8] mx-auto flex items-center justify-center mb-5 text-[#d81b60] shadow-sm"><Instagram size={32} /></div>
                    <h4 className="text-lg mb-2 font-serif text-[#ad1457]">Instagram</h4>
                    <p className="text-[#2d3436]/60 mb-6 text-sm leading-relaxed flex-grow">Follow us for daily artworks, student progress and school updates.</p>
                    <a href="https://www.instagram.com/_oeuvre_world_?igsh=MXBpMXludzM2dm16dg==" target="_blank" className="btn-secondary inline-block px-5 py-2.5 text-xs border-[#ad1457] text-[#ad1457] hover:bg-[#ad1457] hover:text-white transition-all uppercase tracking-widest font-bold">Portfolio <ExternalLink size={12} className="inline ml-1" /></a>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-white text-center p-8 rounded-[3rem] border border-[#ec407a]/10 hover:shadow-2xl transition-all shadow-sm flex flex-col">
                    <div className="w-16 h-16 rounded-full bg-[#fff5f8] mx-auto flex items-center justify-center mb-5 text-[#d81b60] shadow-sm"><MapPin size={32} /></div>
                    <h4 className="text-lg mb-2 font-serif text-[#ad1457]">Our Studio</h4>
                    <p className="text-[#2d3436]/60 mb-6 text-sm leading-relaxed flex-grow">KRK COMPLEX, Bus Stop, Perumanallur, Tiruppur, Tamil Nadu 641666.</p>
                    <a href="https://maps.app.goo.gl/wS22D68S899A6" target="_blank" className="btn-secondary inline-block px-5 py-2.5 text-xs border-[#ad1457] text-[#ad1457] hover:bg-[#ad1457] hover:text-white transition-all uppercase tracking-widest font-bold">Find Us <ExternalLink size={12} className="inline ml-1" /></a>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-white text-center p-8 rounded-[3rem] border border-[#ec407a]/10 hover:shadow-2xl transition-all shadow-sm flex flex-col">
                    <div className="w-16 h-16 rounded-full bg-[#fff5f8] mx-auto flex items-center justify-center mb-5 text-[#d81b60] shadow-sm"><Phone size={32} /></div>
                    <h4 className="text-lg mb-2 font-serif text-[#ad1457]">Call Us</h4>
                    <p className="text-[#2d3436]/60 mb-6 text-sm leading-relaxed flex-grow">Direct call for detailed enrollments and inquiries.</p>
                    <a href="tel:+919566951629" className="btn-secondary inline-block px-5 py-2.5 text-xs border-[#ad1457] text-[#ad1457] hover:bg-[#ad1457] hover:text-white transition-all uppercase tracking-widest font-bold">+91 95669 51629</a>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-white text-center p-8 rounded-[3rem] border border-[#ec407a]/10 hover:shadow-2xl transition-all shadow-sm flex flex-col">
                    <div className="w-16 h-16 rounded-full bg-[#fff5f8] mx-auto flex items-center justify-center mb-5 text-[#d81b60] shadow-sm"><Mail size={32} /></div>
                    <h4 className="text-lg mb-2 font-serif text-[#ad1457]">Email Us</h4>
                    <p className="text-[#2d3436]/60 mb-6 text-sm leading-relaxed flex-grow">Send us your queries and we'll respond within 24 hours.</p>
                    <a href="mailto:rivyaartsschool17@gmail.com" className="btn-secondary inline-block px-5 py-2.5 text-xs border-[#ad1457] text-[#ad1457] hover:bg-[#ad1457] hover:text-white transition-all uppercase tracking-widest font-bold">Email <ExternalLink size={12} className="inline ml-1" /></a>
                </motion.div>
            </div>

            <div className="mt-20 h-[500px] rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative">
                <iframe 
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.738488458704!2d77.35672057504823!3d11.206974388969199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9059712892205%3A0x4c23f6fb17d1d67a!2sRIVYA%20SCHOOL%20OF%20ARTS!5e0!3m2!1sen!2sin!4v1712398000000!5m2!1sen!2sin" 
                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000 border-none"
                    allowFullScreen="" 
                    loading="lazy">
                </iframe>
            </div>
        </section>
    </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ReactLenis root>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <ScrollProgress />
        <GlitterCursor />
        <FloatingParticles />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/join" element={<JoinNow />} />
        </Routes>
        <Footer />
      </Router>
    </ReactLenis>
  );
}

// ─── Join Now / Enrollment Page ──────────────────────────────────────────────
const JoinNow = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    duration: '',
    mode: '',
    ageGroup: ''
  });
  const [totalFees, setTotalFees] = useState(0);

  // Actual fees extracted from images
  const feesMap = {
    'Non-Certificate Courses': { 'Monthly': 1000 },
    'Certificate Course (Basic)': { '3 Months': 5000 },
    'Certificate Course (Intermediate)': { '6 Months': 10000 },
    'Certificate Course (Advance)': { '1 Year': 15000 },
    'Spoken English Class': { '1 Month': 1000, '2 Months': 1800, '3 Months': 2500 },
    'Mandala Art': { '1 Month': 1200 },
    'Pot Painting Only': { '1 Month': 1000 },
    'Handwriting Improvement': { '1 Month': 800, '2 Months': 1500 },
    'Mehandi Design': { '1 Month': 1500 }
  };

  const handleUpdate = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    
    if (updated.course && updated.duration && feesMap[updated.course]) {
      const fee = feesMap[updated.course][updated.duration] || 0;
      setTotalFees(fee);
    } else {
      setTotalFees(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.course || !formData.duration) {
      alert('Please select a course and duration.');
      return;
    }
    emailjs.send(
      'service_rivyaarts',
      'template_enrollment',
      {
        from_name: formData.name || 'Student',
        phone: formData.phone,
        email: formData.email,
        course: formData.course,
        duration: formData.duration,
        total_fees: `₹${totalFees}`,
        to_email: 'rivyaartsschool17@gmail.com',
      },
      'Gg0xDxs9IK_aQQegv'
    ).then(() => {
      setSubmitted(true);
    }).catch(() => {
      alert('Submission failed. Please call us at +91 95669 51629.');
    });
  };


  return (
    <div className="bg-gradient-to-br from-[#fff5f8] via-white to-[#fff0f6] min-h-screen" style={{ paddingTop: '160px' }}>
      <section className="container pb-16 md:pb-24">
        <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto px-4">
          <h4 className="text-[10px] md:text-sm uppercase tracking-[0.1em] font-bold text-[#d81b60] mb-3 md:mb-4 flex items-center justify-center gap-2">
            <Sparkles size={14}/> Enrollment
          </h4>
          <h2 className="text-3xl md:text-7xl mb-4 md:mb-6 text-[#ad1457] font-serif leading-tight">Join <span className="italic font-normal">RSA</span> Today</h2>
          <p className="text-sm md:text-lg text-slate-500 leading-relaxed">Take the first step on your artistic journey. Fill in your details below and our team will get back to you within 24 hours.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[4rem] p-16 text-center shadow-2xl border border-[#ec407a]/10"
            >
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-3xl font-serif text-[#ad1457] mb-4">You're In!</h3>
              <p className="text-slate-500 text-lg mb-8">Thank you for enrolling. Our team will contact you soon. Get ready to paint your story!</p>
              <Link to="/" className="btn-primary px-10 py-4 text-xs font-black tracking-widest inline-block">Back to Home</Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-5 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[4rem] border border-[#ec407a]/10 shadow-2xl"
            >
              <form className="flex flex-col gap-6 md:gap-10" onSubmit={handleSubmit}>
                {/* Row 1: Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Full Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => handleUpdate('name', e.target.value)}
                      className="bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-6 py-4 rounded-2xl text-slate-900 text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all shadow-sm" 
                      placeholder="Your full name" 
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Phone Number *</label>
                    <input 
                      required 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => handleUpdate('phone', e.target.value)}
                      className="bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-6 py-4 rounded-2xl text-slate-900 text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all shadow-sm" 
                      placeholder="+91 XXXXX XXXXX" 
                    />
                  </div>
                </div>

                {/* Row 2: Age Group + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Age Group *</label>
                    <select required className="bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-6 py-4 rounded-2xl text-slate-900 text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                      <option value="">Select age group...</option>
                      <option>Kids (5–10 yrs)</option>
                      <option>Teens (11–17 yrs)</option>
                      <option>Adults (18+ yrs)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleUpdate('email', e.target.value)}
                      className="bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-6 py-4 rounded-2xl text-slate-900 text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all shadow-sm" 
                      placeholder="Enter your email (optional)" 
                    />
                  </div>
                </div>

                {/* Row 3: Course + Duration side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Select Course *</label>
                    <select 
                      required 
                      className="bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-6 py-4 rounded-2xl text-slate-900 text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                      value={formData.course}
                      onChange={(e) => handleUpdate('course', e.target.value)}
                    >
                      <option value="">Select a course...</option>
                      {Object.keys(feesMap).map(course => <option key={course} value={course}>{course}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Select Duration *</label>
                    <div className="flex flex-wrap gap-3">
                      {formData.course && feesMap[formData.course] ? (
                        Object.keys(feesMap[formData.course]).map(dur => (
                          <label key={dur} className="flex-1 min-w-[100px]">
                            <input 
                              type="radio" 
                              name="duration" 
                              value={dur} 
                              className="hidden peer" 
                              onChange={() => handleUpdate('duration', dur)} 
                              checked={formData.duration === dur}
                            />
                            <div className="px-5 py-4 rounded-2xl border-2 border-[#ec407a]/10 bg-[#fff5f8]/30 peer-checked:border-[#d81b60] peer-checked:bg-[#fff5f8] text-center font-bold text-slate-600 peer-checked:text-[#d81b60] cursor-pointer transition-all text-sm">
                              {dur}
                            </div>
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic ml-2 py-4">Please select a course first</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mode */}
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Preferred Mode *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Online', 'Offline (Studio)'].map(mode => (
                      <label key={mode} className="flex items-center gap-4 bg-[#fff5f8]/50 px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#fff5f8] transition-all border-2 border-[#ec407a]/10 has-[:checked]:border-[#d81b60] has-[:checked]:bg-[#fff5f8] shadow-sm">
                        <input type="radio" name="mode" value={mode} className="accent-[#d81b60] w-5 h-5" />
                        <span className="font-bold text-slate-700 text-sm">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Inline Fee Summary */}
                {totalFees > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-gradient-to-r from-[#fff5f8] to-[#fff0f6] p-6 md:p-8 rounded-3xl border border-[#d81b60]/15"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#d81b60]/10 flex items-center justify-center">
                          <Palette size={22} className="text-[#d81b60]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{formData.course}</p>
                          <p className="text-xs text-slate-400 font-medium">{formData.duration} • One-time Payment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl md:text-4xl font-black text-[#d81b60]">₹{totalFees}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-[#d81b60]/10">
                      <span className="flex items-center gap-2 text-[11px] font-bold text-slate-500"><Star size={12} className="text-[#d81b60]" /> Professional Mentorship</span>
                      <span className="flex items-center gap-2 text-[11px] font-bold text-slate-500"><Star size={12} className="text-[#d81b60]" /> MSME Certificate</span>
                      <span className="flex items-center gap-2 text-[11px] font-bold text-slate-500"><Star size={12} className="text-[#d81b60]" /> Art Kits Included</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-4">* Fees may vary based on age group. Final pricing confirmed during intro call.</p>
                  </motion.div>
                )}

                <button type="submit" className="btn-primary w-full py-5 text-sm font-black tracking-[0.2em] shadow-2xl">Submit Enrollment →</button>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};


const ParallaxHero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 800], [0, 400]);
    const scale = useTransform(scrollY, [0, 800], [1.2, 1.4]);
    
    return (
        <motion.img 
            style={{ y, scale }}
            src={getAsset('poster_main.jpg')} 
            alt="Rivya School of Arts" 
            className="w-full h-full object-cover opacity-60" 
        />
    );
};
