import type { MenuOption } from 'naive-ui';
import { RenderUtils } from '@src/utils/render';
import {
  DocumentSync24Regular,
  TagLock32Regular,
  DocumentArrowRight20Regular,
} from '@vicons/fluent';
import {
  DashboardOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  UnlockOutlined,
  FileSyncOutlined,
} from '@vicons/antd';

const { renderIcon: renderMenuIcon, renderMenuLabel } = RenderUtils;

export const menuOptions: MenuOption[] = [
  {
    label: renderMenuLabel('Dashboard'),
    key: 'dashboard',
    icon: renderMenuIcon(DashboardOutlined),
  },
  {
    label: renderMenuLabel('System Setting'),
    key: 'system-setting',
    icon: renderMenuIcon(SettingOutlined),
    children: [
      {
        label: renderMenuLabel('Users'),
        key: 'users',
        icon: renderMenuIcon(UserOutlined),
        // show: false,
      },
      {
        label: renderMenuLabel('Permissions'),
        key: 'permissions',
        icon: renderMenuIcon(TagLock32Regular),
        // show: false,
      },
      {
        label: renderMenuLabel('Roles'),
        key: 'roles',
        icon: renderMenuIcon(UnlockOutlined),
        // show: false,
      },
    ],
  },
  {
    label: renderMenuLabel('companies'),
    key: 'companies',
    icon: renderMenuIcon(BarChartOutlined),
    // show: false,
  },
  {
    label: renderMenuLabel('Booking'),
    key: 'booking',
    icon: renderMenuIcon(DocumentSync24Regular),
    // show: false,
    children: [
      {
        label: renderMenuLabel('List'),
        key: 'booking_list',
        icon: renderMenuIcon(FileSyncOutlined),
        // show: false,
      },
      {
        label: renderMenuLabel('Add'),
        key: 'booking_add',
        icon: renderMenuIcon(DocumentArrowRight20Regular),
        // show: false,
      },
    ],
  },
];
