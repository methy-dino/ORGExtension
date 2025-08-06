// CONFERIR SE ALGO MARCADO BATEU AGORA, OU 30 MINS ANTES DE ALGO
import criar_notificacao from "./notificacoes.mjs";
/* ESTRUTURA 
 * timer: DATA
 * eventos: ARRAY DE DATAS (ORDEM DECRESCENTE)
 */
let timer = null;
let eventos = null;
chrome.runtime.onMessage.addListener(function(pedido, chamador, retorno) {
	if (pedido.tipo === "TIMER") {
		let agora = new Date();
		timer = new Date(agora.getTime() + (pedido.horas * 60 * 60 + pedido.minutos * 60 + pedido.segundos) * 1000);
		retorno({ dados: timer });
	} else if (pedido.tipo === "EVENTO"){
		// TODO: INTERPRETAR DADOS.
	}
});
function conferir_eventos(){
	let agora = new Date();
	if (agora >= timer && timer !== null){
		let options = { body: "TEMPO ACABOU", icon: "16x16.png"};
		self.registration.showNotification('Extension Notification', options);
		//criar_notificacao("TIMER", "TEMPO ACABOU", "icones/16x16.png");
		timer = null;
	}
	// TODO: terminar estrutura.
}
setInterval(conferir_eventos, 1000);