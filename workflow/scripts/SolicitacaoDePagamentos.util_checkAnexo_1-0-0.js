/**
 * M?todo para verifica??o de anexos
 * 
 * @param textoTipoAnexo
 *            Informar o texto para completar a frase: Deve haver no m?nimo um
 *            documento anexado ao processo!!!<br>* Tipo de Anexo esperado:
 *            XXXXX;
 * @return Boolean
 * @author sergio.santos
 */
var checkAnexo = function(){
	this.executar = function(textoTipoAnexo) {
		var existeAnexo = false;
		var formularioId = buscarForm();
		var solicitacaoId = buscarIdSolicitacao();
		var empresaId = buscarEmpresa();

		log.info("formularioId => " + formularioId);
		log.info("solicitacaoId => " + solicitacaoId);
		log.info("empresaId => "+ empresaId);
		
		var processConstraint = DatasetFactory.createConstraint(
				"processAttachmentPK.processInstanceId", solicitacaoId,
				solicitacaoId, ConstraintType.MUST);
		var companyConstraint = DatasetFactory.createConstraint(
				"processAttachmentPK.companyId", empresaId, empresaId,
				ConstraintType.MUST);
		var attachFields = new Array("documentId",
				"processAttachmentPK.attachmentSequence", "version");
		var attachConstList = new Array(processConstraint, companyConstraint);
		var attachDataset = DatasetFactory.getDataset("processAttachment",
				attachFields, attachConstList, new Array(
						"processAttachmentPK.attachmentSequence"));

		log.info("obj checkAnexo -> Quantidade de anexos " + attachDataset.rowsCount);

		for ( var x = 0; x < attachDataset.rowsCount; x++) {
			if (attachDataset.getValue(x, "documentId") != formularioId){
				existeAnexo = true;
			}
		}

		log.info("atualizou 11:57");
		log.info("********** existeAnexo => " + existeAnexo);
		
		//if (existeAnexo == false){
		if (! existeAnexo){
			throw "Deve haver no mínimo um documento anexado ao processo!!!<br><br>* Tipo de Anexo esperado" + " " + textoTipoAnexo;
		}
		
		//return existeAnexo;
	};
};