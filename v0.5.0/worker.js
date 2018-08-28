importScripts('pipeline.js');

const pipeline = cwrap('run_pipeline', null, ['string', 'string', 'string', 'string', 'string'])
const input_prefix = '/input'
const sequence_prefix = '/sequence'
const model_prefix = '/models'
const variant_prefix = '/variants'
const bounds_prefix = '/bounds'
FS.mkdir(input_prefix)
FS.mkdir(sequence_prefix)
FS.mkdir(model_prefix)
FS.mkdir(variant_prefix)
FS.mkdir(bounds_prefix)

let input_file
let sequence_file
let model_file
let model_index_file
let variant_file
let variant_index_file
let bounds_file
let bounds_index_file

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
        mount_files(e.data.files, sequence_prefix)
        console.log("sequence: " + sequence_file.name + "\nsequence index: " + e.data.files[1].name)
        if (e.data.files.length > 2)
            console.log("sequence_binary_index: " + e.data.files[2].name)
    }
    else if (e.data.message === 'set_models') {
        model_file = e.data.files[0]
        model_index_file = e.data.files[1]
        mount_files(e.data.files, model_prefix)
        console.log("models: " + model_file.name + "\nmodels index: " + model_index_file.name)
    }
    else if (e.data.message === 'set_variants') {
        variant_file = e.data.files[0]
        variant_index_file = e.data.files[1]
        mount_files(e.data.files, variant_prefix)
        console.log("variants: " + variant_file.name + "\nvariants index: " + variant_index_file.name)
    }
    else if (e.data.message === 'set_bounds') {
        bounds_file = e.data.files[0]
        bounds_index_file = e.data.files[1]
        mount_files(e.data.files, bounds_prefix)
        console.log("bounds: " + bounds_file.name + "\nbounds index: " + bounds_index_file.name)
    }
    else {
        console.log('Unknown message: "' + e.data.message + '".')
    }

    if (input_file !== undefined && sequence_file !== undefined && model_file !== undefined && model_index_file !== undefined && variant_file !== undefined && variant_index_file !== undefined) {
        postMessage({'message': 'status', 'content': 'ready'})
    }
};

function mount_files(files, prefix) {
    FS.mount(WORKERFS, {
        files: files
    }, prefix)
}

function run_pipeline() {
    pipeline(
        input_prefix + '/' + input_file.name,
        sequence_prefix + '/' + sequence_file.name,
        model_prefix + '/' + model_file.name,
        variant_prefix + '/' + variant_file.name,
        bounds_prefix + '/' + bounds_file.name
    )
}
