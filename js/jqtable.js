(function( $ ){
/********************/
/**COMMON FUNCTIONS**/
/********************/
  var _is_string=function(input){
    return typeof(input)=='string';
  };


/****************/
/**CONFIG JSON**/
/***************/
  var defSettings ={
      container: 'jqTableContainer',
      rowClass: 'jqRow',
      classes:{
        rowEvenClass:'jqRowEven',
        rowOddClass:'jqRowOdd',
      },
      height:'',
      scrollInterval:[0,'last'],
      intervalLength: 3,
      cellCount:'',
      scrollPosition: 1,
      scrollControlPos:'top',
      _max_scroll_position: '',
      _tableObj: '',
      secondLevelActive: false,
      scrollControlBar:{
        barClass:'jqScrollBar',
        buttonClass:'jqScrollButton',
        indicatorClass:'jqIndicator',
        indicator:true,
      },
      scrollControls:{
        first:'',
        previus:'',
        next:'',
        last:''
      },
      scrollCallbacks:{
        isFirst:'',
        isPrevius:'',
        isNext:'',
        isLast:'',
        isMoving:'',
      },
      secondLevel:{
        rowClass:'',
        expandedInnerHtml:'+',
        collapseInnerHtml:'-',
        expandClass:'jqExpandButton',
        collapseClass:'jqCollapseButton',
      }      
  }

/********************/
/**API DEFINITIONS**/
/*******************/
  var methods = {
    init : function(settings) { 
      _init(settings,this);
    },
    first : function( ) { 
      _first();
    },
    previus : function( ) { 
      _previus();
    },        
    next : function( ) {
      _next();
    },
    last : function( ) {
      _last();
    },    
    isFirst : function(callback) { 
      defSettings.scrollCallbacks.isFirst=callback;
    },
    isPrevius : function(callback) { 
      defSettings.scrollCallbacks.isPrevius=callback;
    },
    isNext : function(callback) { 
      defSettings.scrollCallbacks.isNext=callback;
    },
    isLast : function(callback) { 
      defSettings.scrollCallbacks.isLast=callback;
    }
  };

  $.fn.jqtable = function( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.jqtable' );
    }    
  };

  function _init(settings,TableObj){
    $.extend(true,defSettings,settings);
    defSettings._tableObj = TableObj;
    _config_common_html();//Config common html and second level visibility
    _config_table(); //Config table varibles
    _set_scroll_visibility(); //Set visibility of cells acording defSettings  variables
    _wrap_table();//Wrap the table around a container
    if  ((!defSettings.scrollControls.first) || 
        (!defSettings.scrollControls.previus) || 
        (!defSettings.scrollControls.next) || 
        (!defSettings.scrollControls.last)){
          _create_h_scroll_controlls();
    }
    _bind_scroll_controls(); //Bind Scroll Controls to click   
    if (defSettings.height)
      _set_v_scroll();//Wrap the table around a container

             
  }

  var _config_common_html = function(){
    if (defSettings.secondLevelActive){ //Second Level Common
      defSettings._tableObj.find("tbody tr").not("."+defSettings.secondLevel.rowClass).addClass(defSettings.rowClass);
      defSettings._tableObj.find("tbody tr:not(."+defSettings.secondLevel.rowClass+"):even").addClass(defSettings.classes.rowEvenClass);
      defSettings._tableObj.find("tbody tr:not(."+defSettings.secondLevel.rowClass+"):odd").addClass(defSettings.classes.rowOddClass);
      defSettings._tableObj.find("tbody tr:not(."+defSettings.secondLevel.rowClass+") th").append("<div class="+defSettings.secondLevel.expandClass+">"+defSettings.secondLevel.expandedInnerHtml+"</div>");
    
      defSettings._tableObj.find("tbody tr."+defSettings.secondLevel.rowClass).hide();
    }
    else{
      defSettings._tableObj.find("tbody tr").addClass(defSettings.rowClass);
      defSettings._tableObj.find("tbody tr:even").addClass(defSettings.classes.rowEvenClass);
      defSettings._tableObj.find("tbody tr:odd").addClass(defSettings.classes.rowOddClass);
    }  
}

  var _create_h_scroll_controlls = function(){
    var htmlControlDef = "<div class='"+defSettings.scrollControlBar.barClass+"'>"+
      "<div class='"+defSettings.scrollControlBar.buttonClass+"' id='jqFirst'><<</div>"+
      "<div class='"+defSettings.scrollControlBar.buttonClass+"' id='jqPrevius'><</div>"+
      "<div class='"+defSettings.scrollControlBar.buttonClass+"' id='jqNext'>></div>"+
      "<div class='"+defSettings.scrollControlBar.buttonClass+"' id='jqLast'>>></div>"+   
      "</div>";
    if (defSettings.scrollControlPos=='bottom')
      defSettings._tableObj.parent().append(htmlControlDef);
    if (defSettings.scrollControlPos=='top')
      defSettings._tableObj.parent().prepend(htmlControlDef);
        
    defSettings.scrollControls.first    = "#jqFirst";
    defSettings.scrollControls.previus  = "#jqPrevius";
    defSettings.scrollControls.next     = "#jqNext";
    defSettings.scrollControls.last     = "#jqLast";

    if (defSettings.scrollControlBar.indicator){
      $(defSettings.scrollControls.previus).after("<div class='"+defSettings.scrollControlBar.indicatorClass+"'>Page <span class='currentPos'>"+defSettings.scrollPosition+"</span> of  <span class='maxPos'>"+defSettings._max_scroll_position+"</span></div>");
    }
  }

  var _adjust_indicator = function(){
    $("."+defSettings.scrollControlBar.indicatorClass +" .currentPos").html(defSettings.scrollPosition);
  }

  var _wrap_table = function(){
    var tableWidth = defSettings._tableObj.width();
    defSettings._tableObj.wrap("<div id='"+defSettings.container+"' style='width:"+tableWidth+"px;'></div>");              
  }

  var _set_v_scroll = function(){
    var scrollBarSize = 15;    
    var currentWidth = defSettings._tableObj.width();
    var fixedRowWidth = currentWidth + scrollBarSize;

    defSettings._tableObj.parent().css({
      "width": fixedRowWidth+"px",//Fix the container width for the scrollbar
    });
    
    defSettings._tableObj.children("thead").css({
      "width":fixedRowWidth+"px",//Fix the thead width for the scrollbar
      "display":"block",
    });  

    defSettings._tableObj.children("tbody").css({
      "height":defSettings.height,
      "overflow":"auto",
      "width":fixedRowWidth+"px",//Fix the tbody width for the scrollbar
      "display":"block",
    });

    var normalCellWidth=defSettings._tableObj.find("thead th:visible").eq(1).width();
    var fixedCellWidth=normalCellWidth+scrollBarSize+1;
    var iterator = 1;

    defSettings._tableObj.find("thead th:not(:first)").each(function(){ //Fix the th width for the scrollbar
      if (iterator==defSettings.intervalLength)
          $(this).width(fixedCellWidth);
      iterator++;
      if (iterator>defSettings.intervalLength)
        iterator=1;    
    })

    var normalCellOuterWidth = defSettings._tableObj.find("thead th:first").outerWidth();
    $(defSettings.scrollControls.first).css({"margin-left":normalCellOuterWidth+"px"});
    //$(defSettings.scrollControls.previus).css({"margin-right": ((normalCellOuterWidth*0)/100)+"px"});
  }

  var _config_table=function(){
    defSettings.cellCount=defSettings._tableObj.find("tr:first *").length; //Count Cells
    if (_is_string(defSettings.scrollInterval[1]))
        defSettings.scrollInterval[1]=eval(defSettings.scrollInterval[1].replace(/last/g,defSettings.cellCount)+"-1");
    
    defSettings._max_scroll_position=((defSettings.scrollInterval[1]-defSettings.scrollInterval[0])+1)/defSettings.intervalLength;
    if (_is_string(defSettings.scrollPosition)){
        defSettings.scrollPosition=eval(defSettings.scrollPosition.replace(/last/g,defSettings._max_scroll_position));
    }  
  }

  var _set_scroll_visibility=function(){
      defSettings._tableObj.find("tr").each(function(){
        _set_row_cells_visibility($(this));
      });
      if (defSettings.scrollControlBar.indicator)
        _adjust_indicator();        
  }

  var _set_row_cells_visibility=function(row){
      /*row.children("td:lt("+(defSettings.scrollInterval[1])+"):gt("+(defSettings.scrollInterval[0])+")").css({border:'1px solid red'});
      row.children("td:eq("+defSettings.scrollInterval[0]+")").css({border:'1px solid red'});
      row.children("td:eq("+defSettings.scrollInterval[1]+")").css({border:'1px solid red'});

      var init_interval=(defSettings.scrollPosition*defSettings.intervalLength)+defSettings.scrollInterval[0]-(defSettings.intervalLength);
      var end_interval=(defSettings.scrollPosition*defSettings.intervalLength)+defSettings.scrollInterval[0]-1;
      row.children("td:lt("+end_interval+"):gt("+init_interval+")").css({border:'1px solid blue'});
      row.children("td:eq("+end_interval+")").css({border:'1px solid blue'});
      row.children("td:eq("+init_interval+")").css({border:'1px solid blue'});*/
      row.children("*:lt("+(defSettings.scrollInterval[1])+"):gt("+(defSettings.scrollInterval[0])+")").hide();
      row.children("*:eq("+defSettings.scrollInterval[0]+")").hide();
      row.children("*:eq("+defSettings.scrollInterval[1]+")").hide();

      var init_interval=(defSettings.scrollPosition*defSettings.intervalLength)+defSettings.scrollInterval[0]-(defSettings.intervalLength);
      var end_interval=(defSettings.scrollPosition*defSettings.intervalLength)+defSettings.scrollInterval[0]-1;
      row.children("*:lt("+end_interval+"):gt("+init_interval+")").show();
      row.children("*:eq("+end_interval+")").show();
      row.children("*:eq("+init_interval+")").show();        
  }

  var _first = function(){
      defSettings.scrollPosition=1;
      _set_scroll_visibility();
      if (typeof defSettings.scrollCallbacks.isFirst=="function")
          defSettings.scrollCallbacks.isFirst();
  }

  var _previus = function(){
      if (defSettings.scrollPosition > 1){
        defSettings.scrollPosition--;
        _set_scroll_visibility()
        if (typeof defSettings.scrollCallbacks.isPrevius=="function")
            defSettings.scrollCallbacks.isPrevius();
      }

      if ((defSettings.scrollPosition == 1) && (typeof defSettings.scrollCallbacks.isFirst=="function"))
              defSettings.scrollCallbacks.isFirst();
  }  

  var _next = function(){
      if (defSettings.scrollPosition < defSettings._max_scroll_position){
        defSettings.scrollPosition++;
        _set_scroll_visibility();
        if (typeof defSettings.scrollCallbacks.isNext=="function")
            defSettings.scrollCallbacks.isNext();  
      }

      if ((defSettings.scrollPosition == defSettings._max_scroll_position) && (typeof defSettings.scrollCallbacks.isLast=="function"))
          defSettings.scrollCallbacks.isLast();      
  }

  var _last = function(){
      defSettings.scrollPosition=defSettings._max_scroll_position;
      _set_scroll_visibility();
      if (typeof defSettings.scrollCallbacks.isLast=="function")
          defSettings.scrollCallbacks.isLast(); 
  }  

  var _bind_scroll_controls = function(){
      $(defSettings.scrollControls.first).click(function(){
        _first();
      })
      $(defSettings.scrollControls.previus).click(function(){
        _previus();
      })             
      $(defSettings.scrollControls.next).click(function(){
        _next();
      })
      $(defSettings.scrollControls.last).click(function(){
        _last();
      })           
  }

})( jQuery );