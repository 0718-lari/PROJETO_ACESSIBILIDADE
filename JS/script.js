function cadastrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const deficiencia = document.getElementById('deficiencia').value;

    const usuario = {
        nome: nome,
        email: email,
        senha: senha,
        deficiencia: deficiencia
    };

    localStorage.setItem('usuario', JSON.stringify(usuario));
    alert("Cadastro realizado com sucesso!");

    window.location.href = "login.html";
}

function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const usuarioSalvo = localStorage.getItem('usuario');

    if (!usuarioSalvo) {
        alert("Nenhum usuário cadastrado. Por favor, cadastre-se primeiro.");
        return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    if (email === usuario.email && senha === usuario.senha) {
        localStorage.setItem("sessaoAtiva", "true");
        alert("Login realizado com sucesso!");
        window.location.href = "home.html";
    } else {
        alert("Email ou senha incorretos. Tente novamente.");
    }
}

function carregarHome() {
    const usuarioSalvo = localStorage.getItem('usuario');
    const sessaoAtiva = localStorage.getItem("sessaoAtiva");

    if (!usuarioSalvo || sessaoAtiva !== "true") {
        window.location.href = "login.html";
        return;
    }

    const usuario = JSON.parse(usuarioSalvo);
    const nomeUsuario = document.getElementById("nomeUsuario");

    if (nomeUsuario) {
        nomeUsuario.textContent = usuario.nome;
    }

    carregarRecursos(usuario.deficiencia);
}

function definirImagemLocal(titulo) {
    const imagens = {
        "Pisos táteis": "/IMG/pisos-tateis.png",
        "Semáforos sonoros": "/IMG/semaforos-sonoros.png",
        "Rotas acessíveis": "/IMG/rotas-acessiveis.png",
        "Semáforos visuais": "/IMG/semaforos-visuais.png",
        "Alertas visuais": "/IMG/alertas-visuais.png",
        "Rampas acessíveis": "/IMG/rampas-acessiveis.png",
        "Elevadores": "/IMG/elevadores.png",
        "Rotas sem barreiras": "/IMG/rotas-sem-barreiras.png",
        "Rotas simplificadas": "/IMG/rotas-simplificadas.png",
        "Pontos de referência": "/IMG/pontos-referencia.png",
        "Orientações": "/IMG/orientacoes.png",
        "Acessibilidade física": "/IMG/acessibilidade-fisica.png",
        "Sinalização acessível": "/IMG/sinalizacao-acessivel.png"
    };

    return imagens[titulo] || "/IMG/acessibilidade-fisica.png";
}

