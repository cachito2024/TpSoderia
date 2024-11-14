// Función para cargar la lista de clientes
async function loadPedidos() {
    try {
        const response = await fetch('http://localhost:4000/pedidos');
        const pedidos = await response.json();

        console.log(pedidos);
        const pedidosBody = document.getElementById('pedidosBody');
        pedidosBody.innerHTML = '';

        pedidos.forEach(pedido => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-criteria="fecha">${new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                <td data-criteria="nombre">${pedido.nombreCliente}</td>
                <td data-criteria="direccion">${pedido.direccionCliente}</td>
                <td data-criteria="barrio">${pedido.barrioCliente}</td>
                <td data-criteria="localidad">${pedido.localidad}</td>
                <td>${pedido.descripcionPedido}</td>
                <td data-criteria="estado">${pedido.estadoPedido}</td>
                
                <td>
                    <button class="btn btn-info detail-button" data-id="${pedido.idPedido}">Ver Detalle</button>
                    <button class="btn btn-primary edit-button" data-id="${pedido.idPedido}">Editar</button>
                    <button class="btn btn-danger delete-button" data-id="${pedido.idPedido}">Eliminar</button>
                </td>
            `;
            pedidosBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
        const pedidoId = event.target.getAttribute('data-id');
        console.debug("a verr " + pedidoId);

        const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este pedido?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:4000/pedidos/${pedidoId}/eliminar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idEstadoPedido: 2 }) // Cambiar a inactivo
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el pedido');
            }

            const result = await response.json();
            console.log(result.message); // Mensaje de éxito

            // Recargar la lista de pedidos
            await loadPedidos();
        } catch (error) {
            console.error('Error al eliminar el pedido:', error);
        }
    }
});


// Llama a loadPedidos al cargar la página
document.addEventListener('DOMContentLoaded', loadPedidos);

document.addEventListener('DOMContentLoaded', () => {
    loadClientes();
    cargarEstados();

});

// Función para cargar los clientes
async function loadClientes() {
    try {
        const response = await fetch('http://localhost:4000/clientes');
        const clientes = await response.json();
        const clienteSelect = document.getElementById('cliente');

        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.idCliente;
            option.textContent = `${cliente.nombre} ${cliente.apellido}`;
            clienteSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

async function cargarEstados() {
    try {
        const response = await fetch('http://localhost:4000/estados');
        const estados = await response.json();
        const estadoSelect = document.getElementById('estado');
        estadoSelect.innerHTML = ''; // Limpia opciones previas

        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.idEstadoPedido; // ID del estado
            option.textContent = estado.nombre; // Nombre del estado
            estadoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar estados:', error);
    }
}
// Función para mostrar el modal y cargar datos del pedido
async function mostrarModal(idPedido) {
    try {
        const pedidoResponse = await fetch(`http://localhost:4000/pedidos/${idPedido}`);
        const pedidoData = await pedidoResponse.json();

        if (pedidoData) {
            document.getElementById('pedidoId').value = pedidoData.idPedido;
            document.getElementById('fecha').value = new Date(pedidoData.fechaPedido).toISOString().split('T')[0];
            document.getElementById('detalle').value = pedidoData.descripcionPedido;
            document.getElementById('estado').value = pedidoData.idEstadoPedido; // Establece el estado correspondiente

            const editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.show(); // Muestra el modal usando Bootstrap
        } else {
            console.error('Pedido no encontrado');
        }
    } catch (error) {
        console.error('Error al cargar los datos del pedido:', error);
    }
}


// Muestra el modal de edición
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('edit-button')) {
        const idPedido = event.target.getAttribute('data-id');
        await mostrarModal(idPedido); // Carga los datos del pedido y muestra el modal
    }

    if (event.target.id === 'closeModal') {
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.hide(); // Cierra el modal usando Bootstrap
    }
});



