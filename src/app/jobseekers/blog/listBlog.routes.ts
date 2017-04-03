import { RouterModule } from '@angular/router';
import {BlogComponent} from '../../core/blog/blog.component';
import {BlogDetailsComponent} from '../../core/blog/blogDetails.component';
import {ListBlogComponent} from './listBlog.component';
import {CanJobActivateGuard} from '../../canJobActivateGuard.guard';

export const BlogRoutes = RouterModule.forChild([
  { path: '', component: ListBlogComponent,canActivate:[CanJobActivateGuard] },
  { path: ':id', component: BlogDetailsComponent,canActivate:[CanJobActivateGuard] },
  { path: ':id/:blogTitle', component: BlogDetailsComponent,canActivate:[CanJobActivateGuard] },
]);
