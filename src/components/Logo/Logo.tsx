import { Group, px, Title, TitleOrder } from '@mantine/core';
import logo from '@/assets/logo.webp';

export function Logo({ order = 2 }: { order?: TitleOrder }) {
  return (
    <Group gap="xs" justify="center">
      <img
        src={logo}
        alt="RANCHEIROS MC"
        /** width
         * order 6 = 8px
         * order 5 = 16px
         * order 4 = 24px
         * ...
         * order 1 = 48px
         */
        width={px((7 - order) * 8)}
      />
      <Title order={order} ta="center" tt="uppercase">
        RANCHEIROS MC
      </Title>
    </Group>
  );
}
