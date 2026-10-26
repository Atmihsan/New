import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  autoComplete?: string;
  ariaLabel?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Enter password',
  required = true,
  name = 'password',
  autoComplete = 'current-password',
  ariaLabel = 'Password',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        className="w-full pl-3 pr-10 py-2.5 bg-[#f1f1f1] border border-transparent rounded-[3px] text-[14px] text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white focus:border-[#319885]"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors p-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#319885] rounded"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={0}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4 text-gray-600" />
        ) : (
          <Eye className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </div>
  );
};
