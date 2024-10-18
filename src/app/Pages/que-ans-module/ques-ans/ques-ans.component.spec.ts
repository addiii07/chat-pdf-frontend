import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesAnsComponent } from './ques-ans.component';

describe('QuesAnsComponent', () => {
  let component: QuesAnsComponent;
  let fixture: ComponentFixture<QuesAnsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuesAnsComponent]
    });
    fixture = TestBed.createComponent(QuesAnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
