import Link from "next/link";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  // State for user information
  

  return (
    <main className="min-h-screen bg-black text-white pt-10">


      {/* Hero Section */}
      
      <HeroSection />


      {/* Developer Tools Section */}
      <section className="py-12 px-8 md:px-16">
        <h2 className="text-2xl font-semibold text-center mb-12">Developer Tools</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tool 1: AI Chat */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="text-blue-400 mb-4 text-4xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">AI Chat</h3>
            <p className="text-gray-400 mb-4">Get instant coding help</p>
            <span className="bg-blue-800 text-xs text-white px-2 py-1 rounded-md">Powered by Gemini</span>
          </div>

          {/* Tool 2: Code Explainer */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="text-blue-400 mb-4 text-4xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Code Explainer</h3>
            <p className="text-gray-400 mb-4">Understand complex code snippets instantly</p>
            <span className="bg-blue-800 text-xs text-white px-2 py-1 rounded-md">AI-Powered</span>
          </div>

          {/* Tool 3: Tech News */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="text-blue-400 mb-4 text-4xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8m-6 12l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Tech News</h3>
            <p className="text-gray-400 mb-4">Stay updated with latest tech trends</p>
            <span className="bg-blue-800 text-xs text-white px-2 py-1 rounded-md">Real-time</span>
          </div>

          {/* Tool 4: JSON Formatter */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="text-blue-400 mb-4 text-4xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">JSON Formatter</h3>
            <p className="text-gray-400 mb-4">Beautify and validate JSON with error highlighting</p>
            <span className="bg-blue-800 text-xs text-white px-2 py-1 rounded-md">Client-Side</span>
          </div>

          {/* Tool 5: API Tester */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="text-blue-400 mb-4 text-4xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">API Tester</h3>
            <p className="text-gray-400 mb-4">Test API endpoints with ease</p>
            <span className="bg-blue-800 text-xs text-white px-2 py-1 rounded-md">REST & GraphQL</span>
          </div>

          {/* Tool 6: Code Runner */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="text-blue-400 mb-4 text-4xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Code Runner</h3>
            <p className="text-gray-400 mb-4">Run code in browser</p>
            <span className="bg-blue-800 text-xs text-white px-2 py-1 rounded-md">Multi-language</span>
          </div>
        </div>
      </section>
      <div className="flex justify-center p-2"><Link href={"/tools"}><button className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200">View More</button></Link></div>

      {/* Why Choose Section */}
      <section className="py-16 px-8 md:px-16 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-400">Why Choose DevToolBox?</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Built by developers, for developers - with focus on speed, security, and simplicity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all">
            <div className="text-blue-400 mb-4 p-3 bg-blue-900 bg-opacity-20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Lightning Fast</h3>
            <p className="text-gray-400">All tools work client-side for instant results with no loading delays</p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all">
            <div className="text-blue-400 mb-4 p-3 bg-blue-900 bg-opacity-20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Secure</h3>
            <p className="text-gray-400">Your data never leaves your browser - complete privacy guaranteed</p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all">
            <div className="text-blue-400 mb-4 p-3 bg-blue-900 bg-opacity-20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Open Source</h3>
            <p className="text-gray-400">Community-driven development with transparent code and contributing options</p>
          </div>

          {/* Feature 4 (New) */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all">
            <div className="text-blue-400 mb-4 p-3 bg-blue-900 bg-opacity-20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">All-in-One</h3>
            <p className="text-gray-400">Everything you need in one place - no more switching between different tools</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-8 md:px-16 bg-black" id="contact">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-400">Get In Touch</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Have questions or suggestions? We&apos;d love to hear from you!
          </p>

          <div className="flex justify-center">
            {/* Contact Form */}
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 min-w-[380px]">
              <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="How can we help?"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 w-full md:w-auto"
                >
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>


    </main>
  );
}