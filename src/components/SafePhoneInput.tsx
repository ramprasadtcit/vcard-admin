import React from 'react';
import PhoneInput from 'react-phone-number-input';
import { getSafeCountryCode } from '../utils/phoneUtils';

interface SafePhoneInputProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  defaultCountry?: string | number;
  international?: boolean;
  countryCallingCodeEditable?: boolean;
  placeholder?: string;
  className?: string;
  'data-error'?: boolean;
  disabled?: boolean;
  [key: string]: any; // Allow other props
}

const SafePhoneInput: React.FC<SafePhoneInputProps> = ({
  defaultCountry,
  onChange,
  ...props
}) => {
  // Ensure defaultCountry is always a valid ISO country code
  const safeDefaultCountry = getSafeCountryCode(defaultCountry || 'US') as any;
  
  return (
    <PhoneInput
      {...props}
      defaultCountry={safeDefaultCountry}
      onChange={onChange}
    />
  );
};

export default SafePhoneInput; 