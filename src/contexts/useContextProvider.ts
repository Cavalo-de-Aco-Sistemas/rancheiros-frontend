import { useContext } from 'react';

/**
 * Helper to retrieve the value of a React context
 * 
 * @param context - The context to retrieve the value from
 * @param hookName - The name of the hook, for message purposes
 * @param providerName - The name of the context, for message purposes
 * @returns the value of the context
 * @throws an error if the hook is not used within the specified provider
 */
export function useContextProvider<T>(
  context: React.Context<T>,
  hookName: string,
  providerName: string
) {
  const contextValue = useContext(context);
  if (!contextValue) {
    throw new Error(`${hookName} must be used within a ${providerName}`);
  }
  return contextValue;
}
