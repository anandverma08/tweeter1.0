import { Component, OnInit, ɵSWITCH_IVY_ENABLED__POST_R3__, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated : boolean = false
  userAuthenticationStatus : Subscription
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getUserLoggedIn();
    this.userAuthenticationStatus = this.authService.getUserAuthenticationStatus().subscribe((status)=>{
      this.isUserAuthenticated = status;
    })

  }
  ngOnDestroy():void {
    this.userAuthenticationStatus.unsubscribe();
  }

  logOut(){
    this.authService.logout();
  }

}
