function beforeStateEntry(sequenceId){
	if(sequenceId == APROVACAO_GESTOR){
		hAPI.setCardValue("codSolicitacao", getValue("WKNumProces"));
	}
}