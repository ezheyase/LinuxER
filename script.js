
var widget;
var isPlaying = false;

function initAudio() {
    var iframe = document.getElementById('sc-widget');
    widget = SC.Widget(iframe);
    widget.bind(SC.Widget.Events.READY, function() {
        console.log("SoundCloud Ready");
        widget.setVolume(50);
        widget.play();
        isPlaying = true;
    });
    widget.bind(SC.Widget.Events.FINISH, function() {
        widget.skip(0); 
        widget.play();
    });
}

window.toggleMusic = function() {
    if(!widget) return;
    widget.toggle();
    isPlaying = !isPlaying;
}

const historyDiv = document.getElementById('history');
const kaliHeader = document.getElementById('kali-header');
const promptText = document.getElementById('prompt-text');
const cmdInput = document.getElementById('cmd');
const termContent = document.getElementById('terminal-content');
const tdListEl = document.getElementById('td-list');
const timerEl = document.getElementById('timer');

const BG_URLS = {
    login: "url('https://preview.redd.it/created-a-linux-version-of-my-previous-wallpaper-3840-x-2160-v0-en12fj7x5of91.png?width=1080&crop=smart&auto=webp&s=1d581ad3dba201494815fa87a6ac989ddd63dedd')",
    ubuntu: "url('https://wallup.net/wp-content/uploads/2017/11/17/245597-Ubuntu-operating_systems-logo.jpg')",
    kali: "url('https://www.kali.org/wallpapers/images/2025/kali-tiles-purple.jpg')",
    arch: "url('https://wallpapers.com/images/featured/arch-linux-xw0szpochzcu0gml.jpg')"
};

document.body.style.backgroundImage = BG_URLS.login;
document.body.style.backgroundSize = "cover";

let user = "etudiant";
let distro = "ubuntu";
let currentTD = 0;
let currentEx = 0;
let historyStack = [];
let historyIdx = -1;
let seconds = 0;

const LOGOS = {
    ubuntu: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/UbuntuCoF.svg/2048px-UbuntuCoF.svg.png",
    kali: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJwgMZUJAvAFdnrHOUBRkgT-NwPlmHequy6Q&s",
    arch: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Arch_Linux_%22Crystal%22_icon.svg/2048px-Arch_Linux_%22Crystal%22_icon.svg.png"
};

