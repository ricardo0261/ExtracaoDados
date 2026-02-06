function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();
	
	// VALOR CONFORME PARAMETROS
	var xDT_INI="'2024-01-01'",
		xDT_FIM="'2024-01-24 23:59'";
    if (constraints !== null && constraints !== undefined) 
    	for (var i = 0; i < constraints.length; i++) 
    		if (constraints[i].fieldName == 'dataSolicitacao') {
    			xDT_INI = "'"+ constraints[i].initialValue +"'";
    			xDT_FIM = "'"+ constraints[i].finalValue   +"'";
    		}
    
	// "(PW.INICIO_PROCESSO BETWEEN "+xDT_INI+" AND "+xDT_FIM+" )"+
	var minhaQuery =
		"SELECT PW.* FROM vw_processos_atividades_dp PW "+
		" WHERE (STATUS_PROCESSO = 'Aberto') "+
		"    OR (PW.FIM_PROCESSO >="+xDT_INI+" AND PW.FIM_PROCESSO<="+xDT_FIM+" )";
			
	log.info("start - DS_SQL_CONSULTA_FLUIG_TESTE QUERY: " + minhaQuery);
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
		log.error("### DS_SQL_CONSULTA_FLUIG_TESTE ERROr --> " + e.message);
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
