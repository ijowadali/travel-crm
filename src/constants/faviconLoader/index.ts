import { appSetting } from '@src/hooks/useAppSetting';

export const faviconLoader = () => {
  const { favicon } = appSetting;
  const DEFAULT_FAVICON_URL = '/favicon.ico';

  // NOTE: If not set a favicon, use the default favicon.
  const faviconUrl = favicon ?? DEFAULT_FAVICON_URL;

  // NOTE: Link element should use `HTMLLinkElement` type.
  let faviconElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

  if (faviconElement !== null) {
    faviconElement.href = faviconUrl;
  } else {
    faviconElement = document.createElement('link');
    faviconElement.rel = 'icon';
    faviconElement.href = faviconUrl;
    document.head.appendChild(faviconElement);
  }
};
