import { useCallback, useMemo, useState } from 'react';
import { IconMapPin, IconDownload } from '@tabler/icons-react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { ActionIcon, Switch, Tooltip, Menu, rem } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';
import { Class } from '@/model/class';
import { useClassToggleActiveMutation } from '@/mutations/useClassToggleActiveMutation';
import { extractData } from '@/utils/dataUtils';
import { dateBR } from '@/utils/dates';
import { generateEnrollmentCSV, generateEnrollmentPDF } from '@/utils/enrollmentReports';

const tableHeaders = ['Local do MPV', 'Data', 'Link do Maps', 'Ativo', 'Ações'];

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
        
        const reportData = {
          class: classItem,
          enrollments,
        };
        
        if (format === 'csv') {
          generateEnrollmentCSV(reportData);
        } else {
          generateEnrollmentPDF(reportData);
        }
      } catch (error) {
        console.error('Erro ao baixar inscrições:', error);
        // Aqui você pode adicionar uma notificação de erro
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
      {
        accessorKey: 'actions',
        header: 'Ações',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const isDownloading = downloadingClassId === row.original.id;
          
          return (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon 
                  variant="subtle" 
                  color="blue" 
                  size="sm"
                  loading={isDownloading}
                >
                  <IconDownload size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Baixar Inscrições Confirmadas</Menu.Label>
                <Menu.Item
                  leftSection={<IconDownload style={{ width: rem(16), height: rem(16) }} />}
                  onClick={() => handleDownloadEnrollments(row.original, 'csv')}
                  disabled={isDownloading}
                >
                  Baixar CSV
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconDownload style={{ width: rem(16), height: rem(16) }} />}
                  onClick={() => handleDownloadEnrollments(row.original, 'pdf')}
                  disabled={isDownloading}
                >
                  Baixar PDF
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          );
        },
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
          Ações: '',
        })
      ),
    [query.data]
  );

  const rowMapper = useCallback((row: MRT_Row<Class>) => {
    const { location, date, mapsLink, active } = row.original;
    return [location?.name ?? '', dateBR(date) ?? '', mapsLink, active, ''];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  return (
    <CRUDTable 
      columns={columns} 
      title="Turmas" 
      csvData={csvData} 
      pdfConfig={pdfConfig} 
      emptyStateMessage="Nenhuma turma encontrada"
      emptyStateDescription="As turmas aparecerão aqui conforme forem sendo criadas"
    />
  );
}
