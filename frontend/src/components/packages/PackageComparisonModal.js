import React from 'react';
import './PackageComparisonModal.css';

const PackageComparisonModal = ({ isOpen, onClose, packages }) => {
  if (!isOpen) return null;

  const maxPackages = packages.slice(0, 3);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return num.toLocaleString();
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getPackageValue = (pkg, field) => {
    switch (field) {
      case 'name':
        return pkg?.name || 'N/A';
      case 'version':
        return pkg?.version || 'N/A';
      case 'description':
        return pkg?.description || 'N/A';
      case 'author':
        return pkg?.author?.name || pkg?.author || 'N/A';
      case 'license':
        return pkg?.license || 'N/A';
      case 'downloads':
        return formatNumber(pkg?.downloads);
      case 'size':
        return formatSize(pkg?.size);
      case 'lastUpdated':
        return formatDate(pkg?.lastUpdated);
      case 'dependencies':
        return pkg?.dependencies ? Object.keys(pkg.dependencies).length : 0;
      case 'repository':
        return pkg?.repository?.url || pkg?.repository || 'N/A';
      case 'homepage':
        return pkg?.homepage || 'N/A';
      default:
        return 'N/A';
    }
  };

  const comparisonFields = [
    { key: 'name', label: 'Package Name' },
    { key: 'version', label: 'Version' },
    { key: 'description', label: 'Description' },
    { key: 'author', label: 'Author' },
    { key: 'license', label: 'License' },
    { key: 'downloads', label: 'Weekly Downloads' },
    { key: 'size', label: 'Package Size' },
    { key: 'lastUpdated', label: 'Last Updated' },
    { key: 'dependencies', label: 'Dependencies Count' },
    { key: 'repository', label: 'Repository' },
    { key: 'homepage', label: 'Homepage' }
  ];

  return (
    <div className="package-comparison-modal-overlay" onClick={onClose}>
      <div className="package-comparison-modal" onClick={(e) => e.stopPropagation()}>
        <div className="package-comparison-modal-header">
          <h2>Package Comparison</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="package-comparison-content">
          {maxPackages.length === 0 ? (
            <div className="no-packages-message">
              No packages selected for comparison
            </div>
          ) : (
            <div className="comparison-table-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="field-header">Property</th>
                    {maxPackages.map((pkg, index) => (
                      <th key={index} className="package-header">
                        {pkg?.name || `Package ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFields.map((field) => (
                    <tr key={field.key} className="comparison-row">
                      <td className="field-label">{field.label}</td>
                      {maxPackages.map((pkg, index) => (
                        <td key={index} className="package-value">
                          {field.key === 'description' ? (
                            <div className="description-cell" title={getPackageValue(pkg, field.key)}>
                              {getPackageValue(pkg, field.key)}
                            </div>
                          ) : field.key === 'repository' || field.key === 'homepage' ? (
                            getPackageValue(pkg, field.key) !== 'N/A' ? (
                              <a 
                                href={getPackageValue(pkg, field.key)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="package-link"
                              >
                                View
                              </a>
                            ) : (
                              'N/A'
                            )
                          ) : (
                            getPackageValue(pkg, field.key)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="package-comparison-modal-footer">
          <button className="close-modal-button" onClick={onClose}>
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageComparisonModal;