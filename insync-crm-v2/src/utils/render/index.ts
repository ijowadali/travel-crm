import { h } from 'vue';
import { NEllipsis, NIcon } from 'naive-ui';

export class RenderUtils {
  static renderMenuLabel(label: string) {
    return () =>
      h(
        NEllipsis,
        {
          tooltip: {
            placement: 'right',
            showArrow: false,
          },
          class: 'select-none',
        },
        {
          default: () => label,
        }
      );
  }

  static renderIcon(icon: any, size: number = 16, options?: any) {
    return () =>
      h(
        NIcon,
        {
          size,
          ...options,
        },
        {
          default: () => h(icon),
        }
      );
  }
}
