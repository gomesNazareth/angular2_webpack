import {Http,Headers, RequestOptions} from '@angular/http';
import {ConfigService} from '../../../shared/config.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {Injectable,Inject} from '@angular/core';
import {Observable} from 'rxjs/Rx';

//Models
import {Blog,Comment,Tag} from "../models/blog";
import {AccountService} from  '../../account/services/account.service';

import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class BlogService {

    public _url = "blogs";
    public _url_desc = "blog_details.html";

    public AuthHeader;
    public AuthHeader2;
    public AuthHeader3;
    public AuthHeaderPdf;
    public userId;
    public userType;
    public employerId;
    public companyId;
    public totalPages:number = 20;
    public isPublic:boolean;

    constructor(public _http: Http, @Inject(AccountService) authService:AccountService, public _location:Location) {

        this.AuthHeader = authService.AuthHeader();
        this.AuthHeader2 = authService.AuthHeader2();
        this.AuthHeader3 = authService.AuthHeader3();
        this.AuthHeaderPdf = authService.AuthHeaderPDF();
        this.userId = authService.getUserId();
        this.userType = authService.getUserType();
        this.employerId = authService.getEmployerId();
        this.companyId = authService.getCompanyId();
        this.isPublic = (this._location.path().indexOf('/home') != -1);

    }

    public _getTopBlogList(data) {
        let topViewedBlogs = this._getBuildBlog(data.blogs);

        return {"top":topViewedBlogs}
    }

    public _getTrendinfBlogList(data) {
        let trendingBlogs =  this._getBuildBlog(data.blogs);

        return {"trending":trendingBlogs}
    }

    public _getBlogList(data) {
        let generalBlogs =   this._getBuildBlog(data.blogs);

        return {"general": generalBlogs, "meta": data.meta}
    }

    public _buildSingleBlog(val) {

        let blog = new Blog();
        blog.id = val.id;
        blog.name = val.title;
        blog.bannerImage = val.avatar;
        blog.description = val.description;
        blog.image  = val.avatar;
        blog.postDate = val["created_at"];
        if(val["author"]) {
            blog.postedUserName= val["author"]["name"];
            blog.postedUserId= val["author"]["id"];
            blog.postedUserIcon= val["author"]["avatar"];
        }
        blog.tags = val.tags;
        blog.likes = val.likes_count;
        blog.liked = val.is_liked_by_current_user;
        blog.current_user_avatar = val.current_user_avatar;
        blog.totalComments = val.comments_count;
        if(val.comments) {
            blog.totalComments = val.comments.length;
            if(val.comments.length >0)
            {
                val.comments.forEach(selComment => {

                    let comment = new Comment();
                    comment.id = selComment.id;
                    comment.description = selComment.content;
                    comment.postedDate = selComment.created_at;
                    comment.userName = selComment["user"]["name"];
                    comment.userId = selComment["user"]["id"];

                    blog.comments.push(comment);
                })
            }

        }

        let commentList = Array();

        if(val.comments)
        val.comments.forEach(val =>{

            let selComment = new Comment();
            selComment.id = val.id;
            selComment.userId = val.commented_user_id;
            selComment.userName = val.commented_user_name;
            selComment.description = val.comment_description;
            selComment.postedDate = val.comment_posted_date;
            selComment.postedTime = val.comment_posted_time;
            commentList.push(selComment);

        });
        blog["comment"]= commentList;



        return blog;


    }

    public _getBuildBlog(data){

        let blogList = Array();


        data.forEach(val=>{
            blogList.push(this._buildSingleBlog(val));
        });


        return blogList;
    }


    getTrendingBlogList(BlogType:string ="all",mode="short",query=""):Observable<any>{

        let url = ConfigService.getAPI()+this._url;
        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getTrendinfBlogList(res));

    }

    getTopBlogList(BlogType:string ="all",mode="short",query=""):Observable<any>{

        let url = ConfigService.getAPI()+this._url+'?order=views';
        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getTopBlogList(res));

    }

    public _getBuildTagUrl(tagList:number[]=null){

        let tag_url = "";
        if(tagList != null && tagList.length > 0) {

            tagList.forEach(seltag => {

                if(seltag != null)
                    tag_url +="&q[tags_id_in][]="+seltag;
            })
        }

        return tag_url;
    }

    getBlogList(BlogType:string ="all",mode="short",tag:number[]=null,page:number=1,query=""):Observable<any>{

        if(this.userType == "employer") {
            return this.getBlogListAtCompanies(BlogType, mode, tag, page, query);
        }

        let tag_url = this._getBuildTagUrl(tag);
        let url = ConfigService.getAPI()+this._url+"?page="+page+tag_url;

        return this._http.get(url,this.AuthHeader2)
            .map(res => res.json())
            .map(res => this._getBlogList(res));

    }


    getBlogListAtCompanies(BlogType:string ="all",mode="short",tag:number[]=null,page:number=1,query=""):Observable<any>{

        let tag_url = this._getBuildTagUrl(tag);
        let url = ConfigService.getAPI()+"companies/"+this.companyId+"/blogs"+"?page="+page+tag_url;

        return this._http.get(url,this.AuthHeader)
            .map(res => res.json())
            .map(res => this._getBlogList(res));

    }


    public _getBlogDetails(res){

        let selectedBlog =  this._buildSingleBlog(res.blog);
        return {"selectedBlog":selectedBlog} ;
    }


    public getBlogPdf(blogId:number, blogName:string):Observable<any>{
        // this.AuthHeaderPdf["responseType"] = 'arraybuffer';

        let returnObs = new BehaviorSubject(null);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                return returnObs.next("success");
            }
        };
        var url = ConfigService.getAPI()+this._url+'/'+blogId+'/show_pdf';
        xhr.open('GET', url, this.AuthHeaderPdf);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
           if (this["status"] == 200) {
              var blob=new Blob([this["response"]], {type:"application/pdf"});
              var link=document.createElement('a');
              link.href=window.URL.createObjectURL(blob);
              link["download"]=blogName+".pdf";
              link.click();
           }
        };
        xhr.send();

        return returnObs;

    }

    public getPostBlog(commentString:string,blogId:number) {

            let url = ConfigService.getAPI()+this._url+'/'+blogId+'/comments';
            let postData = '{"comment":{"content":"'+commentString+'"} }';


        return this._http.post(url,postData,this.AuthHeader2)
            .map(res=>res.json());
    }

    getBlogLike(id:number){

        let url = ConfigService.getAPI()+this._url+'/'+id+'/like';

        return this._http.put(url,'',this.AuthHeader2)
            .map(res=>res.json());
    }


    getBlogUnLike(id:number){

        return this._http.put(ConfigService.getAPI()+this._url+'/'+id+'/dislike','',this.AuthHeader2  )
            .map(res=>res.json());
    }


    public _buildTags (val) {

        let tags = [];
        if(val.tags.length >0) {

            val.tags.forEach(selTag => {

                let tag = new Tag();
                tag.id = selTag.id;
                tag.name = selTag.name

                tags.push(tag);

            });
        }

        return tags;
    }

    getBlogTags():Observable<any> {

        let url = ConfigService.getAPI()+this._url+'/tags';

        if (this.isPublic){
            return this._http.get(url)
                .map(res=>res.json())
                .map(res => this._buildTags(res));
        }else{
            return this._http.get(url,this.AuthHeader)
                .map(res=>res.json())
                .map(res => this._buildTags(res));

        }
    }

    getBlogDetails(id:number):Observable<any>{
        let url = ConfigService.getAPI()+this._url+'/'+id;

        return this._http.get(url,this.AuthHeader)
                   .map(res=>res.json())
                   .map(res => this._getBlogDetails(res));
    }

    updateBlog(blogId:number,postData):Observable <any[]>{

        postData['blog']['company_user_id'] = this.employerId;

        if(blogId)
            return this._http.put(ConfigService.getAPI()+this._url+'/'+blogId,JSON.stringify(postData),this.AuthHeader2)
                .map(res => res.json())
                .map(res => this._getBuildBlog([res["blog"]]));
        else
            return this._http.post(ConfigService.getAPI()+this._url+'/',JSON.stringify(postData),this.AuthHeader2)
                .map(res => res.json())
                .map(res => this._getBuildBlog([res["blog"]]));


    }


    postBlogWithImage(blogId:number,formData:FormData):Observable <any[]>{


        return Observable.create(observer => {
            formData.append('blog[company_user_id]', this.employerId);

            let headers = new Headers();
            headers.append('Content-Type', 'multipart/form-data');
            // headers.append('Accept', 'application/json');
            headers.append('Authorization', '28B2xmkRhJFWaqvZDsfx');
            let options = new RequestOptions({ headers: headers });

            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            let url = ConfigService.getAPI() + this._url + '/';
            let method = "POST";
            if(blogId){
                method = "PUT";
                url = url + blogId + '/';
            }


            xhr.open(method, url, true);
            xhr.setRequestHeader("Authorization", "28B2xmkRhJFWaqvZDsfx");
            xhr.send(formData);
        });
    }

    deleteBlog(blogId:number){

        return this._http.delete(ConfigService.getAPI()+this._url+'/'+blogId,this.AuthHeader3)
            .map(res => res);

    }


}
