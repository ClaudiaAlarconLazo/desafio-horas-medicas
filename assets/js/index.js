const SUPABASE_URL = 'https://lwuduvlhohzpawjggsdz.supabase.co'
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzgzOTIxMCwiZXhwIjoxOTU5NDE1MjEwfQ.mOypMz22Avy9RyKDho-BjMwgYBQBd6Uspy1BvEyG5Js";

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

//Función para registrar una reserva de hora que se activa con el evento onsubmit en componente formulario
function almacenarHora(event) {
  event.preventDefault();
  console.log(event);

  const form = document.querySelector('form');
  const data = Object.fromEntries(new FormData(form).entries());

  const isValidName = validationInputName();
  const isValidRut = validationInputRut();
  const isValidGender = validationSelectGender();
  const isValidDate = validationInputDate();
  const isValidDoctor = validationSelectDoctor();
  const isValidScheduleDate = validationInputScheduleDate();
  const isValidScheduleTime = validationSelectScheduleTime();

  if ( !isValidName || !isValidRut || !isValidGender || !isValidDate || !isValidDoctor || !isValidScheduleDate || !isValidScheduleTime ) {
    return
  }

  supabase.from('hora_medica')
  .insert([
    { 
    nombre: data.name, 
    rut: data.rut,
    genero: data.gender,
    fecha_nacimiento: data.date,
    enfermedades: data.diseases,
    medicamentos: data.drugs,
    medico: data.doctor,
    fecha_atencion: data.schedule-date,
    hora_atencion: data.schedule-time,
   },
  ])
  .then(response => {
    alert('Reserva de hora registrada.');
    window.location.href = "agenda.html";
  })
  .catch(error => console.log(error));

  console.log(data);

};

function schedule() {
  supabase
  .from('hora_medica')
  .select('*')
  .then(response => {
    console.log(response);
    //Instancia de tabla del html
    const table = document.getElementById('schedule');

    response.data.forEach((element, index) => {
      //Insertar nueva fila en la tabla
      const row = table.insertRow(index);

      //Insertar nuevas celdas en la fila
      const cellNumber = row.insertCell(0);
      const cellName = row.insertCell(1);
      const cellRut = row.insertCell(2);
      const cellDoctor = row.insertCell(3);
      const cellScheduleDate = row.insertCell(4);
      const cellScheduleTime = row.insertCell(5);
      const cellButton = row.insertCell(6);

      //Poblar fila de celdas con tablas en html
      cellNumber.innerHTML = index + 1;
      cellName.innerHTML = element.nombre;
      cellRut.innerHTML = element.rut;
      cellDoctor.innerHTML = element.medico;
      cellScheduleDate.innerHTML = element.fecha_atencion;
      cellScheduleTime.innerHTML = element.hora_atencion;
      cellButton.innerHTML =  `
      <p class="buttons">
        <button onclick="redirectDetail(${element.id})" class="button">
          <span class="icon is-small has-text-info">
            <i class="fas fa-eye"></i>
          </span>
        </button>
        <button onclick="deleteRegister(${element.id})" class="button">
          <span class="icon is-small has-text-danger">
            <i class="fas fa-trash-can"></i>
          </span>
        </button>
      </p>`;

    })

  })
  .catch(error => console.log(error));

};


function redirectDetail(id) {
  window.location.href = `detalle-agenda.html?id=${id}`;
};


async function deleteRegister(id) {
  
  await supabase
  .from('hora_medica')
  .delete()
  .eq('id', id)

  alert('Registro eliminado.');
  window.location.href = "agenda.html";
};

/*
Métodos para redirigir
function redirectSchedule() {
  window.location.href = `/desafio-horas-medicas/agenda.html`;
}

function redirectRegister() {
  window.location.href = "/desafio-horas-medicas/registro.html"
};*/


function detail() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');
  console.log(id);

  if (!id) {
    alert('Parámetro de búsqueda no encontrado.');
    window.location.href = `/desafio-horas-medicas/agenda.html`;
  } else {
    supabase
    .from('hora_medica')
    .select("*")

    // Filters
    .eq('id', id)
    .then(response => {
      const { data } = response;
      console.log(data);
      const message = document.getElementById('message');
      if (data.length === 0) {
        message.innerHTML = 'Paciente no encontrado.';
      } else {
        const name = document.getElementById('name');
        const rut = document.getElementById('rut');
        const gender = document.getElementById('gender');
        const date = document.getElementById('date');
        const diseases = document.getElementById('diseases');
        const drugs = document.getElementById('drugs');
        const doctor = document.getElementById('doctor');
        const scheduleDate = document.getElementById('schedule-date');
        const scheduleTime = document.getElementById('schedule-time');

        name.innerHTML = data[0].nombre;
        rut.innerHTML = data[0].rut;
        gender.innerHTML = data[0].genero;
        date.innerHTML = data[0].fecha_nacimiento;
        diseases.innerHTML = data[0].enfermedades;
        drugs.innerHTML = data[0].medicamentos;
        doctor.innerHTML = data[0].medico;
        scheduleDate.innerHTML = data[0].fecha_atencion;
        scheduleTime.innerHTML = data[0].hora_atencion;
      }
    })
    .catch(error => console.log(error))
  }
 
};


