import { Component, OnInit } from '@angular/core';
import { PageResponse } from 'src/app/models/page';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { swalModern } from 'src/app/shared/swal-theme';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  q = '';
  page = 0;
  size = 10;
  data: PageResponse<Product> | null = null;
  loading = false;
  token:string | undefined;

  constructor(private productSrv: ProductService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.productSrv.token('admin','admin123').subscribe({
      next: (resp) => {
        this.token=resp.token
        console.log('Token recibido:', resp.token);
        console.log('Token recibido:', this.token);
      },
      error: (err) => {
        console.error('Error al loguear:', err);
      }
    });
    this.productSrv.list(this.q, this.page, this.size).subscribe({
      next: (res) => { this.data = res; this.loading = false; },
      error: (e) => { this.loading = false; Swal.fire('Error', this.msg(e), 'error'); }
    });
  }

  search() { this.page = 0; this.load(); }
  clear() { this.q = ''; this.search(); }

  changePage(p: number) {
    if (!this.data) return;
    if (p < 0 || p >= this.data.totalPages) return;
    this.page = p;
    this.load();
  }

  async openCreate() {
  const { value } = await swalModern.fire({
    title: 'Nuevo producto',
    html: this.formHtml(),
    preConfirm: () => this.readForm(),
    didOpen: () => setTimeout(() => (document.getElementById('nameProduct') as HTMLInputElement)?.focus(), 0)
  } as any);

  if (!value) return;
  this.productSrv.create(value).subscribe({
    next: (p) => { swalModern.fire({ icon: 'success', title: 'Creado', text: `Se creó "${p.nameProduct}"` }); this.load(); },
    error: (e) => swalModern.fire({ icon: 'error', title: 'Error', text: this.msg(e) })
  });
}

  async openEdit(p: Product) {
  const { value } = await swalModern.fire({
    title: `Editar #${p.id}`,
    html: this.formHtml(p),
    preConfirm: () => this.readForm(),
    didOpen: () => setTimeout(() => (document.getElementById('nameProduct') as HTMLInputElement)?.focus(), 0)
  } as any);

  if (!value) return;
  this.productSrv.update(p.id!, value).subscribe({
    next: (u) => { swalModern.fire({ icon: 'success', title: 'Actualizado', text: `Se actualizó "${u.nameProduct}"` }); this.load(); },
    error: (e) => swalModern.fire({ icon: 'error', title: 'Error', text: this.msg(e) })
  });
}

  confirmDelete(p: Product) {
    Swal.fire({
      title: `Eliminar #${p.id}?`,
      text: `Esto eliminará el producto "${p.nameProduct}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(res => {
      if (res.isConfirmed) {
        this.productSrv.delete(p.id!).subscribe({
          next: () => { Swal.fire('Eliminado', 'Registro eliminado', 'success'); this.load(); },
          error: (e) => Swal.fire('Error', this.msg(e), 'error')
        });
      }
    });
  }

  private formHtml(p?: Product) {
  return `
    <div class="swal2-form-grid">
      <label for="nameProduct">Nombre</label>
      <input id="nameProduct" class="swal2-input" maxlength="120"
             value="${p?.nameProduct ?? ''}" placeholder="Ej: Teclado mecánico" />

      <label for="priceProduct">Precio</label>
      <input id="priceProduct" class="swal2-input" type="number" min="0" step="1"
             value="${p?.priceProduct ?? ''}" placeholder="45000" />

      <label for="stockProduct">Stock</label>
      <input id="stockProduct" class="swal2-input" type="number" min="0" step="1"
             value="${p?.stockProduct ?? 0}" placeholder="100" />

      <label for="descriptionProduct">Descripción</label>
      <textarea id="descriptionProduct" class="swal2-textarea" rows="3"
                placeholder="Breve descripción del producto">${p?.descriptionProduct ?? ''}</textarea>
    </div>
  `;
}

  private readForm(): Product | null {
    const nameProduct = (document.getElementById('nameProduct') as HTMLInputElement)?.value?.trim();
    const priceProduct = parseFloat((document.getElementById('priceProduct') as HTMLInputElement)?.value);
    const stockProduct = parseInt((document.getElementById('stockProduct') as HTMLInputElement)?.value, 10);
    const descriptionProduct = (document.getElementById('descriptionProduct') as HTMLTextAreaElement)?.value?.trim();

    if (!nameProduct) { Swal.showValidationMessage('Nombre es obligatorio'); return null; }
    if (isNaN(priceProduct) || priceProduct < 0) { Swal.showValidationMessage('Precio inválido'); return null; }
    if (isNaN(stockProduct) || stockProduct < 0) { Swal.showValidationMessage('Stock inválido'); return null; }

    return { nameProduct, priceProduct, stockProduct, descriptionProduct };
  }

  private msg(e: any): string {
    if (e?.error?.message) return e.error.message;
    if (e?.message) return e.message;
    return 'Ocurrió un error inesperado';
  }
}
