import {uploadImage} from "@/axios/axios";

export const uploadAdapter = (loader, bizId) => {
    return {
        upload: () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const file = await loader.file
                    const uploadedFileKey = await uploadImage(bizId, file);
                    const imageUrl = `http://kayja-img.oss-cn-shenzhen.aliyuncs.com/${uploadedFileKey}`
                    resolve({
                        default: imageUrl,
                    })
                } catch (err) {
                    reject("Failed to upload")
                }
            })
        },
        abort: () => {}
    }
}
export class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader
    }
    // Starts the upload process.
    async upload() {
        // Loader's file is a promise that resolves to a File instance.
        const file = await this.loader.file;
        const biz_id = "2000"; // Define your biz_id here

        try {
            // Use your existing upload logic here.
            const uploadedFileKey = await uploadImage(biz_id, file);
            if (uploadedFileKey) {
                // Construct the URL to the uploaded file based on the response
                // This URL will be used in the editor to display the image.
                const imageUrl = `http://kayja-img.oss-cn-shenzhen.aliyuncs.com/${uploadedFileKey}`;

                // The `upload()` method should resolve with an object containing URLs
                // to the uploaded file, in the format expected by CKEditor.
                return {
                    default: imageUrl
                };
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            throw error;
        }
    }

    // Aborts the upload process.
    abort() {
        // This function should be defined to abort the upload process
        // if the user cancels it, for example.
    }
}