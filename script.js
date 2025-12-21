document.addEventListener('DOMContentLoaded', function () {
	const nav = document.getElementById('main-nav');
	const toggle = document.getElementById('nav-toggle');
	const navList = document.getElementById('main-nav-list');
	const sideFrame = document.getElementById('side-frame');
	const backdrop = document.getElementById('frame-backdrop');

	if (!nav || !toggle || !navList) return;

	function setOpen(open) {
		if (open) {
			nav.classList.add('open');
			if (sideFrame) sideFrame.classList.add('open');
			if (backdrop) backdrop.classList.add('open');
			toggle.setAttribute('aria-expanded', 'true');
			if (sideFrame) sideFrame.setAttribute('aria-hidden', 'false');
			if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
		} else {
			nav.classList.remove('open');
			if (sideFrame) sideFrame.classList.remove('open');
			if (backdrop) backdrop.classList.remove('open');
			toggle.setAttribute('aria-expanded', 'false');
			if (sideFrame) sideFrame.setAttribute('aria-hidden', 'true');
			if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
		}
	}

	toggle.addEventListener('click', function (e) {
		const isOpen = nav.classList.contains('open');
		setOpen(!isOpen);
		e.stopPropagation();
	});

	// Close when clicking on the backdrop
	if (backdrop) {
		backdrop.addEventListener('click', function () {
			setOpen(false);
		});
	}

	// Close when clicking outside the nav on desktop
	document.addEventListener('click', function (e) {
		if (!nav.contains(e.target) && !sideFrame?.contains(e.target)) {
			setOpen(false);
		}
	});

	// Close on Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') setOpen(false);
	});
});

