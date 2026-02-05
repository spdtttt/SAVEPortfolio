/**
 * Format date string to Thai format
 * @param dateString - Date string in format YYYY-MM-DD
 * @returns Formatted Thai date string (e.g., "5 ก.พ. 2568")
 */
export const formatThaiDate = (dateString: string): string => {
  if (!dateString) return "";

  const thaiMonths = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543; // Convert to Buddhist Era

  return `${day} ${month} ${year}`;
};
