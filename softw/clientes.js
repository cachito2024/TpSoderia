// Cuando la página se cargue
 document.addEventListener('DOMContentLoaded', async () => {
    // Carga los clientes y los barrios
    await loadClientes();
    await loadBarrios();
    await loadBarrios2();
}); 

// Función para cargar la lista de clientes
async function loadClientes() {
    try {
        const response = await fetch('http://localhost:4000/clientes');
        const clientes = await response.json();
        const clientesBody = document.getElementById('clientesBody');
        clientesBody.innerHTML = '';

        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-criteria="nombre">${cliente.nombre}</td>
                <td data-criteria="apellido">${cliente.apellido}</td>
                <td >${cliente.direccion}</td>
                <td data-criteria="barrio">${cliente.nombreBarrio}</td>
                <td data-criteria="localidad">${cliente.nombreLocalidad}</td>
                <td >${cliente.telefono}</td>
                <td>${cliente.email}</td>
                <td data-criteria="dni">${cliente.numeroDocumento}</td>
                <td>${new Date(cliente.fechaAlta).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-primary edit-button" data-id="${cliente.idCliente}">Editar</button>
                    <button class="btn btn-danger delete-button" data-id="${cliente.idCliente}">Eliminar</button>
                </td>
            `;
            clientesBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

// Función para cargar los barrios
async function loadBarrios() {
    console.log('La función loadBarrios se ha ejecutado'); 
    try {
        const response = await fetch('http://localhost:4000/barrios');
        if (!response.ok) throw new Error('Error al cargar barrios: ' + response.statusText);

        const barrios = await response.json();
        console.log(barrios); 

        const barrioSelect = document.getElementById('barrio');
        barrioSelect.innerHTML = '<option value="" disabled selected>Seleccionar barrio</option>';

        barrios.forEach(barrio => {
            console.log(`Agregando barrio: ${barrio.nombre}`); // Muestra en la consola el nombre de cada barrio

            const option = document.createElement('option');
            option.value = barrio.idBarrio; 
            option.textContent = barrio.nombre; 
            barrioSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar barrios:', error);
    }
} 
async function loadBarrios2() {
    console.log('La función loadBarrios se ha ejecutado'); 
    try {
        const response = await fetch('http://localhost:4000/barrios');
        if (!response.ok) throw new Error('Error al cargar barrios: ' + response.statusText);

        const barrios = await response.json();
        console.log(barrios); 
        const barrioSelect = document.getElementById('barrio2');
        barrioSelect.innerHTML = '<option value="" disabled selected>Seleccionar barrio</option>';

        barrios.forEach(barrio => {
            console.log(`Agregando barrio: ${barrio.nombre}`); // Muestra en consola el nombre de cada barrio

            const option = document.createElement('option');
            option.value = barrio.idBarrio; 
            option.textContent = barrio.nombre; 
            barrioSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar barrios:', error);
    }
} 
// "Editar" para cargar datos en el formulario y abrir el modal
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('edit-button')) {
        const clientId = event.target.getAttribute('data-id');
        window.currentClientId = clientId; // Guardar ID del cliente

        const response = await fetch(`http://localhost:4000/clientes/${clientId}`);
        const cliente = await response.json();

        // Cargar los datos del cliente en el formulario
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('apellido').value = cliente.apellido;
        document.getElementById('direccion').value = cliente.direccion;
        document.getElementById('telefono').value = cliente.telefono;
        document.getElementById('email').value = cliente.email;
        document.getElementById('dni').value = cliente.numeroDocumento;
        document.getElementById('fecha').value = cliente.fechaAlta.split('T')[0];

        // Mostrar el modal
        const editModal = new bootstrap.Modal(document.getElementById('editClientModal'));
        editModal.show();
    }
});

//  "Eliminar" para eliminar un cliente
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
        const clientId = event.target.getAttribute('data-id');

        const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este cliente?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:4000/clientes/${clientId}/delete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idEstadoCliente: 2 }) // Cambiar a inactivo
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el cliente');
            }

            const result = await response.json();
            console.log(result.message); // Mensaje de éxito

            // Recargar la lista de clientes
            await loadClientes();

        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
        }
    }
});

