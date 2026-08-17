// ==============================
// CADASTRO
// ==============================

function cadastrarUsuario(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;
    const deficiencia = document.getElementById("deficiencia").value;

    if (!nome || !email || !senha || !deficiencia) {
        alert("Preencha todos os campos.");
        return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
        alert("Digite um e-mail válido.");
        return;
    }

    if (senha.length < 6) {
        alert("A senha deve possuir pelo menos 6 caracteres.");
        return;
    }

    const usuariosSalvos =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioExistente =
        usuariosSalvos.find(function (usuario) {
            return usuario.email === email;
        });

    if (usuarioExistente) {
        alert("Este e-mail já está cadastrado.");
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha,
        deficiencia: deficiencia
    };

    usuariosSalvos.push(novoUsuario);

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosSalvos)
    );

    localStorage.removeItem("sessaoAtiva");
    localStorage.removeItem("usuarioLogado");

    alert("Cadastro realizado com sucesso!");

    window.location.href = "login.html";
}


// ==============================
// LOGIN
// ==============================

function fazerLogin(event) {

    event.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const senha = document
        .getElementById("senha")
        .value;

    const usuariosSalvos =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuariosSalvos.length === 0) {

        alert(
            "Nenhum usuário cadastrado. Por favor, cadastre-se primeiro."
        );

        return;
    }

    const usuarioEncontrado =
        usuariosSalvos.find(function (usuario) {
            return usuario.email === email;
        });

    if (!usuarioEncontrado) {

        alert(
            "E-mail ou senha incorretos. Tente novamente."
        );

        return;
    }

    if (usuarioEncontrado.senha !== senha) {

        alert(
            "E-mail ou senha incorretos. Tente novamente."
        );

        return;
    }

    localStorage.setItem(
        "sessaoAtiva",
        "true"
    );

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioEncontrado)
    );

    alert("Login realizado com sucesso!");

    window.location.href = "home.html";
}


// ==============================
// VERIFICAR SESSÃO
// ==============================

function verificarSessao() {

    const usuarioLogado =
        localStorage.getItem("usuarioLogado");

    const sessaoAtiva =
        localStorage.getItem("sessaoAtiva");

    if (!usuarioLogado || sessaoAtiva !== "true") {

        window.location.href = "login.html";

        return false;
    }

    try {

        JSON.parse(usuarioLogado);

    } catch (erro) {

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("sessaoAtiva");

        window.location.href = "login.html";

        return false;
    }

    return true;
}


// ==============================
// HOME
// ==============================

function carregarHome() {

    if (!verificarSessao()) {
        return;
    }

    const usuarioLogado =
        localStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
        return;
    }

    let usuario;

    try {

        usuario = JSON.parse(usuarioLogado);

    } catch (erro) {

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("sessaoAtiva");

        window.location.href = "login.html";

        return;
    }

    const nomeUsuario =
        document.getElementById("nomeUsuario");

    if (nomeUsuario) {

        nomeUsuario.textContent =
            usuario.nome;
    }

    carregarRecursosAssincrono(
        usuario.deficiencia
    );
}


// ==============================
// CARREGAR RECURSOS ASSÍNCRONO
// ==============================

function carregarRecursosAssincrono(deficiencia) {

    const recursosContainer =
        document.getElementById("recursosContainer");

    if (!recursosContainer) {
        return;
    }

    recursosContainer.innerHTML = `
        <div class="loading-message">
            <span aria-hidden="true">⏳</span>
            <p>Carregando recursos de acessibilidade...</p>
        </div>
    `;

    setTimeout(function () {

        carregarRecursos(deficiencia);

    }, 300);
}


// ==============================
// ROTAS ACESSÍVEIS
// ==============================

function carregarRotas() {

    if (!verificarSessao()) {
        return;
    }

    const rotasContainer =
        document.getElementById("rotasContainer");

    if (!rotasContainer) {
        return;
    }

    const usuarioLogado =
        localStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
        return;
    }

    let usuario;

    try {

        usuario = JSON.parse(usuarioLogado);

    } catch (erro) {

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("sessaoAtiva");

        window.location.href = "login.html";

        return;
    }


    const rotas = {

        visual: [

            {
                nome: "Praça Central → Terminal",
                descricao: "Rota com pisos táteis e semáforos sonoros.",
                distancia: "1,2 km",
                tempo: "15 minutos",
                recursos: "Piso tátil • Semáforo sonoro"
            },

            {
                nome: "Praça Central → Hospital",
                descricao: "Caminho com sinalização acessível e poucos obstáculos.",
                distancia: "1,8 km",
                tempo: "22 minutos",
                recursos: "Sinalização • Piso tátil"
            }

        ],

        auditiva: [

            {
                nome: "Praça Central → Terminal",
                descricao: "Rota com sinalização visual nos principais cruzamentos.",
                distancia: "1,2 km",
                tempo: "15 minutos",
                recursos: "Semáforos visuais • Sinalização"
            },

            {
                nome: "Centro → Shopping",
                descricao: "Caminho com informações visuais durante o trajeto.",
                distancia: "2,1 km",
                tempo: "25 minutos",
                recursos: "Alertas visuais • Sinalização"
            }

        ],

        motora: [

            {
                nome: "Praça Central → Terminal",
                descricao: "Rota com rampas e acessos adaptados.",
                distancia: "1,4 km",
                tempo: "18 minutos",
                recursos: "Rampas • Calçadas acessíveis"
            },

            {
                nome: "Centro → Hospital",
                descricao: "Caminho com poucos obstáculos e acesso para cadeirantes.",
                distancia: "1,7 km",
                tempo: "21 minutos",
                recursos: "Rampas • Elevadores"
            }

        ],

        intelectual: [

            {
                nome: "Praça Central → Terminal",
                descricao: "Rota simples com pontos de referência durante o caminho.",
                distancia: "1,2 km",
                tempo: "15 minutos",
                recursos: "Pontos de referência • Orientações"
            },

            {
                nome: "Centro → Hospital",
                descricao: "Caminho simples e fácil de acompanhar.",
                distancia: "1,6 km",
                tempo: "20 minutos",
                recursos: "Orientações • Sinalização"
            }

        ],

        multipla: [

            {
                nome: "Praça Central → Terminal",
                descricao: "Rota adaptada com recursos físicos, sonoros e visuais.",
                distancia: "1,3 km",
                tempo: "17 minutos",
                recursos: "Rampas • Piso tátil • Sinalização"
            },

            {
                nome: "Centro → Hospital",
                descricao: "Caminho com diferentes recursos de acessibilidade.",
                distancia: "1,8 km",
                tempo: "22 minutos",
                recursos: "Rampas • Sinalização • Piso tátil"
            }

        ]

    };


    const rotasUsuario =
        rotas[usuario.deficiencia];

    if (!rotasUsuario) {

        rotasContainer.innerHTML = `
            <p>
                Não foi possível encontrar rotas
                para este perfil.
            </p>
        `;

        return;
    }

    rotasContainer.innerHTML = "";

    rotasUsuario.forEach(function (rota) {

        const card =
            document.createElement("article");

        card.classList.add("route-card");

        card.innerHTML = `

            <div class="route-icon" aria-hidden="true">
                🗺️
            </div>

            <div class="route-content">

                <h3>
                    ${rota.nome}
                </h3>

                <p>
                    ${rota.descricao}
                </p>

                <div class="route-info">

                    <span>
                        📍 ${rota.distancia}
                    </span>

                    <span>
                        ⏱️ ${rota.tempo}
                    </span>

                </div>

                <div class="route-accessibility">

                    <strong>
                        Recursos:
                    </strong>

                    <span>
                        ${rota.recursos}
                    </span>

                </div>

                <button
                    type="button"
                    class="route-button"
                    onclick="selecionarRota('${rota.nome}')"
                >
                    Ver rota
                </button>

            </div>

        `;

        rotasContainer.appendChild(card);

    });

}


