import { type Activity } from "@shared/schema";
import { format, subMonths, eachDayOfInterval, isSameDay, getDay } from "date-fns";

export function generateHeatmapData(activities: Activity[]) {
  // Get dates for the past 6 months
  const endDate = new Date();
  const startDate = subMonths(endDate, 6);
  
  // Generate all dates in the interval
  const daysInInterval = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Create a matrix of weeks (columns) and days (rows)
  const heatmap: { date: string; count: number; opacity: number }[][] = Array(7).fill(null).map(() => []);
  
  // Get the months for labels
  const months: string[] = [];
  let currentMonth = '';
  
  // Fill in the heatmap data
  daysInInterval.forEach((date) => {
    const monthName = format(date, 'MMMM');
    if (monthName !== currentMonth) {
      months.push(monthName);
      currentMonth = monthName;
    }
    
    // Find if there's an activity for this date
    const activity = activities.find(a => isSameDay(new Date(a.date), date));
    const count = activity ? activity.count : 0;
    
    // Calculate opacity based on count (0 to 1)
    const maxCount = 10; // Assuming max count is 10
    const opacity = count === 0 ? 1 : Math.min(Math.max(count / maxCount, 0.1), 1);
    
    // Get the day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = getDay(date);
    
    // Add to heatmap
    heatmap[dayOfWeek].push({
      date: format(date, 'MMM d, yyyy'),
      count,
      opacity
    });
  });
  
  // Deduplicate months
  const uniqueMonths = months.filter((month, index, self) => 
    self.indexOf(month) === index
  );
  
  return {
    heatmap,
    months: uniqueMonths
  };
}