const curriculum = [
    { title: "TD1: Création Rep", missions: [
        { q: "1. Dans votre répertoire personnel, créez un dossier TD_SE1.", c: "mkdir TD_SE1", h: "mkdir nom" },
        { q: "2. Créez les dossiers TD1 TD2 TD3 dans TD_SE1.", c: "mkdir TD_SE1/TD1 TD_SE1/TD2 TD_SE1/TD3", h: "mkdir chemin/d1 chemin/d2" },
        { q: "3. Déplacez-vous dans le répertoire TD_SE1.", c: "cd TD_SE1", h: "cd nom" },
        { q: "4. Créez les répertoires TD4 TD5 TD6.", c: "mkdir TD4 TD5 TD6", h: "mkdir a b c" },
        { q: "5. Créez dossier eval, contenant qcm1 et qcm2.", c: "mkdir -p eval/qcm1 eval/qcm2", h: "mkdir -p eval/d1 eval/d2" },
        { q: "7. Quelle commande retourne l’arborescence ?", c: "tree", h: "tree" }
    ]},
    { title: "TD1 Ex2: Fichiers", missions: [
        { q: "Allez dans eval.", c: "cd eval", h: "cd nom" },
        { q: "1. Créez controle1.txt, controle2.txt, controle3.txt.", c: "touch controle1.txt controle2.txt controle3.txt", h: "touch f1 f2 f3" },
        { q: "2. Créez le répertoire controles.", c: "mkdir controles", h: "mkdir nom" },
        { q: "3. Renommez controles en examens.", c: "mv controles examens", h: "mv old new" },
        { q: "4. Déplacez les fichiers controle*.txt dans examens.", c: "mv controle1.txt controle2.txt controle3.txt examens", h: "mv f1 f2 f3 dest" },
        { q: "5. Copiez tous les fichiers d'examens vers qcm1.", c: "cd examens; cp * ../qcm1", h: "cd examens puis cp * ../qcm1" },
        { q: "6. Créez question1.txt, question2.txt, question3.txt dans qcm1.", c: "cd ../qcm1; touch question1.txt question2.txt question3.txt", h: "cd et touch" },
        { q: "7. Visualisez l’arborescence.", c: "tree", h: "tree" }
    ]},
    { title: "TD1 Ex3: Chemins", missions: [
        { q: "Revenez dans TD_SE1.", c: "cd ../..", h: "cd ../.." },
        { q: "1. Déplacez-vous dans qcm1 en une seule commande.", c: "cd eval/qcm1", h: "cd chemin" },
        { q: "2. Si vous utilisez cd sans paramètre ?", c: "cd", h: "Retour home" },
        { q: "3. Allez dans qcm1 (chemin absolu).", c: "cd ~/TD_SE1/eval/qcm1", h: "cd ~/chemin" },
        { q: "4. Allez dans le répertoire « grand-parent ».", c: "cd ../..", h: "cd ../.." },
        { q: "5. Donnez le chemin absolu actuel.", c: "pwd", h: "pwd" }
    ]},
    { title: "TD1 Ex4: Suppression", missions: [
        { q: "Allez dans qcm1.", c: "cd eval/qcm1", h: "cd eval/qcm1" },
        { q: "2. Supprimer le répertoire qcm2.", c: "rmdir ../qcm2", h: "rmdir ../nom" },
        { q: "3. Allez dans TD_SE1. Dupliquez qcm1 sous le nom qcm2.", c: "cd ../..; cp -r eval/qcm1 eval/qcm2", h: "cd; cp -r src dest" },
        { q: "4. Déplacez-vous dans qcm2.", c: "cd eval/qcm2", h: "cd chemin" },
        { q: "5. Supprimez les fichiers commençant par controle.", c: "rm controle*", h: "rm motif*" },
        { q: "6. Créez le fichier caché .reponses.txt.", c: "touch .reponses.txt", h: "touch .nom" },
        { q: "7. Affichez tout (y compris cachés) en format long.", c: "ls -la", h: "ls -la" },
        { q: "8. Supprimez le dossier qcm1 et son contenu.", c: "rm -rf ../qcm1", h: "rm -rf chemin" }
    ]},
    { title: "TD1 Ex5: Jokers", missions: [
        { q: "Allez dans eval.", c: "cd ..", h: "cd .." },
        { q: "1. Créez: qcm1.doc Qcm2.txt QCm3.txt QCM4.doc.", c: "touch qcm1.doc Qcm2.txt QCm3.txt QCM4.doc", h: "touch f1 f2..." },
        { q: "2. Affichez fichiers commençant par Q majuscule.", c: "ls Q*", h: "ls Q*" },
        { q: "3. Affichez fichiers dont la 3ème lettre est M.", c: "ls ??M*", h: "ls ??M*" },
        { q: "4. Affichez fichiers finissant par .txt", c: "ls *.txt", h: "ls *.txt" },
        { q: "5. Supprimez ces fichiers créés.", c: "rm *", h: "rm *" }
    ]},
    { title: "TD1 Ex6: All", missions: [
        { q: "1. Déplacez-vous dans qcm2.", c: "cd ../qcm2", h: "cd ../qcm2" },
        { q: "3. Supprimez TD4, TD5 et TD6.", c: "rm -rf ../../TD4 ../../TD5 ../../TD6", h: "rm -rf chemins" },
        { q: "4. Affichez l’ensemble de TD_SE1 récursivement.", c: "ls -lR ../..", h: "ls -lR chemin" },
        { q: "5. Allez home, supprimer TD_SE1.", c: "cd ~; rm -rf TD_SE1", h: "cd ~; rm -rf TD_SE1" }
    ]},
    { title: "TD2 Ex1: Octal", missions: [
        { q: "Ex1 Q1. Créez un fichier 'data.txt'", c: "touch data.txt", h: "touch" },
        { q: "Ex1 Q2. Mettez les droits en Lecture/Écriture/Exécution pour TOUS (777)", c: "chmod 777 data.txt", h: "rwx = 7" },
        { q: "Ex1 Q3. Mettez Lecture/Écriture pour le propriétaire, Lecture seule pour les autres (644)", c: "chmod 644 data.txt", h: "rw-r--r--" },
        { q: "Ex1 Q4. Mettez Tous les droits propriétaire, Lecture/Exécution groupe/autres (755)", c: "chmod 755 data.txt", h: "rwxr-xr-x" },
        { q: "Ex1 Q5. Propriétaire seulement : Lecture/Écriture (600)", c: "chmod 600 data.txt", h: "rw-------" },
        { q: "Ex1 Q6. Propriétaire seulement : Tout (700)", c: "chmod 700 data.txt", h: "rwx------" },
        { q: "Ex1 Q7. Lecture seule pour tout le monde (444)", c: "chmod 444 data.txt", h: "r--r--r--" },
        { q: "Ex1 Q8. Aucun droit pour personne (000)", c: "chmod 000 data.txt", h: "---------" }
    ]},
    { title: "TD2 Ex2: Symbolique", missions: [
        { q: "Ex2 Q1. Ajoutez le droit d'exécution (x) à l'utilisateur (u)", c: "chmod u+x data.txt", h: "u+x" },
        { q: "Ex2 Q2. Retirez le droit d'écriture (w) au groupe (g)", c: "chmod g-w data.txt", h: "g-w" },
        { q: "Ex2 Q3. Ajoutez lecture (r) pour les autres (o)", c: "chmod o+r data.txt", h: "o+r" },
        { q: "Ex2 Q4. Ajoutez exécution (x) pour tout le monde (a)", c: "chmod a+x data.txt", h: "a+x" },
        { q: "Ex2 Q5. Fixez les droits du groupe exactement à lecture (g=r)", c: "chmod g=r data.txt", h: "g=r" },
        { q: "Ex2 Q6. Retirez lecture et exécution aux autres (o-rx)", c: "chmod o-rx data.txt", h: "o-rx" },
        { q: "Ex2 Q7. Ajoutez écriture au groupe et aux autres (go+w)", c: "chmod go+w data.txt", h: "go+w" },
        { q: "Ex2 Q8. Retirez tous les droits à tout le monde (a-rwx)", c: "chmod a-rwx data.txt", h: "a-rwx" }
    ]},
    { title: "TD2 Ex3: Owners", missions: [
        { q: "Ex3 Q1. Créez un dossier 'partage'", c: "mkdir partage", h: "mkdir" },
        { q: "Ex3 Q2. Changez le propriétaire de data.txt vers 'root'", c: "chown root data.txt", h: "chown user file" },
        { q: "Ex3 Q3. Changez le groupe de data.txt vers 'root'", c: "chgrp root data.txt", h: "chgrp group file" },
        { q: "Ex3 Q4. Changez propriétaire ET groupe en une fois (root:root)", c: "chown root:root data.txt", h: "chown user:group file" },
        { q: "Ex3 Q5. Changez récursivement le propriétaire de 'partage' (option -R)", c: "chown -R root partage", h: "chown -R" },
        { q: "Ex3 Q6. Remettez le propriétaire 'admin' sur data.txt", c: "chown admin data.txt", h: "chown user" },
        { q: "Ex3 Q7. Changez le groupe de 'partage' vers 'users'", c: "chgrp users partage", h: "chgrp users" },
        { q: "Ex3 Q8. Vérifiez les propriétaires (ls -l)", c: "ls -l", h: "ls -l" }
    ]},
    { title: "TD2 Ex4: Umask", missions: [
        { q: "Ex4 Q1. Affichez le masque actuel", c: "umask", h: "umask" },
        { q: "Ex4 Q2. Définissez le masque pour interdire l'écriture aux autres (002)", c: "umask 002", h: "002" },
        { q: "Ex4 Q3. Créez 'test1.txt' pour tester le masque", c: "touch test1.txt", h: "touch" },
        { q: "Ex4 Q4. Définissez le masque très restrictif (077)", c: "umask 077", h: "077" },
        { q: "Ex4 Q5. Créez 'test2.txt'", c: "touch test2.txt", h: "touch" },
        { q: "Ex4 Q6. Vérifiez les droits créés", c: "ls -l", h: "ls -l" },
        { q: "Ex4 Q7. Remettez le masque par défaut (022)", c: "umask 022", h: "022" },
        { q: "Ex4 Q8. Supprimez les fichiers tests", c: "rm test1.txt test2.txt", h: "rm" }
    ]},
    { title: "TD2 Ex5: Dirs", missions: [
        { q: "Ex5 Q1. Créez un dossier 'secu'", c: "mkdir secu", h: "mkdir" },
        { q: "Ex5 Q2. Interdisez l'entrée dans 'secu' (retirer x)", c: "chmod u-x secu", h: "u-x" },
        { q: "Ex5 Q3. Essayez d'entrer dans 'secu'", c: "cd secu", h: "ça devrait échouer" },
        { q: "Ex5 Q4. Remettez le droit d'entrée", c: "chmod u+x secu", h: "u+x" },
        { q: "Ex5 Q5. Entrez dans 'secu'", c: "cd secu", h: "cd" },
        { q: "Ex5 Q6. Créez fichier 'pass.log'", c: "touch pass.log", h: "touch" },
        { q: "Ex5 Q7. Interdisez la lecture du dossier 'secu' (retirer r)", c: "chmod u-r .", h: "u-r" },
        { q: "Ex5 Q8. Revenez au parent", c: "cd ..", h: "cd .." }
    ]},
    { title: "TD2 Ex6: Final", missions: [
        { q: "Ex6 Q1. Créez dossier 'final'", c: "mkdir final", h: "mkdir" },
        { q: "Ex6 Q2. Créez fichiers f1 f2 f3 dans 'final'", c: "touch final/f1 final/f2 final/f3", h: "touch" },
        { q: "Ex6 Q3. Mettez tout 'final' en 700 récursivement", c: "chmod -R 700 final", h: "chmod -R" },
        { q: "Ex6 Q4. Donnez f1 à root", c: "chown root final/f1", h: "chown" },
        { q: "Ex6 Q5. Mettez f2 en lecture seule (444)", c: "chmod 444 final/f2", h: "444" },
        { q: "Ex6 Q6. Mettez f3 en exécution seulement (111)", c: "chmod 111 final/f3", h: "111" },
        { q: "Ex6 Q7. Affichez les détails", c: "ls -lR final", h: "ls -lR" },
        { q: "Ex6 Q8. Supprimez tout le dossier 'final'", c: "rm -rf final", h: "rm -rf" }
    ]},
    { title: "TD3: I/O & Pipes", missions: [
        { q: "1. Redirigez 'Hello' dans 'msg.txt'", c: "echo Hello > msg.txt", h: ">" },
        { q: "2. Ajoutez 'World' à la suite (append)", c: "echo World >> msg.txt", h: ">>" },
        { q: "3. Affichez le contenu de msg.txt", c: "cat msg.txt", h: "cat" },
        { q: "4. Listez /etc et sauvez le résultat dans 'liste.txt'", c: "ls /etc > liste.txt", h: "ls > fichier" },
        { q: "5. Comptez les lignes de liste.txt", c: "wc -l liste.txt", h: "wc -l" },
        { q: "6. Affichez les 5 premières lignes", c: "head -n 5 liste.txt", h: "head -n" },
        { q: "7. Affichez les 3 dernières lignes", c: "tail -n 3 liste.txt", h: "tail -n" },
        { q: "8. PIPE: Listez /bin et comptez les lignes directement", c: "ls /bin | wc -l", h: "|" },
        { q: "9. Cherchez 'bash' dans /bin avec un pipe", c: "ls /bin | grep bash", h: "grep" },
        { q: "10. Triez le fichier liste.txt", c: "sort liste.txt", h: "sort" },
        { q: "11. Supprimez les fichiers temporaires", c: "rm msg.txt liste.txt", h: "rm" }
    ]},
    { title: "TD4 Ex1: Processus", missions: [
        { q: "1. Affichez la liste des processus en cours", c: "ps", h: "ps" },
        { q: "2. Affichez tous les processus avec détails (aux)", c: "ps aux", h: "ps aux" },
        { q: "3. Lancez la commande 'sleep 500' en arrière-plan (&)", c: "sleep 500 &", h: "cmd &" },
        { q: "4. Affichez les jobs en arrière-plan", c: "jobs", h: "jobs" },
        { q: "5. Ramenez le job au premier plan (fg)", c: "fg", h: "fg" },
        { q: "6. (Simulé) Stoppez le avec Ctrl+Z (tapez ctrlz)", c: "ctrlz", h: "Taper ctrlz" },
        { q: "7. Relancez le dernier job en arrière-plan (bg)", c: "bg", h: "bg" },
        { q: "8. Tuez le processus PID 1234", c: "kill 1234", h: "kill PID" },
        { q: "9. Forcez l'arrêt du processus 9999 (SIGKILL)", c: "kill -9 9999", h: "kill -9" }
    ]},
    { title: "TD4 Ex2: Archives", missions: [
        { q: "1. Créez un dossier 'projet'", c: "mkdir projet", h: "mkdir" },
        { q: "2. Créez 3 fichiers f1 f2 f3 dans 'projet'", c: "touch projet/f1 projet/f2 projet/f3", h: "touch" },
        { q: "3. Créez une archive TAR nommée 'save.tar' de 'projet'", c: "tar -cvf save.tar projet", h: "tar -cvf" },
        { q: "4. Affichez le contenu de l'archive tar", c: "tar -tf save.tar", h: "tar -tf" },
        { q: "5. Compressez l'archive avec GZIP", c: "gzip save.tar", h: "gzip" },
        { q: "6. Renommez save.tar.gz en backup.tar.gz", c: "mv save.tar.gz backup.tar.gz", h: "mv" },
        { q: "7. Décompressez le fichier GZIP", c: "gunzip backup.tar.gz", h: "gunzip" },
        { q: "8. Extrayez l'archive TAR", c: "tar -xvf backup.tar", h: "tar -xvf" }
    ]},
    { title: "TD4 Ex3: Système", missions: [
        { q: "1. Affichez le nom de la machine", c: "hostname", h: "hostname" },
        { q: "2. Affichez le noyau Linux utilisé", c: "uname -r", h: "uname -r" },
        { q: "3. Affichez l'espace disque disponible", c: "df -h", h: "df -h" },
        { q: "4. Affichez l'utilisation de la mémoire RAM", c: "free -h", h: "free -h" },
        { q: "5. Affichez les 5 dernières lignes de 'access.log'", c: "tail -n 5 access.log", h: "tail -n 5" },
        { q: "6. Affichez les messages du noyau (dmesg)", c: "dmesg", h: "dmesg" },
        { q: "7. Affichez votre historique de commandes", c: "history", h: "history" },
        { q: "8. Affichez le temps de fonctionnement (uptime)", c: "uptime", h: "uptime" }
    ]},
    { title: "TD5: TAD Carnet", missions: [
        { q: "1. Créer le répertoire 'carnet' et y accéder", c: "mkdir carnet && cd carnet", h: "mkdir ... && cd ..." },
        { q: "2. Compilez 'main.c' pour créer 'carnet_app'", c: "gcc main.c -o carnet_app", h: "gcc fichier.c -o executable" },
        { q: "3. Initialisez l'application", c: "./carnet_app init", h: "./nom_executable commande" },
        { q: "4. Ajoutez le contact 'Yassine'", c: "./carnet_app add Yassine", h: "add [Nom]" },
        { q: "5. Vérifiez la taille du carnet", c: "./carnet_app taille", h: "taille" }
    ]}
];

