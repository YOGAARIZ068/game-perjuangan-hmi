// ==================== CONFIG & SOUND SYNTHESIZER ====================


// Variabel penampung status tombol layar sentuh
let touchState = { left: false, right: false, up: false, down: false };

let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSFX(type) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'type') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.02);
    } else if (type === 'levelup') {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
            osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
        });
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }
}

// DATA POS SCREENING LK 1 & LK 2
const GAME_DATA = {
    lk1: [
        { id: 1, title: "Pos 1: Sejarah HMI", screenerName: "Master Screener Sejarah", x: 480, y: 320, question: "Pada tanggal berapakah HMI resmi didirikan di Yogyakarta?", options: ["5 Februari 1947", "17 Agustus 1945", "10 November 1945", "28 Oktober 1928"], answer: 0 },
        { id: 2, title: "Pos 2: Konstitusi HMI", screenerName: "Master Screener Konstitusi", x: 1440, y: 320, question: "Apa bentuk/status organisasi HMI berdasarkan Pasal 3 AD HMI?", options: ["Organisasi Partai Politik", "Organisasi Mahasiswa", "Organisasi Kemasyarakatan", "Organisasi Kepemudaan"], answer: 1 },
        { id: 3, title: "Pos 3: NDP HMI", screenerName: "Master Screener NDP", x: 960, y: 820, question: "Siapakah perumus utama Nilai-Nilai Dasar Perjuangan (NDP) HMI?", options: ["Lafran Pane", "Dahlan Ranuwihardjo", "Nurcholish Madjid (Cak Nur)", "Ahmadi Thaha"], answer: 2 }
    ],
    lk2: [
        { id: 1, title: "Pos 1: Ideopolitorstratak", screenerName: "Master Screener Ideopolitor", x: 480, y: 320, question: "Apa fokus utama analisis materi Ideopolitorstratak dalam HMI?", options: ["Seni & Olahraga", "Strategi & Taktik Perjuangan Politik", "Manajemen Keuangan", "Desain Grafis"], answer: 1 },
        { id: 2, title: "Pos 2: KDM", screenerName: "Master Screener KDM", x: 1440, y: 320, question: "Kepanjangan dari KDM dalam materi perkaderan LK 2 adalah...", options: ["Karakter Dasar Mahasiswa", "Kepemimpinan, Manajemen & Organisasi", "Kaderisasi Daerah Mandiri", "Keterampilan Mengajar"], answer: 1 },
        { id: 3, title: "Pos 3: Pendalaman NDP", screenerName: "Master Screener Filsafat NDP", x: 960, y: 820, question: "Bab berapa dalam NDP yang membahas tentang 'Kemerdekaan Manusia & Takdir'?", options: ["Bab I", "Bab II", "Bab III", "Bab IV"], answer: 1 }
    ]
};

// DATA DIALOG STORY
const STORY_DIALOGUES = {
    intro: [
        { speaker: "Narator", portrait: "assets/player.png", text: "Langkah kaki berbunyi menyusuri koridor. Hari yang dipersiapkan sejak lama akhirnya tiba: Arena Screening Perkaderan HMI." },
        { speaker: "Kader HMI", portrait: "assets/player.png", text: "Darahku berdesir... Ini pertaruhan mental, pemahaman sejarah, dan keteguhan ideologi untuk membuktikan diriku sebagai Insan Akademis!" },
        { speaker: "Ayanda Lafran Pane", portrait: "assets/screener_sejarah.png", text: "Ananda... HMI didirikan bukan hanya untuk melahirkan sarjana, melainkan kader pencipta dan pengabdi yang bernafaskan Islam." },
        { speaker: "Kader HMI", portrait: "assets/player.png", text: "Bismillah! Dengan keyakinan dan keikhlasan, perjalananku dimulai sekarang!" }
    ],
    forum_lk1: [
        { speaker: "Master of Training (MOT)", portrait: "assets/screener_konstitusi.png", text: "Selamat bagi yang lulus screening! Sekarang kita berada di Aula Forum LK 1 bersama seluruh peserta kader lainnya." },
        { speaker: "MOT", portrait: "assets/screener_konstitusi.png", text: "Di forum ini, pemikiran awal kalian diuji: Mengapa HMI harus mempertahankan sifat organisasinya yang 'Independen'?" },
        { speaker: "Kader Peserta A", portrait: "assets/teman.png", text: "Saran saya, lebih baik independensi dilepas saja agar organisasi dapat dana besar dari parpol politik!" }
    ],
    transition_lk2: [
        { speaker: "MOT", portrait: "assets/screener_konstitusi.png", text: "Luar biasa! Argumenmu di Forum LK 1 sangat tepat. Kamu resmi dinyatakan LULUS LK 1!" },
        { speaker: "Kader HMI", portrait: "assets/player.png", text: "Terima kasih Kanda! Saya siap melangkah ke Arena Screening LK 2!" },
        { speaker: "Master Screener LK 2", portrait: "assets/screener_ndp.png", text: "Persiapkan dirimu. Arena Screening dan Forum LK 2 menyajikan materi kepemimpinan dan ideopolitor yang jauh lebih berat!" }
    ],
    forum_lk2: [
        { speaker: "MOT LK 2", portrait: "assets/screener_ndp.png", text: "PERHATIAN AULA FORUM LK 2! Kita memasuki sesi dinamika paling krusial: Analisis Ideopolitorstratak dan Dialektika NDP!" },
        { speaker: "Kader Peserta A (Modernis)", portrait: "assets/teman.png", text: "INTERUPSI MOT! Gagasan NDP itu sudah usang dan tidak relevan di era digital saat ini! Harus dirombak total!" },
        { speaker: "Kader Peserta B (Sakral)", portrait: "assets/screener_konstitusi.png", text: "TIDAK BISA! Siapa kamu berani mengubah NDP? Kamu tidak paham esensi nilai keislaman dan keindonesiaan!" },
        { speaker: "MOT LK 2", portrait: "assets/screener_ndp.png", text: "FORUM HARAP TENANG! Kepada Kader di tengah, bagaimana sikap dan solusimu atas benturan gagasan ini?!" },
        { speaker: "Kader HMI", portrait: "assets/player.png", text: "(Suasana forum memanas... Tatapan seluruh teman seperjuangan tertuju padaku. Ini saatnya aku mengambil sikap sebagai Insan Pencipta!)" }
    ],
    ending: [
        { speaker: "MOT LK 2", portrait: "assets/screener_ndp.png", text: "Dinamika yang luar biasa! Kamu mampu memecah kebuntuan forum dengan pemikiran yang solutif dan berdasar!" },
        { speaker: "Ayanda Lafran Pane", portrait: "assets/screener_sejarah.png", text: "Selamat Ananda. Kamu telah membuktikan dirimu sebagai Insan Akademis, Insan Pencipta, dan Insan Pengabdi." },
        { speaker: "Kader HMI", portrait: "assets/player.png", text: "Inilah bukti nyata perjuangan. Pengabdian sesungguhnya baru saja dimulai di tengah-tengah masyarakat!" },
        { speaker: "Narator", portrait: "assets/player.png", text: "YAKIN USAHA SAMPAI! Sang kader melangkah keluar arena perkaderan dengan membawa pencerahan bagi bangsa." }
    ]
};

