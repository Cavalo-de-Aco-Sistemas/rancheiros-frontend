import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PasswordStrength } from './index';

const meta = {
  component: PasswordStrength,
  title: 'Components/PasswordStrength',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
    },
  },
} satisfies Meta<typeof PasswordStrength>;

export default meta;
type Story = StoryObj<typeof PasswordStrength>;

function InteractivePassword() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  return (
    <PasswordStrength
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      setPasswordStrength={setStrength}
      label="Senha"
      placeholder="Digite sua senha"
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractivePassword />,
};

export const WeakPassword: Story = {
  render: () => {
    const [strength, setStrength] = useState(0);
    return <PasswordStrength value="abc" setPasswordStrength={setStrength} />;
  },
};

export const MediumPassword: Story = {
  render: () => {
    const [strength, setStrength] = useState(0);
    return <PasswordStrength value="Password123" setPasswordStrength={setStrength} />;
  },
};

export const StrongPassword: Story = {
  render: () => {
    const [strength, setStrength] = useState(0);
    return <PasswordStrength value="SecurePassword123!" setPasswordStrength={setStrength} />;
  },
};
