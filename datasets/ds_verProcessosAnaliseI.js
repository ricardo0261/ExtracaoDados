function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();

	// VALOR CONFORME PARAMETROS
	var xDT_INI='',
		xDT_FIM='';
    if (constraints !== null && constraints !== undefined) 
    	for (var i = 0; i < constraints.length; i++) 
    		if (constraints[i].fieldName == 'dataSolicitacao') {
	    		xDT_INI = "'"+ constraints[i].initialValue +"'";
	    		var finalValue = constraints[i].finalValue;
	    		if (finalValue !== null && finalValue !== undefined) {
	    			finalValue = ('' + finalValue).trim();
	    		} else {
	    			finalValue = '';
	    		}
	    		if (finalValue.indexOf(':') === -1) {
	    			finalValue = finalValue + " 23:59";
	    		}
	    		xDT_FIM = "'"+ finalValue +"'";
    		}
    
    if(xDT_INI==''){
		log.error("### ds_verProcessosAnaliseI ERROr --> " + e.message);
		newDataset.addColumn('ERRROR');
		newDataset.addRow(['Os parametros de data inicial e final são necessários por conta do volume de dados para extração.','Utilize períodos preferencialmente mensais para extração']);
		return newDataset;
    }
	
	var minhaQuery =
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.area 'AREA', "+
		" 	ML.categoria 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	ML.analyticsTpSolicitacao 'TIPO', "+
		" 	ML.analyticsNmFilial 'FILIAL', "+
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(replace(ML.valorPgtoGuiaTaxaBoletos,'R$',''),'.','') AS 'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE         = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID           = FU1.USER_ID "+   
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+ 
		" 	                                   and TP.NUM_SEQ_ESCOLHID  = 9 "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+ 
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001215         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'SolicitacaoDePagamentos' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 "+
		" union all "+  
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.area 'AREA', "+
		" 	ML.categoria 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	'Pagto Medico' 'TIPO', "+
		" 	ML.descFilial  'FILIAL', "+   
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+ 
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(ML.cpVlrTotal,'.','') as 'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+	
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE        = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID          = FU1.USER_ID "+   
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+ 
		" 	                                   and TP.NUM_SEQ_ESCOLHID  in (66,118) "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+ 
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001513         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'PagamentoMedico' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 "+
		" union all "+  
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.area 'AREA', "+
		" 	ML.categoria 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	'Compras Diversas' 'TIPO', "+
		" 	ML.filial 'FILIAL', "+   
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+ 
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(replace(ML.valorTotalSolicitacao,'R$',''),'.','') as 'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+	
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE        = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID          = FU1.USER_ID "+   
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+ 
		" 	                                   and TP.NUM_SEQ_ESCOLHID  in (7,96) "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+ 
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001522         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'SolicitacaoComprasDiversos' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 "+
		" union all "+
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.area 'AREA', "+
		" 	ML.categoria 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	'Compras MatMed' 'TIPO', "+
		" 	ML.filial 'FILIAL', "+   
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+ 
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(replace(ML.valorTotalSolicitacao,'R$',''),'.','')  'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE         = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID           = FU1.USER_ID "+   
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+ 
		" 	                                   and TP.NUM_SEQ_ESCOLHID  = 30 "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001410         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'SolicitacaoComprasMatMed' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 "+
		" union all "+
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.areaResp 'AREA', "+
		" 	ML.tipoProjeto 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	'Compras Ti Servicos' 'TIPO', "+
		" 	ML.filial 'FILIAL', "+   
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+ 
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(replace(ML.valorTotalSolicitacao,'R$',''),'.','') 'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE        = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID          = FU1.USER_ID "+   
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+ 
		" 	                                   and TP.NUM_SEQ_ESCOLHID  in (7,96,386) "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+ 
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001790         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'SolicitacaoComprasTiServicos' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 "+
		" union all "+
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.area 'AREA', "+
		" 	'não se aplica' 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	'Adiantamento Reembolso' 'TIPO', "+
		" 	ML.filial 'FILIAL', "+   
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+ 
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(ML.totalDasDespesas,'.',',') 'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+	
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE        = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID          = FU1.USER_ID "+   
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+
		" 	                                   and TP.NUM_SEQ_ESCOLHID  in (10,37,14,124,50) "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+ 
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001156         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'SolicitacaoDeAdiantamentoReembolso' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 "+
		" union all "+ 
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.area 'AREA', "+
		" 	'não se aplica' 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	ml.tipoSolicitacao 'TIPO', "+
		" 	ML.nomeFilial 'FILIAL', "+   
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+ 
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(replace(ML.valorEstimado,'R$',''),'.','') 'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+	
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE        = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID          = FU1.USER_ID "+   
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+ 
		" 	                                   and TP.NUM_SEQ_ESCOLHID  = 8 "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+ 
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001346         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'SolicitacaoDePagamentoRPA' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 "+
		" union all "+ 
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.area 'AREA', "+
		" 	'não se aplica' 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	ml.cpTipoSolicitacao 'TIPO', "+
		" 	ML.zoomFilial 'FILIAL', "+
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+ 
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(replace(ML.cpValorLiquido,'R$',''),'.','') 'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE        = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID          = FU1.USER_ID "+
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+ 
		" 	                                   and TP.NUM_SEQ_ESCOLHID  in (76,51) "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+ 
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001425         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'SolicitacaoGDE' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 "+
		" union all "+
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.area 'AREA', "+
		" 	ML.categoria 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	ml.analyticsTpSolicitacao 'TIPO', "+
		" 	ML.filial 'FILIAL', "+
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(replace(ML.valorTotalMedicao,'R$',''),'.','') 'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE        = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID          = FU1.USER_ID "+
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+ 
		" 	                                   and TP.NUM_SEQ_ESCOLHID  = 36 "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+ 
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001245         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'SolicitacaoMedicaoContratos' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 "+
		" union all "+
		" SELECT "+
		" 	PW.NUM_PROCES 'NR_SOLICITACAO', "+
		" 	DP.DES_DEF_PROCES 'PROCESSO', "+
		" 	ML.area 'AREA', "+
		" 	ML.categoria 'CATEGORIA', "+
		" 	FU1.FULL_NAME 'SOLICITANTE', "+
		" 	PW.START_DATE 'DATA_INICIO', "+
		" 	PW.END_DATE 'DATA_FINALIZACAO', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	ml.tipoSolicitacao 'TIPO', "+
		" 	ML.nomeFilial 'FILIAL', "+   
		" 	EP.NOM_ESTADO 'ATIVIDADE', "+ 
		" 	FU2.FULL_NAME 'APROVADOR', "+
		" 	replace(replace(ML.valorDocumento,'R$',''),'.','') 'VALOR_SOLICITACAO' "+
		" FROM PROCES_WORKFLOW PW "+
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE        = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID          = FU1.USER_ID "+
		" 	left outer join TAR_PROCES      TP  on TP.COD_EMPRESA       = 1 "+
		" 	                                   and TP.NUM_PROCES        = PW.NUM_PROCES "+
		" 	                                   and TP.NUM_SEQ_ESCOLHID  = 36 "+
		" 	                                   and not TP.COD_MATR_ESCOLHID like 'Pool:%' "+
		" 	left outer join def_proces      dp  on DP.COD_EMPRESA       = 1 "+ 
		" 	                                   and PW.COD_DEF_PROCES    = DP.COD_DEF_PROCES "+ 
		" 	LEFT OUTER JOIN ESTADO_PROCES   EP  ON PW.COD_DEF_PROCES    = EP.COD_DEF_PROCES "+ 
		" 	                                   AND PW.NUM_VERS          = EP.NUM_VERS "+ 
		" 	                                   AND EP.NUM_SEQ           = TP.NUM_SEQ_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE         = TP.COD_MATR_ESCOLHID "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID           = FU2.USER_ID "+   
		" 	left outer join DOCUMENTO       DD  ON DD.COD_EMPRESA       = 1 "+
		" 								       AND PW.NR_DOCUMENTO_CARD = DD.NR_DOCUMENTO "+
		" 								       AND DD.VERSAO_ATIVA      = 1 "+
		" 	left outer join ML001288         ML ON DD.NR_DOCUMENTO      = ML.documentid "+
		" 								       AND DD.NR_VERSAO         = ML.version "+
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES = 'solicitacaoPagamentosJuridicos' "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM+
		"   and PW.STATUS     <> 1 ";
	
	log.info("start - ds_verProcessosAnaliseI QUERY: " + minhaQuery);
	var dataSource = "/jdbc/FluigDS";
	
	var conn = null;
	var stmt = null;
	var rs   = null;
	var ic   = new javax.naming.InitialContext();
	var ds   = ic.lookup(dataSource);
	var created = false;
	try {
		conn = ds.getConnection();
		stmt = conn.createStatement();
		rs = stmt.executeQuery(minhaQuery);
		var columnCount = rs.getMetaData().getColumnCount();
		while (rs.next()) {
			if (!created) {
				for (var i = 1; i <= columnCount; i++) 
					newDataset.addColumn(rs.getMetaData().getColumnName(i));
				created = true;
			}
			var Arr = new Array();
			for (var i = 1; i <= columnCount; i++) {
				var obj = rs.getObject(rs.getMetaData().getColumnName(i));
				if (null != obj)
					Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
				else
					Arr[i - 1] = null;
			}
			newDataset.addRow(Arr);
		}
	} catch (e) {
		log.error("### ds_verProcessosAnaliseI ERROr --> " + e.message);
		newDataset.addColumn('ERRROR');
		newDataset.addRow([e.message]);
	} finally {
		if (rs != null)
			rs.close();
		
		if (stmt != null)
			stmt.close();
		
		if (conn != null)
			conn.close();
	}
	return newDataset;
}
