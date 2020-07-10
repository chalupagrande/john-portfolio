class ImageAdapter extends GCSAdapter {
    async save({ stream, filename, mimetype, encoding, id }) {
        const baseName = path.basename(filename)
        const nowtime = moment(new Date()).format("YYYYMMDDhhmmss");
        let _meta = {}
        let ext = baseName.split(".")[1]
        console.log("GOT FILENAME:", filename) // This happened before hook resolveInput
        stream.pipe(fs.createWriteStream("./server_local_tmp.jpg"))
        try {
            for (const key in resizeTarget) {
                const resized_filename = `${nowtime}-${id}-${key}.${ext}`
                switch (key) {
                    case 'tiny':
                        url.urlTinySized = `${urlBase}${this.gcsDir}${resized_filename}`
                    case 'mobile':
                        url.urlMobileSized = `${urlBase}${this.gcsDir}${resized_filename}`
                    case 'tablet':
                        url.urlTabletSized = `${urlBase}${this.gcsDir}${resized_filename}`
                    case 'desktop':
                        url.urlDesktopSized = `${urlBase}${this.gcsDir}${resized_filename}`
                }
                const file = this.bucket.file(`${this.gcsDir}${resized_filename}`) //get the upload path
                const write = file.createWriteStream(this.getOptions(resized_filename));
                stream.pipe(im().resize(`${resizeTarget[key].width}x${resizeTarget[key].height}`)).pipe(write) //resize and upload
                console.log(`${resized_filename} SAVE TO GCS COMPLETED`)
            }
            this.saveOriginalSizedImage(nowtime, id, ext, stream, url);
        }
        catch (err) { console.log(err) }
        return { id, filename, _meta }
    }