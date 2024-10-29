//parte barrio
document.getElementById('addBarrioForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const localidad = document.getElementById('localidad').value;
    const dia = document.getElementById('dia').value;
    const hora = document.getElementById('hora').value;
    const cliente = document.getElementById('cliente').value;

    // Crear nueva fila para la tabla
    const newRow = `
        <tr>
            <td>${nombre}</td>
            <td>${localidad}</td>
            <td>${dia}</td>
            <td>${hora}hs</td>
            <td>${cliente}</td>
            <td><button><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                          </svg></button> <button><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                          </svg></button></td>
        </tr>
    `;

    // Insertar nueva fila en la tabla
    document.querySelector('#barrioTable tbody').insertAdjacentHTML('beforeend', newRow);

    // Ocultar el modal y limpiar el formulario
    var myModal = bootstrap.Modal.getInstance(document.getElementById('addBarrioModal'));
    if (myModal) {
        myModal.hide();
    }
    document.getElementById('addBarrioForm').reset();
});

document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe y recargue la página
    var criteria = document.getElementById('filterCriteria').value;
    var value = document.getElementById('filterValue').value.toLowerCase();
    var table = document.getElementById('barrioTable');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var match = false;
        
        for (var j = 0; j < cells.length; j++) {
            if (criteria === 'nombre' && j === 0 ||
                criteria === 'localidad' && j === 1 ||
                criteria === 'dias' && j === 2 ||
                criteria === 'hora' && j === 3) {
                if (cells[j].textContent.toLowerCase().indexOf(value) > -1) {
                    match = true;
                    break;
                }
            }
        }

        rows[i].style.display = match ? '' : 'none';
    }
});

document.getElementById('resetFilter').addEventListener('click', function() {
    // Restablecer los valores del formulario
    document.getElementById('filterCriteria').value = '';
    document.getElementById('filterValue').value = '';
    
    // Mostrar todas las filas de la tabla
    var table = document.getElementById('barrioTable');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.display = '';
    }
});