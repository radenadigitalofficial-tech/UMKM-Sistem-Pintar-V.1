import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Check, 
  MessageSquare, 
  Mail, 
  FileText, 
  Target,
  Send,
  PenTool,
  Globe,
  Loader2,
  Instagram,
  Facebook,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../../lib/utils';

type ContentType = 'sosmed' | 'copywriting' | 'email' | 'seo';

const TONES = ['Santai', 'Formal', 'Persuasif', 'Lucu', 'Sangat Antusias'];
const PLATFORMS = {
  sosmed: ['Instagram', 'TikTok', 'Facebook', 'Twitter'],
  copywriting: ['Landing Page', 'Facebook Ads', 'Google Ads', 'Deskripsi Produk'],
  email: ['Promo', 'Newsletter', 'Follow-up Customer', 'Welcome Email'],
  seo: ['Artikel Blog', 'Meta Description', 'Google My Business']
};

export default function AIContentGenerator() {
  const [activeType, setActiveType] = useState<ContentType>('sosmed');
  const [promotion, setPromotion] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Santai');
  const [platform, setPlatform] = useState('Instagram');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateContent = async () => {
    if (!promotion) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      let prompt = "";
      const baseContext = `Produk/Jasa yang dipromosikan: ${promotion}. Target Audiens: ${audience || 'Umum'}. Tone: ${tone}. Platform: ${platform}.`;
      
      if (activeType === 'sosmed') {
        prompt = `Buatlah caption menarik untuk ${platform} berdasarkan konteks: ${baseContext}. Berikan 3 variasi yang berbeda. Untuk setiap variasi, sertakan: 1. Hook (pembuka menarik), 2. Isi konten/body, 3. Call to Action (CTA), 4. Hashtag relevan. Formatlah output dengan Markdown.`;
      } else if (activeType === 'copywriting') {
        prompt = `Buatlah copywriting persuasif untuk ${platform} berdasarkan konteks: ${baseContext}. Gunakan formula AIDA (Attention, Interest, Desire, Action) atau PAS (Problem, Agitation, Solution). Berikan Headline, Body Copy, dan CTA yang kuat. Formatlah output dengan Markdown.`;
      } else if (activeType === 'email') {
        prompt = `Buatlah draf email marketing jenis ${platform} berdasarkan konteks: ${baseContext}. Berikan beberapa pilihan Subject Line yang menarik (clickworthy), teks Body Email yang personal dan menarik, serta CTA yang jelas. Formatlah output dengan Markdown.`;
      } else if (activeType === 'seo') {
        prompt = `Buatlah konten SEO-friendly untuk ${platform} berdasarkan konteks: ${baseContext}. Sertakan: 1. Judul (H1) yang mengandung keyword utama, 2. Meta Description (maks 155 karakter), 3. Ringkasan konten atau outline artikel pendek. Formatlah output dengan Markdown.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "Anda adalah pakar Digital Marketing dan Copywriter profesional asal Indonesia. Bahasa yang digunakan harus natural, mengalir, dan sesuai dengan kultur media sosial/bisnis di Indonesia saat ini. Gunakan emoji yang relevan namun tidak berlebihan. Fokus pada konversi dan engagement.",
        }
      });

      setResult(response.text || "Maaf, gagal menghasilkan konten. Coba lagi.");
    } catch (error) {
      console.error("AI Generation Error:", error);
      setResult("Terjadi kesalahan saat menghubungi AI. Pastikan API Key sudah terpasang.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Left Side: Input Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8 space-y-6 flex flex-col h-fit">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Content Generator</h2>
            <p className="text-slate-500 text-sm">Hasilkan konten profesional dalam hitungan detik.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Apa yang ingin Anda promosikan?</label>
            <textarea 
              value={promotion}
              onChange={(e) => setPromotion(e.target.value)}
              placeholder="Misal: Kopi susu gula aren spesialis biji kopi Gayo, ada promo beli 1 gratis 1 sampai akhir minggu."
              className="w-full mt-1.5 px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Target Audiens</label>
              <input 
                type="text" 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Misal: Mahasiswa, Pekerja kantoran"
                className="w-full mt-1.5 px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Tone Suara</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full mt-1.5 px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
              >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Jenis Konten</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'sosmed', label: 'Sosmed', icon: Share2 },
              { id: 'copywriting', label: 'Copy', icon: PenTool },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'seo', label: 'SEO', icon: Globe },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setActiveType(type.id as ContentType);
                  setPlatform(PLATFORMS[type.id as ContentType][0]);
                }}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-2",
                  activeType === type.id 
                    ? "bg-indigo-50 border-indigo-600 text-indigo-600" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                )}
              >
                <type.icon size={20} />
                <span className="text-[10px] font-bold uppercase">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Platform / Format</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {PLATFORMS[activeType].map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                  platform === p ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateContent}
          disabled={isGenerating || !promotion}
          className={cn(
            "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100",
            promotion ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Menghasilkan Konten...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Hasilkan Konten
            </>
          )}
        </button>
      </div>

      {/* Right Side: Output Results */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 lg:p-8 flex flex-col h-[600px] lg:h-auto overflow-hidden relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Hasil Konten</h3>
          {result && (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                title="Salin Konten"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
              <button 
                onClick={generateContent}
                disabled={isGenerating}
                className="p-2 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                title="Generate Ulang"
              >
                <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {!result && !isGenerating ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40"
              >
                <div className="p-4 bg-slate-200 rounded-3xl mb-4">
                  <PenTool size={48} className="text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-600 mb-2">Tulis sesuatu di panel kiri</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  AI kami siap membantu Anda membuat teks pemasaran yang menjual.
                </p>
              </motion.div>
            ) : isGenerating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-indigo-500/10 rounded-full animate-ping"></div>
                  <Loader2 className="animate-spin text-indigo-600 relative z-10" size={48} />
                </div>
                <h4 className="font-bold text-indigo-900 mt-8 mb-2">AI sedang berpikir...</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Progres: Memberikan hook menarik, menyesuaikan tone, dan optimasi hashtag.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-slate prose-sm max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900"
              >
                <ReactMarkdown>{result}</ReactMarkdown>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
