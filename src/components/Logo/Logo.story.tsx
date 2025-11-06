import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@mantine/core';
import { Logo } from './Logo';

const meta = {
  component: Logo,
  title: 'Components/Logo',
  tags: ['autodocs'],
  argTypes: {
    order: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'The title order (size)',
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    order: 2,
  },
};

export const Large: Story = {
  args: {
    order: 1,
  },
};

export const Medium: Story = {
  args: {
    order: 3,
  },
};

export const Small: Story = {
  args: {
    order: 5,
  },
};

export const AllSizes: Story = {
  render: () => (
    <Stack gap="xl">
      <Logo order={1} />
      <Logo order={2} />
      <Logo order={3} />
      <Logo order={4} />
      <Logo order={5} />
      <Logo order={6} />
    </Stack>
  ),
  name: 'All Sizes Together',
};
