const express = require('express');
const morgan = require('morgan');
const database = require("./database");
const cors = require('cors');
const clienteRoutes = require('./rutas/clientRoutes');
const barrioRoutes = require('./rutas/barrioRoutes'); 
const pedidoRoutes = require('./rutas/pedidoRoutes');
const estadosRouter = require('./rutas/estadosRoutes'); 
const pedidoDetalleRouter = require('./rutas/pedidoDetalleRoutes'); 
const productoRouter = require('./rutas/productoRoutes'); 

//configuracion inicial
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("escuchando comunicaciones al puerto "+ app.get("port"));

//Middlewares. scripts q nos permiten meternos entre las consultas y respuestas y ejercutar distintas cosas. como por ej algunos log.
app.use(cors({
origin: ["http://127.0.0.1:5501","http://127.0.0.1:5500"]
}));
app.use(morgan("dev"));
app.use(express.json()); // Para poder parsear el JSON en las solicitudes


//rutas
app.use("/clientes", clienteRoutes); //carga las rutas bajo la ruta base /clientes
app.use("/barrios", barrioRoutes); 
app.use("/pedidos", pedidoRoutes); 
app.use('/estados', estadosRouter); 
app.use('/producto', productoRouter); 
app.use('/pedidoDetalle', pedidoDetalleRouter); 