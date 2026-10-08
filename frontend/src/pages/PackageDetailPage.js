import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Breadcrumbs, 
  Box, 
  Chip, 
  Button, 
  CircularProgress, 
  Alert,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  TabPanel
} from '@mui/material';
import { 
  ArrowBack, 
  Download, 
  Star, 
  Bug, 
  Security, 
  Update,
  GitHub,
  Language,
  Schedule
} from '@mui/icons-material';

const PackageDetailPage = () => {
  const { packageName } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchPackageDetails();
  }, [packageName]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/packages/${packageName}`);
      if (!response.ok) {
        throw new Error('Package not found');
      }
      const data = await response.json();
      setPackageData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')} 
          sx={{ mt: 2 }}
        >
          Back to Packages
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link 
          to="/" 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Packages
        </Link>
        <Typography color="text.primary">{packageName}</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/')} 
        sx={{ mb: 3 }}
      >
        Back to Packages
      </Button>

      {/* Package Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom>
              {packageData?.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {packageData?.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip 
                label={`v${packageData?.version}`} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={packageData?.license} 
                color="secondary" 
                variant="outlined" 
              />
              {packageData?.keywords?.map((keyword, index) => (
                <Chip 
                  key={index} 
                  label={keyword} 
                  variant="outlined" 
                  size="small" 
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button 
              variant="contained" 
              startIcon={<Download />} 
              size="large"
              sx={{ mb: 2, display: 'block', ml: 'auto' }}
            >
              Install Package
            </Button>
            <Typography variant="body2" color="text.secondary">
              npm install {packageData?.name}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Package Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Download color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{packageData?.downloads?.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Weekly Downloads</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Star color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{packageData?.stars}</Typography>
              <Typography variant="body2" color="text.secondary">GitHub Stars</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{formatDate(packageData?.lastPublished)}</Typography>
              <Typography variant="body2" color="text.secondary">Last Published</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Update color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">{formatFileSize(packageData?.size)}</Typography>
              <Typography variant="body2" color="text.secondary">Package Size</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="package details tabs"
        >
          <Tab label="README" />
          <Tab label="Dependencies" />
          <Tab label="Versions" />
          <Tab label="Security" />
        </Tabs>

        {/* README Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>README</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box 
              sx={{ 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'monospace',
                backgroundColor: '#f5f5f5',
                p: 2,
                borderRadius: 1
              }}
            >
              {packageData?.readme || 'No README available for this package.'}
            </Box>
          </Box>
        )}

        {/* Dependencies Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Dependencies</Typography>
            <Divider sx={{ mb: 2 }} />
            {packageData?.dependencies && Object.keys(packageData.dependencies).length > 0 ? (
              <List>
                {Object.entries(packageData.dependencies).map(([dep, version]) => (
                  <ListItem key={dep} divider>
                    <ListItemText 
                      primary={dep} 
                      secondary={version} 
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No dependencies found.</Typography>
            )}
          </Box>
        )}

        {/* Versions Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Version History</Typography>
            <Divider sx={{ mb: 2 }} />
            {packageData?.versions ? (
              <List>
                {packageData.versions.map((version, index) => (
                  <ListItem key={index} divider>
                    <ListItemText 
                      primary={`v${version.number}`}
                      secondary={`Published ${formatDate(version.publishedAt)}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No version history available.</Typography>
            )}
          </Box>
        )}

        {/* Security Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Security Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Security color="success" sx={{ mb: 1 }} />
                    <Typography variant="subtitle1">Vulnerabilities</Typography>
                    <Typography variant="h4" color="success.main">
                      {packageData?.vulnerabilities || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Bug color="warning" sx={{ mb: 1 }} />
                    <Typography variant="subtitle1">Security Score</Typography>
                    <Typography variant="h4" color="warning.main">
                      {packageData?.securityScore || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Additional Links */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Links</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {packageData?.repository && (
            <Button 
              startIcon={<GitHub />} 
              variant="outlined"
              href={packageData.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              Repository
            </Button>
          )}
          {packageData?.homepage && (
            <Button 
              startIcon={<Language />} 
              variant="outlined"
              href={packageData.homepage}
              target="_blank"
              rel="noopener noreferrer"
            >
              Homepage
            </Button>
          )}
          <Button 
            variant="outlined"
            href={`https://npmjs.com/package/${packageName}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            NPM Registry
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PackageDetailPage;