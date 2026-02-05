// 10문장 데이터
const sentences = [
    { korean: "나는 사과를 먹었다.", english: "I ate an apple." },
    { korean: "그는 학교에 갔다.", english: "He went to school." },
    { korean: "우리는 내일 영화관에 갈 것이다.", english: "We will go to the cinema tomorrow." },
    { korean: "그녀는 매일 영어를 공부한다.", english: "She studies English every day." },
    { korean: "나는 피자를 좋아한다.", english: "I like pizza." },
    { korean: "내 친구는 축구를 잘한다.", english: "My friend plays soccer well." },
    { korean: "오늘 날씨는 좋다.", english: "The weather is nice today." },
    { korean: "나는 매일 아침 운동한다.", english: "I exercise every morning." },
    { korean: "그들은 공원에서 놀고 있다.", english: "They are playing in the park." },
    { korean: "나는 어제 책을 읽었다.", english: "I read a book yesterday." }
];

let currentIndex = 0;

// 음성 인식 객체 생성
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

// HTML 요소
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const studentSpeech = document.getElementById('studentSpeech');
const feedback = document.getElementById('feedback');
const koreanSentence = document.getElementById('koreanSentence');

// 첫 문장 표시
koreanSentence.textContent = sentences[currentIndex].korean;

// 음성 인식 시작
startBtn.addEventListener('click', () => {
    feedback.textContent = '';
    recognition.start();
});

// 음성 인식 결과 처리
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    studentSpeech.textContent = transcript;

    // 정답 비교
    const answer = sentences[currentIndex].english;
    if(transcript.toLowerCase().trim() === answer.toLowerCase()){
        feedback.textContent = "정답! 잘했어요 👍";
    } else {
        feedback.textContent = `틀렸어요. 정답: ${answer}`;
    }
};

// 음성 인식 오류 처리
recognition.onerror = (event) => {
    feedback.textContent = "오류 발생: " + event.error;
};

// 다음 문장
nextBtn.addEventListener('click', () => {
    if(currentIndex < sentences.length - 1){
        currentIndex++;
        koreanSentence.textContent = sentences[currentIndex].korean;
        studentSpeech.textContent = '';
        feedback.textContent = '';
    } else {
        koreanSentence.textContent = "모든 문장 완료!";
        studentSpeech.textContent = '';
        feedback.textContent = '';
    }
});

