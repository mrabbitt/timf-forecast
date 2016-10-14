$(document).ready(function() {
    $.getJSON('data/schedule.json', function(data) {
        var sections=[
            {key: 1, label: "Bridge"},
            {key: 2, label: "Tunnel"},
            {key: 3, label: "Silent Disco"},
        ];

        scheduler.locale.labels.unit_tab = "Persons";
        scheduler.locale.labels.section_custom = "Assigned to";
        scheduler.config.first_hour = 11;
        scheduler.config.multi_day = true;
        scheduler.config.details_on_dblclick = true;
        scheduler.config.lightbox.sections=[
            {name:"description", height:130, map_to:"text", type:"textarea" , focus:true},
            {name:"custom", height:23, type:"select", options:sections, map_to:"section_id" },
            {name:"time", height:72, type:"time", map_to:"auto"}
        ];
        scheduler.templates.event_class = function(start, end, ev){
             return 'event-stage-' + ev.section_id;
        };

        //scheduler.createUnitsView("unit","section_id",sections);

        scheduler.init('scheduler_here', new Date('10/15/2016'), "day");

        var events = $.map(data.events, function(event, i) {
            return {
                id: i,
                text: event.performer,
                start_date: event.startTime,
                end_date: event.endTime,
                section_id: event.stageId,
                url: event.url,
            };
        });
        // TODO load weather events.

        scheduler.parse(events, 'json');
    });

});
