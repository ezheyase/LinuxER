// ELEMENTS
const historyDiv = document.getElementById('history');
const kaliHeader = document.getElementById('kali-header'); // NEW
const promptText = document.getElementById('prompt-text');
const cmdInput = document.getElementById('cmd');
const termContent = document.getElementById('terminal-content');
const tdListEl = document.getElementById('td-list');
const timerEl = document.getElementById('timer');

// BG Handling
const overlays = document.querySelectorAll('.overlay');
const BG_URLS = {
    login: "url('https://preview.redd.it/created-a-linux-version-of-my-previous-wallpaper-3840-x-2160-v0-en12fj7x5of91.png?width=1080&crop=smart&auto=webp&s=1d581ad3dba201494815fa87a6ac989ddd63dedd')",
    ubuntu: "url('https://wallup.net/wp-content/uploads/2017/11/17/245597-Ubuntu-operating_systems-logo.jpg')",
    kali: "url('https://www.kali.org/wallpapers/images/2025/kali-tiles-purple.jpg')",
    arch: "url('https://wallpapers.com/images/featured/arch-linux-xw0szpochzcu0gml.jpg')"
};

document.body.style.backgroundImage = BG_URLS.login;
document.body.style.backgroundSize = "cover";

function previewBg(os) {
    if(!document.getElementById('distro-layer').classList.contains('hidden')) {
        document.body.style.backgroundImage = BG_URLS[os];
    }
}

let user = "admin";
let distro = "ubuntu";
let currentTD = 0;
let currentEx = 0;
let path = "~";
let historyStack = [];
let historyIdx = -1;
let seconds = 0;

const LOGOS = {
    ubuntu: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/UbuntuCoF.svg/2048px-UbuntuCoF.svg.png",
    kali: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJwgMZUJAvAFdnrHOUBRkgT-NwPlmHequy6Q&s",
    arch: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Arch_Linux_%22Crystal%22_icon.svg/2048px-Arch_Linux_%22Crystal%22_icon.svg.png"
};

// --- DATA ---
const curriculum = [
    { title: "TD1: Création", missions: [
        { q: "Créez le dossier TD_SE1", c: "mkdir TD_SE1", h: "mkdir nom" },
        { q: "Entrez dans TD_SE1", c: "cd TD_SE1", h: "cd nom" },
        { q: "Créez TD1 TD2 TD3", c: "mkdir TD1 TD2 TD3", h: "mkdir a b c" },
        { q: "Créez eval/qcm1", c: "mkdir -p eval/qcm1", h: "mkdir -p a/b" },
        { q: "Entrez dans eval", c: "cd eval", h: "cd nom" },
        { q: "Créez c1.txt c2.txt", c: "touch c1.txt c2.txt", h: "touch a b" },
        { q: "Renommez qcm1", c: "mv qcm1 exams", h: "mv old new" },
        { q: "Retour home", c: "cd ~", h: "cd ~" }
    ]},
    { title: "TD1: Jokers", missions: [
        { q: "Allez dans TD_SE1/eval", c: "cd TD_SE1/eval", h: "cd chemin" },
        { q: "Créez Q1.doc Q2.txt", c: "touch Q1.doc Q2.txt", h: "touch f1 f2" },
        { q: "Listez Q*", c: "ls Q*", h: "ls Q*" },
        { q: "Supprimez tout", c: "rm *", h: "rm *" },
        { q: "Retour home", c: "cd ~", h: "cd ~" },
        { q: "Supprimer TD_SE1", c: "rm -rf TD_SE1", h: "rm -rf dossier" }
    ]},
    { title: "TD2: Liens", missions: [
        { q: "Créez cible.txt", c: "touch cible.txt", h: "touch nom" },
        { q: "Lien dur 'dur'", c: "ln cible.txt dur", h: "ln src dest" },
        { q: "Lien soft 'soft'", c: "ln -s cible.txt soft", h: "ln -s src dest" },
        { q: "Voir inodes", c: "ls -i", h: "ls -i" },
        { q: "Droits 777", c: "chmod 777 cible.txt", h: "chmod 777" }
    ]},
    { title: "TD3: Redirections", missions: [
        { q: "Date dans info.txt", c: "date > info.txt", h: "cmd > fichier" },
        { q: "Ajouter user", c: "whoami >> info.txt", h: "cmd >> fichier" },
        { q: "Lister /bin", c: "ls /bin > bins.txt", h: "ls > fichier" },
        { q: "Compter lignes", c: "wc -l bins.txt", h: "wc -l fichier" }
    ]},
    { title: "TD4/5: Filtres", missions: [
        { q: "3 lignes de passwd", c: "head -n 3 passwd", h: "head -n 3" },
        { q: "Chercher root", c: "grep root passwd", h: "grep mot fichier" },
        { q: "Trier access.log", c: "sort access.log", h: "sort fichier" },
        { q: "IPs uniques", c: "sort access.log | uniq", h: "sort | uniq" }
    ]}
];

