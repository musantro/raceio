Router.route('/', {
	template: 'home'
});

Router.route('/dashboard', {
	path: '/dashboard/',
	template: 'dashboard'
});

Router.configure({
	path: '/layouts/',
	layoutTemplate: 'footer'
});