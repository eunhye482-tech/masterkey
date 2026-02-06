// 1. 한글 문장 10개 + 영어 답 10개
const sentences = [
  { korean: "나는 오늘 학교에 갔다.", english: "I went to school today." },
  { korean: "나는 사과를 좋아한다.", english: "I like apples." },
  { korean: "그는 매일 아침 달린다.", english: "He runs every morning." },
  { korean: "우리는 도서관에서 공부했다.", english: "We studied in the library." },
  { korean: "내 친구는 피아노를 칠 수 있다.", english: "My friend can play the piano." },
  { korean: "나는 어제 영화를 봤다.", english: "I watched a movie yesterday." },
  { korean: "그녀는 커피를 마시고 있다.", english: "She is drinking coffee." },
  { korean: "나는 매주 토요일에 운동한다.", english: "I exercise every Saturday." },
  { korean: "고양이가 창문 밖을 보고 있다.", english: "The cat is looking out the window." },
  { korean: "우리는 내일 여행을 갈 예정이다.", english: "We are going on a trip tomorrow." }
];

let currentIndex = 0;

// DOM 요소
const koreanEl = document.getElementById("korean-sentence");
const englishInput = document.getElementById("english-input");
const feedbackEl = document.getElementById("feedback");
const recordBtn = document.getElementById("record-btn");
const checkBtn = document.getElementById("check-btn");
const nextBtn = document.getElementById("next-btn");

// 2. 화면에 한글 문장 표시
function showSentence(index) {
  koreanEl.textContent = sentences[index].korean;
  englishInput.value = "";
  feedbackEl.textContent = "";
}

// 3. 정답 음성 읽기
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

// 4. 제출 확인
checkBtn.addEventListener("click", () => {
  const userAnswer = englishInput.value.trim();
  const correctAnswer = sentences[currentIndex].english;

  if (!userAnswer) {
    feedbackEl.textContent = "영어 답을 입력하거나 녹음하세요!";
    return;
  }

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    feedbackEl.textContent = "✅ 정답입니다!";
  } else {
    feedbackEl.textContent = `❌ 틀렸어요. 정답: ${correctAnswer}`;
  }

  // 정답 음성 읽어주기
  speakText(correctAnswer);
});

// 5. 다음 문장
nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= sentences.length) {
    alert("모든 문장을 완료했습니다!");
    currentIndex = 0; // 다시 처음으로
  }
  showSentence(currentIndex);
});

// 6. 녹음 버튼 (웹 SpeechRecognition 사용, Chrome/Edge 권장)
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
    englishInput.value = speechResult; // 입력창에 자동 입력
  };

  recognition.onerror = (event) => {
    alert("녹음 중 오류가 발생했습니다: " + event.error);
  };
});

// 7. 초기 문장 표시
showSentence(currentIndex);
