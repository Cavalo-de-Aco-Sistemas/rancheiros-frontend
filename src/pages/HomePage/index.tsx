import { Group } from '@mantine/core';
import logo from '@/assets/logogray.webp';

export default function HomePage() {
  return (
    <Group justify="center" align="center" h="calc(100vh - 70px)">
      <img src={logo} alt="RANCHEIROS MC" width={400} style={{ opacity: 0.5 }} />
    </Group>
  );
}
