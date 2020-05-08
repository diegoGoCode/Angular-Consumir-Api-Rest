import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from 'src/app/Service/cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes:Cliente[];
  paginador: any;
  constructor(private serviceCliente:ClienteService,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.serviceCliente.getClientes(page).pipe(
        tap(response => {
          console.log('ClienteComponent: tap 3');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          });
        })
      ).subscribe(response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;
      });
    });
  }

  /**
   * Metodo que se encarga de obteber los clientes, para cargalos en la tabla
   
  cargarClientesTabla():void{
    this.serviceCliente.getClientes().subscribe(dataHttp=>{
      this.clientes=dataHttp
    });
  }
  */
  
  /**
   * Metodo que se encarga de invocar el metodo delete para eliminar un cliente
   * @param cliente hace referencia al cliente que se eliminara
   */
  delete(cliente:Cliente): void{
    swal.fire({
      title: '¿Esta Seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.value) {
        this.serviceCliente.delete(cliente.id).subscribe(response=>{
          this.clientes = this.clientes.filter(cli => cli !== cliente)
          swal.fire(
            'Eliminado',
            'Cliente eliminado con éxito!',
            'success'
          );
        });
      }
    });
  }
}
