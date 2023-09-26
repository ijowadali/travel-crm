import { useUserStore } from '@src/store/modules/user';

export function usePermission() {
  const userStore = useUserStore();

  /**
   * Check permissions
   * @param accesses
   */
  function _somePermissions(accesses: string[]) {
    return userStore.permissions.some((item: any) => {
      // console.log('permission access list =>', item);
      return accesses.includes(item);
    });
  }

  /**
   * Determine whether permissions exist
   * Can be used for v-if display logic
   * */
  function hasPermission(accesses: string[]): boolean {
    if (!accesses || !accesses.length) return true;
    if (
      userStore.currentUser.roles.map((role: any) => {
        role.name === 'super admin';
      })
    ) {
      return true;
    } else {
      // console.log('you do not permission to access this route');
      return _somePermissions(accesses);
    }
  }

  return { hasPermission };
}
