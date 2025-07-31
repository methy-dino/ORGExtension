/* arquivo reservado para carregar dados sobre datas salvas, usando chrome.storage.local.set*/
const EVENTO_BTN = document.getElementById("evento");
EVENTO_BTN.addEventListener("click", pedir_evento);
const TIMER_BTN = document.getElementById("timer");
TIMER_BTN.addEventListener("click", pedir_timer);
function salvar(){
	/* stub */
}
function carregar(){
	/* stub */
}
function arch_test(){
	/* muda o DOM para testar a estrutura de compromissos */
}
function enviar(){
}
function pedir_evento(){
	/* TODO: CONFERIR SE CONTAINER_EVENTO EXISTE */
	const container_evento = document.createElement("div");
	container_evento.id = "CONTAINER_EVENTO";
	/* -------------------------------------------- */
	const evento_dados = document.createElement("input");
	evento_dados.type = "text";
	evento_dados.id = "EVENTO_DADOS";
	evento_dados.placeholder = "DD/MM/YYYY HH:MM";
	container_evento.appendChild(evento_dados);
	/* -------------------------------------------- */
	const evento_confirmar = document.createElement("button");
	evento_confirmar.textContent = "criar";
	evento_confirmar.id = "EVENTO_CONFIRMAR"
	/* -------------------------------------------- */
	container_evento.appendChild(evento_confirmar);
	EVENTO_BTN.after(container_evento);
	console.log("INTERFACE DE EVENTO INICIALIZADA");
}
function pedir_timer(){
	/* TODO: CONFERIR SE CONTAINER_TIMER EXISTE */
	const container_timer = document.createElement("div");
	container_timer.id = "CONTAINER_TIMER";
	/* -------------------------------------------- */
	const timer_dados = document.createElement("input");
	timer_dados.type = "text";
	timer_dados.id = "TIMER_DADOS";
	timer_dados.placeholder = "HH:MM:SS";
	container_timer.appendChild(timer_dados);
	/* -------------------------------------------- */
	const timer_confirmar = document.createElement("button");
	timer_confirmar.textContent = "criar";
	timer_confirmar.id = "TIMER_CONFIRMAR"
	/* -------------------------------------------- */
	container_timer.appendChild(timer_confirmar);
	TIMER_BTN.after(container_timer);
	console.log("INTERFACE DE TIMER INICIALIZADA");
}