class VirtualFS {
    constructor() {
        this.root = {
            type: 'dir',
            children: {
                'home': { type: 'dir', children: { 
                    'etudiant': { type: 'dir', children: {
                        'TP_L3': { type: 'dir', children: { 'sys':{type:'dir',children:{}}, 'reseau':{type:'dir',children:{}} } }
                    }} 
                }},
                'bin': { type: 'dir', children: { 'bash':{}, 'ls':{}, 'mkdir':{} } },
                'var': { type: 'dir', children: { 'log':{type:'dir', children:{ 'access.log':{type:'file', content:'Log entry 1\nLog entry 2'} } } } },
                'etc': { type: 'dir', children: { 'passwd':{type:'file', content:'root:x:0:0:root\nuser:x:1000:1000:user'} } }
            }
        };
        this.currentPath = ['home', 'etudiant'];
    }
    
    pwd() { return "/" + this.currentPath.join("/"); }
    
    getCurrentNode() {
        let node = this.root;
        for (let dir of this.currentPath) {
            if (node.children && node.children[dir]) node = node.children[dir];
            else return null;
        }
        return node;
    }

    list(args) {
        let node = this.getCurrentNode();
        if(!node || !node.children) return "";
        let output = "";
        let keys = Object.keys(node.children).sort();
        for(let k of keys) {
            let item = node.children[k];
            if(args && (args.includes("-l") || args.includes("-lR"))) output += `drwxr-xr-x user user 4096 Jan 1 12:00 ${k}\n`;
            else output += item.type==='dir' ? `<span style='color:#729fcf'>${k}</span>  ` : `${k}  `;
        }
        return output;
    }

