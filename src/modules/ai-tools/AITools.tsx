import React, { useState } from 'react';
import { Sparkles, MessageSquare, FileText, Send, Loader2, Copy, Check, Hash, Mail, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../../services/gemini';

const toolTypes = [
  { id: 'caption', label: 'Caption Sosmed', icon: MessageSquare, description: 'Buat caption Instagram, TikTok, atau FB yang menarik.' },
  { id: 'copywriting', label: 'Copywriting', icon: FileText, description: 'Teks persuasif untuk jualan atau landing page.' },
  { id: 'email', label: 'Email Marketing', icon: Mail, description: 'Template email untuk promo atau newsletter.' },
  { id: 'article', label: 'Artikel Meta SEO', icon: Hash, description: 'Artikel pendek yang ramah mesin pencari.' },
];

export default function AITools() {
  const [selectedTool, setSelectedTool] = useState(toolTypes[0].id);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const toolLabel = toolTypes.find(t => t.id === selectedTool)?.label || selectedTool;
      const result = await geminiService.generateMarketingContent(toolLabel, input);
      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput('Maaf, terjadi kesalahan saat menghasilkan konten. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-indigo-600" />
          AI Marketing Content
        </h1>
        <p className="text-slate-500">Buat konten pemasaran profesional dalam hitungan detik.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {toolTypes.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedTool === tool.id 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500/20' 
                  : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={`p-2 rounded-lg ${selectedTool === tool.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <tool.icon size={18} />
                </div>
                <span className={`font-bold ${selectedTool === tool.id ? 'text-indigo-900' : 'text-slate-700'}`}>{tool.label}</span>
              </div>
              <p className="text-xs text-slate-500 ml-11">{tool.description}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <label className="block text-sm font-bold text-slate-700">Apa yang ingin Anda promosikan?</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Contoh: Promo Kopi Susu Gula Aren diskon 20% untuk mahasiswa di akhir pekan..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !input.trim()}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sedang Menghasilkan...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Hasilkan Konten
                </>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Hasil Konten</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors flex items-center gap-2 text-xs font-medium"
                    >
                      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                    {output}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
