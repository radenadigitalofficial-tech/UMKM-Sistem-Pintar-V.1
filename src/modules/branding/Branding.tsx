import React, { useState } from 'react';
import { Palette, Send, Loader2, Sparkles, Volume2, Quote, Type, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../../services/gemini';

export default function Branding() {
  const [description, setDescription] = useState('');
  const [voiceGuide, setVoiceGuide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsLoading(true);
    try {
      const result = await geminiService.generateBrandVoice(description);
      setVoiceGuide(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Palette className="text-indigo-600" />
          Brand Identity & Voice
        </h1>
        <p className="text-slate-500">Tentukan karakter unik bisnis Anda untuk komunikasi yang konsisten.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-2">
            <Sparkles size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Bangun Suara Brand Anda</h2>
          <p className="text-slate-500 text-sm">
            Ceritakan tentang bisnis Anda, siapa target audiensnya, dan apa nilai utamanya. AI akan menyusun panduan gaya komunikasi untuk Anda.
          </p>
          <div className="relative mt-6">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Toko kue artisan yang menggunakan bahan organik. Targetnya adalah ibu muda yang peduli kesehatan dan kualitas..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-center"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !description.trim()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all mx-auto shadow-lg shadow-indigo-500/20"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Palette size={18} />}
            {isLoading ? 'Sedang Menyusun...' : 'Buat Panduan Brand Voice'}
          </button>
        </div>

        <AnimatePresence>
          {voiceGuide && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-slate-100"
            >
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-indigo-600">
                    <Volume2 size={20} />
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Nada Bicara (Tone)</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{voiceGuide.tone}</p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-indigo-600">
                    <Type size={20} />
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Gaya Komunikasi</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{voiceGuide.style}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Quote size={18} className="text-indigo-400" />
                    Frasa Kunci (Key Phrases)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {voiceGuide.keyPhrases.map((phrase: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => copyText(phrase, `phrase-${i}`)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-2"
                      >
                        {phrase}
                        {copied === `phrase-${i}` ? <Check size={12} /> : <Copy size={12} className="opacity-40" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-4">Contoh Penggunaan</h3>
                  <div className="space-y-4">
                    {voiceGuide.examples.map((ex: string, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl text-sm text-slate-600 border-l-4 border-indigo-200">
                        "{ex}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