    mkdir(names) {
        let node = this.getCurrentNode();
        let list = Array.isArray(names) ? names : [names];
        list.filter(n=>!n.startsWith('-')).forEach(name => {
            if(name.includes('/')) {
                let p = name.split('/');
                if(!node.children[p[0]]) node.children[p[0]] = { type: 'dir', children: {} };
                if(p[1]) node.children[p[0]].children[p[1]] = { type: 'dir', children: {} };
            } else {
                if(!node.children[name]) node.children[name] = { type: 'dir', children: {} };
            }
        });
    }

    touch(names) {
        let node = this.getCurrentNode();
        names.forEach(name => {
             if(name.includes('/')) {
                 let p = name.split('/');
                 if(node.children[p[0]]) node.children[p[0]].children[p[1]] = {type:'file'};
             } else {
                 if(!node.children[name]) node.children[name] = { type: 'file', content: '' };
             }
        });
    }

    cd(pathStr) {
        if(!pathStr || pathStr === "~") { this.currentPath = ['home', 'etudiant']; return; }
        if(pathStr === "..") { if(this.currentPath.length > 0) this.currentPath.pop(); return; }
        
        let parts = pathStr.split('/');
        let temp = [...this.currentPath];
        let curr = this.getCurrentNode();
        
        for(let p of parts) {
            if(p === "..") { if(temp.length>0) temp.pop(); }
            else if(p !== "." && p !== "") {
                 if(curr.children && curr.children[p] && curr.children[p].type === 'dir') {
                     temp.push(p);
                     curr = curr.children[p];
                 } else return `bash: cd: ${p}: No directory`;
            }
        }
        this.currentPath = temp;
    }

