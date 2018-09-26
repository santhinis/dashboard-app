import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JackpotsComponent } from './jackpots.component';

describe('JackpotsComponent', () => {
  let component: JackpotsComponent;
  let fixture: ComponentFixture<JackpotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JackpotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JackpotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
