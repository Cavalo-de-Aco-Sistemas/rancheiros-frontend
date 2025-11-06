import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@mantine/core';
import {
  IconEdit,
  IconEditOff,
  IconEye,
  IconEyeOff,
  IconStar,
  IconStarOff,
  IconTrash,
  IconTrashOff,
} from '@tabler/icons-react';
import { Permissions } from '@/model/user';

// Extract PermissionRow component logic
function PermissionRow({ permission }: { permission: Permissions | undefined }) {
  if (!permission) {
    return (
      <Group>
        <IconStarOff stroke={1} color="gray" />
        <IconEyeOff stroke={1} color="gray" />
        <IconEditOff stroke={1} color="gray" />
        <IconTrashOff stroke={1} color="gray" />
      </Group>
    );
  }

  return (
    <Group>
      {permission.create ? <IconStar stroke={1.5} /> : <IconStarOff stroke={1} color="gray" />}
      {permission.read ? <IconEye stroke={1.5} /> : <IconEyeOff stroke={1} color="gray" />}
      {permission.update ? <IconEdit stroke={1.5} /> : <IconEditOff stroke={1} color="gray" />}
      {permission.delete ? <IconTrash stroke={1.5} /> : <IconTrashOff stroke={1} color="gray" />}
    </Group>
  );
}

const meta = {
  component: PermissionRow,
  title: 'Components/PermissionRow',
  argTypes: {
    permission: {
      control: 'object',
    },
  },
} satisfies Meta<typeof PermissionRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllPermissionsGranted: Story = {
  args: {
    permission: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
};

export const ReadOnly: Story = {
  args: {
    permission: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
  },
};

export const ReadAndUpdate: Story = {
  args: {
    permission: {
      create: false,
      read: true,
      update: true,
      delete: false,
    },
  },
};

export const NullPermissions: Story = {
  args: {
    permission: undefined,
  },
};
