import type { GlobalThemeOverrides } from 'naive-ui';

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0078D7',
    primaryColorHover: '#0078D7',
    primaryColorPressed: '#0078D7',
    primaryColorSuppl: '#0078D7'
  },
  Layout: {
    color: 'red'
  },
  Dialog: {
    contentMargin: '20px 0 0 0',
    padding: '20px'
  },
  Card: {
    borderRadius: '8px'
  }
};

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#0078D7',
    primaryColorHover: '#0078D7',
    primaryColorPressed: '#0078D7',
    primaryColorSuppl: '#0078D7'
  },
  Layout: {
    color: '#000000'
  },
  Dialog: {
    contentMargin: '20px 0 0 0',
    padding: '20px'
  },
  Card: {
    borderRadius: '8px'
  }
};
