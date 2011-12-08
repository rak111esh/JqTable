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
									row.find("td:lt("+((settings.scrollPosition*settings.intervalLength)+1)+"):gt("+((settings.scrollPosition*settings.intervalLength)-settings.intervalLength)+")").show();
			});
			
			thead.find(".rows_title td:gt("+(settings.scrollInterval[0]-1)+"):lt("+(settings.scrollInterval[1]-1)+")").hide();
			thead.find(".rows_title td:lt("+((settings.scrollPosition*settings.intervalLength)+1)+"):gt("+((settings.scrollPosition*settings.intervalLength)-settings.intervalLength)+")").show();	
};

/*EXECUTE THE CONTROL FEATURES*/
var configScrollControls = function(settings,table) {
			$(settings.nextControl).click(function(){
												   if (settings.scrollPosition < settings.maxIntervalPos){
   												   settings.scrollPosition++;
   												   updateTableCell(table,settings);}
   												executeScrollCallBacks(settings);
												   });
			$(settings.lastControl).click(function(){
												   settings.scrollPosition=settings.maxIntervalPos;
												   updateTableCell(table,settings);
			                              executeScrollCallBacks(settings);
												   });
			$(settings.prevControl).click(function(){
												   if (settings.scrollPosition > settings.minIntervalPos){
   												   settings.scrollPosition--;
   												   updateTableCell(table,settings);}
   												executeScrollCallBacks(settings);
												   });
			$(settings.firstControl).click(function(){
												   settings.scrollPosition=settings.minIntervalPos;
												   updateTableCell(table,settings);
			                              executeScrollCallBacks(settings);   
												   });   
}

/*EXECUTE SCROLL CALLBACK*/
var executeScrollCallBacks = function(settings) {
         if ((settings.scrollPosition == settings.maxIntervalPos) && (settings.scrollCallbacks.isLast))
            settings.scrollCallbacks.isLast();
         if ((settings.scrollPosition == settings.minIntervalPos) && (settings.scrollCallbacks.isFirst))
            settings.scrollCallbacks.isFirst();
         if ((settings.scrollPosition < settings.maxIntervalPos) && (settings.scrollCallbacks.isNotLast))
            settings.scrollCallbacks.isNotLast();
         if ((settings.scrollPosition > settings.minIntervalPos) && (settings.scrollCallbacks.isNotFirst))
            settings.scrollCallbacks.isNotFirst();
};

(function($) {
    $.fn.extend({
        jqtable: function(options) {
			var settings = $.extend( {
				cellCount: this.children("tbody").find("tr:first td").length,
				scrollInterval: [0,'last'],
				scrollPosition: 1,
				intervalLength: 1,
				refScrollInterval: [0,'last'],
            refScrollPosition:1,
				maxIntervalPos:0,
				minIntervalPos:0,
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
			settings.refScrollInterval[0]= settings.scrollInterval[0];
			settings.refScrollInterval[1]= settings.scrollInterval[1];
			settings.refScrollPosition= settings.scrollPosition;

			if (is_string(settings.refScrollInterval[1])) //Calculate size of the scrollable area
				settings.scrollInterval[1]=eval(settings.scrollInterval[1].replace(/last/g,settings.cellCount).replace(/first/g,settings.firstCell));
			if (settings.refScrollPosition=='last')
				settings.scrollPosition=(settings.scrollInterval[1]-settings.scrollInterval[0])/settings.intervalLength;
					
			settings.minIntervalPos = settings.scrollInterval[0];
			settings.maxIntervalPos = (settings.scrollInterval[1]-settings.scrollInterval[0])/settings.intervalLength;

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
                                             settings.cellCount=table.children("tbody").find("tr:first td").length;
                                             if (is_string(settings.refScrollInterval[1]))
				                                      settings.scrollInterval[1]=eval(settings.refScrollInterval[1].replace(/last/g,settings.cellCount).replace(/first/g,settings.firstCell));
			                                    if (settings.refScrollPosition=='last')
				                                      settings.scrollPosition=(settings.scrollInterval[1]-settings.scrollInterval[0])/settings.intervalLength;
         			                           settings.minIntervalPos = settings.scrollInterval[0];
			                                    settings.maxIntervalPos = (settings.scrollInterval[1]-settings.scrollInterval[0])/settings.intervalLength;
                                             updateTableCell(table,settings); //Update Table
                                             executeScrollCallBacks(settings,table);
                                             settings.dataInfo.dataCallbacks.succes(); //Execute CallBack
                                             },
                                          });
			                              });

		}
    });
})(jQuery);