// helpers simples
function gerarId() {
  return Date.now().toString();
}

// seleciona elementos
const listEl = document.getElementById("linha");
const input = document.getElementById("evento");
const addBtn = document.getElementById("timer");

// carrega e renderiza tarefas
function carregar() {
  chrome.storage.local.get(["tarefas"], (res) => {
    const tarefas = res.tarefas || [];
    listEl.innerHTML = "";
    tarefas.forEach((t, i) => {
      const div = document.createElement("div");
      div.className = "task";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = t.feito;
      const span = document.createElement("span");
      span.textContent = t.texto;
      if (t.feito) span.classList.add("done");

      checkbox.addEventListener("change", () => {
        tarefas[i].feito = checkbox.checked;
        chrome.storage.local.set({ tarefas }, carregar);
      });

      div.appendChild(checkbox);
      div.appendChild(span);
      listEl.appendChild(div);
    });
  });
}

// adiciona nova tarefa
addBtn.addEventListener("click", () => {
  const texto = input.value.trim();
  if (!texto) return;
  chrome.storage.local.get(["tarefas"], (res) => {
    const tarefas = res.tarefas || [];
    tarefas.push({
      id: gerarId(),
      texto,
      data: new Date().toISOString().slice(0, 10), // opcional: data de criação
      feito: false,
      criadoEm: Date.now()
    });
    chrome.storage.local.set({ tarefas }, () => {
      input.value = "";
      carregar();
    });
  });
});

// inicializa
carregar();
