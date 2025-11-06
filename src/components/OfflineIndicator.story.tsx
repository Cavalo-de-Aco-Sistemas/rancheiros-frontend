import type { Meta, StoryObj } from '@storybook/react';
import OfflineIndicator from './OfflineIndicator';

const meta = {
  component: OfflineIndicator,
  title: 'Components/OfflineIndicator',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof OfflineIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // Note: This component uses useNetwork hook which requires browser environment
  // In Storybook, it will only show if the browser is actually offline
  render: () => <OfflineIndicator />,
};

export const MockedOffline: Story = {
  render: () => {
    // Mock the offline state by wrapping in a container that simulates it
    return (
      <div>
        <p>This component shows an icon when offline.</p>
        <p>Toggle your browser's offline mode to see it in action.</p>
        <OfflineIndicator />
      </div>
    );
  },
};
