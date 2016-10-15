// https://fullcalendar.io/scheduler/license/
$('#calendar').fullCalendar({
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
});

$(document).ready(function() {
    $.getJSON('data/schedule.json', function(data) {
        var events = $.map(data.events, function(event, i) {
            return {
                id: 'event-' + i,
                title: event.performer,
                start: event.startTime,
                end: event.endTime,
                resourceId: event.stageId,
                url: event.url,
            };
        });
        // TODO load weather events.

        $('#calendar').fullCalendar({
            defaultView: 'agendaDay',
            defaultDate: '2016-10-15',
            editable: false,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'agendaDay,agendaTwoDay,'
            },
            views: {
                agendaTwoDay: {
                    type: 'agenda',
                    duration: { days: 2 },

                    // views that are more than a day will NOT do this behavior by default
                    // so, we need to explicitly enable it
                    // groupByResource: true

                    //// uncomment this line to group by day FIRST with resources underneath
                    groupByDateAndResource: true
                }
            },

            events: events,
            resources: [
                { id: 'W', title: 'Weather' },
                { id: '1', title: data.stages['1'] },
                { id: '2', title: data.stages['2'] },
                { id: '3', title: data.stages['3'] },
            ],
            groupByDateAndResource: true,
            timezone: 'local',
            eventClick: function(event) {
                if (event.url) {
                    window.open(event.url);
                    return false;
                }
            },
        });
    });

});
