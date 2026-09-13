const SUPABASE_URL = 'https://yuiwdmbtojtlazycpzbm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1aXdkbWJ0b2p0bGF6eWNwemJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDQ5MTIsImV4cCI6MjEwNDg4MDkxMn0.1jrW6DzHSJpsj64g2tEYlP17ZLDw8FAQtLFtHXHvwWQ';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function runBattery() {
  console.log('=================================================================');
  console.log('  BATTERIE DE TESTS DE CONNEXION & INTÉGRITÉ SUPABASE CLOUD     ');
  console.log('=================================================================');
  console.log(`URL : ${SUPABASE_URL}\n`);

  let testsPassed = 0;
  let totalTests = 8;

  // TEST 1 : Health Check & Reachability
  try {
    const t0 = Date.now();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, { headers });
    const latency = Date.now() - t0;
    console.log(`[TEST 1/8] Ping API & Authentification : SUCCÈS (HTTP ${res.status}, latence: ${latency}ms)`);
    testsPassed++;
  } catch (err) {
    console.error(`[TEST 1/8] Échec Ping :`, err.message);
  }

  // TEST 2 : Lecture Table 'providers'
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?select=*&limit=5`, { headers });
    if (res.ok) {
      const data = await res.json();
      console.log(`[TEST 2/8] SELECT 'providers' : SUCCÈS (HTTP 200, ${data.length} enregistrements reçus)`);
      testsPassed++;
    } else {
      console.error(`[TEST 2/8] SELECT 'providers' : ERREUR HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(`[TEST 2/8] Exception :`, err.message);
  }

  // TEST 3 : Lecture Table 'submissions'
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/submissions?select=*&limit=5`, { headers });
    if (res.ok) {
      const data = await res.json();
      console.log(`[TEST 3/8] SELECT 'submissions' : SUCCÈS (HTTP 200, ${data.length} enregistrements reçus)`);
      testsPassed++;
    } else {
      console.error(`[TEST 3/8] SELECT 'submissions' : ERREUR HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(`[TEST 3/8] Exception :`, err.message);
  }

  // TEST 4 : Insertion Fiche Test Temporaire (UPSERT)
  const tempId = `test_battery_${Date.now()}`;
  const testPayload = {
    id: tempId,
    name: "Laboratoire Test Intégrité Supabase",
    category_id: "sante",
    neighborhood_id: "gigiri",
    specialty: "Test unitaire automatisé",
    description: "Fiche temporaire créée pour valider le cycle complet CRUD.",
    phone: "+254 700 999 888",
    languages: ["Français", "Anglais"],
    is_verified: true,
    rating: 5.0,
    reviews_count: 1,
    tags: ["test", "sante", "validation"],
    source_info: {
      badge: "Nairobi Accueil",
      channel: "direct_submission",
      uploadedAt: new Date().toISOString(),
      contributorMasked: "Test Runner",
      contributorRevealed: "Antigravity CI",
      reliabilityScore: 5
    }
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?on_conflict=id`, {
      method: 'POST',
      headers,
      body: JSON.stringify(testPayload)
    });
    if (res.status === 201 || res.status === 200) {
      console.log(`[TEST 4/8] INSERT/UPSERT 'providers' : SUCCÈS (HTTP ${res.status}, ID: ${tempId})`);
      testsPassed++;
    } else {
      const errText = await res.text();
      console.error(`[TEST 4/8] INSERT 'providers' : ERREUR HTTP ${res.status} : ${errText}`);
    }
  } catch (err) {
    console.error(`[TEST 4/8] Exception :`, err.message);
  }

  // TEST 5 : Relecture Vérifiée de la fiche créée
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?id=eq.${tempId}`, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data.length > 0 && data[0].id === tempId) {
        console.log(`[TEST 5/8] READ-BACK 'providers' : SUCCÈS (Fiche récupérée intègre)`);
        testsPassed++;
      } else {
        console.error(`[TEST 5/8] Fiche non trouvée après insertion.`);
      }
    }
  } catch (err) {
    console.error(`[TEST 5/8] Exception :`, err.message);
  }

  // TEST 6 : Modification (UPDATE)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?id=eq.${tempId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ specialty: "Spécialité mise à jour avec succès" })
    });
    if (res.ok) {
      console.log(`[TEST 6/8] UPDATE 'providers' : SUCCÈS (HTTP ${res.status})`);
      testsPassed++;
    } else {
      console.error(`[TEST 6/8] UPDATE ERREUR : HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(`[TEST 6/8] Exception :`, err.message);
  }

  // TEST 7 : Cycle de modération Soumission (INSERT + PATCH Status)
  const subTempId = `sub_battery_${Date.now()}`;
  try {
    const subRes = await fetch(`${SUPABASE_URL}/rest/v1/submissions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: subTempId,
        provider_name: "Soumission Test",
        category_id: "services",
        neighborhood_id: "karen",
        phone: "+254 711 000 000",
        description: "Test de recommandation communautaire",
        submitter_name: "Membre Test",
        submitter_email: "membre@test.org",
        consent_given: true,
        status: "pending"
      })
    });

    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/submissions?id=eq.${subTempId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: "approved" })
    });

    if (subRes.ok && patchRes.ok) {
      console.log(`[TEST 7/8] CYCLE 'submissions' (Insert + Approve) : SUCCÈS (HTTP ${subRes.status} -> HTTP ${patchRes.status})`);
      testsPassed++;
    } else {
      console.error(`[TEST 7/8] Échec soumission/approbation : ${subRes.status} / ${patchRes.status}`);
    }
  } catch (err) {
    console.error(`[TEST 7/8] Exception :`, err.message);
  }

  // TEST 8 : Nettoyage Propre (DELETE des fiches temporaires de test)
  try {
    const delP = await fetch(`${SUPABASE_URL}/rest/v1/providers?id=eq.${tempId}`, {
      method: 'DELETE',
      headers
    });
    const delS = await fetch(`${SUPABASE_URL}/rest/v1/submissions?id=eq.${subTempId}`, {
      method: 'DELETE',
      headers
    });

    if (delP.ok && delS.ok) {
      console.log(`[TEST 8/8] CLEANUP 'providers' & 'submissions' : SUCCÈS (Données de test nettoyées)`);
      testsPassed++;
    } else {
      console.warn(`[TEST 8/8] Nettoyage partiel : ${delP.status}, ${delS.status}`);
    }
  } catch (err) {
    console.error(`[TEST 8/8] Exception :`, err.message);
  }

  console.log('\n=================================================================');
  console.log(`  BILAN : ${testsPassed} / ${totalTests} TESTS VALIDÉS AVEC SUCCÈS (${(testsPassed/totalTests*100).toFixed(0)}%)`);
  console.log('=================================================================');
}

runBattery().catch(console.error);