// Funciones para dar animación al html
document.addEventListener('DOMContentLoaded', () => {
  load_navbar();
  load_footer();
  suscribeSupabaseEvent();

  setTimeout(() => {
    //Dinamizar las secciones activas en el navbar
    const globalUrl = window.location.pathname;
    console.log(globalUrl);

    if (globalUrl === '/index.html') {
      const indexNavbar = document.getElementById('index-nav');
      indexNavbar.classList.add('is-active');
      indexNavbar.classList.add('has-text-light');
    } else if (globalUrl === '/agenda.html') {
      const scheduleNavbar = document.getElementById('schedule-nav');
      scheduleNavbar.classList.add('is-active');
      scheduleNavbar.classList.add('has-text-light');
    } else if (globalUrl === '/registro.html') {
      const registerNavbar = document.getElementById('register-nav');
      registerNavbar.classList.add('is-active');
      registerNavbar.classList.add('has-text-light');
    } else if (globalUrl === '/login.html') {
      const loginNavbar = document.getElementById('login-nav');
      loginNavbar.classList.add('is-active');
      loginNavbar.classList.add('has-text-light');
    }

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {

          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');

        });
      });
    }

    //Inyectar correo electrónico cuando usuario está logueado
    const emailUser = sessionStorage.getItem('email');

    if(emailUser) {
      const emailUserContent = document.getElementById('email-user-content');
      const loginNavbar = document.getElementById('login-nav');
      const emailContainer = document.getElementById('email-user');

      emailUserContent.classList.remove('is-hidden');
      loginNavbar.classList.add('is-hidden');
      emailContainer.innerHTML = emailUser;
    } else {
      const url = window.location.pathname;
      const urlForbidden = ['/agenda.html'];
      const scheduleNavbar = document.getElementById('schedule-nav');
      scheduleNavbar.classList.add('is-hidden');

      if (url !== '/login.html' && urlForbidden.includes(url)) {
        window.location.href = 'login.html';
      }
    }
  }, 100);

});

// Función para replicar footer en todos los html
async function load_footer(){
  const footer = document.getElementById('footer');
  footer.innerHTML = await (await fetch('./partials/footer.html')).text();
}

// Función para replicar navbar en todos los html
async function load_navbar(){
  const header = document.getElementById('header');
  header.innerHTML = await (await fetch('./partials/navbar.html')).text();
}


function suscribeSupabaseEvent() {
  // Función que avisa si se eliminó algo
  const deleteRow = supabase
  .from('hora_medica')
  .on('*', payload => {
    console.log('Change received!', payload)
  })
  .subscribe()
  const subscriptions = supabase.getSubscriptions();
  console.log(subscriptions);

}

//Función que permite generar usuarios registrados en la aplicación
async function signUp() {
  const { user, session, error } = await supabase.auth.signUp({
    email: 'c.alarconlazo@gmail.com',
    password: 'password',
  })

  console.log(user);
  console.log(session);
  console.log(error);
}

