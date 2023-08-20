import { darkTheme, lightTheme } from 'naive-ui';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { darkThemeOverrides, lightThemeOverrides } from '@src/constants/theme';
import type { Theme } from '@src/types/theme';
import { ThemeUtils } from '@src/utils/theme';

export const useThemeStore = defineStore('theme', () => {
  const themeMode = ref<Theme>(ThemeUtils.getDefaultThemeMode());

  const theme = computed(() =>
    themeMode.value === 'light' ? lightTheme : darkTheme
  );

  const themeOverrides = computed(() =>
    themeMode.value === 'light' ? lightThemeOverrides : darkThemeOverrides
  );

  const changeThemeMode = (selectedTheme: Theme) => {
    themeMode.value = selectedTheme;
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      ThemeUtils.setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      ThemeUtils.setTheme('light');
    }
  };

  changeThemeMode(ThemeUtils.getDefaultThemeMode());

  return {
    themeMode,
    theme,
    themeOverrides,
    changeThemeMode,
  };
});
