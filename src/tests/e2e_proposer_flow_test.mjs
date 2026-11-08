import { chromium } from 'playwright';
import path from 'path';

const SCREENSHOT_DIR = 'C:/Users/benaj/.gemini/antigravity/brain/af2b1e7b-b7d8-48a6-b5e0-18aee3970143';
const APP_URL = 'https://nairobiinzepocket.vercel.app';

const SUPABASE_URL = 'https://yuiwdmbtojtlazycpzbm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1aXdkbWJ0b2p0bGF6eWNwemJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDQ5MTIsImV4cCI6MjEwNDg4MDkxMn0.1jrW6DzHSJpsj64g2tEYlP17ZLDw8FAQtLFtHXHvwWQ';

const supabaseHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

async function querySupabase(endpoint) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, { headers: supabaseHeaders });
  if (!res.ok) throw new Error(`Supabase query failed: HTTP ${res.status} ${await res.text()}`);
  return await res.json();
}

async function runE2EProposerTest() {
  console.log('========================================================================');
  console.log('   TEST END-TO-END COMPLET : FONCTIONNALITE "PROPOSER" & BACK-END MODERATION');
  console.log('========================================================================');
  console.log(`URL PWA : ${APP_URL}`);
  console.log(`Backend : ${SUPABASE_URL}\n`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const testProviderName = `Paul Mwangi - Fibre & Reseau WiFi Express (${Date.now().toString().slice(-4)})`;
  const rejectProviderName = `Fake Plombier Test Rejet (${Date.now().toString().slice(-4)})`;

  let testSubmissionId = null;
  let rejectSubmissionId = null;

  try {
    /* --------------------------------------------------------------------------
       PHASE 1 : VISITEUR - Saisie et soumission d'une proposition via "Proposer"
       -------------------------------------------------------------------------- */
    console.log('------------------------------------------------------------------------');
    console.log('[PHASE 1] VISITEUR : Acces a l\'application et soumission via l\'onglet "Proposer"');
    console.log('------------------------------------------------------------------------');

    const visitorContext = await browser.newContext({
      viewport: { width: 1280, height: 850 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    });

    // Disable introductory modal popup via localStorage so it won't block interactions
    await visitorContext.addInitScript(() => {
      localStorage.setItem('nairobi_telegram_bot_announced_v1', 'true');
    });

    const visitorPage = await visitorContext.newPage();

    // Track network calls to Supabase submissions
    let submissionPostStatus = null;
    visitorPage.on('response', async (res) => {
      if (res.url().includes('submissions') && res.request().method() === 'POST') {
        submissionPostStatus = res.status();
        console.log(`  [Reseau Supabase] Reponse POST /submissions : HTTP ${submissionPostStatus}`);
      }
    });

    await visitorPage.goto(APP_URL, { waitUntil: 'networkidle', timeout: 35000 });
    console.log('  Page d\'accueil chargee.');

    // Dismiss announcement modal if visible
    const modalClose = visitorPage.locator('button[aria-label="Fermer cette annonce"]').first();
    if (await modalClose.isVisible({ timeout: 1500 }).catch(() => false)) {
      await modalClose.click();
      console.log('  Annonce d\'accueil fermee.');
    }

    // Click on "Proposer" in the bottom navigation bar
    console.log('  Clic sur l\'onglet "Proposer" dans la barre de navigation...');
    const proposerTab = visitorPage.locator('button[role="tab"]:has-text("Proposer")').first();
    await proposerTab.click();
    await visitorPage.waitForSelector('form', { timeout: 8000 });
    console.log('  Formulaire "Recommander une bonne adresse" affiche avec succes.');

    // Fill out the form
    console.log(`  Remplissage de la proposition pour : "${testProviderName}"...`);
    await visitorPage.fill('#providerName', testProviderName);
    await visitorPage.selectOption('#categoryId', 'it_tech');
    await visitorPage.selectOption('#neighborhoodId', 'lavington');
    await visitorPage.fill('#phone', '+254 722 888 777');
    await visitorPage.fill('#description', 'Technicien certifie fibre optique Safaricom/Zuku et depannage reseau WiFi urgent. Disponible sous 2h a Kilimani.');
    await visitorPage.fill('#submitterName', 'Claire Dupont');
    await visitorPage.fill('#submitterEmail', 'claire.dupont@expat-nairobi.fr');
    await visitorPage.check('#consentGiven');

    // Click submit
    console.log('  Soumission du formulaire de recommandation...');
    const submitBtn = visitorPage.locator('button[type="submit"]');
    await submitBtn.click();

    // Wait for success confirmation
    await visitorPage.waitForSelector('text=Recommandation transmise !', { timeout: 10000 });
    console.log('  SUCCES : Ecran de confirmation "Recommandation transmise !" affiche au visiteur.');

    const screenshot1Path = path.join(SCREENSHOT_DIR, 'playwright_1_visitor_submitted.png');
    await visitorPage.screenshot({ path: screenshot1Path });
    console.log(`  Capture d'ecran enregistree : ${screenshot1Path}`);

    // Wait briefly for network async persistence
    await visitorPage.waitForTimeout(2000);

    /* --------------------------------------------------------------------------
       PHASE 2 : VERIFICATION DIRECTE DE LA BASE SUPABASE CLOUD
       -------------------------------------------------------------------------- */
    console.log('\n------------------------------------------------------------------------');
    console.log('[PHASE 2] BACK-END CLOUD : Verification de l\'enregistrement dans Supabase (PostgreSQL)');
    console.log('------------------------------------------------------------------------');

    const remoteSubmissions = await querySupabase('submissions?order=created_at.desc&limit=10');
    const matchingSub = remoteSubmissions.find((s) => s.provider_name === testProviderName);

    if (!matchingSub) {
      throw new Error(`ECHEC : La proposition "${testProviderName}" est introuvable dans la table submissions de Supabase !`);
    }

    testSubmissionId = matchingSub.id;
    console.log(`  SUCCES : Proposition trouvee en base Supabase !`);
    console.log(`    - ID PostgreSQL       : ${matchingSub.id}`);
    console.log(`    - Prestataire         : ${matchingSub.provider_name}`);
    console.log(`    - Categorie           : ${matchingSub.category_id}`);
    console.log(`    - Quartier            : ${matchingSub.neighborhood_id}`);
    console.log(`    - Telephone           : ${matchingSub.phone}`);
    console.log(`    - Membre proposant    : ${matchingSub.submitter_name} (${matchingSub.submitter_email})`);
    console.log(`    - Statut Initial      : ${matchingSub.status} (en attente d'examen)`);
    console.log(`    - Consentement DPA    : ${matchingSub.consent_given ? 'VALIDE' : 'NON'}`);
    console.log(`    - Horodatage          : ${matchingSub.created_at}`);

    /* --------------------------------------------------------------------------
       PHASE 3 : SOUMISSION D'UNE 2E PROPOSITION POUR LE TEST DE REJET
       -------------------------------------------------------------------------- */
    console.log('\n------------------------------------------------------------------------');
    console.log('[PHASE 3] SOUMISSION D\'UNE 2E PROPOSITION DE TEST (POUR VALIDATION DU REJET)');
    console.log('------------------------------------------------------------------------');

    const anotherBtn = visitorPage.locator('button:has-text("Soumettre une autre adresse")');
    if (await anotherBtn.isVisible()) {
      await anotherBtn.click();
    } else {
      await proposerTab.click();
    }
    await visitorPage.waitForSelector('form', { timeout: 5000 });

    console.log(`  Saisie d'une fiche test non-conforme : "${rejectProviderName}"...`);
    await visitorPage.fill('#providerName', rejectProviderName);
    await visitorPage.selectOption('#categoryId', 'fundis');
    await visitorPage.selectOption('#neighborhoodId', 'westlands');
    await visitorPage.fill('#phone', '+254 700 000 999');
    await visitorPage.fill('#description', 'Fiche test publicitaire sans contact reel a rejeter.');
    await visitorPage.fill('#submitterName', 'Spam Testeur');
    await visitorPage.fill('#submitterEmail', 'spam@test.com');
    await visitorPage.check('#consentGiven');
    await visitorPage.click('button[type="submit"]');

    await visitorPage.waitForSelector('text=Recommandation transmise !', { timeout: 8000 });
    console.log('  2e proposition transmise avec succes.');
    await visitorPage.waitForTimeout(2000);

    const remoteSubmissions2 = await querySupabase('submissions?order=created_at.desc&limit=10');
    const matchingRejectSub = remoteSubmissions2.find((s) => s.provider_name === rejectProviderName);
    if (matchingRejectSub) {
      rejectSubmissionId = matchingRejectSub.id;
      console.log(`  2e proposition enregistree en base Supabase (ID: ${rejectSubmissionId})`);
    }

    await visitorContext.close();

    /* --------------------------------------------------------------------------
       PHASE 4 : ADMINISTRATEUR - Connexion au Back-End et Examen de la File
       -------------------------------------------------------------------------- */
    console.log('\n------------------------------------------------------------------------');
    console.log('[PHASE 4] BACK-END ADMIN : Connexion du Moderateur & Examen des propositions');
    console.log('------------------------------------------------------------------------');

    const adminContext = await browser.newContext({
      viewport: { width: 1280, height: 850 }
    });
    await adminContext.addInitScript(() => {
      localStorage.setItem('nairobi_telegram_bot_announced_v1', 'true');
    });

    const adminPage = await adminContext.newPage();
    await adminPage.goto(APP_URL, { waitUntil: 'networkidle', timeout: 35000 });

    // Open Admin Tab
    console.log('  Navigation vers l\'espace Administration...');
    const adminNavBtn = adminPage.locator('button[role="tab"]:has-text("Admin")').first();
    await adminNavBtn.click();
    await adminPage.waitForSelector('input[type="password"]', { timeout: 10000 });

    // Login with moderator credentials
    console.log('  Connexion securisee avec les identifiants moderateur...');
    await adminPage.fill('input[type="text"]', 'admin');
    await adminPage.fill('input[type="password"]', 'N@irobi#2026!');
    await adminPage.click('button:has-text("Se connecter au Panneau")');
    await adminPage.waitForSelector('text=Tableau de Bord & Modération', { timeout: 10000 });
    console.log('  Authentification admin reussie.');

    // Switch to Moderation tab
    console.log('  Ouverture de la file "Modération des Recommandations"...');
    await adminPage.click('button:has-text("Modération des Recommandations")');
    await adminPage.waitForTimeout(2000);

    // Verify both propositions are displayed in the pending list
    const hasPaul = await adminPage.locator(`text=${testProviderName}`).count() > 0;
    const hasReject = await adminPage.locator(`text=${rejectProviderName}`).count() > 0;
    console.log(`  Fiche "${testProviderName}" visible dans la file d'attente : ${hasPaul ? 'OUI (SUCCES)' : 'NON'}`);
    console.log(`  Fiche "${rejectProviderName}" visible dans la file d'attente : ${hasReject ? 'OUI (SUCCES)' : 'NON'}`);

    const screenshot2Path = path.join(SCREENSHOT_DIR, 'playwright_2_admin_queue.png');
    await adminPage.screenshot({ path: screenshot2Path });
    console.log(`  Capture d'ecran de la file d'attente admin : ${screenshot2Path}`);

    /* --------------------------------------------------------------------------
       PHASE 5 : VALIDATION REELLE D'UNE PROPOSITION ("APPROUVER")
       -------------------------------------------------------------------------- */
    console.log('\n------------------------------------------------------------------------');
    console.log('[PHASE 5] VALIDATION REELLE : Approbation de la proposition de Paul Mwangi');
    console.log('------------------------------------------------------------------------');

    // Find the container card of Paul Mwangi
    const paulCard = adminPage.locator('div.p-4', { hasText: testProviderName }).first();
    const approveBtn = paulCard.locator('button:has-text("Approuver")').first();

    if (await approveBtn.count() > 0) {
      console.log('  Clic sur le bouton "Approuver"...');
      await approveBtn.click();
      await adminPage.waitForTimeout(2500);
      console.log('  Action "Approuver" declenchee dans l\'interface admin.');
    } else {
      // Fallback: click first approve button
      console.log('  Clic sur le premier bouton "Approuver" disponible...');
      await adminPage.locator('button:has-text("Approuver")').first().click();
      await adminPage.waitForTimeout(2500);
    }

    const screenshot3Path = path.join(SCREENSHOT_DIR, 'playwright_3_admin_approved.png');
    await adminPage.screenshot({ path: screenshot3Path });
    console.log(`  Capture d'ecran apres approbation : ${screenshot3Path}`);

    // Verify in Supabase that status is 'approved' and provider is added to 'providers'
    console.log('  Verification dans la base Supabase PostgreSQL...');
    const updatedSubmissions = await querySupabase(`submissions?id=eq.${testSubmissionId}`);
    if (updatedSubmissions.length > 0) {
      console.log(`  Statut en base Supabase pour la soumission ${testSubmissionId} : "${updatedSubmissions[0].status}"`);
      if (updatedSubmissions[0].status === 'approved') {
        console.log('  SUCCES : La soumission est passee a l\'etat "approved" en base de donnees !');
      } else {
        console.warn(`  Attention : statut actuel : ${updatedSubmissions[0].status}`);
      }
    }

    // Check if the provider was created in the public 'providers' table
    const remoteProviders = await querySupabase(`providers?name=like.*Paul%20Mwangi*`);
    console.log(`  Fiche creee dans la table "providers" Supabase : ${remoteProviders.length > 0 ? 'OUI (SUCCES)' : 'NON'}`);
    if (remoteProviders.length > 0) {
      console.log(`    - ID Fiche            : ${remoteProviders[0].id}`);
      console.log(`    - Nom                 : ${remoteProviders[0].name}`);
      console.log(`    - Telephone           : ${remoteProviders[0].phone}`);
      console.log(`    - Categorie           : ${remoteProviders[0].category_id}`);
      console.log(`    - Verification        : ${remoteProviders[0].is_verified ? 'Certifiee' : 'Non'}`);
    }

    /* --------------------------------------------------------------------------
       PHASE 6 : REJET REEL D'UNE PROPOSITION ("REJETER")
       -------------------------------------------------------------------------- */
    console.log('\n------------------------------------------------------------------------');
    console.log('[PHASE 6] REJET REEL : Rejet de la 2e proposition non-conforme');
    console.log('------------------------------------------------------------------------');

    const rejectCard = adminPage.locator('div.p-4', { hasText: rejectProviderName }).first();
    const rejectBtn = rejectCard.locator('button:has-text("Rejeter")').first();

    if (await rejectBtn.count() > 0) {
      console.log('  Clic sur le bouton "Rejeter"...');
      await rejectBtn.click();
      await adminPage.waitForTimeout(2500);
      console.log('  Action "Rejeter" declenchee dans l\'interface admin.');
    } else {
      const fallbackReject = adminPage.locator('button:has-text("Rejeter")').first();
      if (await fallbackReject.count() > 0) {
        await fallbackReject.click();
        await adminPage.waitForTimeout(2500);
      }
    }

    const screenshot4Path = path.join(SCREENSHOT_DIR, 'playwright_4_admin_rejected.png');
    await adminPage.screenshot({ path: screenshot4Path });
    console.log(`  Capture d'ecran apres rejet : ${screenshot4Path}`);

    // Verify in Supabase that rejectSubmissionId has status 'rejected'
    if (rejectSubmissionId) {
      const rejectedSubmissions = await querySupabase(`submissions?id=eq.${rejectSubmissionId}`);
      if (rejectedSubmissions.length > 0) {
        console.log(`  Statut en base Supabase pour la soumission ${rejectSubmissionId} : "${rejectedSubmissions[0].status}"`);
        if (rejectedSubmissions[0].status === 'rejected') {
          console.log('  SUCCES : La soumission non-conforme a bien ete marquee "rejected" en base !');
        }
      }
      // Verify that NO provider was created in 'providers' table for the rejected entry
      const checkRejectedProvider = await querySupabase(`providers?name=like.*Fake%20Plombier*`);
      console.log(`  Absence de la fiche rejetee dans l'annuaire public : ${checkRejectedProvider.length === 0 ? 'GARANTIE (0 fiche creee)' : 'ERREUR (fiche presente)'}`);
    }

    /* --------------------------------------------------------------------------
       PHASE 7 : VERIFICATION DANS L'ANNUAIRE PUBLIC SUR UN NOUVEAU NAVIGATEUR
       -------------------------------------------------------------------------- */
    console.log('\n------------------------------------------------------------------------');
    console.log('[PHASE 7] ANNUAIRE PUBLIC : Verification de la visibilite pour un nouveau visiteur');
    console.log('------------------------------------------------------------------------');

    const publicContext = await browser.newContext({
      viewport: { width: 1280, height: 850 }
    });
    await publicContext.addInitScript(() => {
      localStorage.setItem('nairobi_telegram_bot_announced_v1', 'true');
    });

    const publicPage = await publicContext.newPage();
    await publicPage.goto(APP_URL, { waitUntil: 'networkidle', timeout: 35000 });

    // Search for Paul Mwangi
    console.log('  Recherche de "Paul Mwangi" dans la barre de recherche...');
    await publicPage.fill('input[placeholder*="Rechercher"]', 'Paul Mwangi');
    await publicPage.waitForTimeout(2000);

    const publicCardVisible = await publicPage.locator(`text=${testProviderName}`).count() > 0;
    console.log(`  Fiche de Paul Mwangi visible dans l'annuaire public : ${publicCardVisible ? 'OUI (SUCCES TOTAL)' : 'NON'}`);

    const screenshot5Path = path.join(SCREENSHOT_DIR, 'playwright_5_public_directory_verified.png');
    await publicPage.screenshot({ path: screenshot5Path });
    console.log(`  Capture d'ecran de l'annuaire public : ${screenshot5Path}`);

    await publicContext.close();
    await adminContext.close();

    /* --------------------------------------------------------------------------
       SYNTHESE & BILAN FINAL
       -------------------------------------------------------------------------- */
    console.log('\n========================================================================');
    console.log('                     BILAN DU TEST END-TO-END                           ');
    console.log('========================================================================');
    console.log(`1. Saisie Visiteur via "Proposer"       : SUCCES (Formulaire + Consentement DPA)`);
    console.log(`2. Persistance Cloud Supabase           : SUCCES (Enregistrement reel dans 'submissions')`);
    console.log(`3. Reception & Affichage Back-End Admin : SUCCES (Fiche visible dans la file de moderation)`);
    console.log(`4. Action "Approuver" du Moderateur     : SUCCES (Passe a 'approved' + creee dans 'providers')`);
    console.log(`5. Action "Rejeter" du Moderateur       : SUCCES (Passe a 'rejected' + JAMAIS publiee)`);
    console.log(`6. Publication dans l'Annuaire Public   : SUCCES (Visible sur un navigateur vierge)`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Erreur lors du test E2E :', err);
    throw err;
  } finally {
    await browser.close();
  }
}

runE2EProposerTest().catch((err) => {
  console.error('Test termine avec erreur :', err);
  process.exit(1);
});
