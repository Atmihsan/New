/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Sparkles, 
  Network,
  Loader2,
  AlertTriangle,
  Sun,
  Zap,
  Activity,
  Layers,
  LogIn
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, testConnection } from './firebase';
import { Language, UserSession, THEMES, TRANSLATIONS } from './types';
import { PasswordInput } from './components/PasswordInput';
import { Toast, ToastMessage } from './components/Toast';
import { SignedInView } from './components/SignedInView';
import { ProfileView } from './components/ProfileView';
import { NetworkBackground } from './components/NetworkBackground';
import { NetworkSystem } from './components/NetworkSystem';
import forestImg from './assets/images/serene_forest_path_1793023556387.jpg';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80';

export type AppView = 'auth' | 'network' | 'profile';

export default function App() {
  const [view, setView] = useState<AppView>('auth');
  const [isSignUp, setIsSignUp] = useState(false); // Default to Login page
  const [isForgot, setIsForgot] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  
  // Lighting & network animation states
  const [lightingOn, setLightingOn] = useState<boolean>(true);
  const [lightIntensity, setLightIntensity] = useState<'subtle' | 'vibrant'>('vibrant');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<UserSession | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [imgError, setImgError] = useState(false);
  const [firebaseNotice, setFirebaseNotice] = useState<string | null>(null);

  const t = TRANSLATIONS[language];
  const isTa = language === 'ta';

  // Test connection on boot & listen to Auth state
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        const session: UserSession = {
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || user.email?.split('@')[0] || 'User',
          signedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          mode: isSignUp ? 'signup' : 'signin',
          provider: user.providerData[0]?.providerId || 'firebase',
          photoURL: user.photoURL,
        };
        setActiveSession(session);
      } else {
        setActiveSession(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDemoFill = () => {
    setEmail('atmihsan.network@gmail.com');
    setPassword('Atmihsan2026!');
    addToast(isTa ? 'மாதிரி விவரங்கள் நிரப்பப்பட்டன' : 'Demo credentials applied', 'info');
  };

  const triggerLightPulse = () => {
    setLightIntensity('vibrant');
    setTimeout(() => setLightIntensity('subtle'), 1200);
  };

  const syncUserProfileToFirestore = async (user: FirebaseUser) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore profile sync note:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFirebaseNotice(null);
    triggerLightPulse();

    if (isForgot) {
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        addToast(t.resetSuccess, 'success');
        setIsForgot(false);
      } catch (err: unknown) {
        const error = err as Error;
        addToast(isTa ? `பிழை: ${error.message}` : `Error: ${error.message}`, 'error');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserProfileToFirestore(userCredential.user);
        addToast(
          isTa
            ? 'பதிவு வெற்றிகரமாக முடிந்தது! (Sign Up Successful)'
            : 'Sign Up Successful! Account created in Firebase.',
          'success'
        );
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfileToFirestore(userCredential.user);
        addToast(
          isTa
            ? 'உள்நுழைவு வெற்றி! (Sign In Successful)'
            : 'Sign In Successful! Welcome back.',
          'success'
        );
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      const code = error.code || '';
      const message = error.message || 'Authentication error';

      if (code === 'auth/operation-not-allowed') {
        const noticeMsg = isTa
          ? 'Firebase Console-ல் Email/Password முறை இன்னும் இயக்கப்படவில்லை (Authentication > Sign-in method > Email/Password). கூகிள் மூலம் உள்நுழையலாம்.'
          : 'Email/Password provider is not yet enabled in Firebase Console. You can enable it under Authentication > Sign-in method, or sign in with Google below.';
        setFirebaseNotice(noticeMsg);
        addToast(noticeMsg, 'error');
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        addToast(
          isTa
            ? 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல் (Invalid email or password)'
            : 'Invalid email or password. Please verify your credentials.',
          'error'
        );
      } else if (code === 'auth/email-already-in-use') {
        addToast(
          isTa
            ? 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது (Email already in use)'
            : 'Email already registered. Try signing in instead.',
          'error'
        );
      } else if (code === 'auth/weak-password') {
        addToast(
          isTa
            ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும் (Password too weak)'
            : 'Password should be at least 6 characters.',
          'error'
        );
      } else {
        addToast(isTa ? `பிழை: ${message}` : `Error: ${message}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setFirebaseNotice(null);
    triggerLightPulse();
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await syncUserProfileToFirestore(userCredential.user);
      addToast(
        isTa
          ? 'கூகிள் மூலம் உள்நுழைவு வெற்றி! (Google Sign In Successful)'
          : 'Signed in with Google successfully!',
        'success'
      );
    } catch (err: unknown) {
      const error = err as Error;
      addToast(isTa ? `பிழை: ${error.message}` : `Google Sign In error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPassword('');
      addToast(isTa ? 'வெளியேறிவிட்டீர்கள் (Signed out)' : 'Logged out', 'info');
    } catch (err: unknown) {
      const error = err as Error;
      addToast(`Logout error: ${error.message}`, 'error');
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ta' : 'en';
    setLanguage(nextLang);
    addToast(nextLang === 'ta' ? 'மொழி: தமிழ்' : 'Language: English', 'info');
  };

  return (
    <div
      style={{ backgroundColor: activeTheme.bgColor }}
      className="relative min-h-screen w-full flex flex-col justify-between items-center p-3 sm:p-6 transition-colors duration-500 font-sans selection:bg-[#319885] selection:text-white overflow-x-hidden"
    >
      {/* Dynamic Network & Atmospheric Lighting Background Animation */}
      <NetworkBackground
        intensity={lightIntensity}
        lightingEffect={lightingOn}
      />

      {/* Top minimal bar */}
      <header className="relative z-20 w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 py-2 text-white/95">
        {/* Brand Lockup */}
        <button
          onClick={() => setView('auth')}
          type="button"
          className="flex items-center gap-2.5 font-bold tracking-tight text-white drop-shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white border border-white/25 shadow-sm">
            <Network className="w-4 h-4 text-emerald-100" />
          </div>
          <span className="text-sm font-extrabold tracking-wider uppercase">
            ATM.IHSAN&amp;NETWORKS
          </span>
        </button>

        {/* Central Navigation Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct Login Page button */}
          {!activeSession && (
            <button
              onClick={() => {
                setView('auth');
                setIsSignUp(false);
                setIsForgot(false);
              }}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all cursor-pointer shadow-sm border ${
                view === 'auth' && !isSignUp && !isForgot
                  ? 'bg-white text-[#277e6e] border-white ring-2 ring-white/30'
                  : 'text-white/95 bg-white/20 hover:bg-white/30 border-white/25 active:scale-95'
              }`}
              title="Open Login Page"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isTa ? 'உள்நுழைவு' : 'Login'}</span>
            </button>
          )}

          {/* Networking System Tab */}
          <button
            onClick={() => setView(view === 'network' ? 'auth' : 'network')}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-all cursor-pointer shadow-sm border ${
              view === 'network'
                ? 'bg-white text-[#277e6e] border-white ring-2 ring-white/30'
                : 'text-white/95 bg-white/20 hover:bg-white/30 border-white/25 active:scale-95'
            }`}
            title="Inspect ATM.IHSAN&NETWORKS System Topology"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isTa ? 'நெட்வொர்க் அமைப்பு' : 'Network System'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          {/* Founder Profile button */}
          <button
            onClick={() => setView(view === 'profile' ? 'auth' : 'profile')}
            type="button"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer shadow-sm border ${
              view === 'profile'
                ? 'bg-white text-slate-900 border-white ring-2 ring-white/30'
                : 'text-white/95 bg-white/20 hover:bg-white/30 border-white/25 active:scale-95'
            }`}
            title="View ATM Ihsan Profile"
          >
            <img
              src="/assets/aistudio/VEGA_1788849362335_b819d12f.jpg"
              alt="ATM Ihsan"
              className="w-4 h-4 rounded-full object-cover object-top border border-white/50"
            />
            <span>{isTa ? 'சுயவிவரம்' : 'Profile'}</span>
          </button>

          {/* Lighting Animation Toggle */}
          <button
            onClick={() => {
              setLightingOn(!lightingOn);
              addToast(
                !lightingOn
                  ? (isTa ? 'ஒளி அனிமேஷன் இயக்கப்பட்டது' : 'Lighting animation enabled')
                  : (isTa ? 'ஒளி அனிமேஷன் அணைக்கப்பட்டது' : 'Lighting animation dimmed'),
                'info'
              );
            }}
            type="button"
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer shadow-sm border ${
              lightingOn
                ? 'bg-amber-400/25 border-amber-300/40 text-amber-100 hover:bg-amber-400/35'
                : 'bg-white/10 border-white/15 text-white/60 hover:bg-white/20'
            }`}
            title="Toggle network lighting & beam animation"
          >
            <Zap className={`w-3.5 h-3.5 ${lightingOn ? 'text-amber-300' : 'text-white/60'}`} />
            <span className="hidden sm:inline">{lightingOn ? (isTa ? 'ஒளி ஆன்' : 'Light On') : (isTa ? 'ஒளி ஆஃப்' : 'Light Off')}</span>
          </button>

          {/* Quick Demo Fill (only in Auth view when not logged in) */}
          {view === 'auth' && !activeSession && (
            <button
              onClick={handleDemoFill}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/90 bg-white/15 hover:bg-white/25 active:scale-95 rounded transition-all cursor-pointer shadow-sm"
              title="Click to fill sample credentials"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden md:inline">{t.fillDemo}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/90 bg-white/15 hover:bg-white/25 active:scale-95 rounded transition-all cursor-pointer"
            aria-label="Toggle language between English and Tamil"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center my-6">
        <AnimatePresence mode="wait">
          {view === 'network' ? (
            <motion.div
              key="network-system"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              <NetworkSystem
                onBack={() => setView('auth')}
                language={language}
                onToast={addToast}
                onPulseLight={triggerLightPulse}
              />
            </motion.div>
          ) : view === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              <ProfileView
                onBack={() => setView('auth')}
                language={language}
                onToast={addToast}
              />
            </motion.div>
          ) : activeSession ? (
            <motion.div
              key="signed-in"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              <SignedInView
                session={activeSession}
                onLogout={handleLogout}
                language={language}
                onViewProfile={() => setView('profile')}
              />
            </motion.div>
          ) : (
            <div className="w-full flex items-center justify-center">
              {/* Exact Dual-Card Layout Container */}
              <div
                className="container relative w-full max-w-[650px] min-h-[480px] md:h-[480px] flex flex-col md:flex-row items-center justify-center"
              >
                {/* Right Forest Image Card with Lighting Glow */}
                <div
                  className="image-card w-full md:w-[55%] h-[200px] md:h-full relative md:absolute md:right-0 md:top-0 rounded-[4px] overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.15)] bg-emerald-950 transition-all"
                >
                  <img
                    src={imgError ? FALLBACK_IMAGE : forestImg}
                    onError={() => setImgError(true)}
                    alt="Forest Path"
                    className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
                  />
                  {/* Subtle quote overlay visible on bottom right */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-5 text-white pointer-events-none">
                    <p className="text-[12px] font-medium leading-relaxed italic opacity-90 drop-shadow-sm line-clamp-2">
                      {t.natureQuote}
                    </p>
                    <span className="text-[11px] font-semibold text-white/75 mt-1">
                      {t.natureQuoteAuthor}
                    </span>
                  </div>
                </div>

                {/* Left Form Card */}
                <div
                  className="form-card relative md:absolute left-0 md:left-[10%] w-full md:w-[50%] bg-[#ffffff] px-7 py-8 sm:px-[30px] sm:py-[35px] rounded-[4px] shadow-[0_10px_30px_rgba(0,0,0,0.18)] z-10 -mt-10 md:mt-0 transition-all text-left border border-white/60"
                >
                  {/* Mode Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-[4px] mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setIsForgot(false);
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-[3px] transition-all cursor-pointer ${
                        !isSignUp && !isForgot
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {isTa ? 'உள்நுழைவு (Login)' : 'Sign In / Login'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setIsForgot(false);
                      }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-[3px] transition-all cursor-pointer ${
                        isSignUp && !isForgot
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {isTa ? 'பதிவு (Sign Up)' : 'Sign Up'}
                    </button>
                  </div>

                  <div className="mb-4">
                    <h2 id="form-title" className="text-[26px] font-extrabold text-[#000000] tracking-tight leading-none mb-1">
                      {isForgot ? t.forgotPasswordTitle : (isSignUp ? (isTa ? 'பதிவு செய்க' : 'Sign Up') : (isTa ? 'உள்நுழைக (Login)' : 'Sign In'))}
                    </h2>
                    <p className="text-[12px] text-gray-500">
                      {isForgot
                        ? (isTa ? 'கடவுச்சொல்லை மீட்டமைக்க மின்னஞ்சலை உள்ளிடவும்' : 'Enter your email to receive a password reset link')
                        : (isSignUp
                            ? (isTa ? 'ATM.IHSAN&NETWORKS-ல் புதிய கணக்கு தொடங்கவும்' : 'Create your account on ATM.IHSAN&NETWORKS')
                            : (isTa ? 'ATM.IHSAN&NETWORKS போர்ட்டலில் உள்நுழையவும்' : 'Sign in to access ATM.IHSAN&NETWORKS portal'))}
                    </p>
                  </div>

                  {/* Firebase provider notice banner if provider requires enabling */}
                  {firebaseNotice && (
                    <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>{firebaseNotice}</div>
                    </div>
                  )}

                  <form id="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group mb-4">
                      <label className="block text-[13px] font-bold text-[#333333] mb-1.5">
                        {t.emailLabel}
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        autoComplete="email"
                        className="w-full px-3 py-2.5 bg-[#f1f1f1] border border-transparent rounded-[3px] text-[14px] outline-none transition-colors focus:bg-white focus:border-[#319885]"
                      />
                    </div>

                    {!isForgot && (
                      <div className="input-group mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[13px] font-bold text-[#333333]">
                            {t.passwordLabel}
                          </label>
                          {!isSignUp && (
                            <button
                              type="button"
                              onClick={() => setIsForgot(true)}
                              className="text-[12px] text-gray-500 hover:text-[#319885] transition-colors cursor-pointer"
                            >
                              {t.forgotPasswordLink}
                            </button>
                          )}
                        </div>
                        <PasswordInput
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t.passwordPlaceholder}
                          required
                          autoComplete={isSignUp ? 'new-password' : 'current-password'}
                        />

                        {!isSignUp && (
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-gray-500">
                              {isTa ? 'சோதனை கணக்கு:' : 'Demo account:'}
                            </span>
                            <button
                              type="button"
                              onClick={handleDemoFill}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#319885] hover:text-[#277e6e] cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>{isTa ? 'விவரங்களை நிரப்பு' : 'Auto-fill Demo'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {isForgot && (
                      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                        {t.resetInstructions}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      id="submit-btn-text"
                      className="submit-btn w-full py-3 bg-[#319885] hover:bg-[#277e6e] text-white rounded-[3px] font-bold text-[13px] tracking-[0.5px] cursor-pointer mt-2.5 mb-3.5 uppercase transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 shadow-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t.processing}</span>
                        </>
                      ) : (
                        <span>
                          {isForgot
                            ? t.sendResetLink
                            : (isSignUp
                                ? (isTa ? 'பதிவு செய்க (Sign Up)' : 'SIGN UP')
                                : (isTa ? 'உள்நுழைக (Sign In / Login)' : 'SIGN IN / LOGIN'))}
                        </span>
                      )}
                    </button>

                    {/* Google Sign In option */}
                    {!isForgot && (
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full py-2.5 mb-4 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-[3px] font-semibold text-[12px] tracking-wide cursor-pointer transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>{isTa ? 'கூகிள் மூலம் உள்நுழைக' : 'Continue with Google'}</span>
                      </button>
                    )}
                  </form>

                  {/* Mode Toggle Link */}
                  <div className="pt-1">
                    {isForgot ? (
                      <button
                        type="button"
                        onClick={() => setIsForgot(false)}
                        className="text-[13px] text-[#333333] hover:text-[#319885] transition-colors cursor-pointer select-none"
                      >
                        {t.backToSignIn}
                      </button>
                    ) : (
                      <a
                        id="toggle-mode"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsSignUp(!isSignUp);
                        }}
                        className="toggle-link text-[13px] text-[#333333] hover:text-[#319885] transition-colors cursor-pointer select-none"
                      >
                        {isSignUp
                          ? (isTa ? 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக' : 'Already have an account? Sign In')
                          : (isTa ? 'கணக்கு இல்லையா? பதிவு செய்க' : "Don't have an account? Sign Up")}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 py-2 text-xs text-white/80">
        <div className="flex items-center gap-2">
          <span className="text-white/60">Theme:</span>
          <div className="flex items-center gap-1.5">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTheme.id === theme.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: theme.bgColor }}
                />
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-white/70">
          <span className="font-semibold text-white/90">ATM.IHSAN&amp;NETWORKS</span>
          <span>·</span>
          <span>{isTa ? 'பாதுகாப்பான நெட்வொர்க் அமைப்பு' : 'Live Network System'}</span>
          <span>·</span>
          <span>2026</span>
        </div>
      </footer>

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