    rm(args) {
        let node = this.getCurrentNode();
        args.filter(a=>!a.startsWith('-')).forEach(f => {
            if(f==="*") node.children = {};
            else if(f.endsWith('*')) {
                let prefix = f.replace('*','');
                Object.keys(node.children).forEach(k => {
                    if(k.startsWith(prefix)) delete node.children[k];
                });
            }
            else if(node.children[f]) delete node.children[f];
            else if(f.includes('/')) {
                let p = f.split('/');
                if(node.children[p[0]] && node.children[p[0]].children[p[1]]) 
                    delete node.children[p[0]].children[p[1]];
            }
        });
    }
}
const vfs = new VirtualFS();

window.previewBg = function(os) {
    if(!document.getElementById('distro-layer').classList.contains('hidden')) {
        document.body.style.backgroundImage = BG_URLS[os];
    }
}

window.startSession = function() {
    const u = document.getElementById('username').value.trim();
    if(u) {
        user = u;
        document.getElementById('login-layer').classList.add('hidden');
        document.getElementById('distro-layer').classList.remove('hidden');
        initAudio();
    } else {
        document.getElementById('username').classList.add('error');
    }
}

window.boot = function(d) {
    distro = d;
    document.body.className = d;
    document.body.style.backgroundImage = BG_URLS[d];
    document.getElementById('distro-layer').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    document.getElementById('logo').src = LOGOS[d];
    document.getElementById('os-title').innerText = d.toUpperCase();
    document.getElementById('user-display').innerText = user;

    writeLine(`Bienvenue sur ${d.toUpperCase()} 22.04 LTS.`);
    writeLine(`Linerx V6.02`);
    writeLine("");

    loadProgress();
    renderNav();
    updateUI(); 
    renderPrompt(); 
    focusInput();
    setInterval(() => { seconds++; timerEl.innerText = new Date(seconds * 1000).toISOString().substr(14, 5); }, 1000);
}