// SOAL PILIHAN ARGUMEN FORUM
const FORUM_QUESTIONS = {
    lk1: {
        title: "Dinamika Forum LK 1",
        question: "Bagaimana tanggapanmu atas usulan agar HMI melepaskan independensinya demi dana politik?",
        options: [
            { text: "A. Setuju saja agar organisasi punya banyak uang.", correct: false },
            { text: "B. Independensi adalah watak hakiki HMI agar tetap kritis dan objektif membela kebenaran tanpa intervensi.", correct: true },
            { text: "C. Tidak peduli, ikut suara mayoritas forum.", correct: false }
        ]
    },
    lk2: {
        title: "Debat Panas Forum LK 2",
        question: "Bagaimana solusimu atas perdebatan antara pihak yang menganggap NDP usang dengan pihak yang sakral kaku?",
        options: [
            { text: "A. Menyalahkan kedua belah pihak dan keluar dari forum.", correct: false },
            { text: "B. Menerangkan bahwa NDP adalah nilai substansial universal, sedangkan metode penerapannya yang harus dimodernisasi secara kreatif.", correct: true },
            { text: "C. Mendukung perombakan total tanpa memikirkan akar nilai keislaman.", correct: false }
        ]
    }
};

const ARGUMENT_BATTLE_LK2 = {
    rounds: [
        {
            attacker: "Kader Peserta A (Modernis)",
            portrait: "assets/teman.png",
            attackText: "NDP itu sudah kuno! Harus dirombak total tanpa ampun, atau HMI akan ditinggalkan zaman!",
            responses: [
                { text: "Mari kita bedah dulu esensinya secara jernih, jangan tergesa menghakimi.", tension: -18 },
                { text: "Kamu salah besar! NDP itu harga mati, tidak boleh disentuh sedikit pun!", tension: 22 },
                { text: "Terserah forum saja, aku ikut suara terbanyak.", tension: 8 }
            ]
        },
        {
            attacker: "Kader Peserta B (Sakral)",
            portrait: "assets/screener_konstitusi.png",
            attackText: "Kalau begitu kamu ini tidak paham nilai keislaman dalam NDP! Berani sekali!",
            responses: [
                { text: "Nilai dasarnya tetap sakral, hanya metode dakwahnya yang perlu relevan dengan zaman.", tension: -18 },
                { text: "Kalian berdua sama-sama keras kepala, diam semua!", tension: 22 },
                { text: "Aku dengarkan dulu semua argumen sebelum bicara.", tension: 8 }
            ]
        }
    ]
};

let currentLevel = 'lk1';
let completedPosIds = new Set();
let currentActivePos = null;
let playerLives = 3;
let timerInterval = null;
let timeLeft = 30;
let hintTimeRemaining = null;
let phaserGame = null;
let activeScene = null;
let nearbyScreener = null;

let currentDialogueSequence = [];
let currentDialogueIndex = 0;
let isStoryActive = false;
let isForumMode = false;
let currentMapType = 'screening';
let isGameFinished = false;
let lastForumData = null;
let isBattleActive = false;
let isGordonActive = false;
let battleTension = 50;

// UI & MODAL VARIABLES
let quizModal, lafranModal, statusModal, storyOverlay;
let questionText, optionsContainer, screenerTitle, posBadge, lafranResponse;
let progressInfo, levelBadge, livesInfo, timerText, speakerName, dialogueText, portraitImg;
let storyCallbackOnComplete = null;

