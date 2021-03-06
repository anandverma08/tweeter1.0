import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [

  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: PostCreateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignupComponent },
  { path: '', component: PostListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
