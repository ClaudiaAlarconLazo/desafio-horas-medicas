const SUPABASE_URL = 'https://lwuduvlhohzpawjggsdz.supabase.co'
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzgzOTIxMCwiZXhwIjoxOTU5NDE1MjEwfQ.mOypMz22Avy9RyKDho-BjMwgYBQBd6Uspy1BvEyG5Js";

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

function almacenarHora(event) {
  event.preventDefault();
  console.log(event);

  const form = document.querySelector('form');
  const data = Object.fromEntries(new FormData(form).entries());

  if (!data.gender) {
    alert("Seleccione género");
    return;  
  }

  if (!data.schedule_time) {
    alert("Seleccione hora de atención");
    return;  
  }

  if (!data.doctor) {
    alert("Seleccione médico");
    return;  
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
    fecha_atencion: data.schedule_date,
    hora_atencion: data.schedule_time,
   },
  ])
  .then(response => {
    alert('Reserva de hora exitosa');
    window.location.href = "/desafio-horas-medicas/agenda.html";
    console.log(response)
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
      cellButton.innerHTML =  `<button onclick="redirectDetail(${element.id})">Ver</button>`;

    })

  })
  .catch(error => console.log(error));

};


function redirectDetail(id) {
  window.location.href = `/desafio-horas-medicas/detalle-agenda.html?id=${id}`;
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

