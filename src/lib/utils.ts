import { getCollection, type CollectionEntry } from 'astro:content';

const datumFormaat = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDatum(datum: Date): string {
  return datumFormaat.format(datum);
}

export function isoDatum(datum: Date): string {
  return datum.toISOString().slice(0, 10);
}

/** Alle gepubliceerde nieuwsberichten, nieuwste eerst. */
export async function getNieuws(): Promise<CollectionEntry<'nieuws'>[]> {
  const items = await getCollection('nieuws', ({ data }) => !data.concept);
  return items.sort((a, b) => b.data.datum.getTime() - a.data.datum.getTime());
}

/** Alle edities van Muziek achter de voordeur, nieuwste jaar eerst. */
export async function getEdities(): Promise<CollectionEntry<'edities'>[]> {
  const items = await getCollection('edities');
  return items.sort((a, b) => b.data.jaar - a.data.jaar);
}

/** De editie die nu uitgelicht wordt: de nieuwste die nog niet is afgelopen. */
export function huidigeEditie(
  edities: CollectionEntry<'edities'>[],
): CollectionEntry<'edities'> | undefined {
  return edities.find((e) => e.data.kaartverkoop_status !== 'afgelopen') ?? edities[0];
}

/** Platte tekst met lege regels omzetten naar alinea's. */
export function alineas(tekst: string): string[] {
  return tekst
    .split(/\n\s*\n/)
    .map((a) => a.trim())
    .filter(Boolean);
}

export const statusLabel: Record<string, string> = {
  binnenkort: 'Kaartverkoop start binnenkort',
  open: 'Kaartverkoop geopend',
  uitverkocht: 'Uitverkocht',
  afgelopen: 'Afgelopen editie',
};
