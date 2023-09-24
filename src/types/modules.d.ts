declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

declare module 'virtual:*' {
  const result: any;
  export default result;
}

declare type Recordable<T = any> = Record<string, T>;

interface Window {
  $message: any;
  $dialog: any;
  $notification: any;
  $loading: any;
}
