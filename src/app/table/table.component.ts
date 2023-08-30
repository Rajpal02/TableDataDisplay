  import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { TimeFrameData } from '../data.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['timeFrame', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dataSource: any[] = [];
  edits: { date_time: string, display_value: number }[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataSource = this.groupByHour(this.dataService.getTimeFrameData());
  }

  groupByHour(data: TimeFrameData[]): any[] {
  let grouped: any = {};
  data.forEach(item => {
    const hour = new Date(item.date_time).getUTCHours();
    const day = new Date(item.date_time).getUTCDay();
    const dayKey = this.displayedColumns[day + 1];
    if (!grouped[hour]) {
      grouped[hour] = { timeFrame: `${hour}:00 - ${hour + 1}:00` };
    }
    grouped[hour][dayKey] = item.display_value;
    // Save the original date_time for editing
    grouped[hour][dayKey + 'DateTime'] = item.date_time;
  });
  return Object.values(grouped);
  }

 onEdit(hour: string, day: string, value: number): void {
  const date_time = this.dataSource.find(row => row.timeFrame === hour)[day + 'DateTime'];
  this.edits.push({ date_time, display_value: value });
}
  onSubmit(): void {
    console.log(this.edits);
  }
}
