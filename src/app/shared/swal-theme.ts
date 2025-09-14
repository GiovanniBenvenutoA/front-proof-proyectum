import Swal, { SweetAlertOptions } from 'sweetalert2';

export const swalModern = Swal.mixin({
  width: '48rem',
  padding: '1.25rem',
  showCancelButton: true,
  confirmButtonText: 'Guardar',
  cancelButtonText: 'Cancelar',
  buttonsStyling: false, // usamos clases propias/Bootstrap
  customClass: {
    popup: 'swal2-modern',
    title: 'swal2-modern-title',
    htmlContainer: 'swal2-modern-body',
    confirmButton: 'btn btn-primary px-4 rounded-pill',
    cancelButton: 'btn btn-outline-secondary px-4 rounded-pill ms-2',
    actions: 'swal2-modern-actions'
  },
});