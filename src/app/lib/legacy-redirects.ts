/**
 * Legacy URL & Slug Redirect Registry for CroatiaBest
 * Resolves corrupted legacy slugs, English folder paths, and old PB 15-char ID hashes
 * directly to clean canonical /objekt/{croatian-category}/{canonical-slug} URLs.
 */

export const LEGACY_EXACT_REDIRECTS: Record<string, string> = {
  // 1. Ljekarna Korčula - Dežurna (Gradska) (qhds0s1ek277n1c)
  'ljekarna-korc-la-dez-rna-gradska-qhds0s1ek277n1c': '/objekt/ljekarna/ljekarna-korcula-dezurna-gradska',
  'ljekarna-korc-la-dez-rna-gradska': '/objekt/ljekarna/ljekarna-korcula-dezurna-gradska',
  'ljekarna-korcula-dezurna-gradska-qhds0s1ek277n1c': '/objekt/ljekarna/ljekarna-korcula-dezurna-gradska',
  'qhds0s1ek277n1c': '/objekt/ljekarna/ljekarna-korcula-dezurna-gradska',

  // 2. Hitna medicinska služba Vela Luka (264bjcc018uhv5v)
  'hitna-medicinska-slz-ba-vela-lka-264bjcc018uhv5v': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-vela-luka',
  'hitna-medicinska-slz-ba-vela-lka': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-vela-luka',
  'hitna-medicinska-sluzba-vela-luka-264bjcc018uhv5v': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-vela-luka',
  '264bjcc018uhv5v': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-vela-luka',

  // 3. Hitna medicinska služba Korčula (9uu21k15piy8rit & 96p9x92r8dr3sij)
  'hitna-medicinska-slz-ba-korc-la-9uu21k15piy8rit': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula',
  'hitna-medicinska-slz-ba-korc-la-96p9x92r8dr3sij': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula',
  'hitna-medicinska-slz-ba-korc-la': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula',
  'hitna-medicinska-sluzba-korcula-9uu21k15piy8rit': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula',
  '9uu21k15piy8rit': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula',
  '96p9x92r8dr3sij': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula',

  // 4. Dom zdravlja Umag & Hitna Umag (pr8x66fn069idh6)
  'dom-zdravlja-mag-pr8x66fn069idh6': '/objekt/hitna-pomoc/dom-zdravlja-umag',
  'dom-zdravlja-mag': '/objekt/hitna-pomoc/dom-zdravlja-umag',
  'dom-zdravlja-umag-pr8x66fn069idh6': '/objekt/hitna-pomoc/dom-zdravlja-umag',
  'pr8x66fn069idh6': '/objekt/hitna-pomoc/dom-zdravlja-umag',

  // 5. Ljekarna Selce (m7o3xx7qj86p253)
  'ljekarna-selce-m7o3xx7qj86p253': '/objekt/ljekarna/ljekarna-selce',
  'm7o3xx7qj86p253': '/objekt/ljekarna/ljekarna-selce',

  // 6. Policijska postaja Vela Luka (3f34r4u6l574q57)
  'policijska-postaja-vela-lka-3f34r4u6l574q57': '/objekt/policija/policijska-postaja-vela-luka',
  'policijska-postaja-vela-lka': '/objekt/policija/policijska-postaja-vela-luka',
  '3f34r4u6l574q57': '/objekt/policija/policijska-postaja-vela-luka',

  // 7. Hitna medicinska služba Poreč (0cg28g4ca6967a0)
  'hitna-medicinska-slz-ba-porec-0cg28g4ca6967a0': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-porec',
  'hitna-medicinska-slz-ba-porec': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-porec',
  '0cg28g4ca6967a0': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-porec',

  // 8. Policijska postaja Makarska (30hkd41y6uk8gs0)
  'policijska-postaja-makarska-30hkd41y6uk8gs0': '/objekt/policija/policijska-postaja-makarska',
  '30hkd41y6uk8gs0': '/objekt/policija/policijska-postaja-makarska',

  // 9. Hitna medicinska služba Rovinj (8pem0g47en96f8z)
  'hitna-medicinska-slz-ba-rovinj-8pem0g47en96f8z': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-rovinj',
  'hitna-medicinska-slz-ba-rovinj': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-rovinj',
  '8pem0g47en96f8z': '/objekt/hitna-pomoc/hitna-medicinska-sluzba-rovinj',

  // 10. Željeznička stanica Sesvetski Kraljevec (6352fc4071620fa)
  'z-eljeznic-ka-stanica-sesvetski-kraljevec-6352fc4071620fa': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-sesvetski-kraljevec',
  '6352fc4071620fa': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-sesvetski-kraljevec',

  // 11. Vidikovac Smričnjak (536it6409s7ad85)
  'vidikovac-smric-njak-536it6409s7ad85': '/objekt/vidikovac/vidikovac-smricnjak',
  '536it6409s7ad85': '/objekt/vidikovac/vidikovac-smricnjak',

  // 12. Željeznička stanica Buzet (57157f15acad00a)
  'z-eljeznic-ka-stanica-bzet-57157f15acad00a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-bzet',
  '57157f15acad00a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-bzet',

  // 13. Vidikovac Veprinac (7koef4el5n380nj)
  'vidikovac-veprinac-7koef4el5n380nj': '/objekt/vidikovac/vidikovac-veprinac',
  '7koef4el5n380nj': '/objekt/vidikovac/vidikovac-veprinac',

  // 14. Gat Vrulje Šibenik (3d48ad56398758a)
  'trajektna-lka-gat-vrlje-s-ibenik-3d48ad56398758a': '/objekt/trajektna-luka/trajektna-luka-gat-vrulje-sibenik',
  '3d48ad56398758a': '/objekt/trajektna-luka/trajektna-luka-gat-vrulje-sibenik',

  // 15. Autobusni kolodvor Topusko (c38aa6cea1b7eda)
  'atobsni-kolodvor-topsko-c38aa6cea1b7eda': '/objekt/autobusni-kolodvor/autobusni-kolodvor-topusko',
  'c38aa6cea1b7eda': '/objekt/autobusni-kolodvor/autobusni-kolodvor-topusko',

  // 16. Stara gradska luka Dubrovnik (3g5t2w6tm9im8zc)
  'stara-gradska-lka-3g5t2w6tm9im8zc': '/objekt/znamenitost/stara-gradska-luka',
  '3g5t2w6tm9im8zc': '/objekt/znamenitost/stara-gradska-luka',

  // 17. JVP Zadar Gaženica (x9dvt0hsz78x7p9)
  'jvp-zadar-postaja-gaz-enica-x9dvt0hsz78x7p9': '/objekt/vatrogasci/jvp-zadar-postaja-gazenica',
  'x9dvt0hsz78x7p9': '/objekt/vatrogasci/jvp-zadar-postaja-gazenica',

  // 18. Vidikovac Kastav (42g0xz2i22hbt57)
  'vidikovac-kastav-crekvina-42g0xz2i22hbt57': '/objekt/vidikovac/vidikovac-kastav-crekvina',
  '42g0xz2i22hbt57': '/objekt/vidikovac/vidikovac-kastav-crekvina',

  // 19. Vidikovac na brdu Gradina Vela Luka (yrr6zza59l6cjl3)
  'vidikovac-na-brd-gradina-korc-la-yrr6zza59l6cjl3': '/objekt/vidikovac/vidikovac-na-brdu-gradina-vela-luka',
  'yrr6zza59l6cjl3': '/objekt/vidikovac/vidikovac-na-brdu-gradina-vela-luka',

  // 20. Autobusni kolodvor Vir (e06723ebe14298a)
  'atobsni-kolodvor-vir-e06723ebe14298a': '/objekt/autobusni-kolodvor/autobusni-kolodvor-vir',
  'e06723ebe14298a': '/objekt/autobusni-kolodvor/autobusni-kolodvor-vir',

  // 21. KBC Split Križine (9sh605qyvpsaamo)
  'kbc-split-kriz-ine-9sh605qyvpsaamo': '/objekt/hitna-pomoc/kbc-split-krizine',
  '9sh605qyvpsaamo': '/objekt/hitna-pomoc/kbc-split-krizine',

  // 22. Ljekarna Privlaka (24ydsdcd1ecs171)
  'ljekarna-privlaka-24ydsdcd1ecs171': '/objekt/ljekarna/ljekarna-privlaka',
  '24ydsdcd1ecs171': '/objekt/ljekarna/ljekarna-privlaka',

  // 23. Ljekarna Vela Luka Blato (lj8rgp0l75ag27y)
  'ljekarna-vela-lka-dez-rna-blato-lj8rgp0l75ag27y': '/objekt/ljekarna/ljekarna-vela-luka-dezurna-blato',
  'lj8rgp0l75ag27y': '/objekt/ljekarna/ljekarna-vela-luka-dezurna-blato',

  // 24. Gradska ljekarna Maksimirska Zagreb (7j457vp1s53mg17)
  'gradska-ljekarna-zagreb-maksimirska-7j457vp1s53mg17': '/objekt/ljekarna/gradska-ljekarna-zagreb-maksimirska',
  '7j457vp1s53mg17': '/objekt/ljekarna/gradska-ljekarna-zagreb-maksimirska',

  // 25. Ljekarna Vrsar (0033546m0vfw79r)
  'ljekarna-vrsar-0033546m0vfw79r': '/objekt/ljekarna/ljekarna-vrsar',
  '0033546m0vfw79r': '/objekt/ljekarna/ljekarna-vrsar',

  // 26. Autobusna stanica Poreč (e10c028462409aa)
  'atobsna-stanica-porec-e10c028462409aa': '/objekt/autobusni-kolodvor/autobusna-stanica-porec',
  'e10c028462409aa': '/objekt/autobusni-kolodvor/autobusna-stanica-porec',

  // 27. Željeznički kolodvor Osijek (fd209ebad2c9cda)
  'z-eljeznic-ki-kolodvor-osijek-fd209ebad2c9cda': '/objekt/zeljeznicki-kolodvor/zeljeznicki-kolodvor-osijek',
  'fd209ebad2c9cda': '/objekt/zeljeznicki-kolodvor/zeljeznicki-kolodvor-osijek',

  // 28. Plaža Dajla (nyqdt9346vpk47i)
  'plaz-a-dajla-nyqdt9346vpk47i': '/objekt/plaza/plaza-dajla',
  'nyqdt9346vpk47i': '/objekt/plaza/plaza-dajla',

  // 29. Autobusni kolodvor Požega (4b584f94cef6aaa)
  'atobsni-kolodvor-poz-ega-4b584f94cef6aaa': '/objekt/autobusni-kolodvor/autobusni-kolodvor-pozega',
  '4b584f94cef6aaa': '/objekt/autobusni-kolodvor/autobusni-kolodvor-pozega',

  // 30. Policijska postaja Trogir (vs5m021b68b7rgv)
  'policijska-postaja-trogir-lc-ka-kapetanija-vs5m021b68b7rgv': '/objekt/policija/policijska-postaja-trogir-lucka-kapetanija',
  'vs5m021b68b7rgv': '/objekt/policija/policijska-postaja-trogir-lucka-kapetanija',

  // 31. Autobusna stanica Milna (7178df73bbe309a)
  'atobsna-stanica-milna-7178df73bbe309a': '/objekt/autobusni-kolodvor/autobusna-stanica-milna',
  '7178df73bbe309a': '/objekt/autobusni-kolodvor/autobusna-stanica-milna',

  // 32. Vidikovac Panorama Motovun (0de1d18cbb428aa)
  'vidikovac-panorama-motovn-0de1d18cbb428aa': '/objekt/vidikovac/vidikovac-panorama-motovun',
  '0de1d18cbb428aa': '/objekt/vidikovac/vidikovac-panorama-motovun',

  // 33. Marina Pakoštane II (658dc6dcceb8f0a)
  'marina-pakos-tane-ii-658dc6dcceb8f0a': '/objekt/marina/marina-pakostane-ii',
  '658dc6dcceb8f0a': '/objekt/marina/marina-pakostane-ii',

  // 34. Dujmovača (00d8ae27bbf552a)
  'z-eljeznic-ka-stanica-djmovac-a-00d8ae27bbf552a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-dujmovaca',
  '00d8ae27bbf552a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-dujmovaca',

  // 35. Vidikovac Sv. Ivan Trogir (z815wa33114cn15)
  'vidikovac-na-brd-sv-ivan-trogir-z815wa33114cn15': '/objekt/vidikovac/vidikovac-na-brdu-sv-ivan-trogir',
  'z815wa33114cn15': '/objekt/vidikovac/vidikovac-na-brdu-sv-ivan-trogir',

  // 36. Vidikovac Kremenik (4cbe89c02e3fbaa)
  'vidikovac-kremenik-4cbe89c02e3fbaa': '/objekt/vidikovac/vidikovac-kremenik',
  '4cbe89c02e3fbaa': '/objekt/vidikovac/vidikovac-kremenik',

  // 37. Vidikovac Pazin cave (9a8f2a5977aac6a)
  'vidikovac-pazin-cave-9a8f2a5977aac6a': '/objekt/vidikovac/vidikovac-pazin-cave',
  '9a8f2a5977aac6a': '/objekt/vidikovac/vidikovac-pazin-cave',

  // 38. Autobusni kolodvor Vrlika (d3eb0590fa89e7a)
  'atobsni-kolodvor-vrlika-d3eb0590fa89e7a': '/objekt/autobusni-kolodvor/autobusni-kolodvor-vrlika',
  'd3eb0590fa89e7a': '/objekt/autobusni-kolodvor/autobusni-kolodvor-vrlika',

  // 39. Vidikovac Rastoke (3562364b6f530aa)
  'vidikovac-rastoke-3562364b6f530aa': '/objekt/vidikovac/vidikovac-rastoke',
  '3562364b6f530aa': '/objekt/vidikovac/vidikovac-rastoke',

  // 40. Vidikovac Sv. Križ (fe68aa543486f3a)
  'vidikovac-sv-kriz-fe68aa543486f3a': '/objekt/vidikovac/vidikovac-sv-kriz',
  'fe68aa543486f3a': '/objekt/vidikovac/vidikovac-sv-kriz',

  // 41. Plaža Banje (g19lcmzbu14p4z6)
  'plaz-a-banje-g19lcmzbu14p4z6': '/objekt/plaza/plaza-banje',
  'g19lcmzbu14p4z6': '/objekt/plaza/plaza-banje',

  // 42. Autobusni kolodvor Ploče (55d7efb4fcc0b3a)
  'atobsni-kolodvor-ploc-e-55d7efb4fcc0b3a': '/objekt/autobusni-kolodvor/autobusni-kolodvor-ploce',
  '55d7efb4fcc0b3a': '/objekt/autobusni-kolodvor/autobusni-kolodvor-ploce',

  // 43. Spomenik tiskari Nedelišće (dd0f9070231ab0a)
  'spomenik-tiskari-nedelis-c-dd0f9070231ab0a': '/objekt/spomenik/spomenik-tiskari-nedelisce',
  'dd0f9070231ab0a': '/objekt/spomenik/spomenik-tiskari-nedelisce',

  // 44. Autobusni kolodvor Drniš (34118236227286a)
  'atobsni-kolodvor-drnis-34118236227286a': '/objekt/autobusni-kolodvor/autobusni-kolodvor-drnis',
  '34118236227286a': '/objekt/autobusni-kolodvor/autobusni-kolodvor-drnis',

  // 45. Željeznička stanica Standard (4a5bbbdc41be87a)
  'z-eljeznic-ka-stanica-standard-4a5bbbdc41be87a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-standard',
  '4a5bbbdc41be87a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-standard',

  // 46. Trajektna luka Gaženica vez (aff8c8e9977deaa)
  'trajektna-lka-gaz-enica-vez-aff8c8e9977deaa': '/objekt/trajektna-luka/trajektna-luka-gazenica',
  'aff8c8e9977deaa': '/objekt/trajektna-luka/trajektna-luka-gazenica',

  // 47. Vidikovac Slipica Oči Vinodola (b4n0j9x800nxy81)
  'vidikovac-slipica-oc-i-vinodola-b4n0j9x800nxy81': '/objekt/vidikovac/vidikovac-slipica-oci-vinodola',
  'b4n0j9x800nxy81': '/objekt/vidikovac/vidikovac-slipica-oci-vinodola',

  // 48. Željeznička stanica Vrapče (8a3fbbb5744506a)
  'z-eljeznic-ka-stanica-vrapc-e-8a3fbbb5744506a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-vrapce',
  '8a3fbbb5744506a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-vrapce',

  // 49. Vidikovac Panoramic Benches Solin (cef0b767449c0ea)
  'vidikovac-panoramic-benches-solin-split-view-cef0b767449c0ea': '/objekt/vidikovac/vidikovac-panoramic-benches-solin-split-view',
  'cef0b767449c0ea': '/objekt/vidikovac/vidikovac-panoramic-benches-solin-split-view',

  // 50. VII Postaja (86d8b00fca1410a)
  'vii-postaja-86d8b00fca1410a': '/objekt/spomenik/vii-postaja',
  '86d8b00fca1410a': '/objekt/spomenik/vii-postaja',

  // 51. Spomenik prvom hrvatskom predsjedniku dr. Franji Tuđmanu (9eff7c0ff5c478a)
  'spomenik-prvom-hrvatskom-predsjednik-dr-ranji-t-man-9eff7c0ff5c478a': '/objekt/znamenitost/spomenik-prvom-hrvatskom-predsjedniku-dr-franji-tudmanu',
  '9eff7c0ff5c478a': '/objekt/znamenitost/spomenik-prvom-hrvatskom-predsjedniku-dr-franji-tudmanu',

  // 52. Trajektna luka Mali Most (26fefd40be07fca)
  'trajektna-lka-mali-most-26fefd40be07fca': '/objekt/trajektna-luka/trajektna-luka-mali-most',
  '26fefd40be07fca': '/objekt/trajektna-luka/trajektna-luka-mali-most',

  // 53. Željeznička stanica Laduč (71f0c0fd7667f8a)
  'z-eljeznic-ka-stanica-ladc-71f0c0fd7667f8a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-laduc',
  '71f0c0fd7667f8a': '/objekt/zeljeznicki-kolodvor/zeljeznicka-stanica-laduc',

  // 54. Autobusni kolodvor Umag & Campanož
  'umag-autobusni-kolodvor': '/objekt/autobusni-kolodvor/autobusni-kolodvor-umag',
  'autobusni-kolodvor-campanoz-b': '/objekt/autobusni-kolodvor/autobusni-kolodvor-campanoz-b',
  'autobusni-kolodvor-porec': '/objekt/autobusni-kolodvor/autobusna-stanica-porec',
};

/**
 * Resolves any incoming pathname (from /listing/... or /objekt/...) directly to its canonical destination.
 * Returns null if no direct legacy mapping exists.
 */
export function resolveLegacyRedirect(pathname: string): string | null {
  if (!pathname) return null;

  // Normalize path
  const trimmed = pathname.replace(/\/+$/, '');
  const segments = trimmed.split('/').filter(Boolean);

  // Must be in /listing/... or /objekt/...
  if (segments.length >= 2 && (segments[0] === 'listing' || segments[0] === 'objekt')) {
    const slugOrId = segments[segments.length - 1];
    
    // Check direct map for the slug/id
    if (LEGACY_EXACT_REDIRECTS[slugOrId]) {
      return LEGACY_EXACT_REDIRECTS[slugOrId];
    }

    // Check if ends with a 15-char trailing ID
    const parts = slugOrId.split('-');
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart.length === 15 && LEGACY_EXACT_REDIRECTS[lastPart]) {
      return LEGACY_EXACT_REDIRECTS[lastPart];
    }
  }

  return null;
}