// Maneja la actualización del pedido
document.getElementById('editPedidoForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('pedidoId').value;
    const updatedData = {
        fechaPedido: document.getElementById('fecha').value,
        idCliente: document.getElementById('cliente').value,
        descripcion: document.getElementById('detalle').value,
        idEstadoPedido: document.getElementById('estado').value
    };

    console.log("Datos enviados para actualizar el pedido:", updatedData);

    try {
        const response = await fetch(`http://localhost:4000/pedidos/${id}/editar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            loadPedidos(); // Recargar la lista de pedidos
            // Esperar un momento para que se carguen los datos antes de recargar la página
            setTimeout(() => {
                window.location.reload();
            }, 500);
            document.getElementById('editModal').style.display = 'none'; // Cerrar el modal
        } else {
            throw new Error('Error al actualizar el pedido');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

//detalle pedido

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('detail-button')) {
        const idPedido = event.target.getAttribute('data-id');
        await mostrarDetalles(idPedido);
    }

    if (event.target.id === 'closeDetalleModal') {
        const detalleModal = new bootstrap.Modal(document.getElementById('detalleModal'));
        detalleModal.hide(); // Cierra el modal
    }

    if (event.target.id === 'modificarDetalles') {
        habilitarEdicion();
    }

    if (event.target.id === 'guardarCambios') {
        await guardarCambios();
    }
});

async function mostrarDetalles(idPedido) {
    try {
        const response = await fetch(`http://localhost:4000/pedidoDetalle/${idPedido}`);
        const detalles = await response.json();

        const detalleBody = document.getElementById('detalleBody');
        const agregarDetalleButton = document.getElementById('agregarDetalleButton');
        const formAgregarDetalle = document.getElementById('formAgregarDetalle');
        const detalleModal = document.getElementById('detalleModal');
        const idPedidoDetalle = document.getElementById('idPedidoDetalle');

        // Verifica que los elementos del DOM existan
        if (!detalleBody || !agregarDetalleButton || !formAgregarDetalle || !detalleModal || !idPedidoDetalle) {
            console.error('Faltan elementos del DOM necesarios');
            return;
        }

        // Limpia la tabla de detalles
        detalleBody.innerHTML = '';

        // Establece el ID del pedido en el campo oculto y en el modal
        detalleModal.setAttribute('data-id', idPedido);
        idPedidoDetalle.value = idPedido;

        if (detalles.length === 0) {
            agregarDetalleButton.style.display = 'block';
            formAgregarDetalle.style.display = 'none';
        } else {
            agregarDetalleButton.style.display = 'none';
            formAgregarDetalle.style.display = 'none';

            detalles.forEach(detalle => {
                const row = document.createElement('tr');
                row.setAttribute('data-old-id', detalle.idProducto);
                row.innerHTML = `
                        <td>${detalle.nombreProducto}</td>
                        <td>${detalle.cantidadLitros}</td>
                        <td>
                            <input type="number" value="${detalle.cantidadPedido}" class="cantidadPedida" disabled />
                        </td>
                        <td>
                            <select class="productoSelect" disabled></select>
                        </td>
                    `;
                detalleBody.appendChild(row);

                cargarProductos(row.querySelector('.productoSelect'), detalle.idProducto);
            });
        }

        const bootstrapModal = new bootstrap.Modal(detalleModal);
        bootstrapModal.show();
    } catch (error) {
        console.error('Error al cargar los detalles del pedido:', error);
    }
}



let cachedProducts = [];

async function cargarProductos(selectElement, selectedId) {
    if (cachedProducts.length === 0) {
        try {
            const response = await fetch('http://localhost:4000/producto');
            cachedProducts = await response.json();
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    // Rellenar el select con productos en caché
    cachedProducts.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.idProducto;
        option.textContent = producto.nombre;
        if (producto.idProducto === selectedId) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });
}


function habilitarEdicion() {
    const cantidadInputs = document.querySelectorAll('.cantidadPedida');
    const productoSelects = document.querySelectorAll('.productoSelect');
    const guardarButton = document.getElementById('guardarCambios');

    cantidadInputs.forEach(input => input.disabled = false);
    productoSelects.forEach(select => select.disabled = false);

    guardarButton.style.display = 'block'; // Muestra el botón de guardar
    habilitarBotonGuardar(); // Verifica si habilitar el botón
}

function habilitarBotonGuardar() {
    const cantidadInputs = document.querySelectorAll('.cantidadPedida');
    const productoSelects = document.querySelectorAll('.productoSelect');
    const guardarButton = document.getElementById('guardarCambios');

    const allFilled = Array.from(cantidadInputs).every(input => input.value > 0) &&
        Array.from(productoSelects).every(select => select.value);

    guardarButton.disabled = !allFilled; // Habilita o deshabilita el botón según los inputs
}

let isLoading = false;
async function guardarCambios() {
    if (isLoading) return; // Previene múltiples clics
    isLoading = true;
    const detalles = Array.from(document.querySelectorAll('#detalleBody tr')).map(row => {
        const idProducto = row.querySelector('.productoSelect').value;
        const cantidadPedida = row.querySelector('.cantidadPedida').value;
        const oldIdProducto = row.getAttribute('data-old-id');

        return {
            idProducto: Number(idProducto), // Convierte a número
            cantidadPedida: Number(cantidadPedida), // Convierte a número
            oldIdProducto: Number(oldIdProducto) // Convierte a número
        };
    });

    const idPedido = document.getElementById('detalleModal').getAttribute('data-id');

    try {
        const response = await fetch(`http://localhost:4000/pedidoDetalle/${idPedido}/modificar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ detalles }) // Envío de los detalles
        });

        if (response.ok) {
            console.log('Detalles modificados exitosamente');
            loadPedidos(); // Recarga la lista de pedidos
            document.getElementById('detalleModal').style.display = 'none'; // Cierra el modal
        } else {
            throw new Error('Error al modificar los detalles');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        resetearEstado();
        isLoading = false; // Libera el flag al finalizar
    }
};

function resetearEstado() {
    const cantidadInputs = document.querySelectorAll('.cantidadPedida');
    const productoSelects = document.querySelectorAll('.productoSelect');


    cantidadInputs.forEach(input => {
        input.value = ''; // O establece un valor por defecto
        input.disabled = true; // Deshabilita si es necesario
    });

    productoSelects.forEach(select => {
        select.selectedIndex = 0; // Resetea la selección
        select.disabled = true; // Deshabilita si es necesario
    });


};

//add pedido
// Mostrar el modal de agregar pedido y cargar clientes y estados
document.getElementById('botonAgregar').addEventListener('click', async () => {
    const addPedidoModal = new bootstrap.Modal(document.getElementById('addOrderModal'));
    await loadClientes2(); // Cargar clientes al abrir el modal
    await cargarEstados2(); // Cargar estados al abrir el modal
    addPedidoModal.show(); // Mostrar el modal
});
// Función para cargar los clientes
async function loadClientes2() {
    try {
        const response = await fetch('http://localhost:4000/clientes');
        const clientes = await response.json();
        const clienteSelect = document.getElementById('cliente2');
        clienteSelect.innerHTML = '<option value="">Seleccione un cliente</option>';
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.idCliente;
            option.textContent = `${cliente.nombre} ${cliente.apellido}`;
            clienteSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

async function cargarEstados2() {
    try {
        const response = await fetch('http://localhost:4000/estados');
        const estados = await response.json();
        const estadoSelect = document.getElementById('estado2');
        estadoSelect.innerHTML = ''; // Limpia opciones previas

        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.idEstadoPedido; // ID del estado
            option.textContent = estado.nombre; // Nombre del estado
            estadoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar estados:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const inputFecha = document.getElementById('fecha2');
    if (inputFecha) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        inputFecha.value = formattedDate; // Precargar la fecha actual
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addOrderForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const newPedido = {
            fechaPedido: document.getElementById('fecha2').value.trim(),
            idCliente: document.getElementById('cliente2').value.trim(),
            descripcion: document.getElementById('detalle2').value.trim(),
            idEstadoPedido: document.getElementById('estado2').value.trim()

        };
        console.log('Datos a enviar:', newPedido);
        try {
            const response = await fetch('http://localhost:4000/pedidos/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPedido)
            });
            console.log('Respuesta de la API:', response);

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error del servidor:', errorResponse);
                throw new Error('Error al agregar el pedido');
            }

            const result = await response.json();
            console.log(result.message);
            document.getElementById('addOrderForm').reset();
            alert('Pedido agregado con éxito');
            window.location.reload();
        } catch (error) {
            console.error('Error al agregar el pedido:', error);
        }
    });
});

document.getElementById('formAgregarDetalle').addEventListener('submit', async (event) => {
    event.preventDefault();

    const idPedido = document.getElementById('idPedidoDetalle').value;

    // Verificar si el ID del pedido existe
    if (!idPedido) {
        alert('ID del pedido no encontrado');
        return;
    }

    // Obtener todos los productos y cantidades del formulario
    const detalles = Array.from(document.querySelectorAll('#detallesContainer .row')).map(row => {
        const idProducto = row.querySelector('.productoSelect').value;
        const cantidadPedido = parseInt(row.querySelector('.cantidadPedido').value, 10);

        // Validar que ambos campos tengan valor
        if (!idProducto || isNaN(cantidadPedido) || cantidadPedido <= 0) {
            throw new Error('Todos los campos son obligatorios y deben tener valores válidos.');
        }

        return {
            idPedido: idPedido,
            idProducto: idProducto,
            cantidadPedido: cantidadPedido
        };
    });

    try {
        const response = await fetch('http://localhost:4000/pedidoDetalle/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(detalles)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error al agregar detalle:', errorResponse);
            throw new Error('Error al agregar los detalles del pedido');
        }

        alert('Detalles agregados con éxito');
        await mostrarDetalles(idPedido); // Recargar los detalles del pedido
        window.location.reload();
    } catch (error) {
        console.error('Error al agregar los detalles:', error);
        alert(error.message); // Mostrar mensaje de error 
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const agregarDetalleButton = document.getElementById('agregarDetalleButton');
    const formAgregarDetalle = document.getElementById('formAgregarDetalle');
    const detallesContainer = document.getElementById('detallesContainer');
    const agregarProductoButton = document.getElementById('agregarProducto');

    if (detallesContainer) {
        console.log('detallesContainer encontrado:', detallesContainer);
    } else {
        console.error('detallesContainer no encontrado en el DOM');
    }

    if (agregarDetalleButton && formAgregarDetalle && agregarProductoButton) {
        agregarDetalleButton.addEventListener('click', async () => {
            await agregarFilaProducto(); // Agrega la primera fila

            formAgregarDetalle.style.display = 'block';
            agregarDetalleButton.style.display = 'none';
        });

        agregarProductoButton.addEventListener('click', agregarFilaProducto);
    }
});

async function cargarProductos2(selectElement, selectedId = null) {
    try {
        if (cachedProducts.length === 0) {
            const response = await fetch('http://localhost:4000/producto');
            cachedProducts = await response.json();
        }

        console.log('Productos cargados:', cachedProducts);

        // Rellenar el select con productos en caché
        cachedProducts.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.idProducto;
            option.textContent = producto.nombre;

            // Marcar como seleccionado si coincide con selectedId
            if (selectedId && producto.idProducto === selectedId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}
async function agregarFilaProducto() {
    const row = document.createElement('div');
    row.className = 'row mb-3';

    row.innerHTML = `
            <div class="col-6">
                <label for="productoSelect" class="form-label">Producto</label>
                <select class="form-select productoSelect" required></select>
            </div>
            <div class="col-4">
                <label for="cantidadPedido" class="form-label">Cantidad Pedida</label>
                <input type="number" class="form-control cantidadPedido" min="1" required />
            </div>
            <div class="col-2 d-flex align-items-end">
                <button type="button" class="btn btn-danger eliminarProducto">Eliminar</button>
            </div>
        `;

    // Añade funcionalidad al botón eliminar
    row.querySelector('.eliminarProducto').addEventListener('click', () => {
        row.remove();
    });

    // Añade la fila al contenedor
    detallesContainer.appendChild(row);

    // Cargar los productos en el select de esta fila
    await cargarProductos2(row.querySelector('.productoSelect'));
};

//filtro
document.getElementById('filterForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores de los filtros
    const fechaDesde = document.getElementById('filterFechaDesde').value;
    const fechaHasta = document.getElementById('filterFechaHasta').value;
    const cliente = document.getElementById('filterCliente').value.toLowerCase().trim();
    const estado = document.getElementById('filterEstado').value.toLowerCase().trim();

    // Obtener todas las filas de la tabla
    const rows = document.querySelectorAll('#pedidosBody tr');
    let matchFound = false; // Bandera para indicar si hay coincidencias

    rows.forEach(row => {
        let isMatch = true;

        // Filtrar por fecha
        if (fechaDesde || fechaHasta) {
            const fechaTexto = row.querySelector('[data-criteria="fecha"]').textContent.trim();
            const [day, month, year] = fechaTexto.split('/');
            const fechaPedido = new Date(`${year}-${month}-${day}`).getTime();

            if (fechaDesde && !fechaHasta) {
                // Si solo hay "Fecha Desde", buscar coincidencia exacta
                const desde = new Date(fechaDesde).getTime();
                if (fechaPedido !== desde) {
                    isMatch = false;
                }
            } else if (fechaDesde && fechaHasta) {
                // Si hay tanto "Fecha Desde" como "Fecha Hasta", verificar el rango
                const desde = new Date(fechaDesde).getTime();
                const hasta = new Date(fechaHasta).getTime();
                if (fechaPedido < desde || fechaPedido > hasta) {
                    isMatch = false;
                }
            }
        }



        // Filtrar por cliente con coincidencia exacta por palabras
        if (cliente) {
            const clienteTexto = row.querySelector('[data-criteria="nombre"]').textContent.toLowerCase().trim();
            const clientePalabras = clienteTexto.split(' '); // Dividir el nombre completo en palabras
            const filtroPalabras = cliente.split(' '); // Dividir el filtro ingresado en palabras

            // Verificar si al menos una de las palabras en el filtro coincide con alguna palabra del cliente
            const hayCoincidencia = filtroPalabras.some(filtroPalabra =>
                clientePalabras.includes(filtroPalabra)
            );

            if (!hayCoincidencia) {
                isMatch = false;
            }
        }
        // Filtrar por estado
        if (estado) {
            const estadoTexto = row.querySelector('[data-criteria="estado"]').textContent.toLowerCase();
            if (estadoTexto !== estado) {
                isMatch = false;
            }
        }

        // Mostrar u ocultar la fila según si cumple con todos los filtros
        row.style.display = isMatch ? '' : 'none';

        if (isMatch) {
            matchFound = true; // Marcar que al menos una coincidencia se encontró
        }
    });

    // Si no se encontró ninguna coincidencia
    if (!matchFound) {
        alert("No se encontraron pedidos. Se restablecerá la búsqueda.");
        document.getElementById('filterForm').reset();
        rows.forEach(row => {
            row.style.display = ''; // Mostrar todas las filas
        });
    }
});

// Restablecer filtro
document.getElementById('resetFilter').addEventListener('click', function () {
    document.getElementById('filterForm').reset();

    // Mostrar todas las filas de la tabla
    const rows = document.querySelectorAll('#pedidosBody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
});
