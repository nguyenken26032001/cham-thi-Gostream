import axios from 'axios';
const upload = async (file) => {
    const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_APP_YOUR_UPLOAD_PRESET);
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.secure_url;
};
export { upload };
