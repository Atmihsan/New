import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Copy, 
  Check, 
  ArrowLeft, 
  Network, 
  ExternalLink,
  Award,
  Cpu,
  Radio,
  Lock
} from 'lucide-react';
import { Language } from '../types';

interface ProfileViewProps {
  onBack: () => void;
  language: Language;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack, language, onToast }) => {
  const [copied, setCopied] = useState(false);

  const email = 'atmihsan.network@gmail.com';
  const profilePhotoUrl = '/assets/aistudio/VEGA_1788849362335_b819d12f.jpg';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    onToast(
      language === 'ta' ? 'மின்னஞ்சல் நகலெடுக்கப்பட்டது!' : 'Email copied to clipboard!',
      'success'
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const isTamil = language === 'ta';

  return (
    <div className="w-full max-w-[620px] bg-white rounded-lg shadow-2xl overflow-hidden border border-emerald-900/10 text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Cover Banner */}
      <div className="h-32 sm:h-36 w-full relative bg-gradient-to-r from-[#4d7c71] via-[#64998b] to-[#319885] overflow-hidden">
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute top-4 left-4 flex items-center gap-2 text-white/90 text-xs font-semibold uppercase tracking-wider">
          <Network className="w-4 h-4 text-emerald-200" />
          <span>ATM.IHSAN&amp;NETWORKS</span>
        </div>
        <button
          onClick={onBack}
          type="button"
          className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 rounded bg-black/25 hover:bg-black/40 text-white text-xs font-medium cursor-pointer transition-colors backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isTamil ? 'பின்செல்' : 'Back'}</span>
        </button>
      </div>

      {/* Main Profile Info */}
      <div className="px-6 sm:px-8 pb-8 pt-0 relative">
        {/* Profile Picture with Overlap */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-5">
          <div className="relative inline-block">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-900 shrink-0">
              <img
                src={profilePhotoUrl}
                alt="ATM Ihsan"
                className="w-full h-full object-cover object-top filter brightness-[1.02]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#319885] border-2 border-white flex items-center justify-center text-white shadow-sm"
              title="Verified Founder"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmail}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              <span>{copied ? (isTamil ? 'நகலெடுக்கப்பட்டது' : 'Copied') : (isTamil ? 'மின்னஞ்சலை நகலெடு' : 'Copy Email')}</span>
            </button>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#319885] hover:bg-[#277e6e] text-white text-xs font-bold tracking-wide cursor-pointer transition-colors shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isTamil ? 'தொடர்புகொள்ள' : 'Contact'}</span>
            </a>
          </div>
        </div>

        {/* Name and Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              ATM Ihsan
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-[#277e6e] border border-emerald-200/60 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isTamil ? 'நிறுவனர் & நிர்வாகி' : 'Founder & Admin'}
            </span>
          </div>

          <p className="text-sm font-semibold text-gray-500 mt-0.5">
            ATM.IHSAN&amp;NETWORKS
          </p>

          <p className="text-xs text-gray-600 mt-2.5 leading-relaxed max-w-lg">
            {isTamil 
              ? 'ATM.IHSAN&NETWORKS-ன் நிறுவனர். பாதுகாப்பான அங்கீகாரம், நவீன கிளவுட் தொழில்நுட்பம் மற்றும் ஒன்றிணைக்கப்பட்ட நெட்வொர்க் சேவைகளை வழிநடத்துபவர்.'
              : 'Founder of ATM.IHSAN&NETWORKS. Leading secure authentication, modern cloud digital infrastructure, and interconnected network platforms.'}
          </p>
        </div>

        {/* Network & Identity Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded bg-gray-50 border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-emerald-100/70 text-[#277e6e] flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {isTamil ? 'மின்னஞ்சல்' : 'Email'}
              </span>
              <span className="text-xs font-semibold text-gray-800 break-all">{email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-gray-50 border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {isTamil ? 'நெட்வொர்க் நிலை' : 'Network Status'}
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                {isTamil ? 'செயலில் உள்ளது (Active)' : 'Active & Online'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-gray-50 border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-cyan-100/70 text-cyan-800 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {isTamil ? 'நெட்வொர்க் ஐடி' : 'Network ID'}
              </span>
              <span className="text-xs font-mono font-semibold text-gray-800">ATM-NET-001</span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-gray-50 border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {isTamil ? 'அங்கீகாரம்' : 'Authentication'}
              </span>
              <span className="text-xs font-semibold text-gray-800">
                Firebase (updatenew-48b45)
              </span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <button
            onClick={onBack}
            type="button"
            className="w-full sm:w-auto py-2.5 px-6 bg-[#319885] hover:bg-[#277e6e] text-white rounded-[3px] font-bold text-xs tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isTamil ? 'போர்ட்டலுக்குத் திரும்பு' : 'Back to Portal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
