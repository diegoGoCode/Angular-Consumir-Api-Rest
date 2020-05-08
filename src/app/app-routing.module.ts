import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientesComponent } from './Clientes/clientes/clientes.component';
import { FormComponent } from './Clientes/form/form.component';


const routes: Routes = [
  {path:'', redirectTo: '/clientes', pathMatch:'full'},
  {path:'clientes', component:ClientesComponent},
  {path:'clientes/page/:page', component:ClientesComponent},
  {path:'clientes/form', component:FormComponent},
  {path:'clientes/form/:id', component:FormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
