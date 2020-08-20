import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrpLoginComponent } from './srp-login.component';

describe('CustomLoginComponent', () => {
  let component: SrpLoginComponent;
  let fixture: ComponentFixture<SrpLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SrpLoginComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
