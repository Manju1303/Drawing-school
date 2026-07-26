import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
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

const SectionReveal = ({ children, delay = 0, className = "" }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
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
    <nav className={`fixed w-full top-0 z-[1000] transition-all duration-700 ${(isScrolled || (location.pathname !== '/' && location.pathname !== '')) ? 'py-4 bg-white shadow-xl border-b border-[#ec407a]/10' : 'py-8 bg-transparent'}`}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div whileHover={{ scale: 1.05 }} className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 transition-all">
            <img src={logo} alt="RSA Logo" className="w-full h-full object-contain" />
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span className={`text-sm md:text-base font-black tracking-[0.15em] uppercase transition-colors duration-500 ${isScrolled || (location.pathname !== '/' && location.pathname !== '') ? 'text-[#d81b60]' : 'text-white/90'}`}>Rivya School of Arts</span>
            <span className={`text-[8px] md:text-[9px] font-medium tracking-[0.1em] uppercase transition-colors duration-500 ${isScrolled || (location.pathname !== '/' && location.pathname !== '') ? 'text-[#ad1457]/70' : 'text-white/50'}`}>Fine Arts & Painting Institute</span>
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
                className={`relative text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 ${isActive
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
              <span className="text-xl font-black text-[#d81b60] tracking-wide uppercase">Rivya School of Arts</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-10">Fine Arts & Painting Institute</span>
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
          <Link to="/" className="text-xl font-black tracking-wide uppercase mb-8 block text-[#d81b60]">
            Rivya School of Arts
          </Link>
          <p className="text-[#2d3436]/70 mb-8 text-sm leading-relaxed">Founded by professional artists, RSA is dedicated to teaching fine arts and creating unique commission pieces for art lovers around the world.</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/_oeuvre_world_?igsh=MXBpMXludzM2dm16dg==" target="_blank" className="p-2 glass-card hover:bg-[#6a1b9a] transition-all"><Instagram size={18} /></a>
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
            <li className="flex items-start gap-4 group transition-colors hover:text-[#d81b60]">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#d81b60]/10 mt-0.5">
                <Clock size={16} />
              </div>
              <div className="text-xs leading-relaxed">
                <div className="font-bold text-slate-800">Mon - Sat:</div>
                <div>6:00 PM - 9:00 PM</div>
                <div className="font-bold text-slate-800 mt-2">Sunday:</div>
                <div>10:00 AM - 1:00 PM</div>
                <div>5:00 PM - 7:00 PM</div>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Socials</h4>
          <ul className="flex flex-col gap-4 opacity-60 text-sm">
            <li><a href="https://www.instagram.com/_oeuvre_world_?igsh=MXBpMXludzM2dm16dg==" target="_blank">Instagram Portfolio</a></li>
            <li><a href="https://maps.app.goo.gl/wS22D68S899A6" target="_blank" rel="noopener noreferrer">Google Maps</a></li>
          </ul>
        </div>
      </div>
      <div className="container pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center opacity-40 text-xs gap-4">
        <p>&copy; {new Date().getFullYear()} Rivya School of Arts. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a href="https://wa.me/919566951629?text=Hi%2C%20I%20have%20a%20question%20about%20Rivya%20School%20of%20Arts" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <a href="mailto:rivyaartsschool17@gmail.com?subject=Terms%20Inquiry" target="_blank" rel="noopener noreferrer">Terms of Service</a>
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
      <Helmet>
        <title>Rivya School of Arts – Best Drawing &amp; Painting Classes in Tiruppur | MSME Registered</title>
        <meta name="description" content="Rivya School of Arts is Tiruppur's MSME Government-registered art institute. Certified courses: pencil art, oil painting, portrait, mandala & more. Offline & online classes for kids and adults in Perumanallur, Tiruppur, Tamil Nadu." />
        <meta name="keywords" content="drawing school tirupur, drawing classes tirupur, painting classes tirupur, art school tirupur, best drawing institute tirupur, Rivya School of Arts, MSME art school tirupur, pencil art classes tirupur, portrait classes tirupur, online drawing classes tirupur, art classes for kids tirupur, drawing school perumanallur, painting school perumanallur, art institute tamil nadu, MSME certified drawing school, Udyam registered art school, fine art school tirupur" />
        <link rel="canonical" href="https://rivyaschoolofarts.com/" />
        <meta property="og:title" content="Rivya School of Arts – Drawing &amp; Painting in Tiruppur" />
        <meta property="og:description" content="MSME Govt-registered fine art institute in Tiruppur. Drawing, painting, portrait & mandala courses for all ages." />
        <meta property="og:url" content="https://rivyaschoolofarts.com/" />
      </Helmet>
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
              className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 items-start sm:items-center"
            >
              <Magnetic strength={0.3}>
                <Link to="/join" className="btn-primary group w-full sm:w-auto justify-center flex items-center gap-2 px-8 py-3 md:px-12 md:py-4 text-[11px] md:text-xs font-black tracking-widest uppercase">
                  Enroll Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link to="/commission" className="btn-primary group w-full sm:w-auto justify-center flex items-center gap-2 px-8 py-3 md:px-12 md:py-4 text-[11px] md:text-xs font-black tracking-widest uppercase !bg-gradient-to-r !from-[#f59e0b] !to-[#d81b60] !shadow-[0_10px_25px_rgba(245,158,11,0.4)] hover:!shadow-[0_20px_35px_rgba(245,158,11,0.6)]">
                  Order Now 🎨
                </Link>
              </Magnetic>
              <Magnetic strength={0.3}>
                <Link to="/courses" className="btn-secondary group w-full sm:w-auto justify-center flex items-center gap-2 px-8 py-3 md:px-12 md:py-4 text-[11px] md:text-xs font-black tracking-widest uppercase !border-white !text-white hover:!bg-white hover:!text-slate-950">
                  Explore Courses
                </Link>
              </Magnetic>
              <button
                onClick={() => setShowPoster(true)}
                className="text-white/60 hover:text-white flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors"
              >
                <Sparkles size={14} className="text-[#f8bbd0]" /> View Summer Offer
              </button>
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
                  <div className="mt-8 text-center bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <h3 className="text-3xl font-serif text-[#f8bbd0] mb-3 tracking-tight">Special Summer Classes</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white/80 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#f8bbd0]" />
                        <span>Mon-Sat: <span className="text-white font-bold">6:00 PM - 9:00 PM</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#f8bbd0]" />
                        <span>Sunday: <span className="text-white font-bold">10:00 AM - 1 PM | 5:00 PM - 7 PM</span></span>
                      </div>
                    </div>
                    <p className="text-white/40 text-xs mt-4 italic">Join RSA this summer to ignite your artistic potential!</p>
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
            { tag: '500+', label: 'Students Trained' },
            { tag: '5+', label: 'Years of Excellence' },
            { tag: 'Online & Offline', label: 'Flexible Learning Modes' },
            { tag: 'MSME Govt.', label: 'Registered Institute' }
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
                icon: <Palette size={20} />,
                courses: ['Fashion Illustration', 'Jewelry Designing', 'Clay Modeling', 'Fabric Painting', 'Digital Art Basics'],
                color: '#e65100'
              }
            ].map((domain, i) => (
              <SectionReveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#ec407a]/15 flex flex-col h-full group transition-all duration-500 hover:shadow-[#ec407a]/20"
                >
                  <div className="flex flex-col items-center gap-3 px-10 py-10 text-white group-hover:scale-[1.02] transition-transform min-h-[160px] text-center justify-center relative overflow-hidden" style={{ backgroundColor: domain.color }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 mb-2 border border-white/30 relative z-10">
                      {domain.icon}
                    </div>
                    <h5 className="text-xl font-black tracking-widest uppercase !font-sans leading-tight relative z-10">{domain.title}</h5>
                  </div>
                  <div className="bg-[#fff9fc] px-8 py-4 border-b border-[#ec407a]/10 flex items-center justify-center gap-2">
                    <Sparkles size={12} className="text-[#d81b60]" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#d81b60]">Professional Training</span>
                    <Sparkles size={12} className="text-[#d81b60]" />
                  </div>
                  <div className="p-10 flex-grow bg-white">
                    <ul className="space-y-5 flex flex-col items-start px-4">
                      {domain.courses.map((course, j) => (
                        <li key={j} className="flex items-center gap-4 text-[15px] font-semibold text-slate-700 group/item transition-colors hover:text-[#d81b60]">
                           <div className="w-6 h-6 rounded-lg bg-[#d81b60]/10 flex items-center justify-center text-[#d81b60] group-hover/item:bg-[#d81b60] group-hover/item:text-white transition-all shrink-0 shadow-sm">
                            <Star size={12} fill="currentColor" />
                          </div>
                          <span className="leading-tight">{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-10 py-8 border-t border-slate-50 mt-auto bg-slate-50/80 flex justify-center">
                    <Link to="/courses" className="btn-primary !px-8 !py-3 !text-[10px] !rounded-2xl transition-all shadow-lg hover:shadow-[#d81b60]/30">
                      View Details <ArrowRight size={14} className="ml-2" />
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
              <motion.div whileHover={{ y: -20 }} className="group relative overflow-hidden rounded-3xl md:rounded-[4rem] aspect-[4/5] shadow-2xl">
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
              <motion.div whileHover={{ y: -20 }} className="group relative overflow-hidden rounded-3xl md:rounded-[4rem] aspect-[4/5] shadow-2xl lg:translate-y-20">
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
              <motion.div whileHover={{ y: -20 }} className="group relative overflow-hidden rounded-3xl md:rounded-[4rem] aspect-[4/5] shadow-2xl">
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

      {/* Order Custom Artwork Showcase Banner */}
      <section className="bg-gradient-to-br from-slate-950 via-[#1a0b12] to-[#2d0a18] py-20 text-white relative overflow-hidden">
        <div className="container relative z-10">
          <SectionReveal>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d81b60]/20 border border-[#d81b60]/40 text-[#f8bbd0] text-[10px] font-black uppercase tracking-widest mb-4">
                  <Sparkles size={12} /> Custom Artwork Commissions
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                  Want a Handcrafted Portrait or Custom Painting?
                </h3>
                <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed">
                  Order custom pencil sketches, hyper-realistic oil portraits, wall murals, or wedding pair paintings crafted by lead artist Thrinethraa D S. Direct delivery & framing available!
                </p>
              </div>
              <div className="shrink-0">
                <Magnetic strength={0.3}>
                  <Link to="/commission" className="btn-primary group px-10 py-5 text-xs font-black tracking-widest uppercase flex items-center gap-3 !bg-gradient-to-r !from-[#f59e0b] !via-[#d81b60] !to-[#ad1457] shadow-[0_20px_40px_rgba(245,158,11,0.4)] hover:scale-105 transition-all">
                    ORDER ARTWORK NOW 🎨 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </SectionReveal>
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

      {/* Frequently Asked Questions */}
      <FaqSection />
    </div>
  );
};

const About = () => (
  <div className="bg-white min-h-screen pt-32 lg:pt-48">
    <Helmet>
      <title>Rivya School of Arts – About Us | MSME Registered Art Institute, Tiruppur</title>
      <meta name="description" content="Rivya School of Arts – officially MSME Government-registered art institute in Perumanallur, Tiruppur. Founded by artist Thrinethraa D S. 500+ students trained. Certified courses for all ages." />
      <meta name="keywords" content="about Rivya School of Arts, Thrinethraa D S artist tirupur, Oeuvre World tirupur, MSME registered art institute tirupur, Udyam registration art school tirupur, government certified art school tirupur, fine arts institute perumanallur, best art teacher tirupur, art school history tirupur, who founded Rivya School of Arts" />
      <link rel="canonical" href="https://rivyaschoolofarts.com/about" />
    </Helmet>
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
            <h2 className="text-3xl md:text-6xl mb-6 md:mb-8 md:leading-snug text-[#ad1457] font-serif">Drawing Classes in <br /><span className="italic font-normal">Tiruppur — RSA</span></h2>
            <p className="text-base md:text-lg text-[#2d3436]/80 mb-6 leading-relaxed">RIVYA SCHOOL OF ARTS is an MSME approved institute dedicated to providing professional drawing and painting training. Founded by our lead artist at Oeuvre World, we specialize in teaching students how to transform their imagination into masterpieces.</p>
            <p className="text-base md:text-lg text-[#2d3436]/80 mb-10 leading-relaxed">Located in Perumanallur, Tiruppur, we offer both offline and online classes for all age groups, from kids to adults. Our curriculum covers everything from basic sketching to specialized courses like Mandala and Pot Painting.</p>
            <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-[#ec407a]/10 pt-10">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-1 text-[#ad1457] font-serif">MSME Certified</h3>
                <p className="text-[9px] md:text-[11px] text-[#d81b60] font-bold uppercase tracking-widest opacity-60">Regd. Govt Institute</p>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-1 text-[#ad1457] font-serif">6 PM - 9 PM</h3>
                <p className="text-[9px] md:text-[11px] text-[#d81b60] font-bold uppercase tracking-widest opacity-60">Mon - Sat</p>
                <p className="text-[9px] md:text-[11px] text-[#ad1457]/70 font-bold mt-1 uppercase tracking-widest">Sunday Open</p>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-3xl bg-[#fff5f8] border-2 border-[#d81b60]/20 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={18} className="text-[#d81b60]" />
                <h4 className="font-bold text-slate-900 text-base">Government MSME Registered Institute</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rivya School of Arts (located in Perumanallur, Tiruppur, Tamil Nadu) is an officially registered fine arts training provider under the Ministry of Micro, Small and Medium Enterprises (MSME / Udyam Registration, Govt. of India). All qualifying students receive valid government-approved certificates upon course completion.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/courses" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase group">
                Explore Courses <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/join" className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase border-[#d81b60] text-[#d81b60] hover:bg-[#d81b60] hover:text-white">
                Enroll Now
              </Link>
            </div>
          </motion.div>
        </div>
      </SectionReveal>
    </section>
  </div>
);

const Courses = () => {
  const coursesList = [
    { name: 'Basic Drawing & Sketching', duration: '1–3 Months', level: 'Beginner', icon: <Palette size={24} />, desc: 'Learn fundamentals of drawing and sketching from scratch.', price: '₹1,000/mo', isCert: false },
    { name: 'Mandala Art', duration: '1 Month', level: 'Intermediate', icon: <Sparkles size={24} />, desc: 'Master the intricate patterns and geometric symmetry of Mandala.', price: '₹1,200/mo', isCert: false },
    { name: 'Glass Painting', duration: '1 Month', level: 'All Ages', icon: <Info size={24} />, desc: 'Vibrant techniques for painting on glass surfaces.', price: '₹1,000/mo', isCert: false },
    { name: 'Pot Painting', duration: '1 Month', level: 'Creative', icon: <Palette size={24} />, desc: 'Traditional and modern pot decoration techniques.', price: '₹1,000/mo', isCert: false },
    { name: 'Handwriting Improvement', duration: '1–2 Months', level: 'Kids/Adults', icon: <Users size={24} />, desc: 'Improve your handwriting and calligraphy skills.', price: 'From ₹800', isCert: false },
    { name: 'Mehandi Design', duration: '1 Month', level: 'Specialized', icon: <Palette size={24} />, desc: 'Learn traditional and modern Henna/Mehandi patterns.', price: '₹1,500/mo', isCert: false },
    { name: 'Advanced Painting (Oil/Acrylic)', duration: '3+ Months', level: 'Advanced', icon: <Palette size={24} />, desc: 'Professional techniques in oil and acrylic mediums.', price: '₹1,000/mo', isCert: false },
    { name: 'Portrait Art (Pencil/Charcoal)', duration: '2–4 Months', level: 'Semi-Pro', icon: <Users size={24} />, desc: 'Master hyper-realistic portraiture with pencil and charcoal.', price: '₹1,000/mo', isCert: false },
    { name: 'Mural Design', duration: '2 Months', level: 'Expert', icon: <Palette size={24} />, desc: 'Learn to create large-scale artworks on walls and interiors.', price: '₹1,000/mo', isCert: false },
    { name: 'Certificate Course (Basic)', duration: '3 Months', level: 'Govt. Certified', icon: <Star size={24} />, desc: 'Covers Glass Painting, Pot Painting, Basic Sketching, Water Color & Fabric Painting.', price: '₹5,000 total', isCert: true },
    { name: 'Certificate Course (Intermediate)', duration: '6 Months', level: 'Govt. Certified', icon: <Star size={24} />, desc: 'Includes all Basic courses plus Illustration, Pen Drawing, and more advanced techniques.', price: '₹10,000 total', isCert: true },
    { name: 'Certificate Course (Advance)', duration: '1 Year', level: 'Govt. Certified', icon: <Star size={24} />, desc: 'Complete mastery including Portraits, Oil Painting, and Mural Painting.', price: '₹15,000 total', isCert: true },
    { name: 'Spoken English Class', duration: '2–3 Months', level: 'All Ages', icon: <Users size={24} />, desc: 'Gain confidence and fluency with our comprehensive spoken English training.', price: 'From ₹1,000', isCert: false }
  ];

  return (
    <div className="bg-[#fff5f8] pt-32 lg:pt-48">
      <Helmet>
        <title>Rivya School of Arts – Art Courses in Tiruppur | Drawing, Painting, Portrait &amp; More</title>
        <meta name="description" content="Explore certified drawing & painting courses at Rivya School of Arts, Tiruppur. Pencil Art, Oil Painting, Portrait, Mandala, Glass Painting, Mural Design, Mehandi, Handwriting & Spoken English. Offline & online for kids to adults." />
        <meta name="keywords" content="drawing courses tirupur, painting courses tirupur, mandala art classes tirupur, glass painting tirupur, portrait art tirupur, oil painting classes tirupur, art certificate course tirupur, children art classes tirupur, adult art courses tirupur, mural design tirupur, mehandi design course tirupur, handwriting improvement tirupur, spoken english tirupur, online art courses tamil nadu, acrylic painting tirupur, charcoal portrait tirupur, fabric painting tirupur, watercolor painting tirupur, pot painting tirupur" />
        <link rel="canonical" href="https://rivyaschoolofarts.com/courses" />
      </Helmet>
      <section className="container px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto px-4">
          <h4 className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold text-[#d81b60] mb-3 sm:mb-4">Enroll Today</h4>
          <h2 className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-[#ad1457] leading-tight">Our Courses</h2>
          <p className="text-sm sm:text-base md:text-lg text-[#2d3436]/60 leading-relaxed">Offline & Online modes available. Certificates provided upon successful completion.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {coursesList.map((course, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`h-full rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-lg sm:shadow-xl transition-all flex flex-col overflow-hidden group ${
                course.isCert
                  ? 'bg-gradient-to-br from-[#fff8e1] to-[#fffde7] border-2 border-[#d4af37]/40 hover:shadow-[#d4af37]/30'
                  : 'bg-white border border-[#ec407a]/15 hover:shadow-[#ec407a]/20'
              }`}
            >
              {course.isCert && (
                <div className="bg-gradient-to-r from-[#d4af37] to-[#f5c842] text-white text-[9px] font-black tracking-[0.2em] uppercase text-center py-2 px-4">
                  ⭐ Govt. Certified Course — MSME Approved
                </div>
              )}
              <div className="p-5 sm:p-6 md:p-8 lg:p-10 flex-grow flex flex-col gap-4 sm:gap-5 h-full">
                <div className={`w-14 sm:w-16 h-14 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all transform group-hover:rotate-6 ${
                  course.isCert
                    ? 'bg-[#fef9e7] text-[#d4af37] border-[#d4af37]/30 group-hover:bg-[#d4af37] group-hover:text-white'
                    : 'bg-[#fff0f6] text-[#d81b60] border-[#ec407a]/10 group-hover:bg-[#d81b60] group-hover:text-white'
                }`}>
                  {course.icon}
                </div>
                <h3 className={`text-lg sm:text-xl md:text-2xl font-black leading-snug line-clamp-3 ${
                  course.isCert ? 'text-[#5c4308]' : 'text-[#ad1457]'
                }`}>{course.name}</h3>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-[#fff5f8] px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full w-fit">
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#d81b60] whitespace-nowrap">{course.duration}</span>
                  <div className="w-0.5 h-0.5 bg-[#d81b60]/30 rounded-full shrink-0"></div>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#d81b60] whitespace-nowrap">{course.level}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[13px] sm:text-[14px] md:text-[15px] flex-grow">{course.desc}</p>
                <div className={`text-sm font-black mt-1 ${
                  course.isCert ? 'text-[#5c4308]' : 'text-[#d81b60]'
                }`}>{course.price}</div>
                <Link to="/join" className={`w-full py-2.5 sm:py-3 md:py-3.5 lg:py-4 text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-widest transition-all mt-auto text-center rounded-[3rem] uppercase ${
                  course.isCert
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-white hover:from-[#c9a227] hover:to-[#b8911e] shadow-lg'
                    : 'btn-primary'
                }`}>ENROLL NOW</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const LightboxModal = ({ image, onClose }) => {
  if (!image) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all border border-white/20"
        >
          <X size={28} />
        </button>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-[2.5rem] border-4 border-white/20 shadow-2xl bg-slate-900 flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={getAsset(image.src)}
            alt={image.title || 'Artwork'}
            className="w-full max-h-[70vh] object-contain bg-black/40"
          />
          <div className="w-full p-6 bg-slate-900 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#f8bbd0] bg-[#d81b60]/30 px-3 py-1 rounded-full border border-[#d81b60]/40">
                {image.cat}
              </span>
              <h4 className="text-xl font-serif text-white font-bold mt-2">{image.title || 'Masterpiece Artwork'}</h4>
            </div>
            <Link
              to="/commission"
              onClick={onClose}
              className="btn-primary !py-3 !px-6 !text-[10px] !rounded-full shrink-0"
            >
              Order Similar Custom Art →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Are certificates government MSME recognized?",
      a: "Yes! Rivya School of Arts is an officially MSME registered institute. Upon successful completion of any Certificate course (Basic, Intermediate, or Advanced), students receive an official MSME-approved certificate."
    },
    {
      q: "Are art kits and practice materials provided in class?",
      a: "Yes! For studio offline batches, practice materials and guidance are provided. Complete art kit guidance is provided for all students."
    },
    {
      q: "What age groups can join the classes?",
      a: "We welcome all age groups starting from 5+ years kids, teenagers, working adults, to senior citizens. Batches are customized according to skill levels."
    },
    {
      q: "What are the class timings & weekend schedules?",
      a: "Regular Monday to Saturday batches run from 6:00 PM to 9:00 PM. Sunday special batches run in the morning (10:00 AM - 1:00 PM) and evening (5:00 PM - 7:00 PM)."
    },
    {
      q: "How do online classes work for students outside Tiruppur?",
      a: "Online sessions are conducted live via video calls with step-by-step camera close-ups, personalized feedback on assignments, and continuous mentor support."
    }
  ];

  return (
    <section className="bg-white py-24 border-t border-[#ec407a]/10">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-[#d81b60] mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Clear Answers <Sparkles size={14} />
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif text-[#ad1457]">Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                openIndex === i
                  ? 'border-[#d81b60] bg-[#fff5f8] shadow-lg shadow-[#d81b60]/10'
                  : 'border-slate-100 bg-white hover:border-[#ec407a]/30'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left gap-4 cursor-pointer"
              >
                <span className="text-base md:text-lg font-bold text-slate-800">{faq.q}</span>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'bg-[#d81b60] text-white rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <ArrowRight size={18} className="rotate-90" />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 text-slate-600 leading-relaxed text-sm md:text-base border-t border-[#d81b60]/10 mt-2">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { src: 'portrait_women.jpg', cat: 'Pencil', title: 'Hyper-Realistic Pencil Portrait' },
    { src: 'painting_justice.jpg', cat: 'Artistic', title: 'Acrylic & Canvas Painting' },
    { src: 'portrait_couple.jpg', cat: 'Portrait', title: 'Charcoal Couple Artwork' },
    { src: 'commission_delivery.jpg', cat: 'Commissions', title: 'Custom Painting Order Delivery' },
    { src: 'group_students.jpg', cat: 'Studio', title: 'RSA Studio Student Class Session' },
    { src: 'founder.jpg', cat: 'Artist', title: 'Lead Artist & Founder Thrinethraa D S' }
  ];

  const categories = ['All', 'Pencil', 'Portrait', 'Artistic', 'Commissions', 'Studio', 'Artist'];

  const filteredImages = activeFilter === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.cat === activeFilter);

  return (
    <div className="bg-white pt-32 lg:pt-48">
      <Helmet>
        <title>Rivya School of Arts – Art Gallery | Student Works &amp; Portraits, Tiruppur</title>
        <meta name="description" content="View the art gallery of Rivya School of Arts – Tiruppur's MSME-registered drawing institute. Pencil portraits, oil paintings, charcoal art, mandala designs and custom commissions by our students and lead artist." />
        <meta name="keywords" content="art gallery tirupur, pencil portrait tirupur, student art tirupur, oil painting gallery tirupur, charcoal art tirupur, mandala art gallery tirupur, commissioned portrait tirupur, Rivya School of Arts gallery, fine art works tirupur, portrait artist tirupur" />
        <link rel="canonical" href="https://rivyaschoolofarts.com/gallery" />
      </Helmet>
      <section className="container pb-24">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-[#d81b60] mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Visual Masterpieces <Sparkles size={14} />
          </h4>
          <h2 className="text-5xl md:text-6xl mb-4 text-[#ad1457]">Our Gallery</h2>
          <p className="text-base md:text-lg text-[#2d3436]/60">Explore our collection of commissioned works and student achievements across all age groups.</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-16 px-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#d81b60] text-white shadow-lg shadow-[#d81b60]/30 scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-[#fff5f8] hover:text-[#d81b60]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
          {filteredImages.map((img, i) => (
            <SectionReveal key={i} delay={i * 0.05} className="break-inside-avoid">
              <motion.div
                whileHover={{ y: -10 }}
                onClick={() => setSelectedImage(img)}
                className="break-inside-avoid relative overflow-hidden rounded-3xl md:rounded-[2.5rem] group cursor-pointer border border-slate-100 shadow-xl"
              >
                <img
                  src={getAsset(img.src)}
                  alt={img.title}
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

        <LightboxModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      </section>
    </div>
  );
};

const Commission = () => {
  const [refImage, setRefImage] = useState(null);
  const [refPreview, setRefPreview] = useState(null);
  const [commSubmitted, setCommSubmitted] = useState(false);
  const [commLoading, setCommLoading] = useState(false);

  const handleRefImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRefImage(file);
      setRefPreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="bg-[#fffdfd] pt-32 lg:pt-48">
      <Helmet>
        <title>Rivya School of Arts – Order Custom Painting | Portrait Commission</title>
        <meta name="description" content="Order a custom hand-painted portrait or painting from Rivya School of Arts, Tiruppur. Pencil, charcoal, oil & acrylic commissions for gifts, family portraits, and art collectors. Delivered across Tamil Nadu and India." />
        <meta name="keywords" content="custom portrait tirupur, painting commission tirupur, hand-painted portrait tirupur, portrait gift tirupur, custom painting order tirupur, oil painting commission tirupur, pencil portrait commission, charcoal portrait tirupur, art commission india, buy painting tirupur, Rivya School of Arts commission" />
        <link rel="canonical" href="https://rivyaschoolofarts.com/commission" />
      </Helmet>
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

              <a
                href="https://wa.me/919566951629?text=Hi%21%20I%20want%20to%20order%20a%20custom%20painting%20from%20Rivya%20School%20of%20Arts."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[#25D366] text-white px-8 py-5 rounded-[2rem] font-black text-sm tracking-wide hover:bg-[#1da851] transition-all shadow-lg hover:shadow-[#25D366]/40 group"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <div className="text-xs tracking-widest uppercase opacity-80">Prefer WhatsApp?</div>
                  <div>Order Directly via WhatsApp</div>
                </div>
                <ArrowRight size={20} className="ml-auto group-hover:translate-x-1 transition-transform" />
              </a>
            </SectionReveal>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-4 sm:p-8 md:p-12 lg:p-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24 rounded-2xl sm:rounded-3xl md:rounded-4xl border border-slate-100 shadow-[0_40px_80px_-10px_rgba(0,0,0,0.08)] md:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] mb-6 sm:mb-8 md:mb-10"
            >
              {commSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="text-6xl mb-6">🎨</div>
                  <h3 className="text-3xl font-serif text-[#ad1457] mb-4">Order Received!</h3>
                  <p className="text-slate-500 text-base mb-4">Thank you! We'll call you within 24 hours to discuss your artwork.</p>
                  <div className="bg-[#fff5f8] rounded-2xl p-4 text-sm text-slate-600 text-left mb-6">
                    <p className="font-bold text-[#d81b60] mb-2">What happens next?</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>We call you to confirm the artwork details</li>
                      <li>You pay a 50% advance to start</li>
                      <li>We create and deliver within the agreed timeline</li>
                    </ol>
                  </div>
                  <button onClick={() => setCommSubmitted(false)} className="btn-secondary border-[#d81b60] text-[#d81b60] hover:bg-[#d81b60] hover:text-white px-8 py-3 text-xs font-black tracking-widest uppercase">
                    Place Another Order
                  </button>
                </motion.div>
              ) : (
              <>
              <h3 className="text-xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 md:mb-10 text-[#ad1457] font-serif">Custom Order Request</h3>
              <form className="flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-10" onSubmit={(e) => {
                e.preventDefault();
                setCommLoading(true);
                const form = e.target;
                emailjs.sendForm(
                  'service_rivyaarts',
                  'template_commission',
                  form,
                  'Gg0xDxs9IK_aQQegv'
                ).then((res) => {
                  console.log('Commission SUCCESS!', res.status, res.text);
                  setCommSubmitted(true);
                  setCommLoading(false);
                  form.reset();
                  setRefPreview(null);
                }).catch((err) => {
                  console.error('Commission FAILED...', err);
                  setCommLoading(false);
                  alert(`We couldn't send your request via email. Please WhatsApp us directly at +91 95669 51629 or call us — we're happy to help!`);
                });
              }}>
                <div className="flex flex-col gap-2.5 w-full">
                  <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Artwork Category *</label>
                  <div className="relative w-full">
                    <select name="artwork_type" className="w-full bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-slate-900 text-sm sm:text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm pr-12 font-medium">
                      <option>Fine Art Portrait (Oil/Acrylic)</option>
                      <option>Sketch Portrait (Pencil/Charcoal)</option>
                      <option>Wall Mural Project</option>
                      <option>Modern Abstract Canvas</option>
                      <option>Wedding Pair Painting</option>
                      <option>Custom Gift Collection</option>
                    </select>
                    <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#d81b60]">
                      <ArrowRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                  <div className="flex flex-col gap-2.5 w-full">
                    <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Full Name *</label>
                    <input name="from_name" required type="text" className="w-full bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-slate-900 text-sm sm:text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all shadow-sm placeholder:text-slate-400 font-medium" placeholder="Enter full name" />
                  </div>
                  <div className="flex flex-col gap-2.5 w-full">
                    <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Contact Phone *</label>
                    <div className="flex bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 rounded-2xl overflow-hidden focus-within:border-[#d81b60] focus-within:bg-white transition-all shadow-sm">
                      <span className="bg-[#fff5f8] border-r-2 border-[#ec407a]/10 px-4 py-3.5 sm:py-4 text-slate-600 text-sm font-bold flex items-center select-none shrink-0">+91</span>
                      <input name="phone" required type="tel" className="w-full bg-transparent px-4 py-3.5 sm:py-4 text-slate-900 text-sm sm:text-base outline-none placeholder:text-slate-400 font-medium" placeholder="XXXXX XXXXX" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 w-full">
                  <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Vision & Requirements</label>
                  <textarea name="message" className="w-full bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-slate-900 text-sm sm:text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all h-32 sm:h-40 resize-none shadow-sm placeholder:text-slate-400" placeholder="Describe size (e.g. 12x18 inches), medium (oil/pencil), and timeline..."></textarea>
                </div>

                <div className="flex flex-col gap-2.5 w-full">
                  <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Reference Image (Optional)</label>
                  <label className={`flex flex-col items-center justify-center gap-3 sm:gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all px-4 sm:px-6 py-6 sm:py-8 w-full ${
                    refPreview ? 'border-[#d81b60] bg-[#fff5f8]' : 'border-[#ec407a]/20 bg-[#fff5f8]/50 hover:border-[#d81b60] hover:bg-[#fff5f8]'
                    } shadow-sm`}>
                    <input name="reference_image" type="file" accept="image/*" className="hidden" onChange={handleRefImage} />
                    {refPreview ? (
                      <div className="relative w-full">
                        <img src={refPreview} alt="Reference preview" className="w-full max-h-64 object-contain rounded-2xl mx-auto" />
                        <p className="text-xs text-[#d81b60] font-bold mt-4 text-center">{refImage?.name}</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-[#d81b60]/10 rounded-2xl flex items-center justify-center text-[#d81b60]">
                          <Sparkles size={28} />
                        </div>
                        <div className="text-center px-4">
                          <p className="font-bold text-slate-700 text-sm">Upload reference photo or drawing</p>
                          <p className="text-xs text-slate-400 mt-2">JPG, PNG or WEBP (Max 10MB) — Optional</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>

                <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10">
                  <button type="submit" disabled={commLoading} className="btn-primary w-full py-4 sm:py-5 md:py-6 text-[9px] sm:text-[10px] md:text-[11px] font-black tracking-[0.2em] sm:tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(216,27,96,0.4)] hover:shadow-[0_30px_50px_-10px_rgba(216,27,96,0.5)] transition-all rounded-[2rem] disabled:opacity-60">
                    {commLoading ? 'SENDING...' : 'SUBMIT REQUEST →'}
                  </button>
                </div>
              </form>
              </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Contact = () => (
  <div className="bg-[#fff5f8] min-h-screen pt-32 lg:pt-48">
    <Helmet>
      <title>Rivya School of Arts – Contact Us | Drawing Classes in Perumanallur, Tiruppur</title>
      <meta name="description" content="Contact Rivya School of Arts in Perumanallur, Tiruppur. Call +91 95669 51629 or email rivyaartsschool17@gmail.com. Located at KRK Complex, Perumanallur. Mon–Sat 6–9 PM, Sunday 10 AM–1 PM & 5–7 PM." />
      <meta name="keywords" content="contact Rivya School of Arts, drawing classes contact tirupur, art school phone number tirupur, art school address tirupur, KRK complex perumanallur, Rivya School of Arts phone, art classes near me tirupur, drawing classes near perumanallur" />
      <link rel="canonical" href="https://rivyaschoolofarts.com/contact" />
    </Helmet>
    <section className="container pb-24">
      <div className="text-center mb-20 max-w-2xl mx-auto">
        <h4 className="text-sm uppercase tracking-[0.1em] font-bold text-[#d81b60] mb-4">Get In Touch</h4>
        <h2 className="text-6xl mb-6 text-[#ad1457] font-serif">Let's Talk Art</h2>
        <p className="text-lg text-[#2d3436]/60">Have questions about courses or commissions? We're just a message away.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-white text-center p-8 rounded-3xl lg:rounded-[3rem] border border-[#ec407a]/10 hover:shadow-2xl transition-all shadow-sm flex flex-col">
          <div className="w-16 h-16 rounded-full bg-[#fff5f8] mx-auto flex items-center justify-center mb-5 text-[#d81b60] shadow-sm"><Instagram size={32} /></div>
          <h4 className="text-lg mb-2 font-serif text-[#ad1457]">Instagram</h4>
          <p className="text-[#2d3436]/60 mb-6 text-sm leading-relaxed flex-grow">Follow us for daily artworks, student progress and school updates.</p>
          <a href="https://www.instagram.com/_oeuvre_world_?igsh=MXBpMXludzM2dm16dg==" target="_blank" className="btn-secondary inline-block px-5 py-2.5 text-xs border-[#ad1457] text-[#ad1457] hover:bg-[#ad1457] hover:text-white transition-all uppercase tracking-widest font-bold">Portfolio <ExternalLink size={12} className="inline ml-1" /></a>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white text-center p-8 rounded-3xl lg:rounded-[3rem] border border-[#ec407a]/10 hover:shadow-2xl transition-all shadow-sm flex flex-col">
          <div className="w-16 h-16 rounded-full bg-[#fff5f8] mx-auto flex items-center justify-center mb-5 text-[#d81b60] shadow-sm"><MapPin size={32} /></div>
          <h4 className="text-lg mb-2 font-serif text-[#ad1457]">Our Studio</h4>
          <p className="text-[#2d3436]/60 mb-6 text-sm leading-relaxed flex-grow">KRK COMPLEX, Bus Stop, Perumanallur, Tiruppur, Tamil Nadu 641666.</p>
          <a href="https://maps.app.goo.gl/wS22D68S899A6" target="_blank" className="btn-secondary inline-block px-5 py-2.5 text-xs border-[#ad1457] text-[#ad1457] hover:bg-[#ad1457] hover:text-white transition-all uppercase tracking-widest font-bold">Find Us <ExternalLink size={12} className="inline ml-1" /></a>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white text-center p-8 rounded-3xl lg:rounded-[3rem] border border-[#ec407a]/10 hover:shadow-2xl transition-all shadow-sm flex flex-col">
          <div className="w-16 h-16 rounded-full bg-[#fff5f8] mx-auto flex items-center justify-center mb-5 text-[#d81b60] shadow-sm"><Phone size={32} /></div>
          <h4 className="text-lg mb-2 font-serif text-[#ad1457]">Call Us</h4>
          <p className="text-[#2d3436]/60 mb-6 text-sm leading-relaxed flex-grow">Direct call for detailed enrollments and inquiries.</p>
          <a href="tel:+919566951629" className="btn-secondary inline-block px-5 py-2.5 text-xs border-[#ad1457] text-[#ad1457] hover:bg-[#ad1457] hover:text-white transition-all uppercase tracking-widest font-bold">+91 95669 51629</a>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-[#ffffff] text-center p-8 rounded-3xl lg:rounded-[3rem] border border-[#ec407a]/10 hover:shadow-2xl transition-all shadow-sm flex flex-col">
          <div className="w-16 h-16 rounded-full bg-[#fff5f8] mx-auto flex items-center justify-center mb-5 text-[#d81b60] shadow-sm"><Mail size={32} /></div>
          <h4 className="text-lg mb-2 font-serif text-[#ad1457]">Email Us</h4>
          <p className="text-[#2d3436]/60 mb-6 text-sm leading-relaxed flex-grow">Send us your queries and we'll respond within 24 hours.</p>
          <a href="mailto:rivyaartsschool17@gmail.com" className="btn-secondary inline-block px-5 py-2.5 text-xs border-[#ad1457] text-[#ad1457] hover:bg-[#ad1457] hover:text-white transition-all uppercase tracking-widest font-bold">Email <ExternalLink size={12} className="inline ml-1" /></a>
        </motion.div>
      </div>

      <div className="mt-20 h-[500px] rounded-3xl md:rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative">
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

const FloatingWhatsApp = () => (
  <motion.a
    href="https://wa.me/919566951629?text=Hello%20Rivya%20School%20of%20Arts!%20I%20would%20like%20to%20know%20more%20about%20your%20courses."
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-6 right-6 z-[999] bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] flex items-center justify-center border-2 border-white cursor-pointer group"
    title="Chat on WhatsApp"
  >
    <Phone size={22} className="group-hover:rotate-12 transition-transform" />
    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
      WhatsApp Us
    </span>
  </motion.a>
);

export default function App() {
  return (
    <HelmetProvider>
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
        <FloatingWhatsApp />
      </Router>
    </ReactLenis>
    </HelmetProvider>
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
        mode: formData.mode,
        age_group: formData.ageGroup,
        total_fees: `₹${totalFees}`,
        to_email: 'rivyaartsschool17@gmail.com',
      },
      'Gg0xDxs9IK_aQQegv'
    ).then((res) => {
      console.log('Enrollment SUCCESS!', res.status, res.text);
      setSubmitted(true);
    }).catch((err) => {
      console.error('Enrollment FAILED...', err);
      alert(`Submission failed. Error: ${err.text || 'Service error'}. Please call us at +91 95669 51629.`);
    });
  };


  return (
    <div className="bg-gradient-to-br from-[#fff5f8] via-white to-[#fff0f6] min-h-screen pt-32 lg:pt-48">
      <Helmet>
        <title>Rivya School of Arts – Enroll Now | Join RSA Today</title>
        <meta name="description" content="Enroll now in Rivya School of Arts, Tiruppur's MSME government-registered fine arts institute. Complete the enrollment form to start your art journey." />
        <meta name="keywords" content="enroll drawing classes tirupur, join art school perumanallur, art class registration tirupur, Rivya School of Arts admission" />
        <link rel="canonical" href="https://rivyaschoolofarts.com/join" />
      </Helmet>
      <section className="container px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-2 sm:px-4">
          <h4 className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-[#d81b60] mb-2 sm:mb-3 md:mb-4 flex items-center justify-center gap-2">
            <Sparkles size={12} className="sm:w-[16px] sm:h-[16px]" /> Enrollment
          </h4>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 md:mb-6 text-[#ad1457] font-serif leading-tight">Join <span className="italic font-normal">RSA</span> Today</h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed">Take the first step on your artistic journey. Fill in your details below and our team will get back to you within 24 hours.</p>
        </div>

        <div className="max-w-3xl mx-auto px-2 sm:px-4">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[4rem] p-16 text-center shadow-2xl border border-[#ec407a]/10"
            >
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-3xl font-serif text-[#ad1457] mb-4">You're In!</h3>
              <p className="text-slate-500 text-lg mb-6">Thank you for enrolling at Rivya School of Arts. Our team will reach out within 24 hours!</p>
              <div className="bg-[#fff5f8] rounded-2xl p-5 text-sm text-slate-600 text-left mb-8">
                <p className="font-bold text-[#d81b60] mb-3">📌 What Happens Next?</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Our team calls you within <strong>24 hours</strong> to confirm your enrollment</li>
                  <li>We guide you on the <strong>joining date and batch timing</strong></li>
                  <li>Bring your enthusiasm — <strong>art materials are included</strong> in the course fee!</li>
                </ol>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/" className="btn-primary px-10 py-4 text-xs font-black tracking-widest inline-block">Back to Home</Link>
                <a href="https://wa.me/919566951629?text=Hi%21%20I%20just%20enrolled%20at%20Rivya%20School%20of%20Arts%21" target="_blank" rel="noopener noreferrer" className="btn-secondary px-8 py-4 text-xs font-black tracking-widest uppercase border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white inline-flex items-center gap-2 justify-center">
                  💬 WhatsApp Us
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-4 sm:p-8 md:p-12 lg:p-16 pb-16 sm:pb-20 md:pb-24 lg:pb-28 rounded-2xl sm:rounded-3xl md:rounded-4xl lg:rounded-5xl border border-[#ec407a]/15 shadow-[0_40px_80px_-10px_rgba(216,27,96,0.1)] md:shadow-[0_60px_100px_-20px_rgba(216,27,96,0.15)] overflow-visible relative"
            >
              <form className="flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-10" onSubmit={handleSubmit}>
                {/* Row 1: Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                  <div className="flex flex-col gap-2.5 w-full">
                    <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleUpdate('name', e.target.value)}
                      className="w-full bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-slate-900 text-sm sm:text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all shadow-sm placeholder:text-slate-400 font-medium"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5 w-full">
                    <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Phone Number *</label>
                    <div className="flex bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 rounded-2xl overflow-hidden focus-within:border-[#d81b60] focus-within:bg-white transition-all shadow-sm">
                      <span className="bg-[#fff5f8] border-r-2 border-[#ec407a]/10 px-4 py-3.5 sm:py-4 text-slate-600 text-sm font-bold flex items-center select-none shrink-0">+91</span>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleUpdate('phone', e.target.value)}
                        className="w-full bg-transparent px-4 py-3.5 sm:py-4 text-slate-900 text-sm sm:text-base outline-none placeholder:text-slate-400 font-medium"
                        placeholder="XXXXX XXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Age Group + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                  <div className="flex flex-col gap-2.5 w-full">
                    <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Age Group *</label>
                    <div className="relative w-full">
                      <select
                        required
                        name="ageGroup"
                        value={formData.ageGroup}
                        onChange={(e) => handleUpdate('ageGroup', e.target.value)}
                        className="w-full bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-slate-900 text-sm sm:text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm pr-12 font-medium"
                      >
                        <option value="">Select age group...</option>
                        <option value="Kids (5–10 yrs)">Kids (5–10 yrs)</option>
                        <option value="Teens (11–17 yrs)">Teens (11–17 yrs)</option>
                        <option value="Adults (18+ yrs)">Adults (18+ yrs)</option>
                      </select>
                      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#d81b60]">
                        <ArrowRight size={18} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 w-full">
                    <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleUpdate('email', e.target.value)}
                      className="w-full bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-slate-900 text-sm sm:text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all shadow-sm placeholder:text-slate-400 font-medium"
                      placeholder="Enter your email (optional)"
                    />
                  </div>
                </div>

                {/* Row 3: Course Selection */}
                <div className="flex flex-col gap-2.5 w-full">
                  <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Select Course *</label>
                  <div className="relative w-full">
                    <select
                      required
                      className="w-full bg-[#fff5f8]/50 border-2 border-[#ec407a]/10 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-slate-900 text-sm sm:text-base outline-none focus:border-[#d81b60] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm pr-12"
                      value={formData.course}
                      onChange={(e) => handleUpdate('course', e.target.value)}
                    >
                      <option value="">Choose your art course...</option>
                      {Object.keys(feesMap).map(course => <option key={course} value={course}>{course}</option>)}
                    </select>
                    <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#d81b60]">
                      <ArrowRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Row 4: Duration Selection */}
                <div className="flex flex-col gap-3 w-full">
                  <label className="text-[10px] font-black text-[#d81b60] uppercase tracking-[0.15em]">Select Duration *</label>
                  {formData.course && feesMap[formData.course] ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-auto gap-2.5 md:gap-3 w-full">
                      {Object.keys(feesMap[formData.course]).map(dur => (
                        <label key={dur} className="relative group cursor-pointer flex-1 min-w-[100px]">
                          <input
                            type="radio"
                            name="duration"
                            value={dur}
                            className="hidden peer"
                            onChange={() => handleUpdate('duration', dur)}
                            checked={formData.duration === dur}
                          />
                          <div className="w-full px-3 py-3 sm:py-3.5 rounded-2xl border-2 border-[#ec407a]/10 bg-white peer-checked:border-[#d81b60] peer-checked:bg-[#fff5f8] text-center transition-all shadow-sm group-hover:border-[#d81b60]/50">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#ad1457] peer-checked:text-[#d81b60] whitespace-nowrap block">{dur}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full py-3.5 text-center border-2 border-dashed border-[#ec407a]/20 rounded-2xl bg-slate-50">
                      <p className="text-xs text-slate-400 italic">Please select a course first</p>
                    </div>
                  )}
                </div>

                {/* Preferred Mode */}
                <div className="flex flex-col gap-4 w-full">
                  <label className="text-[11px] font-black text-[#d81b60] uppercase tracking-[0.1em]">Preferred Mode *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {['Online', 'Offline (Studio)'].map(mode => (
                      <label key={mode} className="flex items-center gap-4 bg-[#fff5f8]/50 px-5 sm:px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#fff5f8] transition-all border-2 border-[#ec407a]/10 has-[:checked]:border-[#d81b60] has-[:checked]:bg-[#fff5f8] shadow-sm">
                        <input type="radio" name="mode" value={mode} className="accent-[#d81b60] w-5 h-5 shrink-0" required />
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
                    className="bg-gradient-to-r from-[#fff5f8] to-[#fff0f6] p-6 md:p-8 rounded-3xl border border-[#d81b60]/15 w-full"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-5 border-b border-[#d81b60]/10">
                      <div className="flex items-start sm:items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-[#d81b60]/10 flex items-center justify-center shrink-0">
                          <Palette size={22} className="text-[#d81b60]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-700 line-clamp-2">{formData.course}</p>
                          <p className="text-xs text-slate-400 font-medium whitespace-nowrap">{formData.duration} • One-time Payment</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#d81b60]">₹{totalFees}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      <span className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-600"><Star size={12} className="text-[#d81b60] shrink-0" /> Professional Mentorship</span>
                      <span className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-600"><Star size={12} className="text-[#d81b60] shrink-0" /> MSME Certificate</span>
                      <span className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-slate-600"><Star size={12} className="text-[#d81b60] shrink-0" /> Art Kits Included</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-4 pt-4 border-t border-[#d81b60]/10">* Fees may vary based on age group. Final pricing confirmed during intro call.</p>
                  </motion.div>
                )}

                <div className="mt-6 md:mt-10">
                  <button type="submit" className="btn-primary w-full py-5 md:py-6 text-[10px] sm:text-[11px] font-black tracking-[0.3em] shadow-[0_25px_50px_-12px_rgba(216,27,96,0.4)] hover:shadow-[0_40px_60px_-12px_rgba(216,27,96,0.5)] transition-all rounded-[2rem]">SUBMIT ENROLLMENT →</button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};



