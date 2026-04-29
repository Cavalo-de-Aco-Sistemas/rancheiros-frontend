import { Tabs } from '@mantine/core';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_ENROLLMENT_SUMMARY_BY_CLASS } from '@/graphql/enrollments';
import { HomeSummaryTable } from './HomeSummaryTable';

export default function HomePage() {
  return (
    <Tabs defaultValue="future" keepMounted>
      <Tabs.List>
        <Tabs.Tab value="future">Próximas</Tabs.Tab>
        <Tabs.Tab value="past">Anteriores</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="future" pt="md">
        <GraphQLCRUDProvider
          query={GET_ENROLLMENT_SUMMARY_BY_CLASS}
          dataKey="enrollmentSummaryByClass"
          enablePagination
          additionalVariables={{ classDateBucket: 'FUTURE' }}
        >
          <HomeSummaryTable title="Próximas turmas" />
        </GraphQLCRUDProvider>
      </Tabs.Panel>

      <Tabs.Panel value="past" pt="md">
        <GraphQLCRUDProvider
          query={GET_ENROLLMENT_SUMMARY_BY_CLASS}
          dataKey="enrollmentSummaryByClass"
          enablePagination
          additionalVariables={{ classDateBucket: 'PAST' }}
        >
          <HomeSummaryTable title="Turmas anteriores" />
        </GraphQLCRUDProvider>
      </Tabs.Panel>
    </Tabs>
  );
}