// ==============================
// SELECIONAR ROTA
// ==============================

function selecionarRota(nomeRota) {

    const usuarioLogado =
        localStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
        return;
    }

    let usuario;

    try {

        usuario =
            JSON.parse(usuarioLogado);

    } catch (erro) {

        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("sessaoAtiva");

        window.location.href =
            "login.html";

        return;
    }


    localStorage.setItem(
        "rotaSelecionada",
        nomeRota
    );


    localStorage.setItem(
        "acessibilidadeRota",
        usuario.deficiencia
    );


    window.location.href =
        "detalhes-rota.html";
}
// ==============================
// DETALHES DA ROTA
// ==============================

function carregarDetalhesRota() {

    if (!verificarSessao()) {
        return;
    }

    const nomeRota =
        localStorage.getItem("rotaSelecionada");

    const acessibilidade =
        localStorage.getItem("acessibilidadeRota");

    if (!nomeRota || !acessibilidade) {

        window.location.href =
            "rotas.html";

        return;
    }


    // ==============================
    // DETALHES DAS ROTAS
    // ==============================

    const detalhesRotas = {

        // ==================================
        // DEFICIÊNCIA VISUAL
        // ==================================

        visual: {

            "Praça Central → Terminal": {

                nome: "Praça Central → Terminal",

                descricao:
                    "Rota adaptada para pessoas com deficiência visual, com piso tátil e semáforos sonoros durante o trajeto.",

                distancia: "1,2 km",

                tempo: "15 minutos",

                caminho: [
                    "Saída da Praça Central",
                    "Seguir pelo piso tátil da Avenida Central",
                    "Atravessar utilizando o semáforo sonoro",
                    "Continuar pelo caminho com piso tátil",
                    "Chegada ao Terminal"
                ],

                recursos: [
                    "Piso tátil",
                    "Semáforo sonoro",
                    "Calçada acessível"
                ]

            },

            "Praça Central → Hospital": {

                nome: "Praça Central → Hospital",

                descricao:
                    "Caminho com sinalização acessível, piso tátil e poucos obstáculos para facilitar a orientação.",

                distancia: "1,8 km",

                tempo: "22 minutos",

                caminho: [
                    "Saída da Praça Central",
                    "Seguir pelo caminho com piso tátil",
                    "Continuar pela Rua Principal",
                    "Utilizar a sinalização acessível",
                    "Chegada ao Hospital"
                ],

                recursos: [
                    "Piso tátil",
                    "Sinalização acessível",
                    "Calçada acessível"
                ]

            }

        },


        // ==================================
        // DEFICIÊNCIA AUDITIVA
        // ==================================

        auditiva: {

            "Praça Central → Terminal": {

                nome: "Praça Central → Terminal",

                descricao:
                    "Rota com sinalização visual e informações importantes apresentadas de forma visual durante o trajeto.",

                distancia: "1,2 km",

                tempo: "15 minutos",

                caminho: [
                    "Saída da Praça Central",
                    "Seguir pela Avenida Central",
                    "Observar os semáforos visuais",
                    "Acompanhar a sinalização visual",
                    "Chegada ao Terminal"
                ],

                recursos: [
                    "Semáforos visuais",
                    "Sinalização visual",
                    "Alertas visuais"
                ]

            },

            "Centro → Shopping": {

                nome: "Centro → Shopping",

                descricao:
                    "Caminho com informações visuais e alertas para facilitar a orientação durante todo o trajeto.",

                distancia: "2,1 km",

                tempo: "25 minutos",

                caminho: [
                    "Saída do Centro",
                    "Seguir pela Avenida Principal",
                    "Observar os alertas visuais",
                    "Continuar seguindo a sinalização",
                    "Chegada ao Shopping"
                ],

                recursos: [
                    "Alertas visuais",
                    "Sinalização visual",
                    "Painéis informativos"
                ]

            }

        },


        // ==================================
        // DEFICIÊNCIA FÍSICO-MOTORA
        // ==================================

        motora: {

            "Praça Central → Terminal": {

                nome: "Praça Central → Terminal",

                descricao:
                    "Rota com rampas, calçadas acessíveis e caminhos adaptados para pessoas com mobilidade reduzida.",

                distancia: "1,4 km",

                tempo: "18 minutos",

                caminho: [
                    "Saída da Praça Central",
                    "Utilizar a rampa de acesso",
                    "Seguir pela calçada acessível",
                    "Continuar pelo caminho sem obstáculos",
                    "Chegada ao Terminal"
                ],

                recursos: [
                    "Rampas acessíveis",
                    "Calçadas acessíveis",
                    "Rotas sem barreiras"
                ]

            },

            "Centro → Hospital": {

                nome: "Centro → Hospital",

                descricao:
                    "Caminho com poucos obstáculos físicos, rampas e acesso adaptado para facilitar a locomoção.",

                distancia: "1,7 km",

                tempo: "21 minutos",

                caminho: [
                    "Saída do Centro",
                    "Utilizar a rampa de acesso",
                    "Seguir pela calçada acessível",
                    "Utilizar a entrada acessível do Hospital",
                    "Chegada ao Hospital"
                ],

                recursos: [
                    "Rampas acessíveis",
                    "Elevadores",
                    "Calçadas acessíveis"
                ]

            }

        },


        // ==================================
        // DEFICIÊNCIA INTELECTUAL
        // ==================================

        intelectual: {

            "Praça Central → Terminal": {

                nome: "Praça Central → Terminal",

                descricao:
                    "Rota simplificada com orientações objetivas e pontos de referência para facilitar a compreensão do caminho.",

                distancia: "1,2 km",

                tempo: "15 minutos",

                caminho: [
                    "Comece na Praça Central",
                    "Siga pela Avenida Central",
                    "Passe pelo ponto de referência",
                    "Continue seguindo as placas",
                    "Chegada ao Terminal"
                ],

                recursos: [
                    "Rotas simplificadas",
                    "Pontos de referência",
                    "Orientações"
                ]

            },

            "Centro → Hospital": {

                nome: "Centro → Hospital",

                descricao:
                    "Caminho simples e fácil de acompanhar, com orientações objetivas durante o trajeto.",

                distancia: "1,6 km",

                tempo: "20 minutos",

                caminho: [
                    "Comece no Centro",
                    "Siga pela Rua Principal",
                    "Passe pela Praça Central",
                    "Continue seguindo as orientações",
                    "Chegada ao Hospital"
                ],

                recursos: [
                    "Orientações",
                    "Pontos de referência",
                    "Rotas simplificadas"
                ]

            }

        },


        // ==================================
        // DEFICIÊNCIA MÚLTIPLA
        // ==================================

        multipla: {

            "Praça Central → Terminal": {

                nome: "Praça Central → Terminal",

                descricao:
                    "Rota adaptada com diferentes recursos de acessibilidade, incluindo rampas, piso tátil e sinalização.",

                distancia: "1,3 km",

                tempo: "17 minutos",

                caminho: [
                    "Saída da Praça Central",
                    "Utilizar a rampa de acesso",
                    "Seguir pelo piso tátil",
                    "Acompanhar a sinalização acessível",
                    "Chegada ao Terminal"
                ],

                recursos: [
                    "Rampas acessíveis",
                    "Piso tátil",
                    "Sinalização acessível"
                ]

            },

            "Centro → Hospital": {

                nome: "Centro → Hospital",

                descricao:
                    "Caminho com diferentes recursos de acessibilidade para atender a necessidades variadas.",

                distancia: "1,8 km",

                tempo: "22 minutos",

                caminho: [
                    "Saída do Centro",
                    "Utilizar a rampa de acesso",
                    "Seguir pelo caminho acessível",
                    "Acompanhar a sinalização",
                    "Chegada ao Hospital"
                ],

                recursos: [
                    "Rampas acessíveis",
                    "Sinalização acessível",
                    "Piso tátil"
                ]

            }

        }

    };


    // ==============================
    // LOCALIZAR A ROTA
    // ==============================

    const rotasDaDeficiencia =
        detalhesRotas[acessibilidade];

    if (!rotasDaDeficiencia) {

        alert(
            "Não foi possível encontrar rotas para este perfil."
        );

        window.location.href =
            "rotas.html";

        return;
    }


    const rota =
        rotasDaDeficiencia[nomeRota];


    if (!rota) {

        alert(
            "Não foi possível encontrar os detalhes desta rota."
        );

        window.location.href =
            "rotas.html";

        return;
    }


    // ==============================
    // PREENCHER INFORMAÇÕES
    // ==============================

    const rotaTitulo =
        document.getElementById("rotaTitulo");

    const rotaNome =
        document.getElementById("rotaNome");

    const rotaDescricao =
        document.getElementById("rotaDescricao");

    const rotaDistancia =
        document.getElementById("rotaDistancia");

    const rotaTempo =
        document.getElementById("rotaTempo");


    if (rotaTitulo) {

        rotaTitulo.textContent =
            rota.nome;

    }


    if (rotaNome) {

        rotaNome.textContent =
            rota.nome;

    }


    if (rotaDescricao) {

        rotaDescricao.textContent =
            rota.descricao;

    }


    if (rotaDistancia) {

        rotaDistancia.textContent =
            rota.distancia;

    }


    if (rotaTempo) {

        rotaTempo.textContent =
            rota.tempo;

    }


    // ==============================
    // CAMINHO
    // ==============================

    const caminho =
        document.getElementById("rotaCaminho");


    if (caminho) {

        caminho.innerHTML = "";


        rota.caminho.forEach(
            function (etapa, index) {

                const item =
                    document.createElement("div");


                item.classList.add(
                    "route-step"
                );


                item.innerHTML = `

                    <span class="route-step-number">
                        ${index + 1}
                    </span>

                    <span class="route-step-text">
                        ${etapa}
                    </span>

                `;


                caminho.appendChild(item);

            }
        );

    }


    // ==============================
    // RECURSOS
    // ==============================

    const recursos =
        document.getElementById("rotaRecursos");


    if (recursos) {

        recursos.innerHTML = "";


        rota.recursos.forEach(
            function (recurso) {

                const tag =
                    document.createElement("span");


                tag.classList.add(
                    "accessibility-tag"
                );


                tag.textContent =
                    "✓ " + recurso;


                recursos.appendChild(tag);

            }
        );

    }

}

