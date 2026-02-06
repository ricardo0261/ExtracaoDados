function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();
	
	var minhaQuery =
		" SELECT UT.TENANT_ID, " +
		"        UT.USER_CODE, "+ 
		"        UT.IDP_ID, "+
		"        FU.FULL_NAME, "+
		"        UT.LOGIN,     "+
		"        UT.EMAIL,     "+
		"        CASE "+
		"            WHEN UT.USER_STATE = '2' THEN 'Bloqueado' "+
		"            ELSE 'Ativo' "+
		"        END 'Status', "+
		"        CASE "+
		"            WHEN FU.USER_TYPE = '0' THEN 'Padrão' "+
		"            WHEN FU.USER_TYPE = '1' THEN 'Especial' "+
		"            WHEN FU.USER_TYPE = '2' THEN 'Temporário' "+
		"            WHEN FU.USER_TYPE = '3' THEN 'OAuth' "+
		"        END 'Perfil Usuário', "+
		"        GROUP_CONCAT(DISTINCT RL.ROLE_CODE) as PAPEIS, "+
		"        GROUP_CONCAT(DISTINCT GR.GROUP_CODE) as GRUPOS "+
		" FROM FDN_USERTENANT    UT "+
		" JOIN FDN_USER          FU ON UT.USER_ID = FU.USER_ID "+
		" JOIN FDN_USERROLE      RL ON UT.LOGIN   = RL.LOGIN  "+
		" JOIN FDN_GROUPUSERROLE GR ON UT.LOGIN   = GR.LOGIN "+
		" WHERE UT.TENANT_ID = 1 "+
		" GROUP BY UT.TENANT_ID,UT.USER_CODE,UT.IDP_ID,FU.FULL_NAME,UT.LOGIN,UT.EMAIL,UT.USER_STATE, FU.USER_TYPE ";

	log.info("start - DS_SQL_CONSULTA_FLUIG_TESTE QUERY: " + minhaQuery);
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
