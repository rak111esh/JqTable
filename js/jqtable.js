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
      _rowRealSize:'',
      _scrollOffset:'',
      classes:{
        rowEvenClass:'jqRowEven',
        rowOddClass:'jqRowOdd',
      },
      height:'',
      scrollInterval:[0,'last'],
      scrollWindowSize: 3,
      step:1,
      cellCount:'',
      scrollPosition: 1,
      scrollControlPos:'top',
      _tableObj: '',
      secondLevelActive: false,
      scrollControlBar:{
        barClass:'jqScrollBar',
        buttonClass:'jqScrollButton',
        indicatorClass:'jqIndicator',
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
        commonClass:'jqRowButton',
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
    if (defSettings.secondLevel){
      _set_ExpandEvent();
    }
             
  }
  var _set_ExpandEvent = function(){
      $("th div."+defSettings.secondLevel.commonClass).click(function(){
        var firstIntIndex = $("tbody tr").index($(this).parent().parent());
        var lastIntIndex = $("tbody tr").index($("tbody tr:gt("+firstIntIndex+")").not("."+defSettings.secondLevel.rowClass).first());

        if ($(this).hasClass(defSettings.secondLevel.expandClass))
        {
          if (lastIntIndex!=-1)
            $("tbody tr:lt("+lastIntIndex+"):gt("+firstIntIndex+")").show();
          else
            $("tbody tr:gt("+firstIntIndex+")").show();
          $(this).removeClass(defSettings.secondLevel.expandClass).addClass(defSettings.secondLevel.collapseClass);
          $(this).html(defSettings.secondLevel.collapseInnerHtml);
        }
        else if ($(this).hasClass(defSettings.secondLevel.collapseClass)) {
          if (lastIntIndex!=-1)
            $("tbody tr:lt("+lastIntIndex+"):gt("+firstIntIndex+")").hide();
          else
            $("tbody tr:gt("+firstIntIndex+")").hide();
          $(this).removeClass(defSettings.secondLevel.collapseClass).addClass(defSettings.secondLevel.expandClass);
          $(this).html(defSettings.secondLevel.expandedInnerHtml);
        }
      });
  }

  var _config_common_html = function(){
    if (defSettings.secondLevelActive){ //Second Level Common
      defSettings._tableObj.find("tbody tr").not("."+defSettings.secondLevel.rowClass).addClass(defSettings.rowClass);
      defSettings._tableObj.find("tbody tr:not(."+defSettings.secondLevel.rowClass+"):even").addClass(defSettings.classes.rowEvenClass);
      defSettings._tableObj.find("tbody tr:not(."+defSettings.secondLevel.rowClass+"):odd").addClass(defSettings.classes.rowOddClass);
      defSettings._tableObj.find("tbody tr:not(."+defSettings.secondLevel.rowClass+") th").append('<div class="'+defSettings.secondLevel.commonClass+' '+defSettings.secondLevel.expandClass+'">'+defSettings.secondLevel.expandedInnerHtml+'</div>');
    
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
      "<div class='"+defSettings.scrollControlBar.buttonClass+"' style='margin-right:100px' id='jqPrevius'><</div>"+
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

    var normalCellOuterWidth = defSettings._tableObj.find("thead th:first").outerWidth();
    $(defSettings.scrollControls.first).css({"margin-left":normalCellOuterWidth+"px"});
    $(defSettings.scrollControls.previus).css({"margin-right": ((normalCellOuterWidth*30)/100)+"px"});
  }

  var _config_table=function(){
    defSettings.cellCount=defSettings._tableObj.find("tr:first *").length; //Count Cells
    if (_is_string(defSettings.scrollInterval[1]))
        defSettings.scrollInterval[1]=eval(defSettings.scrollInterval[1].replace(/last/g,defSettings.cellCount)+"-1");
    
    if (_is_string(defSettings.scrollPosition))
        defSettings.scrollPosition=eval(defSettings.scrollPosition.replace(/last/g,defSettings.scrollInterval[1]));
  }

  var _set_scroll_visibility=function(){
      defSettings._tableObj.find("tr").each(function(){
        _set_row_cells_visibility($(this));
      });
  }

  var _set_row_cells_visibility=function(row){
      row.children("*:lt("+(defSettings.scrollInterval[1])+"):gt("+(defSettings.scrollInterval[0])+")").hide();
      row.children("*:eq("+defSettings.scrollInterval[0]+")").hide();
      row.children("*:eq("+defSettings.scrollInterval[1]+")").hide();

      var initScrollPos = defSettings.scrollPosition;
      var endScrollPos = defSettings.scrollPosition+defSettings.scrollWindowSize-1;
      row.children("*:lt("+endScrollPos+"):gt("+initScrollPos+")").show();
      row.children("*:eq("+endScrollPos+")").show();
      row.children("*:eq("+initScrollPos+")").show();      
  }

  var _first = function(){
      defSettings.scrollPosition=defSettings.scrollInterval[0];
      _set_scroll_visibility();
      if (typeof defSettings.scrollCallbacks.isFirst=="function")
          defSettings.scrollCallbacks.isFirst();

  }

  var _previus = function(){
      if (defSettings.scrollPosition > defSettings.scrollInterval[0]){
          defSettings.scrollPosition-=defSettings.step; 
          _set_scroll_visibility();
           if (typeof defSettings.scrollCallbacks.isPrevius=="function")
              defSettings.scrollCallbacks.isPrevius();  
      }

      if ((defSettings.scrollPosition == defSettings.scrollInterval[0]) && (typeof defSettings.scrollCallbacks.isFirst=="function"))
          defSettings.scrollCallbacks.isFirst();  
  }  

  var _next = function(){
      if ((defSettings.scrollPosition+defSettings.scrollWindowSize) < (defSettings.scrollInterval[1]+1)){
          defSettings.scrollPosition+=defSettings.step; 
          _set_scroll_visibility();
           if (typeof defSettings.scrollCallbacks.isNext=="function")
              defSettings.scrollCallbacks.isNext();  
      }

      if (((defSettings.scrollPosition+defSettings.scrollWindowSize) == (defSettings.scrollInterval[1]+1)) && (typeof defSettings.scrollCallbacks.isLast=="function"))
          defSettings.scrollCallbacks.isLast();     
  }

  var _last = function(){
      defSettings.scrollPosition=(defSettings.scrollInterval[1]+1)-defSettings.scrollWindowSize; 
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