import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { type Activity } from "@shared/schema";
import { generateHeatmapData } from "@/utils/generateHeatmapData";
import { useTranslation } from "@/lib/LanguageContext";

interface ActivityHeatmapCardProps {
  activities: Activity[];
}

export default function ActivityHeatmapCard({ activities }: ActivityHeatmapCardProps) {
  const { t } = useTranslation();
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number; opacity: number }[][]>([]);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    if (activities.length > 0) {
      const data = generateHeatmapData(activities);
      setHeatmapData(data.heatmap);
      setMonths(data.months);
    }
  }, [activities]);

  const days = t('activity.days').split(',');

  return (
    <Card className="card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md col-span-1 md:col-span-2 lg:col-span-2 transition-all hover:translate-y-[-5px] hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarIcon className="text-xl mr-2 dark:text-gray-300" />
          <h2 className="text-xl font-bold dark:text-white">{t('activity.title')}</h2>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{t('activity.subtitle')}</div>
      </div>
      
      <div className="heatmap-wrapper overflow-x-auto pb-2">
        <div className="heatmap flex flex-col min-w-max">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-12"></div> {/* Empty space for alignment */}
            <div className="flex justify-between w-full">
              {months.map((month, index) => (
                <div key={index} className="month-label w-20 text-sm text-gray-500 dark:text-gray-400">{month}</div>
              ))}
            </div>
          </div>
          
          {/* Heatmap grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="flex">
                <div className="day-label w-12 text-xs text-right text-gray-400 dark:text-gray-500 pr-2 flex items-center justify-end">
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
                      backgroundColor: cell.count === 0 
                        ? (document.documentElement.classList.contains('dark') ? '#2d3748' : '#eeeeee') 
                        : cell.count < 5 
                          ? (document.documentElement.classList.contains('dark') ? '#6b46c1' : '#d1c1e0') 
                          : (document.documentElement.classList.contains('dark') ? '#805ad5' : '#9b59b6'),
                      opacity: cell.opacity
                    }}
                    title={`${cell.date}: ${cell.count} ${t('activity.contributions')}`}
                  >
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="legend flex items-center justify-end mt-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">{t('activity.less')}</div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: document.documentElement.classList.contains('dark') ? '#2d3748' : '#eeeeee'}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: document.documentElement.classList.contains('dark') ? '#6b46c1' : '#d1c1e0', opacity: 0.2}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: document.documentElement.classList.contains('dark') ? '#6b46c1' : '#d1c1e0', opacity: 0.4}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: document.documentElement.classList.contains('dark') ? '#6b46c1' : '#d1c1e0', opacity: 0.6}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: document.documentElement.classList.contains('dark') ? '#805ad5' : '#9b59b6', opacity: 0.8}}></div>
          <div className="activity-cell" style={{width: '12px', height: '12px', margin: '2px', borderRadius: '2px', backgroundColor: document.documentElement.classList.contains('dark') ? '#805ad5' : '#9b59b6', opacity: 1}}></div>
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">{t('activity.more')}</div>
        </div>
      </div>
    </Card>
  );
}
