// function beforeSendData(customFields,customFacts){
	
// 	var CURRENT_STATE = getValue("WKNumState");
	
// 	log.info("==================================================beforeSendData - inicio "+ getValue("WKDef")+" - "+getValue("WKNumProces")+" - "+getValue("WKNumState"));

// 	var tipoSolicitacao = hAPI.getCardValue("analyticsTpSolicitacao") == "" ? " " : hAPI.getCardValue("analyticsTpSolicitacao");
// 	var dataInicio = hAPI.getCardValue("analyticsDtInicio") == "" ? " " : hAPI.getCardValue("analyticsDtInicio") ;
// 	var horaInicio = hAPI.getCardValue("analyticsHrInicio") == "" ? " " : hAPI.getCardValue("analyticsHrInicio");
// 	var dataPrazo = hAPI.getCardValue("analyticsDtPrazo") == "" ? " " : hAPI.getCardValue("analyticsDtPrazo");
// 	var horaPrazo = hAPI.getCardValue("analyticsHrPrazo") == "" ? " " : hAPI.getCardValue("analyticsHrPrazo");
// 	var dataFim = hAPI.getCardValue("analyticsDtFim") == "" ? " " : hAPI.getCardValue("analyticsDtFim");
// 	var horaFim = hAPI.getCardValue("analyticsHrFim") == "" ? " " : hAPI.getCardValue("analyticsHrFim");
// 	var filial = hAPI.getCardValue("analyticsNmFilial") == "" ? " " : hAPI.getCardValue("analyticsNmFilial");	
// 	var responsavel = hAPI.getCardValue("analyticsNmResponsavelSLA") == "" ? " " : hAPI.getCardValue("analyticsNmResponsavelSLA");
// 	var prazoSLA = hAPI.getCardValue("analyticsPrazoSLA") == "" ? "0" : hAPI.getCardValue("analyticsPrazoSLA");
	
// 	customFields[0] = tipoSolicitacao;
// 	customFields[1] = dataInicio;
// 	customFields[2] = horaInicio; 	
// 	customFields[3] = dataPrazo;
// 	customFields[4] = horaPrazo; 
// 	customFields[5] = dataFim; 
// 	customFields[6] = horaFim;
	
// 	customFields[7] = filial;
// 	customFields[8] = responsavel;
// 	customFields[9] = ' ';
// 	customFields[10] = ' ';
// 	customFields[11] = ' ';
// 	customFields[12] = ' ';
// 	customFields[13] = ' ';
// 	customFields[14] = ' ';
// 	customFields[15] = ' ';
// 	customFields[16] = ' ';
// 	customFields[17] = ' ';
// 	customFields[18] = ' ';
// 	customFields[19] = ' ';
// 	customFields[20] = ' ';
// 	customFields[21] = ' ';
// 	customFields[22] = ' ';
// 	customFields[23] = ' ';
// 	customFields[24] = ' ';
// 	customFields[25] = ' ';
// 	customFields[26] = ' ';
// 	customFields[27] = ' ';
// 	customFields[28] = ' ';
// 	customFields[29] = ' ';
	
// 	customFacts[0] = new java.lang.Double(prazoSLA); //new java.lang.Double("40"); 
// 	customFacts[1] = new java.lang.Double("0");
// 	customFacts[2] = new java.lang.Double("0");
// 	customFacts[3] = new java.lang.Double("0");
// 	customFacts[4] = new java.lang.Double("0");
// 	customFacts[5] = new java.lang.Double("0");
// 	customFacts[6] = new java.lang.Double("0");
// 	customFacts[7] = new java.lang.Double("0");
// 	customFacts[8] = new java.lang.Double("0");
// 	customFacts[9] = new java.lang.Double("0");
	
// 	log.info("================================= beforeSendData Solicitação de Pagamentos/Repasse Médico/RPA - fim "+ getValue("WKNumProces"));
// 	log.info("============beforeSendData  tipoSolicitacao           : "+customFields[0]);
// 	log.info("============beforeSendData  dataInicio                : "+customFields[1]);
// 	log.info("============beforeSendData  horaInicio                : "+customFields[2]);
// 	log.info("============beforeSendData  dataPrazo                 : "+customFields[3]);
// 	log.info("============beforeSendData  horaPrazo                 : "+customFields[4]);
// 	log.info("============beforeSendData  dataFim                   : "+customFields[5]);
// 	log.info("============beforeSendData  horaFim                   : "+customFields[6]);
// 	log.info("============beforeSendData  filial                    : "+customFields[7]);
// 	log.info("============beforeSendData  responsavel               : "+customFields[8]);
// 	log.info("============beforeSendData  prazosSLA                 : "+customFacts[0]);
// 	log.info("==================================================beforeSendData - fim");
// }