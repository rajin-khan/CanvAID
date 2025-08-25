// src/pages/SettingsPage.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useCourseStore from '../store/courseStore';
import { KeyRound, LogOut, Save, University } from 'lucide-react';
// --- REMOVED: supportedInstitutions import ---

const SettingsPage = () => {
  const { apiKeys, saveCredentials, logout } = useCourseStore();

  const [canvasKey, setCanvasKey] = useState(apiKeys.canvas || '');
  const [groqKey, setGroqKey] = useState(apiKeys.groq || '');
  // --- REMOVED: institution state variables ---
  
  const [isLoggedIn, setIsLoggedIn] = useState(!!apiKeys.canvas && !!apiKeys.groq);

  // --- REMOVED: useEffect for setting institution state ---

  const handleSave = () => {
    // --- MODIFIED: Simplified save logic ---
    if (!canvasKey.trim() || !groqKey.trim()) {
      toast.error("Both API keys are required.");
      return;
    }

    saveCredentials({ canvas: canvasKey, groq: groqKey });
    setIsLoggedIn(true);
    toast.success("Settings saved successfully! You can now navigate to the dashboard.", {
      duration: 4000
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">Settings</h1>
        <p className="text-neutral-300 mt-1">Manage your API keys to connect CanvAID.</p>
      </div>

      <div className="bg-rich-slate/50 border border-moonstone/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-neutral-100 flex items-center">
          <KeyRound className="w-6 h-6 mr-3 text-soft-lavender"/>
          Connection Details
        </h2>
        <p className="text-sm text-neutral-400 mt-2">
          Your keys are stored securely in your browser's local storage and are never sent to our servers.
        </p>
        
        <div className="space-y-6 mt-6">
          {/* --- MODIFIED: Replaced dropdown with static text --- */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-1">
              <University className="inline w-4 h-4 mr-2" />
              Connected Institution
            </label>
            <div className="block w-full bg-moonstone/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-neutral-100">
              North South University
            </div>
             <p className="text-xs text-neutral-500 mt-1">This application is configured for a specific institution.</p>
          </div>
          {/* --- END MODIFICATION --- */}

          <div>
            <label htmlFor="canvas-key" className="block text-sm font-medium text-neutral-200">Canvas API Key</label>
            <input 
              type="password"
              id="canvas-key"
              value={canvasKey}
              onChange={(e) => setCanvasKey(e.target.value)}
              placeholder="Paste your Canvas Access Token here"
              className="mt-1 block w-full bg-moonstone/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-neutral-100 focus:ring-2 focus:ring-soft-lavender/50 focus:border-soft-lavender"
            />
             <p className="text-xs text-neutral-400 mt-1">
                You can generate a new key from your Canvas Account → Settings → Approved Integrations.
            </p>
          </div>
          <div>
            <label htmlFor="groq-key" className="block text-sm font-medium text-neutral-200">Groq API Key</label>
            <input 
              type="password"
              id="groq-key"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="Paste your Groq API Key here"
              className="mt-1 block w-full bg-moonstone/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-neutral-100 focus:ring-2 focus:ring-soft-lavender/50 focus:border-soft-lavender"
            />
            <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-soft-lavender mt-1">
              Get your free key from the Groq console.
            </a>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center justify-center px-5 py-2.5 font-semibold text-white rounded-lg transition-all duration-300 bg-linear-to-r from-violet-500 to-pink-500 hover:shadow-lg hover:shadow-violet-500/30 hover:translate-y-[-1px] focus:ring-4 focus:ring-violet-500/40"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </button>
        </div>
      </div>

      {isLoggedIn && (
        <div className="bg-rich-slate/50 border border-moonstone/50 rounded-xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-neutral-100">Log Out</h2>
            <p className="text-sm text-neutral-400 mt-1">This will clear your API keys from this browser.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 font-semibold text-orange-200 rounded-lg transition-all duration-300 bg-orange-600/20 border border-orange-400/30 hover:bg-orange-500/30 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-2"/>
            Log Out
          </button>
        </div>
      )}

    </motion.div>
  );
};

export default SettingsPage;