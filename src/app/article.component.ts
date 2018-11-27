import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ArticleService } from './article.service';
import { Article } from './article';

@Component({
   selector: 'app-article',
   templateUrl: './article.component.html',
   styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit { 
   
   allArticles: Article[];
   statusCode: number;
   requestProcessing = false;
   articleIdToUpdate = null;
   processValidation = false;
   
   articleForm = new FormGroup({
       title: new FormControl('', Validators.required),
       category: new FormControl('', Validators.required)	   
   });
   
   constructor(private articleService: ArticleService) {
   }
   
   ngOnInit(): void {
	   this.getAllArticles();
   }   
   
   getAllArticles() {
        this.articleService.getAllArticles()
	   .subscribe(
                data => this.allArticles = data,
                errorCode =>  this.statusCode = errorCode);   
   }
  
   onArticleFormSubmit() {
	  this.processValidation = true;   
	  if (this.articleForm.invalid) {
	       return; 
	  }   
	  
          this.preProcessConfigurations();
	  let title = this.articleForm.get('title').value.trim();
          let category = this.articleForm.get('category').value.trim();	  
	  if (this.articleIdToUpdate === null) {  
	    
	    let article= new Article(null, title, category);	  
	    this.articleService.createArticle(article)
	      .subscribe(successCode => {
		              this.statusCode = successCode;
			      this.getAllArticles();	
			      this.backToCreateArticle();
			},
		        errorCode => this.statusCode = errorCode);
	  } else {  
   	    
	    let article= new Article(this.articleIdToUpdate, title, category);	  
	    this.articleService.updateArticle(article)
	      .subscribe(successCode => {
		        this.statusCode = successCode;
			      this.getAllArticles();	
			      this.backToCreateArticle();
			},
		        errorCode => this.statusCode = errorCode);	  
	  }
   }
   
   loadArticleToEdit(articleId: string) {
      this.preProcessConfigurations();
      this.articleService.getArticleById(articleId)
	      .subscribe(article => {
		            this.articleIdToUpdate = article.articleId;   
		            this.articleForm.setValue({ title: article.title, category: article.category });
			    this.processValidation = true;
			    this.requestProcessing = false;   
		    },
		    errorCode =>  this.statusCode = errorCode);   
   }
   
   deleteArticle(articleId: string) {
      this.preProcessConfigurations();
      this.articleService.deleteArticleById(articleId)
	      .subscribe(successCode => {
		      this.statusCode = successCode;
		      this.getAllArticles();	
		      this.backToCreateArticle();
		   },
		   errorCode => this.statusCode = errorCode);    
   }
   
   preProcessConfigurations() {
          this.statusCode = null;
	  this.requestProcessing = true;   
   }
   
   backToCreateArticle() {
          this.articleIdToUpdate = null;
          this.articleForm.reset();	  
	  this.processValidation = false;
   }
} 