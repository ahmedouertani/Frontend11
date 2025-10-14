import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-view-ordered-products',
  standalone: false,
  templateUrl: './view-ordered-products.component.html',
  styleUrls: ['./view-ordered-products.component.css']
})
export class ViewOrderedProductsComponent implements OnInit {
  orderId: any;
  orderedProductDetailsList=[] ;
  totalAmount: any;

  constructor(
    private customerService: CustomerService,
    private activatedroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.orderId=this.activatedroute.snapshot.params['orderId'];
    this.getOrderedProductsDetailsByOrderId();
  }

  getOrderedProductsDetailsByOrderId(): void {
    this.customerService.getOrderedProducts(this.orderId).subscribe(res => {
      res.productDtosList.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
    
        // ✅ Ajout du total par produit
        element.total = element.price * element.quantity;
    
        this.orderedProductDetailsList.push(element);
      });
    
      this.totalAmount = res.orderAmount; // total général
    });
    
}}