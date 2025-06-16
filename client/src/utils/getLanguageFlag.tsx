import { LANGUAGE_TO_FLAG } from '@/constants';

export function getLanguageFlag(language: string) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode =
    LANGUAGE_TO_FLAG[langLower as keyof typeof LANGUAGE_TO_FLAG];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className='h-3 mr-1 inline-block'
      />
    );
  }
  return null;
}
