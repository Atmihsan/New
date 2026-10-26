import React from 'react';
import { UserCheck, ShieldCheck, Clock, Mail, LogOut, ArrowLeft } from 'lucide-react';
import { UserSession, Language, TRANSLATIONS } from '../types';

interface SignedInViewProps {
  session: UserSession;
  onLogout: () => void;
  language: Language;
}

export const SignedInView: React.FC<SignedInViewProps> = ({ session, onLogout, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full max-w-[580px] bg-white rounded-[4px] shadow-2xl p-8 sm:p-10 border border-emerald-900/10 text-left">
      <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#319885]/15 flex items-center justify-center text-[#319885]">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {session.mode === 'signup' ? t.accountCreated : t.welcomeBack}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{t.loggedInAs}</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-[#277e6e] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Active
        </span>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-[#f8f9fa] p-4 rounded-[4px] space-y-3">
          {session.name && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{t.nameLabel}</span>
              <span className="font-medium text-gray-900">{session.name}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              {t.emailLabel}
            </span>
            <span className="font-medium text-gray-900 break-all">{session.email}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              UID
            </span>
            <span className="font-mono text-xs text-gray-600 truncate max-w-[200px]" title={session.uid}>
              {session.uid}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {t.signedInTime}
            </span>
            <span className="font-mono text-xs text-gray-600">{session.signedInAt}</span>
          </div>
        </div>

        <div className="p-3.5 rounded bg-teal-50/60 border border-teal-100 text-xs text-teal-900">
          <p className="font-medium">Authentication session valid.</p>
          <p className="text-teal-700 mt-0.5">
            You have successfully verified your credentials with the Forest Path portal.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onLogout}
          className="flex-1 py-3 px-4 bg-[#319885] hover:bg-[#277e6e] text-white rounded-[3px] font-bold text-xs tracking-[0.5px] cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {t.logOut}
        </button>

        <button
          onClick={onLogout}
          className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-[3px] font-semibold text-xs tracking-wide cursor-pointer transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t.backToHome}
        </button>
      </div>
    </div>
  );
};
