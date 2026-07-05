import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_CLASSES } from '@/graphql/classes';
import { Class } from '@/model/class';
import {
  buildGroupedClassSelectOptions,
  GroupedClassSelectData,
} from '@/utils/classSelectOptions';
import { extractData } from '@/utils/dataUtils';

export function useClassAssignOptions(): GroupedClassSelectData {
  const { data } = useQuery(GET_ACTIVE_CLASSES);

  return useMemo(
    () => buildGroupedClassSelectOptions(extractData<Class>(data?.activeClasses)),
    [data?.activeClasses]
  );
}