// ==============================
// IMAGENS DOS RECURSOS
// ==============================

function definirImagemLocal(titulo) {

    const imagens = {

        "Pisos táteis":
            "../IMG/pisos-tateis.png",

        "Semáforos sonoros":
            "../IMG/semaforos-sonoros.png",

        "Rotas acessíveis":
            "../IMG/rotas-acessiveis.png",

        "Semáforos visuais":
            "../IMG/semaforos-visuais.png",

        "Alertas visuais":
            "../IMG/alertas-visuais.png",

        "Rampas acessíveis":
            "../IMG/rampas-acessiveis.png",

        "Elevadores":
            "../IMG/elevadores.png",

        "Rotas sem barreiras":
            "../IMG/rotas-sem-barreiras.png",

        "Rotas simplificadas":
            "../IMG/rotas-simplificadas.png",

        "Pontos de referência":
            "../IMG/pontos-referencia.png",

        "Orientações":
            "../IMG/orientacoes.png",

        "Acessibilidade física":
            "../IMG/acessibilidade-fisica.png",

        "Sinalização acessível":
            "../IMG/sinalizacao-acessivel.png",

        "Painéis informativos":
            "../IMG/alertas-visuais.png"

    };

    return imagens[titulo] ||
        "../IMG/acessibilidade-fisica.png";
}


