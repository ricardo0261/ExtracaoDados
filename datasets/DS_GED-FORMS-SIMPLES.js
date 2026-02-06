function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigDS"; 
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
	
	// VALOR CONFORME PARAMETROS
	var xDATASET = "'ds_direcionamentoAutomaticoV360'",
		xTABELA  = '',
		xEMPRESA = 1;
	
    if (constraints !== null && constraints !== undefined) 
    	for (var i = 0; i < constraints.length; i++) 
    		if (constraints[i].fieldName == 'DATASET') 
    			xDATASET = "'"+constraints[i].initialValue+"'";

	// "  'ML0010'+CONVERT(VARCHAR(10),D.COD_LISTA      ) AS TABELA_PRINCIPAL, "+
	// "  'ML0010'+CONVERT(VARCHAR(10),l.COD_LISTA_FILHO) AS TABELA_PAIxFILHO, "+
	var myQuery =
		"SELECT "+
		" D.COD_LISTA       AS TABELA_PRINCIPAL, "+
	    " l.COD_LISTA_FILHO AS TABELA_PAIxFILHO, "+
		" d.NUM_DOCTO_PROPRIED,d.NUM_VERS_PROPRIED "+
		" from DOCUMENTO d "+
		"  LEFT JOIN SERV_DATASET   ds ON ds.COD_DATASET =d.NM_DATASET "+ 
		"  LEFT JOIN META_LISTA_REL l  ON l.COD_LISTA_PAI=d.COD_LISTA "+
		" WHERE d.NM_DATASET="+xDATASET;

	//--
	log.info('### TH-FORMS-SIMPLES: '+myQuery);
 	try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(myQuery);
        var columnCount = rs.getMetaData().getColumnCount();
        while (rs.next()) {
            if (!created) {
                for (var i = 1; i <= columnCount; i++) {
                    newDataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                created = true;
            }
            var Arr = new Array();
            for (var i = 1; i <= columnCount; i++) {
                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null != obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = "null";
                }
            }
            newDataset.addRow(Arr);
        }
    } catch (e) {
        log.error("### TH-FORMS-SIMPLES ERROR ---> " + e.message);
    } finally {
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
    return newDataset;
}