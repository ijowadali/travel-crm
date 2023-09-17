import type { App } from 'vue';

import { permission } from '@src/directives/permission';

export async function setupDirectives(app: App) {
  // permission control command (demo)
  app.directive('permission', permission);
}
