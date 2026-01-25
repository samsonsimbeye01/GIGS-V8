export interface CountryData {
  code: string;
  name: string;
  currency: string;
  phoneFormat: string;
  nationalIdFormat: string;
  timezone: string;
  languages: string[];
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
  };
}

export const AFRICAN_COUNTRIES: Record<string, CountryData> = {
  'NG': {
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    phoneFormat: '+234 XXX XXX XXXX',
    nationalIdFormat: 'XXXXXXXXXXX',
    timezone: 'Africa/Lagos',
    languages: ['en', 'ha', 'yo', 'ig'],
    emergencyNumbers: { police: '199', ambulance: '199', fire: '199' }
  },
  'KE': {
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    phoneFormat: '+254 XXX XXX XXX',
    nationalIdFormat: 'XXXXXXXX',
    timezone: 'Africa/Nairobi',
    languages: ['en', 'sw'],
    emergencyNumbers: { police: '999', ambulance: '999', fire: '999' }
  },
  'TZ': {
    code: 'TZ',
    name: 'Tanzania',
    currency: 'TZS',
    phoneFormat: '+255 XXX XXX XXX',
    nationalIdFormat: 'XXXXXXXX-XXXXX-XXXXX',
    timezone: 'Africa/Dar_es_Salaam',
    languages: ['sw', 'en'],
    emergencyNumbers: { police: '999', ambulance: '114', fire: '115' }
  },
  'UG': {
    code: 'UG',
    name: 'Uganda',
    currency: 'UGX',
    phoneFormat: '+256 XXX XXX XXX',
    nationalIdFormat: 'XXXXXXXXXXXXXXX',
    timezone: 'Africa/Kampala',
    languages: ['en', 'sw'],
    emergencyNumbers: { police: '999', ambulance: '911', fire: '999' }
  },
  'GH': {
    code: 'GH',
    name: 'Ghana',
    currency: 'GHS',
    phoneFormat: '+233 XXX XXX XXXX',
    nationalIdFormat: 'GHA-XXXXXXXXX-X',
    timezone: 'Africa/Accra',
    languages: ['en'],
    emergencyNumbers: { police: '191', ambulance: '193', fire: '192' }
  },
  'ZA': {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    phoneFormat: '+27 XX XXX XXXX',
    nationalIdFormat: 'XXXXXXXXXXXXXX',
    timezone: 'Africa/Johannesburg',
    languages: ['en', 'af', 'zu', 'xh'],
    emergencyNumbers: { police: '10111', ambulance: '10177', fire: '10111' }
  },
  'EG': {
    code: 'EG',
    name: 'Egypt',
    currency: 'EGP',
    phoneFormat: '+20 XXX XXX XXXX',
    nationalIdFormat: 'XXXXXXXXXXXXXX',
    timezone: 'Africa/Cairo',
    languages: ['ar', 'en'],
    emergencyNumbers: { police: '122', ambulance: '123', fire: '180' }
  },
  'MA': {
    code: 'MA',
    name: 'Morocco',
    currency: 'MAD',
    phoneFormat: '+212 XXX XXX XXX',
    nationalIdFormat: 'XXXXXXXX',
    timezone: 'Africa/Casablanca',
    languages: ['ar', 'fr'],
    emergencyNumbers: { police: '19', ambulance: '15', fire: '15' }
  },
  'ET': {
    code: 'ET',
    name: 'Ethiopia',
    currency: 'ETB',
    phoneFormat: '+251 XX XXX XXXX',
    nationalIdFormat: 'XXXXXXXXXXXXXXX',
    timezone: 'Africa/Addis_Ababa',
    languages: ['am', 'en'],
    emergencyNumbers: { police: '991', ambulance: '907', fire: '939' }
  },
  'RW': {
    code: 'RW',
    name: 'Rwanda',
    currency: 'RWF',
    phoneFormat: '+250 XXX XXX XXX',
    nationalIdFormat: 'XXXXXXXXXXXXXXXX',
    timezone: 'Africa/Kigali',
    languages: ['rw', 'en', 'fr'],
    emergencyNumbers: { police: '112', ambulance: '912', fire: '112' }
  }
};

export const detectCountryFromCoords = (lat: number, lng: number): string => {
  // Simple country detection based on coordinates
  if (lat >= -35 && lat <= 37 && lng >= -17 && lng <= 52) {
    if (lat >= 22 && lng >= 25) return 'EG';
    if (lat >= 21 && lng <= 12) return 'MA';
    if (lat >= 3 && lng >= 33) return 'ET';
    if (lat >= -2 && lng >= 29) return 'RW';
    if (lat >= -12 && lng >= 28) return 'TZ';
    if (lat >= -5 && lng >= 29) return 'UG';
    if (lat >= -5 && lng >= 33) return 'KE';
    if (lat >= 4 && lng <= 15) return 'NG';
    if (lat >= 4 && lng <= 3) return 'GH';
    if (lat <= -22) return 'ZA';
  }
  return 'TZ'; // Default to Tanzania
};

export const formatPhoneNumber = (phone: string, countryCode: string): string => {
  const country = AFRICAN_COUNTRIES[countryCode];
  if (!country) return phone;
  
  const digits = phone.replace(/\D/g, '');
  const format = country.phoneFormat;
  let formatted = format;
  
  let digitIndex = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] === 'X' && digitIndex < digits.length) {
      formatted = formatted.substring(0, i) + digits[digitIndex] + formatted.substring(i + 1);
      digitIndex++;
    }
  }
  
  return formatted;
};

export const validateNationalId = (id: string, countryCode: string): boolean => {
  const country = AFRICAN_COUNTRIES[countryCode];
  if (!country) return false;
  
  const format = country.nationalIdFormat;
  const cleanId = id.replace(/[^A-Za-z0-9]/g, '');
  const formatLength = format.replace(/[^X]/g, '').length;
  
  return cleanId.length === formatLength;
};