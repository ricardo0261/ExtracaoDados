/*
 * Retorna o Valor do Campo
 */
function buscarValorCampo(nomeCampo) {
	return hAPI.getCardValue(nomeCampo);
}

/*
 * M?todo para retornar os Dados do dataSet selecionado
 */
function getValorDataSet(nomeDataSet, campoIdDataSet, valorIdDataSet, nomeCampo) {
	var dataSet = DatasetFactory.getDataset(nomeDataSet, null, null, null);
	var valorCampo = false;

	for ( var i = 0; i < dataSet.rowsCount; i++) {
		if (dataSet.getValue(i, codigoDataSet) == valorIdDataSet) {
			valorCampo = dataSet.getValue(i, nomeCampo);
		}
	}
	return valorCampo;
}

/*
 * Debug
 */
function debug(string){
	log.info(string);	
	throw string;
}

function gravarLog(string){
	log.info(string);
}