// Configuración base
const API_BASE_URL = 'https://paleturquoise-wasp-242137.hostingersite.com'; // Cambiar por tu URL real
const AUTH_TOKEN_KEY = 'authToken';
const REMEMBER_ME_KEY = 'rememberMe';

// Clase principal para manejar la autenticación
class AuthAPI {
    // ========== MÉTODOS DE AUTENTICACIÓN ==========
    
    // Registrar un nuevo usuario
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await this._handleResponse(response);
            this._showSuccess('¡Registro exitoso! Por favor inicia sesión.');
            return data;
        } catch (error) {
            this._showError('register', error.message);
            throw error;
        }
    }

    // Iniciar sesión
    async login(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await this._handleResponse(response);
            this.setAuthToken(data.token);
            
            // Guardar credenciales si "Recordar sesión" está marcado
            if (document.getElementById('remember')?.checked) {
                localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(credentials));
            } else {
                localStorage.removeItem(REMEMBER_ME_KEY);
            }
            
            this._showSuccess('¡Bienvenido! Redirigiendo...');
            return data;
        } catch (error) {
            this._showError('login', error.message);
            throw error;
        }
    }

    // Cerrar sesión
    async logout() {
        try {
            const token = this.getAuthToken();
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            await this._handleResponse(response);
            this.clearAuthToken();
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    // Obtener información del usuario actual
    async getCurrentUser() {
        try {
            const token = this.getAuthToken();
            if (!token) return null;

            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            return await this._handleResponse(response);
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    }

    // Refrescar token JWT
    async refreshToken() {
        try {
            const token = this.getAuthToken();
            if (!token) return null;

            const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await this._handleResponse(response);
            this.setAuthToken(data.token);
            return data;
        } catch (error) {
            console.error('Refresh token error:', error);
            throw error;
        }
    }

    // ========== RECUPERACIÓN DE CONTRASEÑA ==========
    
    // Solicitar enlace para resetear contraseña
    async forgotPassword(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await this._handleResponse(response);
            this._showSuccess('Se han enviado las instrucciones a tu correo electrónico');
            return data;
        } catch (error) {
            this._showError('forgot', error.message);
            throw error;
        }
    }

    // Resetear contraseña con token
    async resetPassword(token, newPassword) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await this._handleResponse(response);
            this._showSuccess('¡Contraseña actualizada correctamente! Redirigiendo...');
            return data;
        } catch (error) {
            this._showError('reset', error.message);
            throw error;
        }
    }

    // ========== MANEJO DE TOKENS ==========
    
    setAuthToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    getAuthToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }

    clearAuthToken() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    isAuthenticated() {
        return !!this.getAuthToken();
    }

    // ========== HELPERS ==========
    
    async _handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }
        
        return data;
    }

    _showError(formId, message) {
        const errorElement = document.getElementById(`${formId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            alert(`Error: ${message}`);
        }
    }

    _showSuccess(message) {
        alert(message);
    }

    // ========== MANEJADORES DE FORMULARIOS ==========
    
    initLoginForm() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        // Cargar credenciales guardadas si existen
        const savedCredentials = localStorage.getItem(REMEMBER_ME_KEY);
        if (savedCredentials) {
            const { email, password } = JSON.parse(savedCredentials);
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            document.getElementById('remember').checked = true;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                await this.login({ email, password });
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; // Redirigir al dashboard
                }, 1500);
            } catch (error) {
                console.error('Login failed:', error);
            }
        });
    }

    initRegisterForm() {
        const form = document.getElementById('registerForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Validación básica
            if (password !== confirmPassword) {
                this._showError('register', 'Las contraseñas no coinciden');
                return;
            }
            
            if (!termsAccepted) {
                this._showError('register', 'Debes aceptar los términos y condiciones');
                return;
            }
            
            try {
                await this.register({ name, email, password });
                setTimeout(() => {
                    window.location.href = 'login-page.html';
                }, 1500);
            } catch (error) {
                console.error('Registration failed:', error);
            }
        });
    }

    initForgotPasswordForm() {
        const form = document.getElementById('forgotForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('recovery-email').value;
            
            try {
                await this.forgotPassword(email);
                form.reset();
            } catch (error) {
                console.error('Forgot password failed:', error);
            }
        });
    }

    initResetPasswordForm() {
        const form = document.getElementById('resetForm');
        if (!form) return;

        // Obtener token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
            this._showError('reset', 'Token no válido o faltante');
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-new-password').value;
            
            if (newPassword !== confirmPassword) {
                this._showError('reset', 'Las contraseñas no coinciden');
                return;
            }
            
            try {
                await this.resetPassword(token, newPassword);
                setTimeout(() => {
                    window.location.href = 'login-page.html';
                }, 1500);
            } catch (error) {
                console.error('Reset password failed:', error);
            }
        });
    }

    // ========== INICIALIZACIÓN ==========
    
    init() {
        // Inicializar formularios según la página actual
        this.initLoginForm();
        this.initRegisterForm();
        this.initForgotPasswordForm();
        this.initResetPasswordForm();

        // Redirigir si ya está autenticado (excepto en páginas de login/register)
        if (this.isAuthenticated() && !window.location.pathname.includes('dashboard')) {
            window.location.href = 'dashboard.html';
        }
    }
}

// Instancia global de la API
const authAPI = new AuthAPI();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    authAPI.init();
    
    // Efectos visuales (copiados de tu código original)
    initVisualEffects();
});

// Función para los efectos visuales (partículas, 3D, etc.)
function initVisualEffects() {
    // Efecto de partículas
    function createParticles() {
        const card = document.querySelector('.login-card');
        if (!card) return;
        
        const cardRect = card.getBoundingClientRect();
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 5 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const x = Math.random() * (cardRect.width - size);
            const y = Math.random() * (cardRect.height - size);
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            card.appendChild(particle);
            animateParticle(particle, cardRect.width, cardRect.height);
        }
    }

    function animateParticle(particle, maxWidth, maxHeight) {
        let x = parseFloat(particle.style.left);
        let y = parseFloat(particle.style.top);
        let xSpeed = (Math.random() - 0.5) * 0.5;
        let ySpeed = (Math.random() - 0.5) * 0.5;
        
        function move() {
            x += xSpeed;
            y += ySpeed;
            
            if (x <= 0 || x >= maxWidth - parseFloat(particle.style.width)) {
                xSpeed *= -1;
            }
            
            if (y <= 0 || y >= maxHeight - parseFloat(particle.style.height)) {
                ySpeed *= -1;
            }
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            requestAnimationFrame(move);
        }
        
        move();
    }

    // Efecto 3D al mover el mouse
    document.addEventListener('mousemove', (e) => {
        const card = document.querySelector('.login-card');
        if (!card) return;
        
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        
        const angleX = (e.clientY - centerY) / 20;
        const angleY = (centerX - e.clientX) / 20;
        
        card.style.transform = ` translateY(-5px)`;
    });

    // Resetear transformación cuando el mouse sale
    document.addEventListener('mouseout', (e) => {
        const card = document.querySelector('.login-card');
        if (card && !card.contains(e.relatedTarget)) {
            card.style.transform = 'rotateX(0) rotateY(0) translateY(-5px)';
        }
    });

    // Iniciar partículas después de un retraso
    setTimeout(createParticles, 500);
}