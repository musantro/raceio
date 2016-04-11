Template.tests.helpers({
	tests: Tests.find({})
});

Template.dashboard.helpers({
	numTests: Tests.find().count()
})

Template.testSingle.onCreated(function() {
	var self= this;
	self.autorun(function() {
		self.subscribe('tests');
	});
});

Template.testSingle.rendered = function() {
            console.log("_id: ", testObject._id)
            var yData = testObject.sensor[13].values;
            var xData = testObject.sensor[0].values;

            var returnobject = {
                chart: {
                    type: 'area',
                    zoomType: 'x'
                },
                title: {
                    text: 'Time vs RPM',
                },
                xAxis: {
                    title: {
                        text: 'Time'
                    },
                    labels: {
                    	formatter: function () {
                    		return this.value / testObject.meta["Sample Rate"];
                    	}
                    }
                },
                yAxis: {
                    title: {
                        text: 'RPM'
                    },
                },
                tooltip: {
                	crosshairs: [true],
                	formatter: function() {
                		return  Math.round(this.y) + " " + this.series.name
                	}
                },
                series: [{
                    name: 'RPM',
                    data: yData
                }],

            }; //return object

            jQuery('#graph-area').highcharts(returnobject);

}
