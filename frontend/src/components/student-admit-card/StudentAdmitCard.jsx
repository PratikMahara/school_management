import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import admitCardImage from '../../../public/images/uploaded/complaints/1749284265427-699445249-Screenshot_2025-05-27_234210.png';

const AdmitCard = () => {

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = admitCardImage;
    link.download = 'admit_card.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        borderRadius: 2,
        textAlign: 'center',
        p: 2,
      }}
    >
      <CardContent>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Here is your admit card. Click the button below to download it.
        </Typography>

        {admitCardImage && (
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'center',
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                boxShadow: 1,
              },
            }}
          >
            <img src={admitCardImage} alt="Admit Card Preview" />
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
          sx={{
            mt: 2,
            py: 1.2,
            px: 3,
            fontSize: '1rem',
            textTransform: 'none',
          }}
        >
          Download Admit Card
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdmitCard;