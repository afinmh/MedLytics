// Dapatkan elemen DOM
const chatPopup = document.getElementById('chatPopup');
const chatHeader = document.getElementById('chatHeader');
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatCollapseBtn = document.getElementById('chatCollapseBtn');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatBody = document.getElementById('chatBody');

// Penyimpanan kredensial API
const apiKeyStorageKey = 'mistralApiKey';

// Prompt sistem default untuk asisten listrik
const defaultSystemPrompt = `Kamu adalah Asisten AI yang berdedikasi untuk membantu pengguna belajar membaca Al-Quran dengan benar, dengan fokus utama pada ilmu Tajwid.
Peranmu adalah menjadi guru Tajwid virtual yang sabar, informatif, dan memotivasi.
Kamu akan:
1. Menjelaskan berbagai hukum Tajwid (misalnya, Idgham, Ikhfa, Iqlab, Mad, hukum Nun Sukun dan Tanwin, hukum Mim Sukun, dll.) dengan bahasa yang mudah dipahami, bahkan untuk pemula.
2. Memberikan contoh-contoh penerapan hukum Tajwid dari ayat-ayat Al-Quran.
3. Menjawab pertanyaan spesifik pengguna mengenai kesulitan atau keraguan mereka dalam menerapkan Tajwid saat membaca Al-Quran.
4. Memberikan tips dan trik untuk mengingat dan mempraktikkan hukum-hukum Tajwid.
5. Membantu pengguna mengidentifikasi hukum Tajwid dalam potongan ayat yang mereka berikan (jika memungkinkan secara teknis).
6. Memberikan umpan balik yang konstruktif dan dorongan semangat kepada pengguna dalam perjalanan belajar mereka.
7. Menyediakan referensi atau sumber belajar tambahan jika diperlukan.

Bersikaplah ramah, sabar, jelas dalam penjelasan, akurat dalam menyampaikan informasi Tajwid, dan selalu mendorong pengguna untuk terus belajar dan memperbaiki bacaan Al-Quran mereka.
Dasarkan tanggapanmu pada kaidah-kaidah ilmu Tajwid yang diakui dan bersumber dari referensi yang terpercaya.
Hindari memberikan interpretasi atau tafsir ayat di luar konteks pembahasan Tajwid, kecuali jika sangat relevan untuk menjelaskan hukum bacaan.`;

// Periksa apakah kunci API diatur
const hasApiKey = Boolean(localStorage.getItem(apiKeyStorageKey));

// Tambahkan tombol pengaturan ke header chat
const chatControls = document.querySelector('.chat-controls');
const settingsBtn = document.createElement('button');
settingsBtn.id = 'chatSettingsBtn';
settingsBtn.className = 'chat-control-btn';
settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
settingsBtn.title = 'Pengaturan API';
chatControls.insertBefore(settingsBtn, chatControls.firstChild);

// Event klik tombol pengaturan
settingsBtn.addEventListener('click', showApiSettings);

// Periksa penyimpanan lokal untuk status visibilitas chat
const isChatVisible = localStorage.getItem('chatVisible') === 'true';
const isChatCollapsed = localStorage.getItem('chatCollapsed') === 'true';

// Atur visibilitas awal berdasarkan status tersimpan
if (isChatVisible) {
    chatPopup.style.display = 'flex';
    chatToggleBtn.classList.add('hidden');
    
    if (isChatCollapsed) {
        chatPopup.classList.add('collapsed');
    }
} else {
    chatPopup.style.display = 'none';
    chatToggleBtn.classList.remove('hidden');
}

// Beralih popup chat saat tombol alih diklik
chatToggleBtn.addEventListener('click', () => {
    chatPopup.style.display = 'flex';
    chatToggleBtn.classList.add('hidden');
    localStorage.setItem('chatVisible', 'true');
    
    // Muat pesan chat dari localStorage
    loadChatMessages();
    
    // Periksa apakah kunci API diatur
    if (!hasApiKey) {
        setTimeout(showApiSettings, 1000);
    }
});

