function createDataset(fields, constraints, sortFields) {
	// ler dataset ds_direcionamentoAutomaticoV360
	// somente os campos Direcionamento V360,descricaoFornecedor,codFornecedor,cnpjFornecedor,ckdefineFilial,tipoSolicitacao,defineGrupo,grupoDestino,codigoGrupo
	var newDataset = DatasetBuilder.newDataset();
		newDataset.addColumn("Fornecedor");
		newDataset.addColumn("Codigo");
		newDataset.addColumn("CNPJ");
		newDataset.addColumn("define_Filial");
		newDataset.addColumn("tipo_Solicitacao");
		newDataset.addColumn("define_Grupo");
		newDataset.addColumn("grupo_Destino");

	var ds_direcionamentoAutomaticoV360 = DatasetFactory.getDataset("ds_direcionamentoAutomaticoV360",null, null, null);

	for (var i = 0; i < ds_direcionamentoAutomaticoV360.rowsCount; i++) {

		var defineFilial ='Não';
		if(ds_direcionamentoAutomaticoV360.getValue(i, "ckdefineFilial") == true || 
		   ds_direcionamentoAutomaticoV360.getValue(i, "ckdefineFilial") == 'on' )	
			defineFilial = 'Sim';

		newDataset.addRow( new Array(
			ds_direcionamentoAutomaticoV360.getValue(i, "descricaoFornecedor"),
			ds_direcionamentoAutomaticoV360.getValue(i, "codFornecedor"		 ),
			ds_direcionamentoAutomaticoV360.getValue(i, "cnpjFornecedor"	 ),
			defineFilial,
			ds_direcionamentoAutomaticoV360.getValue(i, "tipoSolicitacao"	 ),
			ds_direcionamentoAutomaticoV360.getValue(i, "defineGrupo"		 ),
			ds_direcionamentoAutomaticoV360.getValue(i, "grupoDestino"		 ),
			ds_direcionamentoAutomaticoV360.getValue(i, "codigoGrupo"		 )
		) );
	}
	// retorna dataset
	return newDataset;
}
