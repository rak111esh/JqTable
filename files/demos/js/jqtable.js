var is_string=function(input){
    return typeof(input)=='string';
};

/*FORMAT THE VISIBILITO IF THE TOW*/
var formatRow = function(row,settings){
         row.find("td:gt("+(settings.scrollInterval[0]-1)+"):lt("+(settings.scrollInterval[1]-1)+")").hide();
         row.find("td:lt("+((settings.scrollPosition*settings.intervalLength)+1)+"):gt("+((settings.scrollPosition*settings.intervalLength)-settings.intervalLength)+")").show();   
}

/*SET THE SCROLL*/
var updateTableCell=function(tableObject,settings){	
			tableObject.find("tr").each(function(){
									formatRow($(this),settings);
			});						
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
};

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

/*SET THE INTERVEL POSITION AND SCROLL*/
var setScrollConfig = function(settings,table,typeUpdate){
      settings.cellCount=table.children("tbody").find("tr:first td").length;

      if (is_string(settings.refScrollInterval[1]))
			settings.scrollInterval[1]=eval(settings.refScrollInterval[1].replace(/last/g,settings.cellCount).replace(/first/g,settings.firstCell));
      if (settings.refScrollPosition=='last')
         settings.scrollPosition=(settings.scrollInterval[1]-settings.scrollInterval[0])/settings.intervalLength;
					
      settings.minIntervalPos = settings.scrollInterval[0];
      settings.maxIntervalPos = (settings.scrollInterval[1]-settings.scrollInterval[0])/settings.intervalLength;
};