// Tutup popup chat
chatCloseBtn.addEventListener('click', () => {
    chatPopup.style.display = 'none';
    chatToggleBtn.classList.remove('hidden');
    localStorage.setItem('chatVisible', 'false');
});

// Fungsi untuk menangani collapse/expand
function toggleCollapse(isCollapsed) {
    chatPopup.classList.toggle('collapsed', isCollapsed);
    chatCollapseBtn.innerHTML = isCollapsed ? 
        '<i class="fas fa-chevron-up"></i>' : 
        '<i class="fas fa-chevron-down"></i>';
    localStorage.setItem('chatCollapsed', isCollapsed.toString());
}

// Ciutkan/perluas popup chat
chatCollapseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah event bubbling ke header
    const isCollapsed = !chatPopup.classList.contains('collapsed');
    toggleCollapse(isCollapsed);
});

// Beralih popup chat saat header diklik
chatHeader.addEventListener('click', (e) => {
    // Cegah beralih saat mengklik tombol kontrol
    if (!e.target.closest('.chat-controls')) {
        const isCollapsed = !chatPopup.classList.contains('collapsed');
        toggleCollapse(isCollapsed);
    }
});

// Kirim pesan saat mengklik tombol kirim
chatSendBtn.addEventListener('click', sendMessage);

// Kirim pesan saat menekan Enter di bidang input
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Tampilkan modal pengaturan API
function showApiSettings() {
    let apiModal = document.getElementById('apiSettingsModal');
    
    if (!apiModal) {
        apiModal = document.createElement('div');
        apiModal.id = 'apiSettingsModal';
        apiModal.className = 'modal';
        
        const currentApiKey = localStorage.getItem(apiKeyStorageKey) || '';
        
        apiModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Pengaturan API</h2>
                    <span class="close-modal" id="closeApiModal">&times;</span>
                </div>
                <form id="apiSettingsForm">
                    <div class="form-group">
                        <label for="apiKey">Kunci API Mistral</label>
                        <input type="password" id="apiKey" value="${currentApiKey}" required>
                        <small>Dapatkan kunci API Anda dari <a href="https://mistral.ai" target="_blank">Mistral AI</a></small>
                    </div>
                    <div class="form-actions">
                        <div class="action-buttons">
                            <button type="button" class="delete-btn" id="clearHistoryBtn">
                                <i class="fas fa-trash"></i> Clear Chat
                            </button>
                            <button type="button" class="delete-btn" id="clearApiBtn">
                                <i class="fas fa-key"></i> Clear API
                            </button>
                        </div>
                        <div class="save-buttons">
                            <button type="button" class="cancel-btn" id="cancelApiSettings">Batal</button>
                            <button type="submit" class="save-btn">Simpan</button>
                        </div>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(apiModal);
        
        // Event listener untuk tombol hapus riwayat
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            Swal.fire({
                title: 'Hapus semua riwayat chat?',
                text: "Tindakan ini tidak dapat dibatalkan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('chatMessages');
                    chatBody.innerHTML = '';
                    addWelcomeMessage();
                    document.getElementById('apiSettingsModal').classList.remove('show');
                    Swal.fire('Terhapus!', 'Riwayat chat telah dihapus.', 'success');
                }
            });
        });

        // Event listener untuk tombol hapus API
        document.getElementById('clearApiBtn').addEventListener('click', () => {
            Swal.fire({
                title: 'Hapus kunci API?',
                text: "Anda harus memasukkan ulang kunci API untuk menggunakan AI.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem(apiKeyStorageKey);
                    document.getElementById('apiKey').value = '';
                    addSystemMessage('⚠️ Kunci API telah dihapus');
                    document.getElementById('apiSettingsModal').classList.remove('show');
                    Swal.fire('Terhapus!', 'Kunci API telah dihapus.', 'success');
                }
            });
        });

        document.getElementById('closeApiModal').addEventListener('click', () => {
            apiModal.classList.remove('show');
        });
        
        document.getElementById('cancelApiSettings').addEventListener('click', () => {
            apiModal.classList.remove('show');
        });
        
        document.getElementById('apiSettingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const apiKey = document.getElementById('apiKey').value.trim();
            
            if (apiKey) {
                localStorage.setItem(apiKeyStorageKey, apiKey);
                addSystemMessage("Kunci API disimpan. Anda sekarang dapat mengobrol dengan Habibi!");
            } else {
                localStorage.removeItem(apiKeyStorageKey);
            }
            
            apiModal.classList.remove('show');
        });
    }
    
    // Tampilkan modal
    apiModal.classList.add('show');
}

