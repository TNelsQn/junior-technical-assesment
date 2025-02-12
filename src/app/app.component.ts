import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductService } from './services/product.service';
import { Product } from './models/product.model';
import { CardError } from './models/error.model';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ProductFormComponent, CardComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'junior-technical-assesment';
  selectedProduct?: Product;
  products: Product[] = [];
  cardError: CardError = { errorMessage: "", cardId: undefined };
  isLoading = false;

  constructor(private productService: ProductService) {}

  private handleError(error: any, action: string, productData?: Omit<Product, 'department' | 'description' | 'createdAt' | 'updatedAt'>): void {
    console.error(`Error ${action}:`, error);
    this.cardError.errorMessage = `An error occurred while ${action}${!!productData?.name ? ` ${productData.name}` : ''}. Please try again.`;
    this.cardError.cardId = productData?.id
  }

  private resetError (): void {
    this.cardError = {errorMessage: '', cardId: undefined}
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
        this.resetError()
      },
      error: (error) => {
        this.handleError(error, 'loading')
        this.isLoading = false;
      }
    });
  }

  onSaveProduct(productData: Omit<Product, 'createdAt' | 'updatedAt'>): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.selectedProduct = undefined;
          this.resetError()
        },
        // @fixme show errors to user
        error: (error) => this.handleError(error, 'updating', productData)
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.resetError()
        },
        // @fixme show errors to user
        error: (error) => this.handleError(error, 'creating', productData)
      });
    }
  }

  onEditProduct(product: Product): void {
    this.selectedProduct = product;
  }

  onDeleteProduct(product: Product): void {
    this.productService.deleteProduct(product.id).subscribe({
      next: (success) => {
        if (success) {
          this.loadProducts();
          this.resetError()
        }
      },
      error: (error) => this.handleError(error, 'deleting', product)
    });
  }

  onCancelForm(): void {
    this.selectedProduct = undefined;
    this.resetError()
  }
}
