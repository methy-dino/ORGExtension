/* arquivo reservado para carregar dados sobre datas salvas, usando chrome.storage.local.set*/
import criar_notificacao from "./notificacoes.mjs";
const EVENTO_BTN = document.getElementById("evento");
EVENTO_BTN.addEventListener("click", pedir_evento);
const TIMER_BTN = document.getElementById("timer");
TIMER_BTN.addEventListener("click", pedir_timer);

// Gera um ID único baseado no timestamp atual
function gerarId() {
	return Date.now().toString();
}

// Salva um novo item (evento ou timer) no armazenamento local.
// Recupera a lista atual, Adiciona o novo item e Salva a lista atualiza.
function salvar(item){
	chrome.storage.local.get(["itens"], (res) => {
		const lista = res.itens || [];
		lista.push(item);
		chrome.storage.local.set({ itens: lista });
	});
}

// Carrega os itens do armazenamento local.
   // Chama o callback com a lista de itens recuperados.
function carregar(callback){
	chrome.storage.local.get(["itens"], (res) => {
		let reescrever = false;
		const lista = res.itens || [];
		let agora = Date.now();
		for(let i = lista.length-1; i > -1; i--){
			if (lista[i].tipo === "evento") {
				console.log(new Date(lista[i].dataHora) + " ");
				if (new Date(lista[i].dataHora) < agora){
					reescrever = true;
					console.log("removendo evento chamado " + lista[i].nome);
					lista.splice(i, 1);
				}
			} else if (lista[i].tipo === "timer") {
				console.log(lista[i].fim + "  " + agora);
				if (lista[i].fim < agora){
					reescrever = true;
					console.log("removendo timer");
					lista.splice(i, 1);
				}
			}
		}
		if (callback) callback(lista);
		if (reescrever) chrome.storage.local.set({ itens: lista });
	});
}

function deletar(alvo){
	console.log(alvo.i);
	chrome.runtime.sendMessage({tipo: "remover", id: this.i}, (resposta) => {
		console.log("Resposta recebida: ", resposta?.dados);
	});
	this.remove();
}
// Testa e renderiza os itens salvos visualmente na tela.
   // Cria ou atualiza o conteiner de exibição.
   // Exibe os eventos e timers.
function atualizar(elem){
	carregar((lista) => {
		let container = document.getElementById("DISPLAY_EVENTOS");
		lista.push(elem);
		if (!container) {
			container = document.createElement("div");
			container.id = "DISPLAY_EVENTOS";
			container.style.marginTop = "12px";
			const linha = document.getElementById("linha");
			linha?.after(container);
		}
		container.replaceChildren(); // limpa antes de redesenhar
			for (let i = 0; i < lista.length; i++){
			const div = document.createElement("div");
			div.addEventListener('click', deletar);
			div.i = lista[i].id + "";
			console.log(div.i);
			div.style.border = "1px solid #ccc";
			div.style.padding = "6px";
			div.style.marginBottom = "4px";
			if (lista[i].tipo === "evento") {
				div.textContent = `📅 ${lista[i].nome} em ${new Date(lista[i].dataHora).toLocaleString("pt-BR")}`;
			} else if (lista[i].tipo === "timer") {
				const { horas, minutos, segundos } = lista[i].duracao;
				div.textContent = `⏱️ Timer de ${horas}h ${minutos}m ${segundos}s`;
			} else {
				div.textContent = JSON.stringify(lista[i]);
			}
			container.appendChild(div);
		}
		const tooltip = document.createElement("p");
		tooltip.textContent = "clique em um para deleta-lo";
		tooltip.style.color = "gray";
		tooltip.style.size = "0.5em";
		tooltip.className = "tooltip";
		container.appendChild(tooltip);
		tooltip.style.alignSelf = "center";
		chrome.storage.local.set({ itens: lista });
	});
}
function arch_test(){
	carregar((lista) => {
		let container = document.getElementById("DISPLAY_EVENTOS");
		if (!container) {
			container = document.createElement("div");
			container.id = "DISPLAY_EVENTOS";
			container.style.marginTop = "12px";
			const linha = document.getElementById("linha");
			linha?.after(container);
		}
		container.replaceChildren(); // limpa antes de redesenhar
		for (let i = 0; i < lista.length; i++){
			const div = document.createElement("div");
			div.addEventListener('click', deletar);
			div.i = lista[i].id + "";
			console.log(div.i);
			div.style.border = "1px solid #ccc";
			div.style.padding = "6px";
			div.style.marginBottom = "4px";
			if (lista[i].tipo === "evento") {
				div.textContent = `📅 ${lista[i].nome} em ${new Date(lista[i].dataHora).toLocaleString("pt-BR")}`;
			} else if (lista[i].tipo === "timer") {
				const { horas, minutos, segundos } = lista[i].duracao;
				div.textContent = `⏱️ Timer de ${horas}h ${minutos}m ${segundos}s`;
			} else {
				div.textContent = JSON.stringify(lista[i]);
			}
			container.appendChild(div);
		}
		const tooltip = document.createElement("p");
		tooltip.textContent = "clique em um para deleta-lo";
		tooltip.style.color = "gray";
		tooltip.style.size = "0.5em";
		tooltip.className = "tooltip";
		container.appendChild(tooltip);
		tooltip.style.alignSelf = "center";
		chrome.storage.local.set({ itens: lista });
	});
}

