/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TutorComponent } from './tutor.component';

describe('TutorComponent', () => {
  let component: TutorComponent;
  let fixture: ComponentFixture<TutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
