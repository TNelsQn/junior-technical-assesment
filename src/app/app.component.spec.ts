import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductService } from './services/product.service';
import { Product } from './models/product.model';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let productService: jest.Mocked<ProductService>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      department: 'Test Department 1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Test Description 2',
      department: 'Test Department 2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    const mockProductService = {
      getProducts: jest.fn().mockReturnValue(of(mockProducts)),
      createProduct: jest.fn().mockImplementation((product) =>
        of({
          ...product,
          id: '3',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ),
      updateProduct: jest.fn().mockImplementation((id, product) =>
        of({
          ...product,
          id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ),
      deleteProduct: jest.fn().mockReturnValue(of(true))
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, ProductFormComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', fakeAsync(() => {
    component.ngOnInit();
    tick(500);
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.isLoading).toBe(false);
  }));

  it('should create a new product', fakeAsync(() => {
    const newProduct = {
      id: '1',
      name: 'New Product',
      description: 'New Description',
      department: 'New Department'
    };

    component.onSaveProduct(newProduct);
    tick(500);

    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
    expect(productService.getProducts).toHaveBeenCalled();
  }));

  it('should update an existing product', fakeAsync(() => {
    const updateData = {
      id: '1',
      name: 'Updated Product',
      description: 'Updated Description',
      department: 'Updated Department'
    };

    component.selectedProduct = mockProducts[0];
    component.onSaveProduct(updateData);
    tick(500);

    expect(productService.updateProduct).toHaveBeenCalledWith('1', updateData);
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.selectedProduct).toBeUndefined();
  }));

  it('should delete a product', fakeAsync(() => {
    component.onDeleteProduct(mockProducts[0]);
    tick(500);

    expect(productService.deleteProduct).toHaveBeenCalledWith('1');
    expect(productService.getProducts).toHaveBeenCalled();
  }));

  it('should set selected product when editing', () => {
    component.onEditProduct(mockProducts[0]);
    expect(component.selectedProduct).toEqual(mockProducts[0]);
  });

  it('should clear selected product when cancelling', () => {
    component.selectedProduct = mockProducts[0];
    component.onCancelForm();
    expect(component.selectedProduct).toBeUndefined();
  });

  it('should handle error when loading products', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.getProducts.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.ngOnInit();
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.cardError.errorMessage).toBe('An error occurred while loading. Please try again.');
    expect(component.cardError.cardId).toBeFalsy();

    consoleErrorSpy.mockRestore();
  }));

  it('should handle error when creating product', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.createProduct.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.onSaveProduct({
      id: '1',
      name: 'Test',
      description: 'Test',
      department: 'Test'
    });
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(component.cardError.errorMessage).toBe('An error occurred while creating Test. Please try again.');
    expect(component.cardError.cardId).toBe('1');
    consoleErrorSpy.mockRestore();
  }));

  it('should handle error when updating product', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.updateProduct.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.selectedProduct = mockProducts[0];
    component.onSaveProduct({
      id: '1',
      name: 'Test',
      description: 'Test',
      department: 'Test'
    });
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(component.cardError.errorMessage).toBe('An error occurred while updating Test. Please try again.');
    expect(component.cardError.cardId).toBe('1');
    consoleErrorSpy.mockRestore();
  }));

  it('should handle error when deleting product', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.deleteProduct.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.onDeleteProduct(mockProducts[0]);
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(component.cardError.errorMessage).toBe('An error occurred while deleting Test Product 1. Please try again.');
    expect(component.cardError.cardId).toBe('1');
    consoleErrorSpy.mockRestore();
  }));
});
