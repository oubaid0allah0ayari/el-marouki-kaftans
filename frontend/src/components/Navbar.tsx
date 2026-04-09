"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/98 backdrop-blur-md shadow-md border-b border-border"
          : "bg-background/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <span className="font-display text-xl md:text-2xl font-bold text-primary tracking-wide group-hover:text-burgundy-light transition-colors duration-300">
              El Marouki
            </span>
            <span className="font-elegant text-xs md:text-sm text-accent tracking-[0.3em] uppercase -mt-1">
              Kaftan Collection
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className="relative font-body text-sm tracking-wider uppercase transition-colors duration-300 group"
              >
                <span
                  className={
                    isActive(link.to)
                      ? "text-primary font-semibold"
                      : "text-muted-foreground group-hover:text-primary"
                  }
                >
                  {link.label}
                </span>
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    isActive(link.to) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-foreground transition-all duration-300 origin-center ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-foreground transition-all duration-300 ${
                  isOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-foreground transition-all duration-300 origin-center ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen
            ? "max-h-64 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 bg-background/98 backdrop-blur-md border-t border-border">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`font-body text-base tracking-wider uppercase py-3 px-4 rounded transition-all duration-300 ${
                  isActive(link.to)
                    ? "text-primary font-semibold bg-secondary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
