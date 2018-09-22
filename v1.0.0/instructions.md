# Instructions

This pipeline provides variant annotation for variants detected using panel sequencing. It runs purely in your browser and no data is sent to any external server.

To run the pipeline you will initially need to prepare all the necessary data. After the data is prepared, the pipeline can be run as often as you want. There are four types of data.

1. **The reference sequence.** This is the sequence the variants were mapped against. Please choose the correct sequence for your variants. If the variants were mapped against GRCh37, then you must download and index GRCh37. Otherwise, the variants will be annotated incorrectly. To prepare this data, download the matching *.fasta* file. Currently the pipeline can not read compressed fasta files, so you'll have to uncompress it first. Additionally, you will need to index the sequence using `tabix`.
2. **The gene models.** These are the definitions of the gene boundaries on the reference sequence (ie. which chromosome the gene is on and where each gene starts and stops). Again, this information must match the reference sequence.
3. **The SNPs.** These are used to identify which variants are probably SNPs. This database must match the reference sequence.
5. **The panel design.** These are used to find how close the variant is to the edge of an amplicon. Variants close to the edge are considered unreliable.

Additionally, you'll need the variants you wish to annotate. These are typically found in a *.vcf* file.

# Example scripts

These scripts can be run in a Linux system to provide and prepare the necessary data to run the pipeline.

## Preparing the reference sequence

This script will download GRCh37 (hg19) then uncompress and it.

```$bash
wget ftp://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_28/GRCh37_mapping/GRCh37.primary_assembly.genome.fa.gz
gunzip GRCh37.primary_assembly.genome.fa.gz
samtools faidx GRCh37.primary_assembly.genome.fa
```

The files needed by the pipeline are `GRCh37.primary_assembly.genome.fa` and `GRCh37.primary_assembly.genome.fa.fai`.

## Preparing the gene models

This script will download the gene models for GRCh37 the recompress them in block gzip format and index the compressed file. 

```$bash
wget ftp://ftp.ncbi.nlm.nih.gov/genomes/refseq/vertebrate_mammalian/Homo_sapiens/all_assembly_versions/GCF_000001405.25_GRCh37.p13/GCF_000001405.25_GRCh37.p13_genomic.gff.gz
mv GCF_000001405.25_GRCh37.p13_genomic.gff.gz GRCh37.p13_genomic.gff.gz
gunzip GRCh37.p13_genomic.gff.gz
bgzip GRCh37.p13_genomic.gff
tabix GRCh37.p13_genomic.gff
```

The files needed by the pipeline are `GRCh37.p13_genomic.gff.gz` and `GRCh37.p13_genomic.gff.gz.tbi`.

## Preparing the SNPs

This script will download the 1000 genomes SNPs and their index.

```$bash
wget ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/ALL.wgs.phase1_release_v3.20101123.snps_indels_sv.sites.vcf.gz
wget ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20110521/ALL.wgs.phase1_release_v3.20101123.snps_indels_sv.sites.vcf.gz.tbi
```

The files needed by the pipeline are `ALL.wgs.phase1_release_v3.20101123.snps_indels_sv.sites.vcf.gz` and `ALL.wgs.phase1_release_v3.20101123.snps_indels_sv.sites.vcf.gz.tbi`.

## Preparing the panel design

This script can be used to prepare the panel design for the pipeline. Please replace `<filename>` with the name of the panel design file.

```$bash
bgzip <filename>
tabix <filename>.gz
```