// ==================== PHASER SCENE ====================
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('playerCustom', 'assets/player.png');
        this.load.image('screener1', 'assets/screener_sejarah.png');
        this.load.image('screener2', 'assets/screener_konstitusi.png');
        this.load.image('screener3', 'assets/screener_ndp.png');
        this.load.image('temanCustom', 'assets/teman.png');

        this.load.on('loaderror', (file) => {
            console.warn(`[HMI Game] Gagal memuat asset: ${file.key} (${file.src}). Sprite fallback akan dipakai.`);
        });

        let g = this.make.graphics({x: 0, y: 0, add: false});
        g.fillStyle(0x008037);
        g.fillRect(0, 0, 32, 48);
        g.generateTexture('fallback_sprite', 32, 48);
    }

    create() {
        activeScene = this;
        this.screenerOverlapCollider = null;
        this.drawEnvironment();

        let playerKey = this.textures.exists('playerCustom') ? 'playerCustom' : 'fallback_sprite';
        this.player = this.physics.add.sprite(960, 580, playerKey);
        this.player.setScale(playerKey === 'playerCustom' ? 0.45 : 1.5);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(100);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.renderEntities();
        startStorySequence(STORY_DIALOGUES.intro);
    }

    drawEnvironment() {
        if (this.envGroup) this.envGroup.destroy(true);
        this.envGroup = this.add.group();

        if (currentMapType === 'screening') {
            let outer = this.add.rectangle(960, 540, 1920, 1080, 0x111827);
            let floor = this.add.rectangle(960, 560, 1840, 960, 0xb47944);
            this.envGroup.addMultiple([outer, floor]);

            for (let y = 100; y < 1020; y += 50) {
                this.envGroup.add(this.add.rectangle(960, y, 1840, 3, 0x8d5828, 0.4));
            }

            let carpet1 = this.add.rectangle(960, 580, 1150, 600, 0x004d21);
            let carpet2 = this.add.rectangle(960, 580, 1100, 560, 0x008037);
            let wall = this.add.rectangle(960, 75, 1840, 75, 0x1f2937);
            this.envGroup.addMultiple([carpet1, carpet2, wall]);

            let banner = this.add.rectangle(960, 65, 750, 60, 0x008037).setStrokeStyle(3, 0xffffff);
            let bannerTxt = this.add.text(960, 52, `RUANG SCREENING PERKADERAN HMI (${currentLevel.toUpperCase()})`, { font: "bold 22px Arial", fill: "#ffffff" }).setOrigin(0.5);
            let subTxt = this.add.text(960, 80, "Yakin Usaha Sampai - Yakusa", { font: "italic 16px Arial", fill: "#e8f5e9" }).setOrigin(0.5);
            this.envGroup.addMultiple([banner, bannerTxt, subTxt]);
        } else {
            let outer = this.add.rectangle(960, 540, 1920, 1080, 0x0f172a);
            let floor = this.add.rectangle(960, 560, 1840, 960, 0xe2e8f0);
            this.envGroup.addMultiple([outer, floor]);

            for (let x = 80; x < 1840; x += 120) {
                this.envGroup.add(this.add.rectangle(x, 560, 2, 960, 0xcbd5e1));
            }
            for (let y = 100; y < 1020; y += 120) {
                this.envGroup.add(this.add.rectangle(960, y, 1840, 2, 0xcbd5e1));
            }

            let stage = this.add.rectangle(960, 160, 1400, 180, 0x1e293b);
            let motDesk = this.add.rectangle(960, 190, 600, 70, 0x008037).setStrokeStyle(3, 0xffffff);
            let forumTitle = this.add.text(960, 185, `AULA UTAMA FORUM PERKADERAN ${currentLevel.toUpperCase()}`, { font: "bold 24px Arial", fill: "#ffffff" }).setOrigin(0.5);
            this.envGroup.addMultiple([stage, motDesk, forumTitle]);
        }
    }

    renderEntities() {
        if (this.screenersGroup) this.screenersGroup.destroy(true);
        if (this.npcGroup) this.npcGroup.destroy(true);
        if (this.screenerOverlapCollider) {
            this.screenerOverlapCollider.destroy();
            this.screenerOverlapCollider = null;
        }

        this.screenersGroup = this.physics.add.staticGroup();
        this.npcGroup = this.add.group();

        if (currentMapType === 'screening') {
            let currentPosList = GAME_DATA[currentLevel];
            currentPosList.forEach(pos => {
                this.add.rectangle(pos.x, pos.y + 25, 160, 65, 0x6e4726).setStrokeStyle(3, 0x4a2e16);
                let screenerKey = 'screener' + pos.id;

                let npc;
                if (this.textures.exists(screenerKey)) {
                    npc = this.screenersGroup.create(pos.x, pos.y - 20, screenerKey).setScale(0.8);
                } else {
                    npc = this.screenersGroup.create(pos.x, pos.y - 20, 'fallback_sprite').setScale(1.5);
                }

                npc.posData = pos;
                this.add.rectangle(pos.x, pos.y + 70, 50, 16, 0x008037);

                let isDone = completedPosIds.has(Number(pos.id));
                let statusText = isDone ? " [LULUS]" : "";
                let textColor = isDone ? "#15803d" : "#008037";
                let shortName = pos.screenerName.replace("Master Screener ", "Screener ");

                let nameTag = this.add.text(pos.x, pos.y - 110, `${shortName}${statusText}`, {
                    font: "bold 13px 'Segoe UI', Arial",
                    fill: textColor,
                    backgroundColor: "#ffffff",
                    padding: { x: 10, y: 5 }
                }).setOrigin(0.5);

                nameTag.setStroke('#008037', 1);
            });

            this.screenerOverlapCollider = this.physics.add.overlap(this.player, this.screenersGroup, this.handleOverlap, null, this);
        } else {
            let motSprite = this.textures.exists('screener2') ? 
                this.add.sprite(960, 130, 'screener2').setScale(0.8) : 
                this.add.sprite(960, 130, 'fallback_sprite').setScale(1.5);
            
            let motLabel = this.add.text(960, 75, "MASTER OF TRAINING (MOT)", { font: "bold 14px Arial", fill: "#ffffff", backgroundColor: "#008037", padding: {x:8, y:4} }).setOrigin(0.5);
            this.npcGroup.addMultiple([motSprite, motLabel]);

            let npcPositions = [
                {x: 400, y: 450}, {x: 600, y: 450}, {x: 800, y: 450}, {x: 1120, y: 450}, {x: 1320, y: 450}, {x: 1520, y: 450},
                {x: 400, y: 700}, {x: 600, y: 700}, {x: 800, y: 700}, {x: 1120, y: 700}, {x: 1320, y: 700}, {x: 1520, y: 700}
            ];

            npcPositions.forEach((p, idx) => {
                let desk = this.add.rectangle(p.x, p.y + 15, 110, 45, 0x64748b);
                let chair = this.add.rectangle(p.x, p.y - 15, 35, 12, 0x1e293b);

                let npcChar = this.textures.exists('temanCustom') ? 
                    this.add.sprite(p.x, p.y - 10, 'temanCustom').setScale(0.45) : 
                    this.add.sprite(p.x, p.y - 10, 'fallback_sprite').setScale(1.2);

                let tag = this.add.text(p.x, p.y - 60, `Kader #${idx+1}`, { font: "bold 11px Arial", fill: "#1e293b", backgroundColor: "#ffffff", padding: {x:4, y:2} }).setOrigin(0.5);
                this.npcGroup.addMultiple([desk, chair, npcChar, tag]);
            });
        }
    }

    switchMap(type) {
        currentMapType = type;
        this.drawEnvironment();
        this.renderEntities();

        if (this.player) {
            this.player.setVisible(true);
            this.player.setActive(true);
            if (type === 'forum') {
                this.player.setPosition(960, 900);
            } else {
                this.player.setPosition(960, 580);
            }
        }
    }

    update() {
        if (!this.player) return;

        this.player.setVelocity(0);

        if (isStoryActive && Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
            advanceStory();
            return;
        }

        const isQuizOpenForEsc = quizModal && !quizModal.classList.contains('hidden');
        if (isQuizOpenForEsc && Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
            closeQuizModal();
            return;
        }

        if (nearbyScreener && (Phaser.Input.Keyboard.JustDown(this.keyE))) {
            openQuizModal(nearbyScreener.posData);
        }

        nearbyScreener = null;
        const promptEl = document.getElementById('interaction-prompt');
        if (promptEl) promptEl.classList.add('hidden');

        const isQuizOpen = quizModal && !quizModal.classList.contains('hidden');
        const isLafranOpen = lafranModal && !lafranModal.classList.contains('hidden');
        const isStatusOpen = statusModal && !statusModal.classList.contains('hidden');

        if (isStoryActive || isQuizOpen || isLafranOpen || isStatusOpen || isBattleActive || isGordonActive) {
            this.player.setScale(0.45, 0.45);
            return;
        }

        let isMoving = false;
        const speed = 300;

        if (this.cursors.left.isDown || touchState.left) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            isMoving = true;
        } else if (this.cursors.right.isDown || touchState.right) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            isMoving = true;
        }

        if (this.cursors.up.isDown || touchState.up) {
            this.player.setVelocityY(-speed);
            isMoving = true;
        } else if (this.cursors.down.isDown || touchState.down) {
            this.player.setVelocityY(speed);
            isMoving = true;
        }

        if (isMoving) {
            let bounce = Math.sin(this.time.now * 0.018) * 0.02;
            this.player.setScale(0.45, 0.45 + bounce);
            if (Math.random() < 0.08) playSFX('type');
        } else {
            this.player.setScale(0.45, 0.45);
        }
    }

    handleOverlap(player, screener) {
        nearbyScreener = screener;
        if (!isStoryActive && currentMapType === 'screening') {
            const promptEl = document.getElementById('interaction-prompt');
            if (promptEl) promptEl.classList.remove('hidden');
        }
    }
}