// FAQ Interactive Script
document.addEventListener('DOMContentLoaded', function () {
	const faqItems = document.querySelectorAll('.faq-item');
	const searchInput = document.getElementById('faq-search');
	const categoryBtns = document.querySelectorAll('.category-btn');
	const noResults = document.getElementById('no-results');
	let currentCategory = 'all';

	// Toggle FAQ items
	faqItems.forEach(item => {
		const question = item.querySelector('.faq-question');
		question.addEventListener('click', () => {
			const isActive = item.classList.contains('active');

			// Fermer tous les autres items
			faqItems.forEach(i => i.classList.remove('active'));

			// Toggle l'item actuel
			if (!isActive) {
				item.classList.add('active');
			}
		});
	});
});
// Filtrer les FAQ
// Base de données de questions
const questionsDatabase = {
	facile: [
		{
			question: "Combien de cases comporte un échiquier ?",
			answers: ["32", "48", "64", "72"],
			correct: 2,
			explanation: "Un échiquier contient 64 cases (8 rangées × 8 colonnes)."
		},
		{
			question: "Quelle couleur joue toujours en premier ?",
			answers: ["Les noirs", "Les blancs", "Celui qui gagne le tirage", "Alternativement"],
			correct: 1,
			explanation: "Les blancs jouent toujours en premier aux échecs."
		},
		{
			question: "Quelle est la pièce la plus puissante ?",
			answers: ["Le roi", "La dame", "La tour", "Le fou"],
			correct: 1,
			explanation: "La dame est la pièce la plus puissante car elle peut se déplacer dans toutes les directions."
		},
		{
			question: "Un pion peut-il reculer ?",
			answers: ["Oui", "Non", "Seulement après promotion", "Seulement au premier coup"],
			correct: 1,
			explanation: "Un pion ne peut jamais reculer, il avance toujours vers l'avant."
		},
		{
			question: "Quelle pièce peut sauter par-dessus les autres ?",
			answers: ["Le fou", "Le cavalier", "La tour", "Aucune"],
			correct: 1,
			explanation: "Le cavalier est la seule pièce qui peut sauter par-dessus les autres pièces."
		},
		{
			question: "Qu'est-ce qu'un échec et mat ?",
			answers: ["Le roi est en échec et ne peut pas s'échapper", "Capture du roi", "Pat", "Nulle"],
			correct: 0,
			explanation: "L'échec et mat signifie que le roi est en échec et ne peut échapper par aucun moyen."
		},
		{
			question: "Combien de pions possède chaque joueur au début ?",
			answers: ["6", "7", "8", "10"],
			correct: 2,
			explanation: "Chaque joueur commence avec 8 pions."
		},
		{
			question: "Le roi peut se déplacer de combien de cases ?",
			answers: ["1 case", "2 cases", "3 cases", "Autant que souhaité"],
			correct: 0,
			explanation: "Le roi ne peut se déplacer que d'une seule case dans n'importe quelle direction."
		},
		{
			question: "Peut-on passer son tour aux échecs ?",
			answers: ["Oui", "Non", "Seulement en finale", "Avec accord de l'adversaire"],
			correct: 1,
			explanation: "On ne peut jamais passer son tour aux échecs, il faut toujours jouer un coup légal."
		},
		{
			question: "Quelle case doit être dans le coin droit de chaque joueur ?",
			answers: ["Une case noire", "Une case blanche", "N'importe", "Cela dépend"],
			correct: 1,
			explanation: "Une case blanche doit toujours être dans le coin en bas à droite de chaque joueur."
		}
	],
	moyen: [
		{
			question: "Qu'est-ce que le roque ?",
			answers: ["Un mouvement de la dame", "Un coup spécial avec le roi et une tour", "Une promotion", "Une tactique"],
			correct: 1,
			explanation: "Le roque est un coup spécial où le roi et une tour se déplacent simultanément."
		},
		{
			question: "Que se passe-t-il quand un pion atteint la dernière rangée ?",
			answers: ["Il est retiré", "Il est promu", "Il recule", "Rien"],
			correct: 1,
			explanation: "Le pion est immédiatement promu en une autre pièce (Dame, Tour, Fou ou Cavalier)."
		},
		{
			question: "Qu'est-ce qu'un pat ?",
			answers: ["Échec et mat", "Nulle car aucun coup légal sans être en échec", "Victoire", "Abandon"],
			correct: 1,
			explanation: "Le pat est une situation où un joueur n'a aucun coup légal mais n'est pas en échec. C'est une nulle."
		},
		{
			question: "Comment s'appelle la capture spéciale des pions ?",
			answers: ["Promotion", "Prise en passant", "Roque", "Clouage"],
			correct: 1,
			explanation: "La prise en passant est une capture spéciale où un pion capture un pion adverse qui vient d'avancer de deux cases."
		},
		{
			question: "Qu'est-ce qu'une fourchette ?",
			answers: ["Un sacrifice", "Attaque simultanée de deux pièces", "Une promotion", "Un mat"],
			correct: 1,
			explanation: "Une fourchette est une tactique où une pièce attaque simultanément deux pièces adverses ou plus."
		}
	],
	difficile: [
		{
			question: "Qu'est-ce que le zugzwang ?",
			answers: ["Un mat", "Situation où jouer aggrave sa position", "Une ouverture", "Un titre"],
			correct: 1,
			explanation: "Le zugzwang est une situation où avoir le trait est un désavantage car tout coup aggrave la position."
		},
		{
			question: "Combien de coups sans prise ni mouvement de pion déclenchent la nulle ?",
			answers: ["30", "40", "50", "75"],
			correct: 2,
			explanation: "La règle des 50 coups déclare la partie nulle après 50 coups consécutifs sans capture ni mouvement de pion."
		}
	]
};

// Variables globales
let currentDifficulty = 'facile';
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// Éléments DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const answersGrid = document.getElementById('answers-grid');
const feedback = document.getElementById('feedback');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');

// Sélection de la difficulté
difficultyBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		difficultyBtns.forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		currentDifficulty = btn.dataset.difficulty;
	});
});

// Démarrer le quiz
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', () => {
	resultsScreen.style.display = 'none';
	startScreen.style.display = 'block';
});

