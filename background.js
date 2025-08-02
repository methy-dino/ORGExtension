// CONFERIR SE ALGO MARCADO BATEU AGORA, OU 30 MINS ANTES DE ALGO
// In a content script or popup
/* ESTRUTURA 
 * timer: DATA
 * eventos: ARRAY DE DATAS (ORDEM DECRESCENTE)
 */
let timer;
let eventos;
chrome.runtime.onMessage.addListener(function(pedido, chamador, retornar) {
	if (pedido.tipo === "TIMER") {
		timer = new Date() + new Date((request.horas * 60 * 60 + request.minutos * 60 + request.segundos) * 1000);
		retorno({ retorno: "" });
	} else if (pedido.tipo === "EVENTO"){
		// TODO: INTERPRETAR DADOS.
	}
});
function conferir_eventos(){
	let agora = new Date();
	// TODO: terminar estrutura.
}
setInterval(conferir_eventos, 3000);
