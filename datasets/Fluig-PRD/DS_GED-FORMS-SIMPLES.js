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
    
	var myQuery =
		"SELECT "+
		" D.COD_LISTA       AS TABELA_PRINCIPAL, "+
	    " L.COD_LISTA_FILHO AS TABELA_PAIxFILHO, "+
		" D.NUM_DOCTO_PROPRIED,D.NUM_VERS_PROPRIED "+
		" from DOCUMENTO D "+
		"  LEFT JOIN SERV_DATASET   DS ON DS.COD_DATASET =D.NM_DATASET "+ 
		"  LEFT JOIN META_LISTA_REL L  ON L.COD_LISTA_PAI=D.COD_LISTA "+
		" WHERE D.NM_DATASET = "+xDATASET;

	//--
	log.info('### TH-FORMS-SIMPLES: '+myQuery);
 	try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(myQuery);
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
        log.error("### TH-FORMS-SIMPLES ERROR ---> " + e.message);
    } finally {
        if (stmt != null) 
            stmt.close();
        
        if (conn != null)
            conn.close();
    }
    return newDataset;
}
