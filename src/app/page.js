import Link from "next/link";

export const metadata = {
  title: "SCANOVA - AR Experiences Made Simple",
  description:
    "Create custom AR keychain experiences and sticker AR art in minutes. No technical skills required.",
};

export default function HomePage() {
  return (
<div className="h-dvh box-border overflow-y-auto bg-linear-to-b from-zinc-950 to-zinc-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/50 border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold font-serif tracking-widest">SCANOVA</div>
          <div className="flex gap-6 items-center">
            <Link
              href="/create"
              className="px-4 py-2 rounded-lg hover:bg-zinc-800/50 transition text-sm"
            >
              Create
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition text-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="space-y-6 mb-12">
          <h1 className="text-6xl md:text-7xl font-serif font-bold tracking-tight leading-tight">
            Augmented Reality{" "}
            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Experiences
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Transform your printed products into interactive 3D AR experiences. Create custom keychains and sticker art in minutes—no technical skills required.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/create"
            className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Create AR Experience →
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 border border-zinc-600 rounded-full font-bold hover:bg-zinc-800/50 transition-all"
          >
            Learn More
          </Link>
        </div>

        {/* Hero Image Placeholder */}
        <div className="relative w-full aspect-video max-w-4xl mx-auto rounded-2xl bg-linear-to-br from-cyan-500/20 to-purple-500/20 border border-zinc-700/50 flex items-center justify-center mb-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-zinc-400">AR Experience Preview</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-800">
        <h2 className="text-4xl font-serif font-bold mb-16 text-center">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Upload Your Design",
              description: "Add your custom image that will trigger the AR experience.",
              icon: "📤",
            },
            {
              step: "02",
              title: "Add 3D Content",
              description: "Include a 3D model (.glb/.gltf) or generate procedural art with custom text.",
              icon: "🎭",
            },
            {
              step: "03",
              title: "Generate QR Code",
              description: "Get a QR code to print on your product. Scan to activate AR.",
              icon: "📲",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-8 rounded-2xl bg-zinc-800/20 border border-zinc-700/50 hover:border-cyan-500/30 transition group"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-sm text-cyan-400 font-mono font-bold mb-2">
                Step {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-800">
        <h2 className="text-4xl font-serif font-bold mb-16 text-center">Powerful Features</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "🚀", title: "Lightning Fast", desc: "Instant AR loading with optimized delivery" },
            {
              icon: "📊",
              title: "Track Scans",
              desc: "Analytics dashboard to monitor engagement",
            },
            {
              icon: "🎯",
              title: "Multi-Platform",
              desc: "Works on iOS, Android, and web browsers",
            },
            {
              icon: "🔒",
              title: "Secure",
              desc: "Enterprise-grade security and privacy",
            },
            {
              icon: "🎨",
              title: "Customizable",
              desc: "Full control over 3D models and effects",
            },
            {
              icon: "♻️",
              title: "Eco-Friendly",
              desc: "Digital AR replaces physical catalogs",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-lg bg-zinc-800/10 border border-zinc-700/30 hover:border-cyan-500/20 transition"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h4 className="font-bold mb-1">{feature.title}</h4>
                  <p className="text-sm text-zinc-400">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-800">
        <h2 className="text-4xl font-serif font-bold mb-16 text-center">Simple Pricing</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              name: "AR Keychain",
              price: "₹499",
              desc: "Custom image-triggered AR",
              features: [
                "Custom upload & message",
                "QR code generation",
                "3D procedural art",
                "Scan analytics",
              ],
            },
            {
              name: "Sticker AR",
              price: "₹999",
              desc: "Advanced sticker AR experiences",
              features: [
                "Multiple format support",
                "Custom 3D model upload",
                "Advanced targeting",
                "Priority support",
              ],
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl border ${
                i === 1
                  ? "bg-cyan-500/10 border-cyan-500/50"
                  : "bg-zinc-800/20 border-zinc-700/50"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-zinc-400 mb-6">{plan.desc}</p>
              <div className="text-4xl font-bold mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <span className="text-cyan-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-bold transition ${
                  i === 1
                    ? "bg-white text-black hover:bg-zinc-100"
                    : "bg-zinc-700 hover:bg-zinc-600"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-800">
        <div className="bg-linear-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">Ready to Create?</h2>
          <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
            Start building your first AR experience today. It only takes a few minutes.
          </p>
          <Link
            href="/create"
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Create AR Experience Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-800 text-center text-zinc-500 text-sm">
        <p>© 2026 SCANOVA. All rights reserved.</p>
      </footer>
    </div>
  );
}