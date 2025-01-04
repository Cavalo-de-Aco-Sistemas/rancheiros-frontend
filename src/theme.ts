import { createTheme, MantineColorsTuple } from '@mantine/core';

const brand: MantineColorsTuple = [
  '#fff6e3',
  '#f9ecd3',
  '#eed7ab',
  '#e3c27f',
  '#daaf5a',
  '#d5a342',
  '#d39d34',
  '#ba8926',
  '#a6791d',
  '#906810',
];

export const theme = createTheme({
  colors: {
    brand,
  },
  primaryColor: 'brand',
  primaryShade: 4,
  autoContrast: true,
  headings: {
    fontFamily: 'Rye, serif',
    fontWeight: 'regular',
  },
});
