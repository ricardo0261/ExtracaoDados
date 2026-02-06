function createDataset(fields, constraints, sortFields) {
	log.info("### ds_verAnaliseI.js - INICIADO");
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
	    			finalValue = finalValue;
	    		}
	    		xDT_FIM = "'"+ finalValue +"'";
    		}
    
    if(xDT_INI==''){
		log.error("### ds_verAnaliseI ERROr --> " + e.message);
		newDataset.addColumn('ERRROR');
		newDataset.addRow(['Os parametros de data inicial e final são necessários por conta do volume de dados para extração.','Utilize períodos preferencialmente mensais para extração']);
		return newDataset;
    }
	var minhaQuery =
		"SELECT * from PROCES_WORKFLOW where START_DATE >="+xDT_INI+" and START_DATE <="+xDT_FIM;
		   
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
		log.error("### ds_verAnaliseI.js ERROr --> " + e.message);
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
