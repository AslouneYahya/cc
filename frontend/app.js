const API_URL = 'http://localhost:5000/api';

// DOM Elements
const eventsList = document.getElementById('events-list');
const categoryFilter = document.getElementById('category-filter');
const dateFilter = document.getElementById('date-filter');
const createEventBtn = document.getElementById('create-event-btn');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const authForms = document.getElementById('auth-forms');
const eventDetails = document.getElementById('event-details');
const eventFormSection = document.getElementById('event-form-section');
const myEventsBtn = document.getElementById('my-events-btn');

let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user'));

function showLoginForm() {
  authForms.innerHTML = `
    <h2>Login</h2>
    <form id="login-form">
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <a href="#" id="show-register">Register</a></p>
  `;
  authForms.style.display = 'block';
  document.getElementById('show-register').onclick = showRegisterForm;
  document.getElementById('login-form').onsubmit = handleLogin;
}

function showRegisterForm() {
  authForms.innerHTML = `
    <h2>Register</h2>
    <form id="register-form">
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <select name="role" required>
        <option value="user">Regular User</option>
        <option value="organizer">Event Organizer</option>
      </select>
      <button type="submit">Register</button>
    </form>
    <p>Already have an account? <a href="#" id="show-login">Login</a></p>
  `;
  authForms.style.display = 'block';
  document.getElementById('show-login').onclick = showLoginForm;
  document.getElementById('register-form').onsubmit = handleRegister;
}

function hideAuthForms() {
  authForms.style.display = 'none';
  authForms.innerHTML = '';
}

async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value
    })
  });
  const data = await res.json();
  if (res.ok) {
    token = data.token;
    currentUser = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(currentUser));
    hideAuthForms();
    updateAuthUI();
    loadEvents();
  } else {
    alert(data.message || 'Login failed');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value,
      role: form.role.value
    })
  });
  const data = await res.json();
  if (res.ok) {
    alert('Registration successful! Please log in.');
    showLoginForm();
  } else {
    alert(data.message || 'Registration failed');
  }
}

function handleLogout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthUI();
  loadEvents();
}

function updateAuthUI() {
  if (token && currentUser) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    
    // Show organizer-specific buttons
    if (currentUser.role === 'organizer') {
      createEventBtn.style.display = 'inline-block';
      myEventsBtn.style.display = 'inline-block';
    } else {
      createEventBtn.style.display = 'none';
      myEventsBtn.style.display = 'none';
    }
  } else {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    createEventBtn.style.display = 'none';
    myEventsBtn.style.display = 'none';
  }
}

async function loadEvents() {
  let url = `${API_URL}/events`;
  const params = [];
  if (categoryFilter.value) params.push(`category=${categoryFilter.value}`);
  if (dateFilter.value) params.push(`date=${dateFilter.value}`);
  if (params.length) url += '?' + params.join('&');
  const res = await fetch(url);
  const events = await res.json();
  displayEvents(events);
}

