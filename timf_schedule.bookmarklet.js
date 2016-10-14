(function (window) {
    var events = [];
    var timeRegex = /(\d{1,2}:\d{2})\s+-\s+(\d{1,2}:\d{2})/;
    $('.ds-event-container').each(function(i, e) {
        var performer = $(this).find('.ds-event-title').text().trim();
        var url = window.document.location.origin + $(this).find('.ds-event-title a').attr('href');

        // Construct start and end time.
        var dayText = $('.ds-arrange > div > span').text().trim();
        var timeText = $(this).find('.ds-time-range').text().trim();
        var match = timeRegex.exec(timeText);
        var startTime = Date.parse(dayText + ' 2016 ' + match[1] + ' PM');
        var endTime = Date.parse(dayText + ' 2016 ' + match[2] + ' PM');

        // Parse Stage name.
        var stageDiv = $(this).parents('.ds-stage');
        var stageName = '????';
        if ($(stageDiv).hasClass('ds-stage1')) {
            stageId = "1";
        } else if ($(stageDiv).hasClass('ds-stage2')) {
            stageId = "2";
        } else if ($(stageDiv).hasClass('ds-stage3')) {
            stageId = "3";
        }

        events.push({
            startTime: startTime,
            endTime: endTime,
            performer: performer,
            url: url,
            stageId: stageId,
        });
    });

    // FIXME Sort by time?

    var eventsJson = JSON.stringify(events);
    console.log(eventsJson);
    alert('Events written to console.');
})(window);

