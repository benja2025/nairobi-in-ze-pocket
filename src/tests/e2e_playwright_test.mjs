import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:/Users/benaj/.gemini/antigravity/brain/af2b1e7b-b7d8-48a6-b5e0-18aee3970143';
const APP_URL = 'https://nairobiinzepocket.vercel.app';

async function runE2ETest() {
  console.log('===============================================================');
  console.log('  TEST END-TO-END PLAYWRIGHT : ENREGISTREMENT & SYNC SUPABASE  ');
  console.log('===============================================================');
  console.log(`URL cible : ${APP_URL}\n`);

  const browser = await chromium.launch({ headless: true });

  /* --------------------------------------------------------------------------
     ÉTAPE 1 : TERMINAL 1 (Navigateur A) - Saisie de la fiche "John Doe"
     -------------------------------------------------------------------------- */
  console.log('[TERMINAL 1] Ouverture du premier navigateur...');
  const context1 = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page1 = await context1.newPage();

  // Surveillance des requêtes réseau (notamment vers Supabase)
  const networkRequests = [];
  page1.on('request', (req) => {
    if (req.url().includes('supabase') || req.url().includes('rest/v1')) {
      networkRequests.push({ url: req.url(), method: req.method() });
      console.log(`  [TERMINAL 1 Réseau] Requête Cloud détectée : ${req.method()} ${req.url()}`);
    }
  });

  page1.on('console', (msg) => {
    if (msg.text().includes('[Supabase Sync]') || msg.text().includes('[Nairobi Storage]')) {
      console.log(`  [TERMINAL 1 Console] ${msg.text()}`);
    }
  });

  await page1.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('  Page d\'accueil chargée.');

  // Naviguer vers l'onglet "Recommander" (Soumission)
  console.log('  Navigation vers le formulaire de recommandation...');
  await page1.click('button:has-text("Recommander")');
  await page1.waitForSelector('form', { timeout: 5000 });

  // Remplir la fiche "John Doe"
  console.log('  Saisie des informations de la fiche "John Doe"...');
  await page1.fill('#providerName', 'John Doe (Plombier Express)');
  await page1.selectOption('#categoryId', 'fundis');
  await page1.selectOption('#neighborhoodId', 'westlands');
  await page1.fill('#phone', '+254 712 999 000');
  await page1.fill('#description', 'Plombier sanitaire qualifié pour fuites d\'urgence et chauffe-eau à Westlands. Test E2E Playwright.');
  await page1.fill('#submitterName', 'Testeur Playwright');
  await page1.fill('#submitterEmail', 'playwright@test.com');
  await page1.check('#consentGiven');

  // Soumettre le formulaire
  console.log('  Soumission de la recommandation...');
  await page1.click('button[type="submit"]');
  await page1.waitForSelector('text=Recommandation transmise !', { timeout: 8000 });
  console.log('  ✓ Recommandation transmise avec succès dans le Terminal 1.');

  const screenshot1Path = path.join(SCREENSHOT_DIR, 'playwright_terminal1_submission.png');
  await page1.screenshot({ path: screenshot1Path });
  console.log(`  Capture d'écran enregistrée : ${screenshot1Path}`);

  // Naviguer vers l'Administration et approuver la fiche
  console.log('\n  Connexion à l\'Administration pour approuver "John Doe"...');
  await page1.click('button:has-text("Admin")');
  await page1.waitForSelector('input[type="password"]', { timeout: 8000 });
  await page1.fill('input[type="text"]', 'admin');
  await page1.fill('input[type="password"]', 'N@irobi#2026!');
  await page1.click('button:has-text("Se connecter au Panneau")');
  await page1.waitForSelector('text=Tableau de Bord & Modération', { timeout: 8000 });

  // Cliquer sur l'onglet "Modération des Recommandations"
  console.log('  Accès à l\'onglet Modération des Recommandations...');
  await page1.click('button:has-text("Modération des Recommandations")');
  await page1.waitForTimeout(1500);

  // Approuver la recommandation John Doe si présente
  const approveButton = page1.locator('button:has-text("Approuver")').first();
  if (await approveButton.count() > 0) {
    await approveButton.click();
    console.log('  ✓ Recommandation "John Doe" approuvée dans l\'Administration du Terminal 1.');
    await page1.waitForTimeout(2000);
  } else {
    console.log('  ℹ Aucune recommandation en attente trouvée ou déjà approuvée.');
  }

  // Vérifier la présence de John Doe dans l'Annuaire du Terminal 1
  await page1.click('button:has-text("Annuaire")');
  await page1.fill('input[placeholder*="Rechercher"]', 'John Doe');
  await page1.waitForTimeout(1000);

  const foundTerminal1 = await page1.locator('text=John Doe (Plombier Express)').count() > 0;
  console.log(`  [TERMINAL 1] Fiche John Doe visible dans l'annuaire : ${foundTerminal1 ? 'OUI (✓)' : 'NON (✗)'}`);

  const screenshotTerminal1Dir = path.join(SCREENSHOT_DIR, 'playwright_terminal1_directory.png');
  await page1.screenshot({ path: screenshotTerminal1Dir });

  /* --------------------------------------------------------------------------
     ÉTAPE 2 : TERMINAL 2 (Nouveau navigateur isolé / simulation Firefox / Mobile)
     -------------------------------------------------------------------------- */
  console.log('\n---------------------------------------------------------------');
  console.log('[TERMINAL 2] Ouverture d\'un NOUVEAU contexte navigateur isolé (incognito)...');
  const context2 = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page2 = await context2.newPage();

  page2.on('console', (msg) => {
    if (msg.text().includes('[Supabase Sync]') || msg.text().includes('[Nairobi Storage]')) {
      console.log(`  [TERMINAL 2 Console] ${msg.text()}`);
    }
  });

  await page2.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('  Page d\'accueil du Terminal 2 chargée.');

  // Recherche de John Doe sur le Terminal 2
  await page2.fill('input[placeholder*="Rechercher"]', 'John Doe');
  await page2.waitForTimeout(1500);

  const foundTerminal2 = await page2.locator('text=John Doe (Plombier Express)').count() > 0;
  console.log(`  [TERMINAL 2] Fiche John Doe visible sur le nouveau terminal : ${foundTerminal2 ? 'OUI (✓ Connecté Cloud)' : 'NON (✗ Stockage Isolé)'}`);

  const screenshotTerminal2Dir = path.join(SCREENSHOT_DIR, 'playwright_terminal2_directory.png');
  await page2.screenshot({ path: screenshotTerminal2Dir });
  console.log(`  Capture d'écran enregistrée : ${screenshotTerminal2Dir}`);

  /* --------------------------------------------------------------------------
     BILAN DU DIAGNOSTIC CLOUD SUPABASE
     -------------------------------------------------------------------------- */
  console.log('\n===============================================================');
  console.log('                     BILAN DU TEST E2E                         ');
  console.log('===============================================================');
  console.log(`1. Terminal 1 (Saisie & Modération)    : ${foundTerminal1 ? 'SUCCÈS (Fiche active)' : 'ÉCHEC'}`);
  console.log(`2. Terminal 2 (Nouveau terminal vierge) : ${foundTerminal2 ? 'SUCCÈS (Synchronisation Cloud OK)' : 'NON SYNCHRONISÉ (Clés Supabase manquantes sur Vercel)'}`);
  console.log(`3. Requêtes réseau vers Supabase       : ${networkRequests.length > 0 ? `${networkRequests.length} requêtes effectuées` : '0 requête (Mode Offline Fallback actif)'}`);

  await browser.close();
}

runE2ETest().catch((err) => {
  console.error('Erreur Playwright:', err);
  process.exit(1);
});