// ==============================
// RECURSOS PERSONALIZADOS
// ==============================

function carregarRecursos(deficiencia) {

    const recursosContainer =
        document.getElementById("recursosContainer");

    if (!recursosContainer) {
        return;
    }


    const recursos = {

        visual: [

            {
                icone: "🦯",
                titulo: "Pisos táteis",
                descricao:
                    "Encontre informações sobre pisos táteis disponíveis nas proximidades."
            },

            {
                icone: "🔊",
                titulo: "Semáforos sonoros",
                descricao:
                    "Consulte semáforos que possuem sinalização sonora para auxiliar na travessia."
            },

            {
                icone: "🗺️",
                titulo: "Rotas acessíveis",
                descricao:
                    "Encontre rotas adaptadas para facilitar sua locomoção pela cidade."
            }

        ],

        auditiva: [

            {
                icone: "🚦",
                titulo: "Semáforos visuais",
                descricao:
                    "Encontre semáforos que possuem sinalização visual para auxiliar na travessia."
            },

            {
                icone: "🔔",
                titulo: "Alertas visuais",
                descricao:
                    "Receba informações importantes por meio de notificações visuais."
            },

            {
                icone: "🗺️",
                titulo: "Rotas acessíveis",
                descricao:
                    "Encontre rotas adaptadas para facilitar sua locomoção."
            }

        ],

        motora: [

            {
                icone: "♿",
                titulo: "Rampas acessíveis",
                descricao:
                    "Encontre locais com rampas e acessos adaptados para pessoas com mobilidade reduzida."
            },

            {
                icone: "🛗",
                titulo: "Elevadores",
                descricao:
                    "Consulte locais que possuem elevadores acessíveis."
            },

            {
                icone: "🗺️",
                titulo: "Rotas sem barreiras",
                descricao:
                    "Encontre caminhos com menos obstáculos físicos e barreiras de acessibilidade."
            }

        ],

        intelectual: [

            {
                icone: "🗺️",
                titulo: "Rotas simplificadas",
                descricao:
                    "Encontre rotas com informações simples, objetivas e fáceis de compreender."
            },

            {
                icone: "📍",
                titulo: "Pontos de referência",
                descricao:
                    "Consulte pontos de referência para facilitar a orientação durante o trajeto."
            },

            {
                icone: "🔔",
                titulo: "Orientações",
                descricao:
                    "Receba orientações simples e importantes para facilitar sua locomoção."
            }

        ],

        multipla: [

            {
                icone: "♿",
                titulo: "Acessibilidade física",
                descricao:
                    "Encontre locais com rampas, elevadores e outros acessos adaptados."
            },

            {
                icone: "🔊",
                titulo: "Sinalização acessível",
                descricao:
                    "Consulte equipamentos que possuem recursos sonoros e visuais."
            },

            {
                icone: "🗺️",
                titulo: "Rotas acessíveis",
                descricao:
                    "Encontre rotas adaptadas para diferentes necessidades de acessibilidade."
            }

        ]

    };


    const recursosUsuario =
        recursos[deficiencia];


    if (!recursosUsuario) {

        recursosContainer.innerHTML = `
            <p>
                Não foi possível encontrar recursos
                para este perfil.
            </p>
        `;

        return;
    }


    recursosContainer.innerHTML = "";


    recursosUsuario.forEach(function (recurso) {

        const card =
            document.createElement("article");

        const imagem =
            definirImagemLocal(recurso.titulo);

        card.classList.add(
            "resource-card"
        );

        card.innerHTML = `

            <div class="resource-image-container">

                <img
                    class="resource-image"
                    src="${imagem}"
                    loading="lazy"
                    alt="Ilustração de ${recurso.titulo}"
                >

            </div>

            <div class="resource-content">

                <span
                    class="resource-icon"
                    aria-hidden="true"
                >
                    ${recurso.icone}
                </span>

                <h3>
                    ${recurso.titulo}
                </h3>

                <p>
                    ${recurso.descricao}
                </p>

            </div>

        `;

        recursosContainer.appendChild(card);

    });

}


// ==============================
// TEMA CLARO / ESCURO
// ==============================

function configurarTema() {

    const themeToggle =
        document.getElementById("themeToggle");

    if (!themeToggle) {
        return;
    }


    function aplicarTema(tema) {

        const escuro =
            tema === "escuro";

        document.body.classList.toggle(
            "dark-theme",
            escuro
        );

        themeToggle.textContent =
            escuro ? "🌞" : "🌙";

        themeToggle.setAttribute(
            "aria-label",
            escuro
                ? "Mudar para tema claro"
                : "Mudar para tema escuro"
        );
    }


    const temaSalvo =
        localStorage.getItem("tema") ||
        "claro";

    aplicarTema(temaSalvo);


    themeToggle.addEventListener(
        "click",
        function () {

            const novoTema =
                document.body.classList.contains(
                    "dark-theme"
                )
                    ? "claro"
                    : "escuro";

            localStorage.setItem(
                "tema",
                novoTema
            );

            aplicarTema(novoTema);

        }
    );
}


// ==============================
// NOTIFICAÇÕES
// ==============================

function configurarNotificacoes() {

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );

    const notificationPanel =
        document.getElementById(
            "notificationPanel"
        );

    if (
        !notificationButton ||
        !notificationPanel
    ) {
        return;
    }


    notificationButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const estaAberto =
                !notificationPanel.hidden;

            notificationPanel.hidden =
                estaAberto;

            notificationButton.setAttribute(
                "aria-expanded",
                String(!estaAberto)
            );

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            const clicouForaDoPainel =
                !notificationPanel.contains(
                    event.target
                );

            const clicouForaDoBotao =
                !notificationButton.contains(
                    event.target
                );

            if (
                clicouForaDoPainel &&
                clicouForaDoBotao
            ) {

                notificationPanel.hidden =
                    true;

                notificationButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );
}


// ==============================
// CARREGAR NOTIFICAÇÕES
// ==============================

