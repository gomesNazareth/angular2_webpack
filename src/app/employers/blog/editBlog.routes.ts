import { RouterModule } from '@angular/router';
import {BlogCreateFormComponent} from './blogCreateForm.component';
import {BlogEditFormComponent} from './blogEditForm.component';
import {ManageBlogComponent} from './manageBlog.component';
import {BlogDetailsComponent} from '../../core/blog/blogDetails.component';

//Guards
import  {CanEmpActivateGuard} from '../../canEmpActivateGuard.guard';


export const BlogRoutes = RouterModule.forChild([
  { path: '', component: BlogCreateFormComponent ,canActivate: [CanEmpActivateGuard]},
  { path: 'manage', component: ManageBlogComponent ,canActivate: [CanEmpActivateGuard] },
  { path: ':id', component: BlogDetailsComponent ,canActivate: [CanEmpActivateGuard]},
  { path: ':id/edit', component: BlogEditFormComponent ,canActivate: [CanEmpActivateGuard]},
  { path: ':id/:blogTitle', component: BlogDetailsComponent,canActivate:[CanEmpActivateGuard] }

]);
