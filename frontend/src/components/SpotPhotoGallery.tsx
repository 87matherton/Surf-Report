import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ImageList,
  ImageListItem,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';

interface SpotPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  photographer?: string;
  tags?: string[];
}

interface SpotPhotoGalleryProps {
  spotName: string;
  photos: SpotPhoto[];
}

const SpotPhotoGallery: React.FC<SpotPhotoGalleryProps> = ({ spotName, photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<SpotPhoto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePhotoClick = (photo: SpotPhoto) => {
    setSelectedPhoto(photo);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPhoto(null);
  };

  if (!photos || photos.length === 0) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            📸 Photo Gallery - {spotName}
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              py: 4,
              color: 'text.secondary'
            }}
          >
            <PhotoCameraIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2" textAlign="center">
              Photos coming soon! We're working on adding beautiful images of this surf spot.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            📸 Photo Gallery - {spotName}
          </Typography>
          
          <ImageList 
            variant="masonry" 
            cols={isMobile ? 2 : 3} 
            gap={8}
            sx={{ mb: 0 }}
          >
            {photos.map((photo) => (
              <ImageListItem 
                key={photo.id}
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '&:hover': {
                    '& .photo-overlay': {
                      opacity: 1
                    },
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
                onClick={() => handlePhotoClick(photo)}
              >
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    style={{
                      borderRadius: '8px',
                      display: 'block',
                      width: '100%',
                      height: 'auto'
                    }}
                  />
                  <Box
                    className="photo-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.2s ease-in-out',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 1,
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {photo.title}
                    </Typography>
                    {photo.photographer && (
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        by {photo.photographer}
                      </Typography>
                    )}
                    <ZoomInIcon sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      color: 'white',
                      opacity: 0.8
                    }} />
                  </Box>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        </CardContent>
      </Card>

      {/* Photo Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { 
            bgcolor: 'rgba(0,0,0,0.9)',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'white',
          pb: 1
        }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {selectedPhoto?.title}
            </Typography>
            {selectedPhoto?.photographer && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                📷 {selectedPhoto.photographer}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          {selectedPhoto && (
            <Box sx={{ maxWidth: '100%', textAlign: 'center' }}>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
              {selectedPhoto.description && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    mt: 2,
                    maxWidth: 600,
                    mx: 'auto'
                  }}
                >
                  {selectedPhoto.description}
                </Typography>
              )}
              {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {selectedPhoto.tags.map((tag, index) => (
                    <Chip 
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpotPhotoGallery; 