// FIX: PERBAIKAN NAMA PARENT CONTEXT MENJADI 'game-wrapper'
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-wrapper',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: MainScene
};

// HELPER FUNCTIONS
function startStorySequence(sequence, onCompleteCallback = null) {
    isStoryActive = true;
    currentDialogueSequence = sequence;
    currentDialogueIndex = 0;
    if (storyOverlay) storyOverlay.classList.remove('hidden');
    storyCallbackOnComplete = onCompleteCallback;
    displayCurrentDialogue();
}

function displayCurrentDialogue() {
    let item = currentDialogueSequence[currentDialogueIndex];
    if (speakerName) speakerName.innerText = item.speaker;
    
    if (portraitImg) {
        if (item.portrait) {
            portraitImg.src = item.portrait;
            portraitImg.style.display = 'block';
            portraitImg.onerror = () => { portraitImg.style.display = 'none'; };
        } else {
            portraitImg.style.display = 'none';
        }
    }
    
    if (dialogueText) typeWriterEffect(dialogueText, item.text, 25);
}

function advanceStory() {
    playSFX('click');
    if (dialogueText && dialogueText.typewriterTimer) {
        clearInterval(dialogueText.typewriterTimer);
        dialogueText.typewriterTimer = null;
        dialogueText.textContent = currentDialogueSequence[currentDialogueIndex].text;
        return;
    }

    currentDialogueIndex++;
    if (currentDialogueIndex < currentDialogueSequence.length) {
        displayCurrentDialogue();
    } else {
        if (storyOverlay) storyOverlay.classList.add('hidden');
        isStoryActive = false;

        if (phaserGame && phaserGame.input && phaserGame.input.keyboard) {
            phaserGame.input.keyboard.enabled = true;
        }
        window.focus();

        if (storyCallbackOnComplete) {
            let cb = storyCallbackOnComplete;
            storyCallbackOnComplete = null;
            cb();
        }
    }
}

function updateHUD() {
    let totalPos = GAME_DATA[currentLevel].length;
    if (progressInfo) progressInfo.innerText = `Pos Selesai: ${completedPosIds.size} / ${totalPos}`;
    if (levelBadge) levelBadge.innerText = `LEVEL: ${currentLevel.toUpperCase()}`;
    if (livesInfo) livesInfo.innerText = `${'❤️'.repeat(Math.max(playerLives, 0))}${'🖤'.repeat(Math.max(3 - playerLives, 0))} Nyawa`;
}

function typeWriterEffect(element, text, speed = 20, callback = null) {
    if (!element) return;
    element.textContent = '';
    let i = 0;
    if (element.typewriterTimer) clearInterval(element.typewriterTimer);

    element.typewriterTimer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            if (i % 3 === 0) playSFX('type');
        } else {
            clearInterval(element.typewriterTimer);
            element.typewriterTimer = null;
            if (callback) callback();
        }
    }, speed);
}

function startTimer(resumeFrom = 30) {
    clearInterval(timerInterval);
    timeLeft = resumeFrom;
    if (timerText) timerText.innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timerText) timerText.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            playSFX('wrong');
            handleWrongAnswer("Waktu Habis! Nyawa berkurang.");
        }
    }, 1000);
}

