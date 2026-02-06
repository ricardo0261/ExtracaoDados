function createDataset(fields, constraints, sortFields) {
	log.info("### ds_verProcessosAnaliseII - INICIADO");
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
		log.error("### ds_verProcessosAnaliseII ERROR --> " + e.message);
		newDataset.addColumn('ERRROR');
		newDataset.addRow(['Os parametros de data inicial e final são necessários por conta do volume de dados para extração.','Utilize períodos preferencialmente mensais para extração']);
		return newDataset;
    }
	
	var minhaQuery =
		" SELECT "+
		" 	IFNULL(PW.NUM_PROCES, 0) as 'NR_SOLICITACAO', "+
		" 	IFNULL(DP.DES_DEF_PROCES, '') as 'PROCESSO', "+
		" 	IFNULL(FU1.FULL_NAME, '') as 'SOLICITANTE', "+
		" 	IFNULL(PW.START_DATE, '') as 'DATA_INI', "+
		" 	IFNULL(PW.END_DATE, '') as 'DATA_FIM', "+
		" 	(CASE PW.STATUS WHEN 0 THEN 'ABERTO' "+
		" 		            WHEN 1 THEN 'CANCELADO' "+
		" 		            WHEN 2 THEN 'FINALIZADO' END) AS 'STATUS_PROCESSO', "+
		" 	IFNULL(EP.NOM_ESTADO, '') as 'ATIVIDADE', "+
		" 	IFNULL(FU2.FULL_NAME, '') as 'APROVADOR' "+
		" FROM PROCES_WORKFLOW PW "+
		"   LEFT OUTER JOIN FDN_USERTENANT  FT1 ON FT1.USER_CODE        = PW.COD_MATR_REQUISIT "+ 
		" 	LEFT OUTER JOIN FDN_USER        FU1 ON FT1.USER_ID          = FU1.USER_ID "+   
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
		" WHERE PW.COD_EMPRESA    = 1 "+
		"   AND PW.COD_DEF_PROCES in ( 'Pagamento Benefício VT', 'Pagamentos Jurídicos','Pagamento RPA e NF Pessoa Fisica', 'Pagamento de Impostos - Facilitador', 'Pagamentos', 'Pagamento Médico', 'Pagamentos Estrangeiros' ) "+
		"   and PW.START_DATE >= "+xDT_INI+
		"   and PW.START_DATE <= "+xDT_FIM;
	
	log.info("### ds_verProcessosAnaliseII QUERY: " + minhaQuery);
	var dataSource = "/jdbc/AppDS";
	
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
		log.error("### ds_verProcessosAnaliseII ERROR --> " + e.message);
		newDataset.addColumn('ERROR');
		newDataset.addRow([e.message]);
	} finally {
		if (rs != null)
			rs.close();
		
		if (stmt != null)
			stmt.close();
		
		if (conn != null)
			conn.close();
	}
	log.info("### ds_verProcessosAnaliseII - FINALIZADO");
	return newDataset;
}
