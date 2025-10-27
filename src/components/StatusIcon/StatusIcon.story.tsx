import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@mantine/core';
import { StatusIcon } from './index';

const meta = {
  component: StatusIcon,
  title: 'Components/StatusIcon',
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['waiting', 'called', 'dropped', 'confirmed', 'certified', 'missed', 'ignored'],
    },
  },
} satisfies Meta<typeof StatusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Waiting: Story = {
  args: {
    status: 'waiting',
  },
};

export const Called: Story = {
  args: {
    status: 'called',
  },
};

export const Dropped: Story = {
  args: {
    status: 'dropped',
  },
};

export const Confirmed: Story = {
  args: {
    status: 'confirmed',
  },
};

export const Certified: Story = {
  args: {
    status: 'certified',
  },
};

export const Missed: Story = {
  args: {
    status: 'missed',
  },
};

export const Ignored: Story = {
  args: {
    status: 'ignored',
  },
};

export const AllStatuses: Story = {
  render: () => (
    <Group>
      <StatusIcon status="waiting" />
      <StatusIcon status="called" />
      <StatusIcon status="dropped" />
      <StatusIcon status="confirmed" />
      <StatusIcon status="certified" />
      <StatusIcon status="missed" />
      <StatusIcon status="ignored" />
    </Group>
  ),
  name: 'All Statuses Together',
};
