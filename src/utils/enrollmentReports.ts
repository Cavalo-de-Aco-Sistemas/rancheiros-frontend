import { download, generateCsv, mkConfig } from 'export-to-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Enrollment } from '@/model/enrollment';
import { Class } from '@/model/class';
import { dateBR } from '@/utils/dates';

export interface EnrollmentReportData {
  class: Class;
  enrollments: Enrollment[];
}

export function generateEnrollmentCSV({ class: classData, enrollments }: EnrollmentReportData) {
  if (!Array.isArray(enrollments)) {
    throw new Error('Enrollments deve ser um array');
  }
  
  if (enrollments.length === 0) {
    throw new Error('Nenhuma inscrição confirmada encontrada para esta turma');
  }
  
  const csvData = enrollments.map((enrollment, index) => ({
    'Nº': index + 1,
    'Nome': enrollment.name || '',
    'Moto': enrollment.brand && enrollment.model ? `${enrollment.brand}/${enrollment.model}` : (enrollment.brand || enrollment.model || ''),
    'Assinatura': '',
  }));

  // Verificar se csvData é válido
  if (!csvData || csvData.length === 0) {
    throw new Error('Erro ao processar dados para CSV');
  }

  const locationName = classData.location?.name?.replace(/[^a-zA-Z0-9]/g, '-') || 'turma';
  const dateStr = dateBR(classData.date)?.replace(/\//g, '-') || 'data';
  
  const config = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: `inscricoes-confirmadas-${locationName}-${dateStr}`,
  });

  const csv = generateCsv(config)(csvData);
  download(config)(csv);
}

export function generateEnrollmentPDF({ class: classData, enrollments }: EnrollmentReportData) {
  if (!Array.isArray(enrollments)) {
    throw new Error('Enrollments deve ser um array');
  }
  
  if (enrollments.length === 0) {
    throw new Error('Nenhuma inscrição confirmada encontrada para esta turma');
  }
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Configurações de fonte
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);

  // Título do relatório
  doc.text('Lista de Inscrições Confirmadas', 20, 20);

  // Informações da turma
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const classInfo = [
    `Local: ${classData.location?.name || 'Não informado'}`,
    `Data: ${dateBR(classData.date) || 'Não informado'}`,
    `Total de Confirmados: ${enrollments.length}`,
  ];

  classInfo.forEach((info, index) => {
    doc.text(info, 20, 35 + (index * 8));
  });

  // Tabela de inscrições
  const tableData = enrollments.map((enrollment, index) => [
    (index + 1).toString(),
    enrollment.name,
    enrollment.brand && enrollment.model ? `${enrollment.brand}/${enrollment.model}` : (enrollment.brand || enrollment.model || ''),
    '', // Coluna para assinatura
  ]);

  autoTable(doc, {
    startY: 65,
    head: [['Nº', 'Nome', 'Moto', 'Assinatura']],
    body: tableData,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 20 }, // Nº
      1: { cellWidth: 60 }, // Nome
      2: { cellWidth: 50 }, // Moto
      3: { cellWidth: 60 }, // Assinatura (coluna maior)
    },
    margin: { left: 20, right: 20 },
  });

  // Salvar o PDF
  const locationName = classData.location?.name?.replace(/[^a-zA-Z0-9]/g, '-') || 'turma';
  const dateStr = dateBR(classData.date)?.replace(/\//g, '-') || 'data';
  const filename = `inscricoes-confirmadas-${locationName}-${dateStr}.pdf`;
  doc.save(filename);
}
