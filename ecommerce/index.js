const mongoose = require('mongoose')
const { Schema } = mongoose;
const express = require('express')
const app = express()
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//conecto a la base online de mongo
mongoose.connect('mongodb+srv://lucreUser:mongoDB@seminariomongo.3kja9.mongodb.net/ecommerce?retryWrites=true&w=majority', {useNewUrlParser: true});
const Productos = mongoose.model('productos', new Schema({
    nombre: String, detalle: String, precio: Number, stock: Number }));
const Ventas = mongoose.model('ventas', new Schema({ productosID: [String], precioTotal: Number, direccion: String }));

//hago el post de producto
app.post('/producto', async (req, res) => {
    const producto = new Productos(req.body);//nuevo producto
    try {
      await producto.save();
      res.send(producto);
    } catch (err) {
      res.status(500).send(err);
    }
  });

//hago el get de productos
app.get('/productos', async (req, res) => {//traigo los productos que tengo
    const productos = await Productos.find({}); //find de productos
    try {
        console.log(productos);
      res.send(productos);
    } catch (err) {
      res.status(500).send(err);
    }
  });

//hago el update de producto _paso id
app.put('/producto/:id', async (req, res) => {
    const producto = new Productos(req.body);
    try {
      await Productos.findByIdAndUpdate(req.params.id, producto)//le paso el id del que quiero reemplazar y el producto nuevo
      res.send(producto)
    } catch (err) {
      res.status(500).send(err)
    }
  });

//delete de producto _ paso id
app.delete('/producto/:id', async (req, res) => { //borrar
    try {
      const producto = await Productos.findByIdAndDelete(req.params.id) //borro por id
      if (!producto) res.status(404).send("No se encontró ningún producto con ese ID")//mensaje si no lo encuentro
      res.status(200).send()
    } catch (err) {
      res.status(500).send(err)
    }
  });

  //-----VENTAS-------

  //get de ventas
  app.get('/ventas', async (req, res) => {
    const ventas = await Ventas.find({}); //busco las ventas realizadas
    try {
      res.send(ventas);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  //post de ventas
  app.post('/venta', async (req, res) => {
    const venta = new Ventas(req.body);//agrego una nueva venta
    try {
      await venta.save();
      res.send(venta);
    } catch (err) {
      res.status(500).send(err);
    }
  });



app.listen(3000)