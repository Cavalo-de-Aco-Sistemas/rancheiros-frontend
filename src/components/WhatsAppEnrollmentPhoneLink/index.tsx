import { Anchor } from '@mantine/core';
import { Enrollment } from '@/model/enrollment';
import {
  buildTrainingConfirmationMessageFromEnrollment,
  buildWhatsAppUrl,
  extractPhoneDigits,
  formatPhoneDisplay,
} from '@/utils/whatsapp';

type WhatsAppEnrollmentPhoneLinkProps = {
  phone?: string | null;
  enrollment: Pick<Enrollment, 'name' | 'class'>;
  adminName?: string | null;
};

export function WhatsAppEnrollmentPhoneLink({
  phone,
  enrollment,
  adminName,
}: WhatsAppEnrollmentPhoneLinkProps) {
  if (!phone) {
    return '';
  }

  const phoneDigits = extractPhoneDigits(phone);

  if (!phoneDigits) {
    return phone;
  }

  const message = buildTrainingConfirmationMessageFromEnrollment(enrollment, adminName);
  const whatsappUrl = buildWhatsAppUrl(phoneDigits, message);

  return (
    <Anchor href={whatsappUrl} target="_blank" rel="noreferrer">
      {formatPhoneDisplay(phone)}
    </Anchor>
  );
}
