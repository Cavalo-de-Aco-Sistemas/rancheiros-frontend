import { Button, Center, Container, Text, Title } from '@mantine/core';
import { Illustration } from './Illustration';
import classes from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Não encontramos o que você está procurando</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            A página que você está tentando abrir não existe. Verifique o endereço ou vá para a
            página inicial.
          </Text>
          <Center>
            <Button href="/" component="a" size="md">
              Ir para página inicial
            </Button>
          </Center>
        </div>
      </div>
    </Container>
  );
}
