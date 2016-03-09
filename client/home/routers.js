Router.route('/', {
	template: 'home'
});

Router.route('/dashboard', {
	path: '/dashboard/',
	template: 'dashboardDefault'
});

// CUANDO TENGAS UN LAYUP EN CONDICIONES HABLAMOS.
// Router.configure({
// 	path: '/layouts/',
// 	layoutTemplate: 'footer'
// });