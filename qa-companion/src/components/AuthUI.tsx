import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { ShieldCheck } from 'lucide-react'

export default function AuthUI() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-12">
      <div className="bg-ia-blue p-3 rounded-xl mb-4 shadow-lg shadow-ia-blue/30">
        <ShieldCheck className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-xl font-bold mb-2 text-center text-slate-800">QA Companion</h1>
      <p className="text-sm text-slate-500 mb-8 text-center">Sign in with your Intern credentials</p>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-ia-blue focus:border-ia-blue outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-ia-blue focus:border-ia-blue outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ia-blue hover:bg-ia-blue/90 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <a
          href="/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ia-blue/60 hover:text-ia-blue underline underline-offset-2 transition-colors"
        >
          Privacy Policy
        </a>
        <span className="text-xs text-slate-300 mx-2">|</span>
        <a
          href="/privacy.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ia-blue/60 hover:text-ia-blue underline underline-offset-2 transition-colors"
        >
          Terms of Service
        </a>
      </div>
    </div>
  )
}
