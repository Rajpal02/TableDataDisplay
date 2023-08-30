import { Injectable } from '@angular/core';
import { TimeFrameData } from './data.model';
import data from '../assets/data.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getTimeFrameData(): TimeFrameData[] {
    return data;
  }
}
