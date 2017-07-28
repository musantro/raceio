Template.header.onRendered(function() {
    $('.dropdown-button').dropdown({
    	belowOrigin: true,
    	hover: true,
    });
});

Template.header.onRendered(function() {
	$('.button-collapse').sideNav({
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );
})

// Function createData converts time Series object to array for Highcharts
createData = function(obj, arr){
  for (var i in obj) {
    if (typeof obj[i] === 'object'){
      createData(obj[i],arr)
    } else {
      arr.push(obj[i])
    }
  }
}
