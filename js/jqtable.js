(function( $ ){

  var defSettings ={
      container: '',
      height:'',
      scrollInterval:[0,'last'],
      intervalLength: 3,
      cellCount:'',
      scrollPosition: 1,
      _max_scroll_position: '',
      _tableObj: '',
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
      }      
  }

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
    $.extend(defSettings,settings);
    defSettings._tableObj = TableObj;
    _config_table(); //Config table varibles
    _set_row_visibilty(); //Set visibility of cells acording defSettings  variables    
    _bind_scroll_controls(); //Bind Scroll Controls to click
    _set_style();//Put the default Style      
    if (defSettings.height)
      _set_vertical_scroll("wrap");//Wrap the table around a container     
  }

  var _is_string=function(input){
    return typeof(input)=='string';
  };

  var _set_style = function(){
    //defSettings._tableObj.css({"display":"block"});
    //defSettings._tableObj.find("thead").css({"position":"relative"});
  }

  var _set_vertical_scroll = function(arg){
    var scrollOffset = 15;    
    if (!defSettings.container)
      defSettings.container = "jqTableContainer";      
    
    if (arg=="wrap"){
    defSettings._tableObj.wrap("<div id='"+defSettings.container+"' style='width:"+(tableWidth+scrollOffset)+"px;'></div>");//Fix the container th for the scrollbar    

    var tableWidth = defSettings._tableObj.width();
    
    $('#jqTableContainer').find("thead").css({
      "width":(tableWidth+scrollOffset)+"px",//Fix the thead th for the scrollbar
      "display":"block",});

    $('#jqTableContainer').find("tbody").css({
      "height":defSettings.height,
      "overflow":"auto",
      "width":(tableWidth+scrollOffset)+"px",//Fix the tbody th for the scrollbar
      "display":"block",});
    }

    if ((arg=="wrap") || (arg=="fixOffset")){
      var normalWidth=$('#jqTableContainer').find("thead th:visible").last().width();//Fix the last th for the scrollbar
      //$('#jqTableContainer').find("thead th").css({"width":"auto"});
      $('#jqTableContainer').find("thead th:visible").last().width(normalWidth+scrollOffset);
    }
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

  var _set_row_visibilty=function(){
      defSettings._tableObj.find("tr").each(function(){
        _set_row_cells_visibility($(this));
      });
      if (defSettings.height)
        _set_vertical_scroll("fixOffset");//Fix the scroll bar offset       
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
      _set_row_visibilty();
      if (typeof defSettings.scrollCallbacks.isFirst=="function")
          defSettings.scrollCallbacks.isFirst();
  }

  var _previus = function(){
      if (defSettings.scrollPosition > 1){
        defSettings.scrollPosition--;
        _set_row_visibilty()
        if (typeof defSettings.scrollCallbacks.isPrevius=="function")
            defSettings.scrollCallbacks.isPrevius();
      }

      if ((defSettings.scrollPosition == 1) && (typeof defSettings.scrollCallbacks.isFirst=="function"))
              defSettings.scrollCallbacks.isFirst();
  }  

  var _next = function(){
      if (defSettings.scrollPosition < defSettings._max_scroll_position){
        defSettings.scrollPosition++;
        _set_row_visibilty();
        if (typeof defSettings.scrollCallbacks.isNext=="function")
            defSettings.scrollCallbacks.isNext();  
      }

      if ((defSettings.scrollPosition == defSettings._max_scroll_position) && (typeof defSettings.scrollCallbacks.isLast=="function"))
          defSettings.scrollCallbacks.isLast();      
  }

  var _last = function(){
      defSettings.scrollPosition=defSettings._max_scroll_position;
      _set_row_visibilty();
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