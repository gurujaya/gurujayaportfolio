"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode(!darkMode);
  // Track which section is active for animated progress bar
  const [activeSection, setActiveSection] = useState("");

  // Ref for custom cursor
  const cursorRef = useRef<HTMLDivElement>(null);

  // Intro slide logic
  const [showIntro, setShowIntro] = useState(true);
  const introSlides = [
    {
      id: 0,
      content: (
        <span className="inline-block text-4xl sm:text-6xl font-bold tracking-tight leading-snug">
          <span className="block animate-fade-in-text delay-[0ms]">hey,</span>{" "}
          <span className="block animate-fade-in-text delay-[500ms]">i'm</span>{" "}
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 animate-fade-in-text delay-[1000ms]">
            guru jayaprakash
          </span>
        </span>
      ),
    },
    {
      id: 1,
      content: (
        <>
          Aspiring <span className="font-[cursive] text-purple-400">Bioengineer</span>.
        </>
      ),
    },
    {
      id: 2,
      content: (
        <>
          Building at the intersection of{" "}
          <span className="underline underline-offset-4 decoration-indigo-500 font-mono">technology</span>,{" "}
          <span className="underline underline-offset-4 decoration-pink-500 font-serif">design</span>, and{" "}
          <span className="underline underline-offset-4 decoration-purple-500 italic">innovation</span>.
        </>
      ),
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      (async () => {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        await import('locomotive-scroll/dist/locomotive-scroll.css');

        const scrollContainer = document.querySelector('[data-scroll-container]');
        if (scrollContainer) {
          const scroll = new LocomotiveScroll({
            el: scrollContainer as HTMLElement,
            smooth: true,
          });
          return () => scroll.destroy();
        }
      })();
    }
  }, []);

  // Scroll listener to track active section for progress bar
  useEffect(() => {
    const sectionIds = ["about", "projects", "experience", "contact"];
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      let newActive = "";
      for (let i = 0; i < sectionIds.length; i++) {
        const current = document.getElementById(sectionIds[i]);
        if (current) {
          const currRect = current.getBoundingClientRect();
          const currCenter = currRect.top + currRect.height / 2;
          // Tighter threshold: center of section within 30%-70% of viewport
          if (currCenter >= windowHeight * 0.3 && currCenter <= windowHeight * 0.7) {
            newActive = sectionIds[i];
            break;
          }
        }
      }
      setActiveSection(newActive);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run on mount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Custom cursor tracking logic using ref
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    if (currentSlide < introSlides.length - 1) {
      const timer = setTimeout(() => setCurrentSlide((prev) => prev + 1), 4000);
      return () => clearTimeout(timer);
    }
    // Don't auto-exit on last slide; show "Continue" button instead
  }, [currentSlide, showIntro]);

  if (showIntro && mounted) {
    return (
      <div
        onClick={() => {
          if (currentSlide < introSlides.length - 1) {
            setCurrentSlide((prev) => prev + 1);
          }
          // Don't auto-exit on last slide; show "Continue" button instead
        }}
        className="relative h-screen w-full flex items-center justify-start px-10 bg-[#121212] text-white overflow-hidden transition-opacity duration-1000 ease-in-out"
      >
        <div className="max-w-xl animate-intro-fade-in space-y-6 transition-all duration-1000">
          <div
            key={introSlides[currentSlide].id}
            className="text-3xl sm:text-5xl font-semibold leading-tight animate-fade-in-text transition-all duration-700 transform"
          >
            {introSlides[currentSlide].content}
            {currentSlide < introSlides.length - 1 && <span className="animate-pulse">...</span>}
          </div>
          {currentSlide === introSlides.length - 1 && (
            <button
              onClick={() => setShowIntro(false)}
              className="mt-6 inline-block px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition duration-500 animate-slide-up"
            >
              Continue
            </button>
          )}
        </div>
        <button
          onClick={() => setShowIntro(false)}
          className="absolute bottom-6 right-6 text-sm text-white/60 hover:text-white underline transition"
        >
          Skip Intro
        </button>
      </div>
    );
  }

  return (
    <div
      data-scroll-container
      className={`${darkMode
        ? "text-white bg-[#121212]"
        : "text-black bg-[#f9f9f9]"
      } min-h-screen font-sans antialiased transition-colors duration-700`}
    >
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className={`px-6 py-3 rounded-full shadow-lg ring-1 ring-white/10 flex items-center gap-8 backdrop-blur-md transition-colors duration-500 ${darkMode ? "bg-black/80 text-white border border-white/10" : "bg-white/80 text-black border border-black/10"}`}>
          <nav className="flex gap-6 text-sm font-medium tracking-wide">
            <Link href="#about" className="hover:opacity-80 transition-opacity duration-300">About</Link>
            <Link href="#projects" className="hover:opacity-80 transition-opacity duration-300">Projects</Link>
            <Link href="#contact" className="hover:opacity-80 transition-opacity duration-300">Contact</Link>
          </nav>
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`w-7 h-7 flex items-center justify-center rounded-full border ${darkMode ? "border-white text-white" : "border-black text-black"} transition-colors duration-500 hover:opacity-80 relative`}
          >
            <SunIcon
              className={`absolute w-5 h-5 transition-opacity duration-500 ${darkMode ? "opacity-100" : "opacity-0"}`}
            />
            <MoonIcon
              className={`absolute w-5 h-5 transition-opacity duration-500 ${darkMode ? "opacity-0" : "opacity-100"}`}
            />
          </button>
        </div>
      </header>

      <main className="space-y-8 animate-page-fade-in">
        <section
          data-scroll
          className={`min-h-screen flex flex-col justify-center items-center text-center px-6 sm:px-16 transition-all duration-1000 ease-in-out relative ${
            darkMode
              ? "text-white bg-[#121212]"
              : "text-black bg-[#f9f9f9]"
          }`}
        >
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d6d6f5] via-[#e0d9f3] to-transparent"></div>
          <div className="relative z-10 max-w-4xl w-full flex flex-col items-center gap-6">
            <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight font-display">
              guru <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-400">jayaprakash</span>
            </h1>
            <p className="text-lg sm:text-xl font-light max-w-2xl leading-relaxed tracking-wide">
              aspiring bioengineer bridging <span className="underline underline-offset-4 decoration-purple-400">health</span>, <span className="underline underline-offset-4 decoration-pink-400">design</span>, and <span className="underline underline-offset-4 decoration-indigo-400">technology</span> with purpose.
            </p>
            <a
              href="#projects"
              className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              see what i've built
            </a>
          </div>
        </section>

        <section
          id="about"
          data-scroll
          className={`min-h-screen px-8 py-12 transition-colors duration-700 transition-all duration-1000 ease-in-out relative ${
            darkMode
              ? "text-white bg-[#121212]"
              : "text-black bg-[#f9f9f9]"
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-6 animate-slide-up transition-all duration-700 font-sans sm:font-display transition-all duration-700">
            <h2 className="text-4xl font-extrabold tracking-tight font-display transition-all duration-700 text-balance relative inline-block lowercase">
              <span className="relative z-10">about me</span>
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"></span>
            </h2>
            <p className="text-lg transition-all duration-700 whitespace-pre-line">
              hey, i'm guru 👋

              {"\n\n"}
              part creative technologist, part biomedical innovator.

              {"\n\n"}
              i vibe at the crossroads of health, design, and code — building things that are human, useful, and kinda cool.

              {"\n\n"}
              i've built wearable tech that fixes posture in real-time, launched a student-led nonprofit that grew food through hydroponics, and designed digital tools to help global students navigate the u.s. education system.

              {"\n\n"}
              from rooted together to vertex career development, every project i've led is about bridging gaps, whether in access, health, or opportunity.

              {"\n\n"}
              big on empathy. obsessed with clean ui. driven by purpose.
            </p>
          </div>
        </section>

        <section
          id="projects"
          data-scroll
          className={`min-h-screen px-8 py-12 animate-slide-up transition-colors duration-700 transition-all duration-1000 ease-in-out relative ${
            darkMode
              ? "text-white bg-[#121212]"
              : "text-black bg-[#f9f9f9]"
          }`}
        >
          <div className="max-w-6xl mx-auto space-y-12 transition-all duration-700 font-sans sm:font-display transition-all duration-700">
            <h2 className="text-4xl font-extrabold tracking-tight font-display transition-all duration-700 text-balance relative inline-block lowercase">
              <span className="relative z-10">projects</span>
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"></span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12 transition-all duration-700">
              <div className="border border-white/10 p-8 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-semibold transition-all duration-700">Portfolio Website</h3>
                <p className={`${darkMode ? "text-white/70" : "text-black/70"} mt-4 transition-all duration-700`}>Built using Next.js and Tailwind CSS. This site showcases my work and skills.</p>
              </div>
              <div className="border border-white/10 p-8 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-semibold transition-all duration-700">Posturly</h3>
                <p className={`${darkMode ? "text-white/70" : "text-black/70"} mt-4 transition-all duration-700`}>A smart posture-correcting device with real-time feedback and app integration.</p>
              </div>
              <div className="border border-white/10 p-8 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-semibold transition-all duration-700">Speedball Bracket Manager</h3>
                <p className={`${darkMode ? "text-white/70" : "text-black/70"} mt-4 transition-all duration-700`}>
                  Designed and managed an automated tournament bracket system for school-wide speedball events, increasing participation and streamlining scheduling.
                </p>
              </div>
              <div className="border border-white/10 p-8 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-semibold transition-all duration-700">Rooted Together</h3>
                <p className={`${darkMode ? "text-white/70" : "text-black/70"} mt-4 transition-all duration-700`}>
                  Led a student-run nonprofit that evolved from food drives to hydroponic farming and education. Impacted 800+ students and secured multiple grants for sustainable agriculture innovation.
                </p>
              </div>
              <div className="border border-white/10 p-8 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-semibold transition-all duration-700">Vertex Career Development</h3>
                <p className={`${darkMode ? "text-white/70" : "text-black/70"} mt-4 transition-all duration-700`}>
                  Founded a platform to help international students navigate U.S. college and career systems. Built resources and peer community to bridge the access gap.
                </p>
              </div>
              <div className="border border-white/10 p-8 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-semibold transition-all duration-700">AP Biology + Research Integration</h3>
                <p className={`${darkMode ? "text-white/70" : "text-black/70"} mt-4 transition-all duration-700`}>
                  Applied AP Bio principles in pediatric cancer research at the University of Pittsburgh, analyzing methionine restriction in brain tumor nutrition.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="experience"
          data-scroll
          className={`min-h-screen px-8 py-4 flex items-center justify-center transition-colors duration-700 transition-all duration-1000 ease-in-out relative ${
            darkMode
              ? "text-white bg-[#121212]"
              : "text-black bg-[#f9f9f9]"
          }`}
        >
          <div className="max-w-4xl w-full space-y-10 animate-slide-up text-center font-sans sm:font-display transition-all duration-700">
            <h2 className="text-4xl font-extrabold tracking-tight font-display transition-all duration-700 text-balance relative inline-block lowercase">
              <span className="relative z-10">what i've done</span>
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></span>
            </h2>
            <ul className="space-y-6 text-left text-lg leading-relaxed">
              <li className="border-l-4 pl-4 border-indigo-500">
                built wearable health tech at <span className="font-semibold">posturly</span> — merging bioengineering with design
              </li>
              <li className="border-l-4 pl-4 border-purple-500">
                researched pediatric brain cancer nutrition at <span className="font-semibold">university of pittsburgh</span>
              </li>
              <li className="border-l-4 pl-4 border-pink-500">
                placed 2nd in <span className="font-semibold">maryland deca</span> and earned national recognition at <span className="font-semibold">icdc</span>
              </li>
              <li className="border-l-4 pl-4 border-indigo-500">
                led community projects at <span className="font-semibold">rooted together</span>, scaling food drives into hydroponic systems
              </li>
              <li className="border-l-4 pl-4 border-purple-500">
                founded <span className="font-semibold">vertex career development</span> to support global students in u.s. education
              </li>
            </ul>
          </div>
        </section>

        <section
          id="contact"
          data-scroll
          className={`min-h-screen px-8 pt-4 pb-8 flex flex-col justify-center items-center text-center animate-slide-up delay-[400ms] transition-colors duration-700 transition-all duration-1000 ease-in-out relative ${
            darkMode
              ? "text-white bg-[#121212]"
              : "text-black bg-[#f9f9f9]"
          }`}
        >
          <div className="font-sans sm:font-display transition-all duration-700 w-full flex flex-col items-center">
            <h2 className="text-4xl font-extrabold tracking-tight font-display transition-all duration-700 text-balance relative inline-block underline-offset-8 mb-6 lowercase">
              <span className="relative z-10">contact</span>
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"></span>
            </h2>
            <p className="text-lg mb-8 transition-all duration-700">wanna collab, chat, or just vibe?</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href="mailto:your@email.com"
              className={`px-6 py-3 border-2 text-sm rounded-full transition font-medium flex items-center gap-2 ${
                darkMode
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4m0 0l-4 4m4-4v12" />
                <rect width="20" height="14" x="2" y="5" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                <polyline points="2,7 12,13 22,7" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              drop me an email
            </a>
            <a
              href="https://www.linkedin.com/in/gurujaya/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3 border-2 text-sm rounded-full transition font-medium flex items-center gap-2 ${
                darkMode
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75c.965 0 1.75.785 1.75 1.75s-.785 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.531-2.513-1.531 0-1.767 1.195-1.767 2.429v4.688h-3v-9h2.881v1.232h.041c.401-.76 1.379-1.561 2.837-1.561 3.036 0 3.6 2 3.6 4.591v4.738z"/>
              </svg>
              linkedin
            </a>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3 border-2 text-sm rounded-full transition font-medium flex items-center gap-2 ${
                darkMode
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.485 2 12.021c0 4.425 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.545 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.944.359.31.678.922.678 1.858 0 1.34-.012 2.421-.012 2.751 0 .267.18.579.688.481C19.137 20.196 22 16.445 22 12.021 22 6.485 17.523 2 12 2z"/>
              </svg>
              github
            </a>
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3 border-2 text-sm rounded-full transition font-medium flex items-center gap-2 ${
                darkMode
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.162 5.656c-.793.353-1.644.593-2.538.701a4.48 4.48 0 001.963-2.471 8.963 8.963 0 01-2.828 1.081A4.484 4.484 0 0016.11 4c-2.482 0-4.495 2.015-4.495 4.498 0 .353.04.697.116 1.025-3.74-.187-7.057-1.98-9.276-4.704-.387.666-.608 1.44-.608 2.267 0 1.563.796 2.942 2.006 3.751-.739-.024-1.434-.226-2.043-.567v.056c0 2.185 1.554 4.008 3.617 4.425-.378.104-.777.159-1.188.159-.291 0-.57-.028-.844-.08.57 1.779 2.224 3.073 4.186 3.107A8.982 8.982 0 012 19.54a12.688 12.688 0 006.88 2.018c8.257 0 12.779-6.841 12.779-12.778 0-.195-.005-.39-.014-.583A9.24 9.24 0 0024 4.59a8.946 8.946 0 01-2.538.696z"/>
              </svg>
              x / twitter
            </a>
            </div>
          </div>
        </section>
      </main>

      {/* Vertical section progress nav */}
      <div className="fixed top-1/2 right-6 z-50 transform -translate-y-1/2 flex flex-col items-center justify-center space-y-6">
        {["about", "projects", "experience", "contact"].map((section, index) => {
          const isActive = activeSection === section;
          return (
            <a
              key={section}
              href={`#${section}`}
              className={`relative w-4 h-4 rounded-full transition-colors duration-300 ${
                isActive ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 scale-125 shadow-md" : "bg-gray-400"
              }`}
            >
              {isActive && (
                <span className="absolute -inset-1 animate-ping rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-50"></span>
              )}
            </a>
          );
        })}
      </div>

      <footer className={`text-center p-6 mt-16 ${
        darkMode
          ? "text-white/50 border-t border-white/10 bg-[#121212]"
          : "text-black/50 border-t border-black/10 bg-[#f9f9f9]"
      }`}>
        © {new Date().getFullYear()} Guru Jayaprakash. All rights reserved.
      </footer>

      {/* Custom interactive cursor */}
      <div
        ref={cursorRef}
        id="custom-cursor"
        className="pointer-events-none fixed z-[9999] w-8 h-8 rounded-full border-2 transition-transform duration-150 ease-out mix-blend-difference"
        style={{
          transform: "translate(-9999px, -9999px)",
          borderColor: darkMode ? "#ffffff" : "#000000"
        }}
      ></div>

      <style jsx global>{`
        @keyframes fluid-1 {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          60% { opacity: 1; transform: scale(1.1) translateY(-10px); }
          100% { transform: scale(1) translateY(0); }
        }
        .animate-fluid-1 {
          animation: fluid-1 1.5s ease-out forwards;
        }

        @keyframes fluid-2 {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          60% { opacity: 1; transform: scale(1.05) translateY(-6px); }
          100% { transform: scale(1) translateY(0); }
        }
        .animate-fluid-2 {
          animation: fluid-2 1.5s ease-out forwards;
          animation-delay: 0.3s;
        }

        @keyframes fluid-3 {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); letter-spacing: -0.05em; }
          60% { opacity: 1; transform: scale(1.1) translateY(-8px); letter-spacing: 0.05em; }
          100% { transform: scale(1) translateY(0); letter-spacing: 0; }
        }
        .animate-fluid-3 {
          animation: fluid-3 1.5s ease-out forwards;
          animation-delay: 0.6s;
        }
        @keyframes stretchy {
          0% { transform: scale(0.9) translateY(10px); opacity: 0; }
          60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); }
        }
        .animate-stretchy {
          animation: stretchy 1s ease-out forwards;
        }
        .animate-stretchy-delay {
          animation: stretchy 1s ease-out forwards;
          animation-delay: 0.2s;
        }
        .animate-stretchy-delay-2 {
          animation: stretchy 1s ease-out forwards;
          animation-delay: 0.4s;
        }
        html {
          scroll-behavior: smooth;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-letter {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-left {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
        }
        .animate-fade-in-letter {
          animation: fade-in-letter 0.5s ease-out forwards;
        }
        .animate-slide-left {
          animation: slide-left 0.8s ease-out forwards;
        }
        @keyframes page-fade-in {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-page-fade-in {
          animation: page-fade-in 1s ease-out forwards;
        }
        @keyframes intro-fade-in {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-intro-fade-in {
          animation: intro-fade-in 1s ease-out forwards;
        }
        @keyframes text-slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-text-slide-up {
          animation: text-slide-up 1s ease-in-out forwards;
        }
        @keyframes slide-fade {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-fade {
          animation: slide-fade 0.8s ease-out forwards;
        }
        @keyframes fade-in-text {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-text {
          animation: fade-in-text 1.2s ease-out forwards;
        }
        #custom-cursor {
          pointer-events: none;
          will-change: transform;
          position: fixed;
        }
      `}</style>
    </div>
  );
}