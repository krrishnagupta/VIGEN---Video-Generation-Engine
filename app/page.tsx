import Image from "next/image";
import Link from "next/link";
import { 
  Video, CalendarDays, Mail, Instagram, Youtube, 
  Sparkles, Zap, ArrowRight, Play, CheckCircle2, 
  BarChart3, Clock, Layers, Star,
  Twitter, Linkedin, Github
} from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050510] text-zinc-100 font-sans selection:bg-purple-500/30 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-pink-900/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050510]/80 backdrop-blur-md">
          <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">VIGEN</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
              <Link href="#integrations" className="hover:text-white transition-colors">Integrations</Link>
              <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link href="/signup" className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium flex items-center justify-center hover:bg-zinc-200 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vigen 2.0 is now live</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
                Generate & Schedule <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  AI Viral Short Videos
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                The ultimate SaaS platform to automatically craft stunning short-form content and schedule it perfectly across YouTube, Instagram, TikTok, and Email.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity w-full sm:w-auto justify-center shadow-[0_0_30px_-5px_rgba(147,51,234,0.5)]">
                  Start Creating for Free <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="h-12 px-8 rounded-full bg-white/5 text-white font-medium flex items-center gap-2 hover:bg-white/10 transition-colors border border-white/10 w-full sm:w-auto justify-center">
                  <Play className="w-4 h-4 fill-white flex-shrink-0" /> Watch Demo
                </button>
              </div>
              
              <div className="mt-12 flex items-center justify-center gap-4 text-sm text-zinc-500 font-medium">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</div>
                <div className="hidden sm:flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 14-day free trial</div>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="mt-20 container mx-auto px-4 lg:px-8 relative">
              <div className="relative rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm shadow-2xl overflow-hidden ring-1 ring-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent z-10 pointer-events-none" />
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="p-6 md:p-8 aspect-video md:aspect-[21/9] flex items-center justify-center relative overflow-hidden">
                  {/* Abstract dashboard UI */}
                  <div className="absolute inset-0 flex">
                    <div className="w-64 border-r border-white/5 p-4 hidden md:block">
                      <div className="h-8 w-32 bg-white/5 rounded-md mb-8"></div>
                      <div className="space-y-3">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-6 w-full bg-white/5 rounded-md"></div>)}
                      </div>
                    </div>
                    <div className="flex-1 p-8 grid grid-cols-3 gap-6">
                      <div className="col-span-2 space-y-6">
                        <div className="h-32 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/5"></div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="h-48 rounded-xl bg-white/5 border border-white/5"></div>
                          <div className="h-48 rounded-xl bg-white/5 border border-white/5"></div>
                        </div>
                      </div>
                      <div className="col-span-1 space-y-6">
                        <div className="h-full rounded-xl bg-white/5 border border-white/5"></div>
                      </div>
                    </div>
                  </div>
                  <div className="z-10 bg-black/80 backdrop-blur-md border border-white/10 text-white px-6 py-4 rounded-xl flex items-center gap-4 shadow-2xl animate-pulse">
                    <Sparkles className="text-purple-400 w-6 h-6" />
                    <div>
                      <div className="font-semibold">Generating Video...</div>
                      <div className="text-sm text-zinc-400">Applying AI voiceover and captions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Platforms Bar */}
          <section className="py-10 border-y border-white/5 bg-white/[0.02]">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-6">Publish Everywhere Instantly</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
                <div className="flex items-center gap-2 text-xl font-bold font-serif"><Youtube className="w-8 h-8 text-white" /> YouTube Shorts</div>
                <div className="flex items-center gap-2 text-xl font-bold font-sans"><Instagram className="w-8 h-8 text-white" /> Instagram Reels</div>
                <div className="flex items-center gap-2 text-xl font-bold font-sans"><TikTokIcon className="w-8 h-8 text-white" /> TikTok</div>
                <div className="flex items-center gap-2 text-xl font-bold font-sans"><Mail className="w-8 h-8 text-white" /> Email Newsletters</div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-24 lg:py-32 relative">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Your Content Engine on Autopilot</h2>
                <p className="text-zinc-400 text-lg">Stop worrying about what to post. Vigen handles the creation, editing, and scheduling so you can focus on growing.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI Video Generation</h3>
                  <p className="text-zinc-400 leading-relaxed">Turn text prompts, blog posts, or URLs into engaging short videos with AI avatars, voiceovers, and dynamic B-roll in seconds.</p>
                </div>

                {/* Feature 2 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Smart Auto-Scheduling</h3>
                  <p className="text-zinc-400 leading-relaxed">Plan months of content at once. Our AI determines the best time to post for your specific audience across all platforms.</p>
                </div>

                {/* Feature 3 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Omnichannel Distribution</h3>
                  <p className="text-zinc-400 leading-relaxed">Create once, publish everywhere. Vigen automatically formats and optimizes your videos for TikTok, Reels, Shorts, and Email.</p>
                </div>

                {/* Feature 4 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
                  <p className="text-zinc-400 leading-relaxed">Track views, engagement, and conversions in one unified dashboard. Let AI discover what content performs best.</p>
                </div>

                {/* Feature 5 */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors group lg:col-span-2">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3">Save 20+ Hours Weekly</h3>
                      <p className="text-zinc-400 leading-relaxed">Content creators and marketers spend an average of 4 hours per video. Vigen reduces that to 4 minutes.</p>
                      <ul className="mt-6 space-y-2">
                        <li className="flex items-center gap-2 text-sm text-zinc-300"><CheckCircle2 className="w-4 h-4 text-orange-400"/> No editing skills required</li>
                        <li className="flex items-center gap-2 text-sm text-zinc-300"><CheckCircle2 className="w-4 h-4 text-orange-400"/> Infinite content library</li>
                        <li className="flex items-center gap-2 text-sm text-zinc-300"><CheckCircle2 className="w-4 h-4 text-orange-400"/> Automated trend spotting</li>
                      </ul>
                    </div>
                    <div className="bg-black/50 rounded-xl p-4 border border-white/10 h-full flex flex-col justify-center">
                       <div className="flex items-center justify-between mb-4">
                         <span className="text-xs font-medium text-zinc-500">Upcoming Posts</span>
                         <span className="text-xs text-purple-400 font-medium">+ Add New</span>
                       </div>
                       <div className="space-y-3">
                         <div className="h-12 bg-white/5 rounded-lg border border-white/5 flex items-center px-3 gap-3">
                           <Youtube className="w-4 h-4 text-red-500" />
                           <div className="h-2 w-24 bg-white/20 rounded"></div>
                           <div className="h-4 w-12 bg-purple-500/20 text-purple-400 text-[10px] rounded flex items-center justify-center ml-auto">Scheduled</div>
                         </div>
                         <div className="h-12 bg-white/5 rounded-lg border border-white/5 flex items-center px-3 gap-3">
                           <Instagram className="w-4 h-4 text-pink-500" />
                           <div className="h-2 w-32 bg-white/20 rounded"></div>
                           <div className="h-4 w-12 bg-blue-500/20 text-blue-400 text-[10px] rounded flex items-center justify-center ml-auto">Generating</div>
                         </div>
                         <div className="h-12 bg-white/5 rounded-lg border border-white/5 flex items-center px-3 gap-3">
                           <TikTokIcon className="w-4 h-4 text-white" />
                           <div className="h-2 w-20 bg-white/20 rounded"></div>
                           <div className="h-4 w-12 bg-zinc-500/20 text-zinc-400 text-[10px] rounded flex items-center justify-center ml-auto">Draft</div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works / Stepper */}
          <section id="how-it-works" className="py-24 lg:py-32 bg-white/[0.01] border-y border-white/5">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How Vigen Works</h2>
                <p className="text-zinc-400 text-lg">From zero to viral in three simple steps.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-blue-500/0"></div>

                {/* Step 1 */}
                <div className="relative text-center">
                  <div className="w-24 h-24 mx-auto bg-[#050510] border-2 border-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(147,51,234,0.3)] relative z-10">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Input your idea</h3>
                  <p className="text-zinc-400 text-sm">Type a prompt, paste a blog URL, or provide a script. Our AI expands it into a compelling storyboard.</p>
                </div>

                {/* Step 2 */}
                <div className="relative text-center">
                  <div className="w-24 h-24 mx-auto bg-[#050510] border-2 border-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] relative z-10">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-400">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI Generation</h3>
                  <p className="text-zinc-400 text-sm">Vigen generates visuals, applies realistic AI voiceovers, adds trendy captions, and syncs to music.</p>
                </div>

                {/* Step 3 */}
                <div className="relative text-center">
                  <div className="w-24 h-24 mx-auto bg-[#050510] border-2 border-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] relative z-10">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-400">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Auto-Schedule</h3>
                  <p className="text-zinc-400 text-sm">Approve the video and let Vigen automatically publish it across all your linked social channels at the perfect time.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 lg:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20" />
            <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-4xl">
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-3xl p-8 md:p-16 border border-white/10 text-center backdrop-blur-md">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to dominate the algorithm?</h2>
                <p className="text-xl text-purple-200/70 mb-10 max-w-2xl mx-auto">
                  Join 10,000+ creators and brands who are scaling their reach without scaling their effort.
                </p>
                <Link href="/signup" className="inline-flex h-14 px-10 rounded-full bg-white text-black font-semibold text-lg items-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg">
                  Start Your Free Trial <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="mt-6 text-sm text-purple-200/50">14-day free trial. Cancel anytime.</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#020205] pt-16 pb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
              <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Video className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold text-xl tracking-tight">VIGEN</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mb-6">
                  The all-in-one AI platform to generate, edit, and schedule short-form videos for YouTube, Instagram, TikTok, and Email.
                </p>
                <div className="flex items-center gap-4 text-zinc-400">
                  <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                  <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Product</h4>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">AI Generator</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Auto-Scheduler</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Templates</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Integrations</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Resources</h4>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">API Docs</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Community</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Company</h4>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">About</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
              <p>&copy; {new Date().getFullYear()} Vigen Inc. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> System Status: Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
