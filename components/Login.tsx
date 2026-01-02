
import React, { useState } from 'react';
import { JellyfinAuth } from '../types';

interface LoginProps {
  onLogin: (auth: JellyfinAuth) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = serverUrl.replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/Users/AuthenticateByName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Emby-Authorization': `MediaBrowser Client="VidioDiJour", Device="Web", DeviceId="VDJ-Auth", Version="1.0.0"`
        },
        body: JSON.stringify({ Username: username, Pw: password })
      });

      if (!response.ok) throw new Error('Authentication failed. Check your credentials.');

      const data = await response.json();
      onLogin({
        serverUrl: baseUrl,
        accessToken: data.AccessToken,
        userId: data.SessionInfo.UserId,
        username: data.SessionInfo.UserName
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="bg-[#1a1d29]/90 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-xl">
        <h2 className="font-serif text-3xl text-white mb-2">Connect to Vidio</h2>
        <p className="text-white/40 text-sm mb-8 uppercase tracking-widest">Enter your Jellyfin credentials</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Server URL</label>
            <input 
              type="url" 
              placeholder="https://jellyfin.yourdomain.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Username</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs italic">{error}</p>}

          <button 
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-cyan-400 transition-all disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
