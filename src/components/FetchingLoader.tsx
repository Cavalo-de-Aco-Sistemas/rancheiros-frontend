import { useIsFetching } from '@tanstack/react-query';
import { Loader } from '@mantine/core';

/**
 * Displays a loading indicator when there are active queries in the application
 */
export default function FetchingLoader() {
  const isFetching = useIsFetching();

  if (!isFetching) {
    return null;
  }

  return <Loader type="dots" />;
}
