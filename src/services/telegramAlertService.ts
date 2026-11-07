import { ProviderSubmission, EmergencyContact } from '../types';

/**
 * Service de notification d'alerte Telegram Admin pour Nairobi in ze Pocket
 * Permet d'envoyer instantanément sur le téléphone personnel de l'admin
 * les nouvelles recommandations soumises et les alertes d'urgence.
 */

const env = (import.meta as any).env || {};
const BOT_TOKEN = env.VITE_TELEGRAM_BOT_TOKEN || '9139803363:AAFjCBi9XKsLB8Pum55diGAcPKqHsLjPzZI';
const ADMIN_CHAT_ID = env.VITE_TELEGRAM_ADMIN_CHAT_ID || '';

export const isTelegramAlertConfigured = Boolean(BOT_TOKEN);

/**
 * Envoie un message formaté directement au bot Telegram
 */
export async function sendTelegramMessage(text: string, chatIdOverride?: string): Promise<boolean> {
  const targetChatId = chatIdOverride || ADMIN_CHAT_ID;
  if (!BOT_TOKEN || !targetChatId) {
    console.info('[Telegram Alert] Skipping notification (no chat_id configured yet)');
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const result = await response.json();
    if (!result.ok) {
      console.warn('[Telegram Alert] API error:', result.description);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Telegram Alert] Network error while sending alert:', err);
    return false;
  }
}

/**
 * Alerte instantanée lors d'une nouvelle soumission de prestataire
 */
export async function notifyNewSubmissionOnTelegram(submission: ProviderSubmission): Promise<boolean> {
  const message = `
🌟 <b>NOUVELLE RECOMMANDATION REÇUE !</b> 🌟

👤 <b>Prestataire :</b> ${submission.providerName}
🏷️ <b>Catégorie :</b> ${submission.categoryId}
📍 <b>Quartier :</b> ${submission.neighborhoodId}
📞 <b>Téléphone :</b> ${submission.phone}

📝 <b>Avis & Détails :</b>
<i>"${submission.description}"</i>

🙋‍♂️ <b>Soumis par :</b> ${submission.submitterName} (${submission.submitterEmail})
🔒 <b>Consentement DPA 2019 :</b> ${submission.consentGiven ? '✅ OUI' : '❌ NON'}

👉 Rendez-vous dans votre panneau <b>Admin > Modération</b> pour valider ou refuser cette fiche !
`.trim();

  return sendTelegramMessage(message);
}

/**
 * Alerte instantanée lors d'un signalement ou déclenchement SOS
 */
export async function notifySosAlertOnTelegram(info: { contactTitle: string; phone: string; userNote?: string }): Promise<boolean> {
  const message = `
🚨 <b>ALERTE SOS DÉCLENCHÉE SUR L'APP</b> 🚨

🏥 <b>Service d'urgence consulté :</b> ${info.contactTitle}
📞 <b>Numéro composé :</b> ${info.phone}
${info.userNote ? `ℹ️ <b>Note :</b> ${info.userNote}` : ''}
⏰ <b>Date/Heure :</b> ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Nairobi' })} (Heure de Nairobi)
`.trim();

  return sendTelegramMessage(message);
}