// --- CORE ---
function startSession() {
    const u = document.getElementById('username').value.trim();
    if(u) {
        user = u;
        document.getElementById('login-layer').classList.add('hidden');
        document.getElementById('distro-layer').classList.remove('hidden');
    }
}

function boot(d) {
    distro = d;
    document.body.className = d;
    document.body.style.backgroundImage = BG_URLS[d];
    document.getElementById('distro-layer').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    document.getElementById('logo').src = LOGOS[d];
    document.getElementById('os-title').innerText = d.toUpperCase();
    document.getElementById('user-display').innerText = user;

    writeLine(`Bienvenue sur ${d.toUpperCase()} 22.04 LTS.`);
    writeLine(`Session ouverte : ${user}`);
    writeLine("");

    loadProgress();
    renderNav();
    updateUI(); 
    renderPrompt(); // Update visual prompt
    focusInput();
    
    setInterval(() => { seconds++; timerEl.innerText = new Date(seconds * 1000).toISOString().substr(14, 5); }, 1000);
}

function renderPrompt() {
    // 1. Reset Kali Header
    kaliHeader.innerHTML = "";
    kaliHeader.classList.add('hidden');

    // 2. Build Prompt
    if(distro === 'kali') {
        kaliHeader.classList.remove('hidden');
        kaliHeader.innerHTML = `<span class="k-blue">┌──(</span><span class="k-blue" style="font-weight:bold">${user}㉿kali</span><span class="k-blue">)-[</span><span class="p-white">${path}</span><span class="k-blue">]</span>`;
        promptText.innerHTML = `<span class="k-blue">└─$</span>`;
    } else if (distro === 'arch') {
        promptText.innerHTML = `<span class="a-gray">[</span><span class="a-white">${user}@arch</span> <span class="a-white">${path}</span><span class="a-gray">]$</span>`;
    } else {
        promptText.innerHTML = `<span class="p-green">${user}@${distro}</span>:<span class="p-blue">${path}</span>$`;
    }
}

cmdInput.addEventListener('keydown', function(e) {
    if(e.key === 'Enter') {
        const val = this.value;
        const line = document.createElement('div');
        
        let staticPrompt = "";
        if(distro === 'kali') {
            staticPrompt = `<div><span class="k-blue">┌──(${user}㉿kali)-[${path}]</span></div><div><span class="k-blue">└─$</span> ${val}</div>`;
        } else if (distro === 'arch') {
            staticPrompt = `<span class="a-gray">[</span><span class="a-white">${user}@arch</span> <span class="a-white">${path}</span><span class="a-gray">]$</span> ${val}`;
        } else {
            staticPrompt = `<span class="p-green">${user}@${distro}</span>:<span class="p-blue">${path}</span>$ ${val}`;
        }
        
        line.innerHTML = staticPrompt;
        line.style.marginBottom = "2px";
        historyDiv.appendChild(line);
        
        this.value = "";
        
        if(val.trim()) {
            historyStack.push(val);
            historyIdx = -1;
            processCmd(val.trim());
        }
        termContent.scrollTop = termContent.scrollHeight;
    }
    else if(e.key === 'ArrowUp') {
        e.preventDefault();
        if(historyStack.length > 0) {
            if(historyIdx < historyStack.length - 1) historyIdx++;
            this.value = historyStack[historyStack.length - 1 - historyIdx];
        }
    }
    else if(e.key === 'ArrowDown') {
        e.preventDefault();
        if(historyIdx > 0) {
            historyIdx--;
            this.value = historyStack[historyStack.length - 1 - historyIdx];
        } else {
            historyIdx = -1;
            this.value = "";
        }
    }
});

