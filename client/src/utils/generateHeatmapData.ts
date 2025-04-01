
import { type Activity } from "@shared/schema";
import { format, subMonths, eachDayOfInterval, isSameDay, getDay } from "date-fns";

export function generateHeatmapData(activities: Activity[]) {
  // Get dates for the past year
  const endDate = new Date();
  const startDate = subMonths(endDate, 12);
  
  // Generate all dates in the interval
  const daysInInterval = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Create a matrix of weeks (columns) and days (rows)
  const heatmap: { date: string; count: number }[][] = Array(7).fill(null).map(() => []);
  
  // Get the months for labels
  const months: string[] = [];
  let currentMonth = '';
  
  // Fill in the heatmap data
  daysInInterval.forEach((date) => {
    const monthName = format(date, 'MMM');
    if (monthName !== currentMonth) {
      months.push(monthName);
      currentMonth = monthName;
    }
    
    // Generate random contribution count (0-10)
    const count = Math.floor(Math.random() * 11);
    
    // Get the day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = getDay(date);
    
    // Add to heatmap
    heatmap[dayOfWeek].push({
      date: format(date, 'MMM d, yyyy'),
      count
    });
  });
  
  // Deduplicate months
  const uniqueMonths = Array.from(new Set(months));
  
  return {
    heatmap,
    months: uniqueMonths
  };
}
