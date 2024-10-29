// Función para crear una nueva fila de producto con lista desplegable
function createProductRow() {
    return `
        <div class="product-row mb-3">
            <label class="form-label">Producto</label>
            <select class="form-select product-select" required>
                <option value="" disabled selected>Seleccionar producto</option>
                <option value="Bidón de agua 12 Litros">Bidón de agua 12 Litros</option>
                <option value="Soda de 1.25 Litros">Soda de 1.25 Litros</option>
                <option value="Bidón de Agua 20 Litros">Bidón de Agua 20 Litros</option>
            </select>
            <div class="mb-3">
                <label for="quantity" class="form-label">Cantidad</label>
                <input type="number" class="form-control quantity-input" required>
            </div>
            <div class="mb-3">
                <label for="details" class="form-label">Detalle</label>
                <input type="text" class="form-control details-input" required>
            </div>
        </div>
    `;
}

// Agregar un nuevo producto al formulario
document.getElementById('addProductButton').addEventListener('click', function () {
    const productRows = document.getElementById('productRows');
    productRows.insertAdjacentHTML('beforeend', createProductRow());
});

// Manejar el envío del formulario
document.getElementById('addOrderForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener datos del formulario
    const customerName = document.getElementById('customerName').value;
    const address = document.getElementById('address').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const locality = document.getElementById('locality').value;
    const status = document.getElementById('status').value;

    // Obtener todas las filas de productos
    const productRows = document.querySelectorAll('.product-row');
    const table = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];

    let firstProduct = true; // Indicador para mostrar estado solo en el primer producto

    productRows.forEach((row, index) => {
        const product = row.querySelector('.product-select').value;
        const quantity = row.querySelector('.quantity-input').value;
        const details = row.querySelector('.details-input').value;

        // Verificar que todos los campos están llenos
        if (!product || !quantity || !details) {
            alert("Por favor, complete todos los campos de los productos.");
            return;
        }

        let newRow;

        if (firstProduct) {
            // Crear una nueva fila para el cliente con el primer producto
            newRow = table.insertRow();
            newRow.innerHTML = `
                <td rowspan="${productRows.length}">${customerName}</td>
                <td rowspan="${productRows.length}">${address}</td>
                <td rowspan="${productRows.length}">${neighborhood}</td>
                <td rowspan="${productRows.length}">${locality}</td>
                <td>${product}</td>
                <td>${quantity}</td>
                <td>${details}</td>
                <td class="${status === 'pendiente' ? 'status-pendiente' : status === 'completado' ? 'status-completado' : 'status-cancelado'}" style="font-weight: bold;">
                    ${status.charAt(0).toUpperCase() + status.slice(1)}
                </td>
            `;
            firstProduct = false; // Solo para el primer producto
        } else {
            // Agregar un nuevo producto en la fila adicional
            newRow = table.insertRow();
            newRow.innerHTML = `
                
                <td>${product}</td>
                <td>${quantity}</td>
                <td>${details}</td>
                <td></td> <!-- Celda vacía para el estado -->
            `;
        }
    });

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addOrderModal'));
    modal.hide();

    // Limpiar el formulario
    document.getElementById('addOrderForm').reset();
    document.getElementById('productRows').innerHTML = createProductRow(); // Restaurar la fila de producto inicial
});
