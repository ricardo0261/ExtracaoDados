function createDataset(fields, constraints, sortFields) {
    var Dataset    = DatasetBuilder.newDataset();
    var dataSource = "/jdbc/FluigDSRO"; 
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    var created = false;
	
	var myQuery =
		"SELECT ROLE_CODE AS PAPEL, LOGIN AS USUARIO "+
		"  FROM FDN_USERROLE "+
		" ORDER BY ROLE_CODE ";

	log.info('### DS_CAD-PAPEIS: '+myQuery);
 	try {
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
        var rs = stmt.executeQuery(myQuery);
        var columnCount = rs.getMetaData().getColumnCount();
        while (rs.next()) {
            if (!created) {
                for (var i = 1; i <= columnCount; i++) {
                    Dataset.addColumn(rs.getMetaData().getColumnName(i));
                }
                created = true;
            }
            var Arr = new Array();
            for (var i = 1; i <= columnCount; i++) {
                var obj = rs.getObject(rs.getMetaData().getColumnName(i));
                if (null !== obj) {
                    Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
                } else {
                    Arr[i - 1] = null;
                }
            }
            Dataset.addRow(Arr);
        }
    } catch (e) {
        log.error("### DS_CAD-PAPEIS ERROR ---> " + e.message);
    } finally {
        if (stmt != null) 
            stmt.close();
        if (conn != null)
            conn.close();
    }
    return Dataset;
}
