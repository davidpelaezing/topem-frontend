<template>
  <div class="container">
    <h3 class="text-muted">Listado de facturas</h3>
    
    <div class="row mb-3">
      <div class="col-6 col-md-3">
        <select v-model="filtros.orderBy" class="form-select" @change="getFacturas()">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
      <div class="col-6 col-md-9">
        <input type="text" v-model="filtros.buscar" class="form-control" placeholder="Buscar por nombre o nit" @keyup="getFacturas()" autofocus>
      </div>
    </div>
    
    <div class="table-responsive">
      <table class="table table-sm">
        <thead>
          <th>#</th>
          <th>Fecha</th>
          <th>Vendedor</th>
          <th>Cliente</th>
          <th>Nit</th>
          <th>Subtotal</th>
          <th>iva</th>
          <th>Total</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in facturas" :key="index">
            <td>{{ item.id}}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.vendedor.name }}</td>
            <td>{{ item.cliente_nombre }}</td>
            <td>{{ item.cliente_nit }}</td>
            <td>{{ item.valor_sin_iva }}</td>
            <td>{{ item.iva }} %</td>
            <td>{{ item.total }}</td>
            <td><router-link class="btn btn-sm btn-primary" :to="'/editar/' + item.id">Editar</router-link></td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import axios from 'axios';


export default {

  data: () => ({
    facturas: null,
    filtros:{
      orderBy:'desc',
      buscar: null,
    },
  }),

  mounted(){
    this.getFacturas();
  },

  methods:{
    getFacturas: async function(){
      try {
        const CONFIG = {
          'Content-Type' : 'application/json',
          'token_type': "bearer",
          'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        };
        const response = await axios.post('http://127.0.0.1:8001/api/factura/index', this.filtros, CONFIG);
        this.facturas = response.data.facturas;
      }catch(error) {
        console.log(error)
      }
    },

  }

}
</script>
