var is_string=function(input){
    return typeof(input)=='string';
};

/*SET THE SCROLL*/
var updateTableCell=function(table,settings){
			var tbody=table.children("tbody");
			var thead=table.children("thead");		
	
			tbody.find("tr").each(function(){
									var row = $(this);
									row.find("td:gt("+(settings.scrollInterval[0]-1)+"):lt("+(settings.scrollInterval[1]-1)+")").hide();
									row.find("td:lt("+((settings.visibleInterval*settings.intervalLength)+1)+"):gt("+((settings.visibleInterval*settings.intervalLength)-settings.intervalLength)+")").show();
			});
			
			thead.find(".rows_title td:gt("+(settings.scrollInterval[0]-1)+"):lt("+(settings.scrollInterval[1]-1)+")").hide();
			thead.find(".rows_title td:lt("+((settings.visibleInterval*settings.intervalLength)+1)+"):gt("+((settings.visibleInterval*settings.intervalLength)-settings.intervalLength)+")").show();	
};

/*EXECUTE THE CONTROL FEATURES*/
var configScrollControls = function(settings,table) {
			$(settings.nextControl).click(function(){
												   if (settings.visibleInterval < settings.maxIntPos){
   												   settings.visibleInterval++;
   												   updateTableCell(table,settings);}
   												executeScrollCallBacks(settings);
												   });
			$(settings.lastControl).click(function(){
												   settings.visibleInterval=settings.maxIntPos;
												   updateTableCell(table,settings);
			                              executeScrollCallBacks(settings);
												   });
			$(settings.prevControl).click(function(){
												   if (settings.visibleInterval > settings.minIntPos){
   												   settings.visibleInterval--;
   												   updateTableCell(table,settings);}
   												executeScrollCallBacks(settings);
												   });
			$(settings.firstControl).click(function(){
												   settings.visibleInterval=settings.minIntPos;
												   updateTableCell(table,settings);
			                              executeScrollCallBacks(settings);   
												   });   
}

/*EXECUTE SCROLL CALLBACK*/
var executeScrollCallBacks = function(settings) {
         if ((settings.visibleInterval == settings.maxIntPos) && (settings.scrollCallbacks.isLast))
            settings.scrollCallbacks.isLast();
         if ((settings.visibleInterval == settings.minIntPos) && (settings.scrollCallbacks.isFirst))
            settings.scrollCallbacks.isFirst();
         if ((settings.visibleInterval < settings.maxIntPos) && (settings.scrollCallbacks.isNotLast))
            settings.scrollCallbacks.isNotLast();
         if ((settings.visibleInterval > settings.minIntPos) && (settings.scrollCallbacks.isNotFirst))
            settings.scrollCallbacks.isNotFirst();
};

(function($) {
    $.fn.extend({
        jqtable: function(options) {
			var settings = $.extend( {
				lastCell: this.children("tbody").find("tr:first td").length,
				scrollInterval: [0,'last'],
				intervalLength: 1,
				visibleInterval: 1,
				maxIntPos:0,
				minIntPos:0,
				nextControl: "",
				prevControl: "",
				lastControl: "",
				firstControl: "",
         	scrollCallbacks: {
         			isLast: function(){},
         	      isNotLast: function(){},
         			isFirst: function(){},
               	isNotFirst: function(){}
         		},
			}, options);			
			
			var table=this;		
			
			if (is_string(settings.scrollInterval[1]))
				settings.scrollInterval[1]=eval(settings.scrollInterval[1].replace(/last/g,settings.lastCell).replace(/first/g,settings.firstCell));
			if (settings.visibleInterval=='last')
				settings.visibleInterval=(settings.scrollInterval[1]-settings.scrollInterval[0])/settings.intervalLength;
					
			settings.minIntPos = settings.scrollInterval[0];
			settings.maxIntPos = (settings.scrollInterval[1]-settings.scrollInterval[0])/settings.intervalLength;				

			updateTableCell(table,settings); /*UPDATE CELL VISIBILITY ACCORING VISIBLE INDEX*/
			executeScrollCallBacks(settings);/*UPDATE CONTROLS ACORDING POSITION*/		

         configScrollControls(settings,table)/*SET SCROLL CONTROLS*/

												   
         /***DATA CONTROLS***/
			$(settings.dataInfo.updateControl).click(function(){
                                       $.ajax({
                                             type:       "POST",
                                             url:        settings.dataInfo.dataUrl,
                                             data:       settings.dataInfo.params,
                                             beforeSend: settings.dataInfo.dataCallbacks.loading,
                                             error:      settings.dataInfo.dataCallbacks.error,
                                             success: function(response) {
                                                switch (settings.dataInfo.responseType.toUpperCase()){
                                                	case 'HTML':
                                                      $(settings.dataInfo.dinamicContainer).html(response);
                                                	break;
                                                   case 'JSON':
                                                      //JSON IMP
                                                	break;
                                                }
                                             updateTableCell(table,settings);  
                                             settings.dataInfo.dataCallbacks.succes();
                                             },
                                          });
			                              });

		}
    });
})(jQuery);