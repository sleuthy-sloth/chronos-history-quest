
import React, { useState } from 'react';
import { signInWithGoogle, registerWithEmailAndPassword, logInWithEmailAndPassword } from '../services/firebase';
import { UserState } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserState) => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let user: UserState | null = null;
      if (mode === 'signup') {
        user = await registerWithEmailAndPassword(email, password, name);
      } else {
        user = await logInWithEmailAndPassword(email, password);
      }
      
      if (user) {
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
      setError(null);
      setIsLoading(true);
      try {
          const user = await signInWithGoogle();
          if (user) {
              onSuccess(user);
              onClose();
          } else {
              setError("Sign in failed. Check console or try again.");
          }
      } catch (e) {
          setError("Google Sign In Error. Please try again.");
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header Tabs */}
        <div className="flex border-b border-slate-700">
          <button 
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-4 font-serif font-bold transition-colors ${mode === 'login' ? 'bg-slate-800 text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            LOGIN
          </button>
          <button 
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-4 font-serif font-bold transition-colors ${mode === 'signup' ? 'bg-slate-800 text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            SIGN UP
          </button>
        </div>

        <div className="p-8">
            <h2 className="text-xl text-white font-bold mb-6 text-center">
                {mode === 'login' ? 'Welcome back, traveler.' : 'Begin your legacy.'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                    <div>
                        <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Legion Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                            placeholder="e.g. Scipio Africanus"
                            required
                        />
                    </div>
                )}
                
                <div>
                    <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                        placeholder="senate@rome.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-bold text-center bg-red-900/20 p-2 rounded border border-red-900/50">{error}</p>}

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : (mode === 'login' ? 'Enter' : 'Enlist')}
                </button>
            </form>

            <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-slate-700 flex-1" />
                <span className="text-slate-500 text-xs">OR</span>
                <div className="h-px bg-slate-700 flex-1" />
            </div>

            <button 
                onClick={handleGoogle}
                type="button"
                disabled={isLoading}
                className="w-full py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                 <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                 Continue with Google
            </button>
            
            <button 
                onClick={onClose}
                className="w-full mt-4 text-slate-500 text-sm hover:text-white"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
