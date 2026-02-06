function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();
	    newDataset.addColumn("groupId");
	    newDataset.addColumn("colleagueId");
        newDataset.addColumn("email");
        newDataset.addColumn("nome");

    // ler dataset interno colleagueGroup recuperar colleagueGroupPK.colleagueId e colleagueGroupPK.groupId
    var colleagueGroup = DatasetFactory.getDataset("colleagueGroup", null, null, null);
    for (var j = 0; j < colleagueGroup.rowsCount; j++) {

        // recuperar usuario e e-mail no dataset colleague
        var userId = colleagueGroup.getValue(j,'colleagueGroupPK.colleagueId');
        var params = new Array();
            params.push( DatasetFactory.createConstraint("companyId", 1, 1, ConstraintType.MUST) );
            params.push( DatasetFactory.createConstraint("colleagueId", userId, userId, ConstraintType.MUST) );
        var colleague = DatasetFactory.getDataset("colleague", null, params, null);

        // SOMENTE USUARIO ATIVO
        if (colleague.getValue(0,'active') != "true") {
            continue;
        }

        // adicionar linha no dataset
        newDataset.addRow( [
            colleagueGroup.getValue(j,'colleagueGroupPK.groupId'),
            colleagueGroup.getValue(j,'colleagueGroupPK.colleagueId'),
            colleague.getValue(0,'mail'),
            colleague.getValue(0,'colleagueName')
        ]);
    }
    // FINALIZADO
    return newDataset;
}
