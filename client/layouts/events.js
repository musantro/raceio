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