//Función para iniciar sesión que se activa con el evento onsubmit en componente formulario
async function signIn(event) {
  event.preventDefault();
  const form = document.querySelector('form');
  const formData = Object.fromEntries(new FormData(form).entries());

  const isValidEmail = validationInputEmail();
  const isValidPassword = validationInputPassword();

  if (!isValidEmail || !isValidPassword) {
    return
  }


  const { data, error } = await supabase.auth.signIn({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    alert('Credenciales incorrectas.');
  } else {
    sessionStorage.setItem('token', data.access_token);
    sessionStorage.setItem('email', data.user.email);
    window.location.href = "agenda.html";
  }

  console.log(data);
  console.log(error);
}

//Función para validar email con expresión regular
function emailValidation(email) {
  if (email !== '') {
    const regExpEmail = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");

    const validation = regExpEmail.test(email);
  
    return validation;
  }
  return true;
}

//Función para validar el contenido vacío de un input
function requiredValidation(value) {
  if (value === '' || value === undefined || value === null || value.length === 0) {
    return false;
  }
  return true;
}

//Función para validar el tamaño del contenido de un input
function lenghtValidation(value, lenght) {
  if (value.length < lenght) {
    return false;
  }
  return true;
}

//Función para validar el contenido del input email
function validationInputEmail() {
  const email = document.getElementById('email').value;
  const emailForm = document.getElementById('email');
  const emailHelp = document.getElementById('email-help');

  if (!emailValidation(email)) {
    emailForm.classList.add('is-danger');
    emailHelp.classList.remove('is-hidden');
    emailHelp.innerHTML = 'El correo electrónico es inválido';
    return false;
  } else if (!requiredValidation(email)) {
    emailForm.classList.add('is-danger');
    emailHelp.classList.remove('is-hidden');
    emailHelp.innerHTML = 'El correo electrónico es requerido';
    return false;
  } else{
    emailForm.classList.remove('is-danger');
    emailHelp.classList.add('is-hidden');
    emailHelp.innerHTML = '';
    return true;
  }

}

//Función para validar el contenido del input password
function validationInputPassword(){
  const password = document.getElementById('password').value;
  const passwordForm = document.getElementById('password');
  const passwordHelp = document.getElementById('password-help');

  if (!requiredValidation(password)) {
    passwordForm.classList.add('is-danger');
    passwordHelp.classList.remove('is-hidden');
    passwordHelp.innerHTML = 'La contraseña es requerida';
    return false;
  } else if (!lenghtValidation(password, 3)) {
    passwordForm.classList.add('is-danger');
    passwordHelp.classList.remove('is-hidden');
    passwordHelp.innerHTML = 'La contraseña debe tener más de 3 caracteres';
    return false;
  } else {
    passwordForm.classList.remove('is-danger');
    passwordHelp.classList.add('is-hidden');
    passwordHelp.innerHTML = '';
    return true;
  }
}

//Función para validar contenido de input name
function validationInputName() {
  const name = document.getElementById('name').value;
  const nameForm = document.getElementById('name');
  const nameHelp = document.getElementById('name-help');

  if (!requiredValidation(name)) {
    nameForm.classList.add('is-danger');
    nameHelp.classList.remove('is-hidden');
    return false;
  } else {
    nameForm.classList.remove('is-danger');
    nameHelp.classList.add('is-hidden');
    return true;
  }
}

//Función para validar contenido de input rut
function validationInputRut() {
  const rut = document.getElementById('rut').value;
  const rutForm = document.getElementById('rut');
  const rutHelp = document.getElementById('rut-help');

  if (!requiredValidation(rut)) {
    rutForm.classList.add('is-danger');
    rutHelp.classList.remove('is-hidden');
    return false;
  } else {
    rutForm.classList.remove('is-danger');
    rutHelp.classList.add('is-hidden');
    return true;
  }
}

//Función para validar contenido de select gender
function validationSelectGender() {
  const gender = document.getElementById('gender').value;
  const genderForm = document.getElementById('gender-select');
  const genderHelp = document.getElementById('gender-help');

  if (!requiredValidation(gender)) {
    genderForm.classList.add('is-danger');
    genderHelp.classList.remove('is-hidden');
    return false;
  } else {
    genderForm.classList.remove('is-danger');
    genderHelp.classList.add('is-hidden');
    return true;
  }
}

//Función para validar contenido de input date
function validationInputDate() {
  const date = document.getElementById('date').value;
  const dateForm = document.getElementById('date');
  const dateHelp = document.getElementById('date-help');

  if (!requiredValidation(date)) {
    dateForm.classList.add('is-danger');
    dateHelp.classList.remove('is-hidden');
    return false;
  } else {
    dateForm.classList.remove('is-danger');
    dateHelp.classList.add('is-hidden');
    return true;
  }
}

//Función para validar contenido de select doctor
function validationSelectDoctor() {
  const doctor = document.getElementById('doctor').value;
  const doctorForm = document.getElementById('doctor-select');
  const doctorHelp = document.getElementById('doctor-help');

  if (!requiredValidation(doctor)) {
    doctorForm.classList.add('is-danger');
    doctorHelp.classList.remove('is-hidden');
    return false;
  } else {
    doctorForm.classList.remove('is-danger');
    doctorHelp.classList.add('is-hidden');
    return true;
  }
}

//Función para validar contenido de input scheduleDate
function validationInputScheduleDate() {
  const scheduleDate = document.getElementById('schedule-date').value;
  const scheduleDateForm = document.getElementById('schedule-date');
  const scheduleDateHelp = document.getElementById('schedule-date-help');

  if (!requiredValidation(scheduleDate)) {
    scheduleDateForm.classList.add('is-danger');
    scheduleDateHelp.classList.remove('is-hidden');
    return false;
  } else {
    scheduleDateForm.classList.remove('is-danger');
    scheduleDateHelp.classList.add('is-hidden');
    return true;
  }
}

//Función para validar contenido de select scheduleTime
function validationSelectScheduleTime() {
  const scheduleTime = document.getElementById('schedule-time').value;
  const scheduleTimeForm = document.getElementById('schedule-time-select');
  const scheduleTimeHelp = document.getElementById('schedule-time-help');
  console.log(gender);
  if (!requiredValidation(scheduleTime)) {
    scheduleTimeForm.classList.add('is-danger');
    scheduleTimeHelp.classList.remove('is-hidden');
    return false;
  } else {
    scheduleTimeForm.classList.remove('is-danger');
    scheduleTimeHelp.classList.add('is-hidden');
    return true;
  }
}