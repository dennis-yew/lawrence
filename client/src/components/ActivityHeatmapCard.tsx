import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { type Activity } from "@shared/schema";
import { generateHeatmapData } from "@/utils/generateHeatmapData";

interface ActivityHeatmapCardProps {
  activities: Activity[];
}

export default function ActivityHeatmapCard({ activities }: ActivityHeatmapCardProps) {
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number; opacity: number }[][]>([]);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    if (activities.length > 0) {
      const data = generateHeatmapData(activities);
      setHeatmapData(data.heatmap);
      setMonths(data.months);
    }
  }, [activities]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="card bg-white rounded-2xl p-6 shadow-md col-span-1 md:col-span-2 lg:col-span-2 transition-all hover:translate-y-[-5px] hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarIcon className="text-xl mr-2" />
          <h2 className="text-xl font-bold">Activity</h2>
        </div>
        <div className="text-sm text-gray-500">Last 6 months</div>
      </div>
      
      <div className="heatmap-wrapper overflow-x-auto pb-2">
        <div className="heatmap flex flex-col min-w-max">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-12"></div> {/* Empty space for alignment */}
            <div className="flex justify-between w-full">
              {months.map((month, index) => (
                <div key={index} className="month-label w-20 text-sm text-gray-500">{month}</div>
              ))}
            </div>
          </div>
          
          {/* Heatmap grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="flex">
                <div className="day-label w-12 text-xs text-right text-gray-400 pr-2 flex items-center justify-end">
                  {dayIndex % 2 === 0 ? day : ''}
                </div>
                
                {heatmapData[dayIndex]?.map((cell, cellIndex) => (
                  <div 
                    key={cellIndex} 
                    className="activity-cell" 
                    style={{
                      width: '12px',
                      height: '12px',
                      margin: '2px',
                      borderRadius: '2px',
                      backgroundColor: cell.count === 0 ? '#eeeeee' : cell.count < 5 ? '#d1c1e0' : '#9b59b6',
                      opacity: cell.opacity
                    }}
                    title={`${cell.date}: ${cell.count} contributions`}
                  >
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="legend flex items-center justify-end mt-4">
          <div className="text-xs text-gray-500 mr-2">Less</div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: '#eeeeee'}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: '#d1c1e0', opacity: 0.2}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: '#d1c1e0', opacity: 0.4}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: '#d1c1e0', opacity: 0.6}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: '#9b59b6', opacity: 0.8}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: '#9b59b6', opacity: 1}}></div>
          <div className="text-xs text-gray-500 ml-2">More</div>
        </div>
      </div>
    </Card>
  );
}