function renderPrompt() {
    let path = vfs.pwd().replace('/home/etudiant', '~');
    kaliHeader.innerHTML = "";
    kaliHeader.classList.add('hidden');
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
        let path = vfs.pwd().replace('/home/etudiant', '~');
        
        let staticPrompt = "";
        if(distro === 'kali') staticPrompt = `<div><span class="k-blue">┌──(${user}㉿kali)-[${path}]</span></div><div><span class="k-blue">└─$</span> ${val}</div>`;
        else if (distro === 'arch') staticPrompt = `<span class="a-gray">[</span><span class="a-white">${user}@arch</span> <span class="a-white">${path}</span><span class="a-gray">]$</span> ${val}`;
        else staticPrompt = `<span class="p-green">${user}@${distro}</span>:<span class="p-blue">${path}</span>$ ${val}`;
        
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
    // HISTORY
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
    div.innerHTML = txt; 
    if(color) div.style.color = color;
    else div.style.color = '#ddd';
    div.style.marginBottom = "5px";
    div.style.whiteSpace = "pre-wrap";
    historyDiv.appendChild(div);
}

function processCmd(cmdRaw) {
    const parts = cmdRaw.split(' ');
    const main = parts[0];
    const args = parts.slice(1);

    if(main === "clear") historyDiv.innerHTML = "";
    else if(main === "ls") writeLine(vfs.list(args));
    else if(main === "cd") { let e=vfs.cd(args[0]); if(e) writeLine(e, "red"); renderPrompt(); }
    else if(main === "mkdir") vfs.mkdir(args);
    else if(main === "touch") vfs.touch(args);
    else if(main === "rm" || main === "rmdir") vfs.rm(args);
    else if(main === "pwd") writeLine(vfs.pwd());
    
    // VISUAL FIXES
    else if(main === "ls" && args.includes("-lR")) writeLine(".\\n..\\nTD1\\nTD2...");
    else if(main === "tree") writeLine(".\\n├── TD_SE1\\n│   ├── TD1\\n│   └── eval");
    else if(main === "mv") writeLine("[Mv executed]");
    else if(main === "cp") writeLine("[Cp executed]");
    
    // FAKES
    else if(["gcc","./carnet_app","ps","top","kill","bg","fg","jobs","chmod","chown","chgrp","umask","gzip","gunzip","tar"].includes(main)) writeLine("[Action Simulated OK]");
    else if(["df","free","uname","hostname","uptime","dmesg","history"].includes(main)) writeLine("[Info Displayed]");
    else if(main === "sleep") writeLine("");
    else if(main === "ctrlz") writeLine("[Stopped]");
    else if(main === "cat") writeLine("Contenu du fichier...");
    else if(main === "echo") writeLine("");

    else if(main !== "cd" && !curriculum[currentTD].missions[currentEx].c.startsWith(main)) {
        if(!cmdRaw.includes("&&") && !cmdRaw.includes(";")) writeLine("Commande introuvable", "red");
    }

    checkMission(cmdRaw);
}

