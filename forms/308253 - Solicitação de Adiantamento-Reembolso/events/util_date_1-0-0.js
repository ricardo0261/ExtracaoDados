/*
 * Retorna a Data Atual (Formato Americano)
 */
function buscarData(){
	return new Date();
}

/*
 * Retorna o Dia Atual (String)
 */
function buscarDiaAtual(){
	return buscarData().getDate().toString();
}

/*
 * Retorna o Mes Atual (String)
 */
function buscarMesAtual(){
	return (buscarData().getMonth()+1).toString();
}

/*
 * Retorna o Ano Atual (String)
 */
function buscarAnoAtual(){
	return buscarData().getFullYear().toString();
}

/*
 * Retorna a Data Atual (Formato Brasileiro) (String)
 * 
 * Params: Dia (String), Mes (String), Ano (String) 
 */
function formatarData(dia, mes, ano){
	if(dia.length == 1)
		dia = 0+dia;	
	if(mes.length == 1)
		mes = 0+mes;	
	return dia+"/"+mes+"/"+ano;
}

/*
 * Retorna a Data Atual (Formato Brasileiro)
 */
function buscarDataAtual(){
	return formatarData(buscarDiaAtual(), buscarMesAtual(), buscarAnoAtual());
}

/*
 * Instancia o Plugin Jquery "DATEPICKER" para a Class
 * 
 * Params: customHTML, class do Campo (sugestão: "calendario")
 */
function formatarCalendario(customHTML, classCampo){
	customHTML.append('<script>');
	customHTML.append('$(function() {');
	customHTML.append('$(".'+classCampo+'").datepicker({');
	customHTML.append('dateFormat: "dd/mm/yy",');
	customHTML.append('dayNames: ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"],');
	customHTML.append('dayNamesMin: ["D","S","T","Q","Q","S","S","D"],');
	customHTML.append('dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb","Dom"],');
	customHTML.append('monthNames: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],');
	customHTML.append('monthNamesShort: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],');
	customHTML.append('nextText: "Próximo",');
	customHTML.append('prevText: "Anterior"');
	customHTML.append('});');
	customHTML.append('});');
	customHTML.append('</script>');
}
