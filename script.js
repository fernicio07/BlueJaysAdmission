// Signature Pad Implementation
class SignaturePad {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isDrawing = false;
        this.hasSignature = false;
        
        this.setupCanvas();
        this.bindEvents();
    }

    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        this.ctx.strokeStyle = '#1e3a8a';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.hasSignature = true;
        const pos = this.getPosition(e);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getPosition(e);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    getPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hasSignature = false;
    }

    isEmpty() {
        return !this.hasSignature;
    }

    toDataURL() {
        return this.canvas.toDataURL('image/png');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize signature pad
    const canvas = document.getElementById('signatureCanvas');
    const signaturePad = new SignaturePad(canvas);
    
    const clearButton = document.getElementById('clearSignature');
    clearButton.addEventListener('click', () => {
        signaturePad.clear();
    });

    // Photo preview
    const photoInput = document.getElementById('studentPhoto');
    const photoPreview = document.getElementById('photoPreview');
    
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                photoPreview.innerHTML = `<img src="${event.target.result}" alt="Vista previa de la foto">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Show/hide encargado field
    const viveCon = document.querySelectorAll('input[name="viveCon"]');
    const encargadoGroup = document.getElementById('encargadoGroup');
    
    viveCon.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Encargado') {
                encargadoGroup.style.display = 'block';
                document.getElementById('nombreEncargado').required = true;
            } else {
                encargadoGroup.style.display = 'none';
                document.getElementById('nombreEncargado').required = false;
            }
        });
    });

    // Show/hide exalumna graduation year
    const exalumnaCPN = document.querySelectorAll('input[name="exalumnaCPN"]');
    const graduacionGroup = document.getElementById('graduacionGroup');
    
    exalumnaCPN.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Si') {
                graduacionGroup.style.display = 'block';
            } else {
                graduacionGroup.style.display = 'none';
            }
        });
    });

    // Show/hide evaluation details
    const evaluada = document.querySelectorAll('input[name="evaluada"]');
    const evaluacionDetails = document.getElementById('evaluacionDetails');
    
    evaluada.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Si') {
                evaluacionDetails.style.display = 'block';
                document.getElementById('evaluacionExplicacion').required = true;
            } else {
                evaluacionDetails.style.display = 'none';
                document.getElementById('evaluacionExplicacion').required = false;
            }
        });
    });

    // Show/hide therapy details
    const terapia = document.querySelectorAll('input[name="terapia"]');
    const terapiaDetails = document.getElementById('terapiaDetails');
    
    terapia.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Si') {
                terapiaDetails.style.display = 'block';
            } else {
                terapiaDetails.style.display = 'none';
            }
        });
    });

    // Calculate age from birth date
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    const edadAnos = document.getElementById('edadAnos');
    const edadMeses = document.getElementById('edadMeses');
    
    fechaNacimiento.addEventListener('change', function() {
        if (this.value) {
            const birthDate = new Date(this.value);
            const today = new Date();
            
            let years = today.getFullYear() - birthDate.getFullYear();
            let months = today.getMonth() - birthDate.getMonth();
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            edadAnos.value = years;
            edadMeses.value = months;
        }
    });

    // Form submission
    const form = document.getElementById('admissionForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate signature
        if (signaturePad.isEmpty()) {
            alert('Por favor, firme el formulario antes de enviarlo.');
            return;
        }
        
        // Get signature data
        const signatureData = signaturePad.toDataURL();
        
        // Get form data
        const formData = new FormData(form);
        formData.append('signature', signatureData);
        
        // Get photo if exists
        const photoFile = photoInput.files[0];
        if (photoFile) {
            formData.append('studentPhoto', photoFile);
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        form.classList.add('loading');
        
        try {
            // Here you would send the form data to your backend
            // For now, we'll use Web3Forms as an example
            
            // Option 1: Using Web3Forms (free service)
            const web3FormsKey = 'YOUR_WEB3FORMS_ACCESS_KEY'; // Replace with your key
            
            formData.append('access_key', web3FormsKey);
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Show success message
                form.style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                throw new Error('Error al enviar el formulario');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al enviar el formulario. Por favor, intente de nuevo o contacte a la oficina de admisiones.');
            
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            form.classList.remove('loading');
        }
    });

    // Auto-save to localStorage (optional feature)
    const autoSaveInterval = 30000; // 30 seconds
    let autoSaveTimer;
    
    function saveFormData() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('admissionFormDraft', JSON.stringify(data));
        console.log('Form auto-saved');
    }
    
    function loadFormData() {
        const savedData = localStorage.getItem('admissionFormDraft');
        
        if (savedData) {
            const shouldLoad = confirm('Se encontró un borrador guardado. ¿Desea continuar donde lo dejó?');
            
            if (shouldLoad) {
                const data = JSON.parse(savedData);
                
                for (let [key, value] of Object.entries(data)) {
                    const element = form.elements[key];
                    if (element) {
                        if (element.type === 'radio') {
                            const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
                            if (radio) radio.checked = true;
                        } else if (element.type === 'checkbox') {
                            element.checked = value === 'on';
                        } else {
                            element.value = value;
                        }
                    }
                }
            }
        }
    }
    
    // Load saved data on page load
    loadFormData();
    
    // Start auto-save
    form.addEventListener('input', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveFormData, autoSaveInterval);
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem('admissionFormDraft');
    });
});

// Utility function to format phone numbers
function formatPhoneNumber(input) {
    const value = input.value.replace(/\D/g, '');
    let formatted = '';
    
    if (value.length > 0) {
        formatted = '(' + value.substring(0, 3);
        if (value.length >= 3) {
            formatted += ') ' + value.substring(3, 6);
            if (value.length >= 6) {
                formatted += '-' + value.substring(6, 10);
            }
        }
    }
    
    input.value = formatted;
}

// Add phone formatting to all phone inputs
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
});
