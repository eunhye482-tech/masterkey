// 기존 sentences, 변수 선언, 문장 표시, 녹음, 제출, 다음 문장 등 그대로 유지
const sentences = [
  { korean: "그 러닝화는 다른 신발들보다 두 배 더 비싸다.", english: "The running shoes are twice as expensive as other shoes." },
  { korean: "가능한 한 빨리 오세요.", english: "Please come as soon as possible." },
  { korean: "가능한 한 빨리 오세요.", english: "Please come as soon as you can." },
  { korean: "더 많이 웃을수록, 너는 더 행복해진다.", english: "The more you laugh, the happier you become." },
  { korean: "다비드는 가능한 한 일찍 학교에 간다.", english: "David goes to school as early as possible." },
  { korean: "시험이 다가올수록, 앨리스는 점점 더 긴장했다.", english: "Alice got more and more nervous as the test came." },
  { korean: "이번 주에 날씨가 점점 더 추워지고 있다.", english: "The weather is getting colder and colder this week." },
  { korean: "새로운 경기장은 이전 것의 세 배만큼 더 크다.", english: "The new stadium is three times as big as the old one." },
  { korean: "우리가 더 많이 연습할수록, 우리의 공연은 더 좋아질 것이다.", english: "The more we practice, the better our performance will be." },
  { korean: "그 노트북은 데스크톱 컴퓨터보다 두 배 더 가볍다.", english: "The laptop is twice as light as the desktop computer." }
];

let currentIndex = 0;
let studentAnswers = [];

const koreanEl = document.getElementById("korean-sentence");
const englishInput = document.getElementById("english-input");
const feedbackEl = document.getElementById("feedback");
const recordBtn = document.getElementById("record-btn");
const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-table-container");

// 문장 표시
function showSentence(index) {
  koreanEl.textContent = sentences[index].korean;
  englishInput.value = "";
  feedbackEl.textContent = "";
}

// 정답 음성 읽기
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

// 제출
checkBtn.addEventListener("click", () => {
  const userAnswer = englishInput.value.trim();
  const correctAnswer = sentences[currentIndex].english;

  if (!userAnswer) {
    feedbackEl.textContent = "영어 답을 입력하거나 녹음하세요!";
    return;
  }

  const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();

  feedbackEl.textContent = isCorrect
    ? "✅ 정답입니다!"
    : `❌ 틀렸어요. 정답: ${correctAnswer}`;

  speakText(correctAnswer);

  studentAnswers[currentIndex] = {
    question: sentences[currentIndex].korean,
    student: userAnswer,
    correct: correctAnswer,
    isCorrect: isCorrect
  };
});

// 다음 문장
nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= sentences.length) {
    showResultTable();
  } else {
    showSentence(currentIndex);
  }
});

// 녹음
recordBtn.addEventListener("click", () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("이 브라우저는 음성인식을 지원하지 않습니다.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    englishInput.value = speechResult;
  };

  recognition.onerror = (event) => {
    alert("녹음 중 오류 발생: " + event.error);
  };
});

// 결과표 표시 + 이미지 저장 버튼 추가
function showResultTable() {
  let html = "<h2>오늘 학습 결과</h2><table id='result-table'>";
  html += "<tr><th>한글 문장</th><th>학생 답</th><th>정답</th><th>채점</th></tr>";
  studentAnswers.forEach(a => {
    html += `<tr>
      <td>${a.question}</td>
      <td>${a.student}</td>
      <td>${a.correct}</td>
      <td>${a.isCorrect ? "✅" : "❌"}</td>
    </tr>`;
  });
  html += "</table>";
  
  // 다운로드 버튼 추가
  html += `<button id="download-btn">📥 결과 이미지로 저장</button>`;
  resultContainer.innerHTML = html;

  // 버튼 이벤트
  document.getElementById("download-btn").addEventListener("click", () => {
    if (!window.html2canvas) {
      alert("html2canvas 라이브러리를 먼저 불러와야 합니다.");
      return;
    }
    html2canvas(document.getElementById("result-table")).then(canvas => {
  const imgData = canvas.toDataURL("image/png");

  const newWindow = window.open();
  newWindow.document.write(`
    <html>
      <body style="margin:0; text-align:center;">
        <img src="${imgData}" style="width:100%">
        <p style="font-size:16px; margin-top:10px;">
          📱 아이폰은 이미지를 길게 눌러<br>
          <b>“사진에 추가”</b> 하세요
        </p>
      </body>
    </html>
  `);
});

  });

  koreanEl.textContent = "오늘 학습이 완료되었습니다!";
  englishInput.value = "";
  feedbackEl.textContent = "";
}

// 초기 문장 표시
showSentence(currentIndex);
