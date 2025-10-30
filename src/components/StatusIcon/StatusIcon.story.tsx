import type { Meta, StoryObj } from '@storybook/react';
import { Group } from '@mantine/core';
import { StatusIcon } from './index';
import { EnrollmentStatus } from '@/model/enrollment';

const meta = {
  component: StatusIcon,
  title: 'Components/StatusIcon',
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        EnrollmentStatus.WAITING,
        EnrollmentStatus.CALLED,
        EnrollmentStatus.DROPPED,
        EnrollmentStatus.CONFIRMED,
        EnrollmentStatus.CERTIFIED,
        EnrollmentStatus.MISSED,
        EnrollmentStatus.IGNORED,
      ],
    },
  },
} satisfies Meta<typeof StatusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Waiting: Story = {
  args: {
    status: EnrollmentStatus.WAITING,
  },
};

export const Called: Story = {
  args: {
    status: EnrollmentStatus.CALLED,
  },
};

export const Dropped: Story = {
  args: {
    status: EnrollmentStatus.DROPPED,
  },
};

export const Confirmed: Story = {
  args: {
    status: EnrollmentStatus.CONFIRMED,
  },
};

export const Certified: Story = {
  args: {
    status: EnrollmentStatus.CERTIFIED,
  },
};

export const Missed: Story = {
  args: {
    status: EnrollmentStatus.MISSED,
  },
};

export const Ignored: Story = {
  args: {
    status: EnrollmentStatus.IGNORED,
  },
};

export const AllStatuses: Story = {
  args: { status: EnrollmentStatus.WAITING },
  render: () => (
    <Group>
      <StatusIcon status={EnrollmentStatus.WAITING} />
      <StatusIcon status={EnrollmentStatus.CALLED} />
      <StatusIcon status={EnrollmentStatus.DROPPED} />
      <StatusIcon status={EnrollmentStatus.CONFIRMED} />
      <StatusIcon status={EnrollmentStatus.CERTIFIED} />
      <StatusIcon status={EnrollmentStatus.MISSED} />
      <StatusIcon status={EnrollmentStatus.IGNORED} />
    </Group>
  ),
  name: 'All Statuses Together',
};
