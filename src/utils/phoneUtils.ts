// Country code mapping (numeric to ISO)
const countryCodeMapping: { [key: string]: string } = {
  '1': 'US',
  '44': 'GB',
  '91': 'IN',
  '61': 'AU',
  '971': 'AE',
  '33': 'FR',
  '49': 'DE',
  '81': 'JP',
  '86': 'CN',
  '7': 'RU',
  '55': 'BR',
  '52': 'MX',
  '39': 'IT',
  '34': 'ES',
  '31': 'NL',
  '46': 'SE',
  '47': 'NO',
  '45': 'DK',
  '358': 'FI',
  '48': 'PL',
  '420': 'CZ',
  '36': 'HU',
  '43': 'AT',
  '41': 'CH',
  '32': 'BE',
  '351': 'PT',
  '30': 'GR',
  '385': 'HR',
  '386': 'SI',
  '421': 'SK',
  '40': 'RO',
  '359': 'BG',
  '370': 'LT',
  '371': 'LV',
  '372': 'EE',
  '380': 'UA',
  '375': 'BY',
  '376': 'AD',
  '377': 'MC',
  '378': 'SM',
  '379': 'VA',
  '381': 'RS',
  '382': 'ME',
  '383': 'XK',
  '387': 'BA',
  '389': 'MK',
  '423': 'LI',
  '501': 'BZ',
  '502': 'GT',
  '503': 'SV',
  '504': 'HN',
  '505': 'NI',
  '506': 'CR',
  '507': 'PA',
  '508': 'PM',
  '509': 'HT',
  '590': 'GP',
  '591': 'BO',
  '592': 'GY',
  '593': 'EC',
  '594': 'GF',
  '595': 'PY',
  '596': 'MQ',
  '597': 'SR',
  '598': 'UY',
  '599': 'CW',
  '670': 'TL',
  '672': 'NF',
  '673': 'BN',
  '674': 'NR',
  '675': 'PG',
  '676': 'TO',
  '677': 'SB',
  '678': 'VU',
  '679': 'FJ',
  '680': 'PW',
  '681': 'WF',
  '682': 'CK',
  '683': 'NU',
  '685': 'WS',
  '686': 'KI',
  '687': 'NC',
  '688': 'TV',
  '689': 'PF',
  '690': 'TK',
  '691': 'FM',
  '692': 'MH',
  '850': 'KP',
  '852': 'HK',
  '853': 'MO',
  '855': 'KH',
  '856': 'LA',
  '880': 'BD',
  '886': 'TW',
  '960': 'MV',
  '961': 'LB',
  '962': 'JO',
  '963': 'SY',
  '964': 'IQ',
  '965': 'KW',
  '966': 'SA',
  '967': 'YE',
  '968': 'OM',
  '970': 'PS',
  '972': 'IL',
  '973': 'BH',
  '974': 'QA',
  '975': 'BT',
  '976': 'MN',
  '977': 'NP',
  '992': 'TJ',
  '993': 'TM',
  '994': 'AZ',
  '995': 'GE',
  '996': 'KG',
  '998': 'UZ'
};

/**
 * Convert numeric country code to ISO country code
 * @param numericCode - The numeric country code
 * @returns The ISO country code
 */
export function convertNumericToISOCountryCode(numericCode: string | number): string {
  if (!numericCode) return 'US';
  
  const code = numericCode.toString();
  return countryCodeMapping[code] || 'US';
}

/**
 * Normalize phone data to ensure proper country codes
 * @param phoneData - Phone data object
 * @returns Normalized phone data
 */
export function normalizePhoneData(phoneData: any): any {
  if (!phoneData) return phoneData;

  // Handle main phone number
  if (phoneData.phoneNumber && phoneData.phoneNumber.country) {
    const country = phoneData.phoneNumber.country;
    if (typeof country === 'number' || (typeof country === 'string' && /^\d+$/.test(country))) {
      phoneData.phoneNumber.country = convertNumericToISOCountryCode(country);
    }
  }

  // Handle additional phone numbers
  if (phoneData.phoneNumbers && Array.isArray(phoneData.phoneNumbers)) {
    phoneData.phoneNumbers = phoneData.phoneNumbers.map((phone: any) => {
      if (phone && phone.country) {
        const country = phone.country;
        if (typeof country === 'number' || (typeof country === 'string' && /^\d+$/.test(country))) {
          return {
            ...phone,
            country: convertNumericToISOCountryCode(country)
          };
        }
      }
      return phone;
    });
  }

  return phoneData;
}

/**
 * Check if a country code is numeric
 * @param countryCode - The country code to check
 * @returns True if numeric, false otherwise
 */
export function isNumericCountryCode(countryCode: string | number): boolean {
  if (!countryCode) return false;
  const code = countryCode.toString();
  return /^\d+$/.test(code);
}

/**
 * Get a safe country code for phone input components
 * @param countryCode - The country code
 * @returns A safe country code that won't cause errors
 */
export function getSafeCountryCode(countryCode: string | number): string {
  if (!countryCode) return 'US';
  
  const code = countryCode.toString();
  
  // If it's already an ISO code, return it
  if (code.length === 2 && /^[A-Z]{2}$/.test(code)) {
    return code;
  }
  
  // If it's numeric, convert it
  if (/^\d+$/.test(code)) {
    return convertNumericToISOCountryCode(code);
  }
  
  // Default fallback
  return 'US';
} 