function openQuizModal(posData) {
    playSFX('click');
    if (phaserGame && phaserGame.input && phaserGame.input.keyboard) phaserGame.input.keyboard.enabled = false;

    isForumMode = false;
    currentActivePos = posData;
    if (posBadge) posBadge.innerText = posData.title;
    if (screenerTitle) screenerTitle.innerText = posData.screenerName;
    if (optionsContainer) optionsContainer.innerHTML = '';

    typeWriterEffect(questionText, posData.question, 15, () => {
        posData.options.forEach((opt, index) => {
            let btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'option-btn';
            btn.innerText = `${String.fromCharCode(65 + index)}. ${opt}`;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.blur();
                checkAnswer(index === posData.answer, posData.id);
            });
            if (optionsContainer) optionsContainer.appendChild(btn);
        });
    });

    if (quizModal) quizModal.classList.remove('hidden');
    startTimer(30);
}

function openForumModal(forumData) {
    playSFX('click');
    if (phaserGame && phaserGame.input && phaserGame.input.keyboard) phaserGame.input.keyboard.enabled = false;

    isForumMode = true;
    lastForumData = forumData;
    if (posBadge) posBadge.innerText = "AULA FORUM UTAMA";
    if (screenerTitle) screenerTitle.innerText = forumData.title;
    if (optionsContainer) optionsContainer.innerHTML = '';

    typeWriterEffect(questionText, forumData.question, 15, () => {
        forumData.options.forEach((opt) => {
            let btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'option-btn';
            btn.innerText = opt.text;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.blur();
                checkAnswer(opt.correct);
            });
            if (optionsContainer) optionsContainer.appendChild(btn);
        });
    });

    if (quizModal) quizModal.classList.remove('hidden');
    startTimer(30);
}

function closeQuizModal() {
    clearInterval(timerInterval);
    if (quizModal) quizModal.classList.add('hidden');

    if (phaserGame && phaserGame.input && phaserGame.input.keyboard) {
        phaserGame.input.keyboard.enabled = true;
    }
    window.focus();
}

function checkAnswer(isCorrect, posId = null) {
    clearInterval(timerInterval);

    if (isCorrect) {
        playSFX('correct');
        
        if (!isForumMode) {
            let idToAdd = posId || (currentActivePos ? currentActivePos.id : null);
            if (idToAdd) {
                completedPosIds.add(Number(idToAdd));
            }

            updateHUD();
            closeQuizModal();

            if (activeScene) activeScene.renderEntities();

            if (completedPosIds.size >= GAME_DATA[currentLevel].length) {
                setTimeout(() => {
                    startForumPhase();
                }, 300);
            }
        } else {
            closeQuizModal();
            if (currentLevel === 'lk1') {
                startStorySequence(STORY_DIALOGUES.transition_lk2, () => {
                    currentLevel = 'lk2';
                    completedPosIds.clear();
                    updateHUD();
                    if (activeScene) activeScene.switchMap('screening');
                });
            } else {
                playSFX('levelup');
                startStorySequence(STORY_DIALOGUES.ending, () => {
                    showGordonReward(() => {
                        showVictoryModal();
                    });
                });
            }
        }
    } else {
        playSFX('wrong');
        handleWrongAnswer("Jawaban Kurang Tepat.");
    }
}

function startForumPhase() {
    if (activeScene) activeScene.switchMap('forum');

    if (currentLevel === 'lk1') {
        startStorySequence(STORY_DIALOGUES.forum_lk1, () => {
            openForumModal(FORUM_QUESTIONS.lk1);
        });
    } else {
        startStorySequence(STORY_DIALOGUES.forum_lk2, () => {
            startArgumentBattle(() => {
                openForumModal(FORUM_QUESTIONS.lk2);
            });
        });
    }
}

function injectBattleStyles() {
    if (document.getElementById('hmi-battle-styles')) return;
    const style = document.createElement('style');
    style.id = 'hmi-battle-styles';
    style.textContent = `
        @keyframes hmiShake {
            0%,100% { transform: translate(0,0); }
            20% { transform: translate(-10px,5px); }
            40% { transform: translate(10px,-5px); }
            60% { transform: translate(-7px,-5px); }
            80% { transform: translate(7px,5px); }
        }
        .hmi-shake { animation: hmiShake 0.35s ease-in-out; }
        #hmi-battle-overlay {
            position: fixed; inset: 0; z-index: 9500;
            background: radial-gradient(circle at center, #4c1010 0%, #111827 75%);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            color: #fff; font-family: Arial, sans-serif; padding: 20px; box-sizing: border-box;
        }
        #hmi-battle-label {
            position: absolute; top: 26px; font-size: clamp(16px,2.2vw,24px); font-weight: 900;
            letter-spacing: 2px; color: #ef4444; text-shadow: 0 0 10px #000; text-align: center;
        }
        #hmi-battle-overlay .hmi-vs-row { display: flex; align-items: center; gap: 40px; margin-bottom: 18px; }
        #hmi-battle-overlay .hmi-fighter {
            width: 110px; height: 110px; border-radius: 50%; border: 4px solid #ef4444;
            object-fit: cover; background: #374151;
        }
        #hmi-battle-overlay .hmi-vs-text { font-size: 30px; font-weight: 900; color: #facc15; text-shadow: 0 0 12px #ef4444; }
        #hmi-battle-tensionbar-wrap {
            width: 85%; max-width: 600px; height: 20px; background: #1f2937;
            border: 2px solid #fff; border-radius: 12px; overflow: hidden; margin-bottom: 8px;
        }
        #hmi-battle-tensionbar { height: 100%; width: 50%; background: linear-gradient(90deg,#22c55e,#facc15,#ef4444); transition: width .4s ease; }
        #hmi-battle-tensionlabel { font-size: 12px; letter-spacing: 1px; margin-bottom: 18px; color: #cbd5e1; }
        #hmi-battle-attacktext {
            max-width: 700px; text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px;
            background: rgba(0,0,0,.55); padding: 14px 20px; border-radius: 10px; border-left: 5px solid #ef4444;
        }
        #hmi-battle-options { display: flex; flex-direction: column; gap: 10px; width: 90%; max-width: 700px; }
        #hmi-battle-options button {
            padding: 12px 18px; font-size: 14px; border-radius: 8px; border: 2px solid #008037;
            background: #f0fdf4; color: #064e3b; cursor: pointer; text-align: left; font-weight: 600;
        }
        #hmi-battle-options button:hover { background: #008037; color: #fff; }
    `;
    document.head.appendChild(style);
}

