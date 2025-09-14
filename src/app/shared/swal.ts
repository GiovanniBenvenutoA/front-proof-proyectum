import Swal, { SweetAlertOptions } from 'sweetalert2';


export const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  customClass: { popup: 'rounded-pill px-3 py-2 shadow-sm' }
});