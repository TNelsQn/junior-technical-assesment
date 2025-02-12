import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnChanges {
  @Input() product?: Product;
  @Output() save = new EventEmitter<Omit<Product, 'createdAt' | 'updatedAt'>>();
  @Output() cancel = new EventEmitter<void>();

  productForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$')],],
      description: ['', [Validators.required, Validators.minLength(10)]],
      department: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        department: this.product.department
      });
    } else if (changes['product'] && !this.product) {
      this.resetForm();
    }
  }

  // @fixme do not reset the form if there are errors
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.productForm.valid) {
      this.save.emit(this.productForm.value);
      this.resetForm();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.productForm.reset({
      name: '',
      description: '',
      department: ''
    });
  }

  shouldShowError(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && (control.touched || this.isSubmitted) && control.errors);
  }
}