function buildBattleOverlay() {
    let overlay = document.getElementById('hmi-battle-overlay');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = 'hmi-battle-overlay';
    overlay.innerHTML = `
        <div id="hmi-battle-label">⚔️ FORUM MEMANAS! ADU ARGUMENTASI LK 2 ⚔️</div>
        <div class="hmi-vs-row">
            <img class="hmi-fighter" id="hmi-fighter-left" src="assets/teman.png" onerror="this.style.visibility='hidden'">
            <div class="hmi-vs-text">VS</div>
            <img class="hmi-fighter" id="hmi-fighter-right" src="assets/screener_konstitusi.png" onerror="this.style.visibility='hidden'">
        </div>
        <div id="hmi-battle-tensionbar-wrap"><div id="hmi-battle-tensionbar"></div></div>
        <div id="hmi-battle-tensionlabel">KETEGANGAN FORUM</div>
        <div id="hmi-battle-attacktext"></div>
        <div id="hmi-battle-options"></div>
    `;
    document.body.appendChild(overlay);
}

function updateTensionBar() {
    const bar = document.getElementById('hmi-battle-tensionbar');
    if (bar) bar.style.width = `${battleTension}%`;
}

function runBattleRound(idx, onComplete) {
    const overlay = document.getElementById('hmi-battle-overlay');
    if (!overlay) return;

    if (idx >= ARGUMENT_BATTLE_LK2.rounds.length) {
        const label = document.getElementById('hmi-battle-label');
        const attackTextEl = document.getElementById('hmi-battle-attacktext');
        const optionsEl = document.getElementById('hmi-battle-options');
        if (label) label.textContent = battleTension >= 70
            ? "🔥 FORUM NYARIS PECAH! SEMUA MATA TERTUJU PADAMU! 🔥"
            : "Forum mulai tenang... saatnya kamu mengambil sikap penentu.";
        if (attackTextEl) attackTextEl.textContent = "";
        if (optionsEl) optionsEl.innerHTML = "";
        playSFX(battleTension >= 70 ? 'wrong' : 'correct');
        setTimeout(() => {
            overlay.remove();
            onComplete();
        }, 1400);
        return;
    }

    const round = ARGUMENT_BATTLE_LK2.rounds[idx];
    const attackTextEl = document.getElementById('hmi-battle-attacktext');
    const optionsEl = document.getElementById('hmi-battle-options');

    overlay.classList.add('hmi-shake');
    playSFX('wrong');
    setTimeout(() => overlay.classList.remove('hmi-shake'), 350);

    if (attackTextEl) attackTextEl.textContent = `${round.attacker}: "${round.attackText}"`;
    if (optionsEl) {
        optionsEl.innerHTML = '';
        round.responses.forEach(resp => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = resp.text;
            btn.addEventListener('click', () => {
                battleTension = Math.max(0, Math.min(100, battleTension + resp.tension));
                updateTensionBar();
                playSFX(resp.tension < 0 ? 'correct' : 'click');
                optionsEl.querySelectorAll('button').forEach(b => b.disabled = true);
                setTimeout(() => runBattleRound(idx + 1, onComplete), 600);
            });
            optionsEl.appendChild(btn);
        });
    }
}

function startArgumentBattle(onComplete) {
    isBattleActive = true;
    if (phaserGame && phaserGame.input && phaserGame.input.keyboard) phaserGame.input.keyboard.enabled = false;

    battleTension = 50;
    injectBattleStyles();
    buildBattleOverlay();
    updateTensionBar();

    runBattleRound(0, () => {
        isBattleActive = false;
        onComplete();
    });
}

function handleWrongAnswer(reason) {
    playerLives--;
    updateHUD();
    closeQuizModal();

    if (playerLives <= 0) {
        showGameOverModal();
        return;
    }

    if (isForumMode && lastForumData) {
        showToast(`❌ ${reason} Forum masih menunggu argumenmu... (Nyawa: ${playerLives})`);
        setTimeout(() => {
            openForumModal(lastForumData);
        }, 1500);
    } else {
        showToast(`❌ ${reason} Nyawa: ${playerLives}`);
    }
}