function carregarRecursos(deficiencia) {
    const recursosContainer = document.getElementById("recursosContainer");

    if (!recursosContainer) {
        return;
    }

    const recursos = {
        visual: [
            {
                icone: "🦯",
                titulo: "Pisos táteis",
                descricao: "Encontra informações sobre pisos táteis disponíveis nas proximidades."
            },

            {
                icone: "🔊",
                titulo: "Semáforos sonoros",
                descricao: "Consulte semáforos que possuem sinalização sonora."
            },

            {
                icone: "🗺",
                titulo: "Rotas acessíveis",
                descricao: "Encontre rotas adaptadas para facilitar sua locomoção."
            }
        ],

        auditiva: [
            {
                icone: "🚦",
                titulo: "Semáforos visuais",
                descricao: "Encontre informações sobre semáforos com sinalização visual."
            },
            {
                icone: "🔔",
                titulo: "Alertas visuais",
                descricao: "Receba informações importantes por meio de notificações visuais."
            },
            {
                icone: "🗺️",
                titulo: "Rotas acessíveis",
                descricao: "Encontre rotas adaptadas para sua necessidade."
            }
        ],

        motora: [
            {
                icone: "♿",
                titulo: "Rampas acessíveis",
                descricao: "Encontre locais com rampas e acessos adaptados."
            },
            {
                icone: "🛗",
                titulo: "Elevadores",
                descricao: "Consulte locais que possuem elevadores acessíveis."
            },
            {
                icone: "🗺️",
                titulo: "Rotas sem barreiras",
                descricao: "Encontre caminhos com menos obstáculos físicos."
            }
        ],

        intelectual: [
            {
                icone: "🗺️",
                titulo: "Rotas simplificadas",
                descricao: "Encontre rotas com informações simples e objetivas."
            },
            {
                icone: "📍",
                titulo: "Pontos de referência",
                descricao: "Consulte pontos de referência para facilitar a orientação."
            },
            {
                icone: "🔔",
                titulo: "Orientações",
                descricao: "Receba informações importantes para sua locomoção."
            }
        ],

        multipla: [
            {
                icone: "♿",
                titulo: "Acessibilidade física",
                descricao: "Encontre locais com rampas, elevadores e acessos adaptados."
            },
            {
                icone: "🔊",
                titulo: "Sinalização acessível",
                descricao: "Consulte equipamentos com recursos sonoros e visuais."
            },
            {
                icone: "🗺️",
                titulo: "Rotas acessíveis",
                descricao: "Encontre rotas adaptadas para diferentes necessidades."
            }
        ]
    }
    const recursosUsuario = recursos[deficiencia];

if (!recursosUsuario){
    return;
}

recursosContainer.innerHTML = "";

recursosUsuario.forEach(function (recurso) {
    const card = document.createElement("div");
    const imagem = definirImagemLocal(recurso.titulo);

    card.classList.add("resource-card");

    card.innerHTML = `
        <div class="resource-image-container">
            <img
                class="resource-image"
                src="${imagem}"
                loading="lazy"
                alt="Imagem ilustrativa de ${recurso.titulo}"
            >
        </div>

        <h3>${recurso.titulo}</h3>
        <p>${recurso.descricao}</p>
    `;

    recursosContainer.appendChild(card);
});
};

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");

    function aplicarTema(tema) {
        const escuro = tema === "escuro";
        
        document.body.classList.toggle("dark-theme", escuro);
        themeToggle.textContent = escuro ? "🌞" : "🌙";
        themeToggle.setAttribute("aria-label", escuro ? "Mudar para tema claro" : "Mudar para tema escuro");
    }

    const temaSalvo = localStorage.getItem("tema") || "claro";
    aplicarTema(temaSalvo);

    themeToggle.addEventListener("click", function () {
        const novoTema = document.body.classList.contains("dark-theme") ? "claro" : "escuro";
        localStorage.setItem("tema", novoTema);
        aplicarTema(novoTema);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const notificationButton = document.getElementById("notificationButton");
    const notificationPanel = document.getElementById("notificationPanel");

    notificationButton.addEventListener("click", () => {
        const estaAberto = !notificationPanel.hidden;

        notificationPanel.hidden = estaAberto;
        notificationButton.setAttribute("aria-expanded", String(!estaAberto));
    });

    document.addEventListener("click", (event) => {
        const clicouForaDoPainel = !notificationPanel.contains(event.target);
        const clicouForaDoBotao = !notificationButton.contains(event.target);

        if (clicouForaDoPainel && clicouForaDoBotao) {
            notificationPanel.hidden = true;
            notificationButton.setAttribute("aria-expanded", "false");
        }
    });
});

function fazerLogout(){
    const confirmar = confirm("Deseja realmente sair da sua conta?");

    if(!confirmar){
        return;
    }

    localStorage.removeItem("sessaoAtiva");
    window.location.href = "login.html";
}

function carregarPerfil() {
    const usuarioSalvo = localStorage.getItem("usuario");
    const sessaoAtiva = localStorage.getItem("sessaoAtiva");

    if (!usuarioSalvo || sessaoAtiva !== "true") {
        window.location.href = "login.html";
        return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    const tiposDeficiencia = {
        visual: "Deficiência visual",
        auditiva: "Deficiência auditiva",
        motora: "Deficiência físico-motora",
        intelectual: "Deficiência intelectual",
        multipla: "Deficiência múltipla"
    };

    document.getElementById("perfilNome").textContent = usuario.nome;
    document.getElementById("perfilNomeCompleto").textContent = usuario.nome;
    document.getElementById("perfilEmail").textContent = usuario.email;
    document.getElementById("perfilDeficiencia").textContent =
        tiposDeficiencia[usuario.deficiencia];
}

function carregarNotificacoes() {
    const notificationList = document.getElementById("notificationList");

    if (!notificationList) {
        return;
    }

    const notificacoes = [
        {
            titulo: "🚧 Alerta de obras",
            mensagem: "Há obras na Avenida Central. Utilize caminhos alternativos."
        },
        {
            titulo: "🗺️ Nova rota acessível",
            mensagem: "Uma rota com rampas foi adicionada perto da Praça Principal."
        },
        {
            titulo: "🔔 Aviso importante",
            mensagem: "Verifique as condições de acessibilidade antes de iniciar o trajeto."
        }
    ];

    notificationList.innerHTML = "";

    notificacoes.forEach((notificacao) => {
        const item = document.createElement("div");
        item.classList.add("notification-item");

        item.innerHTML = `
            <strong>${notificacao.titulo}</strong>
            <span>${notificacao.mensagem}</span>
        `;

        notificationList.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", carregarNotificacoes);