function writeLine(txt, color="") {
    const div = document.createElement('div');
    div.innerText = txt;
    if(color) div.style.color = color;
    else div.style.color = (distro === 'kali' || distro === 'arch') ? '#ccc' : '#ddd';
    div.style.marginBottom = "5px";
    div.style.whiteSpace = "pre-wrap";
    historyDiv.appendChild(div);
}

function processCmd(cmd) {
    if(cmd === "clear") { historyDiv.innerHTML = ""; return; }
    
    if(cmd.startsWith("cd ")) {
        let arg = cmd.split(" ")[1];
        if(arg === "..") {
            if(path.includes("/")) path = path.substring(0, path.lastIndexOf("/"));
            else path = "~";
        } else if(arg === "~") {
            path = "~";
        } else {
            if(path === "~") path = "~/" + arg;
            else path += "/" + arg;
        }
        renderPrompt();
    }

    if(cmd === "ls") writeLine("TD_SE1  sandbox  access.log  passwd  notes.txt");
    else if(cmd === "ls -i") writeLine("12345 file1  67890 file2");
    else if(cmd.includes("cat")) writeLine("Contenu...");
    else if(cmd.includes("grep")) writeLine("Trouvé...");
    else if(!checkMission(cmd) && !cmd.startsWith("cd ")) {
        writeLine(`${cmd.split(' ')[0]}: commande introuvable`, "red");
    }
    
    if(cmd.startsWith("cd ")) checkMission(cmd);
}

function checkMission(cmd) {
    if(currentTD >= curriculum.length) return false;
    const miss = curriculum[currentTD].missions[currentEx];
    const clean = cmd.replace(/\s+/g, ' ').trim();
    const req = miss.c.split(' ');
    
    if(req.every(r => clean.includes(r))) {
        writeLine("✅ CORRECT !", "#0f0");
        currentEx++;
        if(currentEx >= curriculum[currentTD].missions.length) {
            writeLine(`🚀 CHAPITRE FINI !`, "yellow");
            currentTD++;
            currentEx = 0;
            renderNav();
        }
        updateUI();
        saveData();
        return true;
    }
    return false;
}

function focusInput() { cmdInput.focus(); }

function renderNav() {
    tdListEl.innerHTML = "";
    curriculum.forEach((td, idx) => {
        const li = document.createElement('li');
        li.innerText = td.title;
        if(idx === currentTD) li.classList.add('active');
        else if(idx < currentTD) {
            li.classList.add('done');
            li.onclick = () => { currentTD = idx; currentEx = 0; updateUI(); renderNav(); };
        } else li.classList.add('locked');
        tdListEl.appendChild(li);
    });
}

function updateUI() {
    if(currentTD >= curriculum.length) { 
        document.getElementById('objective').innerText = "TERMINÉ !"; 
        return; 
    }
    const m = curriculum[currentTD].missions[currentEx];
    document.getElementById('chapter-title').innerText = curriculum[currentTD].title;
    document.getElementById('objective').innerText = m.q;
    const pct = (currentEx / curriculum[currentTD].missions.length) * 100;
    document.getElementById('bar').style.width = pct + "%";
}

function showHint() { document.getElementById('msg').innerText = "Indice: " + curriculum[currentTD].missions[currentEx].h; }
function solve() { cmdInput.value = curriculum[currentTD].missions[currentEx].c; cmdInput.focus(); }
function saveData() { 
    localStorage.setItem('linux_v30_'+user, JSON.stringify({t: currentTD, e: currentEx}));
    writeLine("[SYSTÈME] Sauvegardé.", "#888");
}
function loadProgress() { 
    const d = JSON.parse(localStorage.getItem('linux_v30_'+user)); 
    if(d) { currentTD = d.t; currentEx = d.e; } 
}
function resetAll() {
    if(confirm("Reset ?")) {
        localStorage.removeItem('linux_v30_'+user);
        location.reload();
    }
}