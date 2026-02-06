
function createDataset(fields, constraints, sortFields) {
	
	
	 var newDataset = DatasetBuilder.newDataset();   
	    
	    var dataSource = "/jdbc/AppDS";
	    

		
	    
	    try {
	   
	    var ic = new javax.naming.InitialContext();
	    var ds = ic.lookup(dataSource);
	    
	    var created = false;   
	    
	    filtro = "";
	    

		for ( var i in constraints) {
			
			log.info("constraints[i].fieldName "+constraints[i].fieldName);
			
					if(constraints[i].fieldName	== "a.COD_DEF_PROCES")
						{
						
						log.info("constraints[i].fieldName "+constraints[i].fieldName);
						log.info("constraints[i].initialValue "+constraints[i].initialValue);
						filtro += " and "
						filtro += constraints[i].fieldName + " = '" + constraints[i].initialValue+"'";
						
						}
					else if(constraints[i].fieldName == "d.GROUP_CODE")
						{
						
						log.info("constraints[i].fieldName "+constraints[i].fieldName);
						log.info("constraints[i].initialValue "+constraints[i].initialValue);
						filtro += " and "
						filtro += constraints[i].fieldName + " = '" + constraints[i].initialValue +"'";
						
						}

			
		}


	    	var myQuery = "select " +
	    	"a.COD_DEF_PROCES, " +
	    	"a.DES_DEF_PROCES, " +
	    	
	    	"trim(substring(b.DSL_CONFIGUR_MECAN_ATRIBUIC, LOCATE('up>', b.DSL_CONFIGUR_MECAN_ATRIBUIC, 1)+3,LOCATE('</Group>', b.DSL_CONFIGUR_MECAN_ATRIBUIC, 1)-30)) as 'Grupo', " + 
	    	
	    	"b.NOM_ESTADO, " +
	    	"d.DESCRIPTION, " +
	    	"d.GROUP_CODE, " +
	    	"d.GROUP_ID, " +
	    	"e.LOGIN, " +
	    	"f.USER_CODE, " +
	    	"f.USER_ID, " +
	    	"g.FULL_NAME, " +
	    	
	    	"h.EMAIL " +


	    	"from DEF_PROCES a, " + 
	    	"	VERS_DEF_PROCES c, " +
	    	"	 ESTADO_PROCES b " +
	    	"	   LEFT JOIN FDN_GROUP d on trim(substring(b.DSL_CONFIGUR_MECAN_ATRIBUIC, LOCATE('up>', b.DSL_CONFIGUR_MECAN_ATRIBUIC, 1)+3,LOCATE('</Gr', b.DSL_CONFIGUR_MECAN_ATRIBUIC, 1)-30)) = d.GROUP_CODE " +
	    	"	   LEFT JOIN FDN_GROUPUSERROLE e on d.GROUP_CODE = e.GROUP_CODE " +
	    	"	   LEFT JOIN FDN_USERTENANT F on f.LOGIN = e.LOGIN " +
	    	"	   LEFT JOIN FDN_USER G on f.USER_ID = g.USER_ID " +
	    	"	   LEFT JOIN FDN_USERTENANT h on g.USER_ID = h.USER_TENANT_ID " +
	    		 
	    		  
	    	"where " +
	    	"	a.cod_DEF_PROCES = b.COD_DEF_PROCES " +
	    	"	and b.COD_DEF_PROCES = c.COD_DEF_PROCES " +
	    	"	and b.DSL_CONFIGUR_MECAN_ATRIBUIC like '%GROUP%' " +
	    	"	and c.LOG_ATIV = '1' " +
	    	"	and f.USER_STATE = '1' " +
	    	"	and c.NUM_VERS = b.NUM_VERS " ;
	    	
	    	
	    	
			if(filtro != ""){
				myQuery += filtro
			}
	    	
			myQuery += " order by a.COD_DEF_PROCES ";
	    	
	    	log.info("myQuery "+myQuery);
	    	
	    	log.info("filtro "+filtro);
		
	        var conn = ds.getConnection();       
	        var stmt = conn.createStatement();
	        var rs = stmt.executeQuery(myQuery);       
	        var columnCount = rs.getMetaData().getColumnCount();
	        log.info("################  >>>>> columnCount  = " + columnCount);
	        log.info(rs);
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
	        log.error("ERRO==============> " + e.message);
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