import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from '../Clientes/clientes/cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  //URL de conexion a la api-rest
  private urlEndPoint:string = 'http://localhost:8080/api/clientes';
  //httpHeaders
  private httpHeaders = new HttpHeaders({'Content-type':'application/json'});
  
  constructor(private http: HttpClient, private router:Router) { }

  /**
   * Obtiene un cliente por su id
   * @param id hace referencia al id del cliente que se quiere obtener
   */
  getCliente(id:number):Observable<Cliente>{
    return this.http.get<Cliente>(this.urlEndPoint+'/'+id).pipe(
      catchError(e => {
        this.router.navigate(['clientes']);
        console.log(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Obtiene listado de clientes de la APIREST
   */
  getClientes(page:number):Observable<any>{
    return this.http.get(this.urlEndPoint +  '/page/' + page).pipe(
      tap((response:any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map((response:any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('es');
          cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy')
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }

  /**
   * Enviar peticio post al back para guardar un cliente
   * @param cliente hace referencia al cliente que se captura en el formulario
   */
  create(cliente:Cliente): Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response:any) => response.cliente as Cliente),
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        console.log(e.error.mensaje)
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Metodo que hace peticion al api rest para actualizar un cliente
   * @param cliente hace referencia a los datos que se actualizaron en el formulario
   */
  update(cliente:Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(this.urlEndPoint+'/'+cliente.id, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        console.log(e.error.mensaje)
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  /**
   * Metodo que hace peticion al api rest para eliminar un cliente
   * @param id hace referencia al id del cliente que se eliminara
   */
  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(this.urlEndPoint+'/'+id, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje)
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
