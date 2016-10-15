$(document).ready(function() {
    if ($(window).width() < 420) {
        $('#calendar').addClass('narrow');
    }

    $('#calendar').fullCalendar({
        // https://fullcalendar.io/scheduler/license/
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',

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

        eventSources: [
            {
                events: function(start, end, timezone, callback) {
                    $.getJSON('data/schedule.json', function(schedule) {
                        var events = $.map(schedule.events, function(event, i) {
                            return {
                                id: 'event-' + i,
                                title: event.performer,
                                start: event.startTime,
                                end: event.endTime,
                                resourceId: event.stageId,
                                url: event.url,
                                color: '#7baf91',
                            };
                        });
                        callback(events);
                    });
                }
            },
            {
                events: function(start, end, timezone, callback) {
                    $.getJSON('data/forecast.json', function(forecast) {
                        var loadTime = moment(forecast.currently.time, 'X');
                        $('.forecast-last-loaded').text(loadTime.format('MM/DD/YYYY @ h:mm:ss a'));

                        var events = $.map(forecast.hourly.data, function(data, i) {
                            var text = data.temperature.toFixed(0) + '°F ' +
                                       data.summary + '\n' +
                                       ' 💧' + (data.precipProbability * 100).toFixed(0) + '%' +
                                       ' 🌬' + data.windSpeed.toFixed(0) + 'mph';
                            event = {
                                id: 'forecast-' + i,
                                title: text,
                                start: moment(data.time, 'X').local(),
                                end: moment(data.time + 3600, 'X').local(),
                                resourceId: 'W',
                                data: data,
                                className: 'weather-event',
                                color: 'grey',
                            };
                            return event;
                        });
                        callback(events);
                    });
                },
                timezone: 'local',
            }
        ],
        resources: [
            { id: 'W', title: 'Weather' },
            { id: '1', title: 'Bridge Stage' },
            { id: '2', title: 'Tunnel Stage' },
            { id: '3', title: 'Silent Disco' },
        ],
        groupByDateAndResource: true,
        timezone: 'local',
        eventClick: function(event) {
            if (event.url) {
                window.open(event.url);
                return false;
            }
        },
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            dow: [6, 0], // Monday - Thursday
            start: '12:00',
            end: '23:00',
        },
        eventRender: function (event, element) {
            if (event.resourceId == 'W') {
                $(element).find('.fc-time').remove();
                $(element).find('.fc-bg').css('opacity', event.data.precipProbability);
            }
        },
        height: 'auto',
        viewRender: function(view, element) {
            $('#calendar > div.fc-view-container > div > table').stickyTableHeaders();
        },
        windowResize: function(view) {
            if ($(window).width() < 420) {
                $('#calendar').addClass('narrow');
            }
        }
    });

});
