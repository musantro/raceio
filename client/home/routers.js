Router.route('/', {
	name: 'home',
	template: 'home',
	layout: 'layout'
});

Router.route('/dashboard', {
	path: '/dashboard/',
	template: 'dashboardDefault',
	layout: 'layout'
});

Router.configure({
	path: '/layouts/',
	layoutTemplate: 'layout'
});