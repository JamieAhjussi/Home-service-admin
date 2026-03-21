/**
 * แปลงวันที่เป็นรูปแบบ DD/MM/YYYY HH:mmAM/PM (UTC+7)
 * เช่น "23/02/2026 02:30PM"
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString)
    .toLocaleString("en-GB", {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "") // ลบ comma ที่คั่นระหว่างวันที่กับเวลา
    .toUpperCase(); // am/pm → AM/PM
};