function carregarNotificacoes() {

    const notificationList =
        document.getElementById(
            "notificationList"
        );

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );

    if (!notificationList) {
        return;
    }


    let notificacoes;

    try {

        notificacoes =
            JSON.parse(
                localStorage.getItem(
                    "notificacoes"
                )
            ) || [];

    } catch (erro) {

        notificacoes = [];

    }


    if (notificacoes.length === 0) {

        const agora =
            new Date().toLocaleString(
                "pt-BR"
            );

        notificacoes = [

            {
                id: Date.now(),
                titulo: "🚧 Alerta de obras",
                mensagem:
                    "Há obras na Avenida Central. Utilize caminhos alternativos.",
                tipo: "alerta",
                data: agora,
                lida: false
            },

            {
                id: Date.now() + 1,
                titulo: "🗺️ Nova rota acessível",
                mensagem:
                    "Uma rota com rampas foi adicionada perto da Praça Principal.",
                tipo: "informacao",
                data: agora,
                lida: false
            },

            {
                id: Date.now() + 2,
                titulo: "♿ Acessibilidade",
                mensagem:
                    "Uma nova área com acesso adaptado foi identificada.",
                tipo: "acessibilidade",
                data: agora,
                lida: false
            }

        ];

        localStorage.setItem(
            "notificacoes",
            JSON.stringify(notificacoes)
        );
    }


    notificationList.innerHTML = "";


    const naoLidas =
        notificacoes.filter(
            function (notificacao) {

                return notificacao.lida === false;

            }
        ).length;


    if (notificationButton) {

        if (naoLidas > 0) {

            notificationButton.setAttribute(
                "data-notifications",
                naoLidas
            );

            notificationButton.classList.add(
                "has-notifications"
            );

        } else {

            notificationButton.removeAttribute(
                "data-notifications"
            );

            notificationButton.classList.remove(
                "has-notifications"
            );
        }
    }


    notificacoes.forEach(
        function (notificacao) {

            const item =
                document.createElement("div");

            item.classList.add(
                "notification-item"
            );

            if (!notificacao.lida) {

                item.classList.add(
                    "notification-unread"
                );

            }

            item.innerHTML = `

                <div class="notification-content">

                    <strong>
                        ${notificacao.titulo}
                    </strong>

                    <span>
                        ${notificacao.mensagem}
                    </span>

                    <small>
                        ${notificacao.data || ""}
                    </small>

                </div>

            `;


            item.addEventListener(
                "click",
                function () {

                    marcarNotificacaoComoLida(
                        notificacao.id
                    );

                }
            );


            notificationList.appendChild(
                item
            );

        }
    );


    if (notificacoes.length > 0) {

        const marcarTodas =
            document.createElement(
                "button"
            );

        marcarTodas.type =
            "button";

        marcarTodas.classList.add(
            "mark-all-read"
        );

        marcarTodas.textContent =
            "Marcar todas como lidas";

        marcarTodas.addEventListener(
            "click",
            marcarTodasComoLidas
        );

        notificationList.appendChild(
            marcarTodas
        );
    }
}


// ==============================
// MARCAR UMA NOTIFICAÇÃO
// ==============================

function marcarNotificacaoComoLida(id) {

    let notificacoes =
        JSON.parse(
            localStorage.getItem(
                "notificacoes"
            )
        ) || [];


    notificacoes =
        notificacoes.map(
            function (notificacao) {

                if (
                    notificacao.id === id
                ) {

                    notificacao.lida =
                        true;

                }

                return notificacao;

            }
        );


    localStorage.setItem(
        "notificacoes",
        JSON.stringify(notificacoes)
    );

    carregarNotificacoes();
}


// ==============================
// MARCAR TODAS COMO LIDAS
// ==============================

function marcarTodasComoLidas() {

    let notificacoes =
        JSON.parse(
            localStorage.getItem(
                "notificacoes"
            )
        ) || [];


    notificacoes =
        notificacoes.map(
            function (notificacao) {

                notificacao.lida =
                    true;

                return notificacao;

            }
        );


    localStorage.setItem(
        "notificacoes",
        JSON.stringify(notificacoes)
    );

    carregarNotificacoes();
}


// ==============================
// ADICIONAR NOTIFICAÇÃO
// ==============================

function adicionarNotificacao(
    titulo,
    mensagem,
    tipo = "informacao"
) {

    let notificacoes =
        JSON.parse(
            localStorage.getItem(
                "notificacoes"
            )
        ) || [];


    const novaNotificacao = {

        id: Date.now(),

        titulo: titulo,

        mensagem: mensagem,

        tipo: tipo,

        data:
            new Date().toLocaleString(
                "pt-BR"
            ),

        lida: false

    };


    notificacoes.unshift(
        novaNotificacao
    );


    localStorage.setItem(
        "notificacoes",
        JSON.stringify(notificacoes)
    );


    carregarNotificacoes();
}


// ==============================
// LOGOUT
// ==============================

function fazerLogout() {

    const confirmar =
        confirm(
            "Deseja realmente sair da sua conta?"
        );

    if (!confirmar) {
        return;
    }

    localStorage.removeItem(
        "sessaoAtiva"
    );

    localStorage.removeItem(
        "usuarioLogado"
    );

    localStorage.removeItem(
        "rotaSelecionada"
    );

    window.location.href =
        "login.html";
}


// ==============================
// PERFIL
// ==============================

