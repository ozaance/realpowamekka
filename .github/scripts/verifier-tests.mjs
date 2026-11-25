// Vérifie le résultat des tests d'intégration. Appelé par .github/workflows/tests.yml :
//   node .github/scripts/verifier-tests.mjs <fichier de sortie des tests> <code de sortie du lanceur>
//
// Variable d'environnement obligatoire : TESTS_MINIMUM (entier >= 1), le nombre minimal de tests
// qui doivent réussir.
//
// Échoue (code 1) dès que quelque chose est inattendu, jamais de succès par défaut :
//   - le lanceur a renvoyé un code différent de 0 ;
//   - la sortie est absente, vide ou illisible ;
//   - la ligne de bilan « N réussis, M échoués » est absente ou n'apparaît pas exactement une fois ;
//   - le garde-fou réseau n'a pas confirmé son bon fonctionnement ;
//   - au moins un test a échoué ;
//   - moins de TESTS_MINIMUM tests ont réussi ;
//   - le bilan annoncé ne correspond pas aux lignes « ✔ » / « ✘ » réellement affichées.
// Dans tous les cas, un résumé est écrit dans le résumé de l'exécution GitHub.
import { appendFileSync, readFileSync } from 'node:fs';

const [fichier, codeArg] = process.argv.slice(2);
const problemes = [];
let reussis = null;
let echoues = null;
let garde = false;
const echecs = [];

const minimumTexte = process.env.TESTS_MINIMUM ?? '';
const minimum = /^\d+$/.test(minimumTexte) ? Number(minimumTexte) : NaN;
if (!Number.isSafeInteger(minimum) || minimum < 1) {
  problemes.push(`TESTS_MINIMUM doit être un entier supérieur ou égal à 1 (reçu : « ${minimumTexte} »).`);
}

if (!/^-?\d+$/.test(codeArg ?? '')) {
  problemes.push(`Code de sortie du lanceur illisible (reçu : « ${codeArg ?? ''} »).`);
} else if (Number(codeArg) !== 0) {
  problemes.push(`Le lanceur de tests s'est terminé avec le code ${codeArg} (0 attendu).`);
}

let sortie = '';
try {
  sortie = readFileSync(fichier, 'utf8').replace(/\r\n/g, '\n');
} catch {
  problemes.push(`Sortie des tests introuvable ou illisible : ${fichier ?? '(aucun fichier indiqué)'}.`);
}
if (sortie.trim() === '' && !problemes.some((p) => p.startsWith('Sortie des tests'))) {
  problemes.push('La sortie des tests est vide : aucun test n\'a été exécuté.');
}

if (sortie.trim() !== '') {
  // 1. Bilan : exactement une ligne « N réussis, M échoués ».
  const bilans = [...sortie.matchAll(/^(\d+) réussis, (\d+) échoués$/gm)];
  if (bilans.length === 0) {
    problemes.push('Ligne de bilan « N réussis, M échoués » introuvable : format de sortie inattendu.');
  } else if (bilans.length > 1) {
    problemes.push(`La ligne de bilan apparaît ${bilans.length} fois : sortie ambiguë.`);
  } else {
    reussis = Number(bilans[0][1]);
    echoues = Number(bilans[0][2]);
  }

  // 2. Garde-fou réseau : la sortie des tests du site vient après sa confirmation.
  const marqueur = sortie.split('\n').indexOf('Garde-fou réseau OK');
  garde = marqueur !== -1;
  if (!garde) problemes.push('Le garde-fou réseau n\'a pas confirmé son bon fonctionnement (« Garde-fou réseau OK » absent).');

  // 3. Cohérence entre le bilan annoncé et les lignes réellement affichées.
  if (garde && reussis !== null) {
    const apres = sortie.split('\n').slice(marqueur + 1);
    const ok = apres.filter((l) => l.startsWith('  ✔ ')).length;
    const ko = apres.filter((l) => l.startsWith('  ✘ '));
    echecs.push(...ko.map((l) => l.slice(4).trim()));
    if (ok !== reussis || ko.length !== echoues) {
      problemes.push(`Bilan incohérent : annoncé ${reussis} réussis et ${echoues} échoués, mais ${ok} lignes « ✔ » et ${ko.length} lignes « ✘ » affichées.`);
    }
  }

  // 4. Résultat attendu.
  if (echoues !== null && echoues > 0) problemes.push(`${echoues} test(s) en échec.`);
  if (reussis !== null && Number.isFinite(minimum) && reussis < minimum) {
    problemes.push(`Seulement ${reussis} test(s) réussi(s) : au moins ${minimum} exigés.`);
  }
}

const conforme = problemes.length === 0;
const valeur = (v) => (v === null ? 'illisible' : String(v));

const resume = [
  `## Tests d'intégration : ${conforme ? '✅ conformes' : '❌ non conformes'}`,
  '',
  '| Mesure | Valeur |',
  '|---|---|',
  `| Tests réussis | ${valeur(reussis)} |`,
  `| Tests échoués | ${valeur(echoues)} |`,
  `| Minimum exigé de tests réussis | ${Number.isFinite(minimum) ? minimum : 'invalide'} |`,
  `| Garde-fou réseau | ${garde ? 'confirmé' : 'non confirmé'} |`,
  `| Code de sortie du lanceur | ${codeArg ?? 'absent'} |`,
  '',
];
if (!conforme) {
  resume.push('### Problèmes', '', ...problemes.map((p) => `- ${p}`), '');
  if (echecs.length > 0) resume.push('### Tests en échec', '', ...echecs.slice(0, 20).map((e) => `- ${e}`), '');
}

console.log('\n' + resume.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) {
  try {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, resume.join('\n') + '\n');
  } catch (e) {
    console.log(`Résumé GitHub non écrit : ${e.message}`);
  }
}
for (const p of problemes) console.log(`::error title=Tests d'intégration::${p}`);

if (!conforme) process.exit(1);
console.log(`Tests d'intégration conformes : ${reussis} réussis, ${echoues} échoués (minimum ${minimum}).`);
