export type CountryCode = {
  code: string;
  dial: string;
  label: string;
};

export const DEFAULT_COUNTRY_CODE = 'LK';

export const countryCodes: CountryCode[] = [
  { code: 'LK', dial: '+94', label: 'Sri Lanka' },
  { code: 'IN', dial: '+91', label: 'India' },
  { code: 'GB', dial: '+44', label: 'United Kingdom' },
  { code: 'US', dial: '+1', label: 'United States' },
  { code: 'AU', dial: '+61', label: 'Australia' },
  { code: 'AE', dial: '+971', label: 'UAE' },
  { code: 'SG', dial: '+65', label: 'Singapore' },
  { code: 'MY', dial: '+60', label: 'Malaysia' },
];

export function getDefaultCountry(): CountryCode {
  return countryCodes.find((c) => c.code === DEFAULT_COUNTRY_CODE) ?? countryCodes[0];
}
