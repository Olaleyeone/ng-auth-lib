import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { LoggedInGuard } from './logged-in.guard';


describe('LoggedInGuard', () => {

  let guard: LoggedInGuard;
  let router: Router;
  let authService: AuthenticationService;

  beforeEach(() => {
    authService = {} as any;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            getUser: () => {
              return of(null);
            }
          } as any
        }
      ]
    });
    guard = TestBed.inject(LoggedInGuard);
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.get(Router);
    spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not activate', () => {
    authService.getUser = () => {
      return throwError({});
    };
    const res = guard.canActivate(null, null);
    expect(res).toBeInstanceOf(Observable);
    (res as Observable<boolean>).subscribe(activate => {
      expect(activate).toBeFalse();
    });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not activate with falsy user', () => {
    const res: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree = guard.canActivate(null, null);
    expect(res).toBeInstanceOf(Observable);
    (res as Observable<boolean>).subscribe(activate => {
      expect(activate).toBeFalse();
    });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should activate', () => {
    authService.getUser = () => {
      return of({} as User);
    };
    const res: Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree = guard.canActivate(null, null);
    expect(res).toBeInstanceOf(Observable);
    (res as Observable<boolean>).subscribe(activate => {
      expect(activate).toBeTrue();
    });
    expect(router.navigate).not.toHaveBeenCalledWith(['/login']);
  });
});
