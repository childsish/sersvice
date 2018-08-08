const md = window.markdownit()

$(function() {
    $.get('instructions.md', function(data) {
        let html = md.render(data)
        console.log(html)
        $('#instructions').html(html)
    }, 'text')
})
