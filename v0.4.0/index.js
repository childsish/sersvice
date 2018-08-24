const worker = new Worker('worker.js');

worker.onmessage = function(e) {
    let data = e.data
    if (data.message === 'result') {
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

$('#run').click(function() {
    $('#run').prop('disabled', true)
    $('#content').html('<tr><th>Sample</th><th>Chromosome</th><th>Position</th><th>Gene name</th><th>Amino acid variant</th><th>Variant type</th><th>Homopolymer</th><th>SNP allele frequency</th><th>Quality</th><th>Alternate count</th><th>Reference count</th></tr>')
    worker.postMessage( {
        message: 'run'
    })
})
