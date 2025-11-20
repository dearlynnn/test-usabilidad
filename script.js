// DATOS DE USUARIOS Y CURSOS
let users = JSON.parse(localStorage.getItem('users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

const courses = [
    { id: 1, title: 'Introducción a JavaScript', category: 'Programación', description: 'Aprende los fundamentos de JavaScript', instructor: 'Carlos García', progress: 65, lessons: 24 },
    { id: 2, title: 'Diseño UX/UI Moderno', category: 'Diseño', description: 'Domina los principios del diseño moderno', instructor: 'María López', progress: 40, lessons: 18 },
    { id: 3, title: 'Python para Análisis de Datos', category: 'Ciencia de Datos', description: 'Análisis avanzado con Python y pandas', instructor: 'Dr. Juan Pérez', progress: 85, lessons: 32 },
    { id: 4, title: 'Marketing Digital Completo', category: 'Marketing', description: 'Estrategias efectivas de marketing online', instructor: 'Sandra Rodríguez', progress: 0, lessons: 28 }
];

// FORMULARIOS
function showRegister() {
    const formPage = document.getElementById('formPage');
    if (formPage) {
        formPage.classList.add('active');
        return;
    }
    // if this page doesn't have the form page, navigate to the form HTML
    window.location.href = 'form.html';
}
function closeRegister() {
    const formPage = document.getElementById('formPage');
    if (formPage) formPage.classList.remove('active');
}
function showLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.classList.add('active');
}
function closeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.classList.remove('active');
}
function showPresentation() {
    const presentation = document.getElementById('presentation');
    const dashboard = document.getElementById('dashboard');
    if (presentation && dashboard) {
        presentation.style.display = 'block';
        dashboard.classList.remove('active');
        closeLogin();
        closeRegister();
        return;
    }
    // If current page doesn't have the main presentation (eg. form.html), navigate back to index
    window.location.href = 'index.html';
}

function toggleForms() {
    // If we're on the separate form page, go back to index and open login
    if (document.getElementById('formPage')) {
        window.location.href = 'index.html?login=1';
        return;
    }
    // If we're on index, navigate to form page
    window.location.href = 'form.html';
}

// REGISTRO
function handleRegister(e) {
    e.preventDefault();
    // Recolección de campos
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value.trim();
    const birthday = document.getElementById('regBirthday').value;
    const gender = document.getElementById('regGender').value;
    const education = document.getElementById('regEducation').value;
    const profession = document.getElementById('regProfession').value.trim();
    const interestsNodes = Array.from(document.querySelectorAll('input[name="interests"]:checked'));
    const interests = interestsNodes.map(n => n.value);

    // Validaciones
    // Nombres y apellidos: solo letras y un espacio opcional entre palabras (permite acentos y letras unicode)
    const nameRegex = /^[\p{L}]+(?: [\p{L}]+)?$/u;
    if (!nameRegex.test(firstName)) {
        alert('Nombre inválido: solo se permiten letras y un único espacio opcional entre nombres. No se permiten números, comas, puntos ni caracteres especiales.');
        return;
    }
    if (!nameRegex.test(lastName)) {
        alert('Apellido inválido: solo se permiten letras y un único espacio opcional entre apellidos. No se permiten números, comas, puntos ni caracteres especiales.');
        return;
    }

    // Teléfono: solo dígitos, sin espacios, entre 4 y 10 caracteres
    const phoneRegex = /^\d{4,10}$/;
    if (!phoneRegex.test(phone)) {
        alert('Número de teléfono inválido: debe contener entre 4 y 10 dígitos y no puede contener espacios ni caracteres especiales.');
        return;
    }

    // Email: permite letras, dígitos y puntos, un único @; no permite comas, espacios ni otros caracteres especiales
    const emailRegex = /^[A-Za-z0-9.]+@[A-Za-z0-9.]+$/;
    if (!emailRegex.test(email)) {
        alert('Correo inválido: use el formato usuario@dominio (se permiten puntos) y no se permiten comas ni espacios ni otros caracteres especiales.');
        return;
    }

    // Password security validation
    if (!isPasswordSecure(password)) {
        alert('Tu contraseña debe cumplir con todos los requisitos de seguridad:\n\n' +
              '• Mínimo 8 caracteres\n' +
              '• Una letra mayúscula\n' +
              '• Una letra minúscula\n' +
              '• Un número\n' +
              '• Un carácter especial (@$!%*?&.#-_)');
        return;
    }

    // Intereses: al menos uno
    if (interests.length === 0) {
        alert('Selecciona al menos un interés.');
        return;
    }

    if (users.find(u => u.email === email)) {
        alert('Este correo ya está registrado');
        return;
    }

    // Confirm password
    const confirmPassword = document.getElementById('regPasswordConfirm') ? document.getElementById('regPasswordConfirm').value : null;
    if (!confirmPassword || confirmPassword !== password) {
        alert('Las contraseñas no coinciden o están vacías.');
        return;
    }

    // convert birthday to DD/MM/YYYY for storage if it's in yyyy-mm-dd
    let birthdayFormatted = birthday;
    if (birthday && birthday.includes('-')) {
        const p = birthday.split('-');
        if (p.length === 3) birthdayFormatted = `${p[2]}/${p[1]}/${p[0]}`;
    }

    const newUser = { id: Date.now(), firstName, lastName, email, password, phone, birthday: birthdayFormatted, gender, education, profession, interests };
    users.push(newUser);
    // persist users and set current user
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    // redirect to success page
    window.location.href = 'registro-exitoso.html';
}

