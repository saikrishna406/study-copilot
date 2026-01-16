"use client";

import { Sparkles, Twitter, Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">StudyCopilot</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            The AI-powered study companion that helps you learn smarter, faster, and better. Turn chaos into mastery.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} />
                            <SocialLink href="#" icon={<Github className="w-4 h-4" />} />
                            <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><FooterLink href="#">Features</FooterLink></li>
                            <li><FooterLink href="#">Pricing</FooterLink></li>
                            <li><FooterLink href="#">Testimonials</FooterLink></li>
                            <li><FooterLink href="#">Integration</FooterLink></li>
                            <li><FooterLink href="#">Changelog</FooterLink></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><FooterLink href="#">About Us</FooterLink></li>
                            <li><FooterLink href="#">Careers</FooterLink></li>
                            <li><FooterLink href="#">Blog</FooterLink></li>
                            <li><FooterLink href="#">Privacy Policy</FooterLink></li>
                            <li><FooterLink href="#">Terms of Service</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="font-semibold text-lg mb-6">Stay Updated</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            Get the latest study tips and product updates delivered to your inbox.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 placeholder:text-slate-600"
                            />
                            <button className="bg-white text-black rounded-lg px-3 py-2 hover:bg-slate-200 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} StudyCopilot Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="inline-block relative hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-px after:bottom-0 after:left-0 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full"
        >
            {children}
        </a>
    );
}
