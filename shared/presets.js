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
