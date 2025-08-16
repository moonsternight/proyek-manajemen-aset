export interface AdminLog {
  type: "login" | "logout" | "tambah" | "edit" | "hapus";
  timestamp: string;
  description?: string;
}

export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`❌ Gagal mengambil item '${key}' dari localStorage:`, error);
    return defaultValue;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`❌ Gagal menyimpan item '${key}' ke localStorage:`, error);
  }
};

export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`❌ Gagal menghapus item '${key}' dari localStorage:`, error);
  }
};

const ADMIN_LOG_KEY = "adminLogs";

const VALID_TYPES = ["login", "logout", "tambah", "edit", "hapus"] as const;
type ValidLogType = (typeof VALID_TYPES)[number];

export const saveAdminActivity = (
  type: ValidLogType,
  description?: string
): void => {
  const now = new Date().toISOString();
  const logs = getAdminActivities();

  const newLog: AdminLog = { type, timestamp: now, description };
  logs.push(newLog);

  setItem<AdminLog[]>(ADMIN_LOG_KEY, logs);
};

export const getAdminActivities = (): AdminLog[] => {
  try {
    const raw = localStorage.getItem(ADMIN_LOG_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    const validLogs = parsed.filter(
      (log: any): log is AdminLog =>
        log &&
        typeof log === "object" &&
        VALID_TYPES.includes(log.type) &&
        typeof log.timestamp === "string"
    );

    return validLogs;
  } catch (error) {
    console.error("❌ Gagal parsing adminLogs:", error);
    return [];
  }
};

export const clearAdminActivities = (): void => {
  removeItem(ADMIN_LOG_KEY);
};
