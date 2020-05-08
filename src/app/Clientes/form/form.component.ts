import { Component, OnInit } from '@angular/core';
import { Cliente } from '../clientes/cliente';
import { ClienteService } from 'src/app/Service/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  titulo: String = 'Crear Cliente';
  errores:String[];

  constructor(private clienteService:ClienteService,
              private router:Router,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  /**
   * Metodo que se encarga de cargar en el formulario
   * los datos del cliente que se desea editar, utilizando el clienteService
   */
  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params=>{
      let id = params['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=>{
          this.cliente = cliente;
        });
      }
    });
  }

  /**
   * Metodo que hace la peticion a clienteService para crear un cliente
   */
  create(): void{
    this.clienteService.create(this.cliente).subscribe(response => {
      this.router.navigate(['clientes']);
      swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cliente registrado con éxito!',
        showConfirmButton: false,
        timer: 1500
      });
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Codigo del error desde el backend: '+err.status);
      console.error(err.error.errors);
    });
  }

  update(): void{
    this.clienteService.update(this.cliente).subscribe(response=>{
      this.router.navigate(['/clientes']);
      swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cliente actualizado con éxito!',
        showConfirmButton: false,
        timer: 1500
      });
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Codigo del error desde el backend: '+err.status);
      console.error(err.error.errors);
    });
  }
}
