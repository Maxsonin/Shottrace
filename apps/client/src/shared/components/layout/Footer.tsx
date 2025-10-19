import { Box, Typography, Link, IconButton, Stack } from '@mui/material';
import { Instagram, Facebook, YouTube, X } from '@mui/icons-material';
import { FaTiktok } from 'react-icons/fa6';

export default function Footer() {
  const socials = [
    { name: 'Instagram', href: '#', icon: <Instagram />, color: '#E1306C' },
    { name: 'X / Twitter', href: '#', icon: <X />, color: '#000000' },
    { name: 'Facebook', href: '#', icon: <Facebook />, color: '#1877F2' },
    { name: 'TikTok', href: '#', icon: <FaTiktok />, color: '#ff0050' },
    { name: 'YouTube', href: '#', icon: <YouTube />, color: '#FF0000' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        px: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          maxWidth: 950,
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Stack direction="row" spacing={2} mb={1}>
            {[
              'About',
              'Pro',
              'News',
              'Apps',
              'Help',
              'Terms',
              'API',
              'Contact',
            ].map((label) => (
              <Link key={label} href="#" underline="hover">
                {label}
              </Link>
            ))}
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
          >
            © Shottrace. Pet project made by Maxim Lesko. Film data from TMDB.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          {socials.map((social) => (
            <IconButton
              key={social.name}
              href={social.href}
              aria-label={social.name}
              sx={{
                color: 'text.secondary',
                transition: 'color 0.3s',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: social.color,
                },
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