async function loadMyEvents() {
  if (!token || currentUser?.role !== 'organizer') return;
  
  const res = await fetch(`${API_URL}/events/my/events`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const events = await res.json();
  displayEvents(events);
}

function displayEvents(events) {
  eventsList.innerHTML = '';
  if (!events.length) {
    eventsList.innerHTML = '<p>No events found.</p>';
    return;
  }
  events.forEach(event => {
    const div = document.createElement('div');
    div.className = 'event-card';
    div.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.date} ${event.time}</p>
      <p>${event.location}</p>
      <p>${event.category || ''}</p>
      ${event.organizer_email ? `<p class="organizer">Organized by: ${event.organizer_email}</p>` : ''}
    `;
    div.onclick = () => showEventDetails(event.id);
    eventsList.appendChild(div);
  });
}

async function showEventDetails(id) {
  const res = await fetch(`${API_URL}/events/${id}`);
  const event = await res.json();
  
  const isOrganizer = currentUser?.role === 'organizer';
  const isEventOwner = isOrganizer && event.user_id === currentUser.id;
  
  eventDetails.innerHTML = `
    <h2>${event.title}</h2>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Time:</strong> ${event.time}</p>
    <p><strong>Location:</strong> ${event.location}</p>
    <p><strong>Category:</strong> ${event.category || ''}</p>
    <p><strong>Organizer:</strong> ${event.organizer_email || 'Unknown'}</p>
    <p>${event.description}</p>
    ${isEventOwner ? `
      <button id="edit-event-btn">Edit</button>
      <button id="delete-event-btn">Delete</button>
    ` : ''}
    <button id="close-details-btn">Close</button>
  `;
  
  eventDetails.style.display = 'block';
  document.getElementById('close-details-btn').onclick = () => eventDetails.style.display = 'none';
  
  if (isEventOwner) {
    document.getElementById('edit-event-btn').onclick = () => showEventForm('edit', event);
    document.getElementById('delete-event-btn').onclick = () => deleteEvent(event.id);
  }
}

function showEventForm(mode, event = {}) {
  if (!token || currentUser?.role !== 'organizer') return;
  
  eventFormSection.innerHTML = `
    <h2>${mode === 'edit' ? 'Edit' : 'Create'} Event</h2>
    <form id="event-form">
      <input type="text" name="title" placeholder="Title" value="${event.title || ''}" required />
      <textarea name="description" placeholder="Description">${event.description || ''}</textarea>
      <input type="date" name="date" value="${event.date || ''}" required />
      <input type="time" name="time" value="${event.time || ''}" required />
      <input type="text" name="location" placeholder="Location" value="${event.location || ''}" required />
      <select name="category">
        <option value="">Select Category</option>
        <option value="Club" ${event.category === 'Club' ? 'selected' : ''}>Club</option>
        <option value="Workshop" ${event.category === 'Workshop' ? 'selected' : ''}>Workshop</option>
        <option value="Sports" ${event.category === 'Sports' ? 'selected' : ''}>Sports</option>
        <option value="Study" ${event.category === 'Study' ? 'selected' : ''}>Study</option>
      </select>
      <button type="submit">${mode === 'edit' ? 'Update' : 'Create'} Event</button>
      <button type="button" id="cancel-event-form">Cancel</button>
    </form>
  `;
  eventFormSection.style.display = 'block';
  document.getElementById('cancel-event-form').onclick = () => eventFormSection.style.display = 'none';
  document.getElementById('event-form').onsubmit = (e) => handleEventFormSubmit(e, mode, event.id);
}

async function handleEventFormSubmit(e, mode, id) {
  e.preventDefault();
  if (!token || currentUser?.role !== 'organizer') return;
  
  const form = e.target;
  const eventData = {
    title: form.title.value,
    description: form.description.value,
    date: form.date.value,
    time: form.time.value,
    location: form.location.value,
    category: form.category.value
  };

  const url = mode === 'edit' ? `${API_URL}/events/${id}` : `${API_URL}/events`;
  const method = mode === 'edit' ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (res.ok) {
      eventFormSection.style.display = 'none';
      loadEvents();
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to save event');
    }
  } catch (err) {
    alert('Error saving event');
  }
}

async function deleteEvent(id) {
  if (!token || currentUser?.role !== 'organizer') return;
  
  if (!confirm('Are you sure you want to delete this event?')) return;

  try {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      eventDetails.style.display = 'none';
      loadEvents();
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to delete event');
    }
  } catch (err) {
    alert('Error deleting event');
  }
}

// Event Listeners
loginBtn.onclick = showLoginForm;
registerBtn.onclick = showRegisterForm;
logoutBtn.onclick = handleLogout;
createEventBtn.onclick = () => showEventForm('create');
myEventsBtn.onclick = loadMyEvents;
categoryFilter.onchange = loadEvents;
dateFilter.onchange = loadEvents;

// Initial load
updateAuthUI();
loadEvents(); 