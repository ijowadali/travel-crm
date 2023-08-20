import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: any;
    disableAuth?: boolean;
    dismissTab?: boolean;
  }
}
