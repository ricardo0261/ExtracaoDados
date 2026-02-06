function afterTaskSave(colleagueId, nextSequenceId, userList) {

    if ((nextSequenceId == 87 || nextSequenceId == '87') && hAPI.getCardValue("chamadoAprovado") != "sim") {

        notificacaoEncerramento(hAPI.getCardValue('emailSolicitante'), hAPI.getCardValue('cpSolicitante'))

    }

    var ATIVIDADE = getValue('WKNumState')
    hAPI.setCardValue('codSolicitacao', getValue('WKNumProces'))

    if (ATIVIDADE == 66) {

        hAPI.setCardValue('aprovadorClinica', hAPI.getCardValue('cpAprovador'));
        hAPI.setCardValue('dataAprovacaoClinica', hAPI.getCardValue('dtAprovacao'));
        hAPI.setCardValue('decisaoClinica', hAPI.getCardValue('cpDecisao'));


    } else if (ATIVIDADE == 118) {

        clearInputs()

    } else if (ATIVIDADE == 67) {

        clearInputs()

    } else if (ATIVIDADE == 65 && hAPI.getCardValue('cpOrigem') == 'Automatica') {

        publicaAnexos()
    }

}

function clearInputs() {
    hAPI.setCardValue('cpAprovador', '')
    hAPI.setCardValue('dtaprovacao', '')
    hAPI.setCardValue('cpDecisao', '')
}




function publicaAnexos(sequenceId) {

    var calendar = java.util.Calendar.getInstance().getTime();
    var docs = hAPI.listAttachments();
    for (var i = 0; i < docs.size(); i++) {

        var doc = docs.get(i);
        var pasta = hAPI.getCardValue('cpPastaAnexos')
        pasta = parseInt(pasta)
        log.dir('Lucas GEordane says: ' + pasta)
        doc.setParentDocumentId(pasta); // id da pasta onde vai ser publicado o aquivo
        doc.setVersionDescription("Processo: " + getValue("WKNumProces"));
        var descricao = "Fornecedor: " + hAPI.getCardValue('zmFornecedor') + "Processo: " + getValue("WKNumProces")
        doc.setDocumentDescription(descricao)
        doc.setExpires(false); // se o arquivo expira
        doc.setCreateDate(calendar); // data de criação
        doc.setInheritSecurity(true);
        doc.setTopicId(1);
        doc.setUserNotify(false);
        doc.setValidationStartDate(calendar); // data a partir que o ducumento sera visivel
        doc.setVersionOption("0");
        doc.setUpdateIsoProperties(true); // propriedades da cópia controlada.
        hAPI.publishWorkflowAttachment(doc);
    }
}

function notificacaoEncerramento(emailSolicitante, solicitante) {
    var filter = new Array()
    filter.push(DatasetFactory.createConstraint('SOLICITACAO', getValue("WKNumProces"), '', ConstraintType.MUST))
    filter.push(DatasetFactory.createConstraint('SOLICITANTE', solicitante, '', ConstraintType.MUST))
    filter.push(DatasetFactory.createConstraint('EMAIL_SOLICITANTE', emailSolicitante, '', ConstraintType.MUST))
    filter.push(DatasetFactory.createConstraint('PROCESSO', getValue("WKDef"), '', ConstraintType.MUST))
    var ds_envioEmailEncerramento = DatasetFactory.getDataset('ds_envioEmailEncerramento', null, filter, null);
}