function startQuiz() {
	// Charger les questions selon la difficulté
	let allQuestions = [...questionsDatabase.facile];
	if (currentDifficulty === 'moyen') {
		allQuestions = [...questionsDatabase.facile, ...questionsDatabase.moyen];
	} else if (currentDifficulty === 'difficile') {
		allQuestions = [...questionsDatabase.facile, ...questionsDatabase.moyen, ...questionsDatabase.difficile];
	}

	// Mélanger et sélectionner le bon nombre de questions
	currentQuestions = shuffleArray(allQuestions).slice(0, getQuestionCount());

	currentQuestionIndex = 0;
	score = 0;

	startScreen.style.display = 'none';
	quizScreen.style.display = 'block';

	displayQuestion();
}

function getQuestionCount() {
	if (currentDifficulty === 'facile') return 10;
	if (currentDifficulty === 'moyen') return 15;
	return 20;
}

function shuffleArray(array) {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

function displayQuestion() {
	answered = false;
	const question = currentQuestions[currentQuestionIndex];

	questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;
	questionText.textContent = question.question;

	// Mise à jour de la barre de progression
	const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
	progressFill.style.width = progress + '%';

	// Réinitialiser le feedback
	feedback.classList.remove('show', 'correct', 'incorrect');
	nextBtn.classList.remove('show');

	// Afficher les réponses
	answersGrid.innerHTML = '';
	question.answers.forEach((answer, index) => {
		const btn = document.createElement('button');
		btn.className = 'answer-btn';
		btn.textContent = answer;
		btn.addEventListener('click', () => checkAnswer(index));
		answersGrid.appendChild(btn);
	});
}

function checkAnswer(selectedIndex) {
	if (answered) return;

	answered = true;
	const question = currentQuestions[currentQuestionIndex];
	const answerBtns = document.querySelectorAll('.answer-btn');

	// Désactiver tous les boutons
	answerBtns.forEach(btn => btn.classList.add('disabled'));

	// Marquer la réponse correcte et incorrecte
	if (selectedIndex === question.correct) {
		answerBtns[selectedIndex].classList.add('correct');
		score++;
		feedback.classList.add('show', 'correct');
		feedbackTitle.textContent = '✅ Correct !';
	} else {
		answerBtns[selectedIndex].classList.add('incorrect');
		answerBtns[question.correct].classList.add('correct');
		feedback.classList.add('show', 'incorrect');
		feedbackTitle.textContent = '❌ Incorrect';
	}

	feedbackText.textContent = question.explanation;
	nextBtn.classList.add('show');
}

nextBtn.addEventListener('click', () => {
	currentQuestionIndex++;

	if (currentQuestionIndex < currentQuestions.length) {
		displayQuestion();
	} else {
		showResults();
	}
});

function showResults() {
	quizScreen.style.display = 'none';
	resultsScreen.style.display = 'block';

	const percentage = Math.round((score / currentQuestions.length) * 100);
	const correctCount = score;
	const incorrectCount = currentQuestions.length - score;

	document.getElementById('score-value').textContent = `${score}/${currentQuestions.length}`;
	document.getElementById('correct-count').textContent = correctCount;
	document.getElementById('incorrect-count').textContent = incorrectCount;
	document.getElementById('percentage').textContent = percentage + '%';

	// Message et emoji selon le score
	let message = '';
	let emoji = '';

	if (percentage >= 90) {
		emoji = '🏆';
		message = 'Excellent ! Vous maîtrisez parfaitement les règles des échecs !';
	} else if (percentage >= 70) {
		emoji = '🎉';
		message = 'Très bien ! Vous avez de bonnes connaissances des échecs.';
	} else if (percentage >= 50) {
		emoji = '👍';
		message = 'Pas mal ! Continuez à vous entraîner pour progresser.';
	} else {
		emoji = '📚';
		message = 'Continuez à apprendre ! Consultez nos sections pour réviser.';
	}

	document.getElementById('score-emoji').textContent = emoji;
	document.getElementById('score-message').textContent = message;
};