function carregarPerfil() {

    if (!verificarSessao()) {
        return;
    }

    const usuarioLogado =
        localStorage.getItem(
            "usuarioLogado"
        );

    if (!usuarioLogado) {
        return;
    }

    let usuario;

    try {

        usuario =
            JSON.parse(usuarioLogado);

    } catch (erro) {

        localStorage.removeItem(
            "usuarioLogado"
        );

        localStorage.removeItem(
            "sessaoAtiva"
        );

        window.location.href =
            "login.html";

        return;
    }


    const tiposDeficiencia = {

        visual:
            "Deficiência visual",

        auditiva:
            "Deficiência auditiva",

        motora:
            "Deficiência físico-motora",

        intelectual:
            "Deficiência intelectual",

        multipla:
            "Deficiência múltipla"

    };


    const perfilNome =
        document.getElementById(
            "perfilNome"
        );

    const perfilNomeCompleto =
        document.getElementById(
            "perfilNomeCompleto"
        );

    const perfilEmail =
        document.getElementById(
            "perfilEmail"
        );

    const perfilDeficiencia =
        document.getElementById(
            "perfilDeficiencia"
        );

    const editarPerfilButton =
        document.getElementById(
            "editarPerfilButton"
        );

    const salvarPerfilButton =
        document.getElementById(
            "salvarPerfilButton"
        );

    const cancelarPerfilButton =
        document.getElementById(
            "cancelarPerfilButton"
        );

    const perfilForm =
        document.getElementById(
            "perfilForm"
        );

    const perfilResumo =
        document.getElementById(
            "perfilResumo"
        );


    function mostrarPerfil() {

        if (perfilNome) {

            perfilNome.textContent =
                usuario.nome ||
                "Usuário";

        }

        if (perfilNomeCompleto) {

            perfilNomeCompleto.textContent =
                usuario.nome ||
                "Não informado";

        }

        if (perfilEmail) {

            perfilEmail.textContent =
                usuario.email ||
                "Não informado";

        }

        if (perfilDeficiencia) {

            perfilDeficiencia.textContent =
                tiposDeficiencia[
                usuario.deficiencia
                ] ||
                "Não informado";

        }


        if (perfilResumo) {

            const nome =
                usuario.nome ||
                "Não informado";

            const email =
                usuario.email ||
                "Não informado";

            const deficiencia =
                tiposDeficiencia[
                usuario.deficiencia
                ] ||
                "Não informada";

            perfilResumo.textContent =
                `Olá, ${nome}! Seu perfil está cadastrado com o e-mail ${email} e com a informação de ${deficiencia.toLowerCase()}.`;
        }
    }


    mostrarPerfil();


    // ==============================
    // EDITAR PERFIL
    // ==============================

    if (editarPerfilButton) {

        editarPerfilButton.addEventListener(
            "click",
            function () {

                const campoNome =
                    document.getElementById(
                        "editarNome"
                    );

                const campoEmail =
                    document.getElementById(
                        "editarEmail"
                    );

                const campoDeficiencia =
                    document.getElementById(
                        "editarDeficiencia"
                    );


                if (campoNome) {

                    campoNome.value =
                        usuario.nome ||
                        "";

                }

                if (campoEmail) {

                    campoEmail.value =
                        usuario.email ||
                        "";

                }

                if (campoDeficiencia) {

                    campoDeficiencia.value =
                        usuario.deficiencia ||
                        "";

                }


                if (perfilForm) {

                    perfilForm.hidden =
                        false;

                }

                editarPerfilButton.hidden =
                    true;

                if (salvarPerfilButton) {

                    salvarPerfilButton.hidden =
                        false;

                }

                if (cancelarPerfilButton) {

                    cancelarPerfilButton.hidden =
                        false;

                }

            }
        );
    }


    // ==============================
    // SALVAR PERFIL
    // ==============================
    if (salvarPerfilButton) {

        salvarPerfilButton.addEventListener(
            "click",
            function () {

                const campoNome =
                    document.getElementById(
                        "editarNome"
                    );

                const campoEmail =
                    document.getElementById(
                        "editarEmail"
                    );

                const campoDeficiencia =
                    document.getElementById(
                        "editarDeficiencia"
                    );


                if (
                    !campoNome ||
                    !campoEmail ||
                    !campoDeficiencia
                ) {
                    return;
                }


                const novoNome =
                    campoNome.value.trim();

                const novoEmail =
                    campoEmail.value.trim()
                        .toLowerCase();

                const novaDeficiencia =
                    campoDeficiencia.value;


                if (!novoNome) {

                    alert(
                        "Digite seu nome."
                    );

                    campoNome.focus();

                    return;
                }


                if (!novoEmail) {

                    alert(
                        "Digite seu e-mail."
                    );

                    campoEmail.focus();

                    return;
                }


                if (!novaDeficiencia) {

                    alert(
                        "Selecione o tipo de deficiência."
                    );

                    campoDeficiencia.focus();

                    return;
                }


                usuario.nome =
                    novoNome;

                usuario.email =
                    novoEmail;

                usuario.deficiencia =
                    novaDeficiencia;


                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(usuario)
                );


                // Também atualiza o usuário
                // dentro da lista de usuários

                const usuarios =
                    JSON.parse(
                        localStorage.getItem(
                            "usuarios"
                        )
                    ) || [];


                const indice =
                    usuarios.findIndex(
                        function (item) {

                            return item.email ===
                                usuario.email;

                        }
                    );


                if (indice !== -1) {

                    usuarios[indice] =
                        usuario;

                    localStorage.setItem(
                        "usuarios",
                        JSON.stringify(
                            usuarios
                        )
                    );
                }


                mostrarPerfil();


                if (perfilForm) {

                    perfilForm.hidden =
                        true;

                }


                editarPerfilButton.hidden =
                    false;


                salvarPerfilButton.hidden =
                    true;


                if (cancelarPerfilButton) {

                    cancelarPerfilButton.hidden =
                        true;

                }


                alert(
                    "Perfil atualizado com sucesso!"
                );

            }
        );
    }


    // ==============================
    // CANCELAR EDIÇÃO
    // ==============================

    if (cancelarPerfilButton) {

        cancelarPerfilButton.addEventListener(
            "click",
            function () {

                if (perfilForm) {

                    perfilForm.hidden =
                        true;

                }


                if (editarPerfilButton) {

                    editarPerfilButton.hidden =
                        false;

                }


                if (salvarPerfilButton) {

                    salvarPerfilButton.hidden =
                        true;

                }


                cancelarPerfilButton.hidden =
                    true;

            }
        );
    }
}


// ==============================
// PÁGINA DE RECURSOS
// ==============================

