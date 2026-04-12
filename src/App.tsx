/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Globe,
  Zap,
  Shield,
  Users,
  MessageSquare,
  Share2,
  Cpu,
  Sun,
  Moon,
  Activity,
  Server,
  Database,
  Lock,
  Search,
  Filter,
  Check,
  Twitter,
  Linkedin,
  GraduationCap,
  Mail,
  Send,
  Plus
} from 'lucide-react';
import * as d3 from 'd3';
import { LoginPage } from './LoginPage';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './lib/firebase';


const SocialNetViz = () => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();

    const nodes = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1
    }));

    const links: any[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2)) < 100) {
          links.push({ source: i, target: j });
        }
      }
    }

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 0.5);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.r)
      .attr('fill', 'currentColor')
      .attr('fill-opacity', 0.6);

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });

    return () => simulation.stop();
  }, []);

  return (
    <div className="relative w-full aspect-video bg-neutral-100 dark:bg-neutral-900 rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 p-8">
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-50 mb-2">
          <Activity size={12} className="text-emerald-500 animate-pulse" />
          Live Network Status
        </div>
        <div className="text-2xl font-medium">SocialNet Global Nodes</div>
      </div>
      <div className="absolute bottom-8 right-8 z-10 flex gap-8 text-xs font-mono uppercase tracking-widest opacity-50">
        <div>Nodes: 4,281</div>
        <div>Latency: 12ms</div>
        <div>Uptime: 99.99%</div>
      </div>
      <svg ref={svgRef} className="w-full h-full text-black dark:text-white" />
    </div>
  );
};

