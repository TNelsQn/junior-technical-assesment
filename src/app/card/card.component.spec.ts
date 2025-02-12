import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { of } from 'rxjs';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
    let productService: jest.Mocked<ProductService>;


    const mockProduct: Product = {
      id: '1',
      name: 'Test Product 1',
      description: 'Test Description 1',
      department: 'Test Department 1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

  beforeEach(async () => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit a project', () => {
    const updateSpy = jest.spyOn(component.edit, 'emit');

    component.onEdit();
    
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should delete a project', () => {
    const deleteSpy = jest.spyOn(component.delete, 'emit');

    component.onDelete();
    
    expect(deleteSpy).toHaveBeenCalled();;
  });
});
