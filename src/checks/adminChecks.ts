import { useUserStore } from '@src/store/modules/user';

const userStore = useUserStore();

// check for all super admins users to access some thing or not
export const isSuperAdminUser = () => {
  if (userStore.hasData()) {
    if (userStore.currentUser.company_id === null) {
      return false;
    } else {
      return true;
    }
  } else {
    window['$message'].error('Current does not exist');
  }
};

// check only super admin
export const isSuperAdmin = () => {
  if (userStore.hasData()) {
    const isSuperAdmin = userStore.roles.some((item: any) => {
      return item.name === 'super admin';
    });

    return isSuperAdmin;
  } else {
    window['$message'].error('User Store has not current user data!');
    return false;
  }
};

// check only vendor
export const isCompnayAdmin = () => {
  if (userStore.hasData()) {
    const isSuperAdmin = userStore.roles.some((item: any) => {
      return item.name === 'company admin';
    });

    return isSuperAdmin;
  } else {
    window['$message'].error('User Store has not current user data!');
    return false;
  }
};