function showToast(message, duration = 1800) {
    let toast = document.getElementById('hmi-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'hmi-toast';
        toast.style.cssText = `
            position: fixed; left: 50%; bottom: 40px; transform: translateX(-50%);
            background: rgba(17,24,39,0.95); color: #fff; padding: 12px 22px;
            border-radius: 10px; border: 2px solid #ef4444; font: bold 15px Arial, sans-serif;
            z-index: 9999; max-width: 80vw; text-align: center; box-shadow: 0 6px 20px rgba(0,0,0,.4);
            transition: opacity .25s ease; pointer-events: none;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => { toast.style.opacity = '0'; }, duration);
}

function showGameOverModal() {
    const statusTitle = document.getElementById('status-title');
    const statusMsg = document.getElementById('status-msg');
    const btnAction = document.getElementById('btn-status-action');

    if (statusTitle) statusTitle.innerText = "❌ GAME OVER";
    if (statusMsg) statusMsg.innerText = "Indeks kelulusan Anda gugur. Silakan mengulang dari awal!";
    if (btnAction) btnAction.innerText = "Ulangi Level";
    if (statusModal) statusModal.classList.remove('hidden');
}

function injectGordonStyles() {
    if (document.getElementById('hmi-gordon-styles')) return;
    const style = document.createElement('style');
    style.id = 'hmi-gordon-styles';
    style.textContent = `
        @keyframes hmiGordonFadeBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hmiGordonFlash { 0% { opacity: .95; } 100% { opacity: 0; } }
        @keyframes hmiGordonDrop {
            0%   { transform: translateY(-260px) scale(.4) rotate(-14deg); opacity: 0; }
            55%  { transform: translateY(18px) scale(1.08) rotate(4deg); opacity: 1; }
            75%  { transform: translateY(-8px) scale(.98) rotate(-2deg); }
            100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes hmiGordonGlow { 0%,100% { box-shadow: 0 0 26px 6px rgba(250,204,21,.5); } 50% { box-shadow: 0 0 48px 16px rgba(250,204,21,.9); } }
        @keyframes hmiGordonTwinkle { 0%,100% { opacity: 0; transform: scale(.3) rotate(0deg); } 50% { opacity: 1; transform: scale(1.3) rotate(35deg); } }
        @keyframes hmiGordonBannerIn { from { transform: translateX(130%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes hmiGordonBtnIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        #hmi-gordon-overlay {
            position: fixed; inset: 0; z-index: 9700; display: flex; flex-direction: column;
            align-items: center; justify-content: center; overflow: hidden;
            background: radial-gradient(circle at center, #1c2b20 0%, #0a0f0c 80%);
            animation: hmiGordonFadeBg .4s ease both; font-family: Arial, sans-serif;
        }
        #hmi-gordon-flash { position: absolute; inset: 0; background: #fff; animation: hmiGordonFlash .6s ease-out .25s both; pointer-events: none; }
        .hmi-gordon-medal { position: relative; width: 220px; height: 340px; animation: hmiGordonDrop 1s cubic-bezier(.34,1.56,.64,1) .35s both; }
        .hmi-gordon-strap {
            position: absolute; top: -6px; width: 48px; height: 190px; border: 3px solid #000; border-radius: 6px;
            background: repeating-linear-gradient(180deg, #16a34a 0 10px, #0a0a0a 10px 16px);
        }
        .hmi-gordon-strap-left { left: 34px; transform: rotate(18deg); transform-origin: top center; }
        .hmi-gordon-strap-right { right: 34px; transform: rotate(-18deg); transform-origin: top center; }
        .hmi-gordon-pendant {
            position: absolute; left: 50%; top: 150px; transform: translateX(-50%); width: 96px;
            border: 3px solid #000; border-radius: 8px 8px 0 0; overflow: hidden;
            clip-path: polygon(0 0, 100% 0, 100% 76%, 50% 100%, 0 76%);
            animation: hmiGordonGlow 1.8s ease-in-out 1.2s infinite;
        }
        .hmi-gordon-pendant-top { background: #111827; color: #f1f5f9; text-align: center; font-size: 26px; padding: 10px 0 6px; letter-spacing: 3px; }
        .hmi-gordon-pendant-bottom { background: #16a34a; color: #fff; text-align: center; font: 900 18px/1.25 Arial; padding: 8px 0 30px; letter-spacing: 3px; }
        .hmi-gordon-sparkle { position: absolute; font-size: 20px; color: #fde68a; animation: hmiGordonTwinkle 1.4s ease-in-out infinite; pointer-events: none; }
        #hmi-gordon-banner {
            position: absolute; top: 8%; right: 4%; max-width: 320px; background: #0a0f1a; color: #fde68a;
            border: 3px solid #f1f5f9; border-radius: 10px; padding: 14px 18px; font: bold 15px/1.4 'Courier New', monospace;
            text-align: left; animation: hmiGordonBannerIn .6s ease-out 1s both; box-shadow: 0 8px 24px rgba(0,0,0,.5);
        }
        #hmi-gordon-caption { margin-top: 26px; color: #d1fae5; font-size: 14px; letter-spacing: 1px; text-align: center; opacity: 0; animation: hmiGordonBtnIn .5s ease .9s forwards; }
        #hmi-gordon-continue {
            margin-top: 22px; padding: 10px 28px; font-weight: 800; font-size: 15px; border-radius: 8px;
            border: 2px solid #fde68a; background: #16a34a; color: #fff; cursor: pointer; opacity: 0;
            animation: hmiGordonBtnIn .5s ease 1.9s forwards;
        }
        #hmi-gordon-continue:hover { background: #15803d; }
    `;
    document.head.appendChild(style);
}

function buildGordonOverlay() {
    let overlay = document.getElementById('hmi-gordon-overlay');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = 'hmi-gordon-overlay';

    let sparklesHtml = '';
    const sparklePositions = [
        { top: '18%', left: '30%', delay: '0s' },
        { top: '30%', left: '68%', delay: '.3s' },
        { top: '50%', left: '22%', delay: '.6s' },
        { top: '55%', left: '78%', delay: '.15s' },
        { top: '70%', left: '38%', delay: '.45s' },
        { top: '68%', left: '62%', delay: '.75s' }
    ];
    sparklePositions.forEach(p => {
        sparklesHtml += `<span class="hmi-gordon-sparkle" style="top:${p.top};left:${p.left};animation-delay:${p.delay};">✦</span>`;
    });

    overlay.innerHTML = `
        <div id="hmi-gordon-flash"></div>
        <div id="hmi-gordon-banner">🏅 Kader Berhasil!<br>Kamu memperoleh<br><span style="font-size:18px;">GORDON HMI</span>!</div>
        <div class="hmi-gordon-medal">
            <div class="hmi-gordon-strap hmi-gordon-strap-left"></div>
            <div class="hmi-gordon-strap hmi-gordon-strap-right"></div>
            ${sparklesHtml}
            <div class="hmi-gordon-pendant">
                <div class="hmi-gordon-pendant-top">☾✦</div>
                <div class="hmi-gordon-pendant-bottom">H<br>M<br>I</div>
            </div>
        </div>
        <div id="hmi-gordon-caption">Lambang Insan Akademis, Pencipta &amp; Pengabdi</div>
        <button id="hmi-gordon-continue" type="button">Lanjutkan</button>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function showGordonReward(onComplete) {
    isGordonActive = true;
    if (phaserGame && phaserGame.input && phaserGame.input.keyboard) phaserGame.input.keyboard.enabled = false;

    injectGordonStyles();
    const overlay = buildGordonOverlay();
    playSFX('levelup');
    setTimeout(() => playSFX('correct'), 900);

    const btn = document.getElementById('hmi-gordon-continue');
    if (btn) {
        btn.addEventListener('click', () => {
            playSFX('click');
            overlay.remove();
            isGordonActive = false;
            onComplete();
        });
    }
}

function showVictoryModal() {
    isGameFinished = true;
    const statusTitle = document.getElementById('status-title');
    const statusMsg = document.getElementById('status-msg');
    const btnAction = document.getElementById('btn-status-action');

    if (statusTitle) statusTitle.innerText = "🎉 SELAMAT, LULUS LK 1 & LK 2!";
    if (statusMsg) statusMsg.innerText = "Yakin Usaha Sampai! Kamu telah menyelesaikan seluruh perjalanan perkaderan HMI.";
    if (btnAction) btnAction.innerText = "Main Lagi dari Awal";
    if (statusModal) statusModal.classList.remove('hidden');
}

async function getLafranAIHint(question) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
        return "Ananda, cermati kembali poin-poin materi pokok, latar belakang sejarah, serta nilai-nilai dasar dalam modul perkaderanmu.";
    }

    const promptText = `
    Kamu adalah Ayanda Lafran Pane, pendiri HMI.
    Tugasmu memberikan petunjuk/hint singkat kepada kader tanpa membocorkan jawaban langsung.
    Maksimal 2-3 kalimat. Sapa dengan "Ananda".
    Pertanyaan: ${question}
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });

        if (!response.ok) {
            throw new Error(`API merespons status ${response.status}`);
        }

        const data = await response.json();
        const hint = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!hint) throw new Error("Format respons AI tidak sesuai dugaan");
        return hint;
    } catch (error) {
        console.warn('[HMI Game] Lafran AI hint gagal:', error);
        return "Ananda, cermati kembali poin-poin materi pokok dalam modul perkaderanmu.";
    }
}

// INISIALISASI SETELAH DOM SELESAI SIAP
document.addEventListener('DOMContentLoaded', () => {
    quizModal = document.getElementById('quiz-modal');
    lafranModal = document.getElementById('lafran-modal');
    statusModal = document.getElementById('status-modal');
    storyOverlay = document.getElementById('story-overlay');

    questionText = document.getElementById('question-text');
    optionsContainer = document.getElementById('options-container');
    screenerTitle = document.getElementById('screener-title');
    posBadge = document.getElementById('pos-badge');
    lafranResponse = document.getElementById('lafran-response');
    progressInfo = document.getElementById('progress-info');
    levelBadge = document.getElementById('level-badge');
    livesInfo = document.getElementById('lives-info');
    timerText = document.getElementById('timer-text');
    speakerName = document.getElementById('speaker-name');
    dialogueText = document.getElementById('dialogue-text');
    portraitImg = document.getElementById('portrait-img');

    if (storyOverlay) {
        storyOverlay.addEventListener('click', () => {
            if (isStoryActive) advanceStory();
        });
    }

    const btnCloseQuiz = document.getElementById('btn-close-quiz');
    if (btnCloseQuiz) btnCloseQuiz.addEventListener('click', closeQuizModal);

    const btnLafran = document.getElementById('btn-lafran');
    if (btnLafran) {
        btnLafran.addEventListener('click', async () => {
            hintTimeRemaining = timeLeft;
            clearInterval(timerInterval);
            if (quizModal) quizModal.classList.add('hidden');
            if (lafranModal) lafranModal.classList.remove('hidden');

            typeWriterEffect(lafranResponse, "Ayanda Lafran sedang merenungkan petunjuk untukmu...", 15, async () => {
                let hint = await getLafranAIHint(currentActivePos ? currentActivePos.question : "Forum Debat");
                typeWriterEffect(lafranResponse, hint, 20);
            });
        });
    }

    const btnCloseLafran = document.getElementById('btn-close-lafran');
    if (btnCloseLafran) {
        btnCloseLafran.addEventListener('click', () => {
            if (lafranModal) lafranModal.classList.add('hidden');
            if (quizModal) quizModal.classList.remove('hidden');
            startTimer(hintTimeRemaining ?? 30);
        });
    }

    const btnStatusAction = document.getElementById('btn-status-action');
    if (btnStatusAction) {
        btnStatusAction.addEventListener('click', () => {
            if (statusModal) statusModal.classList.add('hidden');
            playerLives = 3;
            completedPosIds.clear();
            currentLevel = 'lk1';
            isGameFinished = false;
            updateHUD();
            if (activeScene) activeScene.switchMap('screening');
            if (phaserGame && phaserGame.input && phaserGame.input.keyboard) phaserGame.input.keyboard.enabled = true;
            window.focus();
        });
    }

    // Listener Tombol Layar Sentuh HP
    const bindTouch = (id, dir) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); touchState[dir] = true; });
            btn.addEventListener('touchend', (e) => { e.preventDefault(); touchState[dir] = false; });
            btn.addEventListener('mousedown', () => { touchState[dir] = true; });
            btn.addEventListener('mouseup', () => { touchState[dir] = false; });
        }
    };

    bindTouch('btn-up', 'up');
    bindTouch('btn-down', 'down');
    bindTouch('btn-left', 'left');
    bindTouch('btn-right', 'right');

    // Tombol Interaksi "E" di Layar HP
    const btnActionE = document.getElementById('btn-action-e');
    if (btnActionE) {
        const triggerE = (e) => {
            e.preventDefault();
            if (nearbyScreener) {
                openQuizModal(nearbyScreener.posData);
            }
        };

        btnActionE.addEventListener('touchstart', triggerE);
        btnActionE.addEventListener('click', triggerE);
    }

    // STARTS PHASER GAME
    phaserGame = new Phaser.Game(config);
    updateHUD();
});