(function($) {
    $.fn.extend({
        jqtable: function(options) {
        var table=this;
        var settings = $.extend({
                        scrollInterval:  [0,'last'],/*last-N, first+1*/
                        intervalLength:  1,
                        scrollPosition:  1, /*last,M*/
                        nextControl:     "#next_element",
                        prevControl:     "#prev_element",
                        lastControl:     "#last_element",
                        firstControl:    "#first_element",
                        dataContainer:   "#informe",
						      refScrollInterval: [0,0], //intern
						      refScrollPosition: 0, //intern
                        level_1Info: {
                                    expandButtonSelector :    '.expand_bt,.collapse_bt',
                                    class:                    'level_1_row',
                                    dataUrl:                  "http://localhost:8080/tabla_jq/sub_row.php",
                                    responseType:             'HTML',
                                    idAttr:                   'id',
                                    idArgumentName:           'value',
                        ajaxRow:         true,
                           events: {
                               error:     function(sender){alert("ERROR")},
                               loading:   function(sender){sender.removeClass('expand_bt').addClass('collapse_bt').html("@")},
                                expand:    function(sender){sender.removeClass('expand_bt').addClass('collapse_bt').html("-")},
                                collapse:  function(sender){sender.removeClass('collapse_bt').addClass('expand_bt').html("+")},
                           }
                        },
            scrollCallbacks: {
            	isLast:     function(){$("#next_element,#last_element").addClass("disable_class")},
               isNotLast:  function(){$("#next_element,#last_element").removeClass("disable_class")},
            	isFirst:    function(){$("#first_element,#prev_element").addClass("disable_class")},
             	isNotFirst: function(){$("#first_element,#prev_element").removeClass("disable_class")},
            },	
            dataInfo: {
                updateControl:    "#update_element",
                dataUrl:          "http://localhost:8080/tabla_jq/data.php",
            	   params:           "",
            	   responseType:     "HTML",/*HTML,XML,JSON*/
             	events: {
                	   loading:     function(){},
                	   succes:      function(){},
                	   error:       function(){},
             	  },   	   
            },
            }, options);

			console.log(table);
			settings.cellCount=table.find("tr:first td").length;
			settings.refScrollInterval[0]= settings.scrollInterval[0];
			settings.refScrollInterval[1]= settings.scrollInterval[1];
			settings.refScrollPosition= settings.scrollPosition;

         setScrollConfig(settings,table,'normal');
			updateTableCell(table,settings); /*UPDATE CELL VISIBILITY ACCORING VISIBLE INDEX*/
			executeScrollCallBacks(settings);/*UPDATE CONTROLS ACORDING POSITION*/		

         configScrollControls(settings,table)/*SET SCROLL CONTROLS*/
         $(settings.dataContainer).find('tr.'+settings.level_1Info.class).hide();//[NOTE] Hide all subrow ; WATING SECOND LEVEL

         /**EXPAND CONTROLS LEVEL 1**/
         $(table).delegate(settings.level_1Info.expandButtonSelector,'click',function(){
                                          var senderElement = $(this);
                                          var expandedRow = $(this).parent();
                                             while(!expandedRow.is("tr")){
                                                   expandedRow = expandedRow.parent();
                                             }

                                          var isLoading = false;
                                          var isCollapsing = expandedRow.next().is('.'+settings.level_1Info.class+':visible');
                                          var isExpanding = !isCollapsing;

                                          if ((settings.level_1Info.ajaxRow==true) && (!expandedRow.next().hasClass(settings.level_1Info.class))){ //If is AjaxRow and there is sibbling with level_1 class
                                             var dataToSend = settings.level_1Info.idArgumentName+"="+expandedRow.attr(settings.level_1Info.idAttr);
                                             $.ajax({
                                             	type:         'POST',
                                             	url:          settings.level_1Info.dataUrl,
                                                data:         dataToSend, //[NOTE] Aditionas Arguments ??
                                                beforeSend: function(){
                                                            settings.level_1Info.events.loading(senderElement);
                                                            isLoading = true;
                                                },
                                                error:      function(){
                                                            settings.level_1Info.events.error(senderElement);
                                                },
                                                success: function(response) {
                                                         settings.level_1Info.events.expand(senderElement);
                                                         switch (settings.level_1Info.responseType.toUpperCase()){
                                                         	case 'HTML':
                                                               var respObj = $(response)
                                                               respObj.each(function(){formatRow($(this),settings);}) //format all the rows   
                                                               expandedRow.after(respObj);
                                                         	break;
                                                            case 'JSON':
                                                               //JSON IMP
                                                         	break;
                                                         }
                                                },

                                             });
                                          }

                                          var initCollapseInterval=  expandedRow.index();
                                          var endCollapseInterval=  $(settings.dataContainer).find('tr:gt('+(initCollapseInterval+1)+'):not(.'+settings.level_1Info.class+')').first().index(); //[NOTE] FOR LEVEL2!!!

                                          if ((isCollapsing) && (!isLoading))//Execute collpase and expand callbacks
                                             settings.level_1Info.events.collapse(senderElement);
                                          if ((isExpanding) && (!isLoading))
                                             settings.level_1Info.events.expand(senderElement);

                                          if (endCollapseInterval != -1)  //IS NOT LAST  SHOW-HIDE ROWS
                                             $(settings.dataContainer).find('tr:lt('+(endCollapseInterval+1)+'):gt('+(initCollapseInterval+1)+')').toggle();
                                          else
                                             $(settings.dataContainer).find('tr:gt('+(initCollapseInterval+1)+')').toggle();
         });

         /***DATA CONTROLS***/
			$(settings.dataInfo.updateControl).click(function(){
                                       $.ajax({
                                             type:       "POST",
                                             url:        settings.dataInfo.dataUrl,
                                             data:       settings.dataInfo.params,
                                             beforeSend: settings.dataInfo.events.loading,
                                             error:      settings.dataInfo.events.error,
                                             success: function(response) {
                                                switch (settings.dataInfo.responseType.toUpperCase()){
                                                	case 'HTML':
                                                      $(settings.dataContainer).html(response);
                                                	break;
                                                   case 'JSON':
                                                      //JSON IMP
                                                	break;
                                                }
                                             setScrollConfig(settings,table,'normal');
                                             updateTableCell(table,settings);
                                             executeScrollCallBacks(settings,table);
                                             settings.dataInfo.events.succes(); //Execute CallBack
                                             },
                                          });
			                              });

		}
    });
})(jQuery);