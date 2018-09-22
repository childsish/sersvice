const worker = new Worker('worker.js')
let sample_names = []

worker.onmessage = function(e) {
    let data = e.data
    if (data.message === 'header') {
        let tr = '<tr><th>' + data.content[0]
        for (let i = 1; i < data.content.length; ++i) {
            tr += '</th><th>' + data.content[i]
        }
        tr += '</th></tr>'
        $('#content').html(tr)
    }
    else if (data.message === 'result') {
        let tr = '<tr><td>' + data.content[0]
        for (let i = 1; i < data.content.length; ++i) {
            tr += '</td><td>' + data.content[i]
        }
        tr += '</td></tr>'
        $('#content').append(tr)
    }
    else if (data.message == 'status') {
        if (data.content == 'loaded') {
            $('#input_file').prop('disabled', false)
            $('#fasta_file').prop('disabled', false)
            $('#models_file').prop('disabled', false)
            $('#variants_file').prop('disabled', false)
            $('#bounds_file').prop('disabled', false)

            let files = $('#input_file')[0].files
            if (files.length > 0) {
                worker.postMessage({
                    message: 'set_input',
                    files: files
                })
            }
            files = $('#fasta_file')[0].files
            if (files.length > 0) {
                worker.postMessage({
                    message: 'set_fasta',
                    files: files
                })
            }
            files = $('#models_file')[0].files
            if (files.length > 0) {
                worker.postMessage({
                    message: 'set_models',
                    files: files
                })
            }
            files = $('#variants_file')[0].files
            if (files.length > 0) {
                worker.postMessage({
                    message: 'set_variants',
                    files: files
                })
            }
            files = $('#bounds_file')[0].files
            if (files.length > 0) {
                worker.postMessage({
                    message: 'set_bounds',
                    files: files
                })
            }
        }
        if (data.content == 'ready') {
            $('#run').prop('disabled', false)
        }
    }
}

$('#input_file').change(function() {
    worker.postMessage( {
        message: 'set_input',
        files: $('#input_file')[0].files
    })
})

$('#fasta_file').change(function() {
    worker.postMessage( {
        message: 'set_fasta',
        files: $('#fasta_file')[0].files
    })
})

$('#models_file').change(function() {
    worker.postMessage( {
        message: 'set_models',
        files: $('#models_file')[0].files
    })
})

$('#variants_file').change(function() {
    worker.postMessage( {
        message: 'set_variants',
        files: $('#variants_file')[0].files
    })
})

$('#bounds_file').change(function() {
    worker.postMessage( {
        message: 'set_bounds',
        files: $('#bounds_file')[0].files
    })
})

$('#run').click(function() {
    $('#run').prop('disabled', true)
    worker.postMessage( {
        message: 'run'
    })
})
