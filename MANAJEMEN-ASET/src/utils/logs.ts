export interface ActivityLog {
  activity: string;
  date: string;
}

/**
 * Mencatat aktivitas admin ke backend
 * @param activity - aktivitas seperti 'login', 'edit', 'logout'
 */
export const addActivityLog = async (activity: string): Promise<void> => {
  if (!activity.trim()) return;

  try {
    const res = await fetch("http://localhost:5000/api/activity-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity: activity.toLowerCase(),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("❌ Gagal mencatat aktivitas (Admin):", error);
  }
};

export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  try {
    const res = await fetch("http://localhost:5000/api/activity-logs");
    if (!res.ok) throw new Error("Gagal mengambil data log Admin");

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Gagal mengambil log aktivitas Admin:", error);
    return [];
  }
};
