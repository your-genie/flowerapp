// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyB-4IPMsKm9LLZrGQ_F1pV6S-hJHuLcBzQ",
    authDomain: "best-valentine.firebaseapp.com",
    projectId: "best-valentine",
    storageBucket: "best-valentine.firebasestorage.app",
    messagingSenderId: "1023184382166",
    appId: "1:1023184382166:web:b0861552b711669bcec177",
    measurementId: "G-VTSZ6WF6V6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- UI VARIABLES ---
const steps = document.querySelectorAll('.step');
const progressBar = document.getElementById('progress-bar');
const form = document.getElementById('wishForm');
let currentStep = 0;

// --- NAVIGATION LOGIC ---
function updateProgress() {
    const percent = ((currentStep) / (steps.length - 1)) * 100;
    progressBar.style.width = percent + "%";
}

function showStep(stepIndex) {
    steps.forEach((step, index) => {
        step.classList.remove('active-step');
        if (index === stepIndex) {
            step.classList.add('active-step');
        }
    });
    updateProgress();
}

function nextStep() {
    // Optional: Validation - Check if input in current step is filled
    // const currentInputs = steps[currentStep].querySelectorAll('input, select, textarea');
    // for(let input of currentInputs) {
    //     if(input.hasAttribute('required') && !input.value) {
    //         alert("Please answer to continue...");
    //         return;
    //     }
    // }

    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

// --- PARTNER NAME TOGGLE ---
function togglePartnerInput() {
    const loveSelect = document.getElementById('love');
    const partnerContainer = document.getElementById('partner-container');
    
    if (loveSelect.value === 'Yes') {
        partnerContainer.style.display = 'block';
        // Add a small animation
        partnerContainer.style.animation = "fadeIn 0.5s";
    } else {
        partnerContainer.style.display = 'none';
        document.getElementById('partner_name').value = ""; // Clear if they change mind
    }
}

// --- FORM SUBMISSION ---
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Show Loading
    document.querySelector('.progress-container').style.display = 'none';
    form.style.display = 'none';
    const loadingBox = document.getElementById('loading-box');
    loadingBox.classList.remove('hidden');

    // Gather Data
    const answers = {
        name: document.getElementById('name').value,
        food: document.getElementById('food').value,
        color: document.getElementById('color').value,
        familyMember: document.getElementById('family').value,
        lovesSomeone: document.getElementById('love').value,
        partnerName: document.getElementById('partner_name').value,
        bfTrait: document.getElementById('bf_trait').value,
        dream: document.getElementById('dream').value,
        kidsCount: document.getElementById('kids').value,
        comfortSource: document.getElementById('comfort').value,
        hiddenEmotion: document.getElementById('hidden_emotion').value,
        priority: document.getElementById('priority').value,
        unsaidNeed: document.getElementById('unsaid_need').value,
        silenceMeaning: document.getElementById('silence').value,
        
        // NEW PSYCHOLOGICAL ANSWERS (Deep Dive)
        innerChildNeed: document.getElementById('inner_child').value,
        fightStyle: document.querySelector('input[name="fight_style"]:checked') ? document.querySelector('input[name="fight_style"]:checked').value : 'Unknown',
        triggerPoint: document.getElementById('trigger_point').value,
        neededWords: document.getElementById('needed_words').value,
        
        safePlace: document.getElementById('safe_place').value,
        timestamp: new Date()
    };

    // Simulate magic delay (1.5 seconds) then save
    setTimeout(() => {
        db.collection("girlfriends_wishes").add(answers)
            .then(() => {
                loadingBox.classList.add('hidden');
                showFlowerResult(answers);
            })
            .catch((error) => {
                console.error("Error:", error);
                loadingBox.classList.add('hidden');
                showFlowerResult(answers); // Show result anyway
            });
    }, 1500);
});

// --- FLOWER LOGIC ---
function showFlowerResult(data) {
    const resultBox = document.getElementById('result-box');
    resultBox.classList.remove('hidden');

    let flowerName = "Wildflower";
    let emoji = "🌼";
    let desc = "You are free-spirited and full of surprises.";

    // Logic:
    if (data.priority === "Trust" || data.priority === "Care") {
        flowerName = "Red Rose";
        emoji = "🌹";
        desc = "You are emotional, loving, and you value deep connections above all else.";
    } else if (data.hiddenEmotion === "Stress" || (data.comfortSource && data.comfortSource.toLowerCase().includes("silence"))) {
        flowerName = "Lotus";
        emoji = "🪷";
        desc = "You are calm, patient, and possess a beautiful inner strength that blooms even in mud.";
    } else if (data.hiddenEmotion === "Loneliness" || data.hiddenEmotion === "Sadness") {
        flowerName = "Jasmine";
        emoji = "🌼";
        desc = "You are soft-spoken, sensitive, and fiercely loyal to those you love.";
    } else {
        flowerName = "Sunflower";
        emoji = "🌻";
        desc = "You are positive, caring, and you always look toward the light.";
    }

    const displayName = data.name ? `, ${data.name}` : "";
    document.getElementById('flower-name').innerText = `You are a ${flowerName}${displayName}!`;
    document.getElementById('flower-emoji').innerText = emoji;
    document.getElementById('flower-description').innerText = desc;
}