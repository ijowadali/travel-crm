import * as NaiveUI from 'naive-ui';
import { computed } from 'vue';

export function setupNaiveDiscreteApi() {
  const configProviderPropsRef = computed(() => ({
    theme: NaiveUI.darkTheme,
    themeOverrides: {
      common: {
        primaryColor: '#e5e5e5'
      },
      LoadingBar: {
        colorLoading: 'red'
      }
    }
  }));
  const { message, dialog, notification, loadingBar } = NaiveUI.createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    {
      configProviderProps: configProviderPropsRef
    }
  );

  window['$message'] = message;
  window['$dialog'] = dialog;
  window['$notification'] = notification;
  window['$loading'] = loadingBar;
}