function carregarRecursosPagina() {

    if (!verificarSessao()) {
        return;
    }


    const usuarioLogado =
        localStorage.getItem(
            "usuarioLogado"
        );

    if (!usuarioLogado) {
        return;
    }


    let usuario;

    try {

        usuario =
            JSON.parse(usuarioLogado);

    } catch (erro) {

        localStorage.removeItem(
            "usuarioLogado"
        );

        localStorage.removeItem(
            "sessaoAtiva"
        );

        window.location.href =
            "login.html";

        return;
    }


    const recursosPaginaContainer =
        document.getElementById(
            "recursosPaginaContainer"
        );

    const todosRecursosContainer =
        document.getElementById(
            "todosRecursosContainer"
        );


    if (!recursosPaginaContainer) {
        return;
    }


    const recursos = {

        visual: [

            {
                icone: "🦯",
                titulo: "Pisos táteis",
                descricao:
                    "Auxiliam na orientação e deslocamento de pessoas com deficiência visual.",
                detalhes:
                    "Os pisos táteis ajudam na orientação e segurança durante o deslocamento, indicando caminhos, mudanças de direção e situações de atenção."
            },

            {
                icone: "🔊",
                titulo: "Semáforos sonoros",
                descricao:
                    "Emitem sinais sonoros para auxiliar na travessia.",
                detalhes:
                    "Os semáforos sonoros utilizam sinais audíveis para indicar o momento adequado para atravessar uma via."
            },

            {
                icone: "📍",
                titulo: "Sinalização acessível",
                descricao:
                    "Informações adaptadas para facilitar a orientação.",
                detalhes:
                    "A sinalização acessível facilita a localização de ambientes e serviços por meio de informações adaptadas."
            }

        ],

        auditiva: [

            {
                icone: "🚦",
                titulo: "Semáforos visuais",
                descricao:
                    "Utilizam sinais visuais para auxiliar na travessia.",
                detalhes:
                    "Os sinais visuais ajudam pessoas com deficiência auditiva a identificar informações importantes durante a travessia."
            },

            {
                icone: "🔔",
                titulo: "Alertas visuais",
                descricao:
                    "Apresentam informações importantes por meio de sinais visuais.",
                detalhes:
                    "Alertas visuais permitem que informações normalmente transmitidas por sons também sejam percebidas visualmente."
            },

            {
                icone: "📺",
                titulo: "Painéis informativos",
                descricao:
                    "Exibem informações importantes de maneira visual.",
                detalhes:
                    "Painéis informativos apresentam mensagens, avisos e orientações de maneira visual."
            }

        ],

        motora: [

            {
                icone: "♿",
                titulo: "Rampas acessíveis",
                descricao:
                    "Facilitam o acesso a calçadas, prédios e espaços públicos.",
                detalhes:
                    "Rampas acessíveis permitem a circulação de pessoas que utilizam cadeira de rodas ou possuem mobilidade reduzida."
            },

            {
                icone: "🛗",
                titulo: "Elevadores",
                descricao:
                    "Permitem o acesso entre diferentes níveis sem o uso de escadas.",
                detalhes:
                    "Elevadores acessíveis facilitam a circulação entre diferentes andares e níveis de um ambiente."
            },

            {
                icone: "🛣️",
                titulo: "Rotas sem barreiras",
                descricao:
                    "Caminhos com menos obstáculos físicos.",
                detalhes:
                    "Rotas sem barreiras priorizam caminhos com calçadas adequadas, rampas e menor quantidade de obstáculos."
            }

        ],

        intelectual: [

            {
                icone: "🗺️",
                titulo: "Rotas simplificadas",
                descricao:
                    "Rotas apresentadas de maneira simples e fácil de compreender.",
                detalhes:
                    "As rotas simplificadas apresentam informações objetivas para facilitar a compreensão do trajeto."
            },

            {
                icone: "📍",
                titulo: "Pontos de referência",
                descricao:
                    "Locais que ajudam na orientação durante o trajeto.",
                detalhes:
                    "Pontos de referência ajudam na identificação de locais importantes durante o deslocamento."
            },

            {
                icone: "ℹ️",
                titulo: "Orientações",
                descricao:
                    "Informações simples para auxiliar durante o deslocamento.",
                detalhes:
                    "As orientações apresentam informações objetivas para ajudar o usuário durante seu percurso."
            }

        ],

        multipla: [

            {
                icone: "♿",
                titulo: "Acessibilidade física",
                descricao:
                    "Rampas, elevadores e outros recursos para facilitar o deslocamento.",
                detalhes:
                    "Reúne diferentes recursos físicos que podem facilitar a circulação e o acesso aos espaços."
            },

            {
                icone: "🔊",
                titulo: "Sinalização acessível",
                descricao:
                    "Recursos sonoros e visuais para facilitar a orientação.",
                detalhes:
                    "Combina diferentes formas de sinalização para tornar as informações mais acessíveis."
            },

            {
                icone: "🗺️",
                titulo: "Rotas acessíveis",
                descricao:
                    "Rotas adaptadas para diferentes necessidades.",
                detalhes:
                    "As rotas acessíveis consideram diferentes necessidades de mobilidade e priorizam caminhos adequados."
            }

        ]

    };


    const recursosUsuario =
        recursos[usuario.deficiencia];


    if (!recursosUsuario) {

        recursosPaginaContainer.innerHTML = `
            <p>
                Não foi possível encontrar recursos
                para este perfil.
            </p>
        `;

        return;
    }


    recursosPaginaContainer.innerHTML =
        "";


    recursosUsuario.forEach(
        function (recurso) {

            const card =
                criarCardRecurso(recurso);

            recursosPaginaContainer.appendChild(
                card
            );

        }
    );


    if (todosRecursosContainer) {

        todosRecursosContainer.innerHTML =
            "";

        Object.keys(recursos).forEach(
            function (tipo) {

                recursos[tipo].forEach(
                    function (recurso) {

                        const jaExiste =
                            recursosUsuario.some(
                                function (
                                    recursoUsuario
                                ) {

                                    return (
                                        recursoUsuario.titulo ===
                                        recurso.titulo
                                    );

                                }
                            );


                        if (!jaExiste) {

                            const card =
                                criarCardRecurso(
                                    recurso
                                );

                            todosRecursosContainer.appendChild(
                                card
                            );

                        }

                    }
                );

            }
        );
    }
}


// ==============================
// CRIAR CARD DE RECURSO
// ==============================
function criarCardRecurso(recurso) {

    const card =
        document.createElement(
            "article"
        );

    card.classList.add(
        "resource-card"
    );


    const tituloCodificado =
        encodeURIComponent(
            recurso.titulo
        );


    card.innerHTML = `

        <div class="resource-content">

            <span
                class="resource-icon"
                aria-hidden="true"
            >
                ${recurso.icone}
            </span>

            <h3>
                ${recurso.titulo}
            </h3>

            <p>
                ${recurso.descricao}
            </p>

            <a
                href="recurso-detalhes.html?recurso=${tituloCodificado}"
                class="resource-details-button"
            >
                Ver detalhes
            </a>

        </div>

    `;


    card.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest(
                    ".resource-details-button"
                )
            ) {
                return;
            }

            window.location.href =
                `recurso-detalhes.html?recurso=${tituloCodificado}`;

        }
    );


    return card;
}


// ==============================
// DETALHES DO RECURSO
// ==============================