// PASSWORD SECURITY VALIDATION (must be before nextFormStep uses it)
function checkPasswordStrength(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&.#\-_]/.test(password)
    };

    const metCount = Object.values(requirements).filter(Boolean).length;
    
    let strength = 'weak';
    if (metCount >= 5) {
        strength = 'strong';
    } else if (metCount >= 3) {
        strength = 'medium';
    }

    return { requirements, strength, metCount };
}

function isPasswordSecure(password) {
    const { requirements } = checkPasswordStrength(password);
    return Object.values(requirements).every(Boolean);
}

function updatePasswordStrengthUI(password) {
    const strengthFill = document.getElementById('strengthFillMini');
    const strengthLabel = document.getElementById('strengthLabelMini');

    if (!strengthFill || !strengthLabel) return;

    if (password.length === 0) {
        strengthFill.className = 'strength-fill-mini';
        strengthLabel.className = 'strength-label-mini';
        strengthLabel.textContent = 'Sin contraseña';
        
        // Reset all requirements
        ['length', 'uppercase', 'lowercase', 'number', 'special'].forEach(key => {
            const elem = document.getElementById('req-' + key);
            if (elem) elem.classList.remove('met');
        });
        return;
    }

    const { requirements, strength } = checkPasswordStrength(password);

    // Update strength bar and label
    strengthFill.className = 'strength-fill-mini ' + strength;
    strengthLabel.className = 'strength-label-mini ' + strength;

    const strengthLabels = {
        weak: 'Débil',
        medium: 'Media',
        strong: 'Fuerte'
    };
    strengthLabel.textContent = strengthLabels[strength];

    // Update requirements list in sidebar
    const reqElements = {
        length: document.getElementById('req-length'),
        uppercase: document.getElementById('req-uppercase'),
        lowercase: document.getElementById('req-lowercase'),
        number: document.getElementById('req-number'),
        special: document.getElementById('req-special')
    };

    Object.keys(requirements).forEach(key => {
        if (reqElements[key]) {
            if (requirements[key]) {
                reqElements[key].classList.add('met');
            } else {
                reqElements[key].classList.remove('met');
            }
        }
    });
}

// Multi-step form navigation
let currentFormStep = 1;
const totalFormSteps = 3;

