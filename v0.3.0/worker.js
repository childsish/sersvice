importScripts('pipeline.js');

const pipeline = cwrap('run_pipeline', null, ['string', 'string', 'number', 'number', 'number', 'number'])
const input_prefix = '/input'
const sequence_prefix = '/sequence'
const models_prefix = '/models'
const variants_prefix = '/variants'
FS.mkdir(input_prefix)
FS.mkdir(sequence_prefix)
FS.mkdir(models_prefix)
FS.mkdir(variants_prefix)

let input_file
let sequence_file
let sequence_index_file
let models_file
let models_index_file
let variants_file
let variants_index_file

onmessage = function(e) {
    console.log(e.data.message)
    if (e.data.message === 'run') {
        run_pipeline()
    }
    else if (e.data.message === 'set_input') {
        input_file = e.data.files[0]
        mount_files(e.data.files, input_prefix)
        console.log("input: " + input_file.name)
    }
    else if (e.data.message === 'set_fasta') {
        sequence_file = e.data.files[0]
        sequence_index_file = e.data.files[1]
        mount_files(e.data.files, sequence_prefix)
        console.log("sequence: " + sequence_file.name + "\nsequence index: " + sequence_index_file.name)
    }
    else if (e.data.message === 'set_models') {
        models_file = e.data.files[0]
        models_index_file = e.data.files[1]
        mount_files(e.data.files, models_prefix)
        console.log("models: " + sequence_file.name + "\nmodels index: " + sequence_index_file.name)
    }
    else if (e.data.message === 'set_variants') {
        variants_file = e.data.files[0]
        variants_index_file = e.data.files[1]
        mount_files(e.data.files, variants_prefix)
        console.log("variants: " + sequence_file.name + "\nvariants index: " + sequence_index_file.name)
    }
    else {
        console.log('Unknown message: "' + e.data.message + '".')
    }

    if (input_file !== undefined && sequence_file !== undefined && sequence_index_file !== undefined && models_file !== undefined && models_index_file !== undefined && variants_file !== undefined && variants_index_file !== undefined) {
        postMessage({'message': 'status', 'content': 'ready'})
    }
};

function mount_files(files, prefix) {
    FS.mount(WORKERFS, {
        files: files
    }, prefix)
}

function run_pipeline() {
    let fd_gtf = hts_open(models_file)
    let fd_gtfi = hts_open(models_index_file)
    let variants_fd = hts_open(variants_file)
    let variants_index_fd = hts_open(variants_index_file)
    pipeline(input_prefix + '/' + input_file.name, sequence_prefix + '/' + sequence_file.name, fd_gtf, fd_gtfi, variants_fd, variants_index_fd)
    hts_close(fd_gtf)
    hts_close(fd_gtfi)
    hts_close(variants_fd)
    hts_close(variants_index_fd)
}
