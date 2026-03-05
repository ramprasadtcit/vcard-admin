export interface Country {
  value: string;    // Country code (e.g., "AE")
  label: string;    // Country name (e.g., "United Arab Emirates")
  flag: string;     // Flag emoji (e.g., "🇦🇪")
}

export const countries: Country[] = [
  { value: 'AE', label: 'United Arab Emirates', flag: '🇦🇪' },
  { value: 'US', label: 'United States', flag: '🇺🇸' },
  { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'CA', label: 'Canada', flag: '🇨🇦' },
  { value: 'AU', label: 'Australia', flag: '🇦🇺' },
  { value: 'DE', label: 'Germany', flag: '🇩🇪' },
  { value: 'FR', label: 'France', flag: '🇫🇷' },
  { value: 'IT', label: 'Italy', flag: '🇮🇹' },
  { value: 'ES', label: 'Spain', flag: '🇪🇸' },
  { value: 'NL', label: 'Netherlands', flag: '🇳🇱' },
  { value: 'BE', label: 'Belgium', flag: '🇧🇪' },
  { value: 'CH', label: 'Switzerland', flag: '🇨🇭' },
  { value: 'AT', label: 'Austria', flag: '🇦🇹' },
  { value: 'SE', label: 'Sweden', flag: '🇸🇪' },
  { value: 'NO', label: 'Norway', flag: '🇳🇴' },
  { value: 'DK', label: 'Denmark', flag: '🇩🇰' },
  { value: 'FI', label: 'Finland', flag: '🇫🇮' },
  { value: 'IE', label: 'Ireland', flag: '🇮🇪' },
  { value: 'NZ', label: 'New Zealand', flag: '🇳🇿' },
  { value: 'JP', label: 'Japan', flag: '🇯🇵' },
  { value: 'KR', label: 'South Korea', flag: '🇰🇷' },
  { value: 'SG', label: 'Singapore', flag: '🇸🇬' },
  { value: 'HK', label: 'Hong Kong', flag: '🇭🇰' },
  { value: 'IN', label: 'India', flag: '🇮🇳' },
  { value: 'CN', label: 'China', flag: '🇨🇳' },
  { value: 'BR', label: 'Brazil', flag: '🇧🇷' },
  { value: 'MX', label: 'Mexico', flag: '🇲🇽' },
  { value: 'AR', label: 'Argentina', flag: '🇦🇷' },
  { value: 'CL', label: 'Chile', flag: '🇨🇱' },
  { value: 'CO', label: 'Colombia', flag: '🇨🇴' },
  { value: 'PE', label: 'Peru', flag: '🇵🇪' },
  { value: 'VE', label: 'Venezuela', flag: '🇻🇪' },
  { value: 'ZA', label: 'South Africa', flag: '🇿🇦' },
  { value: 'EG', label: 'Egypt', flag: '🇪🇬' },
  { value: 'NG', label: 'Nigeria', flag: '🇳🇬' },
  { value: 'KE', label: 'Kenya', flag: '🇰🇪' },
  { value: 'GH', label: 'Ghana', flag: '🇬🇭' },
  { value: 'MA', label: 'Morocco', flag: '🇲🇦' },
  { value: 'TN', label: 'Tunisia', flag: '🇹🇳' },
  { value: 'SA', label: 'Saudi Arabia', flag: '🇸🇦' },
  { value: 'KW', label: 'Kuwait', flag: '🇰🇼' },
  { value: 'QA', label: 'Qatar', flag: '🇶🇦' },
  { value: 'BH', label: 'Bahrain', flag: '🇧🇭' },
  { value: 'OM', label: 'Oman', flag: '🇴🇲' },
  { value: 'JO', label: 'Jordan', flag: '🇯🇴' },
  { value: 'LB', label: 'Lebanon', flag: '🇱🇧' },
  { value: 'IL', label: 'Israel', flag: '🇮🇱' },
  { value: 'TR', label: 'Turkey', flag: '🇹🇷' },
  { value: 'RU', label: 'Russia', flag: '🇷🇺' },
  { value: 'PL', label: 'Poland', flag: '🇵🇱' },
  { value: 'CZ', label: 'Czech Republic', flag: '🇨🇿' },
  { value: 'HU', label: 'Hungary', flag: '🇭🇺' },
  { value: 'RO', label: 'Romania', flag: '🇷🇴' },
  { value: 'BG', label: 'Bulgaria', flag: '🇧🇬' },
  { value: 'HR', label: 'Croatia', flag: '🇭🇷' },
  { value: 'SI', label: 'Slovenia', flag: '🇸🇮' },
  { value: 'SK', label: 'Slovakia', flag: '🇸🇰' },
  { value: 'LT', label: 'Lithuania', flag: '🇱🇹' },
  { value: 'LV', label: 'Latvia', flag: '🇱🇻' },
  { value: 'EE', label: 'Estonia', flag: '🇪🇪' },
  { value: 'GR', label: 'Greece', flag: '🇬🇷' },
  { value: 'PT', label: 'Portugal', flag: '🇵🇹' },
  { value: 'MT', label: 'Malta', flag: '🇲🇹' },
  { value: 'CY', label: 'Cyprus', flag: '🇨🇾' },
  { value: 'LU', label: 'Luxembourg', flag: '🇱🇺' },
  { value: 'IS', label: 'Iceland', flag: '🇮🇸' },
  { value: 'MC', label: 'Monaco', flag: '🇲🇨' },
  { value: 'LI', label: 'Liechtenstein', flag: '🇱🇮' },
  { value: 'AD', label: 'Andorra', flag: '🇦🇩' },
  { value: 'SM', label: 'San Marino', flag: '🇸🇲' },
  { value: 'VA', label: 'Vatican City', flag: '🇻🇦' },
  { value: 'TH', label: 'Thailand', flag: '🇹🇭' },
  { value: 'MY', label: 'Malaysia', flag: '🇲🇾' },
  { value: 'ID', label: 'Indonesia', flag: '🇮🇩' },
  { value: 'PH', label: 'Philippines', flag: '🇵🇭' },
  { value: 'VN', label: 'Vietnam', flag: '🇻🇳' },
  { value: 'MM', label: 'Myanmar', flag: '🇲🇲' },
  { value: 'LK', label: 'Sri Lanka', flag: '🇱🇰' },
  { value: 'BD', label: 'Bangladesh', flag: '🇧🇩' },
  { value: 'PK', label: 'Pakistan', flag: '🇵🇰' },
  { value: 'AF', label: 'Afghanistan', flag: '🇦🇫' },
  { value: 'IR', label: 'Iran', flag: '🇮🇷' },
  { value: 'IQ', label: 'Iraq', flag: '🇮🇶' },
  { value: 'SY', label: 'Syria', flag: '🇸🇾' },
  { value: 'YE', label: 'Yemen', flag: '🇾🇪' }
].sort((a, b) => a.label.localeCompare(b.label));

// Helper function to get country by code
export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.value === code);
};

// Helper function to get country by name
export const getCountryByName = (name: string): Country | undefined => {
  return countries.find(country => 
    country.label.toLowerCase().includes(name.toLowerCase())
  );
};

// Helper function to get all country codes
export const getCountryCodes = (): string[] => {
  return countries.map(country => country.value);
};

// Helper function to get all country names
export const getCountryNames = (): string[] => {
  return countries.map(country => country.label);
}; 