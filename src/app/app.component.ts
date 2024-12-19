import { Component } from '@angular/core';
import { RetroDocsComponent } from './retro-docs/retro-docs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RetroDocsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dev-notes';
}