function showFormStep(step) {
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const target = steps.find(s => Number(s.dataset.step) === step);
    const current = steps.find(s => Number(s.dataset.step) === currentFormStep);

    if (!target) return;

    const forward = step > currentFormStep;

    // if target is already current, ensure visible and exit
    if (current && current === target) {
        target.classList.remove('hidden-step');
        target.classList.add('active-step');
        const stepItems = document.querySelectorAll('.step-item');
        stepItems.forEach(d => d.classList.toggle('active', Number(d.dataset.step) === step));
        return;
    }

    // prepare wrapper height so layout doesn't collapse during animation
    const wrap = document.querySelector('.form-steps-wrap');
    if (wrap) {
        const currentHeight = current ? current.scrollHeight : target.scrollHeight;
        wrap.style.height = currentHeight + 'px';
    }

    // prepare target for animation
    target.classList.remove('from-left', 'from-right', 'to-left', 'to-right', 'active-step', 'hidden-step');
    current && current.classList.remove('from-left', 'from-right', 'to-left', 'to-right', 'active-step');

    if (!current) {
        // first load, show target without animation
        target.classList.remove('hidden-step');
        target.classList.add('active-step');
    } else {
        // set initial positions
        if (forward) {
            target.classList.add('from-right');
            // ensure browser registers initial transform
            void target.offsetWidth;
            target.classList.remove('from-right');
            target.classList.add('active-step');
            current.classList.add('to-left');
        } else {
            target.classList.add('from-left');
            void target.offsetWidth;
            target.classList.remove('from-left');
            target.classList.add('active-step');
            current.classList.add('to-right');
        }

        // animate wrapper height to target height
        if (wrap) {
            const targetH = target.scrollHeight;
            // allow next frame to pick up classes
            requestAnimationFrame(() => {
                wrap.style.height = targetH + 'px';
            });
            const onWrapTransition = (ev) => {
                if (ev.propertyName !== 'height') return;
                wrap.style.height = 'auto';
                wrap.removeEventListener('transitionend', onWrapTransition);
            };
            wrap.addEventListener('transitionend', onWrapTransition);
        }

        // after animation, hide previous
        if (current) {
            const onTransitionEnd = (ev) => {
                if (ev.target !== current) return;
                current.classList.add('hidden-step');
                current.classList.remove('to-left', 'to-right');
                current.removeEventListener('transitionend', onTransitionEnd);
            };
            current.addEventListener('transitionend', onTransitionEnd);
        }
    }

    // update indicators
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach(d => {
        d.classList.toggle('active', Number(d.dataset.step) === step);
    });

    currentFormStep = step;
    // update persistent nav buttons (disable/label)
    const prevBtn = document.getElementById('navPrevBtn');
    const nextBtn = document.getElementById('navNextBtn');
    if (prevBtn) prevBtn.disabled = (step === 1);
    if (nextBtn) nextBtn.textContent = (step === totalFormSteps ? 'Registrarse' : 'Siguiente');
}

function nextFormStep() {
    const current = document.querySelector(`.form-step[data-step="${currentFormStep}"]`);
    if (!current) return;
    // validate required fields inside current step
    const requiredControls = Array.from(current.querySelectorAll('[required]'));
    for (const control of requiredControls) {
        if (!control.checkValidity()) {
            control.reportValidity && control.reportValidity();
            control.focus();
            return;
        }
    }

    // Additional per-step validations
    if (currentFormStep === 1) {
        // names
        const firstName = document.getElementById('regFirstName').value.trim();
        const lastName = document.getElementById('regLastName').value.trim();
        const nameRegex = /^[\p{L}]+(?: [\p{L}]+)?$/u;
        if (!nameRegex.test(firstName)) { alert('Nombre inválido: solo letras y un único espacio opcional.'); return; }
        if (!nameRegex.test(lastName)) { alert('Apellido inválido: solo letras y un único espacio opcional.'); return; }

        // email
        const email = document.getElementById('regEmail').value.trim();
        const emailRegex = /^[A-Za-z0-9.]+@[A-Za-z0-9.]+$/;
        if (!emailRegex.test(email)) { alert('Correo inválido: formato usuario@dominio (se permiten puntos).'); return; }

        // password security validation
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regPasswordConfirm').value;
        
        if (!isPasswordSecure(password)) {
            alert('Tu contraseña debe cumplir con todos los requisitos de seguridad:\n\n' +
                  '• Mínimo 8 caracteres\n' +
                  '• Una letra mayúscula\n' +
                  '• Una letra minúscula\n' +
                  '• Un número\n' +
                  '• Un carácter especial (@$!%*?&.#-_)');
            return;
        }
        
        if (password !== confirm) { 
            alert('Las contraseñas no coinciden.'); 
            return; 
        }
    }

    if (currentFormStep === 2) {
        // phone validation
        const phone = document.getElementById('regPhone').value.trim();
        const phoneRegex = /^\d{4,10}$/;
        if (!phoneRegex.test(phone)) { alert('Número de teléfono inválido: debe tener entre 4 y 10 dígitos, sin espacios.'); return; }
    }
    if (currentFormStep < totalFormSteps) {
        showFormStep(currentFormStep + 1);
    } else {
        // If last step, submit form
        const form = document.getElementById('multiStepForm');
        if (form) form.requestSubmit();
    }
}

