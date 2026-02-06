function displayFields(form,customHTML){
    var CURRENT_STATE = getValue('WKNumState');
    customHTML.append('<script> var CURRENT_STATE = ' + CURRENT_STATE + '; </script>');

    if(form.getValue("prioridade") == "E"){
		form.setVisibleById("div_motivoEmergencial", true);
	}
}