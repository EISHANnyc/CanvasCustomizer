var PRESETS = {
  // ==========================================
  // 1. LINEN (WARM EDITORIAL)
  // ==========================================
  'linen-day': {
    id: 'linen-day',
    themeGroup: 'linen',
    name: 'Linen Day',
    mode: 'light',
    vibe: 'Soft unbleached linen paper, gentle warm ivory cards, terracotta pigment, and soothing espresso typography',
    colors: {
      'background-0': '#F5F0E8',
      'background-1': '#EDE5DA',
      'background-2': '#E2D8CA',
      'borders': '#D8CDBC',
      'buttons': '#E8DFCFAF',
      'links': '#B85338',
      'sidebar': '#EFE8DE',
      'sidebar-text': '#29221C',
      'text-0': '#29221C',
      'text-1': '#52453B',
      'text-2': '#7A6B5F',
      'cards': '#FAF6EE',
      'accent': '#B85338',
      'accent-secondary': '#D46C51'
    },
    courseColors: {
      math: '#457354',
      stat: '#B85338',
      music: '#CFA33C',
      data: '#A84542',
      history: '#486A8C',
      fallback: ['#457354', '#B85338', '#CFA33C', '#A84542', '#486A8C', '#735381', '#387577', '#916342', '#526B59']
    }
  },
  'linen-night': {
    id: 'linen-night',
    themeGroup: 'linen',
    name: 'Linen Night',
    mode: 'dark',
    vibe: 'Warm soft espresso, cozy cocoa cards, and tactile terracotta accents',
    colors: {
      'background-0': '#26211C',
      'background-1': '#2F2923',
      'background-2': '#3A332C',
      'borders': '#4D4339',
      'buttons': '#352E27',
      'links': '#E57B60',
      'sidebar': '#211C17',
      'sidebar-text': '#F7F2EA',
      'text-0': '#F7F2EA',
      'text-1': '#D6C8B8',
      'text-2': '#A39382',
      'cards': '#2E2721',
      'accent': '#E57B60',
      'accent-secondary': '#C75D41'
    },
    courseColors: {
      math: '#5BA373',
      stat: '#E07A5F',
      music: '#E6BA54',
      data: '#D96660',
      history: '#6692BF',
      fallback: ['#5BA373', '#E07A5F', '#E6BA54', '#D96660', '#6692BF', '#9E77B0', '#4EA7A9', '#BF8A65', '#73967C']
    }
  },

  // ==========================================
  // 2. BLOSSOM (SAKURA & ROSEWOOD)
  // ==========================================
  'blossom-day': {
    id: 'blossom-day',
    themeGroup: 'blossom',
    name: 'Blossom Day',
    mode: 'light',
    vibe: 'Soft muted sakura mist, gentle warm petal cards, and soothing plum typography',
    colors: {
      'background-0': '#F6F0F3',
      'background-1': '#ECE2E8',
      'background-2': '#E1D3DC',
      'borders': '#D4C0CC',
      'buttons': '#E9DDE4AF',
      'links': '#AD3863',
      'sidebar': '#EDE3E9',
      'sidebar-text': '#2B1722',
      'text-0': '#2B1722',
      'text-1': '#553446',
      'text-2': '#7E556B',
      'cards': '#FAF5F8',
      'accent': '#C54173',
      'accent-secondary': '#DC6F85'
    },
    courseColors: {
      math: '#377E5E',
      stat: '#B84F30',
      music: '#C79A44',
      data: '#AD3863',
      history: '#456592',
      fallback: ['#377E5E', '#B84F30', '#C79A44', '#AD3863', '#456592', '#7D4D8E', '#327F78', '#9F623C', '#537560']
    }
  },
  'blossom-night': {
    id: 'blossom-night',
    themeGroup: 'blossom',
    name: 'Blossom Night',
    mode: 'dark',
    vibe: 'Soft twilight plum, deep velvet mauve cards, and luminous rose quartz accents',
    colors: {
      'background-0': '#261C23',
      'background-1': '#31242E',
      'background-2': '#3D2D39',
      'borders': '#533D4E',
      'buttons': '#362732',
      'links': '#F472B6',
      'sidebar': '#21171E',
      'sidebar-text': '#FCE7F3',
      'text-0': '#FFF0F5',
      'text-1': '#E2C4D5',
      'text-2': '#AD8C9F',
      'cards': '#2E212A',
      'accent': '#F472B6',
      'accent-secondary': '#FB7185'
    },
    courseColors: {
      math: '#4EAD82',
      stat: '#E87248',
      music: '#F0BD5A',
      data: '#F472B6',
      history: '#608BC4',
      fallback: ['#4EAD82', '#E87248', '#F0BD5A', '#F472B6', '#608BC4', '#B275C9', '#4EABA3', '#CE8756', '#72A384']
    }
  },

  // ==========================================
  // 3. DRACULA (TWILIGHT & MIDNIGHT)
  // ==========================================
  'dracula-day': {
    id: 'dracula-day',
    themeGroup: 'dracula',
    name: 'Dracula Day',
    mode: 'light',
    vibe: 'Soft ambient mist lilac, gentle pearl slate cards, and easy-on-the-eyes purple ink',
    colors: {
      'background-0': '#F4F1F8',
      'background-1': '#EAE4F2',
      'background-2': '#DED5E8',
      'borders': '#CCC1DB',
      'buttons': '#E7E0EFAF',
      'links': '#6F32D4',
      'sidebar': '#EBE5F3',
      'sidebar-text': '#221832',
      'text-0': '#221832',
      'text-1': '#4B3A63',
      'text-2': '#756391',
      'cards': '#FAF7FD',
      'accent': '#6F32D4',
      'accent-secondary': '#DB3B8B'
    },
    courseColors: {
      math: '#298E68',
      stat: '#C65F20',
      music: '#C69422',
      data: '#CF1941',
      history: '#443DCF',
      fallback: ['#298E68', '#C65F20', '#C69422', '#CF1941', '#443DCF', '#842DD6', '#0B8277', '#AE521A', '#3F7357']
    }
  },
  'dracula-night': {
    id: 'dracula-night',
    themeGroup: 'dracula',
    name: 'Dracula Night',
    mode: 'dark',
    vibe: 'Soft muted midnight slate, twilight cards, and vibrant luminous purple highlights',
    colors: {
      'background-0': '#232031',
      'background-1': '#2B283D',
      'background-2': '#36324D',
      'borders': '#4B466A',
      'buttons': '#302C44',
      'links': '#BD93F9',
      'sidebar': '#1E1B2B',
      'sidebar-text': '#F8F8F2',
      'text-0': '#F8F8F2',
      'text-1': '#B0B0CE',
      'text-2': '#7B7B9E',
      'cards': '#2A263B',
      'accent': '#BD93F9',
      'accent-secondary': '#FF79C6'
    },
    courseColors: {
      math: '#50FA7B',
      stat: '#FFB86C',
      music: '#F1FA8C',
      data: '#FF5555',
      history: '#8BE9FD',
      fallback: ['#50FA7B', '#FFB86C', '#F1FA8C', '#FF5555', '#8BE9FD', '#BD93F9', '#FF79C6', '#69FF94', '#CAA9E8']
    }
  },

  // ==========================================
  // 4. CUSTOM (USER TAILORED)
  // ==========================================
  'custom-day': {
    id: 'custom-day',
    themeGroup: 'custom',
    name: 'Custom Day',
    mode: 'light',
    vibe: 'Personalized daylight palette tailored to your custom color harmony',
    colors: {
      'background-0': '#F5F2EB',
      'background-1': '#EAE4D9',
      'background-2': '#DDD4C4',
      'borders': '#CFC4B2',
      'buttons': '#E4DBCBAF',
      'links': '#4A6FA5',
      'sidebar': '#ECE5DA',
      'sidebar-text': '#2A2521',
      'text-0': '#2A2521',
      'text-1': '#5A5149',
      'text-2': '#887B70',
      'cards': '#FAF7F2',
      'accent': '#4A6FA5',
      'accent-secondary': '#E07A5F'
    },
    courseColors: {
      math: '#377E5E',
      stat: '#E07A5F',
      music: '#C79A44',
      data: '#4A6FA5',
      history: '#7D4D8E',
      fallback: ['#377E5E', '#E07A5F', '#C79A44', '#4A6FA5', '#7D4D8E', '#327F78', '#9F623C', '#537560']
    }
  },
  'custom-night': {
    id: 'custom-night',
    themeGroup: 'custom',
    name: 'Custom Night',
    mode: 'dark',
    vibe: 'Personalized nocturnal palette tailored to your custom color harmony',
    colors: {
      'background-0': '#222329',
      'background-1': '#2B2C34',
      'background-2': '#353742',
      'borders': '#464958',
      'buttons': '#2F313B',
      'links': '#6C94D4',
      'sidebar': '#1C1D23',
      'sidebar-text': '#EDEDF2',
      'text-0': '#EDEDF2',
      'text-1': '#B8BAC7',
      'text-2': '#828599',
      'cards': '#282A33',
      'accent': '#6C94D4',
      'accent-secondary': '#F28B72'
    },
    courseColors: {
      math: '#5BA373',
      stat: '#F28B72',
      music: '#E6BA54',
      data: '#6C94D4',
      history: '#9E77B0',
      fallback: ['#5BA373', '#F28B72', '#E6BA54', '#6C94D4', '#9E77B0', '#4EA7A9', '#BF8A65', '#73967C']
    }
  },
  // ==========================================
  // COOLORS POPULAR PREMADE PALETTES
  // ==========================================
  'pal-coastline': {
    id: 'pal-coastline',
    name: 'Coastline',
    isPremade: true,
    mode: 'dark',
    vibe: 'Warm coastal teal, saffron gold, and burnt sienna derived from Coolors popular palettes',
    colors: {
      'background-0': '#1F3843',
      'background-1': '#192E37',
      'background-2': '#264653',
      'cards': '#223D49',
      'sidebar': '#14252D',
      'sidebar-text': '#F8F9FA',
      'borders': '#325868',
      'buttons': '#264653',
      'accent': '#F4A261',
      'links': '#E76F51',
      'text-0': '#F8F9FA',
      'text-1': '#D6DFE2',
      'text-2': '#A1B5BC'
    },
    courseColors: {
      math: '#2A9D8F',
      stat: '#E76F51',
      data: '#F4A261',
      music: '#E9C46A',
      history: '#2A9D8F',
      fallback: ['#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#3D7486', '#457B9D']
    }
  },
  'pal-terracotta': {
    id: 'pal-terracotta',
    name: 'Terracotta Sun',
    isPremade: true,
    mode: 'dark',
    vibe: 'Rich roasted espresso, vibrant terracotta, burnt sienna, and golden peach',
    colors: {
      'background-0': '#211714',
      'background-1': '#1A1210',
      'background-2': '#2D1F1B',
      'cards': '#281C18',
      'sidebar': '#160E0D',
      'sidebar-text': '#FAF0E6',
      'borders': '#443029',
      'buttons': '#382520',
      'accent': '#E27D60',
      'links': '#E8A87C',
      'text-0': '#FAF0E6',
      'text-1': '#E0D2C7',
      'text-2': '#A8998E'
    },
    courseColors: {
      math: '#E27D60',
      stat: '#E8A87C',
      data: '#C38D9E',
      music: '#41B3A3',
      history: '#85DCB0',
      fallback: ['#E27D60', '#E8A87C', '#C38D9E', '#41B3A3', '#85DCB0', '#DDA15E']
    }
  },
  'pal-midnight-plum': {
    id: 'pal-midnight-plum',
    name: 'Midnight Plum',
    isPremade: true,
    mode: 'dark',
    vibe: 'Moody velvet violet, dusky rose, blush pink, and antique lavender',
    colors: {
      'background-0': '#1A1423',
      'background-1': '#140F1B',
      'background-2': '#261C33',
      'cards': '#22192E',
      'sidebar': '#100B16',
      'sidebar-text': '#FBF5F8',
      'borders': '#3E2E52',
      'buttons': '#2C203B',
      'accent': '#B5838D',
      'links': '#E5989B',
      'text-0': '#FBF5F8',
      'text-1': '#DFD3DD',
      'text-2': '#A394A1'
    },
    courseColors: {
      math: '#B5838D',
      stat: '#E5989B',
      data: '#6D597A',
      music: '#FFB4A2',
      history: '#355070',
      fallback: ['#B5838D', '#E5989B', '#6D597A', '#FFB4A2', '#355070', '#9A8C98']
    }
  },
  'pal-nordic-slate': {
    id: 'pal-nordic-slate',
    name: 'Nordic Slate',
    isPremade: true,
    mode: 'dark',
    vibe: 'Clean polar charcoal, arctic cyan, soft periwinkle, and mint frost',
    colors: {
      'background-0': '#151922',
      'background-1': '#10141B',
      'background-2': '#1D2330',
      'cards': '#19202B',
      'sidebar': '#0C0E14',
      'sidebar-text': '#F0F6FC',
      'borders': '#2B3547',
      'buttons': '#222B3A',
      'accent': '#38BDF8',
      'links': '#818CF8',
      'text-0': '#F0F6FC',
      'text-1': '#C9D1D9',
      'text-2': '#8B949E'
    },
    courseColors: {
      math: '#38BDF8',
      stat: '#818CF8',
      data: '#34D399',
      music: '#F472B6',
      history: '#FBBF24',
      fallback: ['#38BDF8', '#818CF8', '#34D399', '#F472B6', '#FBBF24', '#A78BFA']
    }
  },
  'pal-matcha-latte': {
    id: 'pal-matcha-latte',
    name: 'Matcha Latte',
    isPremade: true,
    mode: 'dark',
    vibe: 'Organic deep forest, soft eucalyptus, sage leaf, and warm bamboo gold',
    colors: {
      'background-0': '#19221B',
      'background-1': '#131A15',
      'background-2': '#233026',
      'cards': '#1E2920',
      'sidebar': '#0E140F',
      'sidebar-text': '#F4F7F4',
      'borders': '#334437',
      'buttons': '#28362B',
      'accent': '#A3C9A8',
      'links': '#84B59F',
      'text-0': '#F4F7F4',
      'text-1': '#D5E0D6',
      'text-2': '#96A898'
    },
    courseColors: {
      math: '#A3C9A8',
      stat: '#84B59F',
      data: '#69B578',
      music: '#DDB771',
      history: '#C27BA0',
      fallback: ['#A3C9A8', '#84B59F', '#69B578', '#DDB771', '#C27BA0', '#5B8E7D']
    }
  }
};

var DEFAULT_PRESET_ID = 'linen-day';

if (typeof window !== 'undefined') {
  window.PRESETS = PRESETS;
  window.DEFAULT_PRESET_ID = DEFAULT_PRESET_ID;
}
if (typeof globalThis !== 'undefined') {
  globalThis.PRESETS = PRESETS;
  globalThis.DEFAULT_PRESET_ID = DEFAULT_PRESET_ID;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRESETS, DEFAULT_PRESET_ID };
}
