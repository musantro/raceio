Router.route('/', {
	name: 'home',
	template: 'home',
	layoutTemplate: 'mainLayout'
});

Router.route('/dashboard', {
	path: '/dashboard/',
	template: 'dashboard',
	layoutTemplate: 'layout'
});

Router.configure({
	path: '/layouts/',
	layoutTemplate: 'layout'
});

Router.configure({
	path: '/layouts/',
	layoutTemplate: 'mainLayout'
})