const FomoPopup = () => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const notifications = [
    { name: "Alex M.", action: "just upgraded to Team", location: "London" },
    { name: "Sarah K.", action: "deployed Aetheris-4", location: "San Francisco" },
    { name: "David L.", action: "joined SocialNet", location: "Berlin" },
    { name: "Elena R.", action: "published a research paper", location: "Madrid" },
    { name: "Jay P.", action: "requested API access", location: "Mumbai" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setVisible(true);
      }, 1000);
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -50, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          className="fixed bottom-8 left-8 z-[60] bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-5 rounded-3xl shadow-2xl flex items-center gap-4 max-w-xs backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Zap size={20} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-sm font-medium leading-tight text-black dark:text-white">
              {notifications[currentIndex].name} {notifications[currentIndex].action}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest opacity-40 mt-1 dark:text-neutral-400">
              {notifications[currentIndex].location} • Just now
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-neutral-800 border border-black/5 dark:border-white/5 rounded-full flex items-center justify-center text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <X size={10} className="text-black dark:text-white" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const ResearchIndex = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Models', 'Safety', 'Infrastructure'];

  const papers = [
    { title: "Aetheris-4: Technical Report", date: "March 2026", category: "Models" },
    { title: "SocialNet: Scaling Social AI", date: "February 2026", category: "Infrastructure" },
    { title: "Alignment via Human Feedback", date: "January 2026", category: "Safety" },
    { title: "Efficient Training of Large Models", date: "December 2025", category: "Models" },
    { title: "Red Teaming Aetheris", date: "November 2025", category: "Safety" },
    { title: "Distributed Systems for AI", date: "October 2025", category: "Infrastructure" },
  ];

  const filteredPapers = filter === 'All' ? papers : papers.filter(p => p.category === filter);

  return (
    <section className="py-24 bg-white dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tighter">Research Index</h2>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 font-light">
              Our latest findings in artificial intelligence, safety, and infrastructure.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-black text-white dark:bg-white dark:text-black' : 'border border-black/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/10 dark:border-white/10">
          <AnimatePresence mode="popLayout">
            {filteredPapers.map((paper, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={paper.title}
                className="p-6 border-r border-b border-black/10 dark:border-white/10 group cursor-pointer hover:bg-neutral-50 dark:hover:bg-white/5 transition-all flex flex-col min-h-[260px]"
              >
                <div className="mb-auto">
                  <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4">{paper.date}</div>
                  <h3 className="text-2xl font-medium group-hover:italic group-hover:underline decoration-1 underline-offset-8 tracking-tight leading-tight transition-all">{paper.title}</h3>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 bg-neutral-100 dark:bg-white/10 rounded-full">{paper.category}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const text = `Check out this research paper from SnyderAI: ${paper.title}`;
                          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                        }}
                        className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                        title="Share on Twitter"
                      >
                        <Twitter size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                        }}
                        className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                        title="Share on LinkedIn"
                      >
                        <Linkedin size={14} />
                      </button>
                    </div>
                    <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const tiers = [
    {
      name: "Personal",
      price: "0",
      description: "For individuals exploring the future of AI.",
      features: ["Access to Aetheris-Lite", "Standard SocialNet API", "Community Support"],
      button: "Start for free",
      highlight: false
    },
    {
      name: "Team",
      price: "0",
      description: "For small teams building next-gen apps.",
      features: ["Access to Aetheris-4", "Advanced SocialNet API", "Priority Support", "Team Workspace"],
      button: "Try Team",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "0",
      description: "For global organizations with scale.",
      features: ["Custom Model Training", "Dedicated SocialNet Nodes", "24/7 Enterprise Support", "SSO & Security"],
      button: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tighter">Pricing</h2>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 font-light">
              Simple, transparent plans for every stage of your journey.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-black/10 dark:border-white/10">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 border-r border-b border-black/10 dark:border-white/10 flex flex-col ${tier.highlight ? 'bg-neutral-50 dark:bg-white/5' : ''}`}
            >
              <div className="mb-12">
                <h3 className="text-2xl font-medium mb-2 tracking-tight">{tier.name}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 font-light">{tier.description}</p>
              </div>

              <div className="mb-12">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-serif italic">${tier.price}</span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-light">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 font-light">
                    <Check size={16} className="text-black dark:text-white" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-full font-medium transition-all ${tier.highlight ? 'bg-black text-white dark:bg-white dark:text-black' : 'border border-black/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5'}`}>
                {tier.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Navbar = ({ isDark, toggleTheme, onOpenModal, user }: { isDark: boolean; toggleTheme: () => void; onOpenModal: (type: string) => void; user: User | null }) => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuData: Record<string, { items: string[]; latest: { title: string; date: string }[] }> = {
    "Research": {
      items: ["Research Index", "Research Overview", "Research Residency", "SnyderAI for Science", "Safety"],
      latest: [
        { title: "Aetheris-4: Technical Report", date: "March 2026" },
        { title: "Alignment via Human Feedback", date: "January 2026" }
      ]
    },
    "Aetheris": {
      items: ["Aetheris-4", "Aetheris-3.5", "Aetheris-Lite", "Aetheris-Enterprise", "Pricing"],
      latest: [
        { title: "Introducing Aetheris-4", date: "March 2026" },
        { title: "Aetheris for Enterprise", date: "February 2026" }
      ]
    },
    "SocialNet": {
      items: ["SocialNet API", "SocialNet Nodes", "SocialNet Community", "SocialNet Safety", "Documentation"],
      latest: [
        { title: "SocialNet: Scaling Social AI", date: "February 2026" },
        { title: "Distributed Systems for AI", date: "October 2025" }
      ]
    },
    "Safety": {
      items: ["Alignment", "Red Teaming", "Safety Charter", "Safety Updates", "Safety Board"],
      latest: [
        { title: "Red Teaming Aetheris", date: "November 2025" },
        { title: "Safety & Alignment", date: "September 2025" }
      ]
    },
    "Company": {
      items: ["About", "Careers", "Press", "Contact", "Partnerships"],
      latest: [
        { title: "SnyderAI Careers", date: "March 2026" },
        { title: "Press Kit", date: "January 2026" }
      ]
    }
  };

  return (
    <nav
      onMouseLeave={() => setActiveMenu(null)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || activeMenu ? 'bg-white dark:bg-[#050505] border-b border-black/5 dark:border-white/5' : 'bg-transparent'} ${isScrolled ? 'py-3' : 'py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="text-xl font-bold tracking-tighter">SnyderAI</a>
          <div className="hidden md:flex items-center gap-6">
            {Object.keys(menuData).map((key) => (
              <span
                key={key}
                onMouseEnter={() => setActiveMenu(key)}
                className={`nav-link cursor-pointer transition-opacity ${activeMenu && activeMenu !== key ? 'opacity-40' : 'opacity-100'}`}
              >
                {key}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <span className="nav-link">Search</span>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium opacity-50">Signed in as</span>
                  <span className="text-sm font-bold tracking-tighter">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <button
                  onClick={() => signOut(auth)}
                  className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-xs font-mono uppercase tracking-widest transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="nav-link"
              >
                Log in
              </a>
            )}
            <a

              href="https://aetheris-ai-iota.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-block"
            >
              Try Aetheris
            </a>
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mega Menu */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-[#050505] border-b border-black/5 dark:border-white/5 py-16 hidden md:block"
          >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-12">
              <div className="col-span-8 flex flex-col gap-6">
                {menuData[activeMenu].items.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      if (item === "About") onOpenModal("about");
                      setActiveMenu(null);
                    }}
                    className="text-4xl md:text-6xl font-serif italic hover:skew-x-[-10deg] transition-transform origin-left text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="col-span-4">
                <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-8">Latest Advancements</div>
                <div className="space-y-8">
                  {menuData[activeMenu].latest.map((post) => (
                    <div key={post.title} className="group cursor-pointer">
                      <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-2">{post.date}</div>
                      <div className="text-lg font-medium group-hover:underline decoration-1 underline-offset-4">{post.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-[#050505] border-b border-black/5 dark:border-white/5 p-6 md:hidden flex flex-col gap-4"
          >
            <span className="text-lg font-medium">Research</span>
            <span className="text-lg font-medium">Aetheris</span>
            <a
              href="https://nearby-students-rose.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium"
            >
              SocialNet
            </a>
            <span className="text-lg font-medium">Safety</span>
            <span className="text-lg font-medium">Company</span>
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium truncate max-w-[200px]">{user.email}</span>
                <button
                  onClick={() => {
                    signOut(auth);
                    setIsMenuOpen(false);
                  }}
                  className="text-lg font-medium text-red-500"
                >
                  Log out
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/login');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  setIsMenuOpen(false);
                }}
                className="text-lg font-medium"
              >
                Log in
              </a>
            )}
            <hr className="border-black/5 dark:border-white/5" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 bg-black/5 dark:bg-white/5 rounded-full"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <a
              href="https://aetheris-ai-iota.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full text-center"
            >
              Try Aetheris
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};


const LiveMetrics = () => {
  const [count, setCount] = useState(12482930);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 100));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full mb-8">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">
        Global Compute Active: {count.toLocaleString()} TFLOPS
      </span>
    </div>
  );
};

const LogoCloud = () => {
  const logos = ["Aetheris", "SocialNet", "Xyther", "Cognitive", "Neural", "Aetheris"];
  return (
    <section className="py-12 border-b border-black/10 dark:border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30 text-center mb-10">Powering Innovation at</p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-40 grayscale">
          {logos.map((logo, i) => (
            <span key={i} className="text-2xl font-serif italic tracking-tighter">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechnicalFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    {
      q: "What defines the 'Xyther-Class' reasoning engine?",
      a: "Xyther-Class models utilize recursive self-correction loops. Unlike standard LLMs that predict the next token linearly, Xyther reasoners simulate multiple potential output paths and verify them against internal logic constraints before final generation."
    },
    {
      q: "How does SocialNet handle data privacy for Agentic AI?",
      a: "SocialNet uses a 'Zero-Knowledge Cognitive' architecture. Your personal data is processed in encrypted enclaves where the model can learn from context without ever persisting PII (Personally Identifiable Information) in its global weights."
    },
    {
      q: "Is Aetheris-4 compatible with humanoid robotics?",
      a: "Yes. Aetheris-4 features a native Spatial Intelligence layer that maps 2D visual input to 3D kinematic coordinates in real-time, specifically optimized for low-latency tactile feedback loops in robotics."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#050505] border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-[0.4em] opacity-40 mb-8">Technical FAQ</div>
          <h2 className="text-5xl md:text-7xl font-serif italic mb-16 tracking-tighter">Deep Intelligence <br /> Queries.</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="text-xl font-medium pr-8">{faq.q}</span>
                  <Plus className={`transform transition-transform ${openIndex === i ? 'rotate-45' : ''}`} size={20} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 pt-0 text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <LiveMetrics />
          <div className="text-xs font-mono uppercase tracking-[0.4em] opacity-40 mb-12">Intelligence Reimagined</div>
          <h1 className="text-7xl md:text-[160px] font-serif italic mb-12 leading-[0.8] tracking-tighter">
            Aetheris <br /> is here.
          </h1>
          <p className="text-2xl md:text-3xl text-neutral-500 dark:text-neutral-400 mb-16 max-w-3xl mx-auto leading-tight font-light tracking-tight">
            Our newest model, Aetheris, is designed to be more helpful, creative, and safe than ever before.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://aetheris-ai-iota.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-black text-white dark:bg-white dark:text-black rounded-full text-lg font-medium hover:opacity-90 transition-opacity shadow-2xl shadow-black/10 dark:shadow-white/10"
            >
              Try Aetheris
            </a>
            <button
              onClick={() => document.getElementById('about-aetheris')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 border border-black/10 dark:border-white/10 rounded-full text-lg font-medium hover:bg-neutral-50 dark:hover:bg-white/5 transition-all flex items-center gap-2"
            >
              Learn about Aetheris <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AetherisAbout = () => {
  return (
    <section id="about-aetheris" className="py-24 bg-neutral-50 dark:bg-neutral-900/50 border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 mb-8">Deep Dive</div>
            <h2 className="text-5xl md:text-7xl font-serif italic mb-12 tracking-tighter leading-[0.9]">
              Intelligence for the <br /> Physical World.
            </h2>
            <div className="space-y-8 text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
              <p>
                Aetheris is more than a model; it's a cognitive partner designed to bridge the gap between digital intelligence and physical reality. Built to power the next generation of focused digital systems, Aetheris excels at understanding local contexts, navigating complex social identities, and facilitating real-world collaboration.
              </p>
              <p>
                Whether you're building student networks or solving global connection problems, Aetheris provides the reasoning depth required for the physical world. It doesn't just process data—it understands environment, identity, and the nuances of human connection.
              </p>
            </div>
            <div className="mt-16">
              <a
                href="https://aetheris-ai-iota.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-10 py-5 bg-black text-white dark:bg-white dark:text-black rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
              >
                Try Aetheris Now <ArrowRight size={20} />
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-white dark:bg-black rounded-[40px] border border-black/5 dark:border-white/5 overflow-hidden shadow-2xl">
              <img
                src="https://picsum.photos/seed/aetheris-core/1000/1000"
                alt="Aetheris Intelligence"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-500/10 backdrop-blur-3xl rounded-full border border-emerald-500/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-serif italic text-emerald-500">v4.0</div>
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-40">Aetheris Core</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AgenticTransition = () => {
  const features = [
    {
      title: "Autonomous Agents",
      subtitle: "Agentic AI",
      description: "AI that acts as a 'digital worker.' It can use your computer, plan multi-step workflows (like building a full app or managing a project), and self-correct its own errors without human prompting.",
      label: "Experimental_V5"
    },
    {
      title: "Long-Term Cognitive Architecture",
      subtitle: "Permanent Memory",
      description: "Move beyond 'forgetful' chatbots. Upcoming models feature permanent memory that builds a deep understanding of your specific goals, preferences, and long-term projects over months of interaction.",
      label: "Experimental_V5"
    },
    {
      title: "Physical AI",
      subtitle: "Spatial Intelligence",
      description: "AI that understands the physical world. This powers humanoid robotics and spatial computing, allowing AI to navigate real-world environments and perform tactile tasks.",
      label: "Experimental_V5"
    },
    {
      title: "Recursive Reasoners",
      subtitle: "Xyther-Class",
      description: "Systems that use 'Chain-of-Thought' to verify every step of their logic before they answer, essentially 'thinking' before they 'speak' to solve graduate-level math and engineering problems.",
      label: "Experimental_V5"
    }
  ];

  return (
    <section className="py-24 bg-neutral-50 dark:bg-neutral-900/30 border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-[0.4em] opacity-40 mb-8">The Next Paradigm</div>
            <h2 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-tight">
              The Agentic Transition.
            </h2>
          </div>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-light max-w-md leading-relaxed">
            The industry is currently transitioning from "Generative AI" to "Agentic AI"—systems that don't just talk, but execute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white dark:bg-[#050505] border border-black/5 dark:border-white/5 rounded-[32px] group hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full opacity-60">
                  {item.label}
                </div>
                <div className="text-xs font-mono uppercase tracking-widest opacity-40">{item.subtitle}</div>
              </div>
              <h3 className="text-3xl font-medium mb-6 group-hover:translate-x-2 transition-transform">{item.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed text-lg">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FutureHorizons = () => {
  const promises = [
    {
      title: "Universal Translation Layer",
      description: "Breaking the language barrier in real-time, including dialects and physical sign language through video.",
      label: "Experimental_V5"
    },
    {
      title: "Cinematic Video Engine",
      description: "Generate physics-accurate, high-fidelity video content that maintains character and background consistency across long timelines.",
      label: "Experimental_V5"
    },
    {
      title: "Full-Stack Autonomy",
      description: "Describe a business idea, and Aetheris provisions the database, writes the code, and deploys the infrastructure instantly.",
      label: "Experimental_V5"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#050505] border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="text-xs font-mono uppercase tracking-[0.4em] opacity-40 mb-8">Promise Snippets</div>
          <h2 className="text-5xl md:text-8xl font-serif italic tracking-tighter leading-none">
            Future Horizons.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {promises.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-8 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4">
                <div className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 border border-black/20 dark:border-white/20 rounded-full opacity-40">
                  {item.label}
                </div>
              </div>
              <h3 className="text-2xl font-medium mb-6 pr-12">[{item.title}]</h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                {item.description}
              </p>
              <div className="mt-8 w-12 h-px bg-black/20 dark:bg-white/20 group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AetherisRoadmap = () => {
  const roadmapItems = [
    {
      quarter: "Q2 2026",
      title: "Creative Suite Alpha",
      features: ["AI PPT Maker", "Instant Website Generation", "Editorial Layout Engine"],
      description: "Transforming ideas into polished presentations and websites in seconds.",
      icon: Zap
    },
    {
      quarter: "Q3 2026",
      title: "The Xyther Engine",
      features: ["Full Stack App Generation", "Real-time Deployment", "Database Auto-Provisioning"],
      description: "Building production-ready applications through natural language.",
      icon: Cpu
    },
    {
      quarter: "2027 – 2030",
      title: "AGI (General)",
      features: ["Human-Level Reasoning", "Flexible Learning", "Cross-Domain Intelligence"],
      description: "Can learn and perform any task a human can, with flexible reasoning and common sense across all domains.",
      icon: Users
    },
    {
      quarter: "Post-2030",
      title: "ASI (Super)",
      features: ["Superhuman Intelligence", "Scientific Breakthroughs", "Collective Brainpower"],
      description: "Intelligence that surpasses the collective brainpower of humanity. Solving problems currently impossible for us.",
      icon: Globe
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#050505] border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="text-xs font-mono uppercase tracking-[0.4em] opacity-40 mb-8">Future Horizons</div>
          <h2 className="text-5xl md:text-8xl font-serif italic tracking-tighter leading-none">
            The Roadmap to <br /> Intelligence.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
          {roadmapItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-[#050505] p-8 flex flex-col h-full group hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="text-xs font-mono uppercase tracking-widest opacity-40 mb-12">{item.quarter}</div>
              <div className="mb-8 text-black dark:text-white group-hover:scale-110 transition-transform origin-left">
                <item.icon size={32} strokeWidth={1} />
              </div>
              <h3 className="text-3xl font-serif italic mb-6">{item.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-8">
                {item.description}
              </p>
              <div className="mt-auto space-y-3">
                {item.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description, icon: Icon, linkText, href }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    onClick={() => href && window.open(href, '_blank')}
    className="group p-10 border border-black/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all cursor-pointer flex flex-col h-full"
  >
    <div className="mb-8 text-black dark:text-white">
      <Icon size={32} strokeWidth={1.5} />
    </div>
    <h3 className="text-3xl font-medium mb-6 tracking-tight">{title}</h3>
    <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed font-light text-lg">{description}</p>
    <div className="mt-auto flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
      {linkText} <ArrowRight size={16} />
    </div>
  </motion.div>
);

const GlobalNodeMap = () => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1200;
    const height = 600;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();

    // Create a dot matrix for the world map
    const dots: { x: number, y: number, opacity: number }[] = [];
    const rows = 50;
    const cols = 100;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Simple algorithm to "shape" a world map
        const x = (j / cols) * width;
        const y = (i / rows) * height;

        // Randomly determine if a dot is part of a "continent"
        // This is a stylized representation
        const isLand = (
          (j > 10 && j < 25 && i > 15 && i < 35) || // North America
          (j > 15 && j < 22 && i > 35 && i < 45) || // South America
          (j > 45 && j < 60 && i > 10 && i < 30) || // Europe/Africa
          (j > 50 && j < 58 && i > 30 && i < 45) || // Africa
          (j > 60 && j < 85 && i > 10 && i < 35) || // Asia
          (j > 75 && j < 85 && i > 35 && i < 45)    // Australia
        );

        if (isLand || Math.random() < 0.02) {
          dots.push({ x, y, opacity: isLand ? 0.3 : 0.05 });
        }
      }
    }

    svg.append('g')
      .selectAll('circle')
      .data(dots)
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 1.5)
      .attr('fill', 'currentColor')
      .attr('opacity', d => d.opacity);

    // Add "Nodes" (Data Centers)
    const nodes = [
      { x: 200, y: 200, label: "San Francisco" },
      { x: 520, y: 180, label: "London" },
      { x: 750, y: 220, label: "Tokyo" },
      { x: 550, y: 380, label: "Cape Town" },
      { x: 800, y: 400, label: "Sydney" },
      { x: 220, y: 400, label: "Sao Paulo" }
    ];

    const nodeGroup = svg.append('g');

    nodeGroup.selectAll('.node-pulse')
      .data(nodes)
      .join('circle')
      .attr('class', 'node-pulse')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 4)
      .attr('fill', '#10b981')
      .append('animate')
      .attr('attributeName', 'r')
      .attr('values', '4;12;4')
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite');

    nodeGroup.selectAll('.node-core')
      .data(nodes)
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 4)
      .attr('fill', '#10b981');

    // Add connection lines
    const links = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] },
      { source: nodes[2], target: nodes[4] },
      { source: nodes[0], target: nodes[5] },
      { source: nodes[1], target: nodes[3] }
    ];

    svg.append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.2)
      .attr('stroke-dasharray', '4,4')
      .append('animate')
      .attr('attributeName', 'stroke-dashoffset')
      .attr('from', '100')
      .attr('to', '0')
      .attr('dur', '3s')
      .attr('repeatCount', 'indefinite');

  }, []);

  return (
    <section className="py-32 bg-black text-white overflow-hidden border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-500 mb-8">Network Topology</div>
            <h2 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tighter">Global <br /> Infrastructure.</h2>
            <p className="text-xl text-neutral-400 font-light leading-relaxed">
              SocialNet spans across 42 availability zones, providing low-latency access to Aetheris-4 intelligence for every connected device on Earth.
            </p>
          </div>
          <div className="flex gap-12 text-xs font-mono uppercase tracking-widest opacity-50">
            <div>Active Nodes: 12,482</div>
            <div>Global Latency: 14ms</div>
          </div>
        </div>

        <div className="relative bg-neutral-900/30 rounded-[40px] border border-white/5 p-8 md:p-16 backdrop-blur-3xl">
          <svg ref={svgRef} className="w-full h-full text-white/10" />

          <div className="absolute bottom-12 left-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "North America", status: "Optimal", color: "bg-emerald-500" },
              { label: "Europe", status: "Optimal", color: "bg-emerald-500" },
              { label: "Asia Pacific", status: "High Load", color: "bg-amber-500" },
              { label: "South America", status: "Optimal", color: "bg-emerald-500" }
            ].map((region) => (
              <div key={region.label} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${region.color}`} />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-1">{region.label}</div>
                  <div className="text-xs font-medium">{region.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
const SocialNetSection = () => {
  return (
    <section className="py-32 bg-black text-white overflow-hidden border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-500 mb-8">Infrastructure</div>
            <h2 className="text-6xl md:text-8xl font-serif italic mb-12 tracking-tighter leading-[0.9]">SocialNet</h2>
            <p className="text-xl text-neutral-400 font-light leading-relaxed mb-12">
              We build focused digital systems that solve real-world connection problems. Our student network product connects people based on location and identity — helping them discover, collaborate, and build within their real environment, not just online.
            </p>
            <div className="mb-12">
              <a
                href="https://nearby-students-rose.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black rounded-full font-semibold hover:bg-emerald-400 transition-colors"
              >
                Try SocialNet <ArrowRight size={18} />
              </a>
            </div>
            <div className="space-y-12">
              <div className="group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <h4 className="text-lg font-medium tracking-tight">Seamless Integration</h4>
                </div>
                <p className="text-neutral-500 font-light text-sm leading-relaxed pl-6 border-l border-white/10 group-hover:border-emerald-500 transition-colors">
                  Connect Aetheris directly to your social platforms with our robust API.
                </p>
              </div>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <h4 className="text-lg font-medium tracking-tight">Community Driven</h4>
                </div>
                <p className="text-neutral-500 font-light text-sm leading-relaxed pl-6 border-l border-white/10 group-hover:border-blue-500 transition-colors">
                  Join thousands of developers building on the SocialNet ecosystem.
                </p>
              </div>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  <h4 className="text-lg font-medium tracking-tight">Global Scale</h4>
                </div>
                <p className="text-neutral-500 font-light text-sm leading-relaxed pl-6 border-l border-white/10 group-hover:border-purple-500 transition-colors">
                  Deploy your AI agents globally with zero latency on our edge network.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-8 relative">
            <div className="absolute -top-12 -left-12 text-[200px] font-serif italic text-white/5 select-none pointer-events-none">01</div>
            <div className="bg-neutral-900/50 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl relative">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Live Network Status</span>
                </div>
                <div className="text-xs font-mono text-neutral-500">Uptime: 99.999%</div>
              </div>
              <SocialNetViz />
              <div className="mt-8 grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">Nodes</div>
                  <div className="text-2xl font-medium tracking-tight">12,482</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">Latency</div>
                  <div className="text-2xl font-medium tracking-tight">14ms</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">Throughput</div>
                  <div className="text-2xl font-medium tracking-tight">1.2PB/s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LegalModal = ({ isOpen, type, onClose }: { isOpen: boolean; type: string | null; onClose: () => void }) => {
  if (!isOpen || !type) return null;

  const content: Record<string, { title: string; body: React.ReactNode }> = {
    about: {
      title: "About SnyderAI",
      body: (
        <div className="space-y-6">
          <p>SnyderAI is a research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity.</p>
          <p>We are building Aetheris, a cognitive partner designed for the physical world, focusing on local contexts and real-world collaboration.</p>
          <p>Our work is guided by a commitment to safety, transparency, and the ethical development of AI systems that empower individuals and communities.</p>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <div className="space-y-6">
          <p>At SnyderAI, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.</p>
          <h4 className="font-semibold">Data Collection</h4>
          <p>We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us.</p>
          <h4 className="font-semibold">Data Usage</h4>
          <p>We use the information we collect to provide, maintain, and improve our services, and to develop new ones.</p>
          <h4 className="font-semibold">Data Protection</h4>
          <p>We implement a variety of security measures to maintain the safety of your personal information.</p>
        </div>
      )
    },
    terms: {
      title: "Terms of Use",
      body: (
        <div className="space-y-6">
          <p>By using SnyderAI's services, you agree to the following terms and conditions.</p>
          <h4 className="font-semibold">Acceptable Use</h4>
          <p>You agree not to use our services for any unlawful purpose or in any way that could damage, disable, or impair the services.</p>
          <h4 className="font-semibold">Intellectual Property</h4>
          <p>All content and materials available on our services are the property of SnyderAI or its licensors.</p>
          <h4 className="font-semibold">Limitation of Liability</h4>
          <p>SnyderAI shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our services.</p>
        </div>
      )
    }
  };

  const activeContent = content[type.toLowerCase()] || content.about;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-[#050505] border border-black/10 dark:border-white/10 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-8 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
          <h2 className="text-3xl font-serif italic">{activeContent.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
          {activeContent.body}
        </div>
        <div className="p-8 border-t border-black/5 dark:border-white/5 flex justify-end">
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Footer = ({ onOpenModal }: { onOpenModal: (type: string) => void }) => {
  return (
    <footer className="py-20 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1">
            <a href="/" className="text-2xl font-bold tracking-tighter mb-6 block">SnyderAI</a>
          </div>
          <div>
            <h5 className="font-semibold mb-6">Research</h5>
            <ul className="space-y-4 text-neutral-500 dark:text-neutral-400 text-sm">
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Overview</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Index</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Aetheris-4</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">SocialNet API</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-6">Aetheris</h5>
            <ul className="space-y-4 text-neutral-500 dark:text-neutral-400 text-sm">
              <li className="hover:text-black dark:hover:text-white cursor-pointer">For Everyone</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">For Teams</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">For Enterprise</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Aetheris Login</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-6">SocialNet</h5>
            <ul className="space-y-4 text-neutral-500 dark:text-neutral-400 text-sm">
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Documentation</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">API Reference</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Examples</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Pricing</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-6">Company</h5>
            <ul className="space-y-4 text-neutral-500 dark:text-neutral-400 text-sm">
              <li onClick={() => onOpenModal('about')} className="hover:text-black dark:hover:text-white cursor-pointer">About</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Charter</li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">Security</li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <h5 className="font-semibold mb-6">Stay Updated</h5>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 font-light">
              Receive the latest research and product updates directly in your inbox.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 dark:border-white/5 gap-6">
          <div className="flex items-center gap-6 text-sm font-medium">
            <span>SnyderAI © 2026</span>
            <span onClick={() => onOpenModal('privacy')} className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">Privacy Policy</span>
            <span onClick={() => onOpenModal('terms')} className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">Terms of Use</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">Twitter</span>
            <span className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">YouTube</span>
            <span className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">LinkedIn</span>
            <span className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer">GitHub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Playground = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const demoResponses: Record<string, string> = {
    "default": "Aetheris-4 is designed to process complex multi-modal data with unprecedented efficiency. By leveraging the SocialNet infrastructure, we've reduced latency by 40% while increasing reasoning depth.",
    "safety": "Our alignment research focuses on constitutional AI frameworks. Aetheris-4 incorporates real-time safety guardrails that prevent harmful outputs without sacrificing creative flexibility.",
    "future": "The future of SnyderAI lies in distributed intelligence. We are moving towards a world where AI isn't just a tool, but a seamless layer of the global social fabric."
  };

  const handlePrompt = (type: string) => {
    setIsTyping(true);
    setResponse('');
    let fullResponse = demoResponses[type];
    let i = 0;

    const interval = setInterval(() => {
      setResponse((prev) => prev + fullResponse.charAt(i));
      i++;
      if (i >= fullResponse.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
  };

  return (
    <section className="py-24 bg-white dark:bg-[#050505] border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tighter">Experience <br /> Aetheris.</h2>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 font-light mb-12 leading-relaxed">
              Interact with our most advanced reasoning engine. Select a topic to see how Aetheris-4 processes complex information.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handlePrompt('default')}
                disabled={isTyping}
                className="group flex items-center justify-between p-6 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all text-left"
              >
                <span className="font-medium">Explain Aetheris-4 Architecture</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handlePrompt('safety')}
                disabled={isTyping}
                className="group flex items-center justify-between p-6 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all text-left"
              >
                <span className="font-medium">Our Approach to AI Safety</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handlePrompt('future')}
                disabled={isTyping}
                className="group flex items-center justify-between p-6 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all text-left"
              >
                <span className="font-medium">The Future of Distributed AI</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="relative aspect-square md:aspect-video bg-neutral-50 dark:bg-neutral-900 rounded-[40px] border border-black/5 dark:border-white/5 p-12 flex flex-col">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest opacity-40">Aetheris-4 Output</span>
              </div>
              <div className="flex-grow font-serif italic text-2xl md:text-4xl leading-tight tracking-tight text-neutral-800 dark:text-neutral-200">
                {response || <span className="opacity-20">Select a topic to begin...</span>}
                {isTyping && <span className="inline-block w-1 h-8 bg-black dark:bg-white ml-2 animate-pulse align-middle" />}
              </div>
              <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-40">
                <span>Tokens: {response.length}</span>
                <span>Inference: 0.02s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CaseStudies = () => {
  const cases = [
    {
      industry: "Robotics",
      title: "Precision Control in Unstructured Environments",
      description: "How Aetheris-4 enables autonomous warehouse robots to navigate complex, changing landscapes with 99.9% accuracy.",
      image: "https://picsum.photos/seed/robotics/800/600",
      tags: ["Real-time Processing", "Spatial Reasoning"]
    },
    {
      industry: "Healthcare",
      title: "Diagnostic Support for Rare Pathologies",
      description: "Aetheris assists radiologists in identifying subtle anomalies in medical imaging, reducing diagnostic latency by 40%.",
      image: "https://picsum.photos/seed/healthcare/800/600",
      tags: ["Computer Vision", "High Precision"]
    },
    {
      industry: "Education",
      title: "Personalized Learning at Scale",
      description: "Implementing Aetheris-Lite in university systems to provide 24/7 personalized tutoring for over 50,000 students.",
      image: "https://picsum.photos/seed/education/800/600",
      tags: ["NLP", "Adaptive Learning"]
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#050505] border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="text-xs font-mono uppercase tracking-[0.4em] opacity-40 mb-8">Real-World Impact</div>
          <h2 className="text-5xl md:text-8xl font-serif italic tracking-tighter leading-none">
            Case Studies.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {cases.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-8 bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs font-mono uppercase tracking-widest opacity-40 mb-4">{item.industry}</div>
              <h3 className="text-2xl font-medium mb-4 group-hover:underline decoration-1 underline-offset-8">{item.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">{item.description}</p>
              <div className="flex gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 border border-black/10 dark:border-white/10 rounded-full opacity-40">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CareersPortal = () => {
  const roles = [
    { title: "Research Scientist", team: "Alignment", location: "San Francisco / Remote" },
    { title: "Distributed Systems Engineer", team: "SocialNet", location: "London / Remote" },
    { title: "Product Designer", team: "Aetheris", location: "Tokyo / Remote" },
    { title: "Safety Engineer", team: "Safety Board", location: "New York / Remote" }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#050505] border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="text-xs font-mono uppercase tracking-[0.4em] opacity-40 mb-8">Join the Mission</div>
            <h2 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-tight mb-12">
              Building the Future <br /> of Intelligence.
            </h2>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-12">
              We are a team of researchers, engineers, and designers dedicated to ensuring that AGI benefits all of humanity. Our culture is built on transparency, rigorous safety, and creative freedom.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-1 h-1 rounded-full bg-black dark:bg-white mt-3" />
                <p className="text-sm font-light">Research-first environment with a focus on long-term alignment.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1 h-1 rounded-full bg-black dark:bg-white mt-3" />
                <p className="text-sm font-light">Competitive compensation and equity in a mission-driven company.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1 h-1 rounded-full bg-black dark:bg-white mt-3" />
                <p className="text-sm font-light">Remote-first culture with global innovation hubs.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden">
              {roles.map((role, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between p-8 border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest opacity-40 mb-2">{role.team} • {role.location}</div>
                    <div className="text-2xl font-medium">{role.title}</div>
                  </div>
                  <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <button className="text-sm font-mono uppercase tracking-widest border-b border-black dark:border-white pb-2 hover:opacity-60 transition-opacity">
                View all open positions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactPortal = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      type: formData.get('type'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setFormState('success');
      } else {
        setFormState('error');
        setErrorMessage(result.error || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormState('error');
      setErrorMessage('A network error occurred. Please try again later.');
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-[#050505] border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="text-xs font-mono uppercase tracking-[0.4em] opacity-40 mb-8">Get in Touch</div>
            <h2 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-tight mb-12">
              Contact & <br /> Support Portal.
            </h2>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-12">
              Whether you're interested in enterprise solutions, media inquiries, or technical support, our team is here to help you navigate the future of AI.
            </p>

            <div className="space-y-12">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest opacity-40 mb-4">Direct Inquiries</h4>
                <a href="mailto:snyderaidevelopers@gmail.com" className="text-2xl font-medium hover:underline decoration-1 underline-offset-8">
                  snyderaidevelopers@gmail.com
                </a>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest opacity-40 mb-2">Enterprise</h4>
                  <p className="text-sm font-light">Custom solutions for large-scale deployments.</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest opacity-40 mb-2">Media</h4>
                  <p className="text-sm font-light">Press kits and interview requests.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-neutral-50 dark:bg-white/5 rounded-[40px] p-8 md:p-12 border border-black/5 dark:border-white/5">
              {formState === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mb-8">
                    <Check size={40} className="text-white dark:text-black" />
                  </div>
                  <h3 className="text-3xl font-serif italic mb-4">Message Received.</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 font-light">Our team will review your inquiry and get back to you shortly.</p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="mt-8 text-sm font-mono uppercase tracking-widest border-b border-black dark:border-white pb-2"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest opacity-40">Full Name</label>
                      <input
                        required
                        name="name"
                        type="text"
                        className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors font-light"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest opacity-40">Email Address</label>
                      <input
                        required
                        name="email"
                        type="email"
                        className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors font-light"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest opacity-40">Inquiry Type</label>
                    <select name="type" className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors font-light appearance-none">
                      <option className="bg-white dark:bg-[#050505]">Enterprise Solutions</option>
                      <option className="bg-white dark:bg-[#050505]">Media & Press</option>
                      <option className="bg-white dark:bg-[#050505]">Technical Support</option>
                      <option className="bg-white dark:bg-[#050505]">Partnerships</option>
                      <option className="bg-white dark:bg-[#050505]">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest opacity-40">Message</label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors font-light resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {formState === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-light"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="btn-primary w-full py-6 text-lg flex items-center justify-center gap-3 group"
                  >
                    {formState === 'submitting' ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onLocationChange = () => setCurrentPath(window.location.pathname);

    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const openModal = (type: string) => setModalType(type);
  const closeModal = () => setModalType(null);

  if (currentPath === '/login' && !user) {
    return <LoginPage isDark={isDark} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} onOpenModal={openModal} user={user} />


      <main>
        <Hero />
        <LogoCloud />
        <AetherisAbout />
        <AgenticTransition />
        <Playground />

        <section className="border-y border-black/10 dark:border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="border-r border-black/10 dark:border-white/10 last:border-r-0"
              >
                <FeatureCard
                  title="Aetheris for Enterprise"
                  description="Empower your team with the most advanced AI assistant, built with enterprise-grade security and privacy."
                  icon={Shield}
                  linkText="Learn more"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="border-r border-black/10 dark:border-white/10 last:border-r-0"
              >
                <FeatureCard
                  title="SocialNet Integration"
                  description="Connect your applications to the world's most powerful social AI infrastructure."
                  icon={Cpu}
                  linkText="Try SocialNet"
                  href="https://nearby-students-rose.vercel.app"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="border-r border-black/10 dark:border-white/10 last:border-r-0"
              >
                <FeatureCard
                  title="Safety & Alignment"
                  description="Our commitment to building safe and beneficial AI that aligns with human values."
                  icon={Zap}
                  linkText="Read our charter"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <SocialNetSection />
        <GlobalNodeMap />
        <ResearchIndex />
        <CaseStudies />
        <FutureHorizons />
        <AetherisRoadmap />
        <TechnicalFAQ />
        <CareersPortal />
        <ContactPortal />

        <PricingSection />

        <section className="py-32 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-serif italic mb-12">
                Join the future of AI.
              </h2>
              <div className="flex justify-center gap-6">
                <a
                  href="https://aetheris-ai-iota.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-10 py-5 text-xl"
                >
                  Get started with Aetheris
                </a>
                <button className="btn-secondary px-10 py-5 text-xl">View careers</button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer onOpenModal={openModal} />

      <AnimatePresence>
        {modalType && (
          <LegalModal
            isOpen={!!modalType}
            type={modalType}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>

      <FomoPopup />
    </div>
  );
}
