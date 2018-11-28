import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Article } from './article';

@Injectable()
export class ArticleService {
    
    allArticlesUrl = "http://localhost:8080/user/all-articles";
    articleUrl = "http://localhost:8080/user/article";
    
    constructor(private http:Http) { 
    }
   
    getAllArticles(): Observable<Article[]> {
        return this.http.get(this.allArticlesUrl)
	       .map(this.extractData)
	       .catch(this.handleError);

    }
    
    createArticle(article: Article):Observable<number> {
	let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.post(this.articleUrl, article, options)
               .map(success => success.status)
               .catch(this.handleError);
    }
    
    getArticleById(articleId: string): Observable<Article> {
	let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
	let cpParams = new URLSearchParams();
	cpParams.set('id', articleId);			
	let options = new RequestOptions({ headers: cpHeaders, params: cpParams });
	return this.http.get(this.articleUrl, options)
		.map(this.extractData)
		.catch(this.handleError);
    }	
    
    updateArticle(article: Article):Observable<number> {
	let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.put(this.articleUrl, article, options)
               .map(success => success.status)
               .catch(this.handleError);
    }
    	
    deleteArticleById(articleId: string): Observable<number> {
	let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
	let cpParams = new URLSearchParams();
	cpParams.set('id', articleId);			
	let options = new RequestOptions({ headers: cpHeaders, params: cpParams });
	return this.http.delete(this.articleUrl, options)
	       .map(success => success.status)
	       .catch(this.handleError);
    }		
    private extractData(res: Response) {
	let body = res.json();
        return body;
    }
    private handleError (error: Response | any) {
	console.error(error.message || error);
	return Observable.throw(error.status);
    }
} 