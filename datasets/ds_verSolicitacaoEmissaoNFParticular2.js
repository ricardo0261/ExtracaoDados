function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();

	// PROCESSO
	var processo = 'solicitacaoEmissaoNFParticular2';

    // TABELA
	var const0 =[];
		const0[0]= DatasetFactory.createConstraint("PROCESSO",processo,'',ConstraintType.MUST);
	var dsFORM  = DatasetFactory.getDataset("DS_GED-FORMS",null,const0,null);
	var TABELA_PRINCIPAL = 'ML001'+dsFORM.getValue(0,"COD_LISTA");

	// VALOR CONFORME PARAMETROS
	var xDT_INI="'2025-12-01'",
		xDT_FIM="'2026-01-31 23:59'";
    if (constraints !== null && constraints !== undefined) 
    	for (var i = 0; i < constraints.length; i++) 
    		if (constraints[i].fieldName == 'dataSolicitacao') {
    			xDT_INI = "'"+ constraints[i].initialValue +"'";
    			xDT_FIM = "'"+ constraints[i].finalValue   +"'";
    		}

	var minhaQuery = 
		"SELECT DISTINCT PW.NUM_PROCES, "+
		" 'solicitacaoEmissaoNFParticular2' AS DESCRICAO, "+
		"    (case PW.STATUS when 0 then 'Aberto' "+
		"                    when 2 then 'Finalizado' "+
		"                    when 1 then 'Cancelado' else '' end) AS SITUACAO, "+
		" ML.campoIdentificador, "+
		" ML.solicitante , "+
		" ml.nomePaciente, "+
		" PW.START_DATE , "+
		" PW.END_DATE , "+	
	    " TP.DEADLINE , "+
		" EP.NOM_ESTADO , "+

		" (CASE WHEN TP.CD_MATRICULA LIKE 'Pool%' THEN REPLACE(TP.CD_MATRICULA,'Pool:Group:','') ELSE (CASE WHEN FG.GROUP_CODE IS NULL THEN UPPER(FU2.FULL_NAME) ELSE FG.GROUP_CODE END)END) AS AREA_RESPONSAVEL_ATIVIDADE, "+

		" upper(CASE WHEN FI2.FULL_NAME   IS NULL THEN "+
		"      (CASE WHEN FU2.FULL_NAME   IS NULL THEN FG.DESCRIPTION ELSE FU2.FULL_NAME END)  ELSE FI2.FULL_NAME END) AS RESPONSAVEL, "+
		" ML.nomeOperadora, "+
		" ML.valorTotalFormasRecebimento "+
		" FROM PROCES_WORKFLOW PW "+
		"  INNER JOIN DOCUMENTO D ON PW.NR_DOCUMENTO_CARD = D.NR_DOCUMENTO AND D.COD_EMPRESA = 1 AND D.VERSAO_ATIVA = 1 "+
		"  INNER JOIN "+TABELA_PRINCIPAL+" ML ON D.NR_DOCUMENTO = ML.documentid AND D.NR_VERSAO = ML.version "+
		"  LEFT OUTER JOIN TAR_PROCES      TP  ON TP.COD_EMPRESA=1 and TP.NUM_PROCES = PW.NUM_PROCES AND TP.LOG_ATIV=1 "+

	    "	LEFT OUTER JOIN HISTOR_PROCES HP ON HP.COD_EMPRESA=1 and PW.NUM_PROCES = HP.NUM_PROCES AND HP.NUM_SEQ_MOVTO = (select max(HP2.NUM_SEQ_MOVTO) from HISTOR_PROCES HP2 WHERE HP2.COD_EMPRESA=1 and HP2.NUM_PROCES=PW.NUM_PROCES) "+
		"	LEFT OUTER JOIN ESTADO_PROCES EP ON EP.COD_EMPRESA=1 and PW.COD_DEF_PROCES = EP.COD_DEF_PROCES AND PW.NUM_VERS = EP.NUM_VERS AND EP.NUM_SEQ = HP.NUM_SEQ_ESTADO "+

		"  LEFT OUTER JOIN FDN_USERTENANT  FU  ON FU.USER_CODE =TP.COD_MATR_ESCOLHID "+
		"  LEFT OUTER JOIN FDN_USER        FU2 ON FU.USER_ID   =FU2.USER_ID "+
		"  LEFT OUTER JOIN FDN_GROUP       FG  ON FG.GROUP_CODE=(REPLACE(TP.COD_MATR_ESCOLHID,'Pool:Group:','')) "+
		"  LEFT OUTER JOIN FDN_USERTENANT  FI  ON FI.USER_CODE =TP.CD_MATRICULA "+
		"  LEFT OUTER JOIN FDN_USER        FI2 ON FI.USER_ID   =FI2.USER_ID "+
		" WHERE PW.COD_EMPRESA       = 1 "+
		"   AND PW.COD_DEF_PROCES    = '"+processo+"' "+
		"   AND PW.START_DATE       >= "+xDT_INI+
		"   AND PW.START_DATE       <= "+xDT_FIM;

	// Log para debug
	log.info("### ds_verSolicitacaoEmissaoNFParticular2 TABELA_PRINCIPAL: " + TABELA_PRINCIPAL);
	log.info("### ds_verSolicitacaoEmissaoNFParticular2 Query SQL: " + minhaQuery);

	var dataSource = "/jdbc/FluigDSRO";
	
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
		log.error("### DS_SQL_CONSULTA_FLUIG_TESTE ERROR --> " + e.message);
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