function avisar_invalidez(container){
	const texto = document.createElement("p");
	texto.textContent = "ENTRADA INVÁLIDA";
	texto.style.color = "red";
	container.appendChild(texto);
	const avisar = new Promise((resolver, rejeitar) => {
		/* apaga o aviso de entrada inválida. */
		setTimeout(() => {
			texto.remove();
		}, 3000);
	});
}

function confirmar_evento() {
	let valido = true;
	const container = document.getElementById("CONTAINER_EVENTO");
	const evento_dados = document.getElementById("EVENTO_DADOS");
	const evento_nome = document.getElementById("EVENTO_NOME");
	if (evento_nome.value == "" || evento_nome.value == null){
		console.warn("NOME INVALIDO");
		valido = false;
	}
	if (evento_dados.value == "" || evento_dados.value == null){
		console.warn("DATA NULA");
		valido = false;
	} else if (new Date(evento_dados.value) < new Date()){
		console.warn("DATA INVALIDA");
		valido = false;
	}
	if (!valido){
		avisar_invalidez(container);
		return;
	}
	container.remove();
	console.log("Criação de evento com sucesso\nNome do evento " + evento_nome.value + "\n" + "Hora de evento: " + evento_dados.value);

	const eventoObj = {
		id: gerarId(),
		tipo: "evento",
		nome: evento_nome.value,
		dataHora: evento_dados.value,
		criadoEm: Date.now()
	};

	atualizar(eventoObj);
	let mensagem = {tipo: "adicionar", alvo: eventoObj};
	chrome.runtime.sendMessage(mensagem, (resposta) => {
		console.log("Resposta recebida: ", resposta?.dados);
	});

	const notif = criar_notificacao("Criado com êxito", "Seu evento foi marcado", "icones/128x128.png");
	const fecha = new Promise((resolver, rejeitar) => {
		/* apaga a notificação */
		setTimeout(() => {
			notif.close();
		}, 3000);
	});
}

