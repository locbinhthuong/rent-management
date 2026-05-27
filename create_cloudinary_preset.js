const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dzwohq6wl', 
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '757456977598171', 
  api_secret: process.env.CLOUDINARY_API_SECRET || 'C3_PqIjfS73SixZvIQJvmcsB6mI'
});

async function updatePreset() {
    try {
        const updateResult = await cloudinary.api.update_upload_preset("rent_management_preset", {
            unsigned: true,
            folder: "rent_management"
        });
        console.log("Upload preset updated to unsigned successfully:", updateResult);
    } catch(updateErr) {
        console.error("Error updating preset:", updateErr);
    }
}

updatePreset();
