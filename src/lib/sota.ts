export interface SotaStats {
  score: number;
  bonusPoints: number;
  activations: number;
  activationsThisYear: number;
  uniqueSummits: number;
  uniqueThisYear: number;
  totalQSOs: number;
  associations: number;
  yearsActive: string;
}

// Module-level cache — fetched once per build, reused across all pages
let cache: SotaStats | null = null;

export async function getSotaStats(): Promise<SotaStats | null> {
  if (cache) return cache;

  try {
    const [summaryRes, activationsRes] = await Promise.all([
      fetch('https://sotl.as/api/activators/KH7AL'),
      fetch('https://sotl.as/api/activations/KH7AL'),
    ]);

    const summary = await summaryRes.json();
    const activations: any[] = await activationsRes.json();

    const thisYear = new Date().getFullYear().toString();
    const totalQSOs = activations.reduce((s, a) => s + a.qsos, 0);
    const uniqueSummits = new Set(activations.map((a) => a.summit.code)).size;
    const uniqueThisYear = new Set(
      activations.filter((a) => a.date.startsWith(thisYear)).map((a) => a.summit.code)
    ).size;
    const activationsThisYear = activations.filter((a) => a.date.startsWith(thisYear)).length;
    const associations = new Set(activations.map((a) => a.summit.code.split('/')[0])).size;

    const firstDate = new Date(Math.min(...activations.map((a) => new Date(a.date).getTime())));
    const now = new Date();
    const months = (now.getFullYear() - firstDate.getFullYear()) * 12 + (now.getMonth() - firstDate.getMonth());
    const yearsActive = `${Math.floor(months / 12)}y ${months % 12}m`;

    cache = {
      score: summary.score,
      bonusPoints: summary.bonusPoints,
      activations: summary.summits,
      activationsThisYear,
      uniqueSummits,
      uniqueThisYear,
      totalQSOs,
      associations,
      yearsActive,
    };

    return cache;
  } catch {
    return null;
  }
}