function prevFormStep() {
    if (currentFormStep > 1) showFormStep(currentFormStep - 1);
}

// LOGIN
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        alert('Correo o contraseña incorrectos');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    // Redirect to login success page
    window.location.href = 'login-exitoso.html';
}

// DASHBOARD
function showDashboard() {
    document.getElementById('presentation').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');

    const displayName = currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : (currentUser.name || currentUser.email);
    document.getElementById('userGreeting').textContent = `Te ves bien hoy, ${displayName}`;
    document.getElementById('userEmail').textContent = currentUser.email;

    renderCourses();
}

function renderCourses() {
    const grid = document.getElementById('coursesGrid');

    grid.innerHTML = courses.map(course => `
        <div class="course-card">
            <div class="course-header">
                <h3>${course.title}</h3>
                <p>${course.category}</p>
            </div>
            <div class="course-body">
                <div class="course-info">
                    <span>👨‍🏫 ${course.instructor}</span>
                    <span>${course.lessons} lecciones</span>
                </div>

                <p>${course.description}</p>

                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                </div>

                <p class="progress-text">Progreso: ${course.progress}%</p>

                <div class="course-footer">
                    <button class="btn-course btn-continue">
                        ${course.progress === 0 ? 'Iniciar' : 'Continuar'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    // Always redirect to home when logging out
    window.location.href = 'index.html';
}

// Initialization: load users/currentUser and handle URL params
document.addEventListener('DOMContentLoaded', () => {
    // ensure variables reflect persisted state
    users = JSON.parse(localStorage.getItem('users') || '[]');
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // If redirect from form page with login param, open login modal
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === '1') {
        showLogin();
        // remove param from URL without reload
        if (history.replaceState) history.replaceState(null, '', window.location.pathname);
    }

    // If a user is logged in, show dashboard
    if (currentUser) {
        try { showDashboard(); } catch (e) { /* some pages don't have dashboard elements */ }
    }

    // Setup birthday display formatting if element exists
    const birthdayInput = document.getElementById('regBirthday');
    const birthdayDisplay = document.getElementById('regBirthdayDisplay');
    if (birthdayInput && birthdayDisplay) {
        const updateDisplay = () => {
            const v = birthdayInput.value; // yyyy-mm-dd
            if (!v) { birthdayDisplay.textContent = 'DD/MM/AAAA'; return; }
            const parts = v.split('-');
            if (parts.length === 3) {
                birthdayDisplay.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
            } else {
                birthdayDisplay.textContent = v;
            }
        };
        birthdayInput.addEventListener('change', updateDisplay);
        updateDisplay();
    }

    // ensure form-steps-wrap height matches first step on load (if present)
    const wrap = document.querySelector('.form-steps-wrap');
    const first = document.querySelector('.form-step[data-step="1"]');
    if (wrap && first) {
        wrap.style.height = first.scrollHeight + 'px';
    }

    // --- Small helpers and immediate input restrictions (match user's snippet) ---
    function onlyDigits(str) { return (str || '').replace(/\D/g, ''); }
    function onlyLettersAndSpaces(str) { return (str || '').replace(/[^a-zA-Z\sÁÉÍÓÚáéíóúÑñ]/g, ''); }
    function capitalizeWords(str) { return (str || '').split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '); }
    function twoWordsWithSpace(str) {
        str = onlyLettersAndSpaces(str);
        const words = str.split(/\s+/).filter(Boolean);
        const result = words.slice(0,2).join(' ');
        return result.slice(0,50);
    }

    // attach listeners only if elements exist
    const fn = document.getElementById('regFirstName');
    const ln = document.getElementById('regLastName');
    const ph = document.getElementById('regPhone');
    const em = document.getElementById('regEmail');
    const pw = document.getElementById('regPassword');
    const pwConfirm = document.getElementById('regPasswordConfirm');

    if (fn) {
        fn.addEventListener('input', (e) => {
            let raw = e.target.value || '';
            // remove invalid chars but keep spaces
            let cleaned = onlyLettersAndSpaces(raw);
            // detect trailing space (user typed space to start second word)
            const hasTrailingSpace = /\s$/.test(raw);
            // split into words
            let parts = cleaned.split(/\s+/).filter(Boolean);
            if (parts.length > 2) parts = parts.slice(0,2);
            // rejoin with single space
            let joined = parts.join(' ');
            // apply capitalization to words
            const cap = capitalizeWords(joined);
            // if user had typed a trailing space and there's room for a second word, preserve one trailing space
            let final = cap;
            if (hasTrailingSpace && parts.length < 2 && final.length < 50) final = final + ' ';
            // enforce max length
            final = final.slice(0,50);
            e.target.value = final;
            if (!final.trim()) e.target.setCustomValidity('Los nombres son requeridos'); else e.target.setCustomValidity('');
        });
    }

    if (ln) {
        ln.addEventListener('input', (e) => {
            let raw = e.target.value || '';
            let cleaned = onlyLettersAndSpaces(raw);
            const hasTrailingSpace = /\s$/.test(raw);
            let parts = cleaned.split(/\s+/).filter(Boolean);
            if (parts.length > 2) parts = parts.slice(0,2);
            let joined = parts.join(' ');
            const cap = capitalizeWords(joined);
            let final = cap;
            if (hasTrailingSpace && parts.length < 2 && final.length < 50) final = final + ' ';
            final = final.slice(0,50);
            e.target.value = final;
            if (!final.trim()) e.target.setCustomValidity('Los apellidos son requeridos'); else e.target.setCustomValidity('');
        });
    }

    if (ph) {
        ph.addEventListener('input', (e) => {
            e.target.value = onlyDigits(e.target.value).slice(0, 10);
            if (!/^\d{4,10}$/.test(e.target.value)) e.target.setCustomValidity('Número de teléfono inválido'); else e.target.setCustomValidity('');
        });
    }

    if (em) {
        em.addEventListener('input', (e) => {
            let v = e.target.value || '';
            // remove spaces and commas immediately
            v = v.replace(/[\s,]+/g, '');
            // allow only letters, digits, at-sign, dot, underscore, plus and hyphen
            v = v.replace(/[^A-Za-z0-9@._+\-]/g, '');
            // ensure at most one @ symbol (keep first, remove extras)
            const parts = v.split('@');
            if (parts.length > 1) {
                const first = parts.shift();
                v = first + '@' + parts.join('').replace(/@/g, '');
            }
            e.target.value = v;
            e.target.setCustomValidity('');
        });
    }

    // Password strength validation
    if (pw) {
        pw.addEventListener('input', (e) => {
            updatePasswordStrengthUI(e.target.value);
        });
    }

    // bind persistent navigation buttons
    const prevBtn = document.getElementById('navPrevBtn');
    const nextBtn = document.getElementById('navNextBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevFormStep();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextFormStep();
        });
    }

    // ensure initial step UI is shown and nav state updated
    if (document.querySelector('.form-step')) {
        showFormStep(currentFormStep);
    }
});
