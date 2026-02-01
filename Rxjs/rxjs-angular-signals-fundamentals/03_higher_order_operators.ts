// @ts-nocheck
import 'zone.js';
import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { concatMap, delay, mergeMap, of, range, switchMap } from 'rxjs';


// range(start , count)


@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>
  `,
})
export class App implements OnInit {
  name = 'Angular';

  ngOnInit() {
    // this.concatMapFun();
    // this.mergeMapFun();
    this.switchMapFun();
  }

  // Ordered & Sequential Execution
  concatMapFun() {
    console.log('Concat Map :: ');
    range(1, 10)
      .pipe(concatMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((val) => console.log('Concat Map : ' + val));
  }

  // Not Ordered & Parallel Execution
  mergeMapFun() {
    console.log('Merge Map :: ');
    range(1, 10)
      .pipe(mergeMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((val) => console.log('Merge Map : ' + val));
  }

  // Last Obs (Switch from outer -> inner always till the last emmition)
  // one Emition
  switchMapFun() {
    console.log('Switch Map :: ');
    range(21, 10)
      .pipe(switchMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((val) => console.log('Switch Map : ' + val));
  }

  randomDelay() {
    // returns random miliseconds
    // random Delay to check merge unordered behaviour
    return Math.floor(Math.random() * 1000) + 500;
    // return 0;
    // return 5000;
  }
}

bootstrapApplication(App);
