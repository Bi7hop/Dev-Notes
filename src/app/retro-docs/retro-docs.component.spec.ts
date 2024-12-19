import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetroDocsComponent } from './retro-docs.component';

describe('RetroDocsComponent', () => {
  let component: RetroDocsComponent;
  let fixture: ComponentFixture<RetroDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetroDocsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RetroDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
