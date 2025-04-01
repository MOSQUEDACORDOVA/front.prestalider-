
export class FormSolicitudPage {
    // Data objects
  clientData = {
    tipo: 'Persona',
    cedula: '',
    nombres: '',
    apellidos: '',
    genero: 'Seleccione',
    celular: '',
    telefono: '',
    nacionalidad: 'Seleccione',
    vivienda: 'Seleccione',
    condicionLaboral: 'Seleccione',
    ingreso: '$0.00',
    estadoCivil: 'Seleccione',
    dependientes: 0,
    direccion: '',
    direccion2: '',
    codigoPostal: '',
    fechaNacimiento: '',
    email: ''
  };
  
  loanData = {
    modalidad: 'Seleccione',
    monto: '$0.00',
    cuotas: 0
  };
  
  coDebtorData = {
    nombreCompleto: '',
    identificacion: '',
    telefono: '',
    direccion: ''
  };
  
  references = [];
  
  // UI state
  activeTab = 'solicitar';
  activeStatusTab = 'amortizacion';
  
  tabs = [
    { id: 'amortizacion', label: 'Amortización' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'estado', label: 'Estado' }
  ];
  
  // Function to show solicitar content
  showSolicitar() {
    this.activeTab = 'solicitar';
  }
  
  // Function to show consultar content
  showConsultar() {
    this.activeTab = 'consultar';
  }
  
  // Function to switch tabs in loan status
  switchTab(tabName) {
    this.activeStatusTab = tabName;
  }
  
  // Function to handle attachments
  handleAttachments(type) {
    console.log(`Handling ${type} attachments`);
    alert(`Seleccionar archivos para ${type}`);
  }
  
  // Function to show amortization
  showAmortization(event) {
    if (event) event.preventDefault();
    console.log('Showing amortization');
    alert('Calculando tabla de amortización');
  }
  
  // Function to add reference
  addReference(event) {
    if (event) event.preventDefault();
    console.log('Adding reference');
    const name = prompt('Nombre de la referencia:');
    if (name) {
      this.references.push({ name });
      alert(`Referencia "${name}" agregada`);
    }
  }
  
  // Function to submit application
  submitApplication() {
    console.log('Submitting application');
    
    // Basic validation
    const requiredFields = ['cedula', 'nombres', 'apellidos', 'celular', 'monto', 'cuotas'];
    let isValid = true;
    
    for (const field of requiredFields) {
      const element = document.getElementById(field);
      if (!element || !element.value.trim()) {
        isValid = false;
        element.classList.add('is-invalid');
      } else {
        element.classList.remove('is-invalid');
      }
    }
    
    if (!isValid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    alert('Solicitud enviada con éxito');
    this.showConsultar();
  }
  
  // Function to logout
  logout(event) {
    if (event) event.preventDefault();
    console.log('Logging out');
    alert('Sesión cerrada');
  }
  
  // Function to go back
  goBack(event) {
    if (event) event.preventDefault();
    console.log('Going back');
    alert('Volviendo a la página anterior');
  }
  
  // Helper function to format currency
  formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  
  // Helper function to validate required fields
  validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      field.classList.add('is-invalid');
      return false;
    } else {
      field.classList.remove('is-invalid');
      return true;
    }
  }
 }