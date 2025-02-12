import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() product!: Product;
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();


  onEdit() {
    this.edit.emit(this.product);
  }

  onDelete() {
    this.delete.emit(this.product);
  }
}