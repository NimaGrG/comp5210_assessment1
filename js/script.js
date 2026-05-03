const button = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const container = document.getElementById('scp-container');
const statusMessage = document.getElementById('statusMessage');
const searchInput = document.getElementById('searchInput');

let scpData = [];

if (button && nav) {
  button.addEventListener('click', () => {
    nav.classList.toggle('open');
    button.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
  });
}

fetch('scp-data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('JSON file failed to load');
    }
    return response.json();
  })
  .then(data => {
    scpData = data;
    displayScpCards(scpData);
    statusMessage.textContent = `${scpData.length} SCP records loaded successfully.`;
  })
  .catch(error => {
    statusMessage.textContent = 'Error loading SCP records. Check the JSON file path.';
    console.error(error);
  });

function displayScpCards(records) {
  container.innerHTML = '';

  if (records.length === 0) {
    container.innerHTML = '<p>No SCP records found.</p>';
    return;
  }

  records.forEach(scp => {
    const card = document.createElement('article');
    card.className = 'card';

    const className = scp.objectClass.toLowerCase();

    card.innerHTML = `
      <div class="thumb">
        ${scp.image 
          ? `<img src="${scp.image}" alt="${scp.id} image">` 
          : `<div class="image-placeholder">No source image provided in original file.</div>`
        }
      </div>

      <div class="body">
        <span class="badge ${className}">${scp.objectClass}</span>
        <h2>${scp.id}</h2>
        <h3>${scp.title}</h3>

        <p><strong>Summary:</strong> ${scp.summary}</p>
        <p><strong>Containment:</strong> ${scp.containment}</p>
        <p><strong>Description:</strong> ${scp.description}</p>

        <div class="actions">
          <button type="button" onclick="readDescription('${escapeForSpeech(scp.id)}')">
            Read Description
          </button>

          <button type="button" class="stop-button" onclick="stopSpeech()">
            Stop
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function readDescription(id) {
  const selectedScp = scpData.find(scp => scp.id === id);

  if (!selectedScp) {
    return;
  }

  window.speechSynthesis.cancel();

  const speechText = `${selectedScp.id}. ${selectedScp.title}. Object class ${selectedScp.objectClass}. ${selectedScp.description}`;
  const speech = new SpeechSynthesisUtterance(speechText);

  speech.lang = 'en-US';
  speech.rate = 0.9;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

function stopSpeech() {
  window.speechSynthesis.cancel();
}

function escapeForSpeech(text) {
  return text.replace(/'/g, "\\'");
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredRecords = scpData.filter(scp => {
      return (
        scp.id.toLowerCase().includes(searchTerm) ||
        scp.title.toLowerCase().includes(searchTerm) ||
        scp.objectClass.toLowerCase().includes(searchTerm) ||
        scp.summary.toLowerCase().includes(searchTerm) ||
        scp.description.toLowerCase().includes(searchTerm)
      );
    });

    displayScpCards(filteredRecords);
  });
}