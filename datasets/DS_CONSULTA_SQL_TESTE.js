function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();
	
	// D1.NR_DOCUMENTO_PAI, D1.NR_DOCUMENTO, D1.DS_PRINCIPAL_DOCUMENTO "+
	var minhaQuery =
		"SELECT NUM_PROCES, COD_DEF_PROCES, START_DATE, END_DATE, STATUS, YEAR(START_DATE) ANO, MONTH(START_DATE) MES "+
		"  FROM PROCES_WORKFLOW "+
		" WHERE START_DATE <'2024-01-01' "+
		"   AND STATUS =0 ";
			
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
