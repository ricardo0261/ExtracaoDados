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

//		"WITH RECURSIVE ORGANOGRAMA AS ( "+
//		"     SELECT "+
//		"         CAST(D1.DS_PRINCIPAL_DOCUMENTO AS CHAR) AS CAMINHO, "+
//		"         D1.NR_DOCUMENTO "+
//		"     FROM documento D1 "+
//		"     WHERE "+
//		"         D1.TP_DOCUMENTO = 1 "+
//		"         AND D1.VERSAO_ATIVA = 1 "+
//		"         AND D1.NR_DOCUMENTO_PAI > 0 "+
//		"         AND D1.NR_DOCUMENTO <>1 "+
//		"         AND D1.DS_PRINCIPAL_DOCUMENTO <>'Meus Documentos' "+
//		"     UNION ALL "+
//		"     SELECT  "+
//		"         CONCAT(L.CAMINHO, ' | ', CAST(D1.DS_PRINCIPAL_DOCUMENTO AS CHAR)) AS CAMINHO, "+
//		"         D1.NR_DOCUMENTO "+
//		"     FROM DOCUMENTO D1 "+
//		"         INNER JOIN ORGANOGRAMA L ON L.NR_DOCUMENTO = D1.NR_DOCUMENTO_PAI "+
//		"     WHERE "+   
//		"         D1.TP_DOCUMENTO = 1 "+
//		"         AND D1.VERSAO_ATIVA = 1 "+
//		"         AND D1.NR_DOCUMENTO_PAI > 0 "+
//		"         AND D1.NR_DOCUMENTO <>1 "+
//		"         AND D1.DS_PRINCIPAL_DOCUMENTO <>'Meus Documentos' "+
//		" )  "+
//		" SELECT DISTINCT F.CAMINHO "+
//		" FROM ORGANOGRAMA F  "+
//		" ORDER BY F.CAMINHO; ";
	
	
	var minhaQuery = 
		"SELECT "+
		"    D1.NR_DOCUMENTO_PAI, "+
		"    D1.NR_DOCUMENTO, "+
		"	D1.DS_PRINCIPAL_DOCUMENTO, "+
		"	csd.NUM_SEQ , "+
		"	case csd.IDI_TIP_ATRIBUIC "+
		"		when 1 then 'USUARIO' "+
		"		when 2 then 'GRUPO' "+
		"		when 3 then 'TODOS' "+
		"		end as TIPO, "+
		"	csd.DES_VAL_ATRIBUIC, "+
		"	csd.IDI_NIV_PERMIS_SEGUR as NIVEL, "+
		"	csd.LOG_LISTA_CONTDO as LISTA_CONTEUDO, "+
		"	csd.LOG_PERMITE_DOWNLOAD as PERMITE_DOWNLOAD "+
		"FROM documento D1 "+
		"	left outer join configur_segur_docto csd on D1.COD_EMPRESA = csd.COD_EMPRESA and D1.NR_DOCUMENTO = csd.NR_DOCUMENTO and D1.NR_VERSAO = csd.NR_VERSAO "+
		"WHERE   D1.COD_EMPRESA =1 "+
		"	 and D1.TP_DOCUMENTO = 1 "+
		"	 AND D1.VERSAO_ATIVA = 1 "+
		"	 AND D1.NR_DOCUMENTO_PAI > 1 "+
		"	 AND D1.DS_PRINCIPAL_DOCUMENTO <>'Meus Documentos' ";
 

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
		log.error("### ds_verEstruturaPastasGED ERROR --> " + e.message);
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