// Manejo del envío del formulario de edición
document.getElementById('editClientForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const clientId = window.currentClientId; // Usa el ID guardado

    // Recoge los datos del formulario
    const updatedData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        numeroDocumento: document.getElementById('dni').value,
        fechaAlta: document.getElementById('fecha').value,
        idBarrio: document.getElementById('barrio').value
    };

    try {
        const response = await fetch(`http://localhost:4000/clientes/${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el cliente');
        }

        const result = await response.json();
        console.log(result.message); // Muestra un mensaje de éxito

        // Cerrar el modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editClientModal'));
        editModal.hide();

        // Recargar la lista de clientes
        await loadClientes();

    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
    }
});

    document.getElementById('addClientForm').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const newData = {
            nombre: document.getElementById('nombree').value.trim(),
            apellido: document.getElementById('apellidoo').value.trim(),
            direccion: document.getElementById('direccionn').value.trim(),
            telefono: document.getElementById('telefonoo').value.trim(),
            email: document.getElementById('emaill').value.trim(),
            numeroDocumento: parseInt(document.getElementById('numeroDocumento').value.trim(), 10),
            fechaAlta: document.getElementById('fechaa').value.trim(),
            idBarrio: parseInt(document.getElementById('barrio2').value, 10)
        };
    
        try {
            const response = await fetch('http://localhost:4000/clientes/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                if (result.message === 'El cliente ya existe con la misma dirección.') {
                    alert('Este cliente ya está registrado. Verifica los datos.');
                // Vaciar los campos del formulario
                document.getElementById('addClientForm').reset();
                return; // No continuar si el cliente ya existe

                }
                throw new Error(result.message || 'Error al agregar el cliente');
            }
    
            alert('Cliente agregado con éxito');
            window.location.reload();
            document.getElementById('addClientForm').reset();
            await actualizarListaClientes(); // Recarga la lista sin recargar la página
        } catch (error) {
            console.error('Error al agregar el cliente:', error);
            alert('Error al agregar el cliente. Inténtalo nuevamente.');
        }
    });
    
    // Función para recargar la lista de clientes dinámicamente
    async function actualizarListaClientes() {
        try {
            const response = await fetch('http://localhost:4000/clientes');
            const clientes = await response.json();
            const clientesContainer = document.getElementById('clientesContainer');
            clientesContainer.innerHTML = '';
    
            clientes.forEach(cliente => {
                const div = document.createElement('div');
                div.textContent = `${cliente.nombre} ${cliente.apellido} - ${cliente.direccion}`;
                clientesContainer.appendChild(div);
            });
    
            console.log('Lista de clientes actualizada');
        } catch (error) {
            console.error('Error al actualizar la lista de clientes:', error);
        }
    }
    

// Maneja el cambio en el select de barrios
document.getElementById('barrio').addEventListener('change', async (event) => {
    const barrioId = event.target.value;

    const response = await fetch(`http://localhost:4000/barrios/${barrioId}`);
    const barrioData = await response.json();

    document.getElementById('localidad').value = barrioData.localidad; 
});

// Maneja el cambio en el select de barrios
document.getElementById('barrio2').addEventListener('change', async (event) => {
    const barrioId = event.target.value;

    const response = await fetch(`http://localhost:4000/barrios/${barrioId}`);
    const barrioData = await response.json();

    document.getElementById('localidad2').value = barrioData.localidad; 
});


//filtros 
document.getElementById('filterForm').addEventListener('submit', (event) => {
    event.preventDefault(); 
    const criteria = document.getElementById('filterCriteria').value;
    const value = document.getElementById('filterValue').value.trim().toLowerCase();

    // Obtener todas las filas de la tabla
    const rows = document.querySelectorAll('table tbody tr');

    rows.forEach(row => {
        // Obtener el valor de la celda correspondiente al criterio seleccionado
        const cellValue = row.querySelector(`td[data-criteria="${criteria}"]`).textContent.toLowerCase();
        
        // Verificar si el valor de la celda contiene el valor ingresado
        if (cellValue.includes(value)) {
            row.style.display = ''; // Mostrar la fila
        } else {
            row.style.display = 'none'; // Ocultar la fila
        }
    });
});

// Botón para restablecer los filtros
document.getElementById('resetFilter').addEventListener('click', () => {
    document.getElementById('filterForm').reset();
    
    // Mostrar todas las filas de la tabla
    const rows = document.querySelectorAll('table tbody tr');
    rows.forEach(row => {
        row.style.display = ''; // Mostrar todas las filas
    });
});
