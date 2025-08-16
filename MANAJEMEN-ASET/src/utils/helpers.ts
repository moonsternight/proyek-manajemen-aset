import { AdminLog } from "../types";

export function formatDateTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("id-ID", options)
    .format(date)
    .replace(/\./g, ":");
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  try {
    return new Date(dateString).toLocaleDateString("id-ID", options);
  } catch (e) {
    console.error("Invalid date string:", dateString, e);
    return "Tanggal tidak valid";
  }
}

export function generateRandom5DigitNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return String(num);
}

export function generateLocalCode(jenis: string, merk: string): string {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear().toString().slice(-2);
  const currentMonthYear = `${month}${year}`;

  const shortJenis = jenis.substring(0, 2).toUpperCase();
  const shortMerk = merk.substring(0, 3).toUpperCase();
  const randomNumber = generateRandom5DigitNumber();

  return `${shortJenis}-${shortMerk}-CNI-${currentMonthYear}-${randomNumber}`;
}

export function getLatestLogsByType(logs: AdminLog[]): AdminLog[] {
  const relevantTypes = [
    "login",
    "logout",
    "add_asset",
    "edit_asset",
    "delete_asset",
  ];
  const latestLogsMap = new Map<string, AdminLog>();

  for (const log of logs) {
    const type = log.type.toLowerCase();
    if (!relevantTypes.includes(type)) continue;

    if (!latestLogsMap.has(type)) {
      latestLogsMap.set(type, log);
    } else {
      const existing = latestLogsMap.get(type)!;
      if (new Date(log.timestamp) > new Date(existing.timestamp)) {
        latestLogsMap.set(type, log);
      }
    }
  }

  return relevantTypes
    .map((type) => latestLogsMap.get(type))
    .filter((log): log is AdminLog => log !== undefined);
}
