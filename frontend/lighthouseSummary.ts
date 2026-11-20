// Lighthouse summary for CI: each page's median numbers from the last run, next to the budgets and their change against main.
import {
  appendFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

type Summary = {
  performance: number;
  accessibility: number;
  lcpMs: number;
  cls: number;
  kib: number;
};
type LighthouseResult = {
  requestedUrl: string;
  categories: Record<string, { score: number }>;
  audits: Record<string, { numericValue: number }>;
};

const config = createRequire(import.meta.url)("./lighthouserc.cjs");
const assertions = config.ci.assert.assertions;
const ROWS: {
  label: string;
  show: (s: Summary) => string;
  delta: (d: number) => string;
  key: keyof Summary;
  budget: string;
}[] = [
  {
    label: "Performance",
    key: "performance",
    show: (s) => `${s.performance}`,
    delta: signed,
    budget: `≥ ${round(assertions["categories:performance"][1].minScore * 100, 0)}`,
  },
  {
    label: "Accessibility",
    key: "accessibility",
    show: (s) => `${s.accessibility}`,
    delta: signed,
    budget: `≥ ${round(assertions["categories:accessibility"][1].minScore * 100, 0)}`,
  },
  {
    label: "Main content (LCP)",
    key: "lcpMs",
    show: (s) => `${seconds(s.lcpMs)} s`,
    delta: (d) => `${signed(seconds(d))} s`,
    budget: `≤ ${seconds(assertions["largest-contentful-paint"][1].maxNumericValue)} s`,
  },
  {
    label: "Layout shift (CLS)",
    key: "cls",
    show: (s) => `${s.cls}`,
    delta: (d) => signed(round(d, 2)),
    budget: `≤ ${assertions["cumulative-layout-shift"][1].maxNumericValue}`,
  },
  {
    label: "Download",
    key: "kib",
    show: (s) => `${s.kib} KiB`,
    delta: (d) => `${signed(round(d, 1))} KiB`,
    budget: `≤ ${assertions["total-byte-weight"][1].maxNumericValue / 1024} KiB`,
  },
];

// Only runs when called from the command line, not when the tests import this file.
if (process.argv[1] === fileURLToPath(import.meta.url)) main();

// Reads the results, saves this run's numbers, and writes each page's summary table and notice.
function main() {
  const dir = ".lighthouseci";
  const files = existsSync(dir)
    ? readdirSync(dir).filter((f) => /^lhr-.*\.json$/.test(f))
    : [];
  if (files.length === 0)
    return console.log("No Lighthouse results to summarize.");
  const pages = summarizePages(
    files.map((f) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8"))),
  );
  writeFileSync("lighthouse-summary.json", JSON.stringify(pages));
  const mainFile = "baseline/lighthouse-summary.json";
  const main: Record<string, Summary> = existsSync(mainFile)
    ? JSON.parse(readFileSync(mainFile, "utf8"))
    : {};
  for (const [page, current] of Object.entries(pages)) {
    const table = summaryTable(page, current, main[page] ?? null);
    if (process.env.GITHUB_STEP_SUMMARY)
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, table);
    else console.log(table);
    console.log(noticeLine(page, current));
  }
}

// Groups the runs by page (path and query, so "/" and "/?preview" stay apart) and summarizes each.
export function summarizePages(
  results: LighthouseResult[],
): Record<string, Summary> {
  const byPage: Record<string, LighthouseResult[]> = {};
  for (const r of results) {
    const url = new URL(r.requestedUrl);
    (byPage[url.pathname + url.search] ??= []).push(r);
  }
  return Object.fromEntries(
    Object.entries(byPage).map(([page, runs]) => [page, summarize(runs)]),
  );
}

// Median of each metric across the runs, rounded the way the table shows it.
export function summarize(results: LighthouseResult[]): Summary {
  // Middle value of the sorted runs (the upper middle one when the count is even).
  const median = (pick: (r: LighthouseResult) => number) => {
    const values = results.map(pick).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };
  return {
    performance: Math.round(
      median((r) => r.categories.performance.score) * 100,
    ),
    accessibility: Math.round(
      median((r) => r.categories.accessibility.score) * 100,
    ),
    lcpMs: Math.round(
      median((r) => r.audits["largest-contentful-paint"].numericValue),
    ),
    cls: round(
      median((r) => r.audits["cumulative-layout-shift"].numericValue),
      2,
    ),
    kib: round(
      median((r) => r.audits["total-byte-weight"].numericValue) / 1024,
      1,
    ),
  };
}

// Markdown table for the GitHub run summary, with the change against main when main has saved numbers.
export function summaryTable(
  page: string,
  current: Summary,
  main: Summary | null,
): string {
  const rows = ROWS.map((row) => {
    const before = main?.[row.key];
    const change =
      typeof before === "number" ? row.delta(current[row.key] - before) : "—";
    return `| ${row.label} | ${row.show(current)} | ${row.budget} | ${change} |`;
  });
  const note = main
    ? ""
    : "\nNo numbers from main yet; the change column fills in after the next run on main.\n";
  return [
    `### Lighthouse ${page} (median of ${config.ci.collect.numberOfRuns} runs, throttled phone)`,
    "",
    "| Metric | This run | Budget | vs main |",
    "|---|---|---|---|",
    ...rows,
    note,
  ].join("\n");
}

// One-line GitHub notice per page, which shows on the PR's checks and in the public API.
export function noticeLine(page: string, s: Summary): string {
  return `::notice title=Lighthouse ${page}::perf ${s.performance} · a11y ${s.accessibility} · LCP ${seconds(s.lcpMs)} s · CLS ${s.cls} · ${s.kib} KiB`;
}

// Rounds to a number of decimals, dropping trailing zeros.
function round(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

// Milliseconds to seconds with one decimal.
function seconds(ms: number): number {
  return round(ms / 1000, 1);
}

// Adds a plus sign to positive changes.
function signed(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}
