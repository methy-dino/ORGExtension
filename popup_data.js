/* arquivo reservado para carregar dados sobre datas salvas, usando chrome.storage.local.set*/
import criar_notificacao from "./notificacoes.mjs";
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
	console.log("Criação de evento com sucesso\nNome do evento " + evento_nome.value + "\n" + "Hora de evento: " + evento_dados.value);
	const notif = criar_notificacao("Criado com êxito", "Seu evento foi marcado", "icones/16x16.png");
		const fecha = new Promise((resolver, rejeitar) => {
			/* apaga a notificação */
			setTimeout(() => {
				notif.close();
			}, 3000);
		});
		// TODO: escrever dados no dispositivo.
}
function confirmar_timer() {
	let valido = true;
	const container = document.getElementById("CONTAINER_TIMER");
	const evento_dados = document.getElementById("TIMER_DADOS");
	// TODO: verificar invalidez
	let dois_pontos = 0;
	for (const ch of evento_dados.value) {
		 if (ch == ':'){
			 dois_pontos++;
		 } else if (ch > '9' || ch < '0'){
			 valido = false;
			 break;
		 }
	}
	if (dois_pontos > 2){
		valido = false;
	}
	if (evento_dados.value == "" || evento_dados.value == null){
		valido = false;
	} 
	if (!valido){
		console.warn("TIMER INVALIDO");
		avisar_invalidez(container);
		return;
	}
	let imprimir = "Criação de timer com sucesso\nTempo de timer: ";
	let dividida = evento_dados.value.split(":");
	const tempos = ["segundos", "minutos", "horas"];
	for (let i = dividida.length-1; i > -1; i--){
		imprimir += dividida[i] + " " + tempos[dividida.length-i-1] + " ";
	}
	const notif = criar_notificacao("Criado com êxito", "Seu timer foi criado", "icones/16x16.png");
		const fecha = new Promise((resolver, rejeitar) => {
			/* apaga a notificação */
			setTimeout(() => {
				notif.close();
			}, 3000);
		});
	console.log(imprimir);
	// TODO: escrever dados no dispositivo. (assume-se que ultimo dado é segundos, penultimo minutos, antepenultimo horas
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
