import { useCallback, useMemo, useState } from 'react';
import { IconMapPin, IconDownload } from '@tabler/icons-react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { ActionIcon, Switch, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { CRUDTable, CustomAction } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';
import { Class } from '@/model/class';
import { useClassToggleActiveMutation } from '@/mutations/useClassToggleActiveMutation';
import { extractData } from '@/utils/dataUtils';
import { dateBR } from '@/utils/dates';
import { generateEnrollmentCSV, generateEnrollmentPDF } from '@/utils/enrollmentReports';

const tableHeaders = ['Local do MPV', 'Data', 'Link do Maps', 'Ativo'];

export function ClassesTable() {
  const { query } = useCRUD();
  const { axiosInstance } = useAuth();
  const toggleActiveMutation = useClassToggleActiveMutation();
  const [downloadingClassId, setDownloadingClassId] = useState<string | null>(null);

  const handleToggleActive = useCallback(
    (classItem: Class) => {
      toggleActiveMutation.mutate({
        classId: classItem.id,
        active: !classItem.active,
      });
    },
    [toggleActiveMutation]
  );

  const handleDownloadEnrollments = useCallback(
    async (classItem: Class, format: 'csv' | 'pdf') => {
      try {
        setDownloadingClassId(classItem.id);
        
        // Buscar as inscrições confirmadas usando o axiosInstance
        const response = await axiosInstance.get(`${BACKEND_ADDRESS}/enrollments/confirmed/class/${classItem.id}`);
        const enrollments = response.data; // A API retorna diretamente um array
        
        // Verificar se enrollments é um array
        if (!Array.isArray(enrollments)) {
          throw new Error(`Resposta da API não é um array de inscrições. Tipo recebido: ${typeof enrollments}`);
        }
        
        // Verificar se há inscrições confirmadas
        if (enrollments.length === 0) {
          notifications.show({
            title: 'Nenhuma inscrição confirmada',
            message: `Não há inscrições confirmadas para a turma de ${classItem.location?.name || 'local não informado'} em ${dateBR(classItem.date) || 'data não informada'}.`,
            color: 'orange',
            autoClose: 5000,
          });
          return;
        }
        
        const reportData = {
          class: classItem,
          enrollments,
        };
        
        if (format === 'csv') {
          generateEnrollmentCSV(reportData);
        } else {
          generateEnrollmentPDF(reportData);
        }
        
        // Notificação de sucesso
        notifications.show({
          title: 'Download realizado com sucesso',
          message: `Lista de ${enrollments.length} inscrição(ões) confirmada(s) baixada em formato ${format.toUpperCase()}.`,
          color: 'green',
          autoClose: 3000,
        });
      } catch (error) {
        console.error('Erro ao baixar inscrições:', error);
        notifications.show({
          title: 'Erro ao baixar lista',
          message: error instanceof Error ? error.message : 'Ocorreu um erro inesperado ao baixar a lista de inscrições.',
          color: 'red',
          autoClose: 5000,
        });
      } finally {
        setDownloadingClassId(null);
      }
    },
    [axiosInstance]
  );


  const columns = useMemo<MRT_ColumnDef<Class>[]>(
    () => [
      { accessorKey: 'location.name', header: 'Local do MPV' },
      {
        accessorKey: 'date',
        header: 'Data',
        Cell: ({ row }) => dateBR(row.original.date),
      },
      {
        accessorKey: 'mapsLink',
        header: 'Link do Maps',
        Cell: ({ row }) => {
          const mapsLink = row.original.mapsLink;
          if (!mapsLink) {return null;}

          return (
            <Tooltip label="Abrir no Google Maps" position="top">
              <ActionIcon
                variant="subtle"
                color="blue"
                size="sm"
                onClick={() => window.open(mapsLink, '_blank', 'noopener,noreferrer')}
              >
                <IconMapPin size={16} />
              </ActionIcon>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: 'active',
        header: 'Ativo',
        Cell: ({ row }) => (
          <Switch
            checked={row.original.active}
            onChange={() => handleToggleActive(row.original)}
            disabled={toggleActiveMutation.isPending}
            size="sm"
            color="green"
          />
        ),
      },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      (extractData(query.data) as unknown as Class[]).map(
        ({ location, date, mapsLink, active }) => ({
          'Local do MPV': location?.name,
          Data: date,
          'Link do Maps': mapsLink,
          Ativo: active,
        })
      ),
    [query.data]
  );

  const rowMapper = useCallback((row: MRT_Row<Class>) => {
    const { location, date, mapsLink, active } = row.original;
    return [location?.name ?? '', dateBR(date) ?? '', mapsLink, active];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  const customActions: CustomAction<Class>[] = useMemo(() => [
    {
      label: 'Baixar Lista de Confirmados (PDF)',
      icon: IconDownload,
      color: 'blue',
      onClick: (classItem: Class) => {
        handleDownloadEnrollments(classItem, 'pdf');
      },
      isVisible: () => true,
    },
  ], [handleDownloadEnrollments]);

  return (
    <CRUDTable 
      columns={columns} 
      title="Turmas" 
      csvData={csvData} 
      pdfConfig={pdfConfig} 
      customActions={customActions}
      emptyStateMessage="Nenhuma turma encontrada"
      emptyStateDescription="As turmas aparecerão aqui conforme forem sendo criadas"
    />
  );
}
