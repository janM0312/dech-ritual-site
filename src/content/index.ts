// Single source of truth for the site copy: the markdown files in this folder.
// They are inlined at build time (?raw), so editing a .md file on master and
// rebuilding is all that is needed to publish new content.
import hlavickaRaw from "./hlavicka.md?raw";
import heroRaw from "./hero.md?raw";
import oMneRaw from "./o-mne.md?raw";
import prinosyRaw from "./přínosy.md?raw";
import sluzbyRaw from "./služby.md?raw";
import rezervaceRaw from "./rezervace.md?raw";
import komunitaRaw from "./komunita.md?raw";
import referenceRaw from "./reference.md?raw";
import dotazyRaw from "./dotazy.md?raw";
import kontaktRaw from "./kontakt.md?raw";
import { parseDoc } from "./parse";

export const hlavicka = parseDoc(hlavickaRaw);
export const hero = parseDoc(heroRaw);
export const oMne = parseDoc(oMneRaw);
export const prinosy = parseDoc(prinosyRaw);
export const sluzby = parseDoc(sluzbyRaw);
export const rezervace = parseDoc(rezervaceRaw);
export const komunita = parseDoc(komunitaRaw);
export const reference = parseDoc(referenceRaw);
export const dotazy = parseDoc(dotazyRaw);
export const kontakt = parseDoc(kontaktRaw);