function confirmar_timer() {
	let valido = true;
	const container = document.getElementById("CONTAINER_TIMER");
	const evento_dados = document.getElementById("TIMER_DADOS");
	const raw = evento_dados.value.trim();
	const partes = raw.split(":");
	if (raw === "" || raw == null) valido = false;
	if (partes.length > 3) valido = false;
	for (const p of partes) {
		if (!/^\d+$/.test(p)) {
			valido = false;
			break;
		}
	}
	if (!valido){
		console.warn("TIMER INVALIDO");
		avisar_invalidez(container);
		return;
	}
	container.remove();
	let imprimir = "Criação de timer com sucesso\nTempo de timer: ";
	let segundos = 0, minutos = 0, horas = 0;
	if (partes.length === 1) {
		segundos = Number(partes[0]);
		imprimir += `${segundos} segundos `;
	} else if (partes.length === 2) {
		minutos = Number(partes[0]);
		segundos = Number(partes[1]);
		imprimir += `${minutos} minutos ${segundos} segundos `;
	} else if (partes.length === 3) {
		horas = Number(partes[0]);
		minutos = Number(partes[1]);
		segundos = Number(partes[2]);
		imprimir += `${horas} horas ${minutos} minutos ${segundos} segundos `;
	}

	const timerObj = {
		id: gerarId(),
		tipo: "timer",
		duracao: { horas, minutos, segundos },
		agendadoEm: Date.now(),
		fim:  Date.now() + 1000 * (horas * 3600 + minutos * 60 + segundos)
	};
	atualizar(timerObj);

	const notif = criar_notificacao("Criado com êxito", "Seu timer foi criado", "icones/128x128.png");
	let mensagem = {tipo: "adicionar", alvo: timerObj};
	chrome.runtime.sendMessage(mensagem, (resposta) => {
		console.log("Resposta recebida: ", resposta?.dados);
	});

	const fecha = new Promise((resolver, rejeitar) => {
		/* apaga a notificação */
		setTimeout(() => {
			notif.close();
		}, 3000);
	});
	console.log(imprimir);
}

function pedir_evento(){
	{
		let cont;
		if ((cont = document.getElementById("CONTAINER_EVENTO")) != null){
			cont.remove();
			return;
		}
	}
	const container_evento = document.createElement("div");
	container_evento.id = "CONTAINER_EVENTO";
	container_evento.className = "inserir";
	/* Textbox do nome do 'evento'*/
	const evento_nome = document.createElement("input");
	evento_nome.type = "text";
	evento_nome.id = "EVENTO_NOME";
	evento_nome.placeholder = "NOME";
	evento_nome.className = "ent ent_txt";
	container_evento.appendChild(evento_nome);
	/* data e tempo do 'evento' */
	const evento_dados = document.createElement("input");
	evento_dados.type = "datetime-local";
	evento_dados.id = "EVENTO_DADOS";
	var now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	evento_dados.value = now.toISOString().slice(0,16);
	evento_dados.className = "ent ent_txt";
	container_evento.appendChild(evento_dados);
	/* botão de confirmar */
	const evento_confirmar = document.createElement("button");
	evento_confirmar.textContent = "criar";
	evento_confirmar.className = "ent ent_btn";
	evento_confirmar.addEventListener("click", confirmar_evento);
	/* -------------------------------------------- */
	container_evento.appendChild(evento_confirmar);
	EVENTO_BTN.after(container_evento);
	console.log("INTERFACE DE EVENTO INICIALIZADA");
}

function pedir_timer(){
	{
		let cont;
		if ((cont = document.getElementById("CONTAINER_TIMER")) != null){
			cont.remove();
			return;
		}
	}
	const container_timer = document.createElement("div");
	container_timer.id = "CONTAINER_TIMER";
	container_timer.className = "inserir";
	/* Textbox do tempo do 'timer' */
	const timer_dados = document.createElement("input");
	timer_dados.type = "text";
	timer_dados.id = "TIMER_DADOS";
	timer_dados.placeholder = "HH:MM:SS";
	timer_dados.className = "ent ent_txt";
	container_timer.appendChild(timer_dados);
	/* botão de confirmar */
	const timer_confirmar = document.createElement("button");
	timer_confirmar.textContent = "criar";
	timer_confirmar.className = "ent ent_btn";
	timer_confirmar.id = "TIMER_CONFIRMAR"
	timer_confirmar.addEventListener("click", confirmar_timer);
	container_timer.appendChild(timer_confirmar);
	TIMER_BTN.after(container_timer);
	console.log("INTERFACE DE TIMER INICIALIZADA");
}

// inicializa visualização já carregada
arch_test();
