import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
// import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]> {
    // return of(CLIENTES);
    // return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe(
      map( response => {
        let clientes = response as Cliente[];
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('en-US');
          cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMM yyyy') //formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
          return cliente;
        });
       }
     )
    );
  }

  create(cliente: Cliente) : Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e => {

        if(e.status==400){
          return throwError( () => e );
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError( () => e );
      })
    );
  }
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError( () => e );
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError( () => e );
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError( () => e );
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError( () => e );
      })
    )
  }

}
