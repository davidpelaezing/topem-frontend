<template>
    <div class="container">
        <h3 class="text-muted mb-3">Editar factura #{{ id }}</h3>
        <form @submit.prevent="guardarFactura()" class="mb-4">
            <div class="row mb-3">
                <div class="col-12 col-md-6">
                    <label for="cliente_nombre">Nombre del cliente</label>
                    <input type="text" v-model="form.cliente_nombre" id="cliente_nombre" class="form-control" placeholder="Nombre" required>
                </div>

                <div class="col-12 col-md-6">
                    <label for="cliente_nit">Nit del cliente</label>
                    <input type="number" v-model="form.cliente_nit" id="cliente_nit" class="form-control" placeholder="Nit" required>
                </div>
            </div>

            <div class="mb-3">
                <label for="iva">IVA</label>
                <input type="number" v-model="form.iva" id="iva" min="0" max="100" class="form-control" placeholder="IVA" required>
            </div>

            <div class="row mb-3">
                <div class="col-12 col-md-6">
                    <label for="valor_sin_iva">Subtotal</label>
                    <input type="number" :value="sumaDetalles" id="valor_sin_iva" class="form-control" placeholder="Subtotal" readonly>
                </div>

                <div class="col-12 col-md-6">
                    <label for="total">Total</label>
                    <input type="number" :value="sumaDetalles + (sumaDetalles * (form.iva/100))" id="total" class="form-control" placeholder="Total" readonly>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" v-if="form.detalles.length">Actualizar Factura</button>

        </form>

        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <th>#</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Valor unitario</th>
                    <th>Total</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in form.detalles" :key="index">
                        <td>{{ index + 1}}</td>
                        <td>{{ item.descripcion }}</td>
                        <td>{{ item.cantidad }}</td>
                        <td>{{ item.valor_unitario }}</td>
                        <td>{{ item.cantidad * item.valor_unitario }}</td>
                        <td><button type="button" class="btn btn-sm btn-danger" @click="form.detalles.splice(index, 1)">Quitar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button class="btn btn-primary" @click="modals.detalle.show()">Agregar detalle</button>

        <!-- Modal para crear cliente -->
        <div class="modal fade" ref="detalleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="detalleModal" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold text-primary" id="modalTitle">Agregar Detalle</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="agregarDetalle()">
                            <div class="col-12 mb-3">
                                <label for="descripcion">Descripcion</label>
                                <textarea name="descripcion" v-model="detalle.descripcion" id="descripcion" class="form-control" cols="20" rows="4" required></textarea>
                            </div>
                            <div class="col-12 mb-3">
                                <label for="cantidad">Cantidad</label>
                                <input type="number" id="cantidad" min="1" v-model="detalle.cantidad" class="form-control" placeholder="Cantidad" required>
                            </div>
                            <div class="col-12 mb-3">
                                <label for="valor_unitario">Valor unitario</label>
                                <input type="number" id="valor_unitario" min="1" v-model="detalle.valor_unitario" class="form-control" placeholder="Valor unitario" required>
                            </div>
                            <div class="col-12 mb-3">
                                <label for="total">Total</label>
                                <input type="number" id="total" :value="detalle.cantidad * detalle.valor_unitario" class="form-control" placeholder="Total" readonly required>
                            </div>
                            <button type="submit" class="btn btn-primary">Agregar</button>
                        </form>
                    </div>
                </div>
            </div>  
        </div>

    </div>
</template>
<script>
import { Modal } from 'bootstrap';
import axios from 'axios';

export default {

    data: () => ({
        id: null,
        form: {
            cliente_nombre: null,
            cliente_nit: null,
            iva: 19,
            detalles: []
        },
        detalle:{
            descripcion: null,
            cantidad: null,
            valor_unitario: null,
        },
        modals: {
            detalle: null
        }
    }),

    mounted(){
        this.id = this.$route.params.id;
        this.consultarFactura();
        this.modals.detalle = new Modal(this.$refs.detalleModal);
    },

    computed:{
        sumaDetalles: function(){
            return this.form.detalles.reduce((acum, detalle ) => acum + (detalle.cantidad * detalle.valor_unitario), 0)
        }
    },

    methods: {

        guardarFactura: async function(){
            try {
                if(!this.form.detalles.length){return}
                const factura = {
                    'cliente_nombre': this.form.cliente_nombre,
                    'cliente_nit': this.form.cliente_nit,
                    'iva': this.form.iva,
                    'valor_sin_iva': this.sumaDetalles,
                    'total': this.sumaDetalles + (this.sumaDetalles * (this.form.iva/100)),
                    'detalles': JSON.stringify(this.form.detalles)
                }

                const CONFIG = {
                    'Content-Type' : 'application/json',
                    'token_type': "bearer",
                    'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                };
                const response = await axios.put('http://127.0.0.1:8001/api/factura/' + this.id, factura, CONFIG);
                this.$toastr.s('La factura se actualizo correctamente.');
                this.$router.push("/");
            } catch (error) {
                this.$toastr.e('Error al actualzar la factura.');
            }
        },

        consultarFactura: async function(){
            try{
                const CONFIG = {
                    'Content-Type' : 'application/json',
                    'token_type': "bearer",
                    'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                };
                const response = await axios.get('http://127.0.0.1:8001/api/factura/' + this.id, CONFIG);
                this.form.cliente_nombre = response.data.factura.cliente_nombre;
                this.form.cliente_nit = response.data.factura.cliente_nit;
                this.form.iva = response.data.factura.iva;
                this.form.detalles = response.data.factura.detalles;
            }catch(error){
                this.$toastr.e('Error al consultar la factura.');
                this.$router.push("/");
            }
        },

        agregarDetalle: function(){
            const detalle = {
                'descripcion': this.detalle.descripcion,
                'cantidad': this.detalle.cantidad,
                'valor_unitario': this.detalle.valor_unitario,
            }
            this.form.detalles.push(detalle);
            this.limpiarFormDetalle();
            this.modals.detalle.hide();
        },

        limpiarFormDetalle: function() {
            this.detalle.descripcion = null;
            this.detalle.cantidad = null;
            this.detalle.valor_unitario = null;
        }

    }
}
</script>