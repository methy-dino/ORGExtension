// CONFERIR SE ALGO MARCADO BATEU AGORA, OU 30 MINS ANTES DE ALGO
import criar_notificacao from "./notificacoes.mjs";
/* ESTRUTURA 
 * timer: DATA
 * eventos: ARRAY DE DATAS (ORDEM DECRESCENTE)
 */
let eventos = [];
function carregar(){
	let reescrever = false;
	chrome.storage.local.get(["itens"], (res) => {
		eventos = res.itens || [];
		let agora = Date.now();
		for(let i = 0; i < eventos.length; i++){
			if (eventos[i].tipo === "evento") {
				//console.log(new Date(lista[i].dataHora) + " ");
				if (new Date(eventos[i].dataHora) < agora){
					reescrever = true;
					eventos.splice(i, 1);
					//console.log("removendo " + lista[i].dataHora);
				}
			} else if (eventos[i].tipo === "timer") {
				if (eventos[i].fim < agora){
					reescrever = true;
					eventos.splice(i, 1);
				}
			}
		}
	});
	if (reescrever){
		chrome.storage.local.set({ itens: eventos});
	}
}
chrome.runtime.onMessage.addListener(function(pedido, chamador, retorno) {
	eventos.push(pedido);
	retorno({ dados: "ok"});
});
function conferir_eventos(){
	let agora = new Date();
	for (let i = 0; i < eventos.length; i++) {
		if (eventos[i].tipo === "evento") {
			if (new Date(eventos[i].dataHora) < agora){
				console.log("EVENTO CONCLUIDO");
				let options = { body: "TEMPO ACABOU", icon: "16x16.png"};
				self.registration.showNotification('Extension Notification', options);
				eventos.splice(i, 1);
				//console.log("removendo " + lista[i].dataHora);
			}
		} else if (eventos[i].tipo === "timer") {
			if (eventos[i].fim < agora){
				let options = { body: "TEMPO ACABOU", icon: "16x16.png"};
				self.registration.showNotification("Extension Notification", options);
				eventos.splice(i, 1);
			}
		}
	}
}
setInterval(conferir_eventos, 1000);
carregar();
