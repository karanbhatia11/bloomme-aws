import React, { useState, useCallback } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon, CheckCircle } from 'lucide-react';
import api from '../api/axios';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mode, setMode] = useState<'upload' | 'url'>(value && !value.startsWith('/uploads/') ? 'url' : 'upload');

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const fullUrl = `http://localhost:5000${res.data.imageUrl}`;
            onChange(fullUrl);
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, []);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="image-upload-container mt-2">
            {label && <label className="form-label">{label}</label>}

            <div className="upload-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button
                    type="button"
                    className={`control-btn ${mode === 'upload' ? 'active' : ''}`}
                    onClick={() => setMode('upload')}
                    style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                >
                    <Upload size={14} /> Upload File
                </button>
                <button
                    type="button"
                    className={`control-btn ${mode === 'url' ? 'active' : ''}`}
                    onClick={() => setMode('url')}
                    style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                >
                    <LinkIcon size={14} /> Image URL
                </button>
            </div>

            {mode === 'upload' ? (
                <div
                    className={`drop-zone ${isDragging ? 'dragging' : ''} ${value ? 'has-value' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    style={{
                        border: '2px dashed #ddd',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center',
                        background: isDragging ? 'rgba(79, 121, 66, 0.05)' : 'white',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                    onClick={() => document.getElementById(`file-input-${label}`)?.click()}
                >
                    <input
                        type="file"
                        id={`file-input-${label}`}
                        hidden
                        onChange={onFileSelect}
                        accept="image/*"
                    />

                    {uploading ? (
                        <div className="upload-loading">
                            <div className="spinner"></div>
                            <p>Uploading...</p>
                        </div>
                    ) : value ? (
                        <div className="preview-container" style={{ position: 'relative' }}>
                            <img src={value} alt="Preview" style={{ maxHeight: '120px', borderRadius: '8px' }} />
                            <button
                                className="remove-img"
                                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                                style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'white', border: '1px solid #ddd', borderRadius: '50%', cursor: 'pointer' }}
                            >
                                <X size={16} />
                            </button>
                            <div className="success-badge" style={{ marginTop: '5px', color: 'var(--primary-green)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                <CheckCircle size={14} /> Uploaded Successfully
                            </div>
                        </div>
                    ) : (
                        <div className="upload-prompt">
                            <ImageIcon size={32} color="#888" />
                            <p style={{ margin: '10px 0 5px', fontSize: '0.9rem' }}>Drag & drop image here</p>
                            <span style={{ fontSize: '0.75rem', color: '#888' }}>or click to browse</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="url-input-zone">
                    <input
                        type="text"
                        placeholder="Paste image URL here..."
                        className="form-input"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {value && (
                        <div className="mt-2 text-center">
                            <img src={value} alt="Preview" style={{ maxHeight: '80px', borderRadius: '8px' }} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
