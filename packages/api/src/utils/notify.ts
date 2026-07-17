import { pool } from '../db/pool';

/** Soft-launch notification hook — logs intended push/SMS; FCM/MSG91 wired when keys exist. */
export async function notifyOrderStatus(params: {
  userId: string;
  orderNumber: string;
  status: string;
}) {
  const title = `Order ${params.orderNumber}`;
  const body = `Status updated to ${params.status}`;
  await pool.query(
    `INSERT INTO notification_log (user_id, channel, title, body, meta)
     VALUES ($1, 'push', $2, $3, $4::jsonb)`,
    [
      params.userId,
      title,
      body,
      JSON.stringify({ orderNumber: params.orderNumber, status: params.status }),
    ],
  );
  // FCM send when FIREBASE_SERVER_KEY / FCM credentials configured
  if (process.env.FCM_ENABLED === 'true') {
    console.log(`[fcm-stub] would push to user ${params.userId}: ${body}`);
  }
}
