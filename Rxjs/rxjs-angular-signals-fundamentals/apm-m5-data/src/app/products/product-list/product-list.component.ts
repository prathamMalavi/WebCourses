import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe],
})
export class ProductListComponent { // implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage = '';
  sub!: Subscription;

  private productService = inject(ProductService);



  // Now we dont need the ngOninit also we dont need to unsubscript as we have a readonly  directly use with async pipe
  readonly products$: Observable<Product[]> = this.productService.products$.pipe(
    tap(() => console.log('In component pipeline')),
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    }))




  // Selected product id to highlight the entry
  selectedProductId: number = 0;



  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }



  // As we use Declarative Approach SO NO NEED TO SUBSCRIBE MANUALLY AND UNSUBSCRIBE

  // Products
  // products: Product[] = [];

  // ngOnInit(): void {
  //   this.sub = this.productService.products$
  //     .pipe(tap(() => console.log('In component pipeline')))
  //     .subscribe({
  //       next: (products) => {
  //         this.products = products;
  //         console.log(this.products);
  //       },
  //       error: (err) => (this.errorMessage = err),
  //       complete: () => console.log('Completed Getting All Products'),
  //     });
  // }
  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }
}
