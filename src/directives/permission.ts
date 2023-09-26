import type { ObjectDirective } from 'vue';
import { usePermission } from '@src/hooks/permission/usePermission';

export const permission: ObjectDirective = {
  mounted(el: HTMLButtonElement, binding) {
    if (binding.value == undefined) return;
    const { action } = binding.value;
    const { hasPermission } = usePermission();
    if (!hasPermission(action)) {
      el.remove();
    }
  }
};
