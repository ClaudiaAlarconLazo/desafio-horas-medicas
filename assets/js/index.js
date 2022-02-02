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
  
  console.log(data);

};