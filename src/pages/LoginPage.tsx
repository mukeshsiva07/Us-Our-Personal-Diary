import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diaryService } from '../api/diaryService';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await diaryService.login(username.trim(), password);
      if (res.success) {
        navigate('/', { replace: true });
      } else {
        setErrorMessage("That username or password isn't right — try again.");
      }
    } catch {
      setErrorMessage("Something unexpected happened. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment-100 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Delicate background ambient marks */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-soul-subtle/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-anne-subtle/60 blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-white border border-parchment-300 rounded-3xl p-8 sm:p-10 shadow-sm relative z-10">
        {/* Quiet header & wordmark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-parchment-100 border border-parchment-300 text-soul-dark mb-4">
            <Lock className="w-5 h-5 stroke-[1.75]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink-900 tracking-tight">
            Copiko & Milo
          </h1>
          <p className="text-xs text-ink-500 font-sans tracking-wide mt-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-soul" />
            <span>Private Sanctuary · Two Hearts, One Journey</span>
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-700 mb-1.5 tracking-wide">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. muke_jovi"
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-parchment-50 border border-parchment-300 text-ink-900 placeholder:text-ink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-soul/30 focus:border-soul transition-all text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-700 mb-1.5 tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-parchment-50 border border-parchment-300 text-ink-900 placeholder:text-ink-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-soul/30 focus:border-soul transition-all text-sm font-sans"
            />
          </div>

          {/* Inline error message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50/80 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in duration-150">
              {errorMessage}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-ink-900 hover:bg-ink-800 active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Unlock Diary</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-parchment-200">
          <p className="text-[11px] text-ink-400 font-sans">
            Only for Mukesh & Anne · Protected with love
          </p>
        </div>
      </div>
    </div>
  );
};

