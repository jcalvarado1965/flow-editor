import { Component, ViewChild } from '@angular/core';
import { DiagramComponent } from './diagram/diagram.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(DiagramComponent) diagram: DiagramComponent;

  isCollapsed = true;

  onClick(type: string) {
    this.diagram.addStep(type);
  }
}
