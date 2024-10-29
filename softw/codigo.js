document.addEventListener('DOMContentLoaded', function() {
    var boton = document.getElementById('redirigir');
    if (boton) {
        boton.addEventListener('click', function() {
            window.location.href = 'clientes.html';
        });
    } else {
        console.error('No se encontró el elemento con id "redirigir".');
    }
});

//parte barrios

var botonBarrio = document.getElementById('barrio');
if (botonBarrio) {
    botonBarrio.addEventListener('click', function() {
        window.location.href = 'barrios.html';
    });
} else {
    console.error('No se encontró el elemento con id "barrio".');
}
//parte productos
document.addEventListener('DOMContentLoaded', function() {
    var boton = document.getElementById('producto');
    if (boton) {
        boton.addEventListener('click', function() {
            window.location.href = 'productos.html';
        });
    } else {
        console.error('No se encontró el elemento con id "redirigir".');
    }
});

//parte pedidos
document.addEventListener('DOMContentLoaded', function() {
    var boton = document.getElementById('pedido');
    if (boton) {
        boton.addEventListener('click', function() {
            window.location.href = 'pedido.html';
        });
    } else {
        console.error('No se encontró el elemento con id "redirigir".');
    }
});
//validacion ingreso
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMensaje = document.getElementById('errorMensaje');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Evita el envío del formulario

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            // Validación de usuario y contraseña
            if (username === 'antonella' && password === 'anto25') {
                window.location.href = 'paginaPrin.html'; // Redirige si es correcto
            } else {
                errorMensaje.style.display = 'block'; // Muestra mensaje de error
            }
        });
    } else {
        console.error('No se encontró el formulario de login.');
    }
});
