import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_CLASSES } from '@/graphql/classes';
import { Class } from '@/model/class';
import {
  buildGroupedClassFilterOptions,
  CLASS_FILTER_SELECT_PROPS,
  GroupedClassSelectData,
} from '@/utils/classSelectOptions';
import { extractData } from '@/utils/dataUtils';

export function useClassFilterOptions(): GroupedClassSelectData {
  const { data } = useQuery(GET_ACTIVE_CLASSES);

  return useMemo(
    () => buildGroupedClassFilterOptions(extractData<Class>(data?.activeClasses)),
    [data?.activeClasses]
  );
}

export { CLASS_FILTER_SELECT_PROPS };
