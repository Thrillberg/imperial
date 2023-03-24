export const capitalize = (word) => (word[0].toUpperCase() + word.substring(1));

export const displayLocationName = (word) => {
  if (word) {
    switch (word) {
      case 'bayofbiscay': return 'Bay of Biscay';
      case 'blacksea': return 'Black Sea';
      case 'westernmediterraneansea': return 'Western Mediterranean Sea';
      case 'easternmediterraneansea': return 'Eastern Mediterranean Sea';
      case 'northsea': return 'North Sea';
      case 'northatlantic': return 'North Atlantic';
      case 'balticsea': return 'Baltic Sea';
      case 'englishchannel': return 'English Channel';
      case 'westbalkan': return 'West Balkan';
      case 'stpetersburg': return 'St. Petersburg';
      case 'northpacific': return 'North Pacific';
      case 'southpacific': return 'South Pacific';
      case 'caribbeansea': return 'Caribbean Sea';
      case 'southatlantic': return 'South Atlantic';
      case 'gulfofguinea': return 'Gulf of Guinea';
      case 'mediterraneansea': return 'Mediterranean Sea';
      case 'indianocean': return 'Indian Ocean';
      case 'seaofjapan': return 'Sea of Japan';
      case 'chinasea': return 'China Sea';
      case 'tasmansea': return 'Tasman Sea';
      case 'northafrica': return 'North Africa';
      case 'southafrica': return 'South Africa';
      case 'eastafrica': return 'East Africa';
      case 'neareast': return 'Near East';
      case 'newzealand': return 'New Zealand';
      case 'newdelhi': return 'New Delhi';
      case 'riodejaneiro': return 'Rio de Janeiro';
      case 'newyork': return 'New York';
      case 'neworleans': return 'New Orleans';
      case 'sanfrancisco': return 'San Francisco';
      default: return capitalize(word);
    }
  }
  return 'Location';
};

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
    default: return 'Nation';
  }
};

export const displayMonetaryValueInMillions = (value) => {
  if (value < 0) {
    return `-$${Math.abs(value)}m`;
  }
  return `$${value}m`;
};

export const unitTypeByDestinationSingular = (isDestinationOcean) => {
  if (isDestinationOcean) {
    return 'a fleet';
  }
  return 'an army';
};

export const unitTypeByDestinationPlural = (isDestinationOcean) => {
  if (isDestinationOcean) {
    return 'fleets';
  }
  return 'armies';
};
