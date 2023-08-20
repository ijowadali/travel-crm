/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_URL: string;
  readonly VITE_PORT: string;
  readonly VITE_API_URL: string;
  readonly VITE_UPLOAD_URL: string;
  readonly VITE_IMG_URL: string;
  readonly VITE_API_PREFIX: string;
  readonly VITE_TEAM_NAME: string;
  readonly VITE_GITHUB_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