// Fungsi untuk menambahkan pesan sistem (gaya berbeda)
function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message system';
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    
    // Gulir ke bawah
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Muat pesan chat dari localStorage
function loadChatMessages() {
    // Hapus pesan yang ada terlebih dahulu
    chatBody.innerHTML = '';
    
    // Dapatkan pesan dari localStorage
    const storedMessages = localStorage.getItem('chatMessages');
    let messages = [];
    
    if (storedMessages) {
        messages = JSON.parse(storedMessages);
        
        // Render pesan
        messages.forEach(message => {
            addMessageToUI(message.text, message.sender);
        });
    } else {
        // Tambahkan pesan selamat datang jika tidak ada pesan
        addWelcomeMessage();
    }
}

// Fungsi untuk menambahkan pesan selamat datang
function addWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
        <p>Bismillah, Assalamualaikum...</p>
    `;
    chatBody.appendChild(welcomeDiv);
    
    // Tambahkan pesan AI awal kok error
    setTimeout(() => {
        addMessage('Ada pertanyaan seputar Tajwid Al-Quran? Saya siap membantu!', 'ai');
        
        // Jika tidak ada kunci API yang diatur, beri tahu pengguna
        if (!localStorage.getItem(apiKeyStorageKey)) {
            setTimeout(() => {
                addSystemMessage('⚠️ Silakan atur kunci API Mistral di pengaturan untuk mengaktifkan respons AI');
            }, 1000);
        }
    }, 1000);
}

// Fungsi untuk menambahkan pesan ke localStorage dan UI
function addMessage(text, sender) {
    // Simpan pesan ke localStorage
    saveMessageToStorage(text, sender);
    
    // Tambahkan ke UI
    addMessageToUI(text, sender);
}

function saveMessageToStorage(text, sender) {
    const storedMessages = localStorage.getItem('chatMessages');
    let messages = [];
    
    if (storedMessages) {
        messages = JSON.parse(storedMessages);
    }
    messages.push({
        text: text,
        sender: sender,
        timestamp: new Date().toISOString()
    });
    
    // Simpan kembali ke localStorage
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// Fungsi untuk menambahkan pesan ke UI saja
function addMessageToUI(text, sender) {
    // Hapus pesan selamat datang jika ada
    const welcomeMessage = chatBody.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    
    // Gulir ke bawah
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Fungsi untuk menambahkan indikator loading saat menunggu respons AI
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message ai loading';
    loadingDiv.id = 'aiLoading';
    loadingDiv.textContent = 'Baca Kitab...';
    chatBody.appendChild(loadingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Animasi titik-titik
    let dots = 0;
    const loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingDiv.textContent = 'Baca Kitab' + '.'.repeat(dots);
    }, 500);
    
    return {
        remove: () => {
            clearInterval(loadingInterval);
            loadingDiv.remove();
        }
    };
}

// Dapatkan riwayat chat untuk konteks API Mistral
function getChatHistory() {
    const storedMessages = localStorage.getItem('chatMessages');
    let messages = [];
    
    if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        
        // Konversi ke format Mistral (lewati pesan sistem)
        messages = parsedMessages
            .filter(msg => msg.sender !== 'system')
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            }));
    }
    
    return messages;
}

// Tambahkan fungsi utilitas NLP setelah deklarasi variabel
const nlpUtils = {
    // Daftar stopwords bahasa Indonesia
    stopwords: ['yang', 'di', 'ke', 'dari', 'pada', 'dalam', 'untuk', 'dengan', 'dan', 'atau', 
        'ini', 'itu', 'juga', 'sudah', 'saya', 'aku', 'kamu', 'dia', 'mereka', 'kita', 'akan', 
        'bisa', 'ada', 'tidak', 'saat', 'oleh', 'setelah', 'tentang', 'seperti', 'ketika',
        'bagi', 'sampai', 'karena', 'jika', 'namun', 'sehingga', 'yaitu', 'yakni', 'daripada',
        'adalah', 'dapat', 'apakah', 'bagaimana', 'dimana', 'kapan', 'mengapa', 'saja', 'mana'],

    // Aturan stemming sederhana (contoh pola imbuhan)
    stemRules: [
        // Specific word patterns first
        { regex: /^membantu$/, result: 'bantu', pattern: 'bantu' },        // membantu -> bantu
        { regex: /^memahami$/, result: 'paham', pattern: 'paham' },        // memahami -> paham
        { regex: /^materinya$/, result: 'materi', pattern: 'materi' },      // materinya -> materi
        { regex: /^terstruktur$/, result: 'struktur', pattern: 'struktur' },  // terstruktur -> struktur 
        { regex: /^dipahami$/, result: 'paham', pattern: 'paham' },        // dipahami -> paham
        { regex: /^menyenangkan$/, result: 'senang', pattern: 'senang' }, 
        { regex: /^perkembangan$/, result: 'kembang', pattern: 'kembang' },     // hurufia -> huruf

        // General patterns for other words
        { regex: /^me(\w+)/, result: '$1', pattern: '$1' },             // prefix me-
        { regex: /^di(\w+)/, result: '$1', pattern: '$1' },             // prefix di-
        { regex: /^ter(\w+)/, result: '$1', pattern: '$1' },            // prefix ter-
        { regex: /^ber(\w+)/, result: '$1', pattern: '$1' },            // prefix ber-
        { regex: /(\w+)kan$/, result: '$1', pattern: '$1' },            // suffix -kan
        { regex: /(\w+)i$/, result: '$1', pattern: '$1' },              // suffix -i
        { regex: /(\w+)nya$/, result: '$1', pattern: '$1' },            // suffix -nya
    ],

    // 1. Lowercasing
    lowercase: (text) => {
        return text.toLowerCase();
    },

    // 2. Tokenisasi
    tokenize: (text) => {
        return text.split(/\s+/)
            .map(token => token.replace(/[^\w\s']/g, ''))
            .filter(token => token.length > 0);
    },

    // 3. Stopword Removal
    removeStopwords: (tokens) => {
        return tokens.filter(token => !nlpUtils.stopwords.includes(token));
    },

    // 4. Stemming
    stem: (word) => {
        let stemmed = word;
        for (const rule of nlpUtils.stemRules) {
            if (rule.regex.test(stemmed)) {
                stemmed = stemmed.replace(rule.regex, rule.pattern);
                break;
            }
        }
        return stemmed;
    },

    // 5. Analisis Sentimen
    analyzeSentiment: (tokens) => {
        const sentimentDict = {
            positive: ['bagus', 'baik', 'senang', 'suka', 'cinta', 'indah', 'hebat', 'mantap', 
                'berhasil', 'sukses', 'mudah', 'membantu', 'bermanfaat', 'terima', 'kasih','bantu'],
            negative: ['buruk', 'jelek', 'susah', 'sulit', 'gagal', 'benci', 'marah', 'kecewa', 
                'sedih', 'rumit', 'bingung', 'takut', 'khawatir', 'lambat']
        };

        let score = 0;
        tokens.forEach(token => {
            if (sentimentDict.positive.includes(token)) score++;
            if (sentimentDict.negative.includes(token)) score--;
        });

        if (score > 0) return { sentiment: 'Positif', score };
        if (score < 0) return { sentiment: 'Negatif', score };
        return { sentiment: 'Netral', score: 0 };
    },

    // Proses NLP lengkap
    processText: (text) => {
        // 1. Lowercase
        const lowercased = nlpUtils.lowercase(text);
        
        // 2. Tokenisasi
        const tokens = nlpUtils.tokenize(lowercased);
        
        // 3. Stopword Removal
        const withoutStopwords = nlpUtils.removeStopwords(tokens);
        
        // 4. Stemming
        const stemmed = withoutStopwords.map(token => nlpUtils.stem(token));
        
        // 5. Analisis Sentimen
        const sentiment = nlpUtils.analyzeSentiment(stemmed);

        return {
            original: text,
            tokens: tokens,
            withoutStopwords: withoutStopwords,
            stemmed: stemmed,
            sentiment: sentiment
        };
    }
};

// Modifikasi fungsi callMistralAPI
async function callMistralAPI(userMessage) {
    const apiKey = localStorage.getItem(apiKeyStorageKey);
    
    if (!apiKey) {
        // Hanya lakukan analisis NLP ketika API tidak tersedia
        const nlpResult = nlpUtils.processText(userMessage);

        // Format hasil analisis
        const analysis = [
            "🔍 Analisis NLP:",
            "───────────────────",
            `📝 Teks Asli: "${nlpResult.original}"`,
            "───────────────────",
            "🔤 Hasil Tokenisasi:",
            nlpResult.tokens.join(", "),
            "───────────────────",
            "🚫 Setelah Stopwords Removal:",
            nlpResult.withoutStopwords.join(", "),
            "───────────────────",
            "🌱 Hasil Stemming:",
            nlpResult.stemmed.join(", "),
            "───────────────────",
            `😊 Analisis Sentimen: ${nlpResult.sentiment.sentiment} (score: ${nlpResult.sentiment.score})`,
            "───────────────────",
            "\nUntuk mendapatkan respons AI yang lebih baik, silakan atur kunci API di pengaturan."
        ].join("\n");

        return analysis;
    }

    // Jika ada API key, langsung gunakan Mistral API tanpa analisis sentimen
    try {
        const messages = getChatHistory();
        
        const requestBody = {
            model: "mistral-small",
            messages: [
                { role: "system", content: defaultSystemPrompt },
                ...messages,
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 800
        };
        
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Kesalahan API Mistral:', errorData);
            return `Kesalahan: ${errorData.error?.message || 'Gagal mendapatkan respons dari Mistral AI'}`;
        }
        
        const data = await response.json();
        // Langsung return content tanpa analisis sentimen
        return data.choices[0].message.content.trim();
        
    } catch (error) {
        console.error('Kesalahan memanggil API Mistral:', error);
        return "Maaf, terjadi kesalahan saat menghubungkan ke layanan AI. Silakan coba lagi nanti.";
    }
}

// Modifikasi fungsi sendMessage
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // Tambahkan pesan pengguna
        addMessage(message, 'user');
        
        // Bersihkan input
        chatInput.value = '';
        
        // Tampilkan indikator loading
        const loading = showLoadingIndicator();
        
        try {
            // Dapatkan respons
            const aiResponse = await callMistralAPI(message);
            
            // Hapus indikator loading
            loading.remove();
            
            // Tambahkan respons AI atau analisis NLP
            addMessage(aiResponse, 'ai');
            
        } catch (error) {
            console.error('Kesalahan mendapatkan respons:', error);
            loading.remove();
            addMessage("Maaf, saya mengalami kesalahan. Silakan coba lagi nanti.", 'ai');
        }
    }
}

// Jika chat terlihat dan tidak diciutkan, muat pesan
if (isChatVisible && !isChatCollapsed) {
    loadChatMessages();
}

// Atur status collapsed awal
if (isChatVisible && isChatCollapsed) {
    toggleCollapse(true);
}

// Tambahkan metode kenyamanan untuk menghapus riwayat chat
window.clearChatHistory = function() {
    localStorage.removeItem('chatMessages');
    chatBody.innerHTML = '';
    addWelcomeMessage();
    alert('Riwayat chat telah dihapus!');
};
