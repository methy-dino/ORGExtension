function criar_notificacao(titulo, mensagem, caminho_icone){
    return new Notification(titulo, { body: mensagem, icon: caminho_icone });
}

export default criar_notificacao;