(function( $ ){
/********************/
/**COMMON FUNCTIONS**/
/********************/
  var _is_string=function(input){
    return typeof(input)=='string';
  };


/*******************/
/**CONFIG V SCROLL**/
/*******************/
var vScrollModule = {
    windowHeight:'',
    realHeight:'',
    scrollHeight:'',
    refPosition:'',
    diff:'',
    scrollClick :false,
    curScrollOffset :$(".scroller").offset(),
    curContainerOffset :$(".tableVScroll").offset(),
    clickOffY:'',
}

var initVScroll = function(windowH,realH){
    vScrollModule.windowHeight = parseInt(windowH);
    vScrollModule.realHeight = parseInt(realH);
    vScrollModule.scrollHeight =Math.round(((vScrollModule.windowHeight*vScrollModule.windowHeight)/vScrollModule.realHeight));

    defSettings._tableObj.css({
      '-moz-user-select':'none',
      '-webkit-user-select':'none',
      'user-select':'none',
      '-ms-user-select':'none'
    }); 

    $(".tableVScroll").height(vScrollModule.windowHeight);
    $(".scroller").height(vScrollModule.scrollHeight);
    vScrollModule.curScrollOffset=$(".scroller").offset();
    vScrollModule.curContainerOffset=$(".tableVScroll").offset();
}

var resetVScroll = function(realH){
    vScrollModule.realHeight = parseInt(realH);
    vScrollModule.scrollHeight =Math.round(((vScrollModule.windowHeight*vScrollModule.windowHeight)/vScrollModule.realHeight));
    $(".scroller").height(vScrollModule.scrollHeight);


    //Fix Tbody Offset
    var tbodyTopOffset = parseInt(defSettings._tableObj.find("tbody").css("top").split("p")[0])*-1;
    var virtualTbodyHeight = defSettings._tableObj.find("tbody").outerHeight()-tbodyTopOffset;
    var bottomBlackSpace = vScrollModule.windowHeight - virtualTbodyHeight;
    if (bottomBlackSpace>0){
      defSettings._tableObj.find("tbody").css({"top":((tbodyTopOffset*-1)+bottomBlackSpace)+"px"});

      var rollerBottomOffset = ($(".scroller").offset().top + $(".scroller").outerHeight())-($(".tableVScroll").offset().top + $(".tableVScroll").outerHeight());
      $(".scroller").offset({top:$(".scroller").offset().top-rollerBottomOffset});
    }
}

var set_VEvents = function(){
  $(".scroller").mousedown(function(e){
    vScrollModule.scrollClick = true;
    vScrollModule.ClickOffY=e.pageY-vScrollModule.curScrollOffset.top; 
  });

  $(document).mouseup(function(){
    if (vScrollModule.scrollClick){
        vScrollModule.scrollClick=false;
        vScrollModule.curScrollOffset = $(".scroller").offset();
        vScrollModule.curContainerOffset = $(".tableVScroll").offset();
    }
  });

  $(document).mousemove(function(e){
      if (vScrollModule.scrollClick){
          vScrollModule.curScrollOffset = $(".scroller").offset();
          vScrollModule.curContainerOffset = $(".tableVScroll").offset();         
          var yOffset = e.pageY-vScrollModule.ClickOffY;

          if (yOffset<vScrollModule.curContainerOffset.top)
              yOffset=vScrollModule.curContainerOffset.top+1;
              
          if ((yOffset+vScrollModule.scrollHeight) > (vScrollModule.curContainerOffset.top+vScrollModule.windowHeight))
              yOffset=(vScrollModule.curContainerOffset.top+vScrollModule.windowHeight)-vScrollModule.scrollHeight;
                 
          $(".scroller").offset({top:yOffset, left:vScrollModule.curScrollOffset.left});
          vScrollModule.diff = yOffset - vScrollModule.curContainerOffset.top;
          var TotalVOffset = Math.round((vScrollModule.diff*vScrollModule.realHeight)/vScrollModule.windowHeight);
          defSettings._tableObj.find("tbody").css({"top":(TotalVOffset*-1)+"px"})
      }
  });
}

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
    if (defSettings.secondLevel){
      _set_ExpandEvent();
    }    
    if (defSettings.height){
      _set_v_scrollHtml();//      
      _set_v_scrollStyle();//      
      set_v_scrollEvents();
    }             
  }
  var _set_ExpandEvent = function(){
      $("th div."+defSettings.secondLevel.commonClass).click(function(){
        var firstIntIndex = $("tbody tr").index($(this).parent().parent());
        var lastIntIndex = $("tbody tr").index($("tbody tr:gt("+firstIntIndex+")").not("."+defSettings.secondLevel.rowClass).first());

        if ($(this).hasClass(defSettings.secondLevel.expandClass)) {
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
      
        if (defSettings.height){
            var tbodyHeight=defSettings._tableObj.find("tbody").outerHeight();
            resetVScroll(tbodyHeight);
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
    defSettings._tableObj.wrap("<div id='"+defSettings.container+"' style='position:relative; width:"+tableWidth+"px;'></div>");        
  }

  var _set_v_scrollHtml= function(){
    defSettings._tableObj.after('<div class="tableVScroll"><div class="scroller"></div></div>');
  }

  var _set_v_scrollStyle = function(){
    var controlPanelHeight=parseFloat(defSettings._tableObj.parent().find("."+defSettings.scrollControlBar.barClass).height());
    var THeadHeight=parseFloat(defSettings._tableObj.find("thead").height());
    var ContainerHeight = defSettings.height+controlPanelHeight+THeadHeight;

    defSettings._tableObj.parent().css({"height":ContainerHeight+"px","overflow":"hidden"}); //PRODUCCIONT
    //._tableObj.parent().css({"height":ContainerHeight+"px","border":"3px solid red"}); //DEBUG
    defSettings._tableObj.parent().find(".tableVScroll").css("margin-top",(controlPanelHeight+THeadHeight)+"px");
    defSettings._tableObj.parent().find("."+defSettings.scrollControlBar.barClass).css({"position":"relative","z-index":10});

    defSettings._tableObj.children("thead").css({"display":"block","z-index":10,"position":"relative"});  
    defSettings._tableObj.children("tbody").css({"display":"block",});

    var normalCellOuterWidth = defSettings._tableObj.find("thead th:first").outerWidth();
    $(defSettings.scrollControls.first).css({"margin-left":normalCellOuterWidth+"px"});
    $(defSettings.scrollControls.previus).css({"margin-right": ((normalCellOuterWidth*30)/100)+"px"});

    var tbodyHeight=defSettings._tableObj.find("tbody tr:visible").length*defSettings._tableObj.find("tbody th").outerHeight();
    initVScroll(defSettings.height,tbodyHeight);
  }

  var set_v_scrollEvents = function(){
    set_VEvents();
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