import { Enrollment } from '@/model/enrollment';
import { dateBR } from '@/utils/dates';

const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|Opera Mini/i;

export type TrainingConfirmationMessageParams = {
  studentFirstName: string;
  adminFullName: string;
  classDate: string;
  classLocation: string;
  mapsLink?: string;
};

export const isMobileDevice = () => MOBILE_USER_AGENT_REGEX.test(navigator.userAgent);

export const extractPhoneDigits = (phone: string) => phone.match(/\d/g)?.join('') ?? null;

export const formatPhoneDisplay = (phone: string) =>
  phone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');

export const getFirstName = (name?: string | null) => (name ? name.split(' ')[0] : '');

export const buildTrainingConfirmationMessage = ({
  studentFirstName,
  adminFullName,
  classDate,
  classLocation,
  mapsLink,
}: TrainingConfirmationMessageParams) => {
  const trimmedMapsLink = mapsLink?.trim() ?? '';
  const mapsLine = /^https?:\/\//i.test(trimmedMapsLink) ? trimmedMapsLink : '';

  return `Olá ${studentFirstName}! 👋

Aqui é ${adminFullName}, do *Rancheiros Moto Clube*.
🌐 https://www.rancheirosmc.com.br

Estamos confirmando se você *ainda tem interesse em participar do curso de Direção Defensiva para Motociclistas – Manobras para Vida*.

📅 Data: ${classDate}
📍 Local: ${classLocation}${mapsLine ? `\n${mapsLine}` : ''}

⚠️ Pedimos que confirme seu interesse o quanto antes, pois *as vagas são limitadas*.
Caso *não recebamos retorno, sua inscrição poderá ser cancelada* para liberar a vaga a outro participante.

Informações importantes:

• 🕗 Início do treinamento: 08h pontualmente
• 🏍️ É necessário trazer sua própria motocicleta (não fornecemos motos)
• 🪖 Equipamentos obrigatórios: capacete, calça comprida e calçado fechado
• 🎓 O certificado será entregue apenas aos alunos que participarem até o final do treinamento

Se tiver qualquer dúvida, estamos à disposição.

Aguardamos sua confirmação.
Obrigado! 👍`;
};

export const buildTrainingConfirmationMessageFromEnrollment = (
  enrollment: Pick<Enrollment, 'name' | 'class'>,
  adminName?: string | null
) => {
  const classData = enrollment.class;

  return buildTrainingConfirmationMessage({
    studentFirstName: getFirstName(enrollment.name),
    adminFullName: adminName?.trim() ?? '',
    classDate: classData?.date ? (dateBR(classData.date) ?? '') : '',
    classLocation: classData?.location?.name ?? '',
    mapsLink: classData?.mapsLink,
  });
};

export const buildWhatsAppUrl = (phoneDigits: string, message?: string) => {
  const fullPhone = phoneDigits.startsWith('55') ? phoneDigits : `55${phoneDigits}`;

  if (!message) {
    const baseUrl = isMobileDevice() ? 'whatsapp://wa.me/' : 'https://wa.me/';
    return `${baseUrl}${fullPhone}`;
  }

  const encoded = encodeURIComponent(message);

  return isMobileDevice()
    ? `whatsapp://send?phone=${fullPhone}&text=${encoded}`
    : `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encoded}`;
};
