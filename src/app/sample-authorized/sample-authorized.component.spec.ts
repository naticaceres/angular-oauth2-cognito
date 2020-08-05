import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleAuthorizedComponent } from './sample-authorized.component';

describe('SampleAuthorizedComponent', () => {
  let component: SampleAuthorizedComponent;
  let fixture: ComponentFixture<SampleAuthorizedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleAuthorizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleAuthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
