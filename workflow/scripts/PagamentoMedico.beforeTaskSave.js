function beforeTaskSave(colleagueId, nextSequenceId, userList) {
    GETSLA()
    var ATIVIDADE = getValue('WKNumState')
    if (ATIVIDADE == 4 || ATIVIDADE == 0) {
        setIdentificador();

        if (hAPI.getCardValue('cpOrigem') != 'Automatica') {
            validaQuantAnexos(1);
            hAPI.setCardValue('cpClinica', getValue('WKUser'))
        }

    } else if (ATIVIDADE == 61) {
        setIdentificador();
        validaQuantAnexos(1);
    }
}

function validaQuantAnexos(quantAnexos) {
    qtdAnexos = hAPI.listAttachments().size();
    if (qtdAnexos < quantAnexos) {
        throw "É preciso anexar um documento para continuar o processo";
    }
}

function setIdentificador() {
    var filial = hAPI.getCardValue('cpFilial')
    var data = hAPI.getCardValue('dtVencimento');
    data = data.replace('-', '/');
    data = data.replace('-', '/');

    hAPI.setCardValue('campoIdentificador', data + ' - ' + filial)
}