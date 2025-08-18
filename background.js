// CONFERIR SE ALGO MARCADO BATEU AGORA, OU 30 MINS ANTES DE ALGO
/* ESTRUTURA 
 * timer: DATA
 * eventos: ARRAY DE DATAS (ORDEM DECRESCENTE)
 */
let eventos = [];

function carregar(){
	let reescrever = false;
	// Mudança 1: callback do storage agora garante que eventos sejam carregados antes de processar
	chrome.storage.local.get(["itens"], (res) => {
		eventos = res.itens || [];
		let agora = Date.now();
		// Mudança 2: loop invertido correto
		for(let i = eventos.length - 1; i >= 0; i--){
			if (eventos[i].tipo === "evento") {
				// Mudança 3: converter dataHora para Date
				if (new Date(eventos[i].dataHora) < agora){
					reescrever = true;
					eventos.splice(i, 1);
				}
			} else if (eventos[i].tipo === "timer") {
				// Mudança 3: converter fim para Date
				if (new Date(eventos[i].fim) < agora){
					reescrever = true;
					eventos.splice(i, 1);
				}
			}
		}
		if (reescrever){
			chrome.storage.local.set({ itens: eventos });
		}
		// Mudança 4: chamar conferir_eventos depois de carregar os eventos
		conferir_eventos();
	});
}

chrome.runtime.onMessage.addListener(function(pedido, chamador, retorno) {
	if (pedido.tipo === "adicionar"){
		eventos.push(pedido.alvo);
		console.log("adicionado");
	} else {
		eventos.splice(pedido.indice, 1);
		console.log("removido");
	}
	retorno({ dados: "ok"});
	chrome.storage.local.set({ itens: eventos });
});

function conferir_eventos(){
	console.log("CONFERINDO EVENTOS");
	let agora = new Date();
	// Mudança 2: loop invertido correto
	for (let i = eventos.length - 1; i >= 0; i--) {
		if (eventos[i].tipo === "evento") {
			// Mudança 3: converter dataHora para Date
			if (new Date(eventos[i].dataHora) < agora){
				console.log("EVENTO CONCLUIDO");
				// Notificação visual
				chrome.notifications.create({
					type: "basic",
					title: eventos[i].nome,
					iconUrl: chrome.runtime.getURL("icones/128x128.png"),
					message: "Está na hora de " + eventos[i].nome
				});
				// Áudio ainda pode não tocar no service worker
				/*let audio = new Audio(chrome.runtime.getURL("audios/alarm.wav"));
				audio.play();*/
				eventos.splice(i, 1);
			}
		} else if (eventos[i].tipo === "timer") {
			// Mudança 3: converter fim para Date
			if (new Date(eventos[i].fim) < agora){
				chrome.notifications.create({
					type: "basic",
					title: "TEMPO ACABOU",
					iconUrl: chrome.runtime.getURL("icones/128x128.png"),
					message: "Seu timer foi concluído."
				});
				/*let audio = new Audio(chrome.runtime.getURL("audios/alarm.wav"));
				audio.play();*/
				eventos.splice(i, 1);
			}
		}
	}
}

// Mudança 5: criar o alarme fora de funções assíncronas
chrome.alarms.create("verificarEventos", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarme) => {
	if (alarme.name === "verificarEventos") {
		conferir_eventos();
	}
	const seguraprocesso = new Promise((resolver, rejeitar) => {
		setTimeout(() => {/*NADA*/}, 60000); 
	});
});

carregar();
setInterval(conferir_eventos, 1000);
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
