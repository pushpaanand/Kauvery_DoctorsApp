import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, Button, List, Badge, Divider, Text, Surface } from 'react-native-paper';
import { theme } from '../../utils/theme';

export default function ReviewerDashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('proposals');

  // Mock data with more details
  const documentsForReview = {
    proposals: [
      {
        id: '1',
        title: 'New Insurance Proposal',
        company: 'ABC Insurance',
        submittedDate: '2024-03-20',
        status: 'pending',
        type: 'proposal',
        details: {
          proposedDiscount: '15%',
          coverageType: 'Comprehensive',
          unitName: 'Cardiology',
          expectedVolume: '1000 patients/year',
          attachments: ['proposal.pdf', 'terms.pdf']
        }
      },
      {
        id: '2',
        title: 'Updated Insurance Terms',
        company: 'XYZ Healthcare',
        submittedDate: '2024-03-19',
        status: 'pending',
        type: 'proposal',
        details: {
          proposedDiscount: '12%',
          coverageType: 'Basic',
          unitName: 'General Medicine',
          expectedVolume: '800 patients/year',
          attachments: ['updated_terms.pdf']
        }
      }
    ],
    negotiations: [
      {
        id: '3',
        title: 'Rate Negotiation',
        company: 'DEF Insurance',
        submittedDate: '2024-03-18',
        status: 'pending',
        type: 'negotiation',
        details: {
          currentRate: '₹950,000',
          proposedRate: '₹1,000,000',
          counterOffer: '₹980,000',
          validityPeriod: '2 years',
          negotiationRounds: 2,
          lastUpdated: '2024-03-17'
        }
      }
    ],
    mous: [
      {
        id: '4',
        title: 'MoU Document',
        company: 'GHI Healthcare',
        submittedDate: '2024-03-17',
        status: 'pending',
        type: 'mou',
        details: {
          startDate: '2024-04-01',
          endDate: '2026-03-31',
          discountRate: '18%',
          specialTerms: 'Includes emergency services',
          attachments: ['mou_draft.pdf', 'appendix.pdf']
        }
      }
    ],
    tariffs: [
      {
        id: '5',
        title: 'Tariff Renewal',
        company: 'JKL Insurance',
        submittedDate: '2024-03-16',
        status: 'pending',
        type: 'tariff',
        details: {
          currentTariff: '₹850,000',
          proposedTariff: '₹900,000',
          effectiveDate: '2024-04-01',
          changes: ['Updated room rates', 'New surgical packages'],
          attachments: ['tariff_comparison.pdf']
        }
      }
    ]
  };

  // Mock data for counts
  const counts = {
    totalActive: Object.values(documentsForReview).reduce(
      (acc, curr) => acc + (curr?.length || 0), 
      0
    ),
    proposals: documentsForReview.proposals?.length || 0,
    negotiations: documentsForReview.negotiations?.length || 0,
    mous: documentsForReview.mous?.length || 0,
    tariffs: documentsForReview.tariffs?.length || 0,
    expiringSoon: 2
  };

  const handleDocumentPress = (document) => {
    // Ensure we're passing the correct data structure
    const reviewData = {
      type: document.type,
      data: {
        id: document.id,
        title: document.title,
        company: document.company,
        submittedDate: document.submittedDate,
        status: document.status,
        details: document.details // This is already properly structured
      }
    };

    switch (document.type) {
      case 'proposal':
      case 'mou':
      case 'tariff':
        navigation.navigate('DocumentReview', reviewData);
        break;
      case 'negotiation':
        navigation.navigate('NegotiationReview', { 
          negotiationData: reviewData.data 
        });
        break;
    }
  };

  const renderDocumentList = (documents) => {
    return documents.map((doc) => (
      <Card key={doc.id} style={styles.documentCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title>{doc.title || 'Untitled'}</Title>
            <Badge style={[styles.badge, { backgroundColor: '#ff4444' }]}>
              New
            </Badge>
          </View>
          
          <Text style={styles.subtitle}>
            {doc.company || 'Unknown'} - Submitted: {doc.submittedDate || 'N/A'}
          </Text>
          
          <Surface style={styles.detailsSurface}>
            {doc.type === 'proposal' && doc.details && (
              <>
                <Text style={styles.detailsText}>
                  Proposed Discount: {doc.details.proposedDiscount || 'N/A'}
                </Text>
                <Text style={styles.detailsText}>
                  Coverage Type: {doc.details.coverageType || 'N/A'}
                </Text>
                <Text style={styles.detailsText}>
                  Unit: {doc.details.unitName || 'N/A'}
                </Text>
              </>
            )}
            
            {doc.type === 'negotiation' && doc.details && (
              <>
                <Text style={styles.detailsText}>
                  Current Rate: {doc.details.currentRate || 'N/A'}
                </Text>
                <Text style={styles.detailsText}>
                  Proposed Rate: {doc.details.proposedRate || 'N/A'}
                </Text>
                <Text style={styles.detailsText}>
                  Counter Offer: {doc.details.counterOffer || 'N/A'}
                </Text>
              </>
            )}

            {doc.type === 'mou' && doc.details && (
              <>
                <Text style={styles.detailsText}>
                  Start Date: {doc.details.startDate || 'N/A'}
                </Text>
                <Text style={styles.detailsText}>
                  End Date: {doc.details.endDate || 'N/A'}
                </Text>
                <Text style={styles.detailsText}>
                  Discount Rate: {doc.details.discountRate || 'N/A'}
                </Text>
              </>
            )}

            {doc.type === 'tariff' && doc.details && (
              <>
                <Text style={styles.detailsText}>
                  Current Tariff: {doc.details.currentTariff || 'N/A'}
                </Text>
                <Text style={styles.detailsText}>
                  Proposed Tariff: {doc.details.proposedTariff || 'N/A'}
                </Text>
                <Text style={styles.detailsText}>
                  Effective Date: {doc.details.effectiveDate || 'N/A'}
                </Text>
              </>
            )}

            {doc.details?.attachments && doc.details.attachments.length > 0 && (
              <View style={styles.attachments}>
                <Text style={styles.attachmentTitle}>Attachments:</Text>
                {doc.details.attachments.map((file, index) => (
                  <Text key={index} style={styles.attachmentText}>
                    • {file}
                  </Text>
                ))}
              </View>
            )}
          </Surface>

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => handleDocumentPress(doc)}
              style={styles.reviewButton}
              labelStyle={{ color: theme.colors.buttonText }}
            >
              Review
            </Button>
          </View>
        </Card.Content>
      </Card>
    ));
  };

  const renderCountsCard = () => (
    <View style={styles.countsContainer}>
      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{counts.totalActive}</Title>
          <Text style={styles.countLabel}>Total Active</Text>
        </Card.Content>
      </Card>

      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{counts.proposals}</Title>
          <Text style={styles.countLabel}>Proposals</Text>
        </Card.Content>
      </Card>

      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{counts.negotiations}</Title>
          <Text style={styles.countLabel}>Negotiations</Text>
        </Card.Content>
      </Card>

      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{counts.expiringSoon}</Title>
          <Text style={styles.countLabel}>Expiring Soon</Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderCountsCard()}
      
      <View style={styles.tabButtons}>
        <Button
          mode={activeTab === 'proposals' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('proposals')}
          style={styles.tabButton}
          labelStyle={activeTab === 'proposals' 
            ? { color: theme.colors.buttonText }  // White text when active
            : { color: theme.colors.primary }     // Pink text when inactive
          }
        >
          Proposals ({documentsForReview.proposals.length})
        </Button>
        <Button
          mode={activeTab === 'negotiations' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('negotiations')}
          style={styles.tabButton}
          labelStyle={activeTab === 'negotiations' 
            ? { color: theme.colors.buttonText }  // White text when active
            : { color: theme.colors.primary }     // Pink text when inactive
          }
        >
          Negotiations ({documentsForReview.negotiations.length})
        </Button>
        <Button
          mode={activeTab === 'mous' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('mous')}
          style={styles.tabButton}
          labelStyle={activeTab === 'mous' 
            ? { color: theme.colors.buttonText }  // White text when active
            : { color: theme.colors.primary }     // Pink text when inactive
          }
        >
          MoU ({documentsForReview.mous.length})
        </Button>
        <Button
          mode={activeTab === 'tariffs' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('tariffs')}
          style={styles.tabButton}
          labelStyle={activeTab === 'tariffs' 
            ? { color: theme.colors.buttonText }  // White text when active
            : { color: theme.colors.primary }     // Pink text when inactive
          }
        >
          Tariff ({documentsForReview.tariffs.length})
        </Button>
      </View>

      {renderDocumentList(documentsForReview[activeTab] || [])}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,  // Using theme background color
  },
  tabButtons: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tabButton: {
    width: '48%',
    marginBottom: 16,
  },
  documentCard: {
    margin: 16,
    backgroundColor: theme.colors.surface,  // Using theme surface color
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.subtext,  // Using theme subtext color
    marginBottom: 16,
  },
  detailsSurface: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.background,  // Using theme background color
    marginVertical: 8,
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 8,
  },
  attachments: {
    marginTop: 8,
  },
  attachmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  attachmentText: {
    fontSize: 14,
    color: theme.colors.subtext,  // Using theme subtext color
    marginLeft: 8,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  reviewButton: {
    backgroundColor: theme.colors.primary,
    minWidth: 120,
  },
  badge: {
    alignSelf: 'center',
  },
  countsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  countCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: theme.colors.surface,  // Using theme surface color
    elevation: 4,
  },
  countNumber: {
    fontSize: 24,
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  countLabel: {
    textAlign: 'center',
    color: theme.colors.subtext,  // Using theme subtext color
  },
}); 