import { useEffect, useMemo } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import {
  Box,
  Center,
  Group,
  PasswordInput,
  PasswordInputProps,
  Progress,
  Text,
} from '@mantine/core';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Inclui número' },
  { re: /[a-z]/, label: 'Inclui letra minúscula' },
  { re: /[A-Z]/, label: 'Inclui letra maiúscula' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Inclui símbolo' },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

interface PasswordStrengthProps extends PasswordInputProps {
  setPasswordStrength: (strength: number) => void;
}

export function PasswordStrength(props: PasswordStrengthProps) {
  const { setPasswordStrength, value: rawValue, ...rest } = props;
  const value = typeof rawValue === 'string' ? rawValue : '';

  const strength = useMemo(() => getStrength(value), [value]);

  useEffect(() => {
    setPasswordStrength(strength);
  }, [strength, setPasswordStrength]);

  const checks = requirements.map((requirement) => (
    <PasswordRequirement
      key={requirement.label}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: '0ms' } }}
        value={
          value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
        }
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
      />
    ));

  return (
    <div>
      <PasswordInput {...rest} value={value} />

      <Group gap={5} grow mt="xs" mb="md">
        {bars}
      </Group>

      <PasswordRequirement label="Tem pelo menos 6 caracteres" meets={value.length > 5} />
      {checks}
    </div>
  );
}
