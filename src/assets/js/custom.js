jQuery(document).ready(function() {
  jQuery("ul.navbar-nav li.nav-item").hover(
    function() {
      jQuery(this).addClass("showmenu");
    },
    function() {
      jQuery(this).removeClass("showmenu");
    }
  );

  jQuery(function() {
    jQuery('.tabs-nav a').click(function() {

      // Check for active
      jQuery('.tabs-nav li').removeClass('active');
      jQuery(this).parent().addClass('active');

      // Display active tab
      let currentTab = $(this).attr('href');
      jQuery('.tabs-content div.tab-table').hide();
      jQuery(currentTab).show();

      return false;
    });
  });

    jQuery('.agent-tabs-nav a').click(function() {
      // Check for active
      jQuery('.agent-tabs-nav li').removeClass('active');
      jQuery(this).parent().addClass('active');

      // Display active tab
      let currentTab = $(this).attr('href');
      jQuery('.agent-tabs-content .agent-tab-table').hide();
      jQuery(currentTab).show();

      return false;
    });

jQuery(function() {
  jQuery( "#date_picker1" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker2" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker3" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker4" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker5" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker6" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker7" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker8" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker9" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker10" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker11" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker12" ).datepicker();
});
jQuery(function() {
  jQuery( "#date_picker13" ).datepicker();
});
/* chart */
var oilCanvas = document.getElementsByClassName("oilChart");

//Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

var oilData = {
    labels: [
        "Tennis",
        "Cricket"
    ],
    datasets: [
        {
            data: [133.3, 86.2,],
            backgroundColor: [
                "#090909",
                "#6ba4db"
            ]
        }]
};

var pieChart = new Chart(oilCanvas, {
  type: 'pie',
  data: oilData
});

var oilCanvas = document.getElementsByClassName("oilChart1");

//Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

var oilData = {
    labels: [
        "Tennis",
        "Cricket"
    ],
    datasets: [
        {
            data: [133.3, 86.2,],
            backgroundColor: [
                "#090909",
                "#6ba4db"
            ]
        }]
};

var pieChart = new Chart(oilCanvas, {
  type: 'pie',
  data: oilData
});

});

jQuery(function() {
  jQuery("#send").on("click", function() {
    jQuery('#loading').show();
    jQuery('#mainBalance').hide();
    setTimeout(function() {
      jQuery('#loading').hide();
      jQuery('#mainBalance').show();
    }, 1500);
  });
});
jQuery("#bet_name").hover(function () {
    jQuery('#bet_name_modal').modal({
        show: true,
        backdrop: false
    })
});

jQuery(document).ready(function() {
  jQuery('.dataTable-table').DataTable({
      pagingType: 'full_numbers',
  });
});



jQuery(document).ready(function() {
if ( $.fn.dataTable.isDataTable( '.dataTable-table' ) ) {
    table = $('.dataTable-table').DataTable();
}
else {
    table = $('.dataTable-table').DataTable( {
        paging: false
} );
};
});

jQuery(document).ready(function() {
  $(".market-tab ul.nav-tabs a").click(function (e) {
  e.preventDefault();  
    $(this).tab('show');
});

});

/*jQuery('.tabs-nav a').one('click', function(){
    jQuery('.dataTable-table').DataTable({
      pagingType: 'full_numbers',
  });
});*/

/*jQuery('.tabs-nav a').one('click', function(){
  jQuery( '.dataTable-table' ).dataTable( {
   "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
     // Bold the grade for all 'A' grade browsers
     if ( aData[4] == "A" )
     {
       $('td:eq(4)', nRow).html( '<b>A</b>' );
     }
   }
 } );
 } );*/