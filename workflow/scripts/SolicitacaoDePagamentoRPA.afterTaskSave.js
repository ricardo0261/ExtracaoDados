function afterTaskSave(colleagueId, nextSequenceId, userList) {



	if ((nextSequenceId == 66 || nextSequenceId == '66') && hAPI.getCardValue("aprovSolicitante") != "sim") {
		notificacaoEncerramento(hAPI.getCardValue('emailSolicitante'), hAPI.getCardValue('solicitanteProcesso'))
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