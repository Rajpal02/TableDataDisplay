import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { TimeFrameData } from '../data.model';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),
      transition(':leave',
        animate(600, style({ opacity: 0 }))
      )
    ])
  ]
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['timeFrame', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dataSource: any[] = [];
  edits: { date_time: string, display_value: number }[] = [];
  isEditing: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataSource = this.groupByHour(this.dataService.getTimeFrameData());
  }

  toggleEditMode(): void {
  this.isEditing = !this.isEditing;
  }

  groupByHour(data: TimeFrameData[]): any[] {
  let grouped: any = {};
  data.forEach(item => {
    const hour = new Date(item.date_time).getUTCHours();
    const day = new Date(item.date_time).getUTCDay();
    const dayKey = this.displayedColumns[day + 1];
    const formattedHour = this.formatHour(hour);
    if (!grouped[hour]) {
      grouped[hour] = { timeFrame: `${formattedHour} - ${this.formatHour(hour + 1)}` };
    }
    grouped[hour][dayKey] = item.display_value;
    // Save the original date_time for editing
    grouped[hour][dayKey + 'DateTime'] = item.date_time;
  });
  return Object.values(grouped);
}

formatHour(hour: number): string {
  let suffix = 'AM';
  if (hour >= 12) {
    suffix = 'PM';
    hour = hour > 12 ? hour - 12 : hour;
  } else if (hour === 0) {
    hour = 12;
  }
  return `${hour}:00 ${suffix}`;
}


 
  onEdit(hour: string, day: string, value: number): void {
    const date_time = this.dataSource.find(row => row.timeFrame === hour)[day + 'DateTime'];
    this.edits.push({ date_time, display_value: value });
  }
  
  onSubmit(): void {
  this.edits.forEach(edit => console.log(edit));
  this.edits = [];
  this.isEditing = false;
  }
}
