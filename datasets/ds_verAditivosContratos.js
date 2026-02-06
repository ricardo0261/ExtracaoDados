function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();

	// VALOR CONFORME PARAMETROS
	var xDT_INI="'2024-01-24'",
		xDT_FIM="'2024-01-24 23:59'";
    if (constraints !== null && constraints !== undefined) 
    	for (var i = 0; i < constraints.length; i++) 
    		if (constraints[i].fieldName == 'dataSolicitacao') {
    			xDT_INI = "'"+ constraints[i].initialValue +"'";
    			xDT_FIM = "'"+ constraints[i].finalValue   +"'";
    		}

	var minhaQuery = 
		"SELECT DISTINCT PW.NUM_PROCES, "+
		"    (case PW.STATUS when 0 then 'Aberto' "+
		"                    when 2 then 'Finalizado' "+
		"                    when 1 then 'Cancelado' else '' end) AS STATUS, ML.*, IT.* "+
		" FROM PROCES_WORKFLOW PW,DOCUMENTO D,"+
		"      ML001225 ML left outer join ML001226 IT ON IT.documentId = ML.documentId and IT.version = ML.version "+
		" WHERE PW.COD_EMPRESA       = 1 "+
		"   AND PW.COD_DEF_PROCES    = 'AditivoDeContratos' "+
		"   AND PW.START_DATE       >= "+xDT_INI+
		"   AND PW.START_DATE       <= "+xDT_FIM+
		"   AND PW.NR_DOCUMENTO_CARD = D.NR_DOCUMENTO "+
		"   AND  D.COD_EMPRESA       = 1 "+
		"   AND  D.VERSAO_ATIVA      = 1 "+
		"   AND  D.NR_DOCUMENTO      = ML.documentid "+
		"   AND  D.NR_VERSAO         = ML.version ";

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
