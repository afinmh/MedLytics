// script.js
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Menggunakan kata kunci untuk menentukan spesialis
const specialistResponses = {
    "telinga": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis THT.",
        "Kayaknya kamu harus ke Spesialis THT deh.",
        "Spesialis THT pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis THT biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis THT deh."
    ],
    "hidung": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis THT.",
        "Kayaknya kamu harus ke Spesialis THT deh.",
        "Spesialis THT pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis THT biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis THT deh."
    ],
    "tht": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis THT.",
        "Kayaknya kamu harus ke Spesialis THT deh.",
        "Spesialis THT pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis THT biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis THT deh."
    ],
    "jantung": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Jantung.",
        "Kayaknya kamu harus ke Spesialis Jantung deh.",
        "Spesialis Jantung pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Jantung biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Jantung deh."
    ],
    "paru": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Paru.",
        "Kayaknya kamu harus ke Spesialis Paru deh.",
        "Spesialis Paru pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Paru biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Paru deh."
    ],
    "batuk": [
        "Hmmm, sepertinya kamu harus konsultasi ke Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "batuk kering": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Paru.",
        "Kayaknya kamu harus ke Spesialis Paru deh.",
        "Spesialis Paru pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Paru biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Paru deh."
    ],
    "batuk parah": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Paru.",
        "Kayaknya kamu harus ke Spesialis Paru deh.",
        "Spesialis Paru pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Paru biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Paru deh."
    ],
    "batuk berdarah": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Paru.",
        "Kayaknya kamu harus ke Spesialis Paru deh.",
        "Spesialis Paru pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Paru biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Paru deh."
    ],
    "gemuk": [
        "Hmmm, sepertinya kamu perlu berkonsultasi dengan Spesialis Gizi.",
        "Kayaknya kamu harus ke Spesialis Gizi deh.",
        "Spesialis Gizi pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Gizi biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Gizi deh."
    ],
    "kurus": [
        "Hmmm, sepertinya kamu perlu berkonsultasi dengan Spesialis Gizi.",
        "Kayaknya kamu harus ke Spesialis Gizi deh.",
        "Spesialis Gizi pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Gizi biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Gizi deh."
    ],
    "diet": [
        "Hmmm, sepertinya kamu perlu berkonsultasi dengan Spesialis Gizi.",
        "Kayaknya kamu harus ke Spesialis Gizi deh.",
        "Spesialis Gizi pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Gizi biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Gizi deh."
    ],
    "gigi": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Gigi.",
        "Kayaknya kamu harus ke Spesialis Gigi deh.",
        "Spesialis Gigi pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Gigi biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Gigi deh."
    ],
    "kulit": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Kulit.",
        "Kayaknya kamu harus ke Spesialis Kulit deh.",
        "Spesialis Kulit pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Kulit biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Kulit deh."
    ],
    "gizi": [
        "Hmmm, sepertinya kamu perlu berkonsultasi dengan Spesialis Gizi.",
        "Kayaknya kamu harus ke Spesialis Gizi deh.",
        "Spesialis Gizi pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Gizi biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Gizi deh."
    ],
    "anak": [
        "Hmmm, sepertinya kamu harus konsultasi ke Dokter Anak.",
        "Kayaknya kamu harus ke Dokter Anak deh.",
        "Dokter Anak pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Anak biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Anak deh."
    ],
    "demam": [
        "Hmmm, sepertinya kamu perlu berkonsultasi dengan Dokter Anak atau Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum atau Dokter Anak pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "pusing": [
        "Hmmm, sepertinya kamu perlu berkonsultasi dengan Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "sakit kepala": [
        "Hmmm, sepertinya kamu harus konsultasi ke Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "perut": [
        "Hmmm, sepertinya kamu harus konsultasi ke Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "mual": [
        "Hmmm, sepertinya kamu harus konsultasi ke Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "dada": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Jantung.",
        "Kayaknya kamu harus ke Spesialis Jantung deh.",
        "Spesialis Jantung pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Jantung biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Jantung deh."
    ],
    "ruam": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Kulit.",
        "Kayaknya kamu harus ke Spesialis Kulit deh.",
        "Spesialis Kulit pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Kulit biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Kulit deh."
    ],
    "jerawat": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Kulit.",
        "Kayaknya kamu harus ke Spesialis Kulit deh.",
        "Spesialis Kulit pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Kulit biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Kulit deh."
    ],
    "tenggorokan": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis THT.",
        "Kayaknya kamu harus ke Spesialis THT deh.",
        "Spesialis THT pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis THT biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis THT deh."
    ],
    "sesak napas": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Paru.",
        "Kayaknya kamu harus ke Spesialis Paru deh.",
        "Spesialis Paru pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Paru biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Paru deh."
    ],
    "gatal": [
        "Hmmm, sepertinya kamu harus konsultasi ke Spesialis Kulit.",
        "Kayaknya kamu harus ke Spesialis Kulit deh.",
        "Spesialis Kulit pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Kulit biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Kulit deh."
    ],
    "sakit perut": [
        "Hmmm, sepertinya kamu harus konsultasi ke Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "nyeri sendi": [
        "Hmmm, sepertinya kamu harus konsultasi ke Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "kelelahan": [
        "Hmmm, sepertinya kamu harus konsultasi ke Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "nyeri": [
        "Hmmm, sepertinya kamu harus konsultasi ke Dokter Umum.",
        "Kayaknya kamu harus ke Dokter Umum deh.",
        "Dokter Umum pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Dokter Umum biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Dokter Umum deh."
    ],
    "berat badan": [
        "Hmmm, sepertinya kamu perlu berkonsultasi dengan Spesialis Gizi.",
        "Kayaknya kamu harus ke Spesialis Gizi deh.",
        "Spesialis Gizi pasti bisa bantu kamu.",
        "Kamu harus ngobrol sama Spesialis Gizi biar cepet sembuh.",
        "Kalo sakit itu sebaiknya kamu cek ke Spesialis Gizi deh."
    ],
};

// Fungsi untuk menambahkan pesan ke chat
function addMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${type}-message`;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll ke bawah
}

// Fungsi untuk mendapatkan respons
function getResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    let response = "Maaf, bisa deskripsikan sedikit lebih rinci?";

    // Mencari kata kunci dalam input
    for (const keyword in specialistResponses) {
        if (lowerMessage.includes(keyword)) {
            // Respons spesifik untuk kata 'batuk'
            if (keyword === "batuk") {
                // Cek untuk kondisi lebih lanjut
                if (lowerMessage.includes("kering") || lowerMessage.includes("parah") || lowerMessage.includes("berdarah")) {
                    const responses = specialistResponses["batuk kering"]; // Rujuk ke spesialis paru
                    response = responses[Math.floor(Math.random() * responses.length)];
                    break;
                }
            }
            // Mengambil respons acak dari spesialis yang sesuai
            const responses = specialistResponses[keyword];
            response = responses[Math.floor(Math.random() * responses.length)];
            break;
        }
    }

    return response;
}

function initialBotMessage() {
    const initialMessage = "Apa yang kamu rasain?";
    addMessage(initialMessage, 'bot');
}

// Event listener untuk tombol kirim
sendBtn.addEventListener('click', () => {
    const userMessage = userInput.value;
    if (userMessage.trim()) {
        addMessage(userMessage, 'user');
        const response = getResponse(userMessage);
        addMessage(response, 'bot');
        userInput.value = ''; // Reset input
    }
});

// Event listener untuk enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

window.onload = () => {
    initialBotMessage();
};