function carregarDetalhesRecurso() {

    if (!verificarSessao()) {
        return;
    }


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const nomeRecurso =
        parametros.get("recurso");


    if (!nomeRecurso) {
        return;
    }


    const recursos = {

        "Pisos táteis": {

            descricao:
                "Recursos de orientação instalados em calçadas e espaços públicos.",

            detalhes:
                "Os pisos táteis possuem diferentes padrões que ajudam na orientação e na identificação de obstáculos e mudanças de direção.",

            imagem:
                "../IMG/pisos-tateis.png"

        },

        "Semáforos sonoros": {

            descricao:
                "Semáforos que utilizam sinais sonoros para auxiliar na travessia.",

            detalhes:
                "Os sinais sonoros permitem que pessoas com deficiência visual identifiquem o momento adequado para atravessar uma via.",

            imagem:
                "../IMG/semaforos-sonoros.png"

        },

        "Rampas acessíveis": {

            descricao:
                "Estruturas que facilitam o acesso a diferentes ambientes.",

            detalhes:
                "As rampas acessíveis permitem que pessoas com mobilidade reduzida tenham mais facilidade para acessar calçadas, prédios e outros espaços.",

            imagem:
                "../IMG/rampas-acessiveis.png"

        },

        "Elevadores": {

            descricao:
                "Equipamentos que permitem o deslocamento entre diferentes níveis.",

            detalhes:
                "Elevadores acessíveis são importantes para garantir que pessoas com mobilidade reduzida possam circular entre diferentes andares.",

            imagem:
                "../IMG/elevadores.png"

        },

        "Semáforos visuais": {

            descricao:
                "Semáforos que utilizam sinalização visual.",

            detalhes:
                "A sinalização visual permite que informações importantes sejam percebidas sem depender exclusivamente de sinais sonoros.",

            imagem:
                "../IMG/semaforos-visuais.png"

        },

        "Alertas visuais": {

            descricao:
                "Alertas apresentados visualmente.",

            detalhes:
                "Alertas visuais ajudam a transmitir informações importantes para pessoas que não conseguem perceber sinais sonoros.",

            imagem:
                "../IMG/alertas-visuais.png"

        },

        "Rotas sem barreiras": {

            descricao:
                "Caminhos planejados para reduzir obstáculos físicos.",

            detalhes:
                "Essas rotas priorizam caminhos com menos barreiras, como escadas, obstáculos e calçadas inadequadas.",

            imagem:
                "../IMG/rotas-sem-barreiras.png"

        },

        "Rotas simplificadas": {

            descricao:
                "Rotas apresentadas de forma simples e objetiva.",

            detalhes:
                "As rotas simplificadas facilitam a compreensão do caminho, apresentando informações de maneira clara.",

            imagem:
                "../IMG/rotas-simplificadas.png"

        },

        "Pontos de referência": {

            descricao:
                "Locais que ajudam na orientação durante o deslocamento.",

            detalhes:
                "Pontos de referência ajudam o usuário a reconhecer lugares importantes durante o trajeto.",

            imagem:
                "../IMG/pontos-referencia.png"

        },

        "Orientações": {

            descricao:
                "Informações simples para auxiliar durante o deslocamento.",

            detalhes:
                "As orientações apresentam informações importantes de maneira objetiva para facilitar a locomoção.",

            imagem:
                "../IMG/orientacoes.png"

        },

        "Acessibilidade física": {

            descricao:
                "Recursos físicos que facilitam a circulação.",

            detalhes:
                "Inclui estruturas como rampas, elevadores e outros recursos que facilitam o acesso aos espaços.",

            imagem:
                "../IMG/acessibilidade-fisica.png"

        },

        "Sinalização acessível": {

            descricao:
                "Sistemas de sinalização adaptados às necessidades dos usuários.",

            detalhes:
                "A sinalização acessível pode utilizar recursos visuais, sonoros e táteis para facilitar a orientação.",

            imagem:
                "../IMG/sinalizacao-acessivel.png"

        },

        "Painéis informativos": {

            descricao:
                "Painéis que apresentam informações importantes de maneira visual.",

            detalhes:
                "Painéis informativos ajudam os usuários a encontrar orientações, avisos e informações sobre os ambientes.",

            imagem:
                "../IMG/alertas-visuais.png"

        },

        "Rotas acessíveis": {

            descricao:
                "Caminhos adaptados para diferentes necessidades de acessibilidade.",

            detalhes:
                "As rotas acessíveis priorizam caminhos que possuem recursos adequados às necessidades de diferentes usuários.",

            imagem:
                "../IMG/rotas-acessiveis.png"

        }

    };


    const recurso =
        recursos[nomeRecurso];


    if (!recurso) {

        const titulo =
            document.getElementById(
                "recursoTitulo"
            );

        const descricao =
            document.getElementById(
                "recursoDescricao"
            );

        if (titulo) {

            titulo.textContent =
                "Recurso não encontrado";

        }

        if (descricao) {

            descricao.textContent =
                "Não foi possível encontrar informações sobre este recurso.";

        }

        return;
    }


    const titulo =
        document.getElementById(
            "recursoTitulo"
        );

    const descricao =
        document.getElementById(
            "recursoDescricao"
        );

    const detalhes =
        document.getElementById(
            "recursoDetalhes"
        );

    const imagem =
        document.getElementById(
            "recursoImagem"
        );


    if (titulo) {

        titulo.textContent =
            nomeRecurso;

    }

    if (descricao) {

        descricao.textContent =
            recurso.descricao;

    }

    if (detalhes) {

        detalhes.textContent =
            recurso.detalhes;

    }

    if (imagem) {

        imagem.src =
            recurso.imagem;

        imagem.alt =
            "Imagem de " +
            nomeRecurso;

    }

}


// ==============================
// INICIALIZAÇÃO
// ==============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        configurarTema();
        configurarNotificacoes();
        carregarNotificacoes();


        // Nome do arquivo atual
        const pagina =
            window.location.pathname
                .split("/")
                .pop();


        // ==============================
        // LOGIN
        // ==============================

        if (pagina === "login.html") {

            // O formulário já chama
            // fazerLogin(event)
            // diretamente pelo HTML.

        }


        // ==============================
        // CADASTRO
        // ==============================

        if (pagina === "cadastro.html") {

            // O formulário já chama
            // cadastrarUsuario(event)
            // diretamente pelo HTML.

        }


        // ==============================
        // HOME
        // ==============================

        if (
            pagina === "home.html" ||
            pagina === ""
        ) {

            carregarHome();

        }


        // ==============================
        // ROTAS
        // ==============================

        if (pagina === "rotas.html") {

            carregarRotas();

        }


        // ==============================
        // DETALHES DA ROTA
        // ==============================

        if (pagina === "detalhes-rota.html") {

            carregarDetalhesRota();

        }


        // ==============================
        // PERFIL
        // ==============================

        if (pagina === "perfil.html") {

            carregarPerfil();

        }


        // ==============================
        // RECURSOS
        // ==============================

        if (pagina === "recursos.html") {

            carregarRecursosPagina();

        }


        // ==============================
        // DETALHES DO RECURSO
        // ==============================

        if (pagina === "recurso-detalhes.html") {

            carregarDetalhesRecurso();

        }

    }
);