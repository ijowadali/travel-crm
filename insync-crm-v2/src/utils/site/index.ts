import { useTitle } from '@vueuse/core';
import { useEnv } from '@src/hooks/useEnv';

const { appTitle } = useEnv();

export class SiteUtils {
  static setDocumentTitle(title?: string | (() => string)) {
    if (!title) {
      useTitle(appTitle);
    } else {
      useTitle(typeof title === 'function' ? title() : title, {
        titleTemplate: `%s | ${appTitle}`,
      });
    }
  }
}
