// tu-view-model.js
export class ClientPage {
    createModal;
    referenceModal;
  
    attached() {
      this.setupModalHandlers();
    }
  
    setupModalHandlers() {
      const addReferenceButton = this.createModal.querySelector('[data-bs-target="#referenceModal"]');
      
      if (addReferenceButton) {
        addReferenceButton.addEventListener('click', (e) => {
          e.preventDefault();
          const referenceModalInstance = new bootstrap.Modal(this.referenceModal);
          referenceModalInstance.show();
        });
      }
    }
  }