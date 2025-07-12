function showSection(id, button) {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

let userCount = 0;
let questionCount = 0;
let answerCount = 0;

const answersData = []; // store all answers per question

function updateCounts() {
  document.getElementById('userCount').innerText = userCount;
  document.getElementById('questionCount').innerText = questionCount;
  document.getElementById('answerCount').innerText = answerCount;
  updateAnswerOverview();
}

function addUser() {
  const name = document.getElementById('userName').value.trim();
  const id = document.getElementById('userId').value.trim();
  if (name && id) {
    userCount++;
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <p><strong>${name}</strong> — ID: ${id}</p>
      <div>
        <button class="btn btn-delete" onclick="this.closest('.item').remove(); userCount--; updateCounts();">Delete</button>
        <button class="btn btn-block" onclick="toggleBlock(this)">Block</button>
      </div>
    `;
    document.getElementById('userList').appendChild(div);
    document.getElementById('userName').value = '';
    document.getElementById('userId').value = '';
    updateCounts();
  }
}

function toggleBlock(button) {
  if (button.innerText === 'Block') {
    button.innerText = 'Unblock';
    button.style.background = '#6c757d';
    button.style.color = '#fff';
  } else {
    button.innerText = 'Block';
    button.style.background = '#ffc107';
    button.style.color = '#333';
  }
}

function addQuestion() {
  const text = document.getElementById('questionText').value.trim();
  if (text) {
    questionCount++;
    answersData.push([]);
    const div = document.createElement('div');
    div.className = 'card question-block';
    div.innerHTML = `
      <p><strong>Q${questionCount}: ${text}</strong></p>
      <input type="text" placeholder="Add answer" class="answer-input" />
      <button class="btn btn-answer" onclick="addAnswerToQuestion(this, ${questionCount - 1})">Add Answer</button>
      <div class="answer-list"></div>
      <button class="btn btn-delete" onclick="deleteQuestion(this, ${questionCount - 1})">Delete Question</button>
    `;
    document.getElementById('questionList').appendChild(div);
    document.getElementById('questionText').value = '';
    updateCounts();
  }
}

function addAnswerToQuestion(button, qIndex) {
  const questionBlock = button.parentElement;
  const input = questionBlock.querySelector('.answer-input');
  const answerText = input.value.trim();
  if (answerText) {
    answerCount++;
    answersData[qIndex].push(answerText);

    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer-item';
    answerDiv.innerHTML = `
      <p>${answerText}</p>
      <button class="btn btn-delete" onclick="deleteAnswerFromQuestion(this, ${qIndex}, '${answerText}')">Delete Answer</button>
    `;
    questionBlock.querySelector('.answer-list').appendChild(answerDiv);
    input.value = '';
    updateCounts();
  }
}

function deleteQuestion(button, qIndex) {
  const qBlock = button.parentElement;
  answerCount -= answersData[qIndex].length;
  answersData[qIndex] = [];
  qBlock.remove();
  questionCount--;
  updateCounts();
}

function deleteAnswerFromQuestion(button, qIndex, text) {
  const aBlock = button.parentElement;
  const idx = answersData[qIndex].indexOf(text);
  if (idx !== -1) answersData[qIndex].splice(idx, 1);
  aBlock.remove();
  answerCount--;
  updateCounts();
}

function updateAnswerOverview() {
  const overview = document.getElementById('answerOverview');
  overview.innerHTML = '';

  answersData.forEach((answers, index) => {
    if (answers.length > 0) {
      const qDiv = document.createElement('div');
      qDiv.innerHTML = `<strong>Question #${index + 1}</strong>`;
      const listDiv = document.createElement('div');
      listDiv.className = 'answer-overview-list';

      answers.forEach(ans => {
        const ansP = document.createElement('p');
        ansP.innerHTML = `
          <span>${ans}</span>
          <button class="btn btn-delete" onclick="deleteAnswerFromOverview(${index}, '${ans}')">Delete</button>
        `;
        listDiv.appendChild(ansP);
      });

      qDiv.appendChild(listDiv);
      overview.appendChild(qDiv);
    }
  });
}

function deleteAnswerFromOverview(qIndex, text) {
  const idx = answersData[qIndex].indexOf(text);
  if (idx !== -1) answersData[qIndex].splice(idx, 1);

  // Remove from Questions section UI
  const questionBlocks = document.querySelectorAll('#questionList .question-block');
  const questionBlock = questionBlocks[qIndex];
  const answerItems = questionBlock.querySelectorAll('.answer-item');

  answerItems.forEach(item => {
    if (item.querySelector('p').innerText === text) {
      item.remove();
    }
  });

  answerCount--;
  updateCounts();
}

updateCounts();
