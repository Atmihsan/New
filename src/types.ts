export type AuthMode = 'signup' | 'signin' | 'forgot';
export type Language = 'en' | 'ta';

export interface UserSession {
  uid: string;
  email: string;
  name: string;
  signedInAt: string;
  mode: 'signup' | 'signin';
  provider?: string;
  photoURL?: string | null;
}

export interface ThemeOption {
  id: string;
  name: string;
  bgColor: string;
  btnColor: string;
  btnHoverColor: string;
  imagePromptDescription: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'forest',
    name: 'Serene Forest',
    bgColor: '#64998b',
    btnColor: '#319885',
    btnHoverColor: '#277e6e',
    imagePromptDescription: 'Forest pathway with sunlight filtering through canopy',
  },
  {
    id: 'mist',
    name: 'Misty Alpine',
    bgColor: '#5d857b',
    btnColor: '#2e8c79',
    btnHoverColor: '#246f60',
    imagePromptDescription: 'Evergreen woodland with soft morning mist',
  },
  {
    id: 'deep-cedar',
    name: 'Deep Cedar',
    bgColor: '#4d7c71',
    btnColor: '#268a76',
    btnHoverColor: '#1d6e5e',
    imagePromptDescription: 'Rich mossy pine trails',
  },
];

export const TRANSLATIONS = {
  en: {
    signUp: 'Sign Up',
    signIn: 'Sign In',
    forgotPasswordTitle: 'Reset Password',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    submitSignUp: 'SIGN UP',
    submitSignIn: 'SIGN IN',
    submit: 'SUBMIT',
    processing: 'PLEASE WAIT...',
    orSignIn: 'Already have an account? Sign In',
    orSignUp: "Don't have an account? Sign Up",
    forgotPasswordLink: 'Forgot password?',
    sendResetLink: 'SEND RESET LINK',
    backToSignIn: '← Back to Sign In',
    resetInstructions: 'Enter your email address and we will send you a link to reset your password.',
    resetSuccess: 'Password reset link sent! Check your inbox.',
    rememberMe: 'Remember me',
    fillDemo: 'Demo autofill',
    strengthWeak: 'Weak password',
    strengthMedium: 'Medium strength',
    strengthStrong: 'Strong password',
    passwordsMismatch: 'Passwords do not match',
    welcomeBack: 'Welcome back!',
    accountCreated: 'Account created!',
    loggedInAs: 'You are signed in as',
    signedInTime: 'Session started at',
    logOut: 'LOG OUT',
    backToHome: 'Back to Auth Page',
    natureQuote: '“In every walk with nature, one receives far more than he seeks.”',
    natureQuoteAuthor: '— John Muir',
  },
  ta: {
    signUp: 'பதிவு செய்க',
    signIn: 'உள்நுழைக',
    forgotPasswordTitle: 'கடவுச்சொல் மீட்டமை',
    nameLabel: 'முழு பெயர்',
    namePlaceholder: 'உங்கள் முழு பெயரை உள்ளிடவும்',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    emailPlaceholder: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
    passwordLabel: 'கடவுச்சொல்',
    passwordPlaceholder: 'கடவுச்சொல்லை உள்ளிடவும்',
    confirmPasswordLabel: 'கடவுச்சொல்லை உறுதிசெய்',
    confirmPasswordPlaceholder: 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்',
    submitSignUp: 'பதிவு செய்க (SIGN UP)',
    submitSignIn: 'உள்நுழைக (SIGN IN)',
    submit: 'சமர்ப்பிக்கவும்',
    processing: 'காத்திருக்கவும்...',
    orSignIn: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக',
    orSignUp: 'கணக்கு இல்லையா? பதிவு செய்க',
    forgotPasswordLink: 'கடவுச்சொல் மறந்துவிட்டதா?',
    sendResetLink: 'மீட்டமைப்பு இணைப்பை அனுப்பு',
    backToSignIn: '← உள்நுழைவுக்குத் திரும்பு',
    resetInstructions: 'உங்கள் மின்னஞ்சலை உள்ளிடவும், கடவுச்சொல்லை மீட்டமைக்க ஒரு இணைப்பை அனுப்புவோம்.',
    resetSuccess: 'மீட்டமைப்பு இணைப்பு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது!',
    rememberMe: 'என்னை நினைவில் கொள்',
    fillDemo: 'மாதிரி நிரப்புதல்',
    strengthWeak: 'எளிய கடவுச்சொல்',
    strengthMedium: 'நடுத்தர வலிமை',
    strengthStrong: 'வலுவான கடவுச்சொல்',
    passwordsMismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
    welcomeBack: 'மீண்டும் வருக!',
    accountCreated: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!',
    loggedInAs: 'நீங்கள் உள்நுழைந்துள்ளீர்கள்',
    signedInTime: 'அமர்வு தொடங்கிய நேரம்',
    logOut: 'வெளியேறு',
    backToHome: 'முகப்புப் பக்கத்திற்கு திரும்பு',
    natureQuote: '“இயற்கையோடு நடக்கும் ஒவ்வொரு பயணத்திலும், நாம் தேடுவதை விடவும் அதிகம் பெறுகிறோம்.”',
    natureQuoteAuthor: '— ஜான் முயர்',
  },
};
