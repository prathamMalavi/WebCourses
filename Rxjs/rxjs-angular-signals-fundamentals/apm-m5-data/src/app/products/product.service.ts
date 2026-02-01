import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ProductData } from './product-data';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  // private productsUrl = 'api/products/sla';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  // Declarative Approach

  readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap(() => console.log('In http.get pipeline')),
    // if you want to handle error in the subscribe block to manage UI changes when error occurs
    catchError(err => this.handleError(err)),
    // or
    // if you want to handle error here and provide fallback data so in subscribe block no error occurs and emits completed notification
    // catchError(err=> {
    //   console.log('In catchError operator', err);
    //   return of(ProductData.products)
    //   or // return this.handleError(err)  or // return EMEPTY;
    // }),
  );

























  // Procedural Approach

  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(() => console.log('In http.get pipeline')),
  //       // if you want to handle error in the subscribe block to manage UI changes when error occurs
  //       catchError(err=> this.handleError(err)),
  //       // or
  //       // if you want to handle error here and provide fallback data so in subscribe block no error occurs and emits completed notification
  //       // catchError(err=> {
  //       //   console.log('In catchError operator', err);
  //       //   return of(ProductData.products)
  //       //   or // return this.handleError(err)  or // return EMEPTY;
  //       // }),
  //     );
  // }

  getProduct(id: number): Observable<Product> {
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
      .pipe(
        //trying map
        // map(product => this.getProductWithReviews(product)),  //=> returns 'Observable<Observable<Product>>' as the further http is not subscribed
        // map(product => this.getProductWithReviews(product).subscribe(product=> product)),  //=> returns 'Observable<Subscription>'
        switchMap(product => this.getProductWithReviews(product)), //=> returns 'Observable<Product>'
        tap(() => console.log('In http.get by id pipeline')),
        catchError(err => this.handleError(err))
      );
  }


  private getProductWithReviews(product: Product): Observable<Product> {
    if(product.hasReviews){
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(
          map(reviews => ({...product, reviews} as Product))
        );
    }else{
      return of(product);
    }
  }



  handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMsg = this.errorService.formatError(err);
    // throwError(() => formattedMsg);
    throw formattedMsg;
  }
}
