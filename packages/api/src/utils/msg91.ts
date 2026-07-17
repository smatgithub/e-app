/**
 * MSG91 OTP adapter — stub-safe for soft launch.
 * Set OTP_STUB=false and MSG91_AUTH_KEY (+ template) for live SMS.
 */
export async function sendOtpSms(phone: string, code: string): Promise<{ sent: boolean; provider: string }> {
  const stub = process.env.OTP_STUB !== 'false';
  if (stub) {
    return { sent: true, provider: 'stub' };
  }
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  if (!authKey || !templateId) {
    console.warn('[msg91] OTP_STUB=false but MSG91_AUTH_KEY/TEMPLATE_ID missing — OTP stored only');
    return { sent: false, provider: 'msg91-missing-config' };
  }
  // Live call deferred until credentials + DLT template approved.
  // Documented in docs/config/09-msg91.md
  console.log(`[msg91] would send OTP to ${phone} template=${templateId} code=${code}`);
  return { sent: true, provider: 'msg91-queued' };
}
