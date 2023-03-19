export const displayNationName = (nation) => {
  switch (nation) {
    case 'AH':
      return 'Austria-Hungary';
    case 'BR':
      return 'Brazil';
    case 'CN':
      return 'China';
    case 'CNAsia':
      return 'China';
    case 'EU':
      return 'European Union';
    case 'IN':
      return 'India';
    case 'IT':
      return 'Italy';
    case 'JP':
      return 'Japan';
    case 'FR':
      return 'France';
    case 'GB':
      return 'Great Britain';
    case 'GE':
      return 'Germany';
    case 'RU':
      return 'Russia';
    case 'TR':
      return 'Turkey';
    case 'US':
      return 'United States of America';
    default: return '';
  }
};

export const displayMonetaryValue_InMillions = (value) => {
  if (value < 0) {
    return `-$${Math.abs(value)}m`;
  } else {
    return `$${value}m`;
  }
};