function checkMission(cmd) {
    if(currentTD >= curriculum.length) return;
    const miss = curriculum[currentTD].missions[currentEx];
    const clean = cmd.replace(/\\s+/g, ' ').trim();
    
    let match = false;
    
    if(clean === miss.c) match = true;
    else {
        let keywords = miss.c.split(/[ ;]+/);
        let hits = 0;
        keywords.forEach(k => { if(clean.includes(k)) hits++; });
        if(hits >= keywords.length * 0.8) match = true;
    }

    if(match) {
        writeLine("✅ CORRECT !", "#0f0");
        currentEx++;
        if(currentEx >= curriculum[currentTD].missions.length) {
            writeLine(`🚀 ${curriculum[currentTD].title} TERMINÉ !`, "yellow");
            currentTD++;
            currentEx = 0;
            renderNav();
        }
        updateUI();
        saveData();
    }
}

window.focusInput = function() { cmdInput.focus(); }

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
    if(currentTD >= curriculum.length) { document.getElementById('objective').innerText = "TOUT EST FINI !"; return; }
    const m = curriculum[currentTD].missions[currentEx];
    document.getElementById('chapter-title').innerText = curriculum[currentTD].title;
    document.getElementById('objective').innerText = m.q;
    const pct = (currentEx / curriculum[currentTD].missions.length) * 100;
    document.getElementById('bar').style.width = pct + "%";
}

window.showHint = function() { document.getElementById('msg').innerText = "Indice: " + curriculum[currentTD].missions[currentEx].h; }
window.solve = function() { cmdInput.value = curriculum[currentTD].missions[currentEx].c; cmdInput.focus(); }
window.saveData = function() { localStorage.setItem('linux_v42_'+user, JSON.stringify({t: currentTD, e: currentEx})); writeLine("Sauvegardé."); }
window.loadProgress = function() { const d = JSON.parse(localStorage.getItem('linux_v42_'+user)); if(d) { currentTD = d.t; currentEx = d.e; } }
window.resetAll = function() { if(confirm("Reset ?")) { localStorage.removeItem('linux_v42_'+user); location.reload(); } }
