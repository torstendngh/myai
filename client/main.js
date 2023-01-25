const form = document.getElementById('prompt');
const chat = document.getElementById('chat');

const loader = (element) => {
  element.innerHTML = `
    <div class="loader">
      <div></div>
    </div>
  `
};

const getUniqueID = () => {
  return `id-${crypto.randomUUID()}`;
};

const chatMessage = (isAI, value, id) => {

  let element;

  if (isAI) {
    element = `
      <div class="message-wrapper">
        <div class="profile-picture ai">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20.011"><path id="Path_12" data-name="Path 12" d="M19,4.491a2.5,2.5,0,0,1-3.012,2.448l-1.28,2.118A3.99,3.99,0,0,1,16,12v.058l1.3.261a2.5,2.5,0,1,1-.279,1.474l-1.32-.265a4.015,4.015,0,0,1-1.742,1.963L14.45,17h.05a2.5,2.5,0,1,1-1.472.478l-.5-1.516A3.994,3.994,0,0,1,8.78,14.372l-1.8.848a2.5,2.5,0,1,1-.608-1.372l1.754-.828a4.006,4.006,0,0,1,.784-3.567l-.991-1.13a2.5,2.5,0,1,1,1.164-.948l.983,1.12a4.009,4.009,0,0,1,3.363-.23l1.245-2.06A2.5,2.5,0,1,1,19,4.492Z" transform="translate(-2 -1.992)" fill="currentColor"/></svg>
        </div>
        <div class="message ai" id="${id}">
          ${value}
        </div>
      </div>
    `
  } else {
    element = `
      <div class="message-wrapper">
        <div class="profile-picture">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16.001 19.996"><path id="Path_7" data-name="Path 7" d="M17.754,14A2.249,2.249,0,0,1,20,16.249v.918a2.75,2.75,0,0,1-.513,1.6C17.945,20.929,15.42,22,12,22s-5.945-1.072-7.487-3.237A2.75,2.75,0,0,1,4,17.168v-.92A2.249,2.249,0,0,1,6.252,14h11.5ZM12,2A5,5,0,1,1,7,7a5,5,0,0,1,5-5Z" transform="translate(-4.003 -2.004)" fill="currentColor"/></svg>
        </div>
        <div class="message" id="${id}">
          ${value}
        </div>
      </div>
    `
  }

  return element;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (data.get('prompt') == "") return;

  chat.innerHTML += chatMessage(false, data.get('prompt'), getUniqueID());
  form.reset();

  const AIMessageID = getUniqueID();
  chat.innerHTML += chatMessage(true, "", AIMessageID);

  chat.scrollTop = chat.scrollHeight;

  const messageDiv = document.getElementById(AIMessageID);

  loader(messageDiv);

  const response = await fetch('http://localhost:5000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  });

  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    messageDiv.innerHTML = parsedData;
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong :(";
    console.log